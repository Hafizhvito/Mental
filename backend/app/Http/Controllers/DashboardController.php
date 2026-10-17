<?php

// app/Http/Controllers/ResultController.php
namespace App\Http\Controllers;

use App\Models\Result;
use App\Models\Respondent;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $results = Result::with('respondent')->latest()->get();

        return response()->json($results);
    }

    public function destroy($id)
    {
        $result = Result::find($id);
        if (!$result) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $respondent = $result->respondent;
        $result->delete();

        if ($respondent && $respondent->results()->count() === 0) {
            $respondent->delete();
        }

        return response()->json(['message' => 'Data berhasil dihapus']);
    }

    public function destroyAll()
    {
        Result::query()->delete();
        Respondent::query()->delete();

        return response()->json(['message' => 'Semua data responden berhasil dihapus']);
    }
}
