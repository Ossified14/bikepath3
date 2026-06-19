import React, { useState, useEffect, useMemo } from 'react';
import { Users, UserPlus, UserMinus, UserCheck, Search, X, Zap, Trophy, Shield } from 'lucide-react';
import { getFriends, getAllUsers, followFriend, unfollowFriend } from '../services/bikepathService';

const FriendsPage = () => {
    const [friends, setFriends] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [friendsRes, usersRes] = await Promise.all([
                getFriends(),
                getAllUsers()
            ]);
            
            if (friendsRes.data.status) setFriends(friendsRes.data.data);
            if (usersRes.data.status) setAllUsers(usersRes.data.data);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (id) => {
        try {
            await followFriend(id);
            fetchData();
        } catch (err) {
            alert("Gagal mengikuti");
        }
    };

    const handleUnfollow = async (id) => {
        if (window.confirm("Batal mengikuti teman ini?")) {
            try {
                await unfollowFriend(id);
                fetchData();
            } catch (err) {
                alert("Gagal batal mengikuti");
            }
        }
    };

    const isFollowing = (userId) => {
        return friends.some(f => f.id === userId);
    };

    // Filter rekomendasi (yang belum diikuti)
    const recommendations = useMemo(() => {
        return allUsers.filter(u => !isFollowing(u.id));
    }, [allUsers, friends]);

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return allUsers.filter(u => 
            u.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allUsers, searchQuery]);

    return (
        <div className="friends-page-wrapper main-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                <Users size={40} color="var(--z-blue)" />
                <h1 style={{ fontSize: '3rem', margin: 0 }}>RIDER NETWORK</h1>
            </div>

            {/* PENCARIAN TEMAN */}
            <div className="section-container" style={{ marginBottom: '40px' }}>
                <div className="search-box-glass">
                    <Search className="search-icon" size={22} color="var(--z-blue)" />
                    <input 
                        type="text" 
                        className="input-duo search-input-rider" 
                        placeholder="FIND OTHER RIDERS..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button className="clear-btn" onClick={() => setSearchQuery('')}>
                            <X size={20} />
                        </button>
                    )}
                </div>

                {searchQuery && (
                    <div className="search-results-overlay animate-slide-in" style={{ marginTop: '20px' }}>
                        <div style={{ borderLeft: '3px solid var(--z-blue)', paddingLeft: '12px', marginBottom: '15px' }}>
                            <h3 style={{ fontSize: '1rem', color: 'var(--z-blue)', margin: 0 }}>SEARCH RESULTS</h3>
                        </div>
                        <div className="rider-grid">
                            {searchResults.map(user => (
                                <div key={user.id} className="rider-card glass">
                                    <div className="rider-info-main">
                                        <div className="rider-avatar-box">
                                            {user.avatar ? <img src={user.avatar} alt="avatar" /> : <Users size={20} color="var(--z-blue)" />}
                                        </div>
                                        <div className="rider-names">
                                            <span className="rider-username">{user.username}</span>
                                            <span className="rider-rank">{user.cycling_level || 'REKRUT'}</span>
                                        </div>
                                    </div>
                                    <div className="rider-actions">
                                        {isFollowing(user.id) ? (
                                            <button className="btn-status joined" onClick={() => handleUnfollow(user.id)}>
                                                <UserCheck size={16} /> FOLLOWING
                                            </button>
                                        ) : (
                                            <button className="btn-duo btn-primary btn-mini" onClick={() => handleFollow(user.id)}>
                                                <UserPlus size={16} /> FOLLOW
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {searchResults.length === 0 && <p className="empty-state-text">No riders found matching "{searchQuery}"</p>}
                        </div>
                    </div>
                )}
            </div>

            {/* REKOMENDASI - HORIZONTAL SCROLL */}
            {!searchQuery && recommendations.length > 0 && (
                <div className="section-container" style={{ marginBottom: '50px' }}>
                    <div style={{ borderLeft: '3px solid var(--z-orange)', paddingLeft: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Zap size={20} color="var(--z-orange)" fill="var(--z-orange)" />
                        <h2 style={{ fontSize: '1.4rem', fontStyle: 'italic', margin: 0 }}>FEATURED RIDERS</h2>
                    </div>
                    <div className="rider-scroll-row">
                        {recommendations.map(user => (
                            <div key={user.id} className="featured-card glass">
                                <div className="featured-badge"><Trophy size={12} /> RECOMMENDED</div>
                                <div className="featured-avatar">
                                    <div className="avatar-ring">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="avatar" />
                                        ) : (
                                            <div className="icon-placeholder-ring">
                                                <Users size={30} color="var(--z-blue)" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span className="featured-name">{user.username}</span>
                                <span className="featured-level">{user.cycling_level || 'Beginner'}</span>
                                <button className="btn-duo btn-primary" style={{ width: '100%', marginTop: '15px', padding: '10px', fontSize: '0.8rem' }} onClick={() => handleFollow(user.id)}>
                                    CONNECT
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MY NETWORK */}
            {!searchQuery && (
                <div className="section-container">
                    <div style={{ borderLeft: '3px solid var(--z-purple)', paddingLeft: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Shield size={20} color="var(--z-purple)" />
                        <h2 style={{ fontSize: '1.4rem', fontStyle: 'italic', margin: 0 }}>MY RIDER NETWORK</h2>
                    </div>
                    <div className="rider-grid">
                        {friends.map(friend => (
                            <div key={friend.id} className="rider-card glass following">
                                <div className="rider-info-main">
                                    <div className="rider-avatar-box active">
                                        {friend.avatar ? <img src={friend.avatar} alt="avatar" /> : <Users size={20} color="var(--z-white)" />}
                                    </div>
                                    <div className="rider-names">
                                        <span className="rider-username">{friend.username}</span>
                                    </div>
                                </div>
                                <button className="unfollow-btn" title="Unfollow" onClick={() => handleUnfollow(friend.id)}>
                                    <UserMinus size={20} />
                                </button>
                            </div>
                        ))}
                        {friends.length === 0 && (
                            <div className="card-duo glass empty-box-rider">
                                <p className="empty-state-text">Your network is empty. Start following other riders!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                .friends-page-wrapper { max-width: 1000px; margin: 0 auto; }
                
                /* Search Box */
                .search-box-glass { position: relative; width: 100%; }
                .search-icon { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); pointer-events: none; }
                .search-input-rider { width: 100%; padding: 18px 20px 18px 60px !important; font-weight: 800; border-radius: 50px !important; letter-spacing: 1px; }
                .clear-btn { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-secondary); cursor: pointer; }

                /* Horizontal Scroll */
                .rider-scroll-row { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 15px; scrollbar-width: none; }
                .rider-scroll-row::-webkit-scrollbar { display: none; }

                /* Featured Card */
                .featured-card {
                    flex: 0 0 190px;
                    padding: 25px 20px;
                    text-align: center;
                    border-radius: 24px;
                    position: relative;
                    transition: 0.3s;
                }
                .featured-card:hover { transform: translateY(-5px); border-color: var(--z-orange); }
                .featured-badge { position: absolute; top: 12px; left: 50%; transform: translateX(-50%); font-size: 0.55rem; font-weight: 900; color: var(--z-orange); display: flex; alignItems: center; gap: 4px; white-space: nowrap; }
                .featured-avatar { margin: 10px auto 15px; width: 80px; height: 80px; display: flex; justify-content: center; align-items: center; }
                .avatar-ring { width: 100%; height: 100%; border-radius: 50%; background: var(--z-gradient); padding: 3px; display: flex; justify-content: center; align-items: center; overflow: hidden; }
                .avatar-ring img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 3px solid var(--z-deep-blue); }
                .icon-placeholder-ring { width: 100%; height: 100%; border-radius: 50%; background: var(--z-deep-blue); display: flex; justify-content: center; align-items: center; }
                .featured-name { display: block; font-weight: 900; font-family: 'Montserrat'; color: #fff; font-size: 1rem; }
                .featured-level { display: block; font-size: 0.7rem; font-weight: 700; color: var(--z-blue); text-transform: uppercase; margin-top: 2px; }

                /* Rider Card (Grid) */
                .rider-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; }
                .rider-card { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
                .rider-info-main { display: flex; align-items: center; gap: 15px; }
                .rider-avatar-box { width: 45px; height: 45px; background: rgba(255,255,255,0.05); border-radius: 12px; display: flex; justify-content: center; align-items: center; overflow: hidden; }
                .rider-avatar-box.active { background: var(--z-gradient); }
                .rider-avatar-box img { width: 100%; height: 100%; object-fit: cover; }
                .rider-names { display: flex; flexDirection: column; }
                .rider-username { font-weight: 800; color: #fff; font-size: 1rem; }
                .rider-rank { font-size: 0.65rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; }

                /* Buttons & Misc */
                .btn-mini { padding: 8px 15px; font-size: 0.7rem; min-width: 90px; }
                .btn-status { background: rgba(0, 168, 232, 0.1); color: var(--z-blue); border: none; padding: 8px 12px; border-radius: 50px; font-weight: 900; font-size: 0.65rem; display: flex; align-items: center; gap: 5px; }
                .unfollow-btn { background: none; border: none; color: rgba(255,255,255,0.2); cursor: pointer; transition: 0.2s; }
                .unfollow-btn:hover { color: var(--z-orange); transform: scale(1.1); }
                
                .empty-box-rider { grid-column: 1 / -1; padding: 40px; text-align: center; }
                .empty-state-text { color: var(--text-secondary); font-weight: 700; font-size: 0.9rem; }

                @keyframes slideUp { from { transform: translateY(15px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-in { animation: slideUp 0.3s ease-out; }

                @media (max-width: 600px) {
                    .rider-grid { grid-template-columns: 1fr; }
                    .featured-card { flex: 0 0 160px; }
                }
            `}</style>
        </div>
    );
};

export default FriendsPage;
