<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Map extends MY_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Activity_model');
    }

    public function save_tracking() {
        $user = $this->jwt->verify($this->jwt->get_token_from_request());
        if (!$user) return $this->response_json(['message' => 'Unauthorized'], 401);

        $input = $this->get_json_input();
        
        $data = [
            'user_id'       => $user->user_id,
            'name'          => $input['name'] ?? 'Morning Ride',
            'distance'      => $input['distance'] ?? 0,
            'duration'      => $input['duration'] ?? 0,
            'calories'      => floor(($input['distance'] ?? 0) * 50),
            'path_data'     => json_encode($input['coordinates'] ?? []),
            'notes'         => $input['notes'] ?? '',
            'activity_date' => date('Y-m-d H:i:s')
        ];

        $this->Activity_model->save_activity($data);

        return $this->response_json(['status' => true, 'message' => 'Aktivitas berhasil disimpan']);
    }
}