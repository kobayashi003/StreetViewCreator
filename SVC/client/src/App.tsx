import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import "./css/test.css"  //cssの導入例
import Communication from "./component/Communication" //componentの導入例
import Title from './component/Title';
import { BrowserRouter as Router, Route,Routes, Link } from 'react-router-dom';
// import React from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import App from './App';
import APIComponent from './component/APIComponent';  // /api パスで表示するコンポーネント

const App: React.FC = () => {
  return (
    <div>
      <div>
        <Title />
      </div>
      <div>
        <Communication />
      </div>

    </div>
  );
};

export default App;


ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/api" element={<APIComponent />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);
