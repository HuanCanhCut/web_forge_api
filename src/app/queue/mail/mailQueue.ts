import { Queue } from 'bullmq'

import { ioRedis } from '~/config/redis'
import { QueueEnum } from '~/enum/queue'

const mailQueue = new Queue(QueueEnum.MAIL, {
    connection: ioRedis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: 5000,
    },
})

interface MailData {
    email: string
    type: 'activate_account' | 'reset_password'
}

const addMailJob = async (data: MailData): Promise<void> => {
    switch (data.type) {
        case 'activate_account':
            await mailQueue.add(QueueEnum.SEND_VERIFICATION_CODE, data)
            break
        case 'reset_password':
            await mailQueue.add(QueueEnum.SEND_RESET_PASSWORD_EMAIL, data)
            break
        default:
            throw new Error('Invalid type')
    }
}

export { addMailJob, MailData, mailQueue }
