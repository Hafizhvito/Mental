<?php
// Respondent.php Model
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Respondent extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'age',
        'status',
    ];

    public function results()
    {
        return $this->hasMany(Result::class);
    }

}
