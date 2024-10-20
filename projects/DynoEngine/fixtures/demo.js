// Sample Entity Implementation
class SomeEntity extends DynoEngine.Destroyable {
    constructor() {
        super();
        this.renderData = {
            x: Math.random() * 800,
            y: Math.random() * 600,
            width: 50,
            height: 50,
            color: 'rgba(0, 255, 0, 0.5)', // Example color
        };
    }

    update(deltaTime) {
        // Update logic for the entity
        // For example: move the entity
        this.renderData.x += Math.sin(Date.now() * 0.001) * 2; // Example movement
    }
}

// Instantiate the Engine
const engine = new DynoEngine.Engine();

// Add some entities
for (let i = 0; i < 10; i++) {
    const entity = new SomeEntity();
    engine.addEntity(entity);
}

// Start the engine
engine.start();
