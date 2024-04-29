<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Http\Requests\StoreMessageRequest;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;
use Pusher\Pusher;

class ChatController extends Controller
{
     //
    public function getUserMessages($userId)
    {
        // Récupérer l'ID de l'utilisateur authentifié
        $authUserId = auth()->id();
    
        // Récupérer les messages où l'utilisateur authentifié est l'expéditeur ou le destinataire
        $messages = Message::where(function($query) use ($authUserId, $userId) {
                $query->where('from', $authUserId)
                      ->orWhere('to', $authUserId);
            })
            ->where(function($query) use ($authUserId, $userId) {
                $query->where('from', $userId)
                      ->orWhere('to', $userId);
            })
            ->get();
    
        // Retourner les messages au format JSON
        return response()->json(['messages' => $messages]);
    }
    
    public function sendMessage(StoreMessageRequest $request)
    {
        $msg = $request->get('message');
        $receiver_id = $request->get('receiver_id');
    
        $message = Message::create([
            'from' => auth()->id(),
            'to' => $receiver_id,
            'message' => $msg,
            'type' => false
        ]);
        
        // Configuration de Pusher
      // Configuration de Pusher
      $options = [
       'cluster' => 'eu',
       'useTLS' => true
       ];

       // Création d'une instance de Pusher avec les bonnes valeurs pour les arguments
      $pusher = new Pusher(
      '5d19fbc4e019d389965e', // auth key
      '744f12f5db9c8327b21b', // secret key
      '1786800', // app id
       $options
       );
 

        // Déclencher un événement avec Pusher
        $pusher->trigger('chat.' . $receiver_id, 'MessageSent', $message->toArray());
    
        // Déclencher l'événement MessageSent
        event(new MessageSent($message));
    
        // Retourner une réponse JSON
        return response()->json(['message' => $message]);
    }


}    