import React from 'react';
import Header from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import GameCard from './components/GameCard';
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
                        <div className="container mt-4">
                            <div className="row">
                                <div className="col-12">
                                    <Scoreboard />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <Map />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <Robot />
                                </div>
                            </div>
                        </div>} />
                    <Route path="/" element={
                        <div className="container mt-4">
                            <div className="row">
                                <div className="col-12">
                                    <GameCard />
                                </div>
                            </div>
                        </div>
                    } />
                </Routes>
            </div>
        </BrowserRouter>
    );
};
