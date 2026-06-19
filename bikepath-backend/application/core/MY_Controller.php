<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Base Controller for RESTful API in Bikepath
 * Handles CORS, JSON Input, and JSON Responses
 */
class MY_Controller extends MX_Controller {

    public function __construct()
    {
        parent::__construct();
        
        // Handle CORS - Pindahkan ke paling atas
        $this->_handle_cors();
        
        $this->load->library('jwt');
    }

    /**
     * Handle Cross-Origin Resource Sharing (CORS)
     */
    private function _handle_cors()
    {
        // Izinkan asal (origin) dari manapun (untuk development)
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Content-Length, Accept-Encoding, Authorization, X-Requested-With, Origin, Accept");
        header("Access-Control-Max-Age: 86400"); // Cache preflight selama 24 jam
        
        // Tangani preflight OPTIONS request
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            header("HTTP/1.1 200 OK");
            exit;
        }
    }

    /**
     * Get JSON input from request body
     */
    protected function get_json_input()
    {
        $raw_input = file_get_contents('php://input');
        $input = json_decode($raw_input, true);
        return $input ?: [];
    }

    /**
     * Standard JSON response method
     */
    protected function response_json($data, $status_code = 200)
    {
        // Tambahkan header lagi di sini untuk memastikan respon JSON tetap membawa header CORS
        header("Access-Control-Allow-Origin: *");
        header('Content-Type: application/json; charset=utf-8');
        
        $this->output->set_status_header($status_code);
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}
