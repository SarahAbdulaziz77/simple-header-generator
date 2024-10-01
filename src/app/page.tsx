
// const HomePage = () => {
//   return (
//     <div>
//       <h1>Home page</h1>
//       <p>welcome to next js</p>
//     </div>
//   )
// }

// export default HomePage

"use client";  // This marks the component as a client-side component

import { useRef, useState, useEffect } from 'react';

const HomePage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [name, setName] = useState('');
  const [canvasWidth, setCanvasWidth] = useState(800);  // Responsive canvas width
  const [canvasHeight, setCanvasHeight] = useState(200); // Responsive canvas height

  // Function to update canvas size based on the screen size (responsive)
  const updateCanvasSize = () => {
    const maxWidth = 800;  // Set maximum width (desktop)
    const minWidth = 500;  // Set minimum width for better readability on mobile
    
    const width = Math.min(Math.max(window.innerWidth * 0.95, minWidth), maxWidth);
    const height = width / 4;  // Keep a 4:1 aspect ratio
    setCanvasWidth(width);
    setCanvasHeight(height);
  };

  // Adjust canvas size on initial render and when the window resizes
  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Function to draw the Falcon header and name on the canvas with high DPI
  const drawHeader = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution to a higher DPI (3x scaling for even better resolution)
    const scaleFactor = 3;  // Increased scaling for higher resolution
    canvas.width = canvasWidth * scaleFactor;  // High resolution width
    canvas.height = canvasHeight * scaleFactor;  // High resolution height
    canvas.style.width = `${canvasWidth}px`;  // CSS width remains responsive
    canvas.style.height = `${canvasHeight}px`;  // CSS height remains responsive

    // Scale the drawing context
    ctx.scale(scaleFactor, scaleFactor);

    // Enable high-quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';  // Set to high for best quality

    // Load the Falcon image
    const img = new Image();
    img.src = '/assets/falcons.jpg';  // Ensure the image is in the public/assets folder

    img.onload = () => {
      // Clear the canvas (with scaling in mind)
      ctx.clearRect(0, 0, canvas.width / scaleFactor, canvas.height / scaleFactor);

      // Draw the image (adjusting for scaleFactor)
      ctx.drawImage(img, 0, 0, canvas.width / scaleFactor, canvas.height / scaleFactor);

      // Set a dynamic font size based on the canvas width
      const fontSize = Math.max(20, Math.min(40, canvasWidth / 22));  // Font size scales with canvas width
      ctx.font = `${fontSize}px Amiri`;  // Set the font dynamically
      ctx.textAlign = 'left';  // Align the text to the left horizontally
      ctx.textBaseline = 'middle';  // Align the text to the middle vertically

      // Use percentages to position the text so it stays consistent across devices
      const textX = canvasWidth * 0.20;  // X position as 12% of the canvas width (adjust as needed)
      const textY = canvasHeight * 0.50; // Y position as 55% of the canvas height

      // Create the 3D shadow effect by drawing the text slightly offset for a shadow
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = `rgba(0, 0, 0, ${0.1 * (i + 1)})`;  // Shadow color with increasing opacity
        ctx.fillText(name, textX + i, textY + i);  // Adjust text position slightly for shadow effect
      }

      // Draw the main text on top with a brighter beige/gold color
      ctx.fillStyle = '#f1e3b3';  // Brighter beige/gold color for the main text
      ctx.fillText(name, textX, textY);  // Main text positioned
    };

    img.onerror = () => {
      console.error('Image failed to load.');
    };
  };

  // Function to save the canvas image as a PNG
  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'falcon-header.png';
    link.href = canvas.toDataURL();  
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-white-500 p-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">!طقم مع فالكونز</h1>

      {/* Input field for the user's name */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="p-3 w-full max-w-sm text-lg text-center rounded-lg shadow-md mb-4 border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Button to trigger the canvas drawing */}
      <button
        onClick={drawHeader}
        className="px-6 py-3 bg-white text-green-500 font-semibold rounded-lg shadow-md hover:bg-blue-50 mb-6"
      >
        Generate Header
      </button>

      {/* Center the canvas */}
      <div className="flex justify-center w-full">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border-2 border-white shadow-lg"
        ></canvas>
      </div>

      {/* Button to save the generated image */}
      <button
        onClick={saveImage}
        className="mt-6 px-6 py-3 bg-white text-green-500 font-semibold rounded-lg shadow-md hover:bg-blue-50"
      >
        Save Header
      </button>
    </div>
  );
}

export default HomePage;
