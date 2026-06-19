<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Friendship extends MY_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Friendship_model');
    }

    public function index() {
        $user = $this->jwt->verify($this->jwt->get_token_from_request());
        if (!$user) return $this->response_json(['message' => 'Unauthorized'], 401);

        $friends = $this->Friendship_model->get_friends($user->user_id);
        return $this->response_json(['status' => true, 'data' => $friends]);
    }

    public function follow() {
        $user = $this->jwt->verify($this->jwt->get_token_from_request());
        if (!$user) return $this->response_json(['message' => 'Unauthorized'], 401);

        $input = $this->get_json_input();
        if (empty($input['friend_id'])) {
            return $this->response_json(['status' => false, 'message' => 'Friend ID is required'], 400);
        }

        $this->Friendship_model->follow($user->user_id, $input['friend_id']);
        return $this->response_json(['status' => true, 'message' => 'Followed']);
    }

    public function unfollow() {
        $user = $this->jwt->verify($this->jwt->get_token_from_request());
        if (!$user) return $this->response_json(['message' => 'Unauthorized'], 401);

        $input = $this->get_json_input();
        if (empty($input['friend_id'])) {
            return $this->response_json(['status' => false, 'message' => 'Friend ID is required'], 400);
        }

        $this->Friendship_model->unfollow($user->user_id, $input['friend_id']);
        return $this->response_json(['status' => true, 'message' => 'Unfollowed']);
    }
}
