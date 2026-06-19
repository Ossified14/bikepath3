<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth_model extends CI_Model {

    private $table = 'users';

    public function get_user_by_email($email)
    {
        return $this->db->get_where($this->table, ['email' => $email])->row();
    }

    public function register_user($data)
    {
        $this->db->insert($this->table, $data);
        return $this->db->insert_id();
    }
    
    public function get_user_by_id($id)
    {
        return $this->db->get_where($this->table, ['id' => $id])->row();
    }

    public function get_all_users($exclude_user_id) {
        $this->db->select('users.id, users.username, up.avatar, up.cycling_level');
        $this->db->from('users');
        $this->db->join('user_profiles up', 'up.user_id = users.id', 'left');
        $this->db->where('users.id !=', $exclude_user_id);
        $users = $this->db->get()->result();

        foreach ($users as $u) {
            if ($u->avatar) {
                if (!filter_var($u->avatar, FILTER_VALIDATE_URL)) {
                    $u->avatar = base_url('uploads/profiles/' . $u->avatar);
                }
            }
        }

        return $users;
    }
}
