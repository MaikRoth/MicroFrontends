import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
    const navigate = useNavigate();
    const centerStyles = {
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{fontSize: 'xx-large'}}>
            <div className="container-fluid" style={{justifyContent: 'center'}}>
                <div style={centerStyles} className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <span className="nav-link" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>Controlpanel</span>
                        </li>
                        <li className="nav-item">
                            <span className="nav-link" onClick={() => navigate('/map')} style={{cursor: 'pointer'}}>Map</span>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;
