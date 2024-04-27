<?php

namespace App\Http\Controllers\Api;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Models\Project;
use App\Models\User;
use App\Mail\NewPasswordMail;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail; // Importez la classe Mail
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\JsonResponse;
use Illuminate\Mail\Mailer;
use Illuminate\Support\Facades\DB; // Ajout de l'utilisation de la classe DB
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\Mail\Message;
use Laravel\Socialite\Contracts\User as SocialiteUser;
class AuthController extends Controller
{
   
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        if (!Auth::attempt($credentials)) {
            return response([
                'message' => 'Provided email or password is incorrect'
            ], 422);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $token = $user->createToken('main')->plainTextToken;
        return response(compact('user', 'token'));
    }
 
public function logout(Request $request)
{
    /** @var \App\Models\User $user */
    $user = $request->user();
    $user->currentAccessToken()->delete();
    return response('', 204);
}

 public function passwordReset(Request $request)
{
    try {
        // Validation de la requête
        $data = $request->validate([
            'email' => 'required|email',
        ]);

        // Vérifier si l'utilisateur existe
        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            return response()->json([
                'message' => 'Aucun utilisateur trouvé avec cette adresse email.'
            ], 404);
        }

        // Générer un nouveau mot de passe aléatoire
        $newPasswordLength = 10; // Longueur du mot de passe
        $newPassword = Str::random($newPasswordLength);

        // Afficher le mot de passe non crypté en console
        \Log::info("Nouveau mot de passe pour {$user->email} : $newPassword");

        // Mettre à jour le mot de passe de l'utilisateur
        $user->password = bcrypt($newPassword);
        $user->saveQuietly();

        // Envoyer un e-mail à l'utilisateur avec le nouveau mot de passe
        Mail::to($user->email)->send(new NewPasswordMail($newPassword));
        
        return response()->json([
            'message' => 'Le mot de passe a été réinitialisé avec succès. Un nouveau mot de passe a été envoyé à l\'utilisateur.'
        ]);
        
    } catch (\Exception $e) {
        \Log::error("Une erreur s'est produite lors de la réinitialisation du mot de passe : " . $e->getMessage());
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la réinitialisation du mot de passe. Veuillez réessayer ultérieurement.'
        ], 500);
    }
}




  
public function handleGoogleCallback(Request $request)
{
    try {
        $user = $request->input('user');

        // Check if the user already exists in the Laravel database
        $existingUser = User::where('email', $user['email'])->first();

        if (!$existingUser) {
            // User doesn't exist, create a new user in the Laravel database
            $newUser = $this->createUserFromGoogle($user);
            Auth::login($newUser);
        } else {
            // User already exists, log in
            Auth::login($existingUser);
        }

        // Get the authenticated user and generate a token
        $authenticatedUser = Auth::user();
        $token = $authenticatedUser->createToken('main')->plainTextToken;

        return response()->json(['token' => $token]);
    } catch (\Exception $e) {
        // Handle the exception
        return response()->json(['error' => 'Google login failed. Please try again.'], 500);
    }
}

private function createUserFromGoogle(array $userData)
{
    return User::create([
        'name' => $userData['displayName'],
        'email' => $userData['email'],
        'password' => bcrypt(Str::random(16)),
    ]);
}
}

