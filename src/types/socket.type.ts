interface SocketMeta {
    success: boolean
    error: string | null
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ServerToClientEvents {
    //
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ClientToServerEvents {
    //
}

interface InterServerEvents {
    ping: () => void
}

export type { ClientToServerEvents, InterServerEvents, ServerToClientEvents }
