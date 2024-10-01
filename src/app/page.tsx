
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

import { useRef, useState } from 'react';

const HomePage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [name, setName] = useState('');

  // Function to draw the Falcon header and name on the canvas with high DPI
  const drawHeader = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution to a higher DPI (2x scaling for Retina displays)
    const scaleFactor = 2;  // 2x scaling for better resolution, adjust as needed
    canvas.width = 800 * scaleFactor;  // High resolution width
    canvas.height = 200 * scaleFactor;  // High resolution height
    canvas.style.width = '800px';  // CSS width remains the same
    canvas.style.height = '200px';  // CSS height remains the same

    // Scale the drawing context
    ctx.scale(scaleFactor, scaleFactor);

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;

    // Load the Falcon image
    const img = new Image();
    img.src = '/assets/falcons.jpg';  // Ensure the image is in the public/assets folder

    img.onload = () => {
      // Clear the canvas (with scaling in mind)
      ctx.clearRect(0, 0, canvas.width / scaleFactor, canvas.height / scaleFactor);

      // Draw the image (adjusting for scaleFactor)
      ctx.drawImage(img, 0, 0, canvas.width / scaleFactor, canvas.height / scaleFactor);

      // Set font properties for the 3D text
      ctx.font = 'bold 40px Amiri';  // Use the Amiri font for Arabic-style text
      ctx.textAlign = 'center';  
      ctx.textBaseline = 'middle';  

      // Create the 3D shadow effect by drawing the text slightly to the left
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = `rgba(0, 0, 0, ${0.1 * (i + 1)})`;  // Shadow color with increasing opacity
        ctx.fillText(name, (canvas.width / scaleFactor / 2) - 170 + i, canvas.height / scaleFactor / 2 + i);  // Adjust x position to move further left
      }

      // Draw the main text on top with a brighter beige/gold color
      ctx.fillStyle = '#f1e3b3';  // Brighter beige/gold color for the main text
      ctx.fillText(name, (canvas.width / scaleFactor / 2) - 170, canvas.height / scaleFactor / 2);  // Main text adjusted further left
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-white-500 p-6">
      <h1 className="text-4xl font-bold text-white mb-6">!طقم مع فالكونز</h1>

      {/* Input field for the user's name */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="p-4 w-full max-w-md text-lg text-center rounded-lg shadow-md mb-4 border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Button to trigger the canvas drawing */}
      <button
        onClick={drawHeader}
        className="px-6 py-3 bg-white text-green-500 font-semibold rounded-lg shadow-md hover:bg-blue-50 mb-6"
      >
        Generate Header
      </button>

      {/* Center the canvas */}
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={200}
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
