"use client";  // This marks the component as a client-side component

import { useRef, useState, useEffect } from 'react';

const HomePage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [name, setName] = useState('');
  const [canvasWidth, setCanvasWidth] = useState(1500);  // Twitter header fixed width
  const [canvasHeight, setCanvasHeight] = useState(500);  // Twitter header fixed height
  const [isMobile, setIsMobile] = useState(false);  // Track if the user is on mobile

  // Function to update canvas size based on the screen size (responsive display)
  const updateCanvasSize = () => {
    const maxWidth = 1500;  // Set maximum width to the actual Twitter header width
    const minWidth = 500;  // Set minimum width for better readability on mobile
    
    const width = Math.min(Math.max(window.innerWidth * 0.95, minWidth), maxWidth);
    const height = width / 3;  // Keep a 3:1 aspect ratio to match Twitter's header size
    setCanvasWidth(width);
    setCanvasHeight(height);

    // Check if the current device is mobile (width < 768px)
    setIsMobile(window.innerWidth < 768);
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

    // Ensure English names are uppercase
    const finalName = /^[A-Za-z]+$/.test(name) ? name.toUpperCase() : name;

    // Set canvas resolution to the fixed Twitter header size
    const scaleFactor = 4;  // Increased scaling for higher resolution
    canvas.width = 1500 * scaleFactor;  // Twitter header fixed width for saving
    canvas.height = 500 * scaleFactor;  // Twitter header fixed height for saving
    canvas.style.width = `${canvasWidth}px`;  // CSS width remains responsive for display
    canvas.style.height = `${canvasHeight}px`;  // CSS height remains responsive for display

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
      let fontSize = 80;  // Set a fixed large font size for the text
      ctx.font = `${fontSize}px Amiri`;  // Set the font size

      // Measure the width of the text
      const textWidth = ctx.measureText(finalName).width;

      // Adjust the font size if the text is too long to fit
      if (textWidth > canvasWidth * 0.6) {
        fontSize = fontSize * (canvasWidth * 0.6 / textWidth);  // Scale down font size
        ctx.font = `${fontSize}px Amiri`;  // Update font size based on text length
      }

      ctx.textAlign = 'center';  // Center-align the text based on the circled area
      ctx.textBaseline = 'middle';  // Align the text to the middle vertically

      // Adjust text position slightly based on whether the user is on mobile or not
      const textX = isMobile ? 440 : 420;  // Move text slightly to the right on mobile
      const textY = 250;  // Fixed Y position (based on your screenshot)

      // Create the 3D shadow effect by drawing the text slightly offset for a shadow
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = `rgba(0, 0, 0, ${0.1 * (i + 1)})`;  // Shadow color with increasing opacity
        ctx.fillText(finalName, textX + i, textY + i);  // Adjust text position slightly for shadow effect
      }

      // Draw the main text on top with a brighter beige/gold color
      ctx.fillStyle = '#f1e3b3';  // Brighter beige/gold color for the main text
      ctx.fillText(finalName, textX, textY);  // Main text positioned
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

      {/* Rights info */}
      <p className="text-gray-200 text-sm mb-6">Done by: @TheChampiion8</p>


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
