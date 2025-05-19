export class PowerupManager {
  private powerups: {
    type: string;
    x: number;
    y: number;
    active: boolean;
    duration: number;
    remainingTime: number;
    color: string;
    icon: string;
  }[] = [];

  private availablePowerups = [
    { type: 'Speed Boost', duration: 10, color: '#87CEEB', icon: '🌀' },
    { type: 'Power Hit', duration: 5, color: '#FFB7C5', icon: '🔥' },
    { type: 'Misdirection', duration: 8, color: '#98FB98', icon: '✨' }
  ];

  public lastNotifiedPowerup: string | null = null;

  constructor() {
    // Initialize powerups
  }

  public update(deltaTime: number) {
    // Update active powerup timers
    for (const powerup of this.powerups) {
      if (powerup.active) {
        powerup.remainingTime -= deltaTime;

        if (powerup.remainingTime <= 0) {
          powerup.active = false;
        }
      }
    }

    // Return active powerup type or null
    const activePowerup = this.powerups.find(p => p.active);
    return activePowerup ? activePowerup.type : null;
  }

  public render(ctx: CanvasRenderingContext2D) {
    // Render inactive powerups
    for (const powerup of this.powerups) {
      if (!powerup.active) {
        // Draw powerup
        this.drawPowerup(ctx, powerup);
      }
    }
  }

  private drawPowerup(ctx: CanvasRenderingContext2D, powerup: any) {
    // Don't render active powerups or those that have been used
    if (powerup.active || powerup.remainingTime <= 0) return;

    const size = ctx.canvas.width * 0.02;

    // Glow effect
    ctx.beginPath();
    ctx.arc(powerup.x, powerup.y, size * 1.5, 0, Math.PI * 2);

    const gradient = ctx.createRadialGradient(
      powerup.x, powerup.y, 0,
      powerup.x, powerup.y, size * 1.5
    );
    gradient.addColorStop(0, powerup.color + '80');
    gradient.addColorStop(1, powerup.color + '00');

    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw icon
    ctx.font = `${size * 1.5}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(powerup.icon, powerup.x, powerup.y);

    // Pulsating animation
    const pulseSize = size * (1 + 0.2 * Math.sin(Date.now() * 0.005));

    ctx.strokeStyle = powerup.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(powerup.x, powerup.y, pulseSize, 0, Math.PI * 2);
    ctx.stroke();
  }

  public spawnPowerup() {
    // Only spawn if there are no inactive powerups
    if (this.powerups.some(p => !p.active && p.remainingTime > 0)) return;

    // Pick a random powerup type
    const powerupType = this.availablePowerups[Math.floor(Math.random() * this.availablePowerups.length)];

    // Create a new powerup at a random position on the court
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    // Position randomly, but not too close to the edges or net
    const x = Math.random() * width * 0.8 + width * 0.1;
    const y = height * 0.5 + Math.random() * height * 0.3;

    this.powerups.push({
      type: powerupType.type,
      x,
      y,
      active: false,
      duration: powerupType.duration,
      remainingTime: powerupType.duration,
      color: powerupType.color,
      icon: powerupType.icon
    });
  }

  public checkCollision(x: number, y: number, radius: number) {
    // Check if any powerup is colliding with the given position
    for (const powerup of this.powerups) {
      if (!powerup.active && powerup.remainingTime > 0) {
        const dx = powerup.x - x;
        const dy = powerup.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius) {
          // Activate this powerup
          powerup.active = true;

          // Return the activated powerup type
          return powerup.type;
        }
      }
    }

    return null;
  }

  public checkCollisions(playerBounds: { x: number; y: number; width: number; height: number }) {
    // Check for collisions with inactive powerup icons
    for (let i = 0; i < this.powerups.length; i++) {
      const powerup = this.powerups[i];

      // Skip if already active (already collected)
      if (powerup.active || powerup.remainingTime <= 0) continue;

      // Simple collision detection (treat powerup as a circle)
      const powerupRadius = 20; // Adjust based on your powerup size
      const playerCenterX = playerBounds.x + playerBounds.width / 2;
      const playerCenterY = playerBounds.y + playerBounds.height / 2;

      const dx = powerup.x - playerCenterX;
      const dy = powerup.y - playerCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Check for collision
      if (distance < powerupRadius + Math.min(playerBounds.width, playerBounds.height) / 2) {
        // Activate the powerup
        powerup.active = true;

        // Return the collected powerup info for visual effects
        return {
          x: powerup.x,
          y: powerup.y,
          type: powerup.type
        };
      }
    }

    return null;
  }

  public clearPowerups() {
    // Deactivate all powerups
    for (const powerup of this.powerups) {
      powerup.active = false;
      powerup.remainingTime = 0;
    }

    // Clear the array
    this.powerups = [];
  }
}