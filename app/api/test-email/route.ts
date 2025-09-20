import { getEmailTemplate } from '@/features/content/lib/email-templates';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend (only if API key is available)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// This endpoint is for development testing only
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'signup';
  const token = searchParams.get('token') || '123456';
  const email = searchParams.get('email') || 'test@example.com';
  const redirectTo = searchParams.get('redirect') || 'http://localhost:3000/callback';
  const format = searchParams.get('format') || 'html'; // 'html' or 'text'

  try {
    const template = getEmailTemplate(action, token, redirectTo, email, 'Test User');

    if (format === 'text') {
      return new Response(template.text, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    if (format === 'json') {
      return NextResponse.json({
        subject: template.subject,
        html: template.html,
        text: template.text,
        metadata: {
          action,
          token,
          email,
          redirectTo
        }
      });
    }

    // Return HTML by default
    return new Response(template.html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to generate template',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const {
      action = 'signup',
      token = '123456',
      email = 'test@example.com',
      redirectTo = 'http://localhost:3000/callback',
      userName = 'Test User'
    } = body;

    const template = getEmailTemplate(action, token, redirectTo, email, userName);

    // Test email sending if providers are configured
    const fromEmail = process.env.FROM_EMAIL;

    if (resend && fromEmail && body.sendTest) {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: `[TEST] ${template.subject}`,
        html: template.html,
        text: template.text,
      });

      if (error) {
        throw new Error(`Resend API error: ${error.message}`);
      }

      return NextResponse.json({
        message: 'Test email sent successfully',
        template: {
          subject: template.subject,
          html: template.html.substring(0, 200) + '...',
          text: template.text.substring(0, 200) + '...'
        },
        emailResult: { id: data?.id, provider: 'resend' }
      });
    }

    return NextResponse.json({
      message: 'Template generated successfully',
      template: {
        subject: template.subject,
        html: template.html.substring(0, 200) + '...',
        text: template.text.substring(0, 200) + '...'
      },
      note: body.sendTest 
        ? 'Missing RESEND_API_KEY or FROM_EMAIL environment variables for sending test email'
        : 'Add "sendTest": true to the request body to send a test email'
    });

  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to process test request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 