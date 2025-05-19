export class InputHandler {
  private keys: {
    ArrowLeft: boolean;
    ArrowRight: boolean;
    ArrowUp: boolean;
    ArrowDown: boolean;
    KeyA: boolean;
    KeyD: boolean;
    KeyW: boolean;
    KeyS: boolean;
    Space: boolean;
    ShiftLeft: boolean;
  };
  
  private mousePosition: { x: number; y: number };
  private mouseButtons: { left: boolean; right: boolean };
  private touchPosition: { x: number; y: number } | null;
  private touchActive: boolean;
  private canvas: HTMLCanvasElement;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    
    // Initialize keyboard state
    this.keys = {
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ArrowDown: false,
      KeyA: false,
      KeyD: false,
      KeyW: false,
      KeyS: false,
      Space: false,
      ShiftLeft: false
    };
    
    // Initialize mouse state
    this.mousePosition = { x: 0, y: 0 };
    this.mouseButtons = { left: false, right: false };
    
    // Initialize touch state
    this.touchPosition = null;
    this.touchActive = false;
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  private setupEventListeners() {
    // Keyboard events
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    
    // Mouse events
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Touch events
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }
  
  private handleKeyDown(e: KeyboardEvent) {
    // Update key state
    if (e.code in this.keys) {
      // TypeScript doesn't like dynamic property access
      (this.keys as any)[e.code] = true;
    }
    
    // Prevent default behavior for game controls
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
      e.preventDefault();
    }
  }
  
  private handleKeyUp(e: KeyboardEvent) {
    // Update key state
    if (e.code in this.keys) {
      // TypeScript doesn't like dynamic property access
      (this.keys as any)[e.code] = false;
    }
  }
  
  private handleMouseMove(e: MouseEvent) {
    // Update mouse position
    const rect = this.canvas.getBoundingClientRect();
    this.mousePosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }
  
  private handleMouseDown(e: MouseEvent) {
    // Update mouse button state
    if (e.button === 0) {
      this.mouseButtons.left = true;
    } else if (e.button === 2) {
      this.mouseButtons.right = true;
    }
  }
  
  private handleMouseUp(e: MouseEvent) {
    // Update mouse button state
    if (e.button === 0) {
      this.mouseButtons.left = false;
    } else if (e.button === 2) {
      this.mouseButtons.right = false;
    }
  }
  
  private handleTouchStart(e: TouchEvent) {
    e.preventDefault();
    
    if (e.touches.length > 0) {
      const rect = this.canvas.getBoundingClientRect();
      this.touchPosition = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
      this.touchActive = true;
    }
  }
  
  private handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    
    if (e.touches.length > 0 && this.touchActive) {
      const rect = this.canvas.getBoundingClientRect();
      this.touchPosition = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
  }
  
  private handleTouchEnd(e: TouchEvent) {
    e.preventDefault();
    this.touchActive = false;
  }
  
  public getInput() {
    // Combine keyboard input
    const left = this.keys.ArrowLeft || this.keys.KeyA;
    const right = this.keys.ArrowRight || this.keys.KeyD;
    const up = this.keys.ArrowUp || this.keys.KeyW;
    const down = this.keys.ArrowDown || this.keys.KeyS;
    
    // Determine if hit button is pressed
    const hit = this.keys.Space || this.mouseButtons.left;
    
    // Determine if power hit is activated
    const powerHit = (this.keys.Space && this.keys.ShiftLeft) || this.mouseButtons.right;
    
    return {
      left,
      right,
      up,
      down,
      hit,
      powerHit,
      mousePosition: this.mousePosition,
      touchPosition: this.touchPosition,
      touchActive: this.touchActive
    };
  }
  
  public dispose() {
    // Remove event listeners
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
    this.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.canvas.removeEventListener('touchend', this.handleTouchEnd.bind(this));
  }
}