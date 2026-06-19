<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Profile extends MY_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Profile_model');
    }

    public function index() {
        $user = $this->jwt->verify($this->jwt->get_token_from_request());
        if (!$user) return $this->response_json(['message' => 'Unauthorized'], 401);

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $profile = $this->Profile_model->get_profile($user->user_id);
            if ($profile->avatar && !filter_var($profile->avatar, FILTER_VALIDATE_URL)) {
                $profile->avatar = base_url('uploads/profiles/' . $profile->avatar);
            }
            return $this->response_json(['status' => true, 'data' => $profile]);
        }

        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $input = $this->get_json_input();
            
            if (!empty($input['username'])) {
                $new_username = htmlspecialchars($input['username']);
                if ($this->Profile_model->is_username_taken($new_username, $user->user_id)) {
                    return $this->response_json(['status' => false, 'message' => 'Username sudah digunakan'], 409);
                }
                $this->Profile_model->update_account($user->user_id, ['username' => $new_username]);
            }

            $profile_data = [
                'full_name' => $input['full_name'] ?? null,
                'bike_type' => $input['bike_type'] ?? null,
                'cycling_level' => $input['cycling_level'] ?? 'beginner',
                'address' => $input['address'] ?? null
            ];
            $this->Profile_model->update_profile($user->user_id, $profile_data);

            return $this->response_json(['status' => true, 'message' => 'Profile updated']);
        }
    }

    public function upload_avatar() {
        $user = $this->jwt->verify($this->jwt->get_token_from_request());
        if (!$user) return $this->response_json(['message' => 'Unauthorized'], 401);

        $config['upload_path']   = './uploads/profiles/';
        $config['allowed_types'] = 'gif|jpg|png|jpeg';
        $config['max_size']      = 2048; 
        $config['file_name']     = 'avatar_' . $user->user_id . '_' . time();

        if (!is_dir($config['upload_path'])) {
            mkdir($config['upload_path'], 0777, TRUE);
        }

        $this->load->library('upload', $config);

        if (!$this->upload->do_upload('avatar')) {
            return $this->response_json(['status' => false, 'message' => $this->upload->display_errors('', '')], 400);
        } else {
            $upload_data = $this->upload->data();
            $file_name = $upload_data['file_name'];
            $this->Profile_model->update_profile($user->user_id, ['avatar' => $file_name]);
            return $this->response_json([
                'status' => true, 
                'message' => 'Avatar uploaded', 
                'avatar_url' => base_url('uploads/profiles/' . $file_name)
            ]);
        }
    }
}
