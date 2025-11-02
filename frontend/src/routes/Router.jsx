import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from '../pages/Login.jsx';
import App from '../App.jsx';
import CustomerRegister from '../pages/CustomerRegister.jsx';
import CustomerDashboard from '../pages/CustomerDashboard.jsx';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<CustomerRegister />} />
        <Route path="/admin" element={<ProtectedRoute element={<App />} />} />
        <Route path="/customer" element={<ProtectedRoute element={<CustomerDashboard />} />} />
        {/* <Route path="/dashboard" element={<App />} /> */}
        <Route path="*" element={<Navigate to="/" />} />
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