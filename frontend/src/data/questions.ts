// src/data/questions.ts

export type Question = {
  id: number;
  text: string;
  category: string; // I - IX
};

// sementara hanya 1–20, 109 banyak rek
export const questions: Question[] = [
  // Kategori I
  {
    id: 1,
    text: "Saya tidak dapat menyelesaikan pekerjaan pada waktu yang ditentukan",
    category: "I",
  },
  { id: 2, text: "Saya harus bekerja keras semampu saya", category: "I" },
  {
    id: 3,
    text: "Saya dapat bekerja dengan kemampuan (kecepatan kerja) saya sendiri",
    category: "I",
  },
  {
    id: 4,
    text: "Saya dapat menentukan bagaimana cara saya bekerja",
    category: "I",
  },
  {
    id: 5,
    text: "Terdapat perbedaan opini dalam departemen yang menimbulkan konflik",
    category: "I",
  },
  {
    id: 6,
    text: "Departemen saya tidak bersinergi dengan baik dengan departemen lain",
    category: "I",
  },
  {
    id: 7,
    text: "Saya memiliki tempat kerja dengan suasana yang bersahabat",
    category: "I",
  },
  { id: 8, text: "Saya merasa cocok dengan pekerjaan saya", category: "I" },
  {
    id: 9,
    text: "Pekerjaan saya membangkitkan semangat kerja saya",
    category: "I",
  },

  // Kategori II
  { id: 10, text: "Saya merasa sangat aktif", category: "II" },
  { id: 11, text: "Saya merasa sangat berenergi", category: "II" },
  { id: 12, text: "Saya merasa sangat bergairah/antusias", category: "II" },
  { id: 13, text: "Saya merasa marah", category: "II" },
  { id: 14, text: "Saya merasa kesal di dalam hati", category: "II" },
  { id: 15, text: "Saya merasa mudah tersinggung", category: "II" },
  { id: 16, text: "Saya merasa sangat Lelah", category: "II" },
  { id: 17, text: "Saya merasa kehabisan tenaga", category: "II" },
  { id: 18, text: "Saya merasa lesu", category: "II" },
  { id: 19, text: "Saya merasa tegang", category: "II" },
  { id: 20, text: "Saya merasa khawatir atau tidak aman", category: "II" },
  { id: 21, text: "Saya merasa tidak tenang", category: "II" },
  { id: 22, text: "Saya merasa murung", category: "II" },
  {
    id: 23,
    text: "Saya merasa melakukan apapun rasanya sulit",
    category: "II",
  },
  { id: 24, text: "Saya tidak bisa konsentrasi", category: "II" },
  { id: 25, text: "Saya merasa tidak gembira", category: "II" },
  {
    id: 26,
    text: "Saya tidak bisa berkonsentrasi dalam pekerjaan",
    category: "II",
  },
  { id: 27, text: "Saya merasa sedih", category: "II" },
  { id: 28, text: "Saya merasa pening", category: "II" },
  { id: 29, text: "Saya merasa pegal linu dan nyeri sendi", category: "II" },
  { id: 30, text: "Saya merasa sakit kepala", category: "II" },
  { id: 31, text: "Leher dan pundak saya terasa kaku", category: "II" },
  {
    id: 32,
    text: "Saya merasa punggung dan pinggang saya sakit",
    category: "II",
  },
  { id: 33, text: "Saya merasa mata saya lelah", category: "II" },
  {
    id: 34,
    text: "Jantung saya berdebar dan merasa sesak nafas",
    category: "II",
  },
  {
    id: 35,
    text: "Saya merasa kondisi pencernaan saya tidak baik",
    category: "II",
  },
  { id: 36, text: "Saya tidak memiliki nafsu makan", category: "II" },
  { id: 37, text: "Saya mengalami sembelit dan/atau diare", category: "II" },
  {
    id: 38,
    text: "Kualitas tidur saya kurang baik (misalnya sulit untuk mulai tidur, tidur tidak nyenyak, durasi tidur kurang dari normal, dan sebagainya)",
    category: "II",
  },
  // Kategori III
  {
    id: 39,
    text: "Saat anda dalam kesulitan, seberapa besar anda dapat mengandalkan pasangan, keluarga, teman, dan lain-lain?",
    category: "III",
  },
  {
    id: 40,
    text: "Bila anda bertanya mengenai masalah pribadi anda, seberapa besar orang-orang ini mau mendengarkan masalah anda? Pasangan, keluarga, teman, dan lain-lain.",
    category: "III",
  },
  {
    id: 41,
    text: "Bila anda membutuhkan nasihat atasan, seberapa jauh atasan mendengarkan masalah anda?",
    category: "III",
  },
  // Kategori IV
  { id: 42, text: "Saya puas dengan pekerjaan saya", category: "IV" },
  {
    id: 43,
    text: "Saya kadang-kadang merasa kesal dengan pekerjaan saya",
    category: "IV",
  },
  {
    id: 44,
    text: "Saya mendapat perintah yang berbeda dari dua orang atau lebih",
    category: "IV",
  },
  {
    id: 45,
    text: "Saya memahami tugas kerja dan tanggung jawab saya",
    category: "IV",
  },
  {
    id: 46,
    text: "Saya memiliki kesempatan mengembangkan kemampuan saya",
    category: "IV",
  },
  // Kategori V
  {
    id: 47,
    text: "Saya menerima remunerasi sesuai dengan pekerjaan dan insentif sesuai dengan kinerja saya dan Perusahaan",
    category: "V",
  },
  {
    id: 48,
    text: "Saya mendapat penilaian yang sesuai dari atasan",
    category: "V",
  },
  {
    id: 49,
    text: "Atasan saya memberikan kesempatan kepada bawahan untuk mengembangkan kemampuan saya",
    category: "V",
  },
  {
    id: 50,
    text: "Atasan saya memperlakukan saya dengan baik dan tulus",
    category: "V",
  },
  {
    id: 51,
    text: "Saya mendapatkan penghargaan ketika saya bekerja dengan kinerja yang baik",
    category: "V",
  },
  {
    id: 52,
    text: "Saya diberikan kesempatan untuk memperbaiki diri atas kesalahan yang pernah saya buat di tempat kerja",
    category: "V",
  },
  // Kategori VI
  {
    id: 53,
    text: "Saya dapat mempercayai informasi yang datang dari manajemen Perusahaan",
    category: "VI",
  },
  {
    id: 54,
    text: "Ketika terjadi perubahan yang berdampak pada pekerjaan atau tempat kerja saya, Perusahaan mempertimbangkan pendapat dari pekerja",
    category: "VI",
  },
  {
    id: 55,
    text: "Tempat kerja saya menghargai nilai dari masing-masing pekerja",
    category: "VI",
  },
  {
    id: 56,
    text: "Hasil penilaian kinerja saya dijelaskan secara menyeluruh oleh atasan langsung kepada saya",
    category: "VI",
  },
  {
    id: 57,
    text: "Di tempat kerja saya, semua orang (karyawan tetap, karyawan tidak tetap, karyawan paruh waktu, dan sebagainya) dihargai setara sebagai bagian dari Perusahaan",
    category: "VI",
  },
  {
    id: 58,
    text: "Saya mendapatkan pelatihan dan pendidikan yang berguna dan memotivasi saya dalam pengembangan karir saya",
    category: "VI",
  },
  {
    id: 59,
    text: "Kehidupan pribadi saya sangat terganggu karena memikirkan pekerjaan",
    category: "VI",
  },
  {
    id: 60,
    text: "Pekerjaan saya memberikan semangat dan dampak positif dalam kehidupan pribadi saya",
    category: "VI",
  },
  // Kategori VII
  {
    id: 61,
    text: "Di tempat kerja kami, semua saling memahami dan menerima",
    category: "VII",
  },
  {
    id: 62,
    text: "Saya merasa selalu bersemangat ketika bekerja",
    category: "VII",
  },
  {
    id: 63,
    text: "Saya merasa bangga dengan pekerjaan yang saya lakukan",
    category: "VII",
  },
  // Kategori VIII
  {
    id: 64,
    text: "Pekerjaan saya menjauhkan saya dari kegiatan keluarga",
    category: "VIII",
  },
  {
    id: 65,
    text: "Waktu yang harus saya luangkan untuk pekerjaan membuat saya tidak bisa mengikuti aktivitas dari tanggung jawab rumah tangga",
    category: "VIII",
  },
  {
    id: 66,
    text: "Saya kehilangan aktivitas dengan keluarga karena waktu yang saya habiskan untuk pekerjaan",
    category: "VIII",
  },
  {
    id: 67,
    text: "Waktu yang harus saya habiskan untuk melakukan tanggung jawab keluarga mengganggu tanggung jawab pekerjaan saya",
    category: "VIII",
  },
  {
    id: 68,
    text: "Waktu yang saya habiskan dengan keluarga menyebabkan saya tidak bisa menghabiskan lebih banyak waktu untuk perkembangan karir saya",
    category: "VIII",
  },
  {
    id: 69,
    text: "Saya harus meninggalkan pekerjaan karena banyak waktu yang harus diluangkan demi keluarga saya",
    category: "VIII",
  },
  {
    id: 70,
    text: "Ketika saya pulang dari bekerja, saya seringkali merasa kelelahan untuk mengerjakan kegiatan/tanggung jawab keluarga",
    category: "VIII",
  },
  {
    id: 71,
    text: "Saya sering kelelahan secara emosional ketika pulang kerja sehingga saya tidak bisa berinteraksi dengan keluarga",
    category: "VIII",
  },
  {
    id: 72,
    text: "Karena tekanan dari pekerjaan, terkadang saya terlalu lelah untuk mengerjakan hal-hal yang saya sukai di rumah",
    category: "VIII",
  },
  {
    id: 73,
    text: "Akibat stres di rumah, seringkali saya memikirkan masalah keluarga saat bekerja",
    category: "VIII",
  },
  {
    id: 74,
    text: "Karena saya sering stres mengenai urusan rumah, saya jadi sulit berkonsentrasi mengerjakan pekerjaan saya di kantor",
    category: "VIII",
  },
  {
    id: 75,
    text: "Tekanan dan kecemasan dari kehidupan keluarga sering melemahkan kinerja saya dalam bekerja",
    category: "VIII",
  },
  {
    id: 76,
    text: "Kemampuan memecahkan masalah yang digunakan dalam pekerjaan saya tidak bisa saya terapkan dirumah",
    category: "VIII",
  },
  {
    id: 77,
    text: "Perilaku yang efektif dan dibutuhkan di kantor bisa menjadi tidak berlaku di rumah",
    category: "VIII",
  },
  {
    id: 78,
    text: "Perilaku efektif saya di kantor tidak membantu saya menjadi orang tua dan pasangan yang baik",
    category: "VIII",
  },
  {
    id: 79,
    text: "Perilaku yang biasa dilakukan di rumah tidak efektif dilakukan di kantor",
    category: "VIII",
  },
  {
    id: 80,
    text: "Perilaku yang efektif dan penting bagi saya di rumah tidak berlaku saat bekerja",
    category: "VIII",
  },
  {
    id: 81,
    text: "Pemecahan masalah yang saya lakukan di rumah tidak efektif digunakan di kantor",
    category: "VIII",
  },
  // Kategori IX
  {
    id: 82,
    text: "Apakah situasi ini sangat tidak ada harapan?",
    category: "IX",
  },
  {
    id: 83,
    text: "Apakah situasi ini menyebabkab tekanan pada saya?",
    category: "IX",
  },
  {
    id: 84,
    text: "Apakah hasil dari situasi ini tidak dapat dikontrol oleh siapapun?",
    category: "IX",
  },
  {
    id: 85,
    text: "Apakah ada seseorang atau agensi yang bisa saya mintai bantuan jika saya membutuhkannya?",
    category: "IX",
  },
  { id: 86, text: "Apakah situasi ini membuat saya gelisah?", category: "IX" },
  {
    id: 87,
    text: "Apakah situasi ini memiliki konsekuensi yang penting bagi saya?",
    category: "IX",
  },
  {
    id: 88,
    text: "Apakah situasi ini memiliki dampak positif bagi saya?",
    category: "IX",
  },
  {
    id: 89,
    text: "Seberapa bersemangat saya untuk mengatasi masalah ini?",
    category: "IX",
  },
  {
    id: 90,
    text: "Seberapa banyak saya akan dipengaruhi oleh hasil dari situasi ini?",
    category: "IX",
  },
  {
    id: 91,
    text: "Sampai sejauh mana saya bisa menjadi orang yang lebih kuat karena masalah ini?",
    category: "IX",
  },
  {
    id: 92,
    text: "Apakah hasil dari situasi ini berdampak negatif bagi saya?",
    category: "IX",
  },
  {
    id: 93,
    text: "Apakah saya punya kemampuan untuk mengatasi situasi ini dengan baik?",
    category: "IX",
  },
  {
    id: 94,
    text: "Apakah situasi ini memerlukan keterlibatan serius bagi saya?",
    category: "IX",
  },
  {
    id: 95,
    text: "Apakah saya memiliki apa yang diperlukan untuk mengatasi situasi ini dengan baik",
    category: "IX",
  },
  {
    id: 96,
    text: "Apakah terdapat bantuan yang tersedia bagi saya untuk mengatasi masalah ini?",
    category: "IX",
  },
  {
    id: 97,
    text: "Apakah situasi ini merupakan beban bagi saya atau melebihi sumber daya yang saya miliki?",
    category: "IX",
  },
  {
    id: 98,
    text: "Apakah tersedia sumber daya yang cukup untuk membantu saya dalam berurusan dengan situasi ini?",
    category: "IX",
  },
  {
    id: 99,
    text: "Apakah ada kekuatan dari luar yang dapat membantu?",
    category: "IX",
  },
  {
    id: 100,
    text: "Sejauh manakah saya bersemangat untuk memikirkan tentang hasil dari situasi ini?",
    category: "IX",
  },
  {
    id: 101,
    text: "Seberapa mengancam situasi ini bagi saya?",
    category: "IX",
  },
  {
    id: 102,
    text: "Apakah masalahnya tidak dapat terpecahkan oleh siapa pun?",
    category: "IX",
  },
  { id: 103, text: "Akankah saya mampu mengatasi masalahnya?", category: "IX" },
  {
    id: 104,
    text: "Apakah terdapat orang yang bisa membantu saya untuk mengelola masalah ini?",
    category: "IX",
  },
  {
    id: 105,
    text: "Sejauh mana saya menganggap situasi ini sebagai stres?",
    category: "IX",
  },
  {
    id: 106,
    text: "Apakah saya memiliki keterampilan yang diperlukan untuk mencapai hasil yang baik dalam situasi ini?",
    category: "IX",
  },
  {
    id: 107,
    text: "Sejauh mana kejadian ini membutuhkan usaha penyelesaian dari saya?",
    category: "IX",
  },
  {
    id: 108,
    text: "Apakah situasi ini memiliki konsekuensi jangka panjang untuk saya?",
    category: "IX",
  },
  {
    id: 109,
    text: "Apakah hal ini akan memberikan dampak negatif bagi saya?",
    category: "IX",
  },
];