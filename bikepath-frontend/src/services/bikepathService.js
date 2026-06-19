import api from './api';

export const saveTracking = (data) => api.post('/api/map/save_tracking', data);
export const getActivities = () => api.get('/api/activity');
export const getProfile = () => api.get('/api/profile');
export const updateProfile = (data) => api.put('/api/profile', data);
export const uploadAvatar = (formData) => api.post('/api/profile/upload_avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const getFriends = () => api.get('/api/friendship');
export const followFriend = (friend_id) => api.post('/api/friendship/follow', { friend_id });
export const unfollowFriend = (friend_id) => api.post('/api/friendship/unfollow', { friend_id });
export const getAllUsers = () => api.get('/api/auth/users');
export const getCommunities = () => api.get('/api/community');
export const joinCommunity = (community_id) => api.post('/api/community/join', { community_id });
export const leaveCommunity = (community_id) => api.post('/api/community/leave', { community_id });
export const getCommunityMembers = (id) => api.get(`/api/community/members/${id}`);
export const getCommunityMessages = (id) => api.get(`/api/community/messages/${id}`);
export const sendCommunityMessage = (id, message) => api.post(`/api/community/messages/${id}`, { message });
