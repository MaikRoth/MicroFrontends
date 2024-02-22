import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
    const navigate = useNavigate();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" onClick={() =>navigate('/')}>Control Panel</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => navigate('/map')}>Map</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;
