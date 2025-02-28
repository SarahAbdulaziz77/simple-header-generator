"use client";

import { useRef, useState, useEffect } from "react";

const HomePage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [name, setName] = useState("");
  const [canvasWidth, setCanvasWidth] = useState(800); // Default width
  const [canvasHeight, setCanvasHeight] = useState(800); // Default height
  const [isMobile, setIsMobile] = useState(false);

  // Function to update canvas size
  const updateCanvasSize = () => {
    const width = Math.min(window.innerWidth * 0.9, 800);
    const height = width;
    setCanvasWidth(width);
    setCanvasHeight(height);
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  // Function to draw image and text inside the brown area
  const drawImageWithText = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = "/assets/ramadan.jpg"; // Ensure image is in the public/assets folder

    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Keep it responsive
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;

      // Draw image
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Format name (uppercase if English)
      const finalName = /^[A-Za-z]+$/.test(name) ? name.toUpperCase() : name;

      // 🔹 **Set Font Size Based on Brown Bar Height**
      let fontSize = img.height * 0.03  ; // Adjust based on image height
      ctx.font = `${fontSize}px Cairo`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // 🔹 **Fix Text Placement Inside Brown Area**
      const textX = img.width / 2; // Centered horizontally
      const textY = img.height * 0.71; // Adjusted for brown area

      // **Apply a shadow effect for better readability**
      for (let i = 0; i < 4; i++) {
        ctx.fillText(finalName, textX + i, textY + i);
      }

      // **Final text (inside brown area)**
      ctx.fillStyle = "#ffffff"; // Light beige/gold color
      ctx.fillText(finalName, textX, textY);
    };

    img.onerror = () => {
      console.error("Image failed to load.");
    };
  };

  // Function to save the image
  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "ramadan-greeting.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">
        🎉 رمضان مبارك! أضف اسمك هنا ✨
      </h1>

      {/* Input for user text */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="اكتب اسمك هنا"
        className="p-3 w-full max-w-sm text-lg text-center rounded-lg shadow-md mb-4 border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Button to generate the customized image */}
      <button
        onClick={drawImageWithText}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 mb-6"
      >
        🎨 توليد الصورة
      </button>

      {/* Canvas for drawing the image */}
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
        className="mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600"
      >
        💾 حفظ الصورة
      </button>
    </div>
  );
};

export default HomePage;  