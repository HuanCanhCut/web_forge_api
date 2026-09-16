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

const sendResetPassEmail = ({ email, code }: { email: string; code: number }) => {
    const mailOptions = {
        from: process.env.NODE_MAILER_EMAIL,
        to: email,
        subject: 'Xác thực tài khoản H9N',
        html: `
            <!doctype html>
                <html>
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Xác thực tài khoản H9N</title>
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
                            Mã xác minh tài khoản H9N của bạn
                            </h1>

                            <p
                            style="
                                margin: 0 0 30px;
                                line-height: 1.6;
                                color: #555;
                                font-size: 16px;
                            "
                            >
                            Chào mừng bạn đến với cộng đồng học lập trình thông minh
                            <a
                                href="${process.env.APP_BASE_URL}"
                                style="color: #111111; text-decoration: underline"
                                ><strong>H9N</strong></a
                            >. Chúng tôi đã nhận được yêu cầu xác thực tài khoản của bạn.
                            <br />
                            Vui lòng sử dụng mã OTP bên dưới để hoàn tất quy trình này
                            </p>

                            <!-- Code Box -->
                            <div
                            style="
                                background-color: #f0f7ff;
                                border-radius: 8px;
                                padding: 20px;
                                margin: 0 auto 30px;
                                display: inline-block;
                            "
                            >
                            <span
                                style="
                                font-size: 32px;
                                font-weight: 700;
                                color: #111111;
                                letter-spacing: 8px;
                                font-family: monospace;
                                "
                                >${code}</span
                            >
                            </div>
                            <br />
                          
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
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                style="flex-shrink: 0"
                            >
                                <path
                                d="M9 15H11V9H9V15V15M10 7C10.2833 7 10.5208 6.90417 10.7125 6.7125C10.9042 6.52083 11 6.28333 11 6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6C9 6.28333 9.09583 6.52083 9.2875 6.7125C9.47917 6.90417 9.71667 7 10 7V7M10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20V20M10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18V18M10 10V10V10V10V10V10V10V10V10V10"
                                fill="#BA1A1A"
                                />
                            </svg>
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
                                Mã này sẽ hết hạn sau <strong>${formatDuration(Number(process.env.VERIFY_AUTH_TTL))}</strong>. Nếu bạn không yêu cầu mã này,
                                vui lòng bỏ qua email này hoặc liên hệ bộ phận hỗ trợ nếu thấy
                                có dấu hiệu bất thường.
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

export default sendResetPassEmail
