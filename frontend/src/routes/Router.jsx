import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Login from '../pages/login.jsx';
import App from '../App.jsx';
import CustomerRegister from '../pages/CustomerRegister.jsx';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<CustomerRegister />} />
        <Route path="/admin" element={<ProtectedRoute element={<App />} />} />
        <Route path="/customer" element={<div>Customer Dashboard - Coming Soon!</div>} />
        <Route path='/dashboard' element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedRoute({ element }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      console.log('No token found! Redirecting to /.');
      navigate('/', { replace: true });
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  return isAuthenticated ? element : null;
}