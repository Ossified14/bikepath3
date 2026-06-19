import React, { useState, useEffect } from 'react';
import { Users, UserPlus, MessageSquare, Info, Send, ShieldCheck, Hash } from 'lucide-react';
import { getCommunities, joinCommunity, leaveCommunity, getCommunityMembers, getCommunityMessages, sendCommunityMessage } from '../services/bikepathService';

const CommunityPage = () => {
    const [groups, setGroups] = useState([]);
    const [activeGroup, setActiveGroup] = useState(null);
    const [viewMode, setViewMode] = useState('chat'); // 'chat' or 'members'
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        try {
            const res = await getCommunities();
            if (res.data.status) setGroups(res.data.data);
        } catch (err) { console.error(err); }
    };

    const openGroup = async (group) => {
        setActiveGroup(group);
        setViewMode('chat');
        loadMessages(group.id);
    };

    const loadMessages = async (id) => {
        try {
            const res = await getCommunityMessages(id);
            if (res.data.status) setMessages(res.data.data);
        } catch (err) { console.error(err); }
    };

    const loadMembers = async (id) => {
        try {
            const res = await getCommunityMembers(id);
            if (res.data.status) setMembers(res.data.data);
        } catch (err) { console.error(err); }
    };

    const handleJoinLeave = async (e, group) => {
        e.stopPropagation();
        try {
            if (group.is_member > 0) {
                await leaveCommunity(group.id);
            } else {
                await joinCommunity(group.id);
            }
            loadGroups();
            // Refresh active group data if it's the one we just joined/left
            if (activeGroup?.id === group.id) {
                const updatedGroups = await getCommunities();
                const current = updatedGroups.data.data.find(g => g.id === group.id);
                setActiveGroup(current);
            }
        } catch (err) { console.error(err); }
    };

    const handleSend = async () => {
        if (!text.trim()) return;
        try {
            await sendCommunityMessage(activeGroup.id, text);
            setText('');
            loadMessages(activeGroup.id);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="community-wrapper main-content">
            <div className="community-container card-duo" style={{ padding: 0, display: 'flex', height: '75vh', overflow: 'hidden' }}>
                {/* Sidebar */}
                <div className="sidebar" style={{ width: '300px', borderRight: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.3)' }}>
                    <div style={{ padding: '25px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <h2 style={{ fontSize: '1.5rem', fontStyle: 'italic' }}>COMMUNITIES</h2>
                    </div>
                    <div className="group-list" style={{ overflowY: 'auto', height: 'calc(100% - 80px)' }}>
                        {groups.map(g => (
                            <div 
                                key={g.id} 
                                onClick={() => openGroup(g)} 
                                className={`group-item ${activeGroup?.id === g.id ? 'active' : ''}`}
                                style={{ 
                                    padding: '15px 20px', 
                                    cursor: 'pointer', 
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    background: activeGroup?.id === g.id ? 'var(--z-gradient)' : 'transparent',
                                    transition: '0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>{g.name}</span>
                                        <span style={{ fontSize: '0.7rem', color: activeGroup?.id === g.id ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)', fontWeight: 700 }}>{g.member_count} RIDERS</span>
                                    </div>
                                    <button 
                                        className={`btn-join-mini ${g.is_member > 0 ? 'joined' : ''}`}
                                        onClick={(e) => handleJoinLeave(e, g)}
                                        style={{ 
                                            padding: '8px 16px', 
                                            borderRadius: '50px', 
                                            border: 'none', 
                                            fontSize: '0.75rem', 
                                            fontWeight: 900, 
                                            background: g.is_member > 0 ? 'rgba(255,255,255,0.1)' : 'var(--z-gradient)',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            boxShadow: g.is_member > 0 ? 'none' : '0 4px 15px rgba(0, 168, 232, 0.3)',
                                            transition: '0.2s',
                                            fontFamily: 'Montserrat'
                                        }}
                                    >
                                        {g.is_member > 0 ? 'LEAVE' : 'JOIN'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Panel */}
                <div className="main-panel" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', background: 'rgba(15, 23, 42, 0.1)' }}>
                    {activeGroup ? (
                        <>
                            <div className="panel-header" style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30, 41, 59, 0.4)' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontStyle: 'italic', fontSize: '1.4rem', color: 'var(--z-white)' }}>{activeGroup.name}</h3>
                                    <p style={{ margin: '5px 0 0', color: 'var(--z-blue)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>{activeGroup.description || 'No description available'}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className={`tab-btn ${viewMode === 'chat' ? 'active' : ''}`} onClick={() => setViewMode('chat')}>
                                        <MessageSquare size={20} />
                                    </button>
                                    <button className={`tab-btn ${viewMode === 'members' ? 'active' : ''}`} onClick={() => { setViewMode('members'); loadMembers(activeGroup.id); }}>
                                        <Users size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="panel-content" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                {viewMode === 'chat' ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <div className="message-list" style={{ flexGrow: 1, overflowY: 'auto', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            {messages.map(m => (
                                                <div key={m.id} className="message-bubble" style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--z-purple)', textTransform: 'uppercase' }}>{m.username}</span>
                                                        <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                    </div>
                                                    <div className="glass" style={{ padding: '12px 18px', borderRadius: '0 20px 20px 20px', border: '1px solid rgba(0, 168, 232, 0.2)' }}>
                                                        <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500, color: '#ece8e1' }}>{m.message}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {messages.length === 0 && (
                                                <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-secondary)' }}>
                                                    <MessageSquare size={40} opacity={0.2} style={{ marginBottom: '10px' }} />
                                                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Belum ada pesan. Mulai obrolan!</p>
                                                </div>
                                            )}
                                        </div>
                                        {activeGroup.is_member > 0 ? (
                                            <div style={{ padding: '20px 30px', background: 'rgba(15, 23, 42, 0.5)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '15px' }}>
                                                <input 
                                                    className="input-duo" 
                                                    style={{ borderRadius: '50px' }}
                                                    value={text} 
                                                    onChange={e => setText(e.target.value)} 
                                                    placeholder="TULIS PESAN UNTUK KOMUNITAS..." 
                                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
                                                />
                                                <button onClick={handleSend} className="btn-duo btn-primary" style={{ width: '50px', height: '50px', padding: 0, minWidth: 'auto' }}>
                                                    <Send size={20} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={{ padding: '20px', textAlign: 'center', background: 'rgba(252, 103, 25, 0.1)', borderTop: '1px solid var(--z-orange)' }}>
                                                <p style={{ fontWeight: 800, color: 'var(--z-orange)', margin: 0, fontSize: '0.8rem', letterSpacing: '1px' }}>GABUNG KOMUNITAS UNTUK IKUT BERDISKUSI</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ padding: '30px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                                        {members.map((m, idx) => (
                                            <div key={idx} className="glass" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '15px' }}>
                                                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--z-gradient)', padding: '2px' }}>
                                                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#0b0f19', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        {m.avatar ? <img src={m.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Users size={20} color="var(--z-blue)" />}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: 800, color: '#fff' }}>{m.username}</span>
                                                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--z-blue)', textTransform: 'uppercase' }}>{m.cycling_level || 'REKRUT'}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
                            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                                <Hash size={48} opacity={0.3} />
                            </div>
                            <p style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '1px' }}>PILIH KOMUNITAS UNTUK DIMULAI</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .tab-btn { background: none; border: none; padding: 10px; border-radius: 12px; cursor: pointer; color: var(--text-secondary); transition: 0.2s; }
                .tab-btn.active { background: rgba(0, 168, 232, 0.1); color: var(--z-blue); }
                .tab-btn:hover:not(.active) { color: #fff; background: rgba(255,255,255,0.05); }
                
                .group-item:hover:not(.active) { background: rgba(255,255,255,0.05); }
                
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

                @media (max-width: 900px) {
                    .community-container { flex-direction: column !important; height: auto !important; min-height: 80vh; }
                    .sidebar { width: 100% !important; height: 300px !important; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.1); }
                }
            `}</style>
        </div>
    );
};

export default CommunityPage;
