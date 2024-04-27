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
  const [data,setdata]=useState<data | null>(null);
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
 
        const imageDataObj: ImageData = {          
          data: data.encoded_sketch_images,
          // coordinates: data,
          
        };
        console.log(`data確認あああ${data["0"]["0"]["photo_direction"]["0"]}`)
        ImageData.date



        setImageData(imageDataObj);
        setdate(dataObj);
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
      image.src = `data:image/jpeg;base64,${imageData.data[0]}`;
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

  return (
    <div className="App">
      <div className="floor-buttons">
        <button onClick={() => handleFloorChange(0)}>1F</button>
        <button onClick={() => handleFloorChange(1)}>2F</button>
        <button onClick={() => handleFloorChange(2)}>3F</button>
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
            <p key={index}>Selected Coordinate {index + 1}: ({coordinate.x}, {coordinate.y})</p>
          ))}
        </div>
      )}

      <button className="connect-button" onClick={handleConnectClick}>Connect</button>
    </div>
  );
}

export default App;
