<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
*/
$route['default_controller'] = 'welcome';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;

// ==================== API Routes (Standardized) ====================

// Auth
$route['api/auth/login']    = 'Api/Auth/login';
$route['api/auth/register'] = 'Api/Auth/register';
$route['api/auth/users']    = 'Api/Auth/users';

// Profile
$route['api/profile']               = 'Api/Profile/index';
$route['api/profile/upload_avatar'] = 'Api/Profile/upload_avatar';

// Activity
$route['api/activity'] = 'Api/Activity/index';

// Map / Tracking
$route['api/map/save_tracking'] = 'Api/Map/save_tracking';

// Friendship
$route['api/friendship']          = 'Api/Friendship/index';
$route['api/friendship/follow']   = 'Api/Friendship/follow';
$route['api/friendship/unfollow'] = 'Api/Friendship/unfollow';

// Community
$route['api/community']                 = 'Api/Community/index';
$route['api/community/join']            = 'Api/Community/join';
$route['api/community/leave']           = 'Api/Community/leave';
$route['api/community/members/(:num)']  = 'Api/Community/members/$1';
$route['api/community/messages/(:num)'] = 'Api/Community/messages/$1';
