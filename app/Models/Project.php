<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;
    protected $fillable = [ 'title', 'description'];

    public function timestamps()
    {
        return ['created_at', 'updated_at'];
    }

    protected $rules = [
        'title' => 'required|string|max:255',
        'description' => 'required|string',
    ];

 
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
    public function users()
    {
        return $this->belongsToMany(User::class, 'memberships')
                    ->withPivot('user_role');
    }
}
