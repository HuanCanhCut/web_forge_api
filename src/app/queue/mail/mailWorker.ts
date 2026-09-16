import { Job, Worker } from 'bullmq'
import { randomBytes } from 'crypto'
import moment from 'moment'

import { ioRedis, redisClient } from '~/config/redis'
import { QueueEnum } from '~/enum/queue'
import sendResetPasswordEmail from '~/helper/mail/sendResetPasswordEmail'
import sendVerificationCode from '~/helper/mail/sendVerificationCode'

interface MailData {
    email: string
    type: 'activate_account' | 'reset_password'
}

const mailWorker = new Worker(
    QueueEnum.MAIL,
    async (job: Job<MailData>) => {
        try {
            switch (job.name) {
                case QueueEnum.SEND_RESET_PASSWORD_EMAIL: {
                    const { email } = job.data
                    console.log(
                        `\x1b[33m [Mail Worker] Processing job ${job.id}: sending reset password to ${email} \x1b[0m`,
                    )

                    const token = Buffer.from(randomBytes(56)).toString('hex')

                    // save token to redis
                    const codeTtl = Number(process.env.VERIFY_AUTH_TTL)

                    await redisClient.set(
                        `forgot_password_token:${email}`,
                        {
                            token,
                            created_at: moment.tz(new Date(), 'Asia/Ho_Chi_Minh').format(),
                        },
                        { EX: codeTtl },
                    )

                    await sendResetPasswordEmail({ email, token })

                    console.log(`\x1b[33m [Mail Worker] Job ${job.id} sent reset password code to ${email} \x1b[0m`)
                    return { success: true }
                }
                case QueueEnum.SEND_VERIFICATION_CODE: {
                    const { email } = job.data

                    // 6 number
                    const resetCode = Math.floor(100000 + Math.random() * 900000)

                    const hasCode = await redisClient.get(`activate_account:${email}`)

                    if (hasCode) {
                        await redisClient.del(`activate_account:${email}`)
                    }

                    const codeTtl = Number(process.env.VERIFY_AUTH_TTL)

                    await redisClient.set(`activate_account:${email}`, resetCode, { EX: codeTtl })

                    console.log(
                        `\x1b[33m [Mail Worker] Processing job ${job.id}: sending verification code to ${email} \x1b[0m`,
                    )

                    await sendVerificationCode({ email, code: resetCode })

                    console.log(`\x1b[33m [Mail Worker] Job ${job.id} sent verification code to ${email} \x1b[0m`)

                    return { success: true }
                }
                default:
                    throw new Error(`Unknown job name: ${job.name}`)
            }
        } catch (error: any) {
            console.error(`\x1b[31m [Mail Worker] Error processing job ${job.id}: ${error.message} \x1b[0m`)
            throw error // Đảm bảo job sẽ được thử lại nếu có lỗi
        }
    },
    { connection: ioRedis, concurrency: 10 },
)

mailWorker.on('completed', (job: Job<MailData> | undefined) => {
    if (job) {
        console.log(`\x1b[33m [Mail Worker] Job ${job.id} has been completed \x1b[0m`)
    }
})

mailWorker.on('failed', (job: Job<MailData> | undefined, error: Error) => {
    if (job) {
        console.error(`[Mail Worker] Job ${job.id} has failed with error: ${error.message}`)
    } else {
        console.error(`[Mail Worker] Job has failed with error: ${error.message}`)
    }
})

export { mailWorker }
