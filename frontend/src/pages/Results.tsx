// src/pages/Results.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Phone,
  Globe,
  CheckCircle,
  Clock,
  Heart,
  Brain,
  User,
  Calendar,
  Briefcase,
  BarChart3,
  ArrowRight,
  Home,
  Shield,
  Users,
  ChevronDown,
  ChevronUp,
  Info,
  AlertTriangle,
} from "lucide-react";

import StressLow from "../assets/stress_low.png";
import StressMedium from "../assets/stress_medium.png";
import StressHigh from "../assets/stress_high.png";

interface ResultData {
  name: string;
  age: number;
  status: string;
  score_total: number;
  stressLevel: "rendah" | "sedang" | "tinggi";
  wfc_index?: number;
  stress_index?: number;
}

// Expandable Section Component
function ExpandableSection({
  title,
  icon,
  children,
  defaultExpanded = false,
  colorClass = "blue",
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  colorClass?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-${colorClass}-50 to-${colorClass}-100 hover:from-${colorClass}-100 hover:to-${colorClass}-200 transition-all duration-300`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${colorClass}-500 text-white`}
          >
            {icon}
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800 text-left">
            {title}
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-gray-600 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-600 flex-shrink-0" />
        )}
      </button>

      {isExpanded && (
        <div className="p-6 space-y-4 animate-fadeIn">{children}</div>
      )}
    </div>
  );
}

export default function Results() {
  const navigate = useNavigate();
  const [data, setData] = useState<ResultData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const respondentId = localStorage.getItem("respondent_id");

  useEffect(() => {
    setIsLoaded(false);
    axios
      .get(
        `https://api.skriningstreskerjaperempuan.com/api/results/${respondentId}`
      )
      // .get(`http://localhost:8000/api/results/${respondentId}`)
      .then((res) => {
        setData(res.data);
        setTimeout(() => setIsLoaded(true), 800);
      })
      .catch(() => navigate("/questionnaire"));
  }, [respondentId, navigate]);

  if (!data || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">
            Menganalisis hasil skrining Anda...
          </p>
        </div>
      </div>
    );
  }

  const {
    name,
    age,
    status,
    score_total,
    stressLevel,
    wfc_index = 2,
    stress_index = 2,
  } = data;

  const maxProblematicIndicators = 63;
  const problematicPercentage = (
    (score_total / maxProblematicIndicators) *
    100
  ).toFixed(1);

  const config = {
    rendah: {
      color: "emerald",
      bgGradient: "from-emerald-50 to-green-50",
      title: "Stres Kerja Rendah",
      message:
        "Selamat! Kondisi anda saat ini berada di tingkatan stres kerja rendah.",
      img: StressLow,
      scoreColor: "text-emerald-600",
      bgColor: "bg-emerald-500",
    },
    sedang: {
      color: "orange",
      bgGradient: "from-orange-50 to-amber-50",
      title: "Stres Kerja Sedang",
      message: "Kondisi anda saat ini berada di tingkatan stres kerja sedang.",
      img: StressMedium,
      scoreColor: "text-orange-600",
      bgColor: "bg-orange-500",
    },
    tinggi: {
      color: "red",
      bgGradient: "from-red-50 to-rose-50",
      title: "Stres Kerja Tinggi",
      message: "Kondisi anda saat ini berada di tingkatan stres kerja tinggi.",
      img: StressHigh,
      scoreColor: "text-red-600",
      bgColor: "bg-red-500",
    },
  };

  const cfg = config[stressLevel];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${cfg.bgGradient} p-4 md:p-6`}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span className="font-semibold text-gray-700">
              Assessment Selesai
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Hasil Skrining Stres Kerja Anda
          </h1>
        </div>

        {/* Main Result */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
          <div className={`bg-gradient-to-r ${cfg.bgGradient} p-8 text-center`}>
            <div className="flex justify-center mb-6">
              <img
                src={cfg.img}
                alt="Stress Illustration"
                className="w-40 h-40 object-contain"
              />
            </div>
            <h2 className={`text-2xl md:text-3xl font-bold ${cfg.scoreColor}`}>
              {cfg.title}
            </h2>
          </div>

          <div className="p-8 space-y-8">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-6 shadow-inner overflow-hidden">
              <div
                className={`h-6 ${cfg.bgColor} transition-all duration-1000 ease-out flex items-center justify-center text-white font-medium text-sm`}
                style={{
                  width:
                    stressLevel === "rendah"
                      ? "25%"
                      : stressLevel === "sedang"
                      ? "50%"
                      : "80%",
                }}
              >
                {cfg.title}
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
              {cfg.message}
            </p>

            {/* Emergency Section */}
            {stressLevel === "tinggi" && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h4 className="font-bold text-red-800 text-lg">
                    Bantuan Profesional Direkomendasikan
                  </h4>
                </div>
                <p className="text-red-700 mb-4">
                  Untuk dukungan lebih lanjut, Anda dapat menghubungi layanan
                  profesional berikut:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 border-2 border-red-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-semibold text-gray-800">
                          Layanan Konseling 24/7
                        </p>
                        <p className="text-sm text-red-600 font-mono">
                          119 ext. 8
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() =>
                      window.open("https://www.halodoc.com", "_blank")
                    }
                    className="bg-white p-4 border-2 border-red-200 rounded-xl cursor-pointer hover:border-red-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-800">
                          Konsultasi Online
                        </p>
                        <p className="text-sm text-green-600">halodoc.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ringkasan */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex justify-center items-center gap-2">
            <BarChart3 className="w-5 h-5" /> Ringkasan Assessment
          </h3>
          <p className="text-gray-700">
            Total skor Anda:{" "}
            <span className={`font-bold ${cfg.scoreColor} text-2xl`}>
              {score_total}
            </span>{" "}
            dari {maxProblematicIndicators} ({problematicPercentage}%)
          </p>
        </div>

        {/* SECTION 1: Apakah Stres Itu? */}
        <ExpandableSection
          title="Apakah Stres Itu?"
          icon={<Info className="w-5 h-5" />}
          colorClass="blue"
          defaultExpanded={true}
        >
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Stres terkait pekerjaan adalah pola reaksi yang terjadi saat
              pekerja dihadapkan pada tuntutan pekerjaan yang tidak sesuai
              dengan pengetahuan, keterampilan atau kemampuan mereka, sehingga
              menguji daya adaptasi mereka. Ketika dipersepsikan ada kendala
              antara tuntutan dan sumber daya lingkungan atau personal, dapat
              timbul reaksi seperti:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Responsifik
                </h4>
                <p className="text-sm text-gray-700">
                  Detak jantung meningkat, tekanan darah meningkat, frekuensi
                  napas meningkat, sekresi hormon seperti adrenalin dan
                  kortisol.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  Responsemosi
                </h4>
                <p className="text-sm text-gray-700">
                  Merasa cemas atau mudah marah
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Respon kognitif/pikiran
                </h4>
                <p className="text-sm text-gray-700">
                  Berkurangnya peran penerima, persepsi terganggu, pelupa
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  Respon perilaku
                </h4>
                <p className="text-sm text-gray-700">
                  Agresivitas, impulsivitas, membuat kekellruan
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
              <h4 className="font-bold text-yellow-800 mb-3 text-lg">
                REAKSI TERHADAP STRESS
              </h4>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-yellow-900 mb-2">
                    Respon Fisik:
                  </h5>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Detak jantung meningkat</li>
                    <li>• Tekanan darah meningkat</li>
                    <li>• Napas terengah-engah</li>
                    <li>• Ketegangan otot</li>
                    <li>• Berkeringat</li>
                    <li>• Hormon adrenalin meningkat</li>
                  </ul>

                  <h5 className="font-semibold text-yellow-900 mb-2 mt-4">
                    Reaksi Pikiran/Kognitif:
                  </h5>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Pemikiran berkurang</li>
                    <li>• Persepsi terganggu</li>
                    <li>• Berpikir tidak efektif</li>
                    <li>• Pemecahan masalah terganggu</li>
                    <li>• Kemampuan belajar terganggu</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-yellow-900 mb-2">
                    Respon Emosional:
                  </h5>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Rasa takut</li>
                    <li>• Mudah tersinggung/marah</li>
                    <li>• Sedih</li>
                    <li>• Cemas</li>
                    <li>• Marah</li>
                    <li>• Motivasi berkurang</li>
                  </ul>

                  <h5 className="font-semibold text-yellow-900 mb-2 mt-4">
                    Reaksi Perilaku:
                  </h5>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Penurunan produktivitas</li>
                    <li>• Merokok tambah banyak</li>
                    <li>• Konsumsi alkohol meningkat</li>
                    <li>• Obat-obatan meningkat</li>
                    <li>• Sering berbuat keliru/an</li>
                    <li>• Sering tidak masuk</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </ExpandableSection>

        {/* SECTION 2: Penyebab Stres */}
        <ExpandableSection
          title="Penyebab Stres Terkait Pekerjaan"
          icon={<AlertTriangle className="w-5 h-5" />}
          colorClass="amber"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
              <h4 className="font-bold text-amber-900 mb-4 text-lg">
                Pekerjaan:
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Ritme kerja yang tinggi, tekanan waktu</li>
                <li>• Kurang jelasnya penerapan aturan dalam pekerjaan</li>
                <li>• Partisipasi yang rendah</li>
                <li>• Ketidakcocokan sebarawat dan penyelia</li>
                <li>• Pengembangan karir buruk</li>
                <li>• Pekerjaan tidak jelas</li>
                <li>• Jam kerja panjang</li>
                <li>• Penghasilan rendah</li>
                <li>• Pelecehan seksual dan/atau psikologis</li>
              </ul>
            </div>

            <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
              <h4 className="font-bold text-amber-900 mb-4 text-lg">
                Masalah Rumah-Pekerjaan:
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  • Konflik peran dan tanggung jawab, terutama pada perempuan
                </li>
                <li>
                  • Membawa permasalahan pekerjaan kantor di rumah, keluarga
                  terkena dampak akibat stres pekerjaan
                </li>
                <li>• Adanya masalah/konflik keluarga</li>
                <li>• Kesulitan dalam kebutuhan hidup sehari-hari</li>
              </ul>
            </div>
          </div>
        </ExpandableSection>

        {/* SECTION 3: Manajemen Stres Kerja */}
        <ExpandableSection
          title="Manajemen Stres Kerja"
          icon={<Brain className="w-5 h-5" />}
          colorClass="purple"
          defaultExpanded={true}
        >
          <p className="text-gray-600 mb-6">
            Beberapa cara untuk menghadapi stres terkait pekerjaan dicantumkan
            di bawah ini.
          </p>

          <div className="space-y-4">
            {/* Sediakan Beragam Aktivitas Kesehatan */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-500 text-white flex-shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-800 mb-3">
                    Sediakan Beragam Aktivitas Kesehatan
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Latihan fisik dan teknik relaksasi dapat membantu menurunkan
                    respon stres dan memperbaiki kesejahteraan. Ada studi yang
                    menunjukkan bahwa latihan fisik di tempat kerja dapat
                    meningkatkan produktivitas.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    Menyediakan waktu setengah jam, dua kali seminggu, akan
                    menghasilkan pekerja dengan berat badan yang lebih sehat,
                    tekanan darah lebih rendah, tenaga yang meningkat, jadwal
                    tidur lebih baik dan memperbaiki keterampilan manajemen
                    stres, hanya dalam waktu delapan minggu.
                  </p>
                </div>
              </div>
            </div>

            {/* Manajemen Stres */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500 text-white flex-shrink-0">
                  <Brain className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-800 mb-3">
                    Manajemen Stres
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Lokakarya terjadwal yang melatih pekerja tentang sumber
                    stres, dampaknya terhadap kesehatan dan bagaimana mengurangi
                    stres, akan lebih efektif jika ditunjang dengan teknik
                    praktis manajemen stres yang dapat digunakan di pekerjaan
                    dan di luar kerja.
                  </p>
                </div>
              </div>
            </div>

            {/* Jeda Latihan Fisik Terprogram */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-500 text-white flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-800 mb-3">
                    Jeda Latihan Fisik Terprogram
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Penelitian telah membuktikan bahwa olah raga ringan sampai
                    sedang, seperti berjalan atau yoga, dapat menurunkan kadar
                    kortison yang dapat mengakibatkan stres. Jalan kaki singkat
                    setiap hari dapat membuat pekerja segar sepanjang hari,
                    mengurangi stres dan meningkatkan produktivitas.
                  </p>
                </div>
              </div>
            </div>

            {/* Kelompok Dukungan */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-500 text-white flex-shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-800 mb-3">
                    Kelompok Dukungan
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Stres dapat diredakan manakala pekerja berbagi
                    kekhawatirannya tentang masalah kerja, krisis kehidupan,
                    masalah keluarga, pemberian rawatan dan metode manajemen
                    stres. Kelompok dukungan seperti ini dapat bersifat permanen
                    dan melibatkan pekerja dari semua tingkatan.
                  </p>
                </div>
              </div>
            </div>

            {/* Strategi Keseimbangan Kerja/Kehidupan */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-l-4 border-teal-500 p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-500 text-white flex-shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-800 mb-3">
                    Strategi Keseimbangan Kerja/Kehidupan
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Mengembangkan jadwal kerja yang sesuai dengan tuntutan dan
                    tanggung jawab di luar pekerjaan serta menyediakan layanan
                    pendukung dapat mengurangi stres. Berikut beberapa
                    strateginya:
                  </p>

                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-teal-200">
                      <h5 className="font-semibold text-teal-900 mb-2">
                        Mengatur waktu dalam bekerja
                      </h5>
                      <p className="text-sm text-gray-700">
                        Mengatur waktu bekerja secara efektif sehingga memiliki
                        waktu lebih untuk beristirahat dapat mengurangi stres
                        kerja. Jika memerlukan waktu yang lebih fleksibel dalam
                        bekerja, pemilihan jenis pekerjaan juga sangat penting
                        untuk dipertimbangkan.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-teal-200">
                      <h5 className="font-semibold text-teal-900 mb-2">
                        Berbagi Pekerjaan
                      </h5>
                      <p className="text-sm text-gray-700">
                        Melatih setidaknya dua orang untuk melakukan setiap
                        pekerjaan akan membuat pekerja mempunyai waktu jeda
                        tanpa kehilangan produktivitas.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-teal-200">
                      <h5 className="font-semibold text-teal-900 mb-2">
                        Bekerja Dari Rumah
                      </h5>
                      <p className="text-sm text-gray-700">
                        Hal ini dapat meningkatkan semangat dan kepuasan kerja,
                        menurunkan stres dan pergantian pekerja, karena pekerja
                        mempunyai kontrol yang lebih besar terhadap cara mereka
                        bekerja, juga membuat pekerja dapat lebih baik mengatur
                        tuntutan kerja/keluarga.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-teal-200">
                      <h5 className="font-semibold text-teal-900 mb-2">
                        Menikmati waktu makan siang untuk bersantai
                      </h5>
                      <p className="text-sm text-gray-700">
                        Manfaatkan secara efektif waktu makan siang untuk
                        bersantai dan mendorong aktivitas yang menenangkan serta
                        mengurangi stres. Jika ada waktu yang cukup, misalnya
                        dapat digunakan untuk berjalan kaki ke tempat makan
                        siang.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mengatur Peran Kerja */}
            <div className="bg-gradient-to-r from-rose-50 to-red-50 border-l-4 border-rose-500 p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-rose-500 text-white flex-shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-800 mb-3">
                    Mengatur Peran Kerja
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Beberapa hal yang dapat dilakukan oleh perusahaan/organisasi
                    untuk membantu mengurangi stres misalnya:
                  </p>

                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>
                        Memberikan beban kerja sesuai dengan kapabilitas dan
                        sumber daya pekerja
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>
                        Mengembangkan pekerjaan untuk memberikan kesempatan,
                        mendorong dan menghargai pekerja menggunakan
                        keterampilan mereka
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>
                        Menetapkan peran dan tanggung jawab pekerja secara jelas
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>
                        Memberikan kesempatan bagi pekerja untuk ikut serta
                        dalam pengambilan keputusan yang berdampak pada
                        pekerjaan mereka
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>
                        Memperbaiki komunikasi untuk mengurangi ketidakpastian
                        tentang pengembangan karir dan masa depan pekerja
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>
                        Menyediakan kesempatan untuk interaksi sosial antar
                        pekerja
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </ExpandableSection>

        {/* Footer - Referensi */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-gray-600" />
            <p className="text-sm font-semibold text-gray-700">Referensi</p>
          </div>
          <p className="text-gray-600 text-sm">
            Kementerian Kesehatan Republik Indonesia
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center pb-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
