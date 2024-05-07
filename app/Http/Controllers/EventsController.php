<?php


namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;
use App\Models\Event;

class EventsController extends Controller
{
    public function store(Request $request)
    {
        try {
            $user_id = Auth::id(); // Récupérer l'ID de l'utilisateur authentifié
            $event = new Event();
            $event->title = $request->input('title');
            $event->start = $request->input('start');
            $event->user_id = $user_id; // Associer l'ID de l'utilisateur à l'événement
            $event->save();
    
            error_log('Event created successfully: ' . $event->title);
            
            return response()->json(['success' => true, 'event' => $event]); // Retourner l'événement créé dans la réponse
        } catch (\Exception $e) {
            error_log('Error creating event: ' . $e->getMessage());
    
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
    public function index()
    {
        // Récupérer les événements de l'utilisateur authentifié
        $userEvents = Auth::user()->events;

        return response()->json($userEvents);
    } 
    public function destroy($id)
{
    try {
        // Récupérer l'événement à supprimer
        $event = Event::findOrFail($id);

        // Vérifier si l'utilisateur est autorisé à supprimer l'événement
        if ($event->user_id !== Auth::id()) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 403);
        }

        // Supprimer l'événement
        $event->delete();

        return response()->json(['success' => true]);
    } catch (\Exception $e) {
        error_log('Error deleting event: ' . $e->getMessage());

        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

}
