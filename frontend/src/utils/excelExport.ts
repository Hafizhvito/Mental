import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { questions } from "../data/questions";
import { categories } from "../data/categories";

export interface RespondentData {
  id: number;
  name: string;
  age: number;
  status: string;
  created_at?: string;
}

export interface ResultData {
  id: number;
  respondent: RespondentData;
  score_total: number;
  problematic_category?: number;
  stress_level: "rendah" | "sedang" | "tinggi";
  wfc_index?: number;
  stress_index?: number;
  score_category?: Record<string, any>;
  score_details?: Record<string, any>;
  answers?: Record<string | number, any>;
  created_at: string;
}

const categoryNames: Record<string, string> = {
  I: "Kepuasan Kerja & Lingkungan",
  II: "Kondisi Kesehatan & Gejala Stres",
  III: "Dukungan Sosial / Sekitar",
  IV: "Aspek Pekerjaan Rinci",
  V: "Situasi Tempat Kerja",
  VI: "Organisasi Tempat Kerja",
  VII: "Kondisi Pekerjaan & Kinerja",
  VIII: "Work-Family Conflict (WFC)",
  IX: "Stress Appraisal",
};

export async function exportToExcel(results: ResultData[]) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "DINI Sehat Mental";
  workbook.created = new Date();

  const borderStyle: Partial<ExcelJS.Borders> = {
    top: { style: "thin", color: { argb: "FFE2E8F0" } },
    left: { style: "thin", color: { argb: "FFE2E8F0" } },
    bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
    right: { style: "thin", color: { argb: "FFE2E8F0" } },
  };

  const headerFill: ExcelJS.Fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E293B" }, // Slate-800
  };

  const headerFont: Partial<ExcelJS.Font> = {
    name: "Calibri",
    size: 11,
    bold: true,
    color: { argb: "FFFFFFFF" },
  };

  // ==========================================
  // SHEET 1: RINGKASAN RESPONDEN (SUMMARY)
  // ==========================================
  const sheetSummary = workbook.addWorksheet("Ringkasan Responden", {
    views: [{ showGridLines: true }],
  });

  // Judul Laporan
  sheetSummary.mergeCells("A1:I1");
  const titleCell1 = sheetSummary.getCell("A1");
  titleCell1.value = "LAPORAN REKAPITULASI TINGKAT STRES KERJA";
  titleCell1.font = { name: "Calibri", size: 16, bold: true, color: { argb: "FF0F172A" } };
  titleCell1.alignment = { vertical: "middle", horizontal: "left" };

  sheetSummary.mergeCells("A2:I2");
  const subtitleCell1 = sheetSummary.getCell("A2");
  subtitleCell1.value = `DINI Sehat Mental | Total Responden: ${results.length} | Diunduh: ${new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;
  subtitleCell1.font = { name: "Calibri", size: 10, italic: true, color: { argb: "FF64748B" } };
  subtitleCell1.alignment = { vertical: "middle", horizontal: "left" };

  sheetSummary.addRow([]); // Baris kosong

  // Header Kolom
  const summaryHeaders = [
    "No",
    "Nama Responden",
    "Usia",
    "Status / Jabatan",
    "Skor Total",
    "Level Stres",
    "WFC Index",
    "Stress Index",
    "Tanggal Pengisian",
  ];
  const summaryHeaderRow = sheetSummary.addRow(summaryHeaders);
  summaryHeaderRow.height = 26;

  summaryHeaderRow.eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = borderStyle;
  });

  // Isi Data Responden
  results.forEach((r, idx) => {
    const row = sheetSummary.addRow([
      idx + 1,
      r.respondent.name,
      r.respondent.age,
      r.respondent.status,
      r.score_total,
      r.stress_level.toUpperCase(),
      r.wfc_index ?? "-",
      r.stress_index ?? "-",
      new Date(r.created_at).toLocaleDateString("id-ID"),
    ]);
    row.height = 22;

    const isEven = idx % 2 === 1;
    const rowBg = isEven ? "FFF8FAFC" : "FFFFFFFF";

    row.eachCell((cell, colNumber) => {
      cell.border = borderStyle;
      cell.font = { name: "Calibri", size: 10 };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 2 || colNumber === 4 ? "left" : "center",
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: rowBg },
      };

      // Badge Warna Level Stres
      if (colNumber === 6) {
        if (r.stress_level === "rendah") {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDCFCE7" } };
          cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF166534" } };
        } else if (r.stress_level === "sedang") {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
          cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF92400E" } };
        } else if (r.stress_level === "tinggi") {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEE2E2" } };
          cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF991B1B" } };
        }
      }
    });
  });

  sheetSummary.columns = [
    { width: 6 },
    { width: 28 },
    { width: 10 },
    { width: 26 },
    { width: 14 },
    { width: 16 },
    { width: 14 },
    { width: 14 },
    { width: 18 },
  ];

  // ==========================================
  // SHEET 2: DETAIL JAWABAN RESPONDEN (MATRIX)
  // ==========================================
  const sheetMatrix = workbook.addWorksheet("Detail Jawaban Responden", {
    views: [{ state: "frozen", xSplit: 2, ySplit: 4, showGridLines: true }],
  });

  // Judul
  sheetMatrix.mergeCells("A1:G1");
  const titleCell2 = sheetMatrix.getCell("A1");
  titleCell2.value = "MATRIKS REKAPITULASI JAWABAN TIAP BUTIR PERTANYAAN";
  titleCell2.font = { name: "Calibri", size: 16, bold: true, color: { argb: "FF0F172A" } };
  titleCell2.alignment = { vertical: "middle", horizontal: "left" };

  sheetMatrix.mergeCells("A2:G2");
  const subtitleCell2 = sheetMatrix.getCell("A2");
  subtitleCell2.value = "Geser ke kanan untuk melihat rincian jawaban P1 s.d. pertanyaan terakhir. Kolom Nama dan No dibekukan (freeze).";
  subtitleCell2.font = { name: "Calibri", size: 10, italic: true, color: { argb: "FF64748B" } };
  subtitleCell2.alignment = { vertical: "middle", horizontal: "left" };

  sheetMatrix.addRow([]); // Baris kosong

  // Tentukan daftar pertanyaan: gunakan questions.ts (1..109)
  const questionHeaders = questions.map((q) => `P${q.id}`);
  const matrixHeaders = [
    "No",
    "Nama Responden",
    "Usia",
    "Status / Jabatan",
    "Skor Total",
    "Level Stres",
    "Tanggal",
    ...questionHeaders,
  ];

  const matrixHeaderRow = sheetMatrix.addRow(matrixHeaders);
  matrixHeaderRow.height = 26;

  matrixHeaderRow.eachCell((cell, colNumber) => {
    cell.fill = colNumber <= 7 ? headerFill : { type: "pattern", pattern: "solid", fgColor: { argb: "FF334155" } };
    cell.font = headerFont;
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = borderStyle;
  });

  // Isi data baris matriks
  results.forEach((r, idx) => {
    const rawAnswers = r.answers || {};

    const questionValues = questions.map((q) => {
      // Periksa format kunci jawaban (angka id, 'P'+id, atau string id)
      const val = rawAnswers[q.id] ?? rawAnswers[String(q.id)] ?? rawAnswers[`P${q.id}`];
      if (val === undefined || val === null || val === "") return "-";
      return val;
    });

    const row = sheetMatrix.addRow([
      idx + 1,
      r.respondent.name,
      r.respondent.age,
      r.respondent.status,
      r.score_total,
      r.stress_level.toUpperCase(),
      new Date(r.created_at).toLocaleDateString("id-ID"),
      ...questionValues,
    ]);
    row.height = 22;

    const isEven = idx % 2 === 1;
    const rowBg = isEven ? "FFF8FAFC" : "FFFFFFFF";

    row.eachCell((cell, colNumber) => {
      cell.border = borderStyle;
      cell.font = { name: "Calibri", size: 10 };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 2 || colNumber === 4 ? "left" : "center",
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: rowBg },
      };

      if (colNumber === 6) {
        if (r.stress_level === "rendah") {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDCFCE7" } };
          cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF166534" } };
        } else if (r.stress_level === "sedang") {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
          cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF92400E" } };
        } else if (r.stress_level === "tinggi") {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEE2E2" } };
          cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF991B1B" } };
        }
      }
    });
  });

  // Lebar kolom matriks
  const matrixColWidths = [
    { width: 6 },
    { width: 28 },
    { width: 8 },
    { width: 24 },
    { width: 12 },
    { width: 14 },
    { width: 14 },
    ...questions.map(() => ({ width: 8 })),
  ];
  sheetMatrix.columns = matrixColWidths;

  // ==========================================
  // SHEET 3: ANALISIS PER KATEGORI
  // ==========================================
  const sheetCategory = workbook.addWorksheet("Skor per Kategori", {
    views: [{ showGridLines: true }],
  });

  sheetCategory.mergeCells("A1:F1");
  const titleCell3 = sheetCategory.getCell("A1");
  titleCell3.value = "ANALISIS BEBAN STRES PER KATEGORI DIMENSI";
  titleCell3.font = { name: "Calibri", size: 16, bold: true, color: { argb: "FF0F172A" } };
  titleCell3.alignment = { vertical: "middle", horizontal: "left" };

  sheetCategory.mergeCells("A2:F2");
  const subtitleCell3 = sheetCategory.getCell("A2");
  subtitleCell3.value = "Rincian kontribusi skor stres per masing-masing dimensi kuesioner.";
  subtitleCell3.font = { name: "Calibri", size: 10, italic: true, color: { argb: "FF64748B" } };
  subtitleCell3.alignment = { vertical: "middle", horizontal: "left" };

  sheetCategory.addRow([]);

  const categoryHeaders = [
    "No",
    "Nama Responden",
    "Kode Kategori",
    "Nama Dimensi Kategori",
    "Skor Diperoleh",
    "Status Responden",
  ];
  const categoryHeaderRow = sheetCategory.addRow(categoryHeaders);
  categoryHeaderRow.height = 26;
  categoryHeaderRow.eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = borderStyle;
  });

  let catRowCounter = 1;
  results.forEach((r) => {
    const sc = r.score_category || {};
    const categoriesList = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

    categoriesList.forEach((catKey) => {
      const scoreVal = sc[catKey] !== undefined ? sc[catKey] : "-";
      const row = sheetCategory.addRow([
        catRowCounter++,
        r.respondent.name,
        catKey,
        categoryNames[catKey] || `Kategori ${catKey}`,
        scoreVal,
        r.stress_level.toUpperCase(),
      ]);
      row.height = 20;

      const isEven = (catRowCounter - 1) % 2 === 1;
      row.eachCell((cell, colNumber) => {
        cell.border = borderStyle;
        cell.font = { name: "Calibri", size: 10 };
        cell.alignment = {
          vertical: "middle",
          horizontal: colNumber === 2 || colNumber === 4 ? "left" : "center",
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: isEven ? "FFF8FAFC" : "FFFFFFFF" },
        };
      });
    });
  });

  sheetCategory.columns = [
    { width: 8 },
    { width: 28 },
    { width: 14 },
    { width: 34 },
    { width: 16 },
    { width: 18 },
  ];

  // ==========================================
  // SHEET 4: KAMUS SOAL & SKALA NILAI
  // ==========================================
  const sheetDictionary = workbook.addWorksheet("Kamus Soal & Skala Nilai", {
    views: [{ showGridLines: true }],
  });

  // Bagian A: Skala Nilai
  sheetDictionary.mergeCells("A1:C1");
  const scaleTitle = sheetDictionary.getCell("A1");
  scaleTitle.value = "PANDUAN SKALA NILAI (LEGEND LIKERT)";
  scaleTitle.font = { name: "Calibri", size: 14, bold: true, color: { argb: "FF0F172A" } };

  sheetDictionary.addRow([]);

  const scaleHeaderRow = sheetDictionary.addRow(["Nilai / Opsi", "Keterangan Jawaban Kategori I - VIII", "Keterangan Jawaban Kategori IX"]);
  scaleHeaderRow.height = 24;
  scaleHeaderRow.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0284C7" } }; // Sky-600
    cell.font = headerFont;
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = borderStyle;
  });

  const scaleData = [
    ["1", "Sangat Setuju / Selalu / Benar", "Sangat tidak sesuai"],
    ["2", "Cukup Setuju / Sering / Cukup benar", "Sedikit"],
    ["3", "Kurang Setuju / Kadang-kadang / Kurang benar", "Cukup"],
    ["4", "Sangat Tidak Setuju / Tidak sama sekali / Sangat tidak benar", "Sangat cukup"],
    ["5", "-", "Sangat sesuai"],
  ];

  scaleData.forEach((s) => {
    const row = sheetDictionary.addRow(s);
    row.height = 20;
    row.eachCell((cell, colNumber) => {
      cell.border = borderStyle;
      cell.font = { name: "Calibri", size: 10 };
      cell.alignment = { vertical: "middle", horizontal: colNumber === 1 ? "center" : "left" };
    });
  });

  sheetDictionary.addRow([]);
  sheetDictionary.addRow([]);

  // Bagian B: Kamus Pertanyaan
  const dictTitleRowIndex = sheetDictionary.rowCount + 1;
  sheetDictionary.mergeCells(`A${dictTitleRowIndex}:C${dictTitleRowIndex}`);
  const dictTitle = sheetDictionary.getCell(`A${dictTitleRowIndex}`);
  dictTitle.value = "KAMUS BUTIR PERTANYAAN (QUESTION DICTIONARY)";
  dictTitle.font = { name: "Calibri", size: 14, bold: true, color: { argb: "FF0F172A" } };

  sheetDictionary.addRow([]);

  const dictHeaderRow = sheetDictionary.addRow(["Kode", "Kategori", "Bunyi Teks Pertanyaan Lengkap"]);
  dictHeaderRow.height = 26;
  dictHeaderRow.eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = borderStyle;
  });

  questions.forEach((q, idx) => {
    const row = sheetDictionary.addRow([
      `P${q.id}`,
      `Kategori ${q.category} - ${categoryNames[q.category] || ""}`,
      q.text,
    ]);
    row.height = 22;

    const isEven = idx % 2 === 1;
    row.eachCell((cell, colNumber) => {
      cell.border = borderStyle;
      cell.font = { name: "Calibri", size: 10 };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 1 ? "center" : "left",
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: isEven ? "FFF8FAFC" : "FFFFFFFF" },
      };
    });
  });

  sheetDictionary.columns = [
    { width: 12 },
    { width: 36 },
    { width: 75 },
  ];

  // ==========================================
  // GENERATE & TRIGGER DOWNLOAD
  // ==========================================
  const buffer = await workbook.xlsx.writeBuffer();
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `Rekap_Analisis_Stres_Kerja_${dateStr}.xlsx`;
  saveAs(new Blob([buffer]), fileName);
}
