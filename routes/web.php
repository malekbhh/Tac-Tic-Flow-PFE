<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ChatController;


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

Route::get('/chat', [ChatController::class, 'index'])->name('chat');

Route::get('/chat/{id}', [ChatController::class, 'selectUser'])->name('chat.user');
Route::post('/send/message', [ChatController::class, 'sendMessage'])->name('send.message');
Route::get('/chat-users', [UserController::class, 'getChatUsers'])->name('chat-user-list');
Route::post('/usersAccount', [UserControlle::class, 'storee']);