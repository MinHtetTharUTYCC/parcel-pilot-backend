import { Template, TemplateData } from '../interfaces/template.interface';
import { isValidUrl, escapeHtml } from 'src/common/utils';

export function getAccountRejectedTemplate(data: TemplateData): Template {
  const { recipientName, unitNumber, rejectedAt, actionUrl } = data;

  // Escape user-controlled values to prevent XSS attacks
  const escapedRecipientName = escapeHtml(recipientName);
  const escapedUnitNumber = escapeHtml(unitNumber);

  const formattedDate = rejectedAt
    ? new Date(rejectedAt).toLocaleString('en-US', {
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
        .header { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { padding: 30px; background-color: #f9f9f9; border-radius: 0 0 12px 12px; }
        .icon { font-size: 48px; margin-bottom: 20px; }
        .info-card { background-color: white; padding: 25px; border-radius: 10px; margin: 25px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #EF4444; }
        .rejection-box { background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #fecaca; }
        .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
        .reason { background-color: #fef2f2; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 3px solid #EF4444; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="icon">⚠️</div>
          <h1>Account Registration Update</h1>
          <p>Important information regarding your application</p>
        </div>
        <div class="content">
          <p>Dear <strong>${escapedRecipientName}</strong>,</p>
          
          <p>Thank you for your interest in joining our community portal. After careful review, we regret to inform you that your account registration <strong>cannot be approved at this time</strong>.</p>
          
          <div class="info-card">
            <h3 style="color: #DC2626; margin-top: 0;">Application Details:</h3>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;"><strong>Applicant Name:</strong></td>
                <td style="padding: 8px 0;">${escapedRecipientName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;"><strong>Requested Unit:</strong></td>
                <td style="padding: 8px 0;">${escapedUnitNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;"><strong>Decision Date:</strong></td>
                <td style="padding: 8px 0;">${formattedDate}</td>
              </tr>
            </table>
          </div>
          
          <p>Common reasons for rejection include:</p>
          <ul style="padding-left: 20px;">
            <li>Incomplete or inaccurate information provided</li>
            <li>Documentation does not match requested unit</li>
            <li>Existing active account for the same unit</li>
            <li>Verification issues with provided documents</li>
            <li>Unit ownership/tenancy verification pending</li>
          </ul>
          
          <div style="text-align: center; margin: 35px 0;">
            <p><strong>What's Next?</strong></p>
            <p>You may reapply after addressing the issues mentioned above.</p>
            ${validActionUrl
      ? `
            <a href="${validActionUrl}" class="button" style="color: white; margin-top: 15px;">Review Application Guidelines</a>
            `
      : ''
    }
          </div>
          
          <div class="footer">
            <p><strong>Need Assistance?</strong></p>
            <p>If you believe this decision was made in error or need clarification, please contact our front desk or support team:</p>
            <p>
              📧 <a href="mailto:registration@community.com" style="color: #3B82F6;">registration@community.com</a><br>
              📞 (123) 456-7890 (Ext. 2)
            </p>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">This decision is not permanent. You may submit a new application once the issues are resolved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    subject: `⚠️ Account Registration Update - Unit ${unitNumber}`,
    html,
    attachments: [],
  };
}
