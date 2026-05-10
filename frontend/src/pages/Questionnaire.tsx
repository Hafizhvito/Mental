// src/pages/Questionnaire.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/categories";
import { questions } from "../data/questions";
import { calculateScores } from "../utils/Scoring";
import axios from "axios";
import { useEffect } from "react";

// 🔹 Kumpulan kata penyemangat
const encouragementMessages = [
  "Setiap jawaban Anda sangat berharga! 💎",
  "Terima kasih atas kejujuran Anda! 🙏",
  "Semangat! Sebentar lagi Anda akan selesai menjawab! 🚀",
  "Anda telah meluangkan waktu untuk diri sendiri, itu hebat! ⏰",
  "Setiap jawaban membawa Anda lebih dekat pada insight baru! 🔍",
  "Kerja bagus! Anda benar-benar peduli dengan kesehatan mental! 🧠",
  "Menjadi pekerja yang aware itu keren, seperti Anda! 😎",
  "Anda investasi waktu untuk hal yang penting - diri Anda sendiri! 💖",
  "Sebentar lagi selesai, Anda sudah sampai sejauh ini! 🏃‍♀️",
  "Jawaban jujur berhak mendapatkan apresiasi yang baik - terimakasih! 🌟",
];

export default function Questionnaire() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem("survey_answers");
    return saved ? JSON.parse(saved) : {};
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const saved = localStorage.getItem("survey_index");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const category = categories[currentQuestion?.category];
  const progress = Math.round(
    ((currentQuestionIndex + 1) / questions.length) * 100
  );

  // 🔹 State untuk kata penyemangat
  const [encouragement, setEncouragement] = useState("");

  useEffect(() => {
    if (!currentQuestion) return;

    const currentCategory = currentQuestion.category;
    const isLateCategory = ["VIII", "IX"].includes(currentCategory);

    // Reset dulu
    setEncouragement("");

    // Ambil data riwayat dari localStorage
    const encouragementData = JSON.parse(
      localStorage.getItem("encouragement_data") || "{}"
    );
    const shownForThisCategory = encouragementData[currentCategory] || [];

    // 🔹 Jika kategori 8–9 → pesan khusus dengan posisi acak
    if (isLateCategory) {
      const lateMessages = [
        "Semangat! Sebentar lagi Anda akan selesai menjawab! 🚀",
        "Sebentar lagi selesai, Anda sudah sampai sejauh ini! 🏃‍♀️",
      ];

      // Ambil pesan yang belum muncul di kategori ini
      const remainingMessages = lateMessages.filter(
        (msg) => !shownForThisCategory.includes(msg)
      );

      // Tentukan probabilitas kemunculan (contoh 25%)
      const shouldShow = Math.random() < 0.25;

      if (shouldShow && remainingMessages.length > 0) {
        // Pilih pesan acak dari yang belum muncul
        const randomMsg =
          remainingMessages[
            Math.floor(Math.random() * remainingMessages.length)
          ];

        setEncouragement(randomMsg);

        // Simpan ke localStorage agar tidak muncul dua kali
        encouragementData[currentCategory] = [
          ...shownForThisCategory,
          randomMsg,
        ];
        localStorage.setItem(
          "encouragement_data",
          JSON.stringify(encouragementData)
        );
      } else {
        setEncouragement("");
      }

      return;
    }

    // 🔹 Untuk kategori 1–7 → muncul 1-2 kali saja secara acak
    const generalLimit = 2;
    const shownCount = shownForThisCategory.length;
    const shouldShow = Math.random() < 0.2;

    if (shownCount >= generalLimit || !shouldShow) {
      setEncouragement("");
      return;
    }

    // Filter agar tidak pakai dua pesan khusus
    const filtered = encouragementMessages.filter(
      (msg) =>
        msg !== "Semangat! Sebentar lagi Anda akan selesai menjawab! 🚀" &&
        msg !== "Sebentar lagi selesai, Anda sudah sampai sejauh ini! 🏃‍♀️"
    );

    const randomMsg = filtered[Math.floor(Math.random() * filtered.length)];
    setEncouragement(randomMsg);

    // Simpan data kategori umum
    encouragementData[currentCategory] = [...shownForThisCategory, randomMsg];
    localStorage.setItem(
      "encouragement_data",
      JSON.stringify(encouragementData)
    );
  }, [currentQuestion?.id]);

  // Color themes untuk setiap kategori
  const categoryThemes: Record<
    string,
    {
      primary: string;
      bg: string;
      border: string;
      text: string;
      button: string;
      icon: string;
      accent: string;
    }
  > = {
    "Work-Family Conflict": {
      primary: "from-rose-500 to-pink-600",
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-800",
      button: "bg-rose-500 hover:bg-rose-600",
      icon: "bg-rose-500",
      accent: "rose",
    },
    "Stress Level": {
      primary: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-800",
      button: "bg-emerald-500 hover:bg-emerald-600",
      icon: "bg-emerald-500",
      accent: "emerald",
    },
    "Job Satisfaction": {
      primary: "from-blue-500 to-indigo-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      button: "bg-blue-500 hover:bg-blue-600",
      icon: "bg-blue-500",
      accent: "blue",
    },
    "Work Environment": {
      primary: "from-amber-500 to-orange-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-800",
      button: "bg-amber-500 hover:bg-amber-600",
      icon: "bg-amber-500",
      accent: "amber",
    },
    Default: {
      primary: "from-purple-500 to-violet-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-800",
      button: "bg-purple-500 hover:bg-purple-600",
      icon: "bg-purple-500",
      accent: "purple",
    },
  };

  // Answer option colors
  const answerColors: Array<{
    bg: string;
    hover: string;
    border: string;
    selectedBg: string;
    selectedBorder: string;
    selectedText: string;
    badge: string;
    accent: string;
  }> = [
    {
      bg: "bg-gradient-to-r from-violet-500 to-purple-600",
      hover: "hover:from-violet-600 hover:to-purple-700",
      border: "border-violet-300 hover:border-violet-500",
      selectedBg: "bg-violet-50",
      selectedBorder: "border-violet-500",
      selectedText: "text-violet-900",
      badge: "bg-violet-100 text-violet-700 border-violet-300",
      accent: "violet",
    },
    {
      bg: "bg-gradient-to-r from-emerald-500 to-teal-600",
      hover: "hover:from-emerald-600 hover:to-teal-700",
      border: "border-emerald-300 hover:border-emerald-500",
      selectedBg: "bg-emerald-50",
      selectedBorder: "border-emerald-500",
      selectedText: "text-emerald-900",
      badge: "bg-emerald-100 text-emerald-700 border-emerald-300",
      accent: "emerald",
    },
    {
      bg: "bg-gradient-to-r from-rose-500 to-pink-600",
      hover: "hover:from-rose-600 hover:to-pink-700",
      border: "border-rose-300 hover:border-rose-500",
      selectedBg: "bg-rose-50",
      selectedBorder: "border-rose-500",
      selectedText: "text-rose-900",
      badge: "bg-rose-100 text-rose-700 border-rose-300",
      accent: "rose",
    },
    {
      bg: "bg-gradient-to-r from-amber-500 to-orange-600",
      hover: "hover:from-amber-600 hover:to-orange-700",
      border: "border-amber-300 hover:border-amber-500",
      selectedBg: "bg-amber-50",
      selectedBorder: "border-amber-500",
      selectedText: "text-amber-900",
      badge: "bg-amber-100 text-amber-700 border-amber-300",
      accent: "amber",
    },
    {
      bg: "bg-gradient-to-r from-blue-500 to-cyan-600",
      hover: "hover:from-blue-600 hover:to-cyan-700",
      border: "border-blue-300 hover:border-blue-500",
      selectedBg: "bg-blue-50",
      selectedBorder: "border-blue-500",
      selectedText: "text-blue-900",
      badge: "bg-blue-100 text-blue-700 border-blue-300",
      accent: "blue",
    },
  ];

  const currentTheme =
    categoryThemes[currentQuestion?.category || "Default"] ||
    categoryThemes["Default"];

  const totalAnswered = Object.keys(answers).length;

  // Minimal encouragement messages - hanya di milestone penting
  const getMilestoneMessage = () => {
    if (progress === 25) return "Seperempat perjalanan selesai!";
    if (progress === 50) return "Setengah jalan terlewati, semangat!";
    if (progress === 75) return "Hampir selesai, tinggal sedikit lagi!";
    if (progress === 90) return "Tinggal 10% lagi, Anda hebat!";
    return null;
  };

  const milestoneMsg = getMilestoneMessage();

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    localStorage.setItem("survey_answers", JSON.stringify(newAnswers));

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          localStorage.setItem("survey_index", nextIndex.toString());
          setIsTransitioning(false);
        }, 300);
      } else {
        setShowResult(true);
      }
    }, 600);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        const prevIndex = currentQuestionIndex - 1;
        setCurrentQuestionIndex(prevIndex);
        localStorage.setItem("survey_index", prevIndex.toString());
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const scores = calculateScores(answers);
      const respondent = JSON.parse(localStorage.getItem("respondent") || "{}");

      console.log("Hasil calculateScores:", scores);

      const answeredQuestions = Object.keys(answers).length;
      const totalQuestions = questions.length;

      if (answeredQuestions < totalQuestions) {
        console.warn(
          `Hanya ${answeredQuestions}/${totalQuestions} pertanyaan terjawab`
        );
      }

      const answerDistribution: Record<string, number> = {};
      Object.values(answers).forEach((answer) => {
        answerDistribution[answer] = (answerDistribution[answer] || 0) + 1;
      });
      console.log("Distribusi jawaban:", answerDistribution);

      const middleAnswers = [
        "Cukup Setuju",
        "Kurang Setuju",
        "Kadang-kadang",
        "Sering",
        "Cukup benar",
        "Kurang benar",
        "Setuju",
        "Tidak setuju",
        "Cukup",
        "Sedikit",
      ];

      const middleCount = Object.entries(answerDistribution)
        .filter(([answer]) => middleAnswers.some((ma) => answer.includes(ma)))
        .reduce((sum, [, count]) => sum + count, 0);

      const middlePercentage = (middleCount / answeredQuestions) * 100;
      console.log(
        `Jawaban tengah: ${middleCount}/${answeredQuestions} (${middlePercentage.toFixed(
          1
        )}%)`
      );

      if (middlePercentage > 70 && scores.stressLevel === "tinggi") {
        console.warn(
          "ANOMALI TERDETEKSI: Override ke sedang karena mayoritas jawaban tengah"
        );
        scores.stressLevel = "sedang";
      }

      const payload = {
        name: respondent.name,
        age: respondent.age,
        status: respondent.status,

        problematic_category: scores.totalBinaryFlags,
        score_total: Math.round(scores.score_total),
        stress_level: scores.stressLevel,
        wfc_index: scores.wfcIndex,
        stress_index: scores.stressIndex,

        score_category: JSON.stringify(scores.perCategory),
        score_details: JSON.stringify(scores.perQuestion),
      };

      console.log("Payload yang akan dikirim:", payload);
      console.log("Stress Level final:", scores.stressLevel);

      const res = await axios.post(
        "https://api.skriningstreskerjaperempuan.com/api/respondent",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 201) {
        console.log("Data berhasil disimpan:", res.data);

        const respondentId = res.data.id;

        if (respondentId) {
          localStorage.setItem("respondent_id", respondentId.toString());
          console.log("Respondent ID berhasil disimpan:", respondentId);

          navigate("/results");
        } else {
          throw new Error("Respondent ID tidak ditemukan");
        }
      }
    } catch (error: any) {
      console.error("Error:", error);

      let errorMessage = "Terjadi kesalahan saat menyimpan data.";
      if (error.response?.status === 500) {
        errorMessage = "Kesalahan server. Silakan coba lagi nanti.";
      } else if (error.response?.status === 422) {
        console.log("Validation errors:", error.response.data);
        errorMessage =
          "Data tidak valid. Pastikan semua pertanyaan sudah dijawab.";
      }
      if (error.response) {
        console.log("Response error detail:", error.response.data);
      }
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md mx-auto text-center space-y-6 sm:space-y-8 bg-white p-8 sm:p-12 rounded-3xl shadow-xl border-2 border-gray-200">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto border-3 border-emerald-200 shadow-lg">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Terima kasih!
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Anda telah menyelesaikan semua{" "}
              <span className="font-semibold text-gray-900 bg-purple-100 px-2 py-1 rounded-full">
                {questions.length}
              </span>{" "}
              pertanyaan dengan baik.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 text-sm sm:text-base flex items-center justify-center gap-2 border-2 border-transparent hover:shadow-lg transform hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : (
              "Lihat Hasil Skrining"
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex flex-col">
      {/* Header dengan tema warna kategori */}
      <div
        className={`bg-gradient-to-r ${currentTheme.primary} shadow-lg flex-shrink-0`}
      >
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center space-y-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">
              Skrining Stres Kerja
            </h1>

            {/* Progress info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm text-white/90 font-medium">
              <span>
                Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
              </span>
              <div className="hidden sm:block w-2 h-2 bg-white/40 rounded-full"></div>
              <span>{progress}% selesai</span>
            </div>

            {/* Progress bar dengan tema warna */}
            <div className="w-full max-w-sm sm:max-w-md mx-auto">
              <div className="w-full bg-white/20 rounded-full h-3 border border-white/30">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500 relative overflow-hidden shadow-sm"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1">
          {/* INSTRUKSI KATEGORI - SELALU TAMPIL & LEBIH MENONJOL */}
          <div
            className={`mb-8 sm:mb-10 transition-all duration-300 ${
              isTransitioning
                ? "opacity-0 transform translate-y-4"
                : "opacity-100 transform translate-y-0"
            }`}
          >
            <div
              className={`${currentTheme.bg} border-3 ${currentTheme.border} rounded-2xl p-5 sm:p-7 shadow-lg`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 ${currentTheme.icon} rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-white shadow-md`}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-bold ${currentTheme.text} text-base sm:text-lg mb-2`}
                  >
                    Instruksi Kategori {currentQuestion?.category}
                  </h3>
                  <p
                    className={`${currentTheme.text} leading-relaxed text-sm sm:text-base font-medium`}
                  >
                    {category?.instruction}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Question dengan tema warna */}
          <div
            className={`transition-all duration-300 ${
              isTransitioning
                ? "opacity-0 transform translate-x-8"
                : "opacity-100 transform translate-x-0"
            }`}
          >
            {/* Question header dengan gradient */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${currentTheme.primary} text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 border-2 border-white/30`}
                >
                  <span className="font-bold text-lg sm:text-xl drop-shadow-sm">
                    {currentQuestion?.id}
                  </span>
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="text-xs uppercase tracking-wider text-gray-600 font-bold">
                    Kategori
                  </div>
                  <div
                    className={`px-2 sm:px-3 py-1 ${currentTheme.bg} ${currentTheme.text} rounded-full text-xs sm:text-sm font-semibold truncate border ${currentTheme.border} shadow-sm`}
                  >
                    {currentQuestion?.category}
                  </div>
                </div>
              </div>

              {/* Category progress indicator - hidden on mobile */}
              <div className="hidden lg:block text-right flex-shrink-0">
                <div className="text-xs text-gray-600 mb-2 font-semibold">
                  Progress Kategori
                </div>
                <div className="flex items-center justify-end gap-1">
                  {questions
                    .filter((q) => q.category === currentQuestion?.category)
                    .map((q, idx) => {
                      const isAnswered = answers[q.id];
                      const isCurrent = q.id === currentQuestion?.id;

                      if (isCurrent) {
                        return (
                          <div
                            key={q.id}
                            className={`w-4 h-4 border-2 border-${currentTheme.accent}-600 bg-${currentTheme.accent}-100 transition-all transform rotate-45 shadow-sm`}
                            title="Pertanyaan saat ini"
                          />
                        );
                      } else if (isAnswered) {
                        return (
                          <div
                            key={q.id}
                            className="w-4 h-4 bg-emerald-600 border-2 border-emerald-700 transition-all shadow-sm"
                            title="Sudah dijawab"
                          />
                        );
                      } else {
                        return (
                          <div
                            key={q.id}
                            className="w-4 h-4 rounded-full bg-gray-300 border-2 border-gray-400 transition-all"
                            title="Belum dijawab"
                          />
                        );
                      }
                    })}
                </div>
              </div>
            </div>

            {/* Question text dengan background gradient */}
            <div className="mb-8 sm:mb-10 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-relaxed">
                {currentQuestion?.text}
              </h2>
            </div>

            {/* 🔹 Kata Penyemangat */}
            <div
              className={`transition-all duration-300 text-center transform ${
                isTransitioning
                  ? "opacity-0 translate-x-8"
                  : "opacity-100 translate-x-0"
              } translate-y-[-20px] hover:scale-105`} // 🔹 ini menggeser ke atas sedikit
            >
              <p
                className={`inline-block px-5 py-3 rounded-2xl font-medium text-white shadow-md bg-gradient-to-r ${
                  currentTheme.primary
                } ${
                  encouragement
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 invisible"
                } transition-all duration-300`}
              >
                {encouragement || ""}
              </p>
            </div>

            {/* Answer options dengan personal colors */}
            <div className="space-y-3 sm:space-y-4">
              {category?.options.map((option, index) => {
                const colorTheme = answerColors[index] || answerColors[0];
                const isSelected = answers[currentQuestion?.id] === option;

                return (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 text-left transition-all duration-300 group shadow-sm hover:shadow-md transform hover:scale-[1.02] ${
                      isSelected
                        ? `${colorTheme.selectedBg} ${colorTheme.selectedBorder} ${colorTheme.selectedText}`
                        : `bg-white/80 backdrop-blur-sm ${colorTheme.border} hover:bg-white text-gray-900 ${colorTheme.hover}`
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-base sm:text-lg pr-4">
                        {option}
                      </span>
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-full border ${colorTheme.badge}`}
                          >
                            DIPILIH
                          </span>
                        )}
                        <div
                          className={`w-5 h-5 sm:w-6 sm:h-6 border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            isSelected
                              ? `${colorTheme.selectedBorder} bg-gradient-to-r ${colorTheme.bg} rounded shadow-sm`
                              : `${colorTheme.border} rounded-full group-hover:shadow-sm`
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white drop-shadow-sm"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation - SIMPLIFIED */}
      <div className="border-t-2 border-gray-200 bg-gradient-to-r from-white via-gray-50 to-white backdrop-blur-sm flex-shrink-0 shadow-sm">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            {/* Previous button */}
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all text-sm sm:text-base border-2 ${
                currentQuestionIndex === 0
                  ? "text-gray-400 cursor-not-allowed border-gray-200"
                  : `text-gray-700 hover:text-white hover:bg-gradient-to-r ${currentTheme.primary} border-gray-300 hover:border-transparent font-medium shadow-sm hover:shadow-md`
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="hidden sm:inline">Kembali</span>
            </button>

            {/* Progress segments */}
            <div className="flex items-center justify-center flex-shrink-0">
              <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 border border-gray-300 shadow-sm">
                <div className="flex items-center gap-1">
                  {[
                    ...Array(
                      window.innerWidth < 640
                        ? Math.min(
                            4,
                            Math.ceil(
                              questions.length / Math.ceil(questions.length / 4)
                            )
                          )
                        : Math.min(6, Math.ceil(questions.length / 5))
                    ),
                  ].map((_, index) => {
                    const maxSegments = window.innerWidth < 640 ? 4 : 6;
                    const questionsPerSegment = Math.ceil(
                      questions.length / maxSegments
                    );
                    const startIndex = index * questionsPerSegment;
                    const endIndex = Math.min(
                      startIndex + questionsPerSegment,
                      questions.length
                    );
                    const segmentAnswered = questions
                      .slice(startIndex, endIndex)
                      .filter((q) => answers[q.id]).length;
                    const segmentTotal = endIndex - startIndex;
                    const isCurrent =
                      currentQuestionIndex >= startIndex &&
                      currentQuestionIndex < endIndex;

                    const segmentColors = [
                      "bg-gradient-to-r from-violet-500 to-purple-600",
                      "bg-gradient-to-r from-emerald-500 to-teal-600",
                      "bg-gradient-to-r from-rose-500 to-pink-600",
                      "bg-gradient-to-r from-amber-500 to-orange-600",
                      "bg-gradient-to-r from-blue-500 to-cyan-600",
                      "bg-gradient-to-r from-indigo-500 to-purple-600",
                    ];

                    let className =
                      "w-4 sm:w-6 h-2 transition-all duration-300 border shadow-sm ";

                    if (isCurrent) {
                      className += `${
                        segmentColors[index % segmentColors.length]
                      } border-white rounded-sm`;
                    } else if (segmentAnswered === segmentTotal) {
                      className +=
                        "bg-emerald-600 border-emerald-700 rounded-full";
                    } else if (segmentAnswered > 0) {
                      className +=
                        "bg-amber-500 border-amber-600 transform rotate-45";
                    } else {
                      className += "bg-gray-300 border-gray-400 rounded-full";
                    }

                    return (
                      <div
                        key={index}
                        className={className}
                        title={
                          isCurrent
                            ? "Sedang dikerjakan"
                            : segmentAnswered === segmentTotal
                            ? "Selesai"
                            : segmentAnswered > 0
                            ? "Sebagian"
                            : "Belum dimulai"
                        }
                      />
                    );
                  })}
                </div>
              </div>

              <div className="ml-2 sm:ml-4 text-xs text-gray-700 whitespace-nowrap font-semibold">
                <span className="font-bold">{Object.keys(answers).length}</span>
                <span className="hidden sm:inline"> dari</span>
                <span className="sm:hidden">/</span> {questions.length}
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2 sm:gap-4">
              {answers[currentQuestion?.id] && (
                <div className="inline-flex items-center gap-1 sm:gap-2 text-emerald-700 text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-50 to-teal-50 px-2 sm:px-3 py-1 rounded-full border-2 border-emerald-200 shadow-sm">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="hidden sm:inline">Terjawab</span>
                  <span className="sm:hidden">OK</span>
                </div>
              )}

              {/* Next auto indicator */}
              {answers[currentQuestion?.id] &&
                currentQuestionIndex < questions.length - 1 && (
                  <div className="hidden sm:inline-flex items-center gap-2 text-gray-600 text-xs font-medium bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-300">
                    <div
                      className={`w-2 h-2 bg-gradient-to-r ${currentTheme.primary} rounded-full animate-pulse`}
                    ></div>
                    <span>Otomatis lanjut...</span>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
