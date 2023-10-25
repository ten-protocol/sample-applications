"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const ERC20_json_1 = __importDefault(require("../artifacts/contracts/ERC20.sol/ERC20.json"));
const Guess_json_1 = __importDefault(require("../artifacts/contracts/Guess.sol/Guess.json"));
const ERC20_ADDRESS = '0x41Ee73959C375E9d5Bf31629C529BB4e76d264C7';
const GUESS_ADDRESS = '0x2a0eFe9D636Af27f364A85a1459dd970c1cF4caE';
let erc20Contract;
let guessContract;
const guessButton = document.getElementById('guess-button');
const approveButton = document.getElementById('approve-button');
const guessInput = document.getElementById('guess-input');
const approveInput = document.getElementById('approve-input');
const guessRange = document.getElementById('guess-range');
const connectedAddress = document.getElementById('connected-address');
const chainId = document.getElementById('chain-id');
const allowanceLabel = document.getElementById('allowance');
const SUPPORTED_CHAIN_IDS = [421613, 443, 11155111];
const provider = new ethers_1.ethers.providers.Web3Provider(window.ethereum);
const connectButton = document.getElementById('connect-button');
connectButton?.addEventListener('click', async () => {
    try {
        await provider.send('eth_requestAccounts', []);
        connectButton.style.display = 'none';
        initializeApp();
    }
    catch (error) {
        alert('Error connecting to MetaMask: ' + JSON.stringify(error));
    }
});
async function initializeApp() {
    const network = await provider.getNetwork();
    if (!SUPPORTED_CHAIN_IDS.includes(network.chainId)) {
        alert('You are connected to an unsupported network. Please switch to a supported network.');
        return;
    }
    const signer = provider.getSigner();
    erc20Contract = new ethers_1.ethers.Contract(ERC20_ADDRESS, ERC20_json_1.default.abi, signer);
    guessContract = new ethers_1.ethers.Contract(GUESS_ADDRESS, Guess_json_1.default.abi, signer);
    const signerAddress = await signer.getAddress();
    const filterApproval = erc20Contract.filters.Approval(signerAddress);
    const filterGuess = guessContract.filters.GuessResult(signerAddress);
    const symbol = await erc20Contract.symbol();
    guessRange.innerText = await guessContract.guessRange();
    connectedAddress.innerText = signerAddress.substring(0, 18) + '..';
    provider.getSigner().getChainId().then(result => { chainId.innerText = result.toString(); });
    erc20Contract.allowance(signerAddress, GUESS_ADDRESS).then((result) => {
        updateAllowance(result);
    });
    erc20Contract.on(filterApproval, (owner, _, value) => {
        updateAllowance(value);
        alert(`Approval of ${ethers_1.ethers.utils.formatEther(value)} ${symbol} by account ${owner} to the game was successful. `);
    });
    guessContract.on(filterGuess, (_, allowance, prize, guess, msg) => {
        updateAllowance(allowance);
        alert(`Your guess of ${guess} was ${msg} ${ethers_1.ethers.utils.formatEther(prize)} ETH.`);
    });
}
guessButton?.addEventListener('click', e => { e.preventDefault(); guess(); });
approveButton?.addEventListener('click', e => { e.preventDefault(); approve(); });
function updateAllowance(allowance) {
    guessButton.disabled = (allowance == BigInt(0));
    allowanceLabel.innerText = (0, utils_1.formatEther)(allowance).split('.')[0];
}
async function approve() {
    try {
        const approval = await erc20Contract.approve(GUESS_ADDRESS, ethers_1.ethers.utils.parseEther(approveInput.value), { gasLimit: 400000 });
        approval.wait();
    }
    catch (error) {
        alert('Error while attempting to approve.' + JSON.stringify(error));
    }
}
async function guess() {
    try {
        const attempt = await guessContract.attempt(parseInt(guessInput.value), { gasLimit: 400000 });
        attempt.wait();
    }
    catch (error) {
        alert('Error while attempting to guess.' + JSON.stringify(error));
    }
}
