<?php
// RespondentController.php 
namespace App\Http\Controllers;

use App\Models\Respondent;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

class RespondentController extends Controller
{
    public function store(Request $request)
    {
        // Validasi data respondent
        $respondentData = $request->validate([
            'name'   => 'required|string|max:100',
            'age'    => 'required|integer|min:18',
            'status' => 'required|string|max:50',
        ]);

        // Validasi data hasil scoring dari frontend
        $resultData = $request->validate([
            'problematic_category' => 'required|integer|min:0|max:63',
            'score_total' => 'required|integer|min:0|max:63',
            'stress_level' => 'required|string|in:rendah,sedang,tinggi', // Hanya 3 nilai
            'wfc_index' => 'required|integer|min:1|max:5',
            'stress_index' => 'required|integer|min:0|max:4',
            'score_category' => 'required|string',
            'score_details' => 'required|string',
        ]);

        // Log untuk debugging
        Log::info("=== DATA DITERIMA DARI FRONTEND ===");
        Log::info("Stress Level: " . $resultData['stress_level']);
        Log::info("Total Binary Flags: " . $resultData['score_total']);
        Log::info("Problematic Category: " . $resultData['problematic_category']);
        Log::info("WFC Index: " . $resultData['wfc_index'] . ", Stress Index: " . $resultData['stress_index']);

        // Validasi konsistensi (opsional - untuk memastikan data masuk akal)
        $binaryPercentage = ($resultData['score_total'] / 63) * 100;
        $expectedStressLevel = $this->getExpectedStressLevel($binaryPercentage);
        
        if ($resultData['stress_level'] !== $expectedStressLevel) {
            Log::warning("INCONSISTENCY: Received stress_level='{$resultData['stress_level']}' but {$binaryPercentage}% suggests '{$expectedStressLevel}'");
        }

        // Konversi JSON string ke array sebelum disimpan
        try {
            $resultData['score_category'] = json_decode($resultData['score_category'], true);
            $resultData['score_details'] = json_decode($resultData['score_details'], true);
        } catch (Exception $e) {
            Log::error("JSON decode error: " . $e->getMessage());
            return response()->json(['error' => 'Invalid JSON format'], 400);
        }
        
        // Cari atau buat respondent berdasarkan data
        $respondent = Respondent::firstOrCreate($respondentData);

        // Simpan result baru untuk respondent
        $result = $respondent->results()->create($resultData);

        Log::info("Data berhasil disimpan dengan ID respondent: " . $respondent->id);

        return response()->json([
            'id' => $respondent->id,
            'respondent' => $respondent,
            'result' => $result,
            'debug' => [
                'binary_percentage' => round($binaryPercentage, 1),
                'expected_stress_level' => $expectedStressLevel,
                'actual_stress_level' => $resultData['stress_level']
            ]
        ], 201);
    }

   public function show($respondentId) 
{
    $respondent = Respondent::with('results')->find($respondentId);
    
    if (!$respondent) {
        return response()->json(['error' => 'Respondent not found'], 404);
    }

    $latestResult = $respondent->results()->latest()->first();
    
    if (!$latestResult) {
        return response()->json(['error' => 'No results found'], 404);
    }

    // Return data yang konsisten dengan format yang diharapkan frontend
    return response()->json([
        'name' => $respondent->name,
        'age' => $respondent->age,
        'status' => $respondent->status,
        'score_total' => $latestResult->score_total,
        'problematic_category' => $latestResult->problematic_category,
        'stressLevel' => $latestResult->stress_level,
        'wfc_index' => $latestResult->wfc_index,       // Tambahkan ini
        'stress_index' => $latestResult->stress_index,   // Tambahkan ini
        'score_category' => $latestResult->score_category,
        'score_details' => $latestResult->score_details,
    ]);
}

    public function getResults($respondentId) 
    {
        return $this->show($respondentId);
    }

    /**
     * Helper function untuk menentukan expected stress level berdasarkan persentase
     * Sesuai dengan logika di frontend
     */
    private function getExpectedStressLevel(float $binaryPercentage): string
    {
        if ($binaryPercentage >= 40) {
            return 'tinggi';
        } elseif ($binaryPercentage >= 20) {
            return 'sedang';
        } else {
            return 'rendah';
        }
    }
}
