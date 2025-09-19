import { getActivityStats, getRecentActivityLogs, getUserActivityLogs } from '@/services/actions/activity';
import { requireAuthentication } from '@/features/auth/services/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuthentication();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    switch (type) {
      case 'recent':
        const recentResult = await getRecentActivityLogs();
        if (recentResult.error) {
          return NextResponse.json(
            { error: recentResult.error },
            { status: 500 }
          );
        }
        return NextResponse.json({ logs: recentResult.logs });

      case 'stats':
        const statsResult = await getActivityStats();
        if (statsResult.error) {
          return NextResponse.json(
            { error: statsResult.error },
            { status: 500 }
          );
        }
        return NextResponse.json({
          totalActions: statsResult.totalActions,
          actionsByType: statsResult.actionsByType
        });

      default:
        // Get paginated logs
        const result = await getUserActivityLogs(page, limit);
        if (result.error) {
          return NextResponse.json(
            { error: result.error },
            { status: 500 }
          );
        }
        return NextResponse.json({
          logs: result.logs,
          totalCount: result.totalCount,
          hasMore: result.hasMore,
          page,
          limit
        });
    }
  } catch (error) {
    console.error('Error in activity logs API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 