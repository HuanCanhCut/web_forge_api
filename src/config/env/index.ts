import * as dotenv from 'dotenv'
import * as fs from 'fs'

const environment = process.env.NODE_ENV || 'development'

const envFiles = [`.env.local`, `.env.${environment}.local`, `.env.${environment}`, `.env`]

envFiles.forEach((file) => {
    if (fs.existsSync(file)) {
        dotenv.config({ path: file })
        console.log(`Environments: ${file}`)

        // HACK: Enable hot-reload on environment file change
        fs.watch(file, (eventType) => {
            console.log(`Environment file ${file} changed (${eventType}), restarting app...`)
            process.exit(0)
        })
    }
})
