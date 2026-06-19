import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
    Navigation, MapPin, Play, Square, Settings2, Search, X, 
    StickyNote, Type, Wrench, Coffee, Droplets, AlertTriangle, Zap, Phone
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { saveTracking } from '../services/bikepathService';

// Fix for Leaflet default icon issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Logo-Only High Contrast Markers
const createLogoMarker = (color, type) => {
    let iconPath = '';
    // SVG Paths for high-res icons
    if (type === 'workshop') iconPath = '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>';
    if (type === 'rest') iconPath = '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>';
    if (type === 'toilet') iconPath = '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>';

    return new L.DivIcon({
        html: `
            <div class="logo-marker-container ${type === 'workshop' ? 'sos-luminous-icon' : ''}">
                <svg viewBox="0 0 24 24" class="marker-svg-logo" style="fill: ${color}; filter: drop-shadow(0 0 2px white) drop-shadow(0 0 2px white) drop-shadow(0 0 2px white);">
                    <g stroke="white" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
                        ${iconPath}
                    </g>
                    <g fill="${color}">
                        ${iconPath}
                    </g>
                </svg>
            </div>`,
        className: 'custom-logo-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
    });
};

const icons = {
    workshop: createLogoMarker('#ff0000', 'workshop'), 
    rest: createLogoMarker('#fc6719', 'rest'),         
    toilet: createLogoMarker('#00a8e8', 'toilet'),     
    default: createLogoMarker('#58cc02', 'default')
};

const MapPage = () => {
    // Activity Tracking State
    const [tracking, setTracking] = useState(false);
    const [path, setPath] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showRoutePlanner, setShowRoutePlanner] = useState(false);
    
    // Facility State
    const [activeFilters, setActiveFilters] = useState([]);
    const [facilities] = useState([
        { id: 1, type: 'workshop', name: 'BENGKEL SOS: MAJU JAYA', lat: -6.1950, lng: 106.8200, info: 'Layanan Darurat 24 Jam - Siaga Penuh', phone: '0812-3456-789' },
        { id: 2, type: 'workshop', name: 'RODALINK SOS STATION', lat: -6.2100, lng: 106.8100, info: 'Perbaikan Cepat & Suku Cadang Darurat', phone: '0811-999-888' },
        { id: 3, type: 'rest', name: 'RIDER REST ZONE', lat: -6.2150, lng: 106.8000, info: 'Area Rehat Berenergi', phone: '-' },
        { id: 4, type: 'toilet', name: 'CLEAN ZONE TOILET', lat: -6.2000, lng: 106.8220, info: 'Fasilitas Higienis', phone: '-' },
        { id: 5, type: 'workshop', name: 'EMERGENCY REPAIR UNIT', lat: -6.2050, lng: 106.8150, info: 'Pompa & Tools Stand', phone: '0812-111-222' },
    ]);

    // Activity Details for Saving
    const [activityDetails, setActivityDetails] = useState({
        title: '',
        notes: '',
        type: 'road'
    });

    useEffect(() => {
        let interval;
        if (tracking) {
            interval = setInterval(() => {
                const newPos = [
                    -6.200000 + (path.length * 0.0001),
                    106.816666 + (path.length * 0.0001)
                ];
                setPath(prev => [...prev, newPos]);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [tracking, path.length]);

    const toggleFilter = (filter) => {
        if (activeFilters.includes(filter)) {
            setActiveFilters(activeFilters.filter(f => f !== filter));
        } else {
            setActiveFilters([...activeFilters, filter]);
        }
    };

    const handleStartTracking = () => {
        setTracking(true);
        setPath([]);
        setStartTime(Date.now());
        setActivityDetails({
            title: getDefaultTitle(),
            notes: '',
            type: 'road'
        });
    };

    const getDefaultTitle = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) return 'Epic Morning Ride';
        if (hour >= 11 && hour < 15) return 'Power Lunch Ride';
        if (hour >= 15 && hour < 19) return 'Afternoon Dash';
        return 'Night Pursuit';
    };

    const handleStopTracking = () => {
        setTracking(false);
        setShowSaveModal(true);
    };

    const handleFinalSave = async () => {
        if (path.length === 0) {
            setShowSaveModal(false);
            return;
        }
        
        const duration = startTime ? Math.floor((Date.now() - startTime) / 60000) : 0;
        try {
            await saveTracking({
                name: activityDetails.title,
                coordinates: path,
                distance: (path.length * 0.01).toFixed(2),
                duration: duration,
                description: activityDetails.type,
                notes: activityDetails.notes
            });
            alert('RIDE SAVED TO YOUR HUB!');
            setShowSaveModal(false);
            setPath([]);
            setActiveFilters([]);
        } catch (err) {
            console.error("Save failed", err);
            alert("Connection issue. Please try again.");
        }
    };

    const visibleFacilities = activeFilters.length > 0
        ? facilities.filter(f => activeFilters.includes(f.type))
        : [];

    return (
        <div className="map-page-wrapper main-content">
            {/* Save Activity - IN-MAP OVERLAY */}
            {showSaveModal && (
                <div className="save-ride-overlay animate-slide-in">
                    <div className="card-duo glass save-ride-card">
                        <div className="save-header">
                            <div className="zap-icon"><Zap size={22} color="#fff" fill="#fff" /></div>
                            <h2 className="save-title">RIDE COMPLETE!</h2>
                        </div>
                        
                        <div className="save-form">
                            <div className="input-group-float">
                                <label><Type size={14} /> TITLE YOUR ADVENTURE</label>
                                <input 
                                    className="input-duo-mini"
                                    value={activityDetails.title}
                                    onChange={(e) => setActivityDetails({...activityDetails, title: e.target.value})}
                                />
                            </div>
                            <div className="input-group-float">
                                <label><StickyNote size={14} /> RIDER NOTES</label>
                                <textarea 
                                    className="input-duo-mini"
                                    style={{ height: '70px', resize: 'none' }}
                                    value={activityDetails.notes}
                                    onChange={(e) => setActivityDetails({...activityDetails, notes: e.target.value})}
                                    placeholder="Tell the community about your ride..."
                                />
                            </div>
                            <div className="save-actions">
                                <button className="btn-duo btn-outline" onClick={() => { setShowSaveModal(false); setPath([]); }}>DISCARD</button>
                                <button className="btn-duo btn-primary" onClick={handleFinalSave}>SAVE RIDE</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Map Area */}
            <div className="map-area">
                <MapContainer center={[-6.200000, 106.816666]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Polyline positions={path} color="var(--z-blue)" weight={6} opacity={0.8} />
                    
                    {visibleFacilities.map(f => (
                        <Marker key={f.id} position={[f.lat, f.lng]} icon={icons[f.type] || icons.default}>
                            <Popup>
                                <div className="poi-popup sos-popup">
                                    <div className="popup-sos-header" style={{ background: f.type === 'workshop' ? '#ff0000' : 'var(--z-gradient)' }}>
                                        {f.type === 'workshop' ? 'DARURAT BENGKEL' : f.type.toUpperCase()}
                                    </div>
                                    <div className="popup-body">
                                        <strong>{f.name}</strong>
                                        <p>{f.info}</p>
                                        {f.phone !== '-' && (
                                            <div className="phone-row">
                                                <Phone size={14} color="#ff0000" />
                                                <span>{f.phone}</span>
                                            </div>
                                        )}
                                        <button className="btn-poi-nav">NAVIGATE NOW</button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Route Planner Overlay - LUMINOUS GLASS */}
                {showRoutePlanner && !tracking && (
                    <div className="route-planner-overlay glass-luminous animate-slide-in">
                        <div className="planner-header">
                            <h3 style={{ letterSpacing: '1px' }}>ROUTE PLANNER</h3>
                            <button onClick={() => setShowRoutePlanner(false)} className="close-planner"><X size={20}/></button>
                        </div>
                        <div className="planner-body">
                            <div className="input-group-float">
                                <label><MapPin size={12} /> STARTING FROM</label>
                                <input className="input-duo-mini luminous" readOnly placeholder="Current Location" />
                            </div>
                            <div className="input-group-float">
                                <label><Navigation size={12} /> DESTINATION</label>
                                <input className="input-duo-mini luminous" placeholder="Search for destination..." />
                            </div>
                            <div className="input-group-float">
                                <label><Settings2 size={12} /> SURFACE PREFERENCE</label>
                                <select className="input-duo-mini luminous" value={activityDetails.type} onChange={(e) => setActivityDetails({...activityDetails, type: e.target.value})}>
                                    <option value="road">TARMAC / ROAD</option>
                                    <option value="mountain">GRAVEL / MTB</option>
                                    <option value="city">URBAN PATH</option>
                                </select>
                            </div>
                            <button className="btn-duo btn-primary full-width" style={{ marginTop: '10px' }} onClick={() => setShowRoutePlanner(false)}>
                                GENERATE OPTIMAL ROUTE
                            </button>
                        </div>
                    </div>
                )}

                {/* Floating Controls */}
                <div className="tracking-controls">
                    {tracking && (
                        <div className="stats-bubble-modern glass animate-slide-in">
                            <span className="km-val">{(path.length * 0.01).toFixed(2)}</span>
                            <span className="km-unit">KM</span>
                        </div>
                    )}

                    {/* IN-RIDE TOOLS: ONLY SHOW DURING TRACKING */}
                    {tracking && (
                        <div className="in-ride-tools-floating animate-slide-in">
                            <button 
                                className={`tool-btn-float sos ${activeFilters.includes('workshop') ? 'active' : ''}`} 
                                onClick={() => toggleFilter('workshop')}
                                title="DARURAT BENGKEL"
                            >
                                <AlertTriangle size={24} />
                            </button>
                            <button 
                                className={`tool-btn-float rest ${activeFilters.includes('rest') ? 'active' : ''}`} 
                                onClick={() => toggleFilter('rest')}
                                title="TEMPAT REHAT"
                            >
                                <Coffee size={24} />
                            </button>
                            <button 
                                className={`tool-btn-float toilet ${activeFilters.includes('toilet') ? 'active' : ''}`} 
                                onClick={() => toggleFilter('toilet')}
                                title="TOILET UMUM"
                            >
                                <Droplets size={24} />
                            </button>
                        </div>
                    )}
                    
                    {!tracking && (
                        <button onClick={() => setShowRoutePlanner(!showRoutePlanner)} className={`btn-track secondary ${showRoutePlanner ? 'active' : ''}`}><Navigation size={24} /></button>
                    )}
                    <button onClick={tracking ? handleStopTracking : handleStartTracking} className={`btn-track ${tracking ? 'stop' : 'start'}`}>
                        {tracking ? <Square size={28} fill="white" /> : <Play size={28} fill="white" />}
                    </button>
                </div>
            </div>

            <style jsx>{`
                .map-page-wrapper { display: flex; height: 75vh; border-radius: 30px; position: relative; overflow: hidden; background: #0b0f19; }
                .map-area { flex-grow: 1; position: relative; width: 100%; height: 100%; border-radius: 30px; overflow: hidden; }
                
                /* Luminous Route Planner */
                .glass-luminous {
                    background: rgba(15, 23, 42, 0.9) !important;
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 2px solid var(--z-blue) !important;
                    box-shadow: 0 0 30px rgba(0, 168, 232, 0.3);
                }
                .input-duo-mini.luminous {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    transition: 0.3s;
                }
                .input-duo-mini.luminous:focus {
                    border-color: var(--z-blue);
                    background: rgba(255,255,255,0.1);
                    box-shadow: 0 0 15px rgba(0, 168, 232, 0.2);
                }

                /* Balanced SOS & Tool Pill */
                .balanced-tool-pill {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    padding: 4px;
                    background: rgba(15, 23, 42, 0.95);
                    border-radius: 50px;
                    border: 2px solid rgba(255,255,255,0.1);
                    min-width: 300px;
                    gap: 4px;
                }
                .tool-segment {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 10px;
                    border: none;
                    background: transparent;
                    color: var(--text-secondary);
                    font-weight: 800;
                    font-size: 0.7rem;
                    cursor: pointer;
                    border-radius: 50px;
                    transition: 0.2s;
                    font-family: 'Montserrat';
                }
                .tool-segment span { letter-spacing: 1px; }
                .tool-segment.sos { color: #ff4b4b; }
                .tool-segment.sos.active { background: #ff0000; color: #fff; box-shadow: 0 0 20px rgba(255,0,0,0.4); }
                .tool-segment.rest.active { background: var(--z-orange); color: #fff; box-shadow: 0 0 20px rgba(252, 103, 25, 0.4); }
                .tool-segment.toilet.active { background: var(--z-blue); color: #fff; box-shadow: 0 0 20px rgba(0, 168, 232, 0.4); }
                .tool-segment:hover:not(.active) { background: rgba(255,255,255,0.05); color: #fff; }

                /* Super High Contrast Markers */
                :global(.custom-luminous-marker) { display: flex; flex-direction: column; align-items: center; justify-content: center; }
                :global(.super-marker) { position: relative; display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5)); }
                :global(.marker-shield) { 
                    width: 44px; height: 44px; border-radius: 12px; 
                    border: 3px solid #fff; display: flex; align-items: center; justify-content: center;
                    box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
                    transform: rotate(45deg);
                }
                :global(.marker-shield svg) { transform: rotate(-45deg); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
                :global(.marker-pin) { 
                    width: 0; height: 0; 
                    border-left: 8px solid transparent; border-right: 8px solid transparent;
                    border-top: 10px solid #fff; margin-top: -6px; z-index: -1;
                }
                :global(.sos-glow) { animation: sosLuminous 1.5s infinite; }
                @keyframes sosLuminous {
                    0% { filter: drop-shadow(0 0 5px #ff0000); transform: scale(1); }
                    50% { filter: drop-shadow(0 0 25px #ff0000); transform: scale(1.1); }
                    100% { filter: drop-shadow(0 0 5px #ff0000); transform: scale(1); }
                }

                /* Save Ride Overlay */
                .save-ride-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 2000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
                .save-ride-card { width: 90%; max-width: 450px; background: rgba(15, 23, 42, 0.98) !important; border: 2px solid var(--z-blue) !important; padding: 35px !important; }
                .save-header { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; }
                .zap-icon { background: var(--z-gradient); padding: 10px; border-radius: 12px; }
                .save-title { margin: 0; font-style: italic; color: #fff; }
                .save-actions { display: flex; gap: 15px; margin-top: 25px; }

                /* Floating Components */
                .route-planner-overlay { position: absolute; top: 25px; left: 25px; width: 320px; z-index: 1001; padding: 25px; border-radius: 24px; }
                .planner-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .input-group-float { margin-bottom: 15px; }
                .input-group-float label { display: block; font-size: 0.65rem; font-weight: 800; color: var(--z-blue); margin-bottom: 5px; }
                .input-duo-mini { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; }
                
                .tracking-controls { position: absolute; bottom: 30px; right: 30px; z-index: 1000; display: flex; flex-direction: column; align-items: flex-end; gap: 15px; }
                .btn-track { width: 70px; height: 70px; border-radius: 50%; border: none; display: flex; align-items: center; justify-content: center; color: #fff; cursor: pointer; box-shadow: 0 8px 25px rgba(0,0,0,0.3); }
                .btn-track.start { background: var(--z-gradient); }
                .btn-track.stop { background: var(--z-orange); }
                .btn-track.secondary { width: 60px; height: 60px; background: var(--z-navy); border: 1px solid var(--z-blue); color: var(--z-blue); }
                
                /* In-Ride Tools Floating */
                .in-ride-tools-floating {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 5px;
                }
                .tool-btn-float {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    cursor: pointer;
                    background: rgba(15, 23, 42, 0.9);
                    border: 2px solid rgba(255,255,255,0.1);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    transition: 0.2s;
                }
                .tool-btn-float.sos { border-color: rgba(255,0,0,0.5); color: #ff4b4b; }
                .tool-btn-float.sos.active { background: #ff0000; color: #fff; border-color: #fff; box-shadow: 0 0 20px rgba(255,0,0,0.4); }
                .tool-btn-float.rest.active { background: var(--z-orange); color: #fff; border-color: #fff; }
                .tool-btn-float.toilet.active { background: var(--z-blue); color: #fff; border-color: #fff; }
                .tool-btn-float:hover { transform: scale(1.1); }

                .stats-bubble-modern { padding: 12px 25px; border-radius: 15px; background: rgba(15, 23, 42, 0.9); border: 2px solid var(--z-blue); display: flex; align-items: baseline; gap: 5px; }
                .km-val { font-family: 'Montserrat'; font-weight: 900; font-size: 1.8rem; color: #fff; }
                .km-unit { font-weight: 800; color: var(--z-blue); font-size: 0.8rem; }

                /* Popup Styles */
                .sos-popup { min-width: 200px; padding: 0 !important; overflow: hidden; border-radius: 12px; }
                .popup-sos-header { color: #fff; font-weight: 900; padding: 10px; text-align: center; font-size: 0.8rem; }
                .popup-body { padding: 15px; }
                .phone-row { display: flex; align-items: center; gap: 8px; margin: 10px 0; font-weight: 800; color: #ff0000; }
                .btn-poi-nav { width: 100%; padding: 8px; background: var(--z-gradient); border: none; color: #fff; border-radius: 8px; font-weight: 900; cursor: pointer; }

                @media (max-width: 600px) {
                    .route-planner-overlay { left: 15px; right: 15px; width: auto; }
                    .sos-btn span { display: none; }
                }
            `}</style>
        </div>
    );
};

export default MapPage;
