import React, { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { Bike, User, Mail, Lock } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [status, setStatus] = useState({ loading: false, error: '', success: false });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: false });

        try {
            await register(formData);
            setStatus({ loading: false, error: '', success: true });
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed. Check your data.';
            setStatus({ loading: false, error: msg, success: false });
        }
    };

    return (
        <div className="auth-wrapper" style={{ maxWidth: '450px', margin: '40px auto', padding: '0 20px' }}>
            <div className="card-duo glass" style={{ padding: '50px 40px', textAlign: 'center', borderTop: '4px solid var(--z-purple)' }}>
                <div style={{ marginBottom: '35px' }}>
                    <div className="logo-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                        <div style={{ background: 'var(--z-gradient)', padding: '12px', borderRadius: '18px' }}>
                            <Bike size={38} color="#fff" />
                        </div>
                        <h1 style={{ fontSize: '2.4rem', margin: 0, fontStyle: 'italic', letterSpacing: '-1px' }}>
                            BIKE<span style={{ color: 'var(--z-blue)' }}>PATH</span>
                        </h1>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontWeight: '700', fontSize: '0.9rem', letterSpacing: '1px' }}>JOIN THE NETWORK</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="input-with-icon">
                        <User className="field-icon" size={18} color="var(--z-blue)" />
                        <input 
                            className="input-duo"
                            style={{ paddingLeft: '50px', borderRadius: '50px' }}
                            type="text" 
                            name="username" 
                            placeholder="RIDER USERNAME"
                            value={formData.username} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="input-with-icon">
                        <Mail className="field-icon" size={18} color="var(--z-purple)" />
                        <input 
                            className="input-duo"
                            style={{ paddingLeft: '50px', borderRadius: '50px' }}
                            type="email" 
                            name="email" 
                            placeholder="EMAIL ADDRESS"
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="input-with-icon">
                        <Lock className="field-icon" size={18} color="var(--z-orange)" />
                        <input 
                            className="input-duo"
                            style={{ paddingLeft: '50px', borderRadius: '50px' }}
                            type="password" 
                            name="password" 
                            placeholder="PASSWORD"
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    
                    <button type="submit" className="btn-duo btn-primary" disabled={status.loading} style={{ marginTop: '10px', width: '100%', fontSize: '1.2rem' }}>
                        {status.loading ? 'ENROLLING...' : 'ENROLL NOW'}
                    </button>
                </form>

                {status.error && (
                    <div className="animate-slide-in" style={{ marginTop: '20px', padding: '12px', background: 'rgba(255, 75, 75, 0.1)', color: '#ff4b4b', borderRadius: '12px', fontWeight: '800', border: '1px solid rgba(255, 75, 75, 0.3)', fontSize: '0.8rem' }}>
                        {status.error}
                    </div>
                )}

                {status.success && (
                    <div className="animate-slide-in" style={{ marginTop: '20px', padding: '15px', background: 'rgba(0, 168, 232, 0.1)', color: 'var(--z-blue)', borderRadius: '12px', fontWeight: '800', border: '1px solid var(--z-blue)', fontSize: '0.9rem' }}>
                        ENROLLMENT SUCCESSFUL! REDIRECTING...
                    </div>
                )}

                <div style={{ marginTop: '40px', paddingTop: '25px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '15px' }}>ALREADY A MEMBER?</p>
                    <Link to="/" className="btn-duo btn-outline" style={{ width: '100%', textDecoration: 'none', padding: '12px' }}>
                        SIGN IN
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .input-with-icon { position: relative; width: 100%; }
                .field-icon { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); z-index: 10; }
                .logo-container h1 span {
                    background: var(--z-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>
        </div>
    );
};

export default Register;
