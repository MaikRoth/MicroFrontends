import React from 'react';
import Controlpanel from './components/Controlpanel';
import GameCard from './components/GameCard';
import Map from './components/Map';
export default () => {
    return (
        <div>
            <h1>Container</h1>
            <hr />
            <GameCard />
            <Controlpanel />
            <Map />
        </div>
    );
}