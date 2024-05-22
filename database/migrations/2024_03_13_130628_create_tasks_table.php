<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


class CreateTasksTable extends Migration
{
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('status')->default('To Do');
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('assigned_for')->nullable(); // Utilisation de unsignedBigInteger

            $table->date('due_date')->nullable(); 
            $table->timestamps();

            // Définir les clés étrangères
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('assigned_for')->references('id')->on('users')->onDelete('cascade'); // Correction ici
        });
    }

    public function down()
    {
        Schema::dropIfExists('tasks');
    }
}
