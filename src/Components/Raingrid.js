import React, { useEffect, useState, useRef } from 'react';
import './Raingrid.css';
const gridHeight = 15; // No.of Rows
const gridWidth = 20;  // No.of Columns

const FallingRain = () => {
  const [rains, setRains] = useState([]);

  const generateRains = () => {
    // Generate 3-5 raindrops per cycle
    const numberOfRaindrops = Math.floor(Math.random() * 4) + 4;
    const usedColumns = new Set();
    const newRains = [];
    const randomColor = getRandomBaseColor();

    for (let i = 0; i < numberOfRaindrops; i++) {
      let randomColumn;

      // To Ensure sufficient gap between selected columns
      do {
        randomColumn = Math.floor(Math.random() * gridWidth);
      } while (
        Array.from(usedColumns).some(
          (col) => Math.abs(col - randomColumn) < 2 // Ensure at least gap of 2-column
        )
      );

      usedColumns.add(randomColumn);

      const randomHeight = Math.floor(Math.random() * 6) + 4; // Random height of the raindrop i.e between 4 to 0

      const newRain = {
        column: randomColumn,
        baseColor: randomColor,
        headPosition: 0, 
        height: randomHeight, // Height of the raindrop
        delay: Math.floor(Math.random() * 1000) + 500, // Random delay between 500ms and 1500ms for initialization
      };

      newRains.push(newRain);
    }

    // Initialize raindrops with varying time delays
    newRains.forEach((rain) => {
      setTimeout(() => {
        setRains((prevRains) => [...prevRains, rain]);
      }, rain.delay);
    });
  };

  const getRandomBaseColor = () => {
    const colors = [
      [0, 0, 255], // Blue
      [0, 255, 0], // Green
      [255, 0, 0], // Red
      [255, 255, 0], // Yellow
      [0, 255, 255], // Cyan
      [255, 0, 255], // Magenta
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getShade = (baseColor, positionInHeight, totalHeight) => {
    const fadeFactor = 1 - positionInHeight / totalHeight; 
    return `rgb(${Math.floor(baseColor[0] * fadeFactor)}, 
                ${Math.floor(baseColor[1] * fadeFactor)}, 
                ${Math.floor(baseColor[2] * fadeFactor)})`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRains((prevRains) =>
        prevRains
          .map((rain) => {
            if (rain.headPosition < gridHeight) {
              return { ...rain, headPosition: rain.headPosition + 1 };
            } else {
              return null; // For Removing raindrop when it goes out of the grid
            }
          })
          .filter(Boolean)
      );
    }, 75); // Faster raindrop movement

    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const generateWithRandomInterval = () => {
      generateRains(); // Generates raindrops with varying delays
    };

    const rainInterval = setInterval(generateWithRandomInterval, 1500); // To Generate new raindrops every 1.5 seconds
    return () => clearInterval(rainInterval); 
  }, []);
 
  

  return (
    <div className="container">
      <h1 style={{color:'white'}}>FALLING RAIN</h1>
     
      <audio autoPlay  loop unmuted >
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

     
      <div className="grid">
        {Array.from({ length: gridHeight }, (_, rowIndex) =>
          Array.from({ length: gridWidth }, (_, colIndex) => {
            const rain = rains.find((r) =>r.column === colIndex && r.headPosition - r.height <= rowIndex && r.headPosition >= rowIndex );
 const color = rain? getShade(rain.baseColor,rain.headPosition - rowIndex, rain.height): 'transparent';

            return (
              <div
                key={`${rowIndex}-${colIndex}`} className="cell"
                style={{
                  backgroundColor: color,
                  border: '1px solid lightgray',
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default FallingRain;
