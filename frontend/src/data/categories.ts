// src/data/categories.ts - FIXED VERSION (ORIGINAL ORDER + REVERSED FLAG)

export type Category = {
  instruction: string;
  options: string[];
  reversed?: boolean; // Flag untuk kategori yang perlu dibalik skornya
};

export const categories: Record<string, Category> = {
  I: {
    instruction:
      "Berilah tanda pada jawaban yang paling sesuai berkenaan dengan pekerjaan anda saat ini",
    options: [
      "Sangat Setuju", // index 0 → skor 1 → reversed jadi 4 (baik)
      "Cukup Setuju", // index 1 → skor 2 → reversed jadi 3
      "Kurang Setuju", // index 2 → skor 3 → reversed jadi 2
      "Sangat Tidak Setuju", // index 3 → skor 4 → reversed jadi 1 (buruk)
    ],
    reversed: true, // PENTING: Flag ini membuat skor dibalik
  },
  II: {
    instruction: "Kondisi kesehatan anda dalam satu bulan terakhir",
    options: [
      "Hampir tidak ada", // index 0 → skor 1 → reversed jadi 4 (baik)
      "Kadang-kadang", // index 1 → skor 2 → reversed jadi 3
      "Sering", // index 2 → skor 3 → reversed jadi 2
      "Hampir selalu", // index 3 → skor 4 → reversed jadi 1 (buruk)
    ],
    reversed: true,
  },
  III: {
    instruction:
      "Jawaban yang paling sesuai berkenaan dengan orang-orang disekitar anda saat ini",
    options: [
      "Selalu", // index 0 → skor 1 → reversed jadi 4 (baik)
      "Sering", // index 1 → skor 2 → reversed jadi 3
      "Kadang-kadang", // index 2 → skor 3 → reversed jadi 2
      "Tidak sama sekali", // index 3 → skor 4 → reversed jadi 1 (buruk)
    ],
    reversed: true,
  },
  IV: {
    instruction:
      "Jawaban yang paling sesuai berkenaan dengan aspek pekerjaan anda yang lebih rinci sesuai dengan kondisi saat ini",
    options: [
      "Benar", // index 0 → skor 1 → reversed jadi 4 (baik)
      "Cukup benar", // index 1 → skor 2 → reversed jadi 3
      "Kurang benar", // index 2 → skor 3 → reversed jadi 2
      "Sangat tidak benar", // index 3 → skor 4 → reversed jadi 1 (buruk)
    ],
    reversed: true,
  },
  V: {
    instruction:
      "Jawaban yang paling sesuai berkenaan dengan situasi di tempat kerja saat ini",
    options: [
      "Benar", // index 0 → skor 1 → reversed jadi 4 (baik)
      "Cukup benar", // index 1 → skor 2 → reversed jadi 3
      "Kurang benar", // index 2 → skor 3 → reversed jadi 2
      "Sangat tidak benar", // index 3 → skor 4 → reversed jadi 1 (buruk)
    ],
    reversed: true,
  },
  VI: {
    instruction:
      "Jawaban yang paling sesuai berkenaan dengan organisasi di tempat kerja anda saat ini",
    options: [
      "Sangat setuju", // index 0 → skor 1 → reversed jadi 4 (baik)
      "Cukup setuju", // index 1 → skor 2 → reversed jadi 3
      "Kurang setuju", // index 2 → skor 3 → reversed jadi 2
      "Sangat tidak setuju", // index 3 → skor 4 → reversed jadi 1 (buruk)
    ],
    reversed: true,
  },
  VII: {
    instruction:
      "Jawaban yang paling sesuai berkenaan dengan kondisi pekerjaan dan kinerja anda saat ini",
    options: [
      "Benar", // index 0 → skor 1 → reversed jadi 4 (baik)
      "Cukup benar", // index 1 → skor 2 → reversed jadi 3
      "Kurang benar", // index 2 → skor 3 → reversed jadi 2
      "Tidak benar", // index 3 → skor 4 → reversed jadi 1 (buruk)
    ],
    reversed: true,
  },
  VIII: {
    instruction:
      "Jawaban yang paling sesuai berkenaan dengan kondisi konflik Peran Ganda antara pekerjaan dan keluarga",
    options: [
      "Sangat setuju", // index 0 → skor 1 → reversed jadi 4 (baik)
      "Setuju", // index 1 → skor 2 → reversed jadi 3
      "Tidak setuju", // index 2 → skor 3 → reversed jadi 2
      "Sangat tidak setuju", // index 3 → skor 4 → reversed jadi 1 (buruk)
    ],
    reversed: true,
  },
  IX: {
    instruction:
      "Stres Appraisal - Jawaban yang paling sesuai berkenaan dengan kondisi anda",
    options: [
      "Sangat tidak sesuai", // buruk → 1 (TIDAK reversed, sudah benar)
      "Sedikit", // 2
      "Cukup", // 3
      "Sangat cukup", // 4
      "Sangat sesuai", // baik → 5
    ],
    // Kategori IX TIDAK pakai reversed (sudah benar urutannya)
  },
};