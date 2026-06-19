<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Activity extends MY_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Activity_model');
    }

    public function index() {
        $user = $this->jwt->verify($this->jwt->get_token_from_request());
        if (!$user) return $this->response_json(['message' => 'Unauthorized'], 401);

        $activities = $this->Activity_model->get_user_activities($user->user_id);
        return $this->response_json(['status' => true, 'data' => $activities]);
    }
}
