<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Activity_model extends CI_Model {
    public function get_user_activities($user_id) {
        $this->db->where('user_id', $user_id);
        $this->db->order_by('activity_date', 'DESC');
        return $this->db->get('activities')->result();
    }

    public function save_activity($data) {
        return $this->db->insert('activities', $data);
    }
}
