import { Template, TemplateData } from '../interfaces/template.interface';
import { isValidUrl, escapeHtml } from 'src/common/utils';

export function getAccountApprovedTemplate(data: TemplateData): Template {
  const { recipientName, unitNumber, approvedAt, actionUrl } = data;

  // Escape user-controlled values to prevent XSS attacks
  const escapedRecipientName = escapeHtml(recipientName);
  const escapedUnitNumber = escapeHtml(unitNumber);

  const formattedDate = approvedAt
    ? new Date(approvedAt).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : '';

  const validActionUrl = isValidUrl(actionUrl) ? actionUrl : null;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { padding: 30px; background-color: #f9f9f9; border-radius: 0 0 12px 12px; }
        .success-icon { font-size: 48px; margin-bottom: 20px; }
        .info-card { background-color: white; padding: 25px; border-radius: 10px; margin: 25px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin-top: 10px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
        .highlight { background-color: #f0fdf4; padding: 4px 8px; border-radius: 4px; color: #059669; font-weight: 500; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="success-icon">🎉</div>
          <h1>Account Approved!</h1>
          <p>Welcome to our community portal</p>
        </div>
        <div class="content">
          <p>Dear <strong>${escapedRecipientName}</strong>,</p>
          
          <p>We are pleased to inform you that your account registration has been <span class="highlight">successfully approved</span>!</p>
          
          <div class="info-card">
            <h3 style="color: #059669; margin-top: 0;">Account Details:</h3>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;"><strong>Name:</strong></td>
                <td style="padding: 8px 0;">${escapedRecipientName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;"><strong>Unit Number:</strong></td>
                <td style="padding: 8px 0;">${escapedUnitNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;"><strong>Approved On:</strong></td>
                <td style="padding: 8px 0;">${formattedDate}</td>
              </tr>
            </table>
          </div>
          
          <p>You now have full access to all features of our community portal, including:</p>
          <ul style="padding-left: 20px;">
            <li>Parcel tracking and notifications</li>
            <li>Building announcements and updates</li>
            <li>Maintenance request submission</li>
            <li>Event calendar and RSVP</li>
            <li>Community directory</li>
          </ul>
          
          <div style="text-align: center; margin: 35px 0;">
            <p><strong>Get started by accessing your account:</strong></p>
            ${validActionUrl
      ? `
            <a href="${validActionUrl}" class="button" style="color: white;">Access Your Account</a>
            `
      : ''
    }
          </div>
          
          <div class="footer">
            <p><strong>Need Help?</strong></p>
            <p>If you have any questions or need assistance, please contact our support team at <a href="mailto:support@community.com" style="color: #059669;">support@community.com</a> or call (123) 456-7890.</p>
            <p style="margin-top: 20px; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    subject: `🎉 Account Approved - Welcome to Community Portal (Unit ${unitNumber})`,
    html,
    attachments: [],
  };
}
