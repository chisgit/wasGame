export class ParticleSystem {
  private particles: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
    life: number;
    maxLife: number;
  }[] = [];

  constructor() {
    // Initialize particle system
  }

  public update(deltaTime: number) {
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];

      // Update position
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;

      // Update life
      particle.life -= deltaTime;

      // Update alpha based on life
      particle.alpha = particle.life / particle.maxLife;

      // Remove dead particles
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    // Render particles
    for (const particle of this.particles) {
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Reset global alpha
    ctx.globalAlpha = 1;
  }

  public createHitEffect(x: number, y: number) {
    // Create particles for hit effect
    const numParticles = 20;
    const colors = ['#FFB7C5', '#87CEEB', '#98FB98', 'white'];

    for (let i = 0; i < numParticles; i++) {
      // Random direction
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 300;

      // Add particle
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0.2 + Math.random() * 0.3,
        maxLife: 0.2 + Math.random() * 0.3
      });
    }

    // Create a flash effect (larger, short-lived particle)
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      size: 15,
      color: 'white',
      alpha: 0.7,
      life: 0.1,
      maxLife: 0.1
    });
  }

  public createLandingEffect(x: number, y: number) {
    // Create particles for landing effect
    const numParticles = 15;

    for (let i = 0; i < numParticles; i++) {
      // Random direction (mostly upward)
      const angle = Math.PI * (1 + Math.random() * 0.2 - 0.1);
      const speed = 50 + Math.random() * 150;

      // Add particle
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 2,
        color: '#98FB98',
        alpha: 1,
        life: 0.3 + Math.random() * 0.4,
        maxLife: 0.3 + Math.random() * 0.4
      });
    }
  }

  public createPowerupCollectEffect(x: number, y: number, powerupType: string) {
    // Map powerup types to colors
    const colorMap: Record<string, string> = {
      'Speed Boost': '#87CEEB',  // Light Blue
      'Power Hit': '#FFB7C5',    // Pink
      'Misdirection': '#98FB98', // Light Green
      'default': 'white'         // Default color
    };

    const color = colorMap[powerupType] || colorMap.default;

    // Create explosion-like particles
    const numParticles = 25;

    for (let i = 0; i < numParticles; i++) {
      // Random direction
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 150;

      // Add particle
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        color,
        alpha: 1,
        life: 0.5 + Math.random() * 0.5,
        maxLife: 0.5 + Math.random() * 0.5
      });
    }

    // Create a flash effect (larger, short-lived particle)
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      size: 30,
      color: 'white',
      alpha: 0.7,
      life: 0.2,
      maxLife: 0.2
    });

    // Create a ring effect
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      size: 5,  // This will be the ring radius, will expand in render
      color,
      alpha: 0.8,
      life: 0.4,
      maxLife: 0.4
    });
  }
}