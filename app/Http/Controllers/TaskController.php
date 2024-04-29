<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator; 
use App\Models\Membership;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    //
    public function createTask(Request $request, $projectId)
    {
        // Validation des données d'entrée
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'dueDate' => 'nullable|date',
        ]);
 
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
 
        try {
            // Création de la tâche
            $task = new Task();
            $task->title = $request->title;
            $task->project_id = $projectId;
            $task->status = 'To Do';
            $task->due_date = $request->dueDate;
            $task->save();
 
            return response()->json($task, 201);
        } catch (QueryException $e) {
            // Enregistrement de l'erreur dans les logs
            Log::error('Failed to create task: ' . $e->getMessage());
 
            // Réponse d'erreur
            return response()->json(['error' => 'Failed to create task.'], 500);
        }
    }
 
    public function deleteTask($taskId)
    {
        try {
          $task = Task::findOrFail($taskId);
          $task->delete();
      
          return response()->json(['message' => 'Task deleted successfully']);
        } catch (\Exception $e) {
          return response()->json(['error' => 'Failed to delete task.'], 500);
        }
    }
     
    public function getTasksByProjectId($projectId)
    {
     $tasks = Task::where('project_id', $projectId)->get(['id', 'title', 'due_date', 'status','user_id']); // Ajoutez 'due_date' à la sélection
     return response()->json($tasks);
    }
       
    public function assignTask(Request $request, $projectId, $taskId) 
    {
        try {
            $task = Task::where('project_id', $projectId)->findOrFail($taskId);
            $task->user_id = $request->user_id;
            $task->save();
            
            return response()->json(['message' => 'Task assigned successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to assign task'], 500);
        }
    }

    public function canDropTask(Request $request, $taskId)
    {
        try {
            // Récupérer l'utilisateur authentifié et la valeur de isChef du request
            $user = auth()->user();
            $isChef = $request->isChef;
    
            // Vérifier si l'utilisateur existe et s'il a les autorisations nécessaires
            $task = Task::findOrFail($taskId);
            if ($user && ($task->user_id === $user->id || $isChef)) {
                // L'utilisateur est autorisé à déplacer cette tâche
                return response()->json(['canDrop' => true], 200);
            } else {
                // L'utilisateur n'est pas autorisé à déplacer cette tâche
                return response()->json(['canDrop' => false], 403);
            }
        } catch (\Exception $e) {
            // Erreur lors de la recherche de la tâche ou de la récupération de l'utilisateur
            return response()->json(['error' => 'Failed to check task permissions'], 500);
        }
    }
    

    public function updateTaskStatus(Request $request, $taskId)
    {
        $validator = Validator::make($request->all(), [
          'status' => 'required|in:To Do,Doing,Done,Closed', // Ensure valid status
        ]);
      
        if ($validator->fails()) {
          return response()->json($validator->errors(), 400);
        }
      
        try {
          $task = Task::findOrFail($taskId);
          $task->status = $request->get('status'); // Access status from request body
          $task->save();
      
          return response()->json($task);
        } catch (\Exception $e) {
          return response()->json(['error' => 'Failed to update task status.'], 500);
        }
    }
       
    public function getTasksByProjectUserId($projectId)
    {
      try {
          // Récupérer l'ID de l'utilisateur authentifié
          $userId = auth()->id();

          $tasks = Task::where('project_id', $projectId)
          ->where('user_id', $userId)
          ->get();
    
          return response()->json($tasks);
      } catch (\Exception $e) {
          return response()->json(['error' => 'Failed to retrieve tasks by project ID.'], 500);
      }
    }

    public function getTasksByProjectAndMember($projectId, $memberId)
    {
        try {
            // Récupérer les tâches du membre spécifié dans le projet spécifié
            $tasks = Task::where('project_id', $projectId)
                         ->where('user_id', $memberId)
                         ->get();
    
            return response()->json($tasks);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve tasks by project and member ID.'], 500);
        }
    }


    
  
}    





   