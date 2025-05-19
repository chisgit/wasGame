export class Court {
  private width: number;
  private height: number;
  private floorY: number;
  private netHeight: number;
  private cherryBlossoms: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];
  
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.floorY = height * 0.85;
    this.netHeight = height * 0.15;
    
    // Create cherry blossom particles
    this.initCherryBlossoms();
  }
  
  private initCherryBlossoms() {
    const numBlossoms = Math.floor(this.width / 30);
    
    for (let i = 0; i < numBlossoms; i++) {
      this.cherryBlossoms.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height * 0.7,
        size: 3 + Math.random() * 5,
        alpha: 0.3 + Math.random() * 0.7,
        speed: 0.2 + Math.random() * 0.8
      });
    }
  }
  
  public updateDimensions(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.floorY = height * 0.85;
    this.netHeight = height * 0.15;
    
    // Reinitialize cherry blossoms
    this.cherryBlossoms = [];
    this.initCherryBlossoms();
  }
  
  public render(ctx: CanvasRenderingContext2D) {
    // Draw sky background with gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, this.floorY);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#6a92f0');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, this.width, this.floorY);
    
    // Draw cherry blossoms
    this.renderCherryBlossoms(ctx);
    
    // Draw distant mountains
    this.drawMountains(ctx);
    
    // Draw court floor
    const floorGradient = ctx.createLinearGradient(0, this.floorY, 0, this.height);
    floorGradient.addColorStop(0, '#98FB98');
    floorGradient.addColorStop(1, '#78cd78');
    ctx.fillStyle = floorGradient;
    ctx.fillRect(0, this.floorY, this.width, this.height - this.floorY);
    
    // Draw court lines
    this.drawCourtLines(ctx);
    
    // Draw net
    this.drawNet(ctx);
    
    // Draw Torii gate in the background
    this.drawToriiGate(ctx);
  }
  
  private renderCherryBlossoms(ctx: CanvasRenderingContext2D) {
    // Update and draw cherry blossoms
    for (let i = 0; i < this.cherryBlossoms.length; i++) {
      const blossom = this.cherryBlossoms[i];
      
      // Move blossom
      blossom.x += Math.sin(blossom.y * 0.01) * 0.5;
      blossom.y += blossom.speed;
      
      // Reset if out of bounds
      if (blossom.y > this.floorY) {
        blossom.x = Math.random() * this.width;
        blossom.y = -10;
        blossom.speed = 0.2 + Math.random() * 0.8;
      }
      
      // Draw blossom
      ctx.fillStyle = `rgba(255, 183, 197, ${blossom.alpha})`;
      ctx.beginPath();
      ctx.arc(blossom.x, blossom.y, blossom.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  private drawMountains(ctx: CanvasRenderingContext2D) {
    // Draw distant mountains
    ctx.fillStyle = '#9494c9';
    
    // First mountain range
    ctx.beginPath();
    ctx.moveTo(0, this.floorY);
    
    const numPeaks = 5;
    const peakWidth = this.width / numPeaks;
    
    for (let i = 0; i <= numPeaks; i++) {
      const x = i * peakWidth;
      const y = this.floorY - (Math.sin((i / numPeaks) * Math.PI) * this.height * 0.2);
      
      if (i === 0) {
        ctx.lineTo(x, y);
      } else {
        const cpx1 = x - peakWidth * 0.6;
        const cpy1 = y + (Math.random() * 20 - 10);
        const cpx2 = x - peakWidth * 0.3;
        const cpy2 = y + (Math.random() * 20 - 10);
        
        ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y);
      }
    }
    
    ctx.lineTo(this.width, this.floorY);
    ctx.fill();
  }
  
  private drawCourtLines(ctx: CanvasRenderingContext2D) {
    // Draw court lines
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    
    // Center line
    ctx.beginPath();
    ctx.moveTo(this.width / 2, this.floorY);
    ctx.lineTo(this.width / 2, this.height);
    ctx.stroke();
    
    // Service lines
    const serviceLineY = this.floorY + (this.height - this.floorY) * 0.3;
    
    ctx.beginPath();
    ctx.moveTo(0, serviceLineY);
    ctx.lineTo(this.width, serviceLineY);
    ctx.stroke();
    
    // Court boundary
    ctx.beginPath();
    ctx.strokeRect(this.width * 0.05, this.floorY, this.width * 0.9, this.height - this.floorY);
  }
  
  private drawNet(ctx: CanvasRenderingContext2D) {
    // Draw net
    const netX = this.width / 2;
    const netTop = this.floorY - this.netHeight;
    
    // Net posts
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(netX - 5, netTop - 20, 10, this.netHeight + 20);
    
    // Net
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(netX - 2, netTop, 4, this.netHeight);
    
    // Net mesh
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 0.5;
    
    // Horizontal lines
    const meshSpacing = 10;
    for (let y = netTop; y < this.floorY; y += meshSpacing) {
      ctx.beginPath();
      ctx.moveTo(netX - 20, y);
      ctx.lineTo(netX + 20, y);
      ctx.stroke();
    }
    
    // Vertical lines
    for (let x = netX - 20; x <= netX + 20; x += meshSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, netTop);
      ctx.lineTo(x, this.floorY);
      ctx.stroke();
    }
  }
  
  private drawToriiGate(ctx: CanvasRenderingContext2D) {
    // Draw a Japanese Torii gate in the background
    const gateWidth = this.width * 0.3;
    const gateX = (this.width - gateWidth) / 2;
    const gateHeight = this.floorY * 0.3;
    const gateY = this.floorY - gateHeight;
    
    // Calculate post positions
    const postWidth = gateWidth * 0.08;
    const leftPostX = gateX;
    const rightPostX = gateX + gateWidth - postWidth;
    
    // Draw posts
    ctx.fillStyle = '#e94e50';
    ctx.fillRect(leftPostX, gateY, postWidth, gateHeight);
    ctx.fillRect(rightPostX, gateY, postWidth, gateHeight);
    
    // Draw top beams
    const beamHeight = gateHeight * 0.1;
    const topBeamY = gateY;
    const lowerBeamY = gateY + beamHeight * 1.5;
    
    // Top curved beam
    ctx.beginPath();
    ctx.moveTo(gateX - postWidth * 0.5, topBeamY);
    ctx.lineTo(gateX + gateWidth + postWidth * 0.5, topBeamY);
    ctx.lineTo(gateX + gateWidth + postWidth * 0.7, topBeamY + beamHeight);
    ctx.lineTo(gateX - postWidth * 0.7, topBeamY + beamHeight);
    ctx.closePath();
    ctx.fillStyle = '#e94e50';
    ctx.fill();
    
    // Lower straight beam
    ctx.fillRect(gateX - postWidth * 0.2, lowerBeamY, gateWidth + postWidth * 0.4, beamHeight);
  }
  
  public getFloorY(): number {
    return this.floorY;
  }
  
  public getBounds() {
    return {
      left: 0,
      right: this.width,
      top: 0,
      bottom: this.height
    };
  }
}