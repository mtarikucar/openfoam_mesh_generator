import React, { useRef, useEffect } from 'react';

function Canvas  ({ recHeight, recWidth, ellipseHeight, ellipseWidth,cellCount }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the rectangle
        context.fillStyle = 'skyblue';
        context.fillRect(0, 0, recWidth, recHeight);

        // Draw the ellipse
        context.globalCompositeOperation = 'destination-out';
        const centerX = recWidth / 2;
        const centerY = recHeight / 2;
        context.beginPath();
        context.ellipse(centerX, centerY, ellipseWidth / 2, ellipseHeight / 2, 0, 0, 2 * Math.PI);
        context.fill();

        // Reset the globalCompositeOperation to default
        context.globalCompositeOperation = 'source-over';
    }, [recHeight, recWidth, ellipseHeight, ellipseWidth]);

    return <canvas ref={canvasRef} width={recWidth} height={recHeight} />;
};

export default Canvas;