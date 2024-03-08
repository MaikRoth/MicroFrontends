<template>
    <div id="app">
        <PlanetsGrid :planets="planets" />
    </div>
</template>
  
<script>
import { ref, onMounted, watch } from 'vue';
import PlanetsGrid from './components/PlanetsGrid.vue';

export default {
    name: 'App',
    components: {
        PlanetsGrid
    },
    setup() {
        const planets = ref([]);

        onMounted(() => {
            const ws = new WebSocket('ws://localhost:4002');

            ws.onopen = () => console.log('Map WebSocket Connected');

            ws.onmessage = event => {
                const data = JSON.parse(event.data);
                const allPlanets = Object.values(data);
                planets.value = allPlanets;
            };

            ws.onerror = error => console.log('WebSocket Error:', error);
            window.addEventListener('robotMapUpdate', (event) => {
                const robotMap = event.detail;
                const planetMap = new Map(planets.value.map(planet => [planet.id, planet]));
                robotMap.mapData.forEach(robot => {
                    const planet = planetMap.get(robot.planet);
                    if (planet) {
                        const existingRobotIndex = planet.robots.findIndex(r => r.id === robot.id);
                        if (existingRobotIndex === -1) {
                            planet.robots.push(robot);
                        } else {
                            Object.assign(planet.robots[existingRobotIndex], robot);
                        }
                    }
                });

            });

            return () => {
                ws.close();
                window.removeEventListener('robotMapUpdate');
            };
        });

        return { planets };
    }
};

</script>