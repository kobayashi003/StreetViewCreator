import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

const Communication: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState('');
  const [description, setDescription] = useState('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleCoordinatesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCoordinates(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('coordinates', coordinates);
      formData.append('description', description);

      try {
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setImageSrc(`data:image/jpeg;base64,${response.data.data}`);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <input type="text" value={coordinates} onChange={handleCoordinatesChange} placeholder="Coordinates" />
        <input type="text" value={description} onChange={handleDescriptionChange} placeholder="Description" />
        <button type="submit">Upload Image</button>
      </form>
      {imageSrc && <img src={imageSrc} alt="Uploaded" />}
    </div>
  );
};

export default Communication;