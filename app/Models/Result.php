<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    use HasFactory;

    protected $fillable = [
      'wordle_id',
      'intento',
      'count',
    ];

    public function wordle() {
      return $this->belongsTo(Wordle::class);
   }

}
