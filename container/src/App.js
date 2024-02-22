import React from 'react';
import Header from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GameCard from './components/GameCard';
import Controlpanel from './components/Controlpanel';
import Scoreboard from './components/Scoreboard';
import Map from './components/Map';
import Robot from './components/Robot';

export default () => {
    return (
        <BrowserRouter>
            <div>
                <Header />
                <Routes>
                    <Route path="/map" element={
                        <>
                            <Scoreboard />
                            <Map />
                            <Robot />
                        </>} />
                    <Route path="/" element={
                        <>
                            <GameCard />
                            <Controlpanel />

                        </>
                    } />
                </Routes>
            </div>
        </BrowserRouter>
    );
};
