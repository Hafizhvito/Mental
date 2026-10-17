<?php
//  Result.php Model
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    use HasFactory;

    protected $fillable = [
    'respondent_id',
    'score_I', 'score_II', 'score_III', 'score_IV', 'score_V', 
    'score_VI', 'score_VII', 'score_VIII', 'score_IX',
    'problematic_category',
    'score_total',
    'stress_level',
    'wfc_index',
    'stress_index',
    'score_category',
    'score_details',
    'answers',
];

protected $casts = [
    'score_category' => 'array',
    'score_details' => 'array',
    'answers' => 'array',
];

    public function respondent()
    {
        return $this->belongsTo(Respondent::class);
    }
}



