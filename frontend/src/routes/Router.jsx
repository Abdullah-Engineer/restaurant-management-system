import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/login.jsx';
import App from '../App.jsx';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}