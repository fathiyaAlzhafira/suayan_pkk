import React, { useState } from 'react';

function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        onLoginSuccess();
        setUsername('');
        setPassword('');
      } else {
        setError(data.message || 'Username atau password salah.');
      }
    } catch (err) {
      console.warn('Gagal menghubungi server backend. Menggunakan autentikasi offline.');
      if (username === 'admin_suayan' && password === 'admin125' || (username === 'admin_suayan' && password === 'admin123')) {
        onLoginSuccess();
        setUsername('');
        setPassword('');
      } else {
        setError('Username atau password salah. Silakan coba lagi.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl border w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white p-5 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm">Login Administrator</h3>
            <span className="text-[10px] text-emerald-300">TP-PKK Nagari Suayan</span>
          </div>
          <button 
            onClick={onClose}
            className="text-emerald-200 hover:text-white transition text-lg font-bold"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded font-medium border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Username</label>
            <input 
              type="text" 
              placeholder="Masukkan username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-xs border rounded p-2.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="Masukkan password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs border rounded p-2.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div className="pt-2 flex space-x-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 border text-gray-500 text-xs font-bold py-2 rounded hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 rounded transition"
            >
              Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginModal;
