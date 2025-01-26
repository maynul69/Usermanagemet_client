import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Admin from './pages/admin';
import LogIn from './pages/logIn';
import Reg from './pages/reg';

import './App.css';

// ProtectedRoute component
const ProtectedRoute = ({ element: Element }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check for the token in localStorage
  return isAuthenticated ? <Element /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<ProtectedRoute element={Admin} />} />
        <Route path="/" element={<LogIn />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/reg" element={<Reg />} />
      </Routes>
    </Router>
  );
}


export default App;