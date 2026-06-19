<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends MY_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->load->model('Auth_model');
    }

    public function login()
    {
        $input = $this->get_json_input();

        if (empty($input['email']) || empty($input['password'])) {
            return $this->response_json([
                'status' => false,
                'message' => 'Email and password are required'
            ], 400);
        }

        $user = $this->Auth_model->get_user_by_email($input['email']);

        if (!$user || !password_verify($input['password'], $user->password)) {
            return $this->response_json([
                'status' => false,
                'message' => 'Invalid email or password'
            ], 401);
        }

        $token = $this->jwt->create([
            'user_id' => $user->id,
            'email'   => $user->email,
            'role'    => $user->role ?? 'user'
        ]);

        return $this->response_json([
            'status' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => [
                    'id'       => $user->id,
                    'username' => $user->username,
                    'email'    => $user->email,
                    'role'     => $user->role ?? 'user'
                ],
                'token' => $token
            ]
        ]);
    }

    public function register()
    {
        $input = $this->get_json_input();

        if (empty($input['username']) || empty($input['email']) || empty($input['password'])) {
            return $this->response_json([
                'status' => false,
                'message' => 'Username, email, and password are required'
            ], 400);
        }

        if ($this->Auth_model->get_user_by_email($input['email'])) {
            return $this->response_json([
                'status' => false,
                'message' => 'Email already registered'
            ], 409);
        }

        $data = [
            'username' => htmlspecialchars($input['username']),
            'email'    => strtolower($input['email']),
            'password' => password_hash($input['password'], PASSWORD_BCRYPT),
            'role'     => 'user'
        ];

        $user_id = $this->Auth_model->register_user($data);

        if ($user_id) {
            return $this->response_json([
                'status' => true,
                'message' => 'Registration successful',
                'user_id' => $user_id
            ], 201);
        }

        return $this->response_json([
            'status' => false,
            'message' => 'Registration failed'
        ], 500);
    }

    public function users()
    {
        $user = $this->jwt->verify($this->jwt->get_token_from_request());
        if (!$user) return $this->response_json(['message' => 'Unauthorized'], 401);

        $users = $this->Auth_model->get_all_users($user->user_id);
        return $this->response_json(['status' => true, 'data' => $users]);
    }
}
