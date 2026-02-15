import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CV from './pages/CV';
import ERP from './pages/ERP';
import CRM from './pages/CRM';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<CV />} />
        <Route path="/erp" element={<ERP />} />
        <Route path="/crm" element={<CRM />} />
      </Routes>
    </Router>
  );
}

export default App;