<template>
  <div class="guessing-game">
    <h1>Guessing Game</h1>
    <p>Guess the secret number</p>
    <el-input v-model="guess" placeholder="Enter your guess"></el-input>
    <el-button :disabled="submitDisabled" type="primary" @click="submitGuess">Submit</el-button>
  </div>
</template>

<script>
import Web3Service from '@/lib/web3service.js';
import {useWalletStore} from "@/stores/walletStore";



export default {
  name: "MainPage",
  data() {
    return {
      guess: 0,
      submitDisabled: false,
    };
  },

  methods: {
    async submitGuess() {
      this.submitDisabled = true;
      try {
        const walletStore = useWalletStore();
        const web3Service = new Web3Service(walletStore.signer)
        await web3Service.submitGuess(this.guess)

      } catch (err) {
        console.error("Error:", err.message);
      }
      this.submitDisabled = false;
    }
  }
}
</script>
<style scoped>

.guessing-game {
  background-color: #1C1C1C; /* Slightly lighter dark background for the box */
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 255, 0, 0.3); /* Matrix green shadow */
}

h1, p {
  color: #00FF00; /* Matrix green text */
}

.el-input, .el-button {
  margin-top: 15px;
  width: 100%;
}

.el-input__inner {
  background-color: #2E2E2E; /* Dark input background */
  color: #00FF00; /* Matrix green text */
  border-color: #00FF00; /* Matrix green border */
}

.el-button {
  background-color: #00FF00; /* Matrix green background */
  color: #0F0F0F; /* Dark text */
}

.el-button:hover {
  background-color: #33FF33; /* Slightly lighter green for hover effect */
}
</style>
