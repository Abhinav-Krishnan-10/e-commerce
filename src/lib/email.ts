import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.log("📧 Email would be sent to:", to, "Subject:", subject);
    return { success: true, skipped: true };
  }

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Ecommerce <orders@ecommerce.local>",
      to,
      subject,
      html,
      text,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("Email send failed:", error);
    return { success: false, error };
  }
}

export function orderConfirmationEmail(order: any, items: any[]) {
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; gap: 12px; align-items: center;">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />` : ""}
          <div>
            <p style="margin: 0; font-weight: 500;">${item.name}</p>
            ${item.variantName ? `<p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">${item.variantName}</p>` : ""}
            <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">Qty: ${item.quantity}</p>
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${formatPrice(item.price)}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${formatPrice(item.total)}
      </td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f9fafb; border-radius: 8px; padding: 32px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="margin: 0 0 8px; color: #111827;">Order Confirmed! 🎉</h1>
            <p style="margin: 0; color: #6b7280;">Thank you for your order, ${order.user?.name || "Customer"}!</p>
          </div>

          <div style="background: white; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <h2 style="margin: 0 0 16px; font-size: 18px; color: #111827;">Order #${order.orderNumber}</p>
            <p style="margin: 0 0 16px; color: #6b7280;">Placed on ${new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid #e5e7eb;">
                  <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Item</th>
                  <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">Price</th>
                  <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot style="border-top: 2px solid #e5e7eb;">
                <tr>
                  <td colspan="2" style="padding: 12px; text-align: right; font-weight: 500;">Subtotal:</td>
                  <td style="padding: 12px; text-align: right;">${formatPrice(order.subtotal)}</td>
                </tr>
                ${order.discount > 0 ? `
                <tr>
                  <td colspan="2" style="padding: 12px; text-align: right; font-weight: 500; color: #059669;">Discount (${order.couponCode}):</td>
                  <td style="padding: 12px; text-align: right; color: #059669;">-${formatPrice(order.discount)}</td>
                </tr>
                ` : ""}
                <tr>
                  <td colspan="2" style="padding: 12px; text-align: right; font-weight: 500;">Shipping:</td>
                  <td style="padding: 12px; text-align: right;">${formatPrice(order.shipping)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 12px; text-align: right; font-weight: 500;">Tax:</td>
                  <td style="padding: 12px; text-align: right;">${formatPrice(order.tax)}</td>
                </tr>
                <tr style="border-top: 2px solid #e5e7eb;">
                  <td colspan="2" style="padding: 12px; text-align: right; font-weight: 700; font-size: 18px;">Total:</td>
                  <td style="padding: 12px; text-align: right; font-weight: 700; font-size: 18px;">${formatPrice(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div style="background: white; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 16px; font-size: 16px; color: #111827;">Shipping Address</h3>
            <address style="margin: 0; color: #4b5563; font-style: normal; white-space: pre-line;">
${order.shippingAddress?.firstName} ${order.shippingAddress?.lastName}
${order.shippingAddress?.address1}
${order.shippingAddress?.address2 ? order.shippingAddress.address2 + "\n" : ""}${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.postalCode}
${order.shippingAddress?.country}
            </address>
          </div>

          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p>We'll send you a confirmation when your order ships.</p>
            <p style="margin-top: 16px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order.id}" style="color: #2563eb; text-decoration: none;">View Order Details</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function shippingConfirmationEmail(order: any, trackingNumber: string, trackingUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f9fafb; border-radius: 8px; padding: 32px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="margin: 0 0 8px; color: #111827;">Your Order Has Shipped! 📦</h1>
            <p style="margin: 0; color: #6b7280;">Order #${order.orderNumber} is on its way.</p>
          </div>

          <div style="background: white; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="margin: 0 0 16px; color: #4b5563;">Tracking Number:</p>
            <p style="margin: 0 0 16px; font-family: monospace; font-size: 18px; font-weight: 600; color: #111827;">${trackingNumber}</p>
            <a href="${trackingUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">Track Your Package</a>
          </div>

          <p style="text-align: center; color: #6b7280; font-size: 14px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order.id}" style="color: #2563eb;">View Order Details</a>
          </p>
        </div>
      </body>
    </html>
  `;
}

export function passwordResetEmail(resetUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f9fafb; border-radius: 8px; padding: 32px;">
          <h1 style="margin: 0 0 16px; color: #111827;">Reset Your Password</h1>
          <p style="margin: 0 0 24px; color: #4b5563;">You requested to reset your password. Click the button below to create a new password.</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">Reset Password</a>
          </div>
          <p style="margin: 24px 0 0; color: #6b7280; font-size: 14px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
        </div>
      </body>
    </html>
  `;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
}
