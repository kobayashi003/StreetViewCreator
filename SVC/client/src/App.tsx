import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import APIComponent from './component/APIComponent';  // /api パスで表示するコンポーネント
import Edit from './Edit';
import User from './User';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
      {/* <Route path="/api" element={<APIComponent />} /> */}
        <Route path="/edit" element={<Edit />} />
        <Route path="/user" element={<User />} />
        {/* Define routes for other components if needed */}
      </Routes>
    </Router>
  );
};

export default App;
