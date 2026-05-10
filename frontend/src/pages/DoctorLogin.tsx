// DoctorLogin.tsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Lock, Stethoscope } from "lucide-react";

export default function DoctorLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://api.skriningstreskerjaperempuan.com/api/doctor/login",
        { username, password }
      );

      console.log("Respon login:", res.data);

      if (res.data.success) {
        localStorage.setItem("doctor_token", res.data.token);
        navigate("/dashboard");
      } else {
        alert("Username atau password salah");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Terjadi kesalahan saat login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="max-w-md w-full rounded-2xl border bg-white shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 border-b">
          <h2 className="flex items-center gap-2 font-semibold text-slate-800">
            <Stethoscope className="h-5 w-5 text-blue-600" /> Login Dokter /
            Psikolog
          </h2>
          <p className="text-xs text-slate-500">
            Akses dashboard untuk melihat hasil analisis stress kerja responden
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Masukkan username dokter"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
          >
            Masuk ke Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
