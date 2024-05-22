<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Task;

class MembershipController extends Controller
{

 public function addMemberToProject(Request $request)
 {
        // Validez les données de la requête
        $request->validate([
            'userId' => 'required|integer', // ID de l'utilisateur à ajouter
            'projectId' => 'required|integer', // ID du projet auquel ajouter l'utilisateur
        ]);

        // Créez une nouvelle entrée dans la table des membres
        $membership = new Membership();
        $membership->user_id = $request->userId;
        $membership->project_id = $request->projectId;
        $membership->user_role = "member";
        $membership->save();

        $user = User::find($request->userId);
        $avatarUrl = $user->avatar ? asset('storage/avatars/' . $user->avatar) : null;

        // Retournez une réponse JSON avec les détails de l'utilisateur ajouté
        return response()->json([
            'message' => 'Member added to project successfully',
            'member' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $avatarUrl // Inclure l'URL de l'avatar dans la réponse
            ]
        ], 200);
 }

 public function removeMemberFromProject(Request $request)
 {
      // Validez les données de la requête
      $request->validate([
        'projectId' => 'required|integer',
        'userId' => 'required|integer',
      ]);
      // Récupérer les données de la requête
      $projectId = $request->projectId;
      $userId = $request->userId;

      try {
         // Trouver et supprimer l'entrée de membre correspondante
         Membership::where('project_id', $projectId)
                  ->where('user_id', $userId)
                  ->delete();
                  Task::where('project_id', $projectId)
                  ->where('assigned_for', $userId)
                  ->update(['assigned_for' => null]);
      
              // Retourner une réponse indiquant que le membre a été supprimé avec succès
              return response()->json(['message' => 'Member removed from project successfully'], 200);
          } catch (\Exception $e) {
              // Gérer les erreurs
              return response()->json(['error' => 'Failed to remove member from project'], 500);
          }
      }
  
//Progress  fasakh ama veriife kbal
public function getProjectMembers($projectId)
{
    // Récupérer les membres du projet spécifié
    $projectMembers = Membership::where('project_id', $projectId)
        ->where('user_role', 'member')
        ->with('user') // Charger les détails de l'utilisateur associé
        ->get();

    return response()->json([
        'projectMembers' => $projectMembers
    ], 200);
}
public function checkUserRoleForProject(Request $request)
{
    // Valider les données de la requête
    $request->validate([
        'projectId' => 'required|integer',
    ]);

    // Récupérer l'ID du projet depuis la requête
    $projectId = $request->projectId;

    // Récupérer l'ID de l'utilisateur authentifié
    $authUserId = auth()->id();

    // Vérifier si l'utilisateur authentifié est chef de projet pour le projet donné
    $membership = Membership::where('project_id', $projectId)
        ->where('user_id', $authUserId)
        ->where('user_role', 'chef')
        ->first();

    if ($membership) {
        // L'utilisateur est chef de projet pour ce projet
        return response()->json(['isProjectLeader' => true]);
    } else {
        // L'utilisateur n'est pas chef de projet pour ce projet
        return response()->json(['isProjectLeader' => false]);
    }
}
}
