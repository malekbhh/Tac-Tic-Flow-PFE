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

  
   Route::post('/user/avatar', [UserController::class, 'updatePhoto']);

  //organisation
  //user
  Route::get('/user1', [UserController::class, 'getUser']);
   Route::get('/user1/{id}', [UserController::class, 'getUserById']);

  Route::get('/usersAccount', [UserController::class, 'indexUsers']);
  Route::post('/usersAccount', [UserController::class, 'storee']);
  Route::delete('/usersAccount/{user}', [UserController::class, 'destroyUsers']);
//Projects
Route::get('/projects/{id}', [ProjectController::class, 'show']);
Route::put('/projects/{id}', [ProjectController::class, 'update']);
Route::post('/projects', [ProjectController::class, 'store']);

Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

Route::post('/add-member-to-project', [MembershipController::class, 'addMemberToProject']);
Route::delete('/remove-member-from-project', [MembershipController::class,'removeMemberFromProject']);
Route::get('/projectsWithRole', [ProjectController::class, 'showProjectsWithRole']);
Route::get('/projects/{projectId}/chef/avatar', [ProjectController::class, 'getProjectChefAvatar']);

//Task
Route::get('/projects/{projectId}/tasks', [TaskController::class, 'getTasksByProjectId']);
Route::post('/projects/{projectId}/tasks', [TaskController::class, 'createTask']);
Route::put('/projects/{projectId}/tasks/{taskId}/assign',[TaskController::class,'assignTask']);
Route::post('/tasks/{taskId}/status', [TaskController::class, 'updateTaskStatus']);
Route::post('/tasks/{taskId}/check-can-drop', [TaskController::class,'canDropTask']);
Route::delete('/tasks/{taskId}', [TaskController::class, 'deleteTask']);
Route::put('/tasks/{id}/remove-member', [TaskController::class, 'removeMemberFromTask']);
Route::post('/tasksUpdate/{id}', [TaskController::class, 'updateTask']);

//Member 
// Route::put('/projects/{projectId}/tasks/{taskId}/assign',[TaskController::class,'assignTask']);
Route::get('/users/{taskId}/avatar', [UserController::class, 'getUserByTaskId']);
Route::get('/usersNotMembers', [UserController::class, 'usersNotMembers']);
Route::get('projects/{projectId}/members', [ProjectController::class, 'showMembers']);
Route::post('/check-user-role', [MembershipController::class, 'checkUserRoleForProject']);
// Route::get('/memberships/{projectId}', [MembershipController::class, 'getProjectMembers']);

  //Chat
  Route::get('/chat-users', [UserController::class, 'getChatUsers'])->name('chat-user-list');
  Route::post('/send/message', [ChatController::class, 'sendMessage'])->name('send.message');
  Route::get('/user-messages/{userId}', [ChatController::class, 'getUserMessages']);

  //Notifications
  Route::get('/notifications', [NotificationController::class, 'getNotifications']);
  Route::post('/notifications/update-unread',[NotificationController::class, 'updateUnreadNotifications']);
  Route::post('/send-notification', [NotificationController::class, 'sendMessage']);
//Link 
Route::post('/tasks/{taskId}/add-link-url', [TaskController::class, 'addLinkUrl']);
Route::get('/tasks/{taskId}/links', [TaskController::class, 'getTaskLinks']);
Route::delete('/links/{linkId}', [TaskController::class, 'deleteLink']);


  //Calendar
  Route::post('/events', [EventsController::class, 'store']);
  Route::get('/events', [EventsController::class, 'index']); // Récupérer les événements de l'utilisateur authentifié
  Route::delete('/events/{id}', [EventsController::class, 'destroy']);

  //Progress
  Route::get('/projects', [ProjectController::class, 'index']);
  Route::get('/tasks/project/{projectId}/member/{memberId}', [TaskController::class, 'getTasksByProjectAndMember']);
  Route::get('/tasks/project/{projectId}', [TaskController::class, 'getTasksByProjectUserId']);

  Route::post('/logout', [AuthController::class, 'logout']);
});




  //organisation Routes publiques (non authentifiées)
  Route::post('/login', [AuthController::class, 'login'])->name('login');
  Route::post('/login-with-google', [AuthController::class, 'handleGoogleCallback']);
  Route::post('/passwordreset', [AuthController::class, 'passwordReset']);
