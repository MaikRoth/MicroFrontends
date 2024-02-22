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
                planets.value.forEach(planet => {
                    planet.robots = [];
                });
                const robotMap = event.detail;
                robotMap.mapData.forEach(robot => {
                    planets.value.forEach(planet => {
                        if (robot.planet === planet.id) {
                            if (!planet.robots.includes(robot.id)) {
                                planet.robots.push(robot);
                            }
                        }
                    });
                    
                });
            });
            watch(planets, (newPlanets) => {
                localStorage.setItem('planetsData', JSON.stringify(newPlanets));
            }, { deep: true });

            const storedPlanets = localStorage.getItem('planetsData');
            if (storedPlanets) {
                planets.value = JSON.parse(storedPlanets);
            }

            return () => {
                ws.close();
                window.removeEventListener('robotMapUpdate');
            };
        });

        return { planets };
    }
};

</script>