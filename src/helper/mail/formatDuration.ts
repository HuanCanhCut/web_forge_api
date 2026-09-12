const formatDuration = (seconds: number) => {
    const units = [
        { label: 'ngày', value: 86400 },
        { label: 'giờ', value: 3600 },
        { label: 'phút', value: 60 },
        { label: 'giây', value: 1 },
    ]

    const parts = []

    for (const { label, value } of units) {
        const amount = Math.floor(seconds / value)
        if (amount > 0) {
            parts.push(`${amount} ${label}`)
            seconds -= amount * value
        }
    }

    return parts.length ? parts.join(' ') : '0 giây'
}

export default formatDuration
