<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Mail\MailNotify;
use App\Http\Resources\UserResource;
use App\Models\User;
use Mail;
use App\Models\Task;

use App\Models\Membership;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

 public function getUser(Request $request)
 {
    // Récupérer l'utilisateur authentifié
    $user = $request->user();

    // Vérifier si l'utilisateur existe
    if (!$user) {
        return response()->json(['error' => 'Utilisateur non trouvé'], 404);
    }

    // Ajouter l'URL de l'avatar à la réponse JSON
    $avatarUrl = $user->avatar ? asset('storage/avatars/' . $user->avatar) : null;
    $userData = [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'avatar' => $avatarUrl,
        'departement' => $user->departement,
        'role' => $user->role,
        'unreadNotifications'=>$user->unreadNotifications,

    ];

    // Retourner les données de l'utilisateur
    return response()->json($userData);
 }

 public function usersNotMembers(Request $request)
 {
    try {
        $userId = auth()->id(); // Récupérez l'ID de l'utilisateur authentifié
        $members = $request->members;

        // Convertissez les membres en tableau d'identifiants
        $memberIds = is_array($members) ? $members : ($members ? [$members] : []);

        // Si aucun membre n'est fourni, récupérez tous les utilisateurs sauf l'utilisateur authentifié
        if (empty($memberIds)) {
            $users = User::where('id', '!=', $userId)->get();
        } else {
            // Récupérez tous les utilisateurs sauf ceux qui sont membres et l'utilisateur authentifié
            $users = User::whereNotIn('id', $memberIds)->where('id', '!=', $userId)->get();
        }
       // Ajoutez l'URL de l'avatar à chaque utilisateur
        $usersWithAvatarUrl = $users->map(function ($user) {
         $avatarUrl = $user->avatar ? asset('storage/avatars/' . $user->avatar) : null;
         return [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'avatar' => $avatarUrl,
         ];
        });

       return response()->json(['data' => $usersWithAvatarUrl]);
    } catch (\Exception $e) {
      return response()->json(['error' => 'Internal Server Error'], 500);
    }
 }

 public function updatePhoto(Request $request)
 {
    // Check for file, access control, and validation
    $validator = Validator::make($request->all(), [
        'avatar' => 'sometimes|image|mimes:jpeg,png,jpg', // Adjust limits as needed
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    // Get the authenticated user
    $user = Auth::user();

    // Handle avatar update if provided
    if ($request->hasFile('avatar')) {
        // Get the uploaded file
        $avatar = $request->file('avatar');

        // Generate a unique filename with extension
        $avatarName = Str::uuid() . '.' . $avatar->getClientOriginalExtension();

        // Secure storage with access control (consider private storage)
        $disk = Storage::disk('avatars'); // Create a custom disk for avatars (optional)
        $path = $disk->put($avatarName, $avatar->getContent());

        if (!$path) {
            return response()->json(['error' => 'Failed to store avatar'], 500);
        }

        // Update the user's avatar path in the database
        $user->avatar = $avatarName;
    }

    // Update user fields if provided
    if ($request->filled('name')) {
        $user->name = $request->input('name');
    }
    if ($request->filled('email')) {
        $user->email = $request->input('email');
    }
    if ($request->filled('password')) {
        $user->password = bcrypt($request->input('password')); // Hash the password for security
    }

    // Save the user's updates
    $user->save();

    // Return a JSON response with updated user details
    return response()->json([
        'user' => $user, // Optionally, return updated user details
    ]);
 }

 public function indexUsers()
 {

    return UserResource::collection(User::query()->orderBy('id')->paginate(10));
 }

 public function storee(Request $request)
 {
  // Validez les données de la requête
  $validatedData = $request->validate([
      'name' => 'required|string',
      'email' => 'required|email|unique:users',
      'departement' => 'required|string',
  ]);

  // Générez un mot de passe aléatoire
  $password = Str::random(10);
  Log::info("Mot de passe non crypté : " . $password);

  // Créez un nouvel utilisateur avec les données validées et le mot de passe aléatoire
  $user = User::create([
      'name' => $validatedData['name'],
      'email' => $validatedData['email'],
      'departement' => $validatedData['departement'],
      'password' => Hash::make($password),
  ]);

    // Envoi de l'e-mail
    $data = [
      'subject' => 'Access Request - ' . $request->name,
      'body' => 
          "Name: " . $request->name . "\n" .
          "Email: " . $request->email . "\n" .
          "Departement: " . $request->departement. "\n" .
          "password:" . $password ,
  ];

  try
  {
     Mail::to($user->email)->send(new MailNotify($data));
     return response()->json(['success' => 'Email sent successfully!', 'user' => $user]);
  } catch(Exception $th){
      return response()->json(['error' => 'Failed to send email. Please try again later.'], 500);
  }
  


  // Retournez une réponse JSON avec le nouvel utilisateur créé
  return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
 }

 public function destroyUsers(User $user)
 {
    // Get the ID before deletion
    $idBeforeDeletion = $user->id;

    $user->delete();

  
    return response("", 204);
 }

 public function getChatUsers()
 {
    $users= User::where('id','<>',auth()->id())->paginate(50);
    return $users;
 }

 public function getUserById($id)
 {
    // Récupérer l'utilisateur par son ID
    $user = User::find($id);

    // Vérifier si l'utilisateur existe
    if (!$user) {
        return response()->json(['error' => 'Utilisateur non trouvé'], 404);
    }

    // Ajouter l'URL de l'avatar à la réponse JSON
    $avatarUrl = $user->avatar ? asset('storage/avatars/' . $user->avatar) : null;
    $userData = [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'avatar' => $avatarUrl,
    ];

    // Retourner les données de l'utilisateur
    return response()->json($userData);
 }
//  public function getUserByTaskId($taskId)
// {
//     try {
//         // Récupérer la tâche par son ID
//         $task = Task::find($taskId);

//         // Vérifier si la tâche existe
//         if (!$task) {
//             return response()->json(['error' => 'Tâche non trouvée'], 404);
//         }

//         // Récupérer l'ID de l'utilisateur associé à la tâche
//         $userId = $task->user_id;

//         // Utiliser la fonction getUserById pour récupérer les données de l'utilisateur
//         $userData = $this->getUserById($userId);

//         // Retourner les données de l'utilisateur
//         return $userData;
        
//     } catch (\Exception $e) {
//         // Gérer les erreurs
//         return response()->json(['error' => $e->getMessage()], 500);
//     }
// }
public function getUserByTaskId($taskId)
{
    try {
        // Récupérer la tâche par son ID
        $task = Task::find($taskId);

        // Vérifier si la tâche existe
        if (!$task) {
            return response()->json(['error' => 'Tâche non trouvée'], 404);
        }

        // Vérifier si l'utilisateur associé à la tâche existe
        if (!$task->user_id) {
            return response()->json(['message' => 'Aucun utilisateur associé à cette tâche'], 200);
        }

        // Utiliser la fonction getUserById pour récupérer les données de l'utilisateur
        $userData = $this->getUserById($task->user_id);

        // Retourner les données de l'utilisateur
        return $userData;
        
    } catch (\Exception $e) {
        // Gérer les erreurs
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

}