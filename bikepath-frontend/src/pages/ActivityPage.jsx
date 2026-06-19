import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Bike, Clock, Flame, StickyNote, Calendar, Map as MapIcon, Zap, Target, Timer } from 'lucide-react';
import { getActivities } from '../services/bikepathService';

const ActivityPage = () => {
    const [activities, setActivities] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await getActivities();
            if (res.data.status) setActivities(res.data.data);
        } catch (err) { console.error(err); }
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const stats = activities.reduce((acc, act) => {
        acc.totalDistance += parseFloat(act.distance || 0);
        acc.totalDuration += parseFloat(act.duration || 0);
        return acc;
    }, { totalDistance: 0, totalDuration: 0 });

    return (
        <div className="activity-container main-content" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                <Target size={40} color="var(--z-blue)" />
                <h1 style={{ fontSize: '3rem', margin: 0 }}>ACTIVITY HUB</h1>
            </div>

            {/* Stats Overview - Horizontal Scroll */}
            <div className="stats-scroll-container">
                <div className="stats-row">
                    <div className="card-duo glass stats-card">
                        <div className="stats-header">
                            <Zap size={24} color="var(--z-orange)" fill="var(--z-orange)" />
                            <span>TOTAL RIDES</span>
                        </div>
                        <h2>{activities.length}</h2>
                    </div>
                    <div className="card-duo glass stats-card">
                        <div className="stats-header">
                            <MapIcon size={24} color="var(--z-blue)" fill="var(--z-blue)" />
                            <span>DISTANCE (KM)</span>
                        </div>
                        <h2>{stats.totalDistance.toFixed(1)}</h2>
                    </div>
                    <div className="card-duo glass stats-card">
                        <div className="stats-header">
                            <Timer size={24} color="var(--z-purple)" fill="var(--z-purple)" />
                            <span>TOTAL TIME</span>
                        </div>
                        <h2>{Math.floor(stats.totalDuration)}<span style={{ fontSize: '1rem', marginLeft: '5px' }}>MIN</span></h2>
                    </div>
                </div>
            </div>

            <div style={{ borderLeft: '4px solid var(--z-gradient)', paddingLeft: '15px', marginBottom: '25px' }}>
                <h2 style={{ fontSize: '1.6rem', fontStyle: 'italic', margin: 0 }}>RECENT HISTORY</h2>
            </div>
            
            <div className="activity-list">
                {activities.length > 0 ? (
                    activities.map((act) => (
                        <div key={act.id} className={`activity-card glass ${expandedId === act.id ? 'expanded' : ''}`}>
                            {/* Header - Clickable */}
                            <div 
                                onClick={() => toggleExpand(act.id)}
                                className="activity-header"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                                    <div className="activity-icon-box">
                                        <Bike color="white" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="activity-title">
                                            {act.name || 'UNNAMED RIDE'}
                                        </h3>
                                        <div className="activity-date-box">
                                            <Calendar size={14} />
                                            <span>{new Date(act.activity_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="activity-main-stats">
                                    <div className="mini-stat">
                                        <span className="val">{(act.distance || 0)}</span>
                                        <span className="unit">KM</span>
                                    </div>
                                    {expandedId === act.id ? <ChevronUp size={24} color="var(--z-blue)" /> : <ChevronDown size={24} color="var(--text-secondary)" />}
                                </div>
                            </div>

                            {/* Expandable Content */}
                            {expandedId === act.id && (
                                <div className="activity-detail-content">
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <div className="d-icon" style={{ color: 'var(--z-blue)' }}><MapIcon size={20} /></div>
                                            <div className="d-text">
                                                <p className="d-label">DISTANCE</p>
                                                <p className="d-value">{(act.distance || 0)} KM</p>
                                            </div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="d-icon" style={{ color: 'var(--z-purple)' }}><Clock size={20} /></div>
                                            <div className="d-text">
                                                <p className="d-label">DURATION</p>
                                                <p className="d-value">{Math.floor(act.duration || 0)} MIN</p>
                                            </div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="d-icon" style={{ color: 'var(--z-orange)' }}><Flame size={20} /></div>
                                            <div className="d-text">
                                                <p className="d-label">CALORIES</p>
                                                <p className="d-value">{act.calories || 0} KCAL</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {act.notes && act.notes.trim() !== "" && (
                                        <div className="activity-notes">
                                            <p className="notes-label">
                                                <StickyNote size={16} /> RIDER NOTES
                                            </p>
                                            <p className="notes-text">
                                                {act.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="card-duo glass" style={{ textAlign: 'center', padding: '60px' }}>
                        <p style={{ color: 'var(--text-secondary)', fontWeight: 800, fontSize: '1rem', letterSpacing: '1px' }}>NO RECENT ACTIVITIES RECORDED.</p>
                        <button className="btn-duo btn-primary" style={{ marginTop: '20px' }} onClick={() => window.location.href='/map'}>START A RIDE</button>
                    </div>
                )}
            </div>

            <style jsx>{`
                .stats-card {
                    padding: 25px;
                    border-bottom: 3px solid transparent;
                    transition: 0.3s;
                }
                .stats-card:hover {
                    border-bottom-color: var(--z-blue);
                    transform: translateY(-5px);
                }
                .stats-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 10px;
                }
                .stats-header span {
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 800;
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    letter-spacing: 1px;
                }
                .stats-card h2 {
                    font-size: 2.8rem;
                    margin: 0;
                    color: var(--z-white);
                }

                .activity-card {
                    margin-bottom: 20px;
                    border-radius: 20px;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .activity-header {
                    padding: 20px 25px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .activity-header:hover {
                    background: rgba(255,255,255,0.03);
                }
                .activity-icon-box {
                    background: var(--z-gradient);
                    padding: 12px;
                    border-radius: 15px;
                    box-shadow: 0 4px 15px rgba(0, 168, 232, 0.3);
                }
                .activity-title {
                    margin: 0;
                    font-size: 1.3rem;
                    font-style: italic;
                    color: var(--z-white);
                }
                .activity-date-box {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: var(--text-secondary);
                    font-weight: 700;
                    font-size: 0.85rem;
                    margin-top: 4px;
                }
                .activity-main-stats {
                    display: flex;
                    align-items: center;
                    gap: 25px;
                }
                .mini-stat {
                    display: flex;
                    align-items: baseline;
                    gap: 4px;
                }
                .mini-stat .val {
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 900;
                    font-style: italic;
                    font-size: 1.8rem;
                    color: var(--z-white);
                }
                .mini-stat .unit {
                    font-weight: 800;
                    font-size: 0.8rem;
                    color: var(--z-blue);
                }

                .activity-detail-content {
                    padding: 25px;
                    background: rgba(15, 23, 42, 0.3);
                    border-top: 1px solid rgba(255,255,255,0.05);
                }
                .detail-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 25px;
                }
                .detail-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .d-icon {
                    background: rgba(255,255,255,0.05);
                    padding: 10px;
                    border-radius: 12px;
                }
                .d-label {
                    margin: 0;
                    font-family: 'Montserrat', sans-serif;
                    font-size: 0.7rem;
                    font-weight: 800;
                    color: var(--text-secondary);
                    letter-spacing: 1px;
                }
                .d-value {
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: var(--z-white);
                }
                .activity-notes {
                    margin-top: 25px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255,255,255,0.05);
                }
                .notes-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 800;
                    color: var(--z-blue);
                    font-size: 0.8rem;
                    margin-bottom: 10px;
                }
                .notes-text {
                    color: rgba(236, 232, 225, 0.8);
                    line-height: 1.6;
                    font-weight: 500;
                    margin: 0;
                }

                @media (max-width: 600px) {
                    .activity-main-stats .mini-stat { display: none; }
                }

                /* Stats Horizontal Scroll */
                .stats-scroll-container {
                    width: 100%;
                    overflow-x: auto;
                    padding-bottom: 15px;
                    margin-bottom: 35px;
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none;  /* IE and Edge */
                }
                .stats-scroll-container::-webkit-scrollbar {
                    display: none; /* Chrome, Safari, Opera */
                }
                .stats-row {
                    display: flex;
                    gap: 20px;
                    flex-wrap: nowrap;
                    min-width: min-content;
                }
                .stats-card {
                    flex: 0 0 280px;
                    margin-bottom: 0 !important;
                }

                @media (max-width: 600px) {
                    .stats-card {
                        flex: 0 0 240px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ActivityPage;
