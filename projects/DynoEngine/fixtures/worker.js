// rendererWorker.js
self.onmessage = function (e) {
    const { entities } = e.data;
    const renderData = [];

    // Process each entity for rendering
    entities.forEach(entity => {
        if (entity.renderData) {
            // Create a render data object
            renderData.push({
                x: entity.renderData.x,
                y: entity.renderData.y,
                width: entity.renderData.width,
                height: entity.renderData.height,
                color: entity.renderData.color, // Example property
            });
        }
    });

    // Send processed render data back to the main thread
    self.postMessage(renderData);
};
