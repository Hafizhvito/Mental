<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Respondent;
use App\Models\Result;
use Carbon\Carbon;

class RespondentSampleSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('data/sample_respondents.json');
        if (!file_exists($jsonPath)) {
            $this->command->error("File sample_respondents.json tidak ditemukan!");
            return;
        }

        $data = json_decode(file_get_contents($jsonPath), true);
        if (!$data || !is_array($data)) {
            $this->command->error("Format JSON tidak valid!");
            return;
        }

        $count = 0;
        foreach ($data as $item) {
            $respondent = Respondent::create([
                'name' => $item['name'] ?? 'Responden',
                'age' => $item['age'] ?? 25,
                'status' => $item['status'] ?? 'Karyawan',
                'created_at' => Carbon::parse($item['created_at'] ?? now()),
                'updated_at' => Carbon::parse($item['created_at'] ?? now()),
            ]);

            Result::create([
                'respondent_id' => $respondent->id,
                'score_total' => $item['score_total'] ?? 0,
                'problematic_category' => count($item['answers'] ?? []),
                'stress_level' => in_array($item['stress_level'] ?? '', ['rendah', 'sedang', 'tinggi']) ? $item['stress_level'] : 'sedang',
                'wfc_index' => $item['wfc_index'] ?? 3,
                'stress_index' => $item['stress_index'] ?? 1,
                'score_category' => $item['score_category'] ?? null,
                'score_details' => null,
                'answers' => $item['answers'] ?? null,
                'created_at' => Carbon::parse($item['created_at'] ?? now()),
                'updated_at' => Carbon::parse($item['created_at'] ?? now()),
            ]);

            $count++;
        }

        $this->command->info("Berhasil mengimpor {$count} data responden contoh.");
    }
}
