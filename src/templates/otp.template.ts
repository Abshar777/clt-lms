export const genrateTemplateHtml = (fullName: string, otpCode: string) => {
  return `
  <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f8f8f8;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff; margin:40px auto; border-radius:10px; overflow:hidden;">
      <tr style="background-color:#d32f2f;">
        <td style="padding:30px; text-align:center; color:#ffffff;">
          <h1 style="margin:0; font-size:24px;">Verify Your Email</h1>
        </td>
      </tr>

      <tr>
        <td style="padding:30px;">
          <p style="font-size:16px; color:#333;">Hi <strong>${fullName}</strong>,</p>

          <p style="font-size:16px; color:#333;">
            Use this One-Time Password (OTP) to verify your account:
          </p>

          <div style="background-color:#fce4ec; padding:15px; text-align:center; margin:20px 0; border:2px dashed #d32f2f; font-size:28px; letter-spacing:6px; color:#d32f2f; font-weight:bold;">
            ${otpCode}
          </div>

          <p style="font-size:14px; color:#777;">This OTP will expire soon. Do not share it with anyone.</p>

          <hr style="border:none; border-top:1px solid #eee; margin:30px 0;">

          <p style="font-size:16px; color:#333;">
            Best regards,<br>
            <strong>The CLT Academy</strong>
          </p>
        </td>
      </tr>

      <tr style="background-color:#f5f5f5;">
        <td style="padding:20px; text-align:center; font-size:12px; color:#999;">
          &copy; ${new Date().getFullYear()} CLT Academy. All rights reserved.
        </td>
      </tr>
    </table>
  </body>
  `;
};
