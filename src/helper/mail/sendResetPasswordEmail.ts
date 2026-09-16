import nodemailer from 'nodemailer'

import formatDuration from './formatDuration'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASSWORD,
    },
})

const sendResetPasswordEmail = ({ email, token }: { email: string; token: string }) => {
    const resetPasswordUrl = `${process.env.APP_BASE_URL}/auth/reset-password?email=${encodeURIComponent(email)}&token=${token}`

    const mailOptions = {
        from: process.env.NODE_MAILER_EMAIL,
        to: email,
        subject: 'Đặt lại mật khẩu H9N',
        html: `
            <!doctype html>
            <html>
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Đặt lại mật khẩu H9N</title>
                </head>
                <body
                    style="
                    margin: 0;
                    padding: 0;
                    font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;
                    background-color: #f4f6f8;
                    color: #333;
                    "
                >
                    <div
                    style="
                        width: 100%;
                        table-layout: fixed;
                        background-color: #f4f6f8;
                        padding: 40px 0;
                    "
                    >
                    <div
                        style="
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 0 20px;
                        box-sizing: border-box;
                        "
                    >
                        <!-- Card Container -->
                        <div
                        style="
                            background-color: #ffffff;
                            border-radius: 12px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                            overflow: hidden;
                            border: 1px solid #e1e4e8;
                        "
                        >
                        <!-- Header / Brand -->
                        <div
                            style="
                            background-color: #ffffff;
                            text-align: center;
                            border-bottom: 1px solid #f0f0f0;
                            padding: 6px 0
                            "
                        >
                            <img
                            src="https://res.cloudinary.com/dkmwrkngj/image/upload/v1779899009/1779880342533_feeh6m.png"
                            style="width: 80px; height: auto; object-fit: contain"
                            alt="Logo"
                            />
                        </div>

                        <!-- Content -->
                        <div style="padding: 40px 30px; text-align: center">
                            <h1
                            style="
                                margin: 0 0 20px;
                                font-size: 24px;
                                font-weight: 700;
                                color: #1a1a1a;
                            "
                            >
                            Đặt lại mật khẩu của bạn
                            </h1>

                            <p
                            style="
                                margin: 0 0 30px;
                                line-height: 1.6;
                                color: #555;
                                font-size: 16px;
                            "
                            >
                            Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản
                            <a
                                href="${process.env.APP_BASE_URL}"
                                style="color: #111111; text-decoration: underline"
                                ><strong>H9N</strong></a
                            >
                            của bạn.
                            <br />
                            Nhấn vào nút bên dưới để tiến hành đặt lại mật khẩu. Liên kết sẽ hết hạn trong
                            <strong>${formatDuration(Number(process.env.VERIFY_AUTH_TTL))}</strong>.
                            </p>

                            <!-- CTA Button -->
                            <a
                            href="${resetPasswordUrl}"
                            style="
                                display: inline-block;
                                background-color: #111111;
                                color: #ffffff;
                                text-decoration: none;
                                font-size: 15px;
                                font-weight: 600;
                                padding: 14px 36px;
                                border-radius: 8px;
                                margin-bottom: 30px;
                                letter-spacing: 0.3px;
                            "
                            >
                            Đặt lại mật khẩu
                            </a>

                            <p
                            style="
                                margin: 0 0 20px;
                                font-size: 13px;
                                color: #888;
                            "
                            >
                            Hoặc sao chép đường dẫn sau vào trình duyệt:
                            </p>

                            <p
                            style="
                                margin: 0 0 30px;
                                font-size: 12px;
                                color: #aaa;
                                word-break: break-all;
                            "
                            >
                            ${resetPasswordUrl}
                            </p>

                            <div
                            style="
                                display: flex;
                                gap: 12px;
                                padding: 16px;
                                background-color: #ffdad633;
                                border-radius: 8px;
                                border: 1px solid #ffdad6;
                            "
                            >
                            <div style="text-align: left">
                                <p
                                style="
                                    color: #c5000d;
                                    margin: 0;
                                    font-weight: 600;
                                    font-size: 14px;
                                "
                                >
                                Thông tin bảo mật
                                </p>
                                <p
                                style="
                                    margin: 0;
                                    color: #93000acc;
                                    font-weight: 500;
                                    margin-top: 4px;
                                    font-size: 13px;
                                    line-height: 16px;
                                "
                                >
                                Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email
                                này. Liên kết sẽ tự động hết hạn và tài khoản của bạn vẫn được
                                bảo mật.
                                </p>
                            </div>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div
                            style="
                            background-color: #fafbfc;
                            padding: 20px;
                            text-align: center;
                            border-top: 1px solid #f0f0f0;
                            "
                        >
                            <p style="margin: 0 0 10px; font-size: 12px; color: #888">
                            Email này được gửi tự động từ hệ thống.
                            </p>
                        </div>
                        </div>
                    </div>
                    </div>
                </body>
            </html>
        `,
    }

    return transporter.sendMail(mailOptions)
}

export default sendResetPasswordEmail
