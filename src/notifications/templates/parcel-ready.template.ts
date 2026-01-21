import { Attachment } from 'resend';
import { Template, TemplateData } from '../interfaces/template.interface';
import { getFilenameFromUrl, isValidUrl, escapeHtml } from 'src/common/utils';

export function getParcelReadyTemplate(data: TemplateData): Template {
  const {
    recipientName,
    unitNumber,
    pickupCode,
    courier,
    registeredAt,
    imgUrl,
    actionUrl,
  } = data;

  // Escape user-controlled values to prevent XSS attacks
  const escapedRecipientName = escapeHtml(recipientName);
  const escapedUnitNumber = escapeHtml(unitNumber);
  const escapedPickupCode = escapeHtml(pickupCode);
  const escapedCourier = escapeHtml(courier);

  // Format date if provided
  const formattedDate = registeredAt
    ? new Date(registeredAt).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : '';

  const attachments: Attachment[] = imgUrl
    ? [
      {
        path: imgUrl,
        filename: getFilenameFromUrl(imgUrl),
      },
    ]
    : [];

  const validActionUrl = isValidUrl(actionUrl) ? actionUrl : null;

  const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; }
          .code { font-size: 32px; font-weight: bold; color: #4F46E5; text-align: center; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 New Parcel Arrived!</h1>
          </div>
          <div class="content">
            <p>Hello ${escapedRecipientName || 'Valued Resident'},</p>
            
            <p>You have a new parcel waiting for pickup at your building.</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Parcel Details:</h3>
              <p><strong>Unit Number:</strong> ${escapedUnitNumber || 'N/A'}</p>
              <p><strong>Courier:</strong> ${escapedCourier || 'N/A'}</p>
              <p><strong>Registered:</strong> ${formattedDate}</p>
            </div>
            
            <div style="text-align: center;">
              <p><strong>Your Pickup Code:</strong></p>
              <div class="code">${escapedPickupCode || 'N/A'}</div>
              <p>Please present this code when picking up your parcel.</p>
            </div>
            
            ${validActionUrl
      ? `
            <div style="text-align: center; margin-top: 30px;">
              <a href="${validActionUrl}" class="button">View Parcel Details</a>
    </div>
      `
      : ''
    }
            
            <div class="footer">
              <p><strong>Pickup Location:</strong> Building Lobby / Concierge Desk</p>
              <p><strong>Hours:</strong> 24/7</p>
              <p>If you have any questions, please contact the building management.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

  return {
    subject: `📦 New Parcel Ready for Pickup${unitNumber ? ` - ${unitNumber}` : ''}`,
    html,
    attachments: attachments,
  };
}
