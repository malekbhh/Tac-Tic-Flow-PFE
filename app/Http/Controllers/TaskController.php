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
use App\Models\Fichier;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;

use Illuminate\Support\Facades\Response;

use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    

    public function download(Request $request)
    {
        try {
            $fileName = $request->input('filename');
            $filePath = public_path($fileName);
    
            // Vérifier si le fichier existe
            if (!file_exists($filePath)) {
                return response()->json(['error' => 'File not found.'], 404);
            }
    
            // Télécharger le fichier avec le type de contenu approprié
            return Response::download($filePath, basename($filePath), [], 'inline'); // Utilisez 'inline' pour afficher directement le contenu dans le navigateur
        } catch (\Exception $e) {
            Log::error('Failed to download file: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to download file.'], 500);
        }
    }
    

    public function uploadAttachment(Request $request, $id)
    {
        try {
            $task = Task::findOrFail($id);
    
            if ($request->hasFile('file')) {
                $file = $request->file('file');
    
                // Valider que le fichier est une image
                if (!$file->isValid() || !in_array($file->getClientOriginalExtension(), ['jpg', 'jpeg', 'png', 'gif'])) {
                    return response()->json(['error' => 'Invalid file. Please upload an image file.'], 400);
                }
    
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                $filePath = $file->storeAs('uploads', $filename);
    
                $attachment = Fichier::create([
                    'task_id' => $task->id,
                    'name' => $filename, // Stocker le nom du fichier seulement
                ]);
    
                return response()->json(['success' => true, 'file' => $attachment]);
            } else {
                return response()->json(['error' => 'No file uploaded.'], 400);
            }
        } catch (\Exception $e) {
            Log::error('Failed to upload attachment: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to upload attachment.'], 500);
        }
    }
    
    
    public function updateTask(Request $request, $id)
    {
        try {
            $task = Task::findOrFail($id);
            if ($request->has('title')) {
                $task->title = $request->title;
            }
            if ($request->has('due_date')) {
                $dueDate = \Carbon\Carbon::parse($request->due_date)->toDateString();
                $task->due_date = $dueDate;
            }
            if ($request->has('priority')) {
                $task->priority = $request->priority;
            }
            $task->save();
            $updatedTask = Task::find($task->id);
            return response()->json(['success' => true, 'task' => $updatedTask]);
        } catch (\Exception $e) {
            Log::error('Failed to update task: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update task.'], 500);
        }
    }

    
    
    //
    public function createTask(Request $request, $projectId)
    {
        // Validation des données d'entrée
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'dueDate' => 'nullable|date',
            'priority' => 'required|string|in:low,medium,high', // Add validation for priority

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
     $tasks = Task::where('project_id', $projectId)->get(['id', 'title', 'due_date', 'status','user_id','priority']); // Ajoutez 'due_date' à la sélection
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
          ->where('user_id', $userId)
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
                         ->where('user_id', $memberId)
                         ->get();
    
            return response()->json($tasks);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve tasks by project and member ID.'], 500);
        }
    }


    
  
}    

