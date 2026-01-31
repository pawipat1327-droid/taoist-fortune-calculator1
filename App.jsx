import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import DatePage from './pages/Date';
import Love from './pages/Love';
import Money from './pages/Money';
import Dream from './pages/Dream';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-x-hidden">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/date" element={<DatePage />} />
          <Route path="/love" element={<Love />} />
          <Route path="/money" element={<Money />} />
          <Route path="/dream" element={<Dream />} />
          {/* Redirect old routes to new ones */}
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
