export function formatBytes(bytes: number): string {
    if (bytes <= 0) return '0 Mo';

    const mb = bytes / 1024 / 1024;

    if (mb < 1) {
        return `${Math.round(bytes / 1024)} Ko`;
    }

    if (mb < 1000) {
        return `${mb.toFixed(mb < 10 ? 1 : 0)} Mo`;
    }

    return `${(mb / 1024).toFixed(2)} Go`;
}
