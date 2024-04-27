<?php

return [

    'default' => env('MAIL_MAILER', 'smtp'),
    'mailers' => [
        'smtp' => [
            'transport' => 'smtp',
            'host' => env('MAIL_HOST', 'smtp.gmail.com'),
            'port' => env('MAIL_PORT', 587),
            'encryption' => env('MAIL_ENCRYPTION', 'tls'),
            'username' => env('MAIL_USERNAME', 'belhouchetmalek01@gmail.com'),
            'password' => env('MAIL_PASSWORD', 'itlwznljykvcuqcy'),
            'timeout' => null,
        ],
    ],

    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'belhouchetmalek01@gmail.com'),
        'name' => env('MAIL_FROM_NAME', config('app.name')),
    ],

    // 'to' => [
    //     'address' => env('MAIL_TO_ADDRESS', 'malekbhh01@gmail.com'),
    //     'name' => env('MAIL_TO_NAME', 'Recipient'),
    // ],

];
