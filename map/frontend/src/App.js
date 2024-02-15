import React, { useState, useEffect } from 'react';
import PlanetsGrid from './components/PlanetsGrid';

function App() {
    const [planets, setPlanets] = useState([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4002'); 

        ws.onopen = () => {
            console.log('Map WebSocket Connected');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const allPlanets = data.flatMap(row => row.filter(cell => cell !== null));
            setPlanets(allPlanets);
        };

        ws.onerror = (error) => {
            console.log('WebSocket Error:', error);
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <div className="App">
            <PlanetsGrid planets={planets} />
        </div>
    );
}

export default App;
