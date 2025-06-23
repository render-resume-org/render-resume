import { getEmailTemplate, getReactEmailTemplate } from '@/lib/email-templates';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = "edge";

interface SendWaitlistWelcomeRequest {
  email: string;
  userName?: string;
}

// Email sending function using Resend SDK
async function sendEmail(to: string, subject: string, html: string, text: string, reactComponent?: React.ReactElement) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;
  
  // Validate required email configuration
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY environment variable is required');
  }
  
  if (!fromEmail) {
    throw new Error('FROM_EMAIL environment variable is required');
  }

  // Initialize Resend with the API key
  const resend = new Resend(resendApiKey);
  
  console.log('📧 [Send Waitlist Welcome] Sending via Resend to:', to);
  
  const emailPayload: {
    from: string;
    to: string[];
    subject: string;
    text: string;
    html?: string;
    react?: React.ReactElement;
  } = {
    from: fromEmail,
    to: [to],
    subject,
    text,
  };

  // Use React component if available, otherwise use HTML
  if (reactComponent) {
    emailPayload.react = reactComponent;
    console.log('📧 [Send Waitlist Welcome] Using React template');
  } else {
    emailPayload.html = html;
    console.log('📧 [Send Waitlist Welcome] Using HTML template');
  }

  const { data, error } = await resend.emails.send(emailPayload);

  if (error) {
    throw new Error(`Resend API error: ${error.message}`);
  }
  
  console.log('✅ [Send Waitlist Welcome] Successfully sent via Resend:', data?.id);
  return { id: data?.id, provider: 'resend' };
}

export async function POST(request: NextRequest) {
  console.log('🎉 [Send Waitlist Welcome] API called');
  
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: SendWaitlistWelcomeRequest = await request.json();
    const { email, userName } = body;
    
    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (authUser.email !== email) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }
    
    // Check if user already has welcome email sent
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('welcome_email_sent')
      .eq('id', authUser.id)
      .single();
    
    if (userError && userError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking user welcome email status:', userError);
      return NextResponse.json(
        { error: 'Failed to check user status' },
        { status: 500 }
      );
    }
    
    // If user exists and already received welcome email, don't send again
    if (existingUser && existingUser.welcome_email_sent) {
      console.log('⚠️ [Send Waitlist Welcome] Welcome email already sent for user:', authUser.id);
      return NextResponse.json({
        success: true,
        message: 'Welcome email already sent',
        alreadySent: true
      }, { status: 200 });
    }
    
    console.log('📧 [Send Waitlist Welcome] Processing request for:', email);
    
    // Extract user name from email if not provided
    const finalUserName = userName || email.split('@')[0];
    
    // Try to get React email template first (for better rendering)
    const reactTemplate = await getReactEmailTemplate(
      'waitlist_welcome',
      '', // No token needed for welcome email
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      email,
      finalUserName
    );
    
    // Get email template (fallback to HTML)
    const emailTemplate = getEmailTemplate(
      'waitlist_welcome',
      '', // No token needed for welcome email
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      email,
      finalUserName
    );
    
    // Send the email (with React component if available)
    const emailResult = await sendEmail(
      email,
      emailTemplate.subject,
      emailTemplate.html,
      emailTemplate.text,
      reactTemplate || undefined
    );
    
    // Update the welcome_email_sent field after successful email sending
    const { error: updateError } = await supabase
      .from('users')
      .update({ welcome_email_sent: true })
      .eq('id', authUser.id);
    
    if (updateError) {
      console.error('⚠️ [Send Waitlist Welcome] Failed to update welcome_email_sent flag:', updateError);
      // Don't fail the request if email was sent successfully but database update failed
    } else {
      console.log('✅ [Send Waitlist Welcome] Updated welcome_email_sent flag for user:', authUser.id);
    }
    
    console.log('✅ [Send Waitlist Welcome] Email sent successfully:', {
      email,
      emailId: emailResult.id,
      provider: emailResult.provider,
      templateType: reactTemplate ? 'react' : 'html'
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Waitlist welcome email sent successfully',
      emailId: emailResult.id,
      provider: emailResult.provider,
      templateType: reactTemplate ? 'react' : 'html'
    }, { status: 200 });
    
  } catch (error) {
    console.error('❌ [Send Waitlist Welcome] Error:', error);
    
    // Return appropriate error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        error: 'Failed to send waitlist welcome email',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Send Waitlist Welcome API is running',
    timestamp: new Date().toISOString()
  });
} 