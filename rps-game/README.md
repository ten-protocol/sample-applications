# Decentralized Rock, Paper, Scissors

Game on the Ten network that leverages the privacy features of Ten for confidential transactions. Players can make their choices privately, and the game logic is executed on the Ten network. The Aggregator nodes validate the outcomes while keeping the choices confidential. The winner is then determined and revealed without exposing the individual choices. This project demonstrates how privacy is maintained even in a simple gaming scenario, highlighting the capabilities of the Ten protocol.

## Compile

```bash
npx hardhat compile
```

## Deploy

```bash
npx hardhat run scripts/deploy.ts --network obscuro
```

## Test

```bash
 npx hardhat test
```
