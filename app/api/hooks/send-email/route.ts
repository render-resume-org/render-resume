import { getEmailTemplate, getReactEmailTemplate } from '@/services/email-templates';
import { createHash, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Types based on Supabase Auth Hook documentation
interface User {
  id: string;
  aud: string;
  role: string;
  email: string;
  phone: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
    [key: string]: unknown;
  };
  identities: Array<{
    identity_id: string;
    id: string;
    user_id: string;
    identity_data: {
      email: string;
      email_verified: boolean;
      phone_verified: boolean;
      sub: string;
    };
    provider: string;
    last_sign_in_at: string;
    created_at: string;
    updated_at: string;
    email: string;
  }>;
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

interface EmailData {
  token: string;
  token_hash: string;
  redirect_to: string;
  email_action_type: 'signup' | 'login' | 'recovery' | 'invite' | 'email_change_current' | 'email_change_new' | 'waitlist_welcome';
  site_url: string;
  token_new: string;
  token_hash_new: string;
}

interface SendEmailHookPayload {
  user: User;
  email_data: EmailData;
}

// Webhook signature verification
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = createHash('sha256')
      .update(payload + secret)
      .digest('hex');
    
    const providedSignature = signature.replace('sha256=', '');
    
    return timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(providedSignature)
    );
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

// Email sending function using Resend SDK only
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
  
  console.log('📧 [Send Email] Sending via Resend to:', to);
  
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
    console.log('📧 [Send Email] Using React template');
  } else {
    emailPayload.html = html;
    console.log('📧 [Send Email] Using HTML template');
  }

  const { data, error } = await resend.emails.send(emailPayload);

  if (error) {
    throw new Error(`Resend API error: ${error.message}`);
  }
  
  console.log('✅ [Send Email] Successfully sent via Resend:', data?.id);
  return { id: data?.id, provider: 'resend' };
}

// Enhanced logging function
function logEmailEvent(action: string, details: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 📧 ${action}:`, JSON.stringify(details, null, 2));
}

export async function POST(request: NextRequest) {
  console.log('🔔 [Send Email Hook] Webhook received');
  
  try {
    // Get raw body and headers
    const rawBody = await request.text();
    const signature = request.headers.get('x-supabase-signature');
    const webhookSecret = process.env.SEND_EMAIL_HOOK_SECRET;
    
    // Environment validation
    if (!webhookSecret) {
      console.error('❌ [Send Email Hook] SEND_EMAIL_HOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }
    
    // Signature verification
    if (!signature) {
      console.error('❌ [Send Email Hook] Missing webhook signature');
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 401 }
      );
    }
    
    if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      console.error('❌ [Send Email Hook] Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }
    
    // Parse the webhook payload
    const payload: SendEmailHookPayload = JSON.parse(rawBody);
    const { user, email_data } = payload;
    
    // Log the email event
    logEmailEvent('Email Hook Triggered', {
      userId: user.id,
      email: user.email,
      action: email_data.email_action_type,
      hasRedirect: !!email_data.redirect_to
    });
    
    // Extract user name from metadata if available
    const userName = (user.user_metadata?.full_name as string) || 
                    (user.user_metadata?.name as string) || 
                    user.email.split('@')[0] ||
                    'User';
    
    // Try to get React email template first (for better rendering)
    const reactTemplate = await getReactEmailTemplate(
      email_data.email_action_type,
      email_data.token,
      email_data.redirect_to,
      user.email,
      userName
    );
    
    // Get email template based on action type (fallback to HTML)
    const emailTemplate = getEmailTemplate(
      email_data.email_action_type,
      email_data.token,
      email_data.redirect_to,
      user.email,
      userName
    );
    
    // Send the email (with React component if available)
    const emailResult = await sendEmail(
      user.email,
      emailTemplate.subject,
      emailTemplate.html,
      emailTemplate.text,
      reactTemplate || undefined
    );
    
    // Log success
    logEmailEvent('Email Sent Successfully', {
      userId: user.id,
      email: user.email,
      action: email_data.email_action_type,
      provider: emailResult.provider || 'unknown',
      emailId: emailResult.id,
      templateType: reactTemplate ? 'react' : 'html'
    });
    
    return NextResponse.json({ 
      success: true,
      emailId: emailResult.id,
      provider: emailResult.provider,
      templateType: reactTemplate ? 'react' : 'html'
    }, { status: 200 });
    
  } catch (error) {
    console.error('❌ [Send Email Hook] Error processing webhook:', error);
    
    // Log the error
    logEmailEvent('Email Hook Error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  const status = {
    message: 'Send Email Hook endpoint is active',
    timestamp: new Date().toISOString(),
    providers: {
      resend: !!process.env.RESEND_API_KEY
    },
    environment: process.env.NODE_ENV
  };
  
  return NextResponse.json(status);
}

// Health check for monitoring
export async function HEAD() {
  return new Response(null, { status: 200 });
} 