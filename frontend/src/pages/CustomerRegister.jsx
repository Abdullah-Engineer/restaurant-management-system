import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/customer'); // Redirect to customer dashboard
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Registration failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-indigo-800 mb-8">
          Customer Registration
        </h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-xl font-bold text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
              }`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-indigo-600 hover:underline"
            >
              Already have an account? Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}