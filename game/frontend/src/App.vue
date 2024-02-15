<template>
    <div v-if="game" class="game-card">
      <h2>Game Details</h2>
      <ul>
        <li><strong>Game ID:</strong> {{ game.gameId }}</li>
        <li><strong>Status:</strong> {{ game.gameStatus }}</li>
        <li><strong>Max Players:</strong> {{ game.maxPlayers }}</li>
        <li><strong>Max Rounds:</strong> {{ game.maxRounds }}</li>
        <li><strong>Current Round:</strong> {{ game.currentRoundNumber || 'N/A' }}</li>
        <li><strong>Round Length (ms):</strong> {{ game.roundLengthInMillis }}</li>
        <li>
          <strong>Participating Players:</strong>
          <ul>
            <li v-for="player in game.participatingPlayers" :key="player">{{ player }}</li>
          </ul>
        </li>
      </ul>
    </div>
    <div v-else-if="!isLoading" class="loading">No game details available.</div>
  <div v-else class="loading">Loading game details...</div>
  </template>
  
  <script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'GameCard',
  setup() {
    const game = ref(null);
    const isLoading = ref(true); 
    let socket;

    const requestGameData = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send('REQUEST_GAME_DATA');
      }
    };

    onMounted(() => {
      socket = new WebSocket('ws://localhost:4000');

      socket.onopen = () => {
        console.log('WebSocket connection established');
        requestGameData();
      };

      socket.onmessage = (event) => {
        isLoading.value = false; 
        const data = JSON.parse(event.data);
        if (Array.isArray(data) && data.length > 0) {
          game.value = data[0];
        } else {
          game.value = null;
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        isLoading.value = false;
      };
    });

    onUnmounted(() => {
      if (socket) {
        socket.close();
      }
    });

    return {
      game,
      isLoading, 
      requestGameData,
    };
  },
};

</script>

  
  <style scoped>
  .game-card {
    border: 2px solid #007bff;
    border-radius: 10px;
    padding: 20px;
    margin: 20px auto;
    max-width: 600px;
    background-color: #f9f9f9;
  }
  
  .game-card h2 {
    color: #007bff;
  }
  
  .game-card ul {
    list-style-type: none;
    padding: 0;
  }
  
  .game-card li {
    margin-bottom: 10px;
  }
  
  .loading {
    text-align: center;
    margin-top: 20px;
  }
  </style>
  