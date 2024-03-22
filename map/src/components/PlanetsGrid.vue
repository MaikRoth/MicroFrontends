<template>
  <div>
    <div class="counts">
      <span>Planets: {{ planetCount }}</span>
      <span>Black Holes: {{ emptyCount }}</span>
    </div>

    <div class="grid">
      <div v-for="(row, y) in grid" :key="y" class="row">
        <div v-for="(cell, x) in row" :key="x" :class="`cell ${cell ? 'planet' : 'empty'}`">
          <div v-if="cell && cell.resource">
            <div class="resource-type">[{{ cell.resource.type || '' }}]</div>
            <div class="resource-amount">{{ formatResourceAmount(cell.resource.currentAmount) }}</div>
          </div>
          <div v-if="cell && cell.robots && cell.robots.length > 0" class="robots">
            <span v-if="cell.robots.length > 4" key="robots-count" class="robot-count" :style="{background: getGradient(cell.robots)}">{{ cell.robots.length }}</span>            
          <img v-else v-for="robot in cell.robots" :key="`${robot.id}`" :src="`${robot.image}`" alt="robot" class="robot-image" :style="{ borderColor: robot.color }" />

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlanetsGrid',
  props: ['planets'],
  computed: {
    gridSize() {
      let maxSize = 0;
      if (this.planets && this.planets.length > 0) {
        const maxCoordinates = this.planets.reduce((acc, planet) => {
          return {
            x: Math.max(acc.x, planet.x),
            y: Math.max(acc.y, planet.y),
          };
        }, { x: 0, y: 0 });
        maxSize = Math.max(maxCoordinates.x, maxCoordinates.y) + 1;
      }
      return maxSize;
    },
    grid() {
      const grid = Array.from({ length: this.gridSize }, () => Array(this.gridSize).fill(null));
      this.planets.forEach(planet => {
        if (grid[planet.y] && grid[planet.y][planet.x] === null) {
          grid[planet.y][planet.x] = planet;
        }
      });
      return grid;
    },
    planetCount() {
      return this.planets.length;
    },
    emptyCount() {
      let count = 0;
      this.grid.forEach(row => {
        row.forEach(cell => {
          if (!cell) count += 1;
        });
      });
      return count;
    }
  },
  methods: {
    formatResourceAmount(amount) {
      if (amount >= 1000) {
        const thousands = Math.floor(amount / 1000);
        const hundred = Math.floor((amount % 1000) / 100);
        return `${thousands}.${hundred}k`;
      }
      return amount.toString();
    },
    getGradient(robots) {
      const colors = robots.map(robot => robot.color).join(', ');
      return `linear-gradient(to right, ${colors})`;
    },
  }
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(85px,0 ));
  gap: 0px;
}
.robot-count {
  display: inline-block;
  padding: 5px 10px;
  color: black;
  border-radius: 5px;
  margin-top: -20px;
  margin-left: -20px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
}
.robot-image {
  width: 25px;
  height: 25px;
  border: 3px solid; 
  display: block;
  border-radius: 50%;
}

.robots {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.cell {
  position: relative;
  height: 100px;
  border: black 1px solid;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  font-size: larger;
  color: #333;
}

.counts {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  font-size: larger;
}

.resource-amount {
  position: absolute;
  top: 73%;
  left: 20%;
  padding: 2px;
  color: #333;
}

.resource-type {
  position: absolute;
  top: 56%;
  left: 17%;
  padding: 2px;
  font-size: large;
  color: #333;
}

.cell.empty {
  background-color: #333;
}

.cell.planet {
  background: #ffffff;
  color: rgb(0, 0, 0);
}
</style>
