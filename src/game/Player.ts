import { Sparkles } from 'lucide-react';

export class Player {
  public x: number;
  public y: number;
  private width: number;
  private height: number;
  private canvasWidth: number;
  private canvasHeight: number;
  private courtFloorY: number;
  private speed: number;
  private baseSpeed: number;
  private characterIndex: number;
  public speedBoost: boolean = false;
  public powerHit: boolean = false;
  private characterColors = ['#FFB7C5', '#87CEEB', '#98FB98'];
  private hairStyles = [
    { bangs: true, twintails: true, color: '#FF69B4' },
    { bangs: false, spiky: true, color: '#4169E1' },
    { bangs: true, ponytail: true, color: '#98FB98' }
  ];
  private animationFrame: number = 0;
  private blinkTimer: number = 0;
  private isBlinking: boolean = false;

  constructor(canvasWidth: number, canvasHeight: number, characterIndex: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.characterIndex = characterIndex;

    this.courtFloorY = canvasHeight * 0.85;
    this.width = canvasWidth * 0.05;
    this.height = canvasHeight * 0.1;

    this.x = canvasWidth * 0.25;
    this.y = this.courtFloorY - this.height;

    this.baseSpeed = canvasWidth * 0.5;
    this.speed = this.baseSpeed;
  }

  public updateDimensions(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.courtFloorY = canvasHeight * 0.85;
    this.width = canvasWidth * 0.05;
    this.height = canvasHeight * 0.1;
    this.x = Math.min(this.x, this.canvasWidth / 2 - this.width / 2);
    this.y = this.courtFloorY - this.height;
    this.baseSpeed = canvasWidth * 0.5;
  }

  // Added public methods to access dimensions
  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public getMaxY(): number {
    return this.courtFloorY - this.height;
  }

  public getMinY(): number {
    return this.courtFloorY - this.height * 2;
  }

  public getMaxX(): number {
    return this.canvasWidth / 2 - this.width / 2;
  }

  public getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  public update(deltaTime: number, input: { left: boolean; right: boolean; up: boolean; down: boolean; hit: boolean }) {
    this.speed = this.speedBoost ? this.baseSpeed * 1.5 : this.baseSpeed;

    if (input.left) this.x -= this.speed * deltaTime;
    if (input.right) this.x += this.speed * deltaTime;
    if (input.up) this.y -= this.speed * deltaTime;
    if (input.down) this.y += this.speed * deltaTime;

    this.x = Math.max(0, Math.min(this.x, this.canvasWidth / 2 - this.width / 2));
    this.y = Math.max(this.courtFloorY - this.height * 2, Math.min(this.y, this.courtFloorY - this.height));

    // Update animation frame
    this.animationFrame = (this.animationFrame + 1) % 60;

    // Update blink timer
    this.blinkTimer += deltaTime;
    if (this.blinkTimer > 3) {
      this.isBlinking = true;
      if (this.blinkTimer > 3.15) {
        this.isBlinking = false;
        this.blinkTimer = 0;
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    const characterColor = this.characterColors[this.characterIndex % this.characterColors.length];
    const hairStyle = this.hairStyles[this.characterIndex % this.hairStyles.length];

    // Save context for character animation
    ctx.save();

    // Add slight bounce animation
    const bounce = Math.sin(this.animationFrame * 0.1) * 2;
    ctx.translate(this.x, this.y + bounce);

    // Draw character
    this.drawAnimeCharacter(ctx, 0, 0, this.width, this.height, characterColor, hairStyle);

    // Restore context
    ctx.restore();

    // Draw effects
    if (this.powerHit) {
      ctx.fillStyle = 'rgba(255, 165, 0, 0.5)';
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.speedBoost) {
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.ellipse(
        this.x + this.width / 2,
        this.y + this.height - 5,
        this.width * 0.8,
        this.height * 0.2,
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  private drawAnimeCharacter(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    hairStyle: { bangs?: boolean; twintails?: boolean; spiky?: boolean; ponytail?: boolean; color: string }
  ) {
    const headSize = width * 0.9;
    const headX = x + (width - headSize) / 2;
    const headY = y;

    // Draw hair back
    ctx.fillStyle = hairStyle.color;
    if (hairStyle.twintails) {
      this.drawTwintails(ctx, headX, headY, headSize);
    } else if (hairStyle.ponytail) {
      this.drawPonytail(ctx, headX, headY, headSize);
    }

    // Draw head
    ctx.fillStyle = '#FFE0BD';
    ctx.beginPath();
    ctx.ellipse(
      headX + headSize / 2,
      headY + headSize / 2,
      headSize / 2,
      headSize / 2,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw hair front
    ctx.fillStyle = hairStyle.color;
    if (hairStyle.bangs) {
      this.drawBangs(ctx, headX, headY, headSize);
    } else if (hairStyle.spiky) {
      this.drawSpikyHair(ctx, headX, headY, headSize);
    }

    // Draw eyes
    this.drawAnimeEyes(ctx, headX, headY, headSize);

    // Draw mouth
    this.drawAnimeMouth(ctx, headX, headY, headSize);

    // Draw body
    this.drawAnimeBody(ctx, x, y, width, height, color, headSize);

    // Draw racket
    this.drawAnimeRacket(ctx, x, y, width, height);
  }

  private drawTwintails(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    const twintailCurve = Math.sin(this.animationFrame * 0.1) * 5;

    // Left twintail
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.5);
    ctx.quadraticCurveTo(
      x - size * 0.3,
      y + size * 0.8 + twintailCurve,
      x - size * 0.2,
      y + size * 1.2
    );
    ctx.quadraticCurveTo(
      x - size * 0.1,
      y + size * 1.3,
      x,
      y + size * 1.2
    );
    ctx.fill();

    // Right twintail
    ctx.beginPath();
    ctx.moveTo(x + size, y + size * 0.5);
    ctx.quadraticCurveTo(
      x + size * 1.3,
      y + size * 0.8 - twintailCurve,
      x + size * 1.2,
      y + size * 1.2
    );
    ctx.quadraticCurveTo(
      x + size * 1.1,
      y + size * 1.3,
      x + size,
      y + size * 1.2
    );
    ctx.fill();
  }

  private drawPonytail(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    const ponytailSway = Math.sin(this.animationFrame * 0.1) * 5;

    ctx.beginPath();
    ctx.moveTo(x + size * 0.5, y + size * 0.3);
    ctx.quadraticCurveTo(
      x + size * 0.5 + ponytailSway,
      y + size * 1,
      x + size * 0.5,
      y + size * 1.5
    );
    ctx.quadraticCurveTo(
      x + size * 0.7,
      y + size * 1.4,
      x + size * 0.8,
      y + size * 1.2
    );
    ctx.quadraticCurveTo(
      x + size * 0.6,
      y + size * 0.8,
      x + size * 0.5,
      y + size * 0.3
    );
    ctx.fill();
  }

  private drawBangs(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.3);

    // Left bang
    ctx.quadraticCurveTo(
      x + size * 0.2,
      y + size * 0.4,
      x + size * 0.3,
      y + size * 0.5
    );

    // Middle bang
    ctx.quadraticCurveTo(
      x + size * 0.5,
      y + size * 0.3,
      x + size * 0.7,
      y + size * 0.5
    );

    // Right bang
    ctx.quadraticCurveTo(
      x + size * 0.8,
      y + size * 0.4,
      x + size,
      y + size * 0.3
    );

    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();
  }

  private drawSpikyHair(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    const spikes = 6;
    const spikeHeight = size * 0.4;

    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.5);

    for (let i = 0; i < spikes; i++) {
      const spikeX = x + (size * i) / (spikes - 1);
      const randomHeight = spikeHeight * (0.8 + Math.random() * 0.4);

      ctx.lineTo(spikeX, y - randomHeight);
      ctx.lineTo(spikeX + size / spikes / 2, y);
    }

    ctx.lineTo(x + size, y + size * 0.5);
    ctx.closePath();
    ctx.fill();
  }

  private drawAnimeEyes(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    const eyeWidth = size * 0.15;
    const eyeHeight = size * 0.2;
    const eyeY = y + size * 0.4;
    const leftEyeX = x + size * 0.25;
    const rightEyeX = x + size * 0.75;

    // Draw eye whites
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(leftEyeX, eyeY, eyeWidth, eyeHeight, 0, 0, Math.PI * 2);
    ctx.ellipse(rightEyeX, eyeY, eyeWidth, eyeHeight, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw pupils (adjust for blinking)
    if (!this.isBlinking) {
      ctx.fillStyle = '#4A4A4A';
      ctx.beginPath();
      ctx.ellipse(leftEyeX, eyeY, eyeWidth * 0.5, eyeHeight * 0.5, 0, 0, Math.PI * 2);
      ctx.ellipse(rightEyeX, eyeY, eyeWidth * 0.5, eyeHeight * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Add shine to eyes
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.ellipse(leftEyeX - eyeWidth * 0.2, eyeY - eyeHeight * 0.2, eyeWidth * 0.15, eyeHeight * 0.15, 0, 0, Math.PI * 2);
      ctx.ellipse(rightEyeX - eyeWidth * 0.2, eyeY - eyeHeight * 0.2, eyeWidth * 0.15, eyeHeight * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Draw closed eyes
      ctx.strokeStyle = '#4A4A4A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(leftEyeX - eyeWidth, eyeY);
      ctx.lineTo(leftEyeX + eyeWidth, eyeY);
      ctx.moveTo(rightEyeX - eyeWidth, eyeY);
      ctx.lineTo(rightEyeX + eyeWidth, eyeY);
      ctx.stroke();
    }
  }

  private drawAnimeMouth(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.strokeStyle = '#4A4A4A';
    ctx.lineWidth = 2;

    // Draw cute smile
    ctx.beginPath();
    ctx.arc(
      x + size * 0.5,
      y + size * 0.7,
      size * 0.1,
      0,
      Math.PI,
      false
    );
    ctx.stroke();
  }

  private drawAnimeBody(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string, headSize: number) {
    // Draw uniform
    ctx.fillStyle = color;

    // Torso
    ctx.beginPath();
    ctx.moveTo(x + width * 0.2, y + headSize * 0.8);
    ctx.lineTo(x + width * 0.8, y + headSize * 0.8);
    ctx.lineTo(x + width * 0.9, y + height);
    ctx.lineTo(x + width * 0.1, y + height);
    ctx.closePath();
    ctx.fill();

    // Sleeves
    const sleeveWidth = width * 0.2;
    const sleeveHeight = height * 0.4;
    const sleeveY = y + headSize * 0.8;

    // Left sleeve
    ctx.beginPath();
    ctx.moveTo(x, sleeveY);
    ctx.lineTo(x + sleeveWidth, sleeveY);
    ctx.lineTo(x + sleeveWidth * 0.8, sleeveY + sleeveHeight);
    ctx.lineTo(x - sleeveWidth * 0.2, sleeveY + sleeveHeight);
    ctx.closePath();
    ctx.fill();

    // Right sleeve
    ctx.beginPath();
    ctx.moveTo(x + width, sleeveY);
    ctx.lineTo(x + width - sleeveWidth, sleeveY);
    ctx.lineTo(x + width - sleeveWidth * 0.8, sleeveY + sleeveHeight);
    ctx.lineTo(x + width + sleeveWidth * 0.2, sleeveY + sleeveHeight);
    ctx.closePath();
    ctx.fill();
  }

  private drawAnimeRacket(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
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

  public reset() {
    this.x = this.canvasWidth * 0.25;
    this.y = this.courtFloorY - this.height;
    this.speedBoost = false;
    this.powerHit = false;
  }
}
