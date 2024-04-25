import React, { useState } from 'react';
import './EditCss.css';

function App() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedCount, setSelectedCount] = useState<number>(1);
  const [editImageIndex, setEditImageIndex] = useState<number | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [logData, setLogData] = useState<string[]>([]);
  const [imageCount, setImageCount] = useState<number>(0); // 画像の枚数を保持するステート

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const fileObjects = Array.from(e.target.files).slice(0, selectedCount);
    const imageUrls = fileObjects.map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...imageUrls]);
    setImageCount(prevCount => prevCount + imageUrls.length); // 画像の枚数を更新

    if (images.length + imageUrls.length === selectedCount) {
      const fileInput = document.getElementById('fileInput');
      if (fileInput) {
        fileInput.style.display = 'none';
      }
    }
  };

  const handleSelectedCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCount = Number(e.target.value);
    const currentCount = images.length;
    setSelectedCount(newCount);

    if (newCount < currentCount) {
      const remainingImages = images.slice(0, newCount);
      setImages(remainingImages);
      setImageCount(newCount); // 画像の枚数を更新
    }

    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.style.display = 'block';
    }
  };

  const handleFileInputClick = () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleEditButtonClick = (index: number) => {
    setEditImageIndex(index);
  };

  const handleEditPopupClose = () => {
    setEditImageIndex(null);
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setEditImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (editImageIndex !== null) {
        const editedImages = [...images];
        editedImages[editImageIndex] = URL.createObjectURL(file);
        setImages(editedImages);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCompleteButtonClick = () => {
    // 画像のURLと枚数をログデータに追加
    const newLogData = [...logData, `Images: ${images.join(', ')}`, `Image Count: ${imageCount}`];
    setLogData(newLogData);
  };

  return (
    <div className="flex justify-center items-center mt-8">
      <div className="image-container">
        {images.map((imageUrl, index) => (
          <div key={index} className="image-wrapper">
            <img src={imageUrl} className="image" alt={`Image ${index + 1}`} />
            <p className="floor"> {index + 1} Floor</p>
            <button onClick={() => handleEditButtonClick(index)}>Edit</button>
          </div>
        ))}
      </div>
      <div className="select-container">
        <label htmlFor="selectCount">Select image count:</label>
        <select id="selectCount" value={selectedCount} onChange={handleSelectedCountChange}>
          {Array(10).fill(0).map((_, index) => (
            <option key={index} value={index + 1}>{index + 1}</option>
          ))}
        </select>
      </div>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        style={{ display: 'block' }}
        onChange={onFileInputChange}
        multiple
      />
      {editImageIndex !== null && (
        <div className="edit-popup">
          <h2>Edit Image {editImageIndex + 1}</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleEditImageChange}
          />
          <button onClick={handleEditPopupClose}>Close</button>
        </div>
      )}
      <button onClick={handleCompleteButtonClick}>Complete</button>
      <div className="log-container">
        {logData.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
