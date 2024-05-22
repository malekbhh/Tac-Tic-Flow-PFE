<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('links', function (Blueprint $table) {
            $table->id();
            $table->string('url')->nullable(); // Changer 'name' par 'url'
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }
  
    public function down()
    {
        Schema::dropIfExists('links');
    }
};
