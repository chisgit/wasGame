import { Shuttlecock } from './Shuttlecock';
import { drawAnimeRacket } from './Racket';

export class Opponent {
  public x: number;
  public y: number;
  private width: number;
  private height: number;
  private canvasWidth: number;
  private canvasHeight: number;
  private courtFloorY: number;
  private speed: number;
  private difficulty: number;
  private reactionDelay: number;
  private targetX: number;
  private targetY: number;
  private isMovingToTarget: boolean;

  constructor(canvasWidth: number, canvasHeight: number, difficulty: number = 0.75) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Set court floor level
    this.courtFloorY = canvasHeight * 0.85;

    // Character dimensions
    this.width = canvasWidth * 0.05;
    this.height = canvasHeight * 0.1;

    // Initial position (opponent's side - right)
    this.x = canvasWidth * 0.75;
    this.y = this.courtFloorY - this.height;

    // Movement speed (75% of max possible speed)
    this.speed = canvasWidth * 0.4 * difficulty;

    // AI difficulty (0.0 to 1.0)
    this.difficulty = difficulty;

    // AI reaction delay (in seconds)
    this.reactionDelay = 0.3 * (1 - difficulty);

    // AI targeting variables
    this.targetX = this.x;
    this.targetY = this.y;
    this.isMovingToTarget = false;
  }

  public updateDimensions(canvasWidth: number, canvasHeight: number) {
    // Update canvas dimensions
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Update court floor level
    this.courtFloorY = canvasHeight * 0.85;

    // Update character dimensions
    this.width = canvasWidth * 0.05;
    this.height = canvasHeight * 0.1;

    // Update position to maintain relative position
    this.x = Math.max(this.x, this.canvasWidth / 2 + this.width / 2);
    this.y = this.courtFloorY - this.height;

    // Update movement speed
    this.speed = canvasWidth * 0.4 * this.difficulty;
  }

  public update(deltaTime: number, shuttlecock: Shuttlecock) {
    // AI logic to track and hit the shuttlecock
    this.updateAI(deltaTime, shuttlecock);

    // Move towards target position
    if (this.isMovingToTarget) {
      // Calculate direction to target
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If close to target, stop moving
      if (distance < 5) {
        this.isMovingToTarget = false;
        return;
      }

      // Normalize direction
      const dirX = dx / distance;
      const dirY = dy / distance;

      // Move towards target
      this.x += dirX * this.speed * deltaTime;
      this.y += dirY * this.speed * deltaTime;

      // Constrain opponent to their half of the court
      this.x = Math.max(this.canvasWidth / 2 + this.width / 2, Math.min(this.x, this.canvasWidth - this.width));

      // Constrain vertical movement
      this.y = Math.max(this.courtFloorY - this.height * 2, Math.min(this.y, this.courtFloorY - this.height));
    }
  }

  private updateAI(deltaTime: number, shuttlecock: Shuttlecock) {
    // Improved AI logic to better track shuttlecock

    // If shuttlecock is moving towards opponent's side or already on opponent's side
    if ((shuttlecock.vx > 0 || shuttlecock.x > this.canvasWidth / 2)) {
      let targetX;

      // If the shuttlecock is high in the air, try to intercept it before it lands
      if (shuttlecock.y < this.courtFloorY - this.height * 3 && shuttlecock.vy > 0) {
        // Calculate intercept point based on trajectories
        const timeToIntercept = Math.min(1,
          Math.max(0.1, (shuttlecock.y - (this.courtFloorY - this.height * 2)) / shuttlecock.vy));

        // Predict where shuttlecock will be at intercept time
        targetX = shuttlecock.x + shuttlecock.vx * timeToIntercept;

        // Ensure target is on opponent's side with some margin
        targetX = Math.max(this.canvasWidth / 2 + this.width * 2,
          Math.min(targetX, this.canvasWidth - this.width));

        // Set target position with reduced randomness based on difficulty
        const randomErrorX = (1 - this.difficulty) * this.canvasWidth * 0.1 * (Math.random() - 0.5);
        this.targetX = targetX + randomErrorX;

        // Jump to hit if needed (move up a bit)
        if (shuttlecock.y < this.courtFloorY - this.height * 1.5) {
          this.targetY = this.courtFloorY - this.height * 1.2;
        } else {
          this.targetY = this.courtFloorY - this.height;
        }
      }
      // If shuttlecock is falling and will land on opponent's side
      else if (shuttlecock.vy > 0 && shuttlecock.x > this.canvasWidth / 2) {
        // Predict where shuttlecock will land
        const landingX = this.predictLanding(shuttlecock);

        // Set target position with some randomness based on difficulty
        const randomErrorX = (1 - this.difficulty) * this.canvasWidth * 0.15 * (Math.random() - 0.5);
        this.targetX = Math.max(this.canvasWidth / 2 + this.width,
          Math.min(landingX + randomErrorX, this.canvasWidth - this.width));
        this.targetY = this.courtFloorY - this.height;
      }
      // Otherwise move to a position that can better intercept a return
      else {
        this.targetX = this.canvasWidth * 0.65; // Position closer to the net for better coverage
        this.targetY = this.courtFloorY - this.height;
      }

      // Start moving to target
      this.isMovingToTarget = true;
    }
    // If shuttlecock is on player's side and not already moving to a target
    else if (shuttlecock.x < this.canvasWidth / 2 && !this.isMovingToTarget) {
      // Return to a neutral position with some variation for unpredictability
      this.targetX = this.canvasWidth * (0.7 + Math.random() * 0.1);
      this.targetY = this.courtFloorY - this.height;
      this.isMovingToTarget = true;
    }
  }

  private predictLanding(shuttlecock: Shuttlecock) {
    // Improved physics prediction of where shuttlecock will land

    // Current state
    const vx = shuttlecock.vx;
    const vy = shuttlecock.vy;
    const g = shuttlecock.gravity;
    const y0 = shuttlecock.y;
    const x0 = shuttlecock.x;

    // Quadratic equation: y = y0 + vy*t + 0.5*g*t^2
    // Solve for t when y = courtFloorY

    // Use quadratic formula to find time to land
    // a = 0.5*g, b = vy, c = y0 - courtFloorY
    const a = 0.5 * g;
    const b = vy;
    const c = y0 - this.courtFloorY;

    // Quadratic formula: t = (-b + sqrt(b^2 - 4ac))/2a
    // We want the positive solution (future time)
    const discriminant = b * b - 4 * a * c;

    let timeToLand;
    if (discriminant < 0) {
      // Fallback if math doesn't work out (shuttlecock won't land)
      timeToLand = (this.courtFloorY - y0) / (vy + g * 5);
    } else {
      // Use the solution where the shuttle is descending (typically the larger positive root)
      // unless the shuttle is currently rising and will come back down
      const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);

      if (t1 > 0 && t2 > 0) {
        timeToLand = Math.max(t1, t2); // Take the later landing time if both are positive
      } else {
        timeToLand = Math.max(0, Math.max(t1, t2)); // Take the positive solution
      }
    }

    // Apply air resistance correction
    const airResistanceFactor = Math.pow(0.995, timeToLand * 60); // Approximate air resistance effect

    // Predict x position at landing, accounting for air resistance
    return x0 + vx * timeToLand * airResistanceFactor;
  }

  public render(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
    this.drawAnimeCharacter(ctx, this.x - this.width, this.y, this.width, this.height, '#4A4A4A');
  }

  private drawAnimeCharacter(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ) {
    // Similar to player character, but mirrored

    // Head
    const headSize = width * 0.8;
    const headX = x + (width - headSize) / 2;
    const headY = y;

    ctx.fillStyle = '#FFE0BD'; // Skin tone
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

    // Eyes
    ctx.fillStyle = '#4A4A4A';
    const eyeSize = headSize * 0.15;
    const eyeY = headY + headSize * 0.4;
    const leftEyeX = headX + headSize * 0.3;
    const rightEyeX = headX + headSize * 0.7;

    ctx.beginPath();
    ctx.ellipse(leftEyeX, eyeY, eyeSize / 2, eyeSize, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(rightEyeX, eyeY, eyeSize / 2, eyeSize, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows
    ctx.strokeStyle = '#4A4A4A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(leftEyeX - eyeSize, eyeY - eyeSize);
    ctx.lineTo(leftEyeX + eyeSize, eyeY - eyeSize * 1.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightEyeX - eyeSize, eyeY - eyeSize * 1.5);
    ctx.lineTo(rightEyeX + eyeSize, eyeY - eyeSize);
    ctx.stroke();

    // Mouth
    ctx.beginPath();
    ctx.arc(
      headX + headSize / 2,
      headY + headSize * 0.7,
      headSize * 0.1,
      0,
      Math.PI
    );
    ctx.stroke();

    // Body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(
      x + width * 0.2,
      y + headSize * 0.8,
      width * 0.6,
      height - headSize * 0.8,
      5
    );
    ctx.fill();

    // Arms
    const armWidth = width * 0.2;
    const armHeight = height * 0.4;
    const armY = y + headSize * 0.8 + height * 0.1;

    // Left arm
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(
      x,
      armY,
      armWidth,
      armHeight,
      5
    );
    ctx.fill();

    // Right arm
    ctx.beginPath();
    ctx.roundRect(
      x + width - armWidth,
      armY,
      armWidth,
      armHeight,
      5
    );
    ctx.fill();

    // Draw the racket
    drawAnimeRacket(ctx, x, y, width, height);
  }

  public getBounds() {
    return {
      x: this.x - this.width,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  public reset() {
    // Reset position
    this.x = this.canvasWidth * 0.75;
    this.y = this.courtFloorY - this.height;

    // Reset targeting
    this.targetX = this.x;
    this.targetY = this.y;
    this.isMovingToTarget = false;
  }
}
