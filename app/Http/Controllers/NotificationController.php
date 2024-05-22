<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use Pusher\Pusher;
use App\Models\User;
use App\Events\NotificationSent; // Importer l'événement NotificationSent


class NotificationController extends Controller
{
    /**
     * Récupérer les notifications de l'utilisateur authentifié.
     *
     * @return \Illuminate\Http\JsonResponse
     */

     // NotificationController.php
public function getUnreadNotifications()
{
    // Récupérer l'utilisateur authentifié
    $user = auth()->user();

    // Retourner le nombre de notifications non lues de l'utilisateur
    return response()->json(['unreadNotifications' => $user->unreadNotifications]);
}

    public function updateUnreadNotifications()
    {
        // Récupérer l'utilisateur authentifié
        $user = auth()->user();

        // Mettre à jour les notifications non lues à zéro
        $user->unreadNotifications = 0;

        // Enregistrer l'utilisateur mis à jour dans la base de données
        $user->save();

        // Retourner une réponse JSON
        return response()->json(['message' => 'Unread notifications updated successfully']);
    
}
    
    public function getNotifications()
    {
        // Récupérer les notifications pour l'utilisateur authentifié
        $notifications = Notification::where('to', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['notifications' => $notifications]);
    }

    /**
     * Envoyer une notification à un utilisateur.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendMessage(Request $request)
    {
        // Valider la requête
        $request->validate([
            'notification' => 'required|string',
            'receiver_id' => 'required|exists:users,id',
        ]);

        // Créer la notification
        $notification = Notification::create([
            'from' => auth()->id(),
            'to' => $request->receiver_id,
            'notification' => $request->notification,
        ]);
        // Après avoir créé une notification
$user = User::find($request->receiver_id);
$user->unreadNotifications++; // Augmentez le compteur unreadNotifications
$user->save();



        
        // Configuration de Pusher
        $options = [
            'cluster' => 'eu',
            'useTLS' => true
        ];
        // Création d'une instance de Pusher avec les bonnes valeurs pour les arguments
        $pusher = new Pusher(
            'cb9e28174a3601ab1cff', // auth key
            '6473849b1f611fc76141', // secret key
            '1797358', // app id
            $options
        );

        // Déclencher un événement avec Pusher
        $pusher->trigger('notification.' . $request->receiver_id, 'NotificationSent', $notification); 
    
        // Retourner une réponse JSON
        return response()->json(['notification' => $notification]);
    }



    
}





// public function createNotification(Request $request)
// {

//     Notification::create([
//         'user_id' => Auth::user()->id, 
//         'notification' => $request->message,
//     ]);

//     return response()->json(['message' => 'Notification created successfully'], 200);
// }
// public function getUserNotifications(Request $request)
// {
//     $userNotifications = Notification::where('user_id', Auth::id())->get();
//     return response()->json(['notifications' => $userNotifications], 200);
// }
