<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Community extends MY_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Community_model');
    }

    public function index() {
        $user = $this->jwt->verify($this->jwt->get_token_from_request());
        if (!$user) return $this->response_json(['message' => 'Unauthorized'], 401);

        $groups = $this->Community_model->get_all_groups($user->user_id);
        return $this->response_json(['status' => true, 'data' => $groups]);
    }

    public function join() {
        $user = $this->jwt->verify($this->jwt->get_token_from_request());
        if (!$user) return $this->response_json(['message' => 'Unauthorized'], 401);

        $input = $this->get_json_input();
        $this->Community_model->join_group($input['community_id'], $user->user_id);
        return $this->response_json(['status' => true, 'message' => 'Joined']);
    }

    public function leave() {
        $user = $this->jwt->verify($this->jwt->get_token_from_request());
        if (!$user) return $this->response_json(['message' => 'Unauthorized'], 401);

        $input = $this->get_json_input();
        $this->Community_model->leave_group($input['community_id'], $user->user_id);
        return $this->response_json(['status' => true, 'message' => 'Left']);
    }

    public function members($community_id) {
        $members = $this->Community_model->get_members($community_id);
        return $this->response_json(['status' => true, 'data' => $members]);
    }

    public function messages($community_id) {
        $user = $this->jwt->verify($this->jwt->get_token_from_request());
        if (!$user) return $this->response_json(['message' => 'Unauthorized'], 401);

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $messages = $this->Community_model->get_messages($community_id);
            return $this->response_json(['status' => true, 'data' => $messages]);
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = $this->get_json_input();
            if (empty($input['message'])) {
                return $this->response_json(['status' => false, 'message' => 'Message is required'], 400);
            }
            $this->Community_model->send_message($community_id, $user->user_id, $input['message']);
            return $this->response_json(['status' => true, 'message' => 'Message sent']);
        }
    }
}
