export function convertDuration(duration: number): string {
    const h = Math.floor(duration / 3600);
    const m = Math.floor((duration % 3600) / 60);
    const s = duration % 60;

    return [h, m, s].map(unit => String(unit).padStart(2, '0')).join(':');
}