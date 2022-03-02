<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Wordle;

class WordleController extends Controller
{


    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function wordle()
    {
      $wordle = Wordle::select('wordle')->where('start', '<=', date('Y-m-d H:i:s'))->where('end', '>', date('Y-m-d H:i:s'))->where('publish', 1)->first();
      if(is_null($wordle)){
        $wordle = Wordle::where('publish', 1)->first();
      }

      return response()->json([
        'wordle' => $wordle->wordle
      ]);
    }
}
