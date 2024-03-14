<template>
    <div id="app">
        <PlanetsGrid :planets="planets" />
    </div>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import PlanetsGrid from './components/PlanetsGrid.vue';

export default {
    name: 'App',
    components: {
        PlanetsGrid
    },
    setup() {
        const planets = ref([]);
        const event = new CustomEvent('mapUpdated', {});
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:4002/map');
                if (response.ok) {
                    const data = await response.json();
                    const allPlanets = data[0].planetsMap;
                    planets.value = Object.values(allPlanets);
                    window.dispatchEvent(event);
                    console.log('Received Map Data:', allPlanets);
                } else {
                    console.error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        onMounted(() => {
            fetchData();
            const intervalId = setInterval(fetchData, 10000);
            
            window.addEventListener('robotMapUpdate', (event) => {
                const robotMap = event.detail;
                robotMap.mapData.forEach(robot => {
                    const planet = planets.value.find(p => p.id === robot.planet);
                    if (planet) {
                        const existingRobotIndex = planet.robots.findIndex(r => r.id === robot.id);
                        if (existingRobotIndex === -1) {
                            planet.robots.push(robot);
                            console.log(planet.robots);
                        } else {
                            Object.assign(planet.robots[existingRobotIndex], robot);
                        }
                    }
                });

            });
            return () => {
                window.removeEventListener('robotMapUpdate');
                clearInterval(intervalId);
            };
        });

        return { planets };
    }
};

</script>