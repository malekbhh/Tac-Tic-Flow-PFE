<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Project;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator; 
use App\Models\Membership;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Link; // Remplacer Fichier par Link


class TaskController extends Controller
{   
   
    public function addLinkUrl(Request $request, $taskId)
    {
        $validatedData = $request->validate([
            'linkUrl' => 'required|url',
        ]);

        $link = new Link();
        $link->task_id = $taskId;
        $link->url = $validatedData['linkUrl'];
        $link->save();

        return response()->json(['link' => $link]);
    }

    public function getTaskLinks($taskId)
    {
        $links = Link::where('task_id', $taskId)->get();
        return response()->json(['links' => $links]);
    }
   public function deleteLink($linkId)
    {
        $link = Link::findOrFail($linkId);
        $link->delete();

        return response()->json(['message' => 'Link deleted successfully'], 200);
    }

    

    public function createTask(Request $request, $projectId)
    {
        // Validation des données d'entrée
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'dueDate' => 'nullable|date',
            'priority' => 'required|string|in:low,medium,high', // Add validation for priority
            'description' => 'nullable|string', // Add validation for description
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
            $task->priority = $request->priority; // Set priority
            $task->due_date = $request->dueDate;
    
            // Enregistrer la description uniquement si elle est présente dans la requête et n'est pas null
            if ($request->has('description') && $request->input('description') !== null) {
                $task->description = $request->input('description');
            }
    
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
     $tasks = Task::where('project_id', $projectId)->get(['id', 'title', 'due_date', 'status', 'assigned_for', 'priority', 'description']); // Inclure la description

     return response()->json($tasks);
    }
       
    public function assignTask(Request $request, $projectId, $taskId) 
    {
        try {
            $task = Task::where('project_id', $projectId)->findOrFail($taskId);
            $task->assigned_for = $request->user_id;
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
            if ($user && ($task->assigned_for=== $user->id || $isChef)) {
                // L'utilisateur est autorisé à déplacer cette tâche
                return response()->json(['canDrop' => true], 200);
            } else {
                // L'utilisateur n'est pas autorisé à déplacer cette tâche
                return response()->json(['canDrop' => false], 403);
            }
        } catch (\Exception $e) {
            // Gérer les autres erreurs
            return response()->json(['error' => $e->getMessage()], 500);
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
       //vefier estaamelthech
    public function getTasksByProjectUserId($projectId)
    {
      try {
          // Récupérer l'ID de l'utilisateur authentifié
          $userId = auth()->id();

          $tasks = Task::where('project_id', $projectId)
          ->where('assigned_for', $userId)
          ->get();
    
          return response()->json($tasks);
      } catch (\Exception $e) {
          return response()->json(['error' => 'Failed to retrieve tasks by project ID.'], 500);
      }
    }
//zeda
    public function getTasksByProjectAndMember($projectId, $memberId)
    {
        try {
            // Récupérer les tâches du membre spécifié dans le projet spécifié
            $tasks = Task::where('project_id', $projectId)
                         ->where('assigned_for', $memberId)
                         ->get();
    
            return response()->json($tasks);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve tasks by project and member ID.'], 500);
        }
    }
    public function getTaskFiles($taskId)
    {
        $task = Task::find($taskId);
    
        if (!$task) {
            return response()->json(['message' => 'Task not found.'], 404);
        }
    
        $files = $task->fichiers; // Utilisez la relation "fichiers" définie dans votre modèle Task
        return response()->json(['files' => $files], 200);
    }
    
    public function deleteTaskFile($fileId)
    {
        try {
            $file = Fichier::findOrFail($fileId);
            $file->delete();
    
            return response()->json(['message' => 'File deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete file'], 500);
        }
    }
    public function removeMemberFromTask(Request $request, $taskId)
    {
        try {
            $task = Task::findOrFail($taskId);
            if ($task->assigned_for !== null) {
                $task->assigned_for = null;
                $task->save();

                return response()->json(['message' => 'Member removed successfully', 'task' => $task], 200);
            } else {
                return response()->json(['message' => 'Task is already unassigned'], 200);
            }
        } catch (\Exception $e) {
            Log::error('Failed to remove member from task: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to remove member from task.'], 500);
        }
    }



    
    
   
    public function updateTask(Request $request, $id)
    {
        try {
            $task = Task::findOrFail($id);
    
            // Mise à jour des champs title, due_date et priority si présents dans la requête
            if ($request->has('title')) {
                $task->title = $request->input('title');
            }
            if ($request->has('due_date')) {
                $task->due_date = $request->input('due_date');
            }
            if ($request->has('priority')) {
                $task->priority = $request->input('priority');
            }
    
            if ($request->has('description')) {
                    $task->description = $request->input('description');
                }
            // Sauvegarde de la tâche
            $task->save();
    
            // Gestion des fichiers attachés s'ils sont présents dans la requête
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $filePath = $file->store('attachments');
                $task->files()->create(['name' => basename($filePath), 'path' => $filePath]);
            }
    
            return response()->json(['task' => $task], 200);
        } catch (\Exception $e) {
            Log::error('Failed to update task: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update task.'], 500);
        }
    }
 

 
    public function deleteFile($taskId, $fileId)
    {
        $task = Task::findOrFail($taskId);
        $file = $task->files()->findOrFail($fileId);

        Storage::delete($file->path);
        $file->delete();

        return response()->json(['message' => 'File deleted'], 200);
    }
}
