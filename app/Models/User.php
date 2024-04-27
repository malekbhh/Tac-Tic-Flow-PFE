<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

   
    protected $fillable = [
        'name', 'email', 'password', 'role', 'departement', 'avatar',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'memberships')
                    ->withPivot('user_role'); // Si vous avez d'autres colonnes pivot, ajoutez-les ici
    }
   public function tasks()
   {
       return $this->hasMany(Task::class);
   }


   public function notifications()
   {
       return $this->hasMany(Notification::class);
   }
 
   public function message(){
    $this->hasMany(Message::class);
}


public function getJWTIdentifier()
{
    return $this->getKey();
}

/**
 * Return a key value array, containing any custom claims to be added to the JWT.
 *
 * @return array
 */
public function getJWTCustomClaims()
{
    return [];
}
}
