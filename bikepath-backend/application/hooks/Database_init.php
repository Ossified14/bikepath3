<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Database_init {

    public function init() {
        $CI =& get_instance();
        $CI->load->database();

        // Cek apakah tabel users sudah ada
        if (!$CI->db->table_exists('users')) {
            $sql_path = FCPATH . 'bikepath.sql';
            if (file_exists($sql_path)) {
                $queries = file_get_contents($sql_path);
                
                // Pisahkan multiple queries
                $queries = array_filter(explode(';', $queries));
                
                foreach ($queries as $query) {
                    $trimmed_query = trim($query);
                    if (!empty($trimmed_query)) {
                        $CI->db->query($trimmed_query);
                    }
                }
                log_message('debug', 'Database Bikepath initialized from SQL file.');
            }
        }
    }
}
