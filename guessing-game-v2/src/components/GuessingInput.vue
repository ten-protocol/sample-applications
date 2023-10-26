<template>
  <div class="guessing-game">
    <h1>Guessing Game</h1>
    <p>Guess the secret number</p>
    <p>Take the pool money</p>
    <el-input v-model="guess" placeholder="Enter your guess"></el-input>
    <el-button :disabled="submitDisabled" type="primary" @click="submitGuess">Submit</el-button>
  </div>
</template>

<script>
import Web3Service from '@/lib/web3service.js';
import {useWalletStore} from "@/stores/walletStore";
import {useMessageStore} from "@/stores/messageStore";



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
        const messageStore = useMessageStore()

        if (!walletStore.signer) {
          messageStore.addMessage('Not connected with Metamask...');
          this.submitDisabled = false;
          return;
        }
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
  font-family: 'Orbitron', sans-serif;
  background-color: #1C1C1C;
  padding: 40px;
  border-radius: 8px;
  text-align: center;
  width: 400px; /* Increased the width */
  box-shadow: 0 4px 8px rgba(0, 255, 0, 0.3);
  margin: 0 auto; /* Center the component */
}

h1, p {
  color: #00FF00;
  margin: 0;
}

.el-input, .el-button {
  margin-top: 25px;
  width: 100%;
}

.el-input__inner {
  background-color: #2E2E2E;
  color: #00FF00;
  border-color: #00FF00;
  font-size: 24px; /* Larger font size */
  padding: 10px 15px; /* Larger padding */
}

.el-input__inner:focus {
  box-shadow: 0 0 15px #00FF00; /* Glow effect when input is focused */
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 15px #00FF00;
  }
  50% {
    box-shadow: 0 0 20px #33FF33, 0 0 30px #33FF33;
  }
  100% {
    box-shadow: 0 0 15px #00FF00;
  }
}

.el-button {
  background-color: #00FF00;
  color: #0F0F0F;
  border: none;
  font-size: 18px; /* Larger font size */
  transition: transform 0.3s, background-color 0.3s; /* Transition effect for hover */
}

.el-button:hover {
  background-color: #33FF33;
  transform: scale(1.05); /* Slight zoom effect on hover */
}

.el-button:disabled {
  background-color: #2E2E2E;
  color: #666;
  cursor: not-allowed;
}
</style>
