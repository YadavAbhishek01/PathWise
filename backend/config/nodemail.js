import nodemailer from 'nodemailer';



export const sendMail=async(email,otp,username)=>{
    try {
        const transport= nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        })
        await transport.sendMail({
            from:process.env.EMAIL_USER,
            to:email,
            subject:"Email Verification",
            html:`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
  <table width="100%" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4">
    <tr>
      <td align="center">
        <table width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="margin:40px 0; border-radius:10px; overflow:hidden;">
          
          <tr>
            <td align="center" bgcolor="#2563eb" style="padding:30px;">
              <h1 style="color:#ffffff; margin:0;">Verify Your Email</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:40px;">
              <h2>Hello ${username},</h2>

              <p style="color:#555; font-size:16px; line-height:1.6;">
                Thank you for signup up. Please use the following One-Time Password (OTP) to verify your email address.
              </p>

              <div style="text-align:center; margin:30px 0;">
                <span style="
                  display:inline-block;
                  background:#f3f4f6;
                  padding:15px 40px;
                  font-size:32px;
                  font-weight:bold;
                  letter-spacing:8px;
                  border-radius:8px;
                  color:#2563eb;
                ">
                  ${otp}
                </span>
              </div>

              <p style="color:#555; font-size:16px;">
                This OTP will expire in <strong>10 minutes</strong>.
              </p>

              <p style="color:#555; font-size:16px;">
                If you didn't request this, please ignore this email.
              </p>

              <hr style="margin:30px 0; border:none; border-top:1px solid #e5e7eb;" />

              <p style="text-align:center; color:#888; font-size:14px;">
                © 2025 Your Company. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
        })
    } catch (error) {
        
    }
}