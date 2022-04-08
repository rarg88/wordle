<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Wordle;
use App\Models\Result;


class ResultController extends Controller
{
    public function save(Request $request){
      $success = false;
      $wordle_name = $request->wordle;
      $intentos = $request->intentos;
      $wordle = Wordle::where('wordle', $wordle_name)->first();

      if($wordle):
        $result = Result::where('wordle_id', $wordle->id)->where('intentos', $intentos)->first();

        if($result):
          $result->count++;
          $result->updated_at = date("Y-m-d H:i:s");
          $result->save();
          $message = 'Resultado actualizado. ';
        else:
          $result = new Result;
          $result->wordle_id = $wordle->id;
          $result->intentos = $intentos;
          $result->count = 1;
          $result->save();
          $message = 'Resultado creado. ';

        endif;
          $success = true;
      else:
        $message = 'Wordle no encontrado';
      endif;

      $data['success'] = $success;
      $data['message'] = $message;

      return response()->json($data);
    }
}
