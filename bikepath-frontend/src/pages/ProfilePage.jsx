import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, Mail, Bike, MapPin, Edit2, LogOut, Camera, Award, Zap, TrendingUp, Shield
} from 'lucide-react';
import { getProfile, updateProfile, uploadAvatar } from '../services/bikepathService';

const ProfilePage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profile, setProfile] = useState({
        full_name: '', 
        bike_type: '', 
        cycling_level: 'beginner', 
        address: '', 
        avatar: '', 
        username: '', 
        email: ''
    });

    useEffect(() => { loadProfile(); }, []);

    const loadProfile = async () => {
        try {
            const res = await getProfile();
            if (res.data.status && res.data.data) {
                setProfile(res.data.data);
            }
        } catch (err) { console.error(err); }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file);
        setUploading(true);
        try {
            const res = await uploadAvatar(formData);
            if (res.data.status) {
                setProfile({ ...profile, avatar: res.data.avatar_url });
                loadProfile();
            }
        } catch (err) { alert('Gagal upload'); } finally { setUploading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(profile);
            setIsEditing(false);
            loadProfile(); 
        } catch (err) { alert('Gagal simpan'); }
    };

    return (
        <div className="profile-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3rem', color: 'var(--z-white)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Zap size={40} color="var(--z-orange)" fill="var(--z-orange)" />
                    RIDER PROFILE
                </h1>
                <p style={{ color: 'var(--z-blue)', fontWeight: '800', letterSpacing: '2px', marginLeft: '55px' }}>LEVEL UP YOUR RIDE</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '30px', alignItems: 'start' }}>
                
                {/* LEFT COLUMN: AVATAR & STATS HIGHLIGHT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="card-duo" style={{ textAlign: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
                        {/* Decorative background element */}
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--z-gradient)', filter: 'blur(50px)', opacity: 0.3 }}></div>
                        
                        <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 25px' }}>
                            <div style={{ 
                                width: '180px', height: '180px', 
                                borderRadius: '50%',
                                padding: '5px',
                                background: 'var(--z-gradient)',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                position: 'relative', zIndex: 1
                            }}>
                                <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--z-deep-blue)', background: 'var(--z-navy)' }}>
                                    {profile.avatar ? (
                                        <img src={profile.avatar} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="Avatar" />
                                    ) : (
                                        <User size={80} color="var(--text-secondary)" />
                                    )}
                                </div>
                            </div>
                            <button 
                                className="btn-duo btn-primary" 
                                style={{ position:'absolute', bottom:'5px', right:'5px', padding:'10px', minWidth: 'auto', borderRadius: '50%', width: '45px', height: '45px', zIndex: 2 }} 
                                onClick={() => fileInputRef.current.click()}
                                type="button"
                            >
                                <Camera size={20} />
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{display:'none'}} accept="image/*" />
                            </button>
                        </div>
                        
                        <h2 style={{ fontSize: '2.5rem', color: 'var(--z-white)', marginBottom: '5px' }}>{profile.username}</h2>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 15px', background: 'rgba(252, 103, 25, 0.1)', border: '1px solid var(--z-orange)', borderRadius: '50px', color: 'var(--z-orange)', fontWeight: '800', fontSize: '0.8rem' }}>
                            <Shield size={14} /> ELITE RIDER
                        </div>
                    </div>

                    <div className="card-duo glass" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: 'var(--z-gradient)', padding: '10px', borderRadius: '12px' }}><TrendingUp size={24} color="white" /></div>
                            <div>
                                <h4 style={{ color: 'var(--z-white)', fontSize: '1.2rem', margin: 0 }}>RIDER RANK</h4>
                                <p style={{ color: 'var(--z-blue)', fontWeight: '800', fontSize: '0.9rem', margin: 0, textTransform: 'uppercase' }}>{profile.cycling_level || 'Beginner'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: DETAILED INFO */}
                <div className="card-duo" style={{ padding: '0', overflow: 'hidden', border: 'none' }}>
                    <div style={{ padding: '25px 35px', background: 'var(--z-gradient)', color: 'var(--z-white)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, color: 'var(--z-white)', fontSize: '1.5rem', fontStyle: 'italic' }}>PERSONNEL DATA</h3>
                        {!isEditing && (
                            <button 
                                className="btn-duo" 
                                style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 20px', fontSize: '0.8rem' }}
                                onClick={() => setIsEditing(true)}
                            >
                                <Edit2 size={16} /> EDIT
                            </button>
                        )}
                    </div>
                    
                    <div style={{ padding: '40px' }}>
                        {!isEditing ? (
                            <div style={{ display: 'grid', gap: '35px' }}>
                                <div className="info-block">
                                    <label>FULL NAME</label>
                                    <p className="val-text">{profile.full_name || '---'}</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                    <div className="info-block">
                                        <label>BIKE TYPE</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Bike size={24} color="var(--z-blue)" />
                                            <p className="val-text">{profile.bike_type || 'Standard'}</p>
                                        </div>
                                    </div>
                                    <div className="info-block">
                                        <label>COMMUNICATION</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Mail size={22} color="var(--z-purple)" />
                                            <p className="val-text-small">{profile.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="info-block">
                                    <label>BASE LOCATION</label>
                                    <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                                        <MapPin size={24} color="var(--z-orange)" />
                                        <p className="val-text-small" style={{ opacity: 0.8 }}>{profile.address || 'Location Unknown'}</p>
                                    </div>
                                </div>

                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '10px 0' }}></div>

                                <button 
                                    className="btn-duo btn-danger" 
                                    style={{ alignSelf: 'start' }} 
                                    onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                                >
                                    <LogOut size={18} /> DISCONNECT SESSION
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                <div className="form-row">
                                    <label>RIDER NAME</label>
                                    <input className="input-duo" value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})} />
                                </div>
                                <div className="form-row">
                                    <label>FULL NAME</label>
                                    <input className="input-duo" value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="form-row">
                                        <label>BIKE ARMADA</label>
                                        <input className="input-duo" value={profile.bike_type} onChange={e => setProfile({...profile, bike_type: e.target.value})} />
                                    </div>
                                    <div className="form-row">
                                        <label>RIDER LEVEL</label>
                                        <select className="input-duo" value={profile.cycling_level} onChange={e => setProfile({...profile, cycling_level: e.target.value})}>
                                            <option value="beginner">BEGINNER</option>
                                            <option value="intermediate">INTERMEDIATE</option>
                                            <option value="pro">PRO</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <label>BASE COORDINATES</label>
                                    <textarea className="input-duo" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} style={{ minHeight: '100px' }} />
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                                    <button type="submit" className="btn-duo btn-primary">SAVE CHANGES</button>
                                    <button type="button" className="btn-duo btn-outline" onClick={() => setIsEditing(false)}>CANCEL</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .info-block label {
                    display: block;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 800;
                    font-size: 0.8rem;
                    color: var(--z-blue);
                    letter-spacing: 2px;
                    margin-bottom: 8px;
                }
                .val-text {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 1.8rem;
                    font-weight: 900;
                    font-style: italic;
                    color: var(--z-white);
                }
                .val-text-small {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: var(--z-white);
                }
                .form-row label {
                    display: block;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 800;
                    font-size: 0.85rem;
                    margin-bottom: 8px;
                    color: var(--z-blue);
                }
                @media (max-width: 800px) {
                    div[style*="grid-template-columns: 1fr 1.8fr"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProfilePage;
