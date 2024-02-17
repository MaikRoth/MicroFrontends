import React, { Suspense, lazy } from 'react';
import Header from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const ControlPanel = lazy(() => import('./components/Controlpanel'));
const GameCard = lazy(() => import('./components/GameCard'));
const Map = lazy(() => import('./components/Map'));
const Scoreboard = lazy(() => import('./components/Scoreboard'));

export default () => {
    return (
        <BrowserRouter>
            <div>
                <Header />
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/scoreboard" element={<Scoreboard />} />
                        <Route path="/map" element={<Map />} />
                        <Route path="/" element={
                            <>
                                <GameCard />
                                <ControlPanel />
                            </>
                        } />
                    </Routes>
                </Suspense>
            </div>
        </BrowserRouter>
    );
};
