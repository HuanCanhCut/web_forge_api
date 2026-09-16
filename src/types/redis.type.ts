import { S3Folder } from './s3.type'
import { User } from '~/app/models'

export interface RedisSchema {
    forgot_password_token: { token: string; created_at: string }
    activate_account: number
    auth_challenge_id: {
        auth_challenge_id: string
        created_at: string
    }
    blacklist_token: boolean
    s3_upload_id: {
        user_id: string
        object_key: string
        folder: S3Folder
    }
    user: User
}
