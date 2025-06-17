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
  
  // Touch-specific properties
  private touchStartTime: number = 0;
  private touchStartPosition: { x: number; y: number } | null = null;
  private lastTouchPosition: { x: number; y: number } | null = null;
  private touchMoveThreshold: number = 10;
  private doubleTapThreshold: number = 300; // ms
  private lastTapTime: number = 0;
  private swipeDetected: boolean = false;
  private touchHoldTimer: number | null = null;
  
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
    
    // Touch events with improved handling
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    this.canvas.addEventListener('touchcancel', this.handleTouchEnd.bind(this), { passive: false });
  }
  
  private handleKeyDown(e: KeyboardEvent) {
    // Update key state
    if (e.code in this.keys) {
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
      const touch = e.touches[0];
      
      this.touchPosition = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
      
      this.touchStartPosition = { ...this.touchPosition };
      this.lastTouchPosition = { ...this.touchPosition };
      this.touchActive = true;
      this.touchStartTime = Date.now();
      this.swipeDetected = false;
      
      // Clear any existing hold timer
      if (this.touchHoldTimer) {
        clearTimeout(this.touchHoldTimer);
      }
      
      // Set up hold timer for power shot (500ms hold)
      this.touchHoldTimer = window.setTimeout(() => {
        // Trigger power shot on long hold
        this.keys.ShiftLeft = true;
        this.keys.Space = true;
      }, 500);
    }
  }
  
  private handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    
    if (e.touches.length > 0 && this.touchActive && this.touchStartPosition) {
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      
      this.touchPosition = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
      
      // Calculate movement from start position
      const deltaX = this.touchPosition.x - this.touchStartPosition.x;
      const deltaY = this.touchPosition.y - this.touchStartPosition.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // If significant movement, treat as directional input
      if (distance > this.touchMoveThreshold) {
        // Clear hold timer since user is moving
        if (this.touchHoldTimer) {
          clearTimeout(this.touchHoldTimer);
          this.touchHoldTimer = null;
        }
        
        // Determine primary direction
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        
        // Reset all directional keys
        this.keys.ArrowLeft = false;
        this.keys.ArrowRight = false;
        this.keys.ArrowUp = false;
        this.keys.ArrowDown = false;
        
        // Set directional keys based on movement
        if (absX > absY) {
          // Horizontal movement is dominant
          if (deltaX > 0) {
            this.keys.ArrowRight = true;
          } else {
            this.keys.ArrowLeft = true;
          }
        } else {
          // Vertical movement is dominant
          if (deltaY > 0) {
            this.keys.ArrowDown = true;
          } else {
            this.keys.ArrowUp = true;
          }
        }
        
        // Check for swipe gesture (fast movement)
        if (this.lastTouchPosition) {
          const swipeSpeed = distance / (Date.now() - this.touchStartTime);
          if (swipeSpeed > 0.5 && !this.swipeDetected) {
            // Trigger hit on swipe
            this.keys.Space = true;
            this.swipeDetected = true;
          }
        }
      }
      
      this.lastTouchPosition = { ...this.touchPosition };
    }
  }
  
  private handleTouchEnd(e: TouchEvent) {
    e.preventDefault();
    
    // Clear hold timer
    if (this.touchHoldTimer) {
      clearTimeout(this.touchHoldTimer);
      this.touchHoldTimer = null;
    }
    
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - this.touchStartTime;
    
    // Handle tap gestures
    if (this.touchStartPosition && this.touchPosition && touchDuration < 200) {
      const deltaX = this.touchPosition.x - this.touchStartPosition.x;
      const deltaY = this.touchPosition.y - this.touchStartPosition.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // If it's a small movement (tap), handle as hit or double tap
      if (distance < this.touchMoveThreshold) {
        const timeSinceLastTap = touchEndTime - this.lastTapTime;
        
        if (timeSinceLastTap < this.doubleTapThreshold) {
          // Double tap - power shot
          this.keys.ShiftLeft = true;
          this.keys.Space = true;
        } else {
          // Single tap - regular hit
          this.keys.Space = true;
        }
        
        this.lastTapTime = touchEndTime;
      }
    }
    
    // Reset touch state
    this.touchActive = false;
    
    // Reset all keys after a short delay to simulate key release
    setTimeout(() => {
      this.keys.ArrowLeft = false;
      this.keys.ArrowRight = false;
      this.keys.ArrowUp = false;
      this.keys.ArrowDown = false;
      this.keys.Space = false;
      this.keys.ShiftLeft = false;
    }, 100);
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
    // Clear any active timers
    if (this.touchHoldTimer) {
      clearTimeout(this.touchHoldTimer);
    }
    
    // Remove event listeners
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
    this.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.canvas.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    this.canvas.removeEventListener('touchcancel', this.handleTouchEnd.bind(this));
  }
}