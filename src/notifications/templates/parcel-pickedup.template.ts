import { Attachment } from 'resend';
import { Template, TemplateData } from '../interfaces/template.interface';
import { getFilenameFromUrl, isValidUrl, escapeHtml } from 'src/common/utils';

export function getParcelPickedUpTemplate(data: TemplateData): Template {
  const { recipientName, unitNumber, pickedUpAt, courier, imgUrl, actionUrl } =
    data;

  // Escape user-controlled values to prevent XSS attacks
  const escapedRecipientName = escapeHtml(recipientName);
  const escapedUnitNumber = escapeHtml(unitNumber);
  const escapedCourier = escapeHtml(courier);

  const formattedDate = pickedUpAt
    ? new Date(pickedUpAt).toLocaleDateString('en-US', {
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

  // Validate actionUrl to prevent XSS attacks
  const validActionUrl = isValidUrl(actionUrl) ? actionUrl : null;

  const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #10B981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; }
          .info-box { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 24px; background-color: #10B981; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Parcel Picked Up!</h1>
          </div>
          <div class="content">
            <p>Hello ${escapedRecipientName || 'Valued Resident'},</p>
            
            <p>Your parcel has been successfully picked up.</p>
            
            <div class="info-box">
              <h3>Pickup Confirmation:</h3>
              <p><strong>Unit Number:</strong> ${escapedUnitNumber || 'N/A'}</p>
              <p><strong>Courier:</strong> ${escapedCourier || 'N/A'}</p>
              <p><strong>Picked Up:</strong> ${formattedDate}</p>
              <p><strong>Status:</strong> <span style="color: #10B981; font-weight: bold;">COMPLETED</span></p>
            </div>
            
            <p>Thank you for using our parcel management system!</p>
            
            ${validActionUrl
      ? `
            <div style="text-align: center; margin-top: 30px;">
              <a href="${validActionUrl}" class="button">View Pickup History</a>
            </div>
            `
      : ''
    }
            
            <div class="footer">
              <p>If you have any questions about this pickup, please contact the Front Desk.</p>
              <p>Didn't pick up this parcel? Please contact the Front Desk immediately.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

  return {
    subject: unitNumber
      ? `Parcel Picked Up - ${unitNumber}`
      : 'Parcel Picked Up',
    html,
    attachments: attachments,
  };
}
