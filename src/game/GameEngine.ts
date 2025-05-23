import { Player } from './Player';
import { Opponent } from './Opponent';
import { Shuttlecock } from './Shuttlecock';
import { Court } from './Court';
import { PowerupManager } from './PowerupManager';
import { InputHandler } from './InputHandler';
import { Physics } from './Physics';
import { ParticleSystem } from './ParticleSystem';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private lastTimestamp: number = 0;
  private isPaused: boolean = false;

  // Game elements
  private court: Court;
  private player: Player;
  private opponent: Opponent;
  private shuttlecock: Shuttlecock;
  private particleSystem: ParticleSystem;
  private powerupManager: PowerupManager;
  private inputHandler: InputHandler;
  private physics: Physics;
  private img: HTMLImageElement | null = null;

  // Game state
  private playerScore: number = 0;
  private opponentScore: number = 0;
  private lastHitter: 'player' | 'opponent' | null = null;

  // Callbacks
  private scoreUpdateCallbacks: ((playerScore: number, opponentScore: number) => void)[] = [];
  private powerupChangeCallbacks: ((powerup: string | null) => void)[] = [];

  constructor(canvas: HTMLCanvasElement, characterIndex: number) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get canvas context');
    this.ctx = context;

    // Set canvas dimensions for optimal rendering
    this.setupCanvas();

    // Create game elements
    this.court = new Court(this.canvas.width, this.canvas.height);
    this.player = new Player(this.canvas.width, this.canvas.height, characterIndex);
    this.opponent = new Opponent(this.canvas.width, this.canvas.height, 0.9); // Increased from default 0.75 to 0.9
    this.shuttlecock = new Shuttlecock(this.canvas.width, this.canvas.height);
    this.particleSystem = new ParticleSystem();
    this.powerupManager = new PowerupManager();
    this.physics = new Physics();

    // Create input handler
    this.inputHandler = new InputHandler(this.canvas);

    // Initialize game state
    this.resetPositions();
    this.loadImage();
  }

  private setupCanvas() {
    // Make the canvas responsive
    const updateCanvasSize = () => {
      const container = this.canvas.parentElement;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Maintain aspect ratio (16:9)
      const aspectRatio = 16 / 9;
      let width = containerWidth;
      let height = containerWidth / aspectRatio;

      // If height is too large, scale based on height instead
      if (height > containerHeight) {
        height = containerHeight;
        width = containerHeight * aspectRatio;
      }

      // Set canvas dimensions
      this.canvas.width = width;
      this.canvas.height = height;

      // Adjust entities positions
      if (this.court) this.court.updateDimensions(width, height);
      if (this.player) this.player.updateDimensions(width, height);
      if (this.opponent) this.opponent.updateDimensions(width, height);
      if (this.shuttlecock) this.shuttlecock.updateDimensions(width, height);
    };

    // Update canvas size initially
    updateCanvasSize();

    // Update canvas size on window resize
    window.addEventListener('resize', updateCanvasSize);
  }

  private loadImage() {
    this.img = new Image();
    this.img.src = 'src/assets/badminton.png';
    this.img.onload = () => {
      this.resume();
    };
    this.img.onerror = () => {
      console.error('Failed to load image');
    };
  }

  public start() {
    if (this.animationFrameId) return;
    this.lastTimestamp = performance.now();
    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  public stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Clean up event listeners
    this.inputHandler.dispose();
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    this.isPaused = false;
    if (!this.animationFrameId) {
      this.lastTimestamp = performance.now();
      this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  public restart() {
    this.playerScore = 0;
    this.opponentScore = 0;
    this.resetPositions();
    this.notifyScoreUpdate();
    this.powerupManager.clearPowerups();
    this.notifyPowerupChange(null);
  }

  private gameLoop(timestamp: number) {
    // Calculate delta time
    const deltaTime = (timestamp - this.lastTimestamp) / 1000; // convert to seconds
    this.lastTimestamp = timestamp;

    if (!this.isPaused) {
      this.update(deltaTime);
      this.render();
    }

    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  private update(deltaTime: number) {
    // Get input
    const input = this.inputHandler.getInput();

    // Update player
    this.player.update(deltaTime, input);

    // Update opponent AI
    this.opponent.update(deltaTime, this.shuttlecock);

    // Update shuttlecock
    this.shuttlecock.update(deltaTime);

    // Physics checks
    this.handleCollisions();

    // Update powerups
    const activePowerup = this.powerupManager.update(deltaTime);
    if (activePowerup !== this.powerupManager.lastNotifiedPowerup) {
      this.notifyPowerupChange(activePowerup);
      this.powerupManager.lastNotifiedPowerup = activePowerup;
    }

    // Apply powerups effects
    if (activePowerup) {
      if (activePowerup === 'Speed Boost') {
        this.player.speedBoost = true;
      } else if (activePowerup === 'Power Hit') {
        this.player.powerHit = true;
      } else if (activePowerup === 'Misdirection') {
        this.shuttlecock.misdirection = true;
      }
    } else {
      this.player.speedBoost = false;
      this.player.powerHit = false;
      this.shuttlecock.misdirection = false;
    }

    // Update particles
    this.particleSystem.update(deltaTime);

    // Check for scoring
    this.checkScoring();

    // Spawn powerups occasionally - increased spawn rate for better testing
    if (Math.random() < 0.005) { // 5x more likely to spawn
      // Get player's movement constraints using public methods
      const playerMaxX = this.player.getMaxX();
      const playerMinY = this.player.getMinY();
      const playerMaxY = this.player.getMaxY();
      
      // Spawn powerup within player's reachable area
      this.powerupManager.spawnPowerupInPlayerRange(
        playerMaxX,
        playerMaxY,
        playerMinY,
        this.canvas.width
      );
    }
  }

  private handleCollisions() {
    // Player hitting shuttlecock
    if (this.physics.checkPlayerHit(this.player, this.shuttlecock) &&
      this.lastHitter !== 'player' &&
      this.inputHandler.getInput().hit) {

      this.shuttlecock.hit(this.player.x, this.player.y, this.player.powerHit);
      this.lastHitter = 'player';

      // Add hit particle effect
      this.particleSystem.createHitEffect(this.shuttlecock.x, this.shuttlecock.y);

      // Simulate sound effect
      console.log('Sound: hit');
    }

    // Opponent hitting shuttlecock
    if (this.physics.checkOpponentHit(this.opponent, this.shuttlecock) &&
      this.lastHitter !== 'opponent') {

      this.shuttlecock.hit(this.opponent.x, this.opponent.y, false, true);
      this.lastHitter = 'opponent';

      // Add hit particle effect
      this.particleSystem.createHitEffect(this.shuttlecock.x, this.shuttlecock.y);

      // Simulate sound effect
      console.log('Sound: hit');
    }

    // Check player collision with powerup icons
    this.checkPowerupCollisions();

    // Shuttlecock hitting court boundaries
    const courtBounds = this.court.getBounds();
    if (this.shuttlecock.x < courtBounds.left) {
      this.shuttlecock.x = courtBounds.left;
      this.shuttlecock.vx *= -0.8;
    } else if (this.shuttlecock.x > courtBounds.right) {
      this.shuttlecock.x = courtBounds.right;
      this.shuttlecock.vx *= -0.8;
    }

    // Shuttlecock hitting top boundary (ceiling)
    if (this.shuttlecock.y < courtBounds.top) {
      this.shuttlecock.y = courtBounds.top;
      this.shuttlecock.vy *= -0.8;
    }
  }

  // New method to check for powerup collisions
  private checkPowerupCollisions() {
    const playerBounds = this.player.getBounds();

    // Check if player collides with any powerup icon
    const collectedPowerup = this.powerupManager.checkCollisions(playerBounds);

    if (collectedPowerup) {
      // Create a particle effect when collecting powerup
      this.particleSystem.createPowerupCollectEffect(
        collectedPowerup.x,
        collectedPowerup.y,
        collectedPowerup.type
      );

      // Play collection sound
      console.log(`Sound: collect-${collectedPowerup.type}`);
    }
  }

  private checkScoring() {
    // Check if shuttlecock has hit the ground
    if (this.shuttlecock.y > this.court.getFloorY()) {
      // Determine which side the shuttlecock landed on
      const midX = this.canvas.width / 2;
      
      // Enhanced scoring logic
      if (this.shuttlecock.x < midX) {
        // Landed on player side
        if (this.lastHitter === 'player') {
          // Player hit it last and it landed on their side - CPU gets the point
          this.opponentScore++;
          this.notifyScoreUpdate();
          console.log('Sound: point-cpu');
        } else if (this.lastHitter === 'opponent') {
          // CPU failed to return properly - Player gets the point
          this.playerScore++;
          this.notifyScoreUpdate();
          console.log('Sound: point-player');
        } else {
          // No one hit it - standard rules (serve fault)
          this.opponentScore++;
          this.notifyScoreUpdate();
          console.log('Sound: point');
        }
      } else {
        // Landed on opponent side
        if (this.lastHitter === 'opponent') {
          // CPU hit it last and it landed on their side - Player gets the point
          this.playerScore++;
          this.notifyScoreUpdate();
          console.log('Sound: point-player');
        } else if (this.lastHitter === 'player') {
          // Player hit it and CPU failed to return - Player gets the point
          this.playerScore++;
          this.notifyScoreUpdate();
          console.log('Sound: point-player');
        } else {
          // No one hit it - standard rules (serve fault)
          this.playerScore++;
          this.notifyScoreUpdate();
          console.log('Sound: point');
        }
      }

      // Reset positions for next rally
      this.resetPositions();
    }
  }

  private resetPositions() {
    // Reset player position
    this.player.reset();

    // Reset opponent position
    this.opponent.reset();

    // Reset shuttlecock position (starting serve)
    this.shuttlecock.reset();

    // Reset last hitter
    this.lastHitter = null;
  }

  private render() {
    if (!this.img) return; // Prevent rendering before image is loaded

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render court
    this.court.render(this.ctx);

    // Render player
    this.player.render(this.ctx, this.img);

    // Render opponent
    this.opponent.render(this.ctx, this.img);

    // Render shuttlecock
    this.shuttlecock.render(this.ctx);

    // Render particles
    this.particleSystem.render(this.ctx);

    // Render powerups
    this.powerupManager.render(this.ctx);

    // Render trajectory prediction
    if (this.lastHitter) {
      this.renderTrajectory();
    }
  }

  private renderTrajectory() {
    // Render a dotted line showing predicted trajectory of shuttlecock
    const positions = this.physics.predictTrajectory(
      this.shuttlecock.x,
      this.shuttlecock.y,
      this.shuttlecock.vx,
      this.shuttlecock.vy,
      this.shuttlecock.gravity,
      this.court.getFloorY()
    );

    // Draw the trajectory
    this.ctx.beginPath();
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.lineWidth = 2;

    for (let i = 0; i < positions.length; i++) {
      if (i === 0) {
        this.ctx.moveTo(positions[i].x, positions[i].y);
      } else {
        this.ctx.lineTo(positions[i].x, positions[i].y);
      }
    }

    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  // Event subscription methods
  public onScoreUpdate(callback: (playerScore: number, opponentScore: number) => void) {
    this.scoreUpdateCallbacks.push(callback);
    // Return a function to unsubscribe
    return () => {
      this.scoreUpdateCallbacks = this.scoreUpdateCallbacks.filter(cb => cb !== callback);
    };
  }

  public onPowerupChange(callback: (powerup: string | null) => void) {
    this.powerupChangeCallbacks.push(callback);
    // Return a function to unsubscribe
    return () => {
      this.powerupChangeCallbacks = this.powerupChangeCallbacks.filter(cb => cb !== callback);
    };
  }

  private notifyScoreUpdate() {
    this.scoreUpdateCallbacks.forEach(callback => {
      callback(this.playerScore, this.opponentScore);
    });
  }

  private notifyPowerupChange(powerup: string | null) {
    this.powerupChangeCallbacks.forEach(callback => {
      callback(powerup);
    });
  }
}
