<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = ['notification', 'from','to'];

    // Définir une valeur par défaut pour le champ 'from'
    protected $attributes = [
        'from' => 0,
        'to' => 0,

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
