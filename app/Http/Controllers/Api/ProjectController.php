<?php

namespace App\Http\Controllers\Api;

use App\Models\Project;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator; 
use App\Models\Membership;
use App\Models\User;

use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{

public function update(Request $request, $id)
{
    // Validation des données envoyées dans la requête
    $validator = Validator::make($request->all(), [
        'title' => 'required|string',
        'description' => 'required|string',
        'deadline' => 'nullable|date',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    try {
        // Récupérer le projet à mettre à jour
        $project = Project::findOrFail($id);

        // Mettre à jour les détails du projet
        $project->title = $request->input('title');
        $project->description = $request->input('description');
        $project->deadline = $request->input('deadline') ? date('Y-m-d', strtotime($request->input('deadline'))) : null;

        $project->save();

        return response()->json(['message' => 'Project updated successfully', 'project' => $project], 200);
    } catch (\Exception $e) {
        // Gérer les erreurs
        return response()->json(['error' => 'An error occurred while updating the project'], 500);
    }
}

    public function getProjectChefAvatar($projectId)
    {
        try {
            // Rechercher l'ID de l'utilisateur (chef) associé au projet avec le rôle de chef
            $chefId = Membership::where('project_id', $projectId)
                ->where('user_role', 'chef')
                ->value('user_id');
    
            // Vérifier si l'ID du chef a été trouvé
            if (!$chefId) {
                return response()->json(['error' => 'Chef not found for this project'], 404);
            }
    
            // Trouver l'utilisateur (chef) du projet par son ID
            $chef = User::findOrFail($chefId);
    
            // Construire l'URL de l'avatar du chef
            $avatarUrl = $chef->avatar ? asset('storage/avatars/' . $chef->avatar) : null;
    
            // Renvoyer l'URL de l'avatar du chef
            return response()->json(['avatar' => $avatarUrl]);
        } catch (\Exception $e) {
            // Gérer les erreurs
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
    
    
    //Organisation code
    public function store(Request $request)
    {
        $user = $request->user();
    
        // Valider les données envoyées dans la requête
        $validatedData = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'deadline' => 'nullable|date', // Assurez-vous que la date est valide
        ]);
    
        // Créez un nouveau projet avec les données validées
        try {
            $project = new Project();
            $project->title = $validatedData['title'];
            $project->description = $validatedData['description'];
            $project->deadline = $validatedData['deadline']; // Assurez-vous que le nom du champ correspond à celui dans votre modèle Project
            $project->save();
        
            Membership::create([
                'user_id' => $user->id,
                'project_id' => $project->id,
                'user_role' => 'chef',
            ]);
            return response()->json($project, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create project.'], 500);
        }
    }

    public function showProjectsWithRole(Request $request)
{
    $user = $request->user();

    // Récupérer tous les projets du chef pour l'utilisateur authentifié
    $chefProjects = $user->projects()->wherePivot('user_role', 'chef')->get();

    // Récupérer tous les projets des membres pour l'utilisateur authentifié
    $memberProjects = $user->projects()->wherePivot('user_role', '!=', 'chef')->get();

    // Ajouter les informations sur l'avatar et le nom du chef pour chaque projet membre
    foreach ($memberProjects as $project) {
        $chef = $project->users()->wherePivot('user_role', 'chef')->first();
        $project->chef_avatar = $chef->avatar ? asset('storage/avatars/' . $chef->avatar) : null;
        $project->chef_name = $chef->name;
    }

    // Répondre avec les projets en tant qu'admin, chef ou membre selon le rôle de l'utilisateur
    return response()->json([
        'chefProjects' => $chefProjects,
        'memberProjects' => $memberProjects
    ]);
}


    

    public function destroy(Project $project)
    {
        // Assurez-vous que le projet appartient à l'utilisateur authentifié
        if ($project->user_id !== auth()->id()) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        // Supprimez le projet de la base de données
        $project->delete();

        // Répondre avec un statut de succès
        return response()->json(['message' => 'Projet supprimé avec succès']);
    }

    public function showMembers($projectId)
    {
        try {
            // Récupérer le projet avec ses membres
            $project = Project::with('users')->findOrFail($projectId);
            
            // Collecter les détails des membres avec leurs avatars, en excluant l'utilisateur authentifié
            $members = [];
            foreach ($project->users as $user) {
                if ($user->id !== auth()->id()) { // Exclure l'utilisateur authentifié
                    $avatarUrl = $user->avatar ? asset('storage/avatars/' . $user->avatar) : null;
                    $members[] = [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'avatar' => $avatarUrl,
                    ];
                }
            }
            
            // Retourner les membres du projet avec leurs avatars
            return response()->json(['members' => $members], 200);
        } catch (\Exception $e) {
            // Gérer l'erreur si le projet n'est pas trouvé
            return response()->json(['error' => 'Project not found'], 404);
        }
    }
    

    public function index(Request $request)
{
    $user = $request->user();
    
    // Vérifier si l'utilisateur est authentifié
    if ($user) {
        // Récupérer la page demandée depuis la requête
        $page = $request->query('page', 1);
        $perPage = 5; // Nombre de projets par page

        // Calculer l'offset pour la pagination
        $offset = ($page - 1) * $perPage;

        // Récupérer les projets associés à cet utilisateur dans la table memberships avec pagination
        $projects = Project::join('memberships', 'projects.id', '=', 'memberships.project_id')
            ->where('memberships.user_id', $user->id)
            ->skip($offset)
            ->take($perPage)
            ->get(['projects.*']);

        // Récupérer le nombre total de projets associés à cet utilisateur
        $totalProjectsCount = Project::join('memberships', 'projects.id', '=', 'memberships.project_id')
            ->where('memberships.user_id', $user->id)
            ->count();

        if ($projects->isNotEmpty()) {
            // Des projets sont associés à cet utilisateur
            return response()->json([
                'projects' => $projects,
                'totalProjectsCount' => $totalProjectsCount
            ]);
        } else {
            // Aucun projet trouvé pour cet utilisateur
            return response()->json(['message' => 'No projects found for this user'], 404);
        }
    } else {
        // Utilisateur non authentifié
        return response()->json(['error' => 'Unauthorized'], 401);
    }
}

public function show($id)
{
    try {
        $project = Project::findOrFail($id);
        return response()->json($project);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Project not found'], 404);
    }
}

}