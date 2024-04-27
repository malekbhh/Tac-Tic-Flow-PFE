<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use Illuminate\Http\Request;
use App\Models\User;

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

         // Retourner une réponse indiquant que le membre a été supprimé avec succès
         return response()->json(['message' => 'Member removed from project successfully'], 200);
       } catch (\Exception $e) {
        // Gérer les erreurs
        return response()->json(['error' => 'Failed to remove member from project'], 500);
      }
 }
    
}
