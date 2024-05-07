<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\Api\MembershipController;
use App\Http\Controllers\EventsController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
| These routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {

   //Organisation Code 
   Route::get('/user1', [UserController::class, 'getUser']);
   Route::post('/projects', [ProjectController::class, 'store']);

   Route::get('/projectsWithRole', [ProjectController::class, 'showProjectsWithRole']);
   Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
   Route::get('projects/{projectId}/members', [ProjectController::class, 'showMembers']);
   Route::get('/projects/{projectId}/chef/avatar', [ProjectController::class, 'getProjectChefAvatar']);

   Route::get('/usersNotMembers', [UserController::class, 'usersNotMembers']);
   Route::post('/add-member-to-project', [MembershipController::class, 'addMemberToProject']);
   Route::delete('/remove-member-from-project', [MembershipController::class,'removeMemberFromProject']);
   Route::post('/projects/{projectId}/tasks', [TaskController::class, 'createTask']);
   Route::delete('/tasks/{taskId}', [TaskController::class, 'deleteTask']);
   Route::get('/projects/{projectId}/tasks', [TaskController::class, 'getTasksByProjectId']);
   Route::put('/projects/{projectId}/tasks/{taskId}/assign',[TaskController::class,'assignTask']);
   Route::post('/tasks/{taskId}/status', [TaskController::class, 'updateTaskStatus']);
   Route::post('/tasks/{taskId}/check-can-drop', [TaskController::class,'canDropTask']);
   Route::post('/user/avatar', [UserController::class, 'updatePhoto']);
   Route::get('/users/{taskId}/avatar', [UserController::class, 'getUserByTaskId']);
  //pour progress
   Route::get('/projects', [ProjectController::class, 'index']);
   Route::get('/tasks/project/{projectId}', [TaskController::class, 'getTasksByProjectUserId']);
   Route::get('/memberships/{projectId}', [MembershipController::class, 'getProjectMembers']);
   Route::get('/tasks/project/{projectId}/member/{memberId}', [TaskController::class, 'getTasksByProjectAndMember']);
   Route::post('/tasksUpdate/{id}', [TaskController::class, 'updateTask']);

   Route::post('/check-user-role', [MembershipController::class, 'checkUserRoleForProject']);
//photo
Route::post('/tasks/{id}/upload',  [TaskController::class, 'uploadAttachment']);
Route::get('/download-file', [TaskController::class, 'downloadFile'])->name('downloadFile');
Route::get('/download', [TaskController::class, 'download']);

  //pour user 
  Route::get('/usersAccount', [UserController::class, 'indexUsers']);
  Route::post('/usersAccount', [UserController::class, 'storee']);
  Route::delete('/usersAccount/{user}', [UserController::class, 'destroyUsers']);
  //pour messenger
  Route::get('/user-messages/{userId}', [ChatController::class, 'getUserMessages']);
  Route::get('/chat-users', [UserController::class, 'getChatUsers'])->name('chat-user-list');
  Route::get('/user1/{id}', [UserController::class, 'getUserById']);
  Route::post('/send/message', [ChatController::class, 'sendMessage'])->name('send.message');
  //pour notifications
  Route::post('/notifications/update-unread',[NotificationController::class, 'updateUnreadNotifications']);
  Route::get('/notifications/unread', [NotificationController::class, 'getUnreadNotifications']);

  Route::get('/unread-notifications',[NotificationController::class, 'getUnreadNotifications']);

  Route::get('/notifications', [NotificationController::class, 'getNotifications']);

  // Endpoint pour envoyer une notification à un utilisateur
  Route::post('/send-notification', [NotificationController::class, 'sendMessage']);


  //calendar
  Route::post('/events', [EventsController::class, 'store']);
  Route::get('/events', [EventsController::class, 'index']); // Récupérer les événements de l'utilisateur authentifié
  Route::delete('/events/{id}', [EventsController::class, 'destroy']);

  Route::post('/logout', [AuthController::class, 'logout']);
});




  //organisation Routes publiques (non authentifiées)
  Route::post('/login', [AuthController::class, 'login'])->name('login');
  Route::post('/login-with-google', [AuthController::class, 'handleGoogleCallback']);
  Route::post('/passwordreset', [AuthController::class, 'passwordReset']);
