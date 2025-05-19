export class Physics {
  constructor() {
    // Initialize physics parameters
  }
  
  public checkPlayerHit(player: any, shuttlecock: any) {
    // Get player bounds
    const playerBounds = player.getBounds();
    
    // Get shuttlecock position
    const shuttlecockX = shuttlecock.x;
    const shuttlecockY = shuttlecock.y;
    
    // Calculate distance
    const playerCenterX = playerBounds.x + playerBounds.width / 2;
    const playerCenterY = playerBounds.y + playerBounds.height / 2;
    const dx = shuttlecockX - playerCenterX;
    const dy = shuttlecockY - playerCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Increase hit radius and make it more forgiving
    const hitRadius = playerBounds.width * 2.5; // Increased from 1.5
    
    // Add a height check to prevent hitting through the floor
    const heightCheck = shuttlecockY < playerBounds.y + playerBounds.height * 1.5;
    
    return distance < hitRadius && heightCheck;
  }
  
  public checkOpponentHit(opponent: any, shuttlecock: any) {
    // Similar to player hit check but with opponent-specific adjustments
    const opponentBounds = opponent.getBounds();
    
    // Get shuttlecock position
    const shuttlecockX = shuttlecock.x;
    const shuttlecockY = shuttlecock.y;
    
    // Calculate distance
    const opponentCenterX = opponentBounds.x + opponentBounds.width / 2;
    const opponentCenterY = opponentBounds.y + opponentBounds.height / 2;
    const dx = shuttlecockX - opponentCenterX;
    const dy = shuttlecockY - opponentCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Use same hit radius as player for consistency
    const hitRadius = opponentBounds.width * 2.5;
    
    // Add height check
    const heightCheck = shuttlecockY < opponentBounds.y + opponentBounds.height * 1.5;
    
    return distance < hitRadius && heightCheck;
  }
  
  public predictTrajectory(
    startX: number,
    startY: number,
    velocityX: number,
    velocityY: number,
    gravity: number,
    floorY: number
  ) {
    const positions: { x: number; y: number }[] = [];
    let x = startX;
    let y = startY;
    let vx = velocityX;
    let vy = velocityY;
    const timeStep = 0.1; // seconds
    const maxPoints = 20;
    
    // Predict trajectory until shuttlecock hits floor or max points reached
    for (let i = 0; i < maxPoints; i++) {
      // Update velocity
      vy += gravity * timeStep;
      
      // Apply air resistance
      vx *= 0.99;
      vy *= 0.99;
      
      // Update position
      x += vx * timeStep;
      y += vy * timeStep;
      
      // Add position to trajectory
      positions.push({ x, y });
      
      // Stop if shuttlecock hits floor
      if (y > floorY) {
        break;
      }
    }
    
    return positions;
  }
}