<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/wordle', [App\Http\Controllers\WordleController::class, 'wordle'])->name('wordle');

Route::post('/save-result', [App\Http\Controllers\ResultController::class, 'save'])->name('save-result');

Route::group(['prefix' => 'admin'], function () {
    Voyager::routes();
});
