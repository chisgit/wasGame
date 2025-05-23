export class Shuttlecock {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public gravity: number;
  private size: number;
  private canvasWidth: number;
  private canvasHeight: number;
  private initialX: number;
  private initialY: number;
  public misdirection: boolean = false;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Shuttlecock size reduced by 65%
    this.size = canvasWidth * 0.007; // Reduced from 0.02 (65% reduction)

    // Initial position (center, above net)
    this.initialX = canvasWidth / 2;
    this.initialY = canvasHeight * 0.5;
    this.x = this.initialX;
    this.y = this.initialY;

    // Initial velocity (stationary)
    this.vx = 0;
    this.vy = 0;

    // Reduce gravity for more manageable gameplay
    this.gravity = canvasHeight * 0.4; // Reduced from 0.5
  }

  public updateDimensions(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.size = canvasWidth * 0.007;
    this.initialX = canvasWidth / 2;
    this.initialY = canvasHeight * 0.5;
    this.gravity = canvasHeight * 0.4;

    const relativeX = this.x / this.canvasWidth;
    const relativeY = this.y / this.canvasHeight;
    this.x = relativeX * canvasWidth;
    this.y = relativeY * canvasHeight;
  }

  public update(deltaTime: number) {
    // Apply gravity
    this.vy += this.gravity * deltaTime;

    // Apply misdirection effect if active
    if (this.misdirection && Math.random() < 0.1) {
      this.vx += (Math.random() - 0.5) * this.canvasWidth * 0.1 * deltaTime;
      this.vy += (Math.random() - 0.5) * this.canvasHeight * 0.1 * deltaTime;
    }

    // Update position
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    // Reduce air resistance for more dynamic gameplay
    this.vx *= 0.995; // Changed from 0.99
    this.vy *= 0.995; // Changed from 0.99
  }

  public render(ctx: CanvasRenderingContext2D) {
    // Draw shuttlecock as a simple circle

    // Draw shuttlecock as a circle
    ctx.fillStyle = '#F5DEB3';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // Add outline for better visibility
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Simple feathers
    ctx.fillStyle = 'white';

    const featherLength = this.size * 2.5;
    const direction = Math.atan2(this.vy, this.vx) + Math.PI;

    const numFeathers = 6;
    for (let i = 0; i < numFeathers; i++) {
      const angle = direction + (Math.PI * 0.25) * (i / numFeathers - 0.5);

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x + Math.cos(angle) * featherLength,
        this.y + Math.sin(angle) * featherLength
      );
      ctx.lineWidth = this.size * 0.7;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.stroke();
    }

    if (this.misdirection) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);

      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size * 3
      );
      gradient.addColorStop(0, 'rgba(255, 100, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 100, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  public hit(hitterX: number, hitterY: number, isPowerHit: boolean = false, isOpponent: boolean = false) {
    // Calculate direction from hitter to shuttlecock
    const dx = this.x - hitterX;
    const dy = this.y - hitterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize direction
    let dirX = dx / distance;
    let dirY = dy / distance;

    // If it's the opponent (computer) hitting, ensure the shuttlecock goes over the net to the player's side
    if (isOpponent) {
      // Force direction toward player's side (left side of the court)
      dirX = -Math.abs(dirX) * 0.8; // Ensure negative X direction (toward player)

      // Adjust the Y direction to ensure a good arc
      dirY = -0.7; // Strong upward component for a good clear

      // Add slight randomness to target different areas of the player's court
      dirX -= Math.random() * 0.2; // Vary the horizontal direction slightly
    }

    // Increase base force and make it more consistent
    const forceMagnitude = Math.max(0.5, 1 - distance / (this.canvasWidth * 0.4)); // Adjusted values

    // Increase base speed for more dynamic gameplay
    let speed = this.canvasWidth * 1.0 * forceMagnitude; // Increased from 0.8

    // Add stronger upward component for regular hits
    const upwardComponent = isOpponent ? -0.5 : -0.8; // Different for opponent vs player

    // Increase power hit boost
    if (isPowerHit) {
      speed *= 1.8; // Increased from 1.5
    }

    // Set velocity with adjusted values
    this.vx = dirX * speed;
    this.vy = dirY * speed + upwardComponent * this.canvasHeight;

    // Reduce random variation for more consistent hits
    const randomFactor = isOpponent ? 0.02 : 0.03; // Less randomness for opponent for better control
    this.vx += (Math.random() - 0.5) * this.canvasWidth * randomFactor;
    this.vy += (Math.random() - 0.5) * this.canvasHeight * randomFactor;
  }

  public reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.vx = (Math.random() * 2 - 1) * this.canvasWidth * 0.1;
    this.vy = -this.canvasHeight * 0.1;
    this.misdirection = false;
  }
}