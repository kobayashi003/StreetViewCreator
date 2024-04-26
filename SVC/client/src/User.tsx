import React, { useState, useEffect, useRef } from 'react';
import './User.css';

interface ImageData {
  data: string[];
  coordinates?: Coordinates[][];
}

interface Coordinates {
  x: number;
  y: number;
}

const App: React.FC = () => {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFloor, setSelectedFloor] = useState<number>(0); // 選択された階を管理

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
            { x: data[0][0]["photo_location"][0], y: data[0][0]["photo_location"][1] },
            { x: data[0][1]["photo_location"][0], y: data[0][1]["photo_location"][1] },
            { x: data[0][2]["photo_location"][0], y: data[0][2]["photo_location"][1] },
            { x: data[0][3]["photo_location"][0], y: data[0][3]["photo_location"][1] }
          ],
          [
            { x: data[1][0]["photo_location"][0], y: data[1][0]["photo_location"][1] },
            { x: data[1][1]["photo_location"][0], y: data[1][1]["photo_location"][1] },
            { x: data[1][2]["photo_location"][0], y: data[1][2]["photo_location"][1] }
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
      if (!canvas) return;//画像のローディングの確認

      const context = canvas.getContext('2d');
      if (!context) return;

      const image = new Image();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        // Canvas上に赤い点を描画する処理
        const floorCoordinates = imageData.coordinates;
        if (floorCoordinates) {
          context.fillStyle = 'red'; // 赤い色を指定
          floorCoordinates[selectedFloor].forEach(coord => {
            context.beginPath();
            context.arc(coord.x, coord.y, 5, 0, Math.PI * 2);
            context.fill(); // 塗りつぶし
          });
        }
      };
      image.src = `data:image/jpeg;base64,${imageData.data[selectedFloor]}`;
    }
  }, [loading, imageData, selectedFloor]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    // クリック処理
  };

  const handleFloorChange = (floorIndex: number) => {
    setSelectedFloor(floorIndex);
  };//floorIndexの取得(SelectedFloorという変数に、floorindexを代入し、点の表示のところで使われている)

  return (
    <div className="App">
      {/* 階を選択するボタン */}
      <div className="floor-buttons">
        <button onClick={() => handleFloorChange(0)}>1F</button>
        <button onClick={() => handleFloorChange(1)}>2F</button>
        {/* 追加の階ボタン */}
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
    </div>
  );
}

export default App;
