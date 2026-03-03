import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import AssignmentsPage from './pages/AssignmentsPage';
import AttemptPage from './pages/AttemptPage';
import './styles/main.scss';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="app__main">
          <Routes>
            <Route path="/" element={<AssignmentsPage />} />
            <Route path="/attempt/:id" element={<AttemptPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
