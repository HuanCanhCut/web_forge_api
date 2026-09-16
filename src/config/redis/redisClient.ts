import { createClient } from 'redis'

import { RedisSchema } from '~/types/redis.type'

type RedisKey = keyof RedisSchema
type RedisPrefix<K extends RedisKey> = `${K}:${string}`

const raw = createClient({
    url: process.env.REDIS_URL,
    socket: { reconnectStrategy: false },
})
    .on('error', (err) => console.error('Redis error', err))
    .on('connect', () => console.log('\x1b[36m%s\x1b[0m', '==>>>>>Connect to Redis successfully!!!'))

const redisClient = {
    async get<K extends RedisKey>(key: RedisPrefix<K>): Promise<RedisSchema[K] | null> {
        const data = await raw.get(key)
        if (!data) return null
        return JSON.parse(data) as RedisSchema[K]
    },

    async set<K extends RedisKey>(key: RedisPrefix<K>, value: RedisSchema[K], options?: { EX?: number }) {
        return raw.set(key, JSON.stringify(value), options)
    },

    async del(key: string) {
        return raw.del(key)
    },

    connect: () => raw.connect(),
}

export default redisClient
