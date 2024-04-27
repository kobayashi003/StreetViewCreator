import React, { useState, useEffect, useRef } from 'react';
import './User.css';

interface ImageData {
  data: string[];
  coordinates?: Coordinates[][];
}

interface Coordinates {
  x: number;
  y: number;
  floor: number;
}

const App: React.FC = () => {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ x: number; y: number; floor: number }[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<number>(0);
  const [connectClicked, setConnectClicked] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/pseudo_data.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        const coordinates: Coordinates[][] = [
          [
            { x: data[0][0]["photo_location"][0], y: data[0][0]["photo_location"][1], floor: 0 },
            { x: data[0][1]["photo_location"][0], y: data[0][1]["photo_location"][1], floor: 0 },
            { x: data[0][2]["photo_location"][0], y: data[0][2]["photo_location"][1], floor: 0 },
            { x: data[0][3]["photo_location"][0], y: data[0][3]["photo_location"][1], floor: 0 }
          ],
          [
            { x: data[1][0]["photo_location"][0], y: data[1][0]["photo_location"][1], floor: 1 },
            { x: data[1][1]["photo_location"][0], y: data[1][1]["photo_location"][1], floor: 1 },
            { x: data[1][2]["photo_location"][0], y: data[1][2]["photo_location"][1], floor: 1 }
          ]
        ];

        const imageDataObj: ImageData = {
          data: data.encoded_sketch_images,
          coordinates: coordinates,
        };

        setImageData(imageDataObj);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading && imageData) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      const image = new Image();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        const floorCoordinates = imageData.coordinates;
        if (floorCoordinates) {
          context.fillStyle = 'red';
          floorCoordinates.forEach(floor => {
            floor.forEach(coord => {
              if (coord.floor === selectedFloor) {
                context.beginPath();
                context.arc(coord.x, coord.y, 5, 0, Math.PI * 2);
                context.fill();
              }
            });
          });
        }

        if (connectClicked && selectedCoordinates.length === 2) {
          context.strokeStyle = 'blue';
          context.beginPath();
          context.moveTo(selectedCoordinates[0].x, selectedCoordinates[0].y);
          context.lineTo(selectedCoordinates[1].x, selectedCoordinates[1].y);
          context.stroke();
        }
      };
      image.src = `data:image/jpeg;base64,${imageData.data[selectedFloor]}`;
    }
  }, [loading, imageData, selectedFloor, selectedCoordinates, connectClicked]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    if (connectClicked && imageData && imageData.coordinates) {
      const clickedCoordinate = imageData.coordinates[selectedFloor].find(coord => {
        const distance = Math.sqrt(Math.pow(clickX - coord.x, 2) + Math.pow(clickY - coord.y, 2));
        return distance < 10;
      });

      if (clickedCoordinate && selectedCoordinates.length < 2) {
        setSelectedCoordinates(prevCoordinates => [...prevCoordinates, clickedCoordinate]);
      }
    }
  };

  const handleFloorChange = (floorIndex: number) => {
    setSelectedFloor(floorIndex);
  };

  const handleConnectClick = () => {
    setConnectClicked(true);
  };

  const handleDisconnectClick = () => {
    setSelectedCoordinates([]);
    setConnectClicked(false);
  };

  return (
    <div className="App">
      <div className="floor-buttons">
        <button onClick={() => handleFloorChange(0)}>1F</button>
        <button onClick={() => handleFloorChange(1)}>2F</button>
      </div>

      <div className="imageContainer">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="mainImage-top">
              <h2>Floor Map</h2>
            </div>
            <canvas
              ref={canvasRef}
              className="mainImage"
              onClick={handleCanvasClick}
            />
          </>
        )}
      </div>

      {connectClicked && (
        <div className="selected-coordinates">
          {selectedCoordinates.map((coordinate, index) => (
            <p key={index}>Selected Coordinate {index + 1} (Floor {coordinate.floor}): ({coordinate.x}, {coordinate.y})</p>
          ))}
        </div>
      )}

      <button className="connect-button" onClick={handleConnectClick}>Connect</button>
      <button className="disconnect-button" onClick={handleDisconnectClick}>Disconnect</button>
    </div>
  );
}

export default App;
