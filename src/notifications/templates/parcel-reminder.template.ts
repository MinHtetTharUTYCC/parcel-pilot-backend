import { Attachment } from 'resend';
import { TemplateData, Template } from '../interfaces/template.interface';
import { getFilenameFromUrl, isValidUrl, escapeHtml } from 'src/common/utils';

export function getPickupReminderTemplate(data: TemplateData): Template {
  const {
    recipientName,
    unitNumber,
    pickupCode,
    registeredAt,
    orderId,
    daysWaiting,
    imgUrl,
    actionUrl,
  } = data;

  // Escape user-controlled values to prevent XSS attacks
  const escapedRecipientName = escapeHtml(recipientName);
  const escapedUnitNumber = escapeHtml(unitNumber);
  const escapedPickupCode = escapeHtml(pickupCode);
  const escapedOrderId = escapeHtml(orderId);

  const registeredFormatted = registeredAt
    ? new Date(registeredAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
    : '';

  const waitingDays = daysWaiting ?? 0;

  const urgencyMessage =
    waitingDays >= 7
      ? `<p style="color: #dc2626; font-weight: 600;">⚠️ This parcel has been waiting for ${waitingDays} days. Please pick it up as soon as possible to avoid return shipping.</p>`
      : `<p>Your parcel has been waiting for ${waitingDays} day${waitingDays > 1 ? 's' : ''}.</p>`;

  const validActionUrl = isValidUrl(actionUrl) ? actionUrl : null;

  const attachments: Attachment[] = imgUrl
    ? [
      {
        path: imgUrl,
        filename: getFilenameFromUrl(imgUrl),
      },
    ]
    : [];

  const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #F59E0B; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; }
          .reminder-box { background-color: #FFF7ED; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; }
          .code { font-size: 28px; font-weight: bold; color: #D97706; text-align: center; margin: 15px 0; }
          .button { display: inline-block; padding: 12px 24px; background-color: #F59E0B; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Reminder: Parcel Awaiting Pickup</h1>
          </div>
          <div class="content">
          <p>Hello ${escapedRecipientName || 'Valued Resident'},</p>
          
          <p>This is a friendly reminder that you have a parcel waiting for pickup.</p>

          ${urgencyMessage}
                      
                      <div class="info-box">
                          <p><strong>Order ID:</strong> ${escapedOrderId}</p>
                          <p><strong>Days waiting:</strong> ${waitingDays}</p>
                      </div>
          
          <div class="reminder-box">
            <p><strong>Reminder:</strong> Your parcel has been waiting since ${registeredFormatted}.</p>
            <p>Please pick it up soon to avoid storage fees or return to sender.</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Quick Details:</h3>
            <p><strong>Unit Number:</strong> ${escapedUnitNumber || 'N/A'}</p>
            <p><strong>Pickup Code:</strong></p>
            <div class="code">${escapedPickupCode || 'N/A'}</div>
            
            ${validActionUrl
      ? `
            <div style="text-align: center; margin-top: 30px;">
              <a href="${validActionUrl}" class="button">View Parcel Details</a>
            </div>
            `
      : ''
    }
            
            <div class="footer">
                <p>This is an automated reminder from Parcel Pilot</p>
                <p>If you have any questions, please contact the management office</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

  return {
    subject: `Reminder: Your parcel is ready for pickup${daysWaiting >= 7 ? ' (Urgent)' : ''}`,
    html,
    attachments,
  };
}
