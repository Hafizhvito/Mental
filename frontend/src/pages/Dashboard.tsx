// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Eye,
  Heart,
  Calendar,
  Search,
  ChevronDown,
  Download,
  FileText,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Respondent {
  id: number;
  name: string;
  age: number;
  status: string;
}

interface Result {
  id: number;
  respondent: Respondent;
  score_total: number;
  problematic_category: number;
  stress_level: "rendah" | "sedang" | "tinggi";
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<Result[]>([]);
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [levelFilter, setLevelFilter] = useState("Semua Level");
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 state pencarian
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem("doctor_token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          "https://api.skriningstreskerjaperempuan.com/api/results",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        setResults(res.data);
      } catch (err: any) {
        console.error("Error fetching data:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("doctor_token");
          navigate("/");
        } else {
          setError("Gagal memuat data. Silakan refresh halaman.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [navigate]);

  // 📊 Hitung statistik
  const totalResponden = results.length;
  const rataRata =
    results.length > 0
      ? (
          results.reduce((a, b) => a + b.score_total, 0) / results.length
        ).toFixed(1)
      : 0;

  const baru7Hari = results.filter((r) => {
    const diff =
      (new Date().getTime() - new Date(r.created_at).getTime()) /
      (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("doctor_token");

      if (token) {
        await axios.post(
          "http://localhost:8000/api/doctor/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };

  const stressTinggi = results.filter(
    (r) => r.stress_level === "tinggi"
  ).length;
  const stressSedang = results.filter(
    (r) => r.stress_level === "sedang"
  ).length;
  const stressRendah = results.filter(
    (r) => r.stress_level === "rendah"
  ).length;

  // 📌 Export ke PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Analisis Stress Kerja", 14, 15);

    autoTable(doc, {
      head: [["Nama", "Usia", "Status", "Skor", "Level Stress", "Tanggal"]],
      body: results.map((r) => [
        r.respondent.name,
        r.respondent.age,
        r.respondent.status,
        r.score_total,
        r.stress_level,
        new Date(r.created_at).toLocaleDateString("id-ID"),
      ]),
    });

    doc.save("laporan-stress.pdf");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Halaman
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Dashboard Dokter
                </h1>
                <p className="text-sm text-slate-500">
                  Analisis Stress Kerja Responden
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Responden"
            value={totalResponden}
            icon={<Users className="w-6 h-6 text-blue-600" />}
            bg="bg-blue-100"
            color="text-blue-600"
          />
          <StatCard
            title="Stress Tinggi"
            value={stressTinggi}
            icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
            bg="bg-red-100"
            color="text-red-600"
          />
          <StatCard
            title="Stress Sedang"
            value={stressSedang}
            icon={<Eye className="w-6 h-6 text-amber-600" />}
            bg="bg-amber-100"
            color="text-amber-600"
          />
          <StatCard
            title="Responden Baru (7 hari)"
            value={baru7Hari}
            icon={<Calendar className="w-6 h-6 text-violet-600" />}
            bg="bg-violet-100"
            color="text-violet-600"
          />
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-4 h-4 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-900">
                Data Responden
              </h2>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                {totalResponden}
              </span>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama responden..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
              </div>
              <FilterSelect
                value={levelFilter}
                setValue={setLevelFilter}
                options={[
                  "Semua Level",
                  "Stress Tinggi",
                  "Stress Sedang",
                  "Stress Rendah",
                ]}
              />
            </div>
          </div>

          {/* Table Content */}
          <div>
            {results
              .filter((res) => {
                if (
                  statusFilter !== "Semua Status" &&
                  res.respondent.status !== statusFilter
                )
                  return false;
                const levelText =
                  res.stress_level === "tinggi"
                    ? "Stress Tinggi"
                    : res.stress_level === "sedang"
                    ? "Stress Sedang"
                    : "Stress Rendah";
                if (levelFilter !== "Semua Level" && levelText !== levelFilter)
                  return false;
                if (
                  searchTerm &&
                  !res.respondent.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                  return false;
                return true;
              })
              .map((res) => (
                <div
                  key={res.id}
                  className="p-6 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-base font-bold text-slate-900">
                          {res.respondent.name}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            res.stress_level === "tinggi"
                              ? "bg-red-100 text-red-700"
                              : res.stress_level === "sedang"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {res.stress_level}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">
                        Usia: {res.respondent.age} | Status:{" "}
                        {res.respondent.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">
                        {res.score_total}
                      </div>
                      <div className="text-xs text-slate-500">
                        Skor Kesehatan Mental
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Export Section */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Export Data
              </h3>
              <p className="text-sm text-slate-500">
                Download laporan analisis stress kerja untuk {totalResponden}{" "}
                responden
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleExportPDF}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-sm font-semibold"
              >
                <FileText className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen StatCard
const StatCard = ({ title, value, icon, bg, color }: any) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-2">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </div>
      <div
        className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}
      >
        {icon}
      </div>
    </div>
  </div>
);

const FilterSelect = ({
  value,
  setValue,
  options,
}: {
  value: string;
  setValue: (v: string) => void;
  options: string[];
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium min-w-[140px]"
    >
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
  </div>
);

export default Dashboard;
