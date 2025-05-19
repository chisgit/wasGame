import { CanvasRenderingContext2D } from 'canvas';

export function drawAnimeRacket(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    const racketX = x + width - width * 0.2;
    const racketY = y + height * 0.4;
    const racketSize = width * 0.6;

    // Draw handle
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = width * 0.1;
    ctx.beginPath();
    ctx.moveTo(racketX, racketY);
    ctx.lineTo(racketX, racketY + height * 0.3);
    ctx.stroke();

    // Draw frame
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = width * 0.05;
    ctx.beginPath();
    ctx.ellipse(racketX, racketY, racketSize / 2, racketSize / 1.2, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Draw strings
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;

    // Vertical strings
    for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(racketX + i * racketSize / 8, racketY - racketSize / 2);
        ctx.lineTo(racketX + i * racketSize / 8, racketY + racketSize / 2);
        ctx.stroke();
    }

    // Horizontal strings
    for (let i = -4; i <= 4; i++) {
        ctx.beginPath();
        ctx.moveTo(racketX - racketSize / 2, racketY + i * racketSize / 8);
        ctx.lineTo(racketX + racketSize / 2, racketY + i * racketSize / 8);
        ctx.stroke();
    }
}
