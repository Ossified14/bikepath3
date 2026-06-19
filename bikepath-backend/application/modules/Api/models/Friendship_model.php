<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Friendship_model extends CI_Model {
    public function get_friends($user_id) {
        $this->db->select('users.id, users.username, up.avatar, up.cycling_level');
        $this->db->from('friendships');
        $this->db->join('users', 'users.id = friendships.friend_id');
        $this->db->join('user_profiles up', 'up.user_id = users.id', 'left');
        $this->db->where('friendships.user_id', $user_id);
        $friends = $this->db->get()->result();

        foreach ($friends as $f) {
            if ($f->avatar) {
                if (!filter_var($f->avatar, FILTER_VALIDATE_URL)) {
                    $f->avatar = base_url('uploads/profiles/' . $f->avatar);
                }
            }
        }

        return $friends;
    }

    public function follow($user_id, $friend_id) {
        $data = ['user_id' => $user_id, 'friend_id' => $friend_id];
        return $this->db->replace('friendships', $data);
    }

    public function unfollow($user_id, $friend_id) {
        return $this->db->delete('friendships', ['user_id' => $user_id, 'friend_id' => $friend_id]);
    }
}
