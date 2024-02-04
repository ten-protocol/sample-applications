# Decentralized Rock, Paper, Scissors

Game on the Ten network that leverages the privacy features of Ten for confidential transactions. Players can make their choices privately, and the game logic is executed on the Ten network. The Aggregator nodes validate the outcomes while keeping the choices confidential. The winner is then determined and revealed without exposing the individual choices. This project demonstrates how privacy is maintained even in a simple gaming scenario, highlighting the capabilities of the Ten protocol.

## How to play

1. Clone the repository
2. Install the dependencies
3. Run the game

   ```bash
   git clone
   cd rps-game
   npm install
   npm start
   ```

4. Open the game in your browser at `http://localhost:3000`

### rend

npm install --save-dev --legacy-peer-deps git+https://github.com/ten-protocol/ten-hardhat-plugin.git
