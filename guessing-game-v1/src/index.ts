import { ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import ERC20 from '../artifacts/contracts/ERC20.sol/ERC20.json';
import Guess from '../artifacts/contracts/Guess.sol/Guess.json';
const ERC20_ADDRESS = '0xEA898366AcfEc269680D6f101C2222DF16dA57d4';
const GUESS_ADDRESS = '0x025a353A99865bc395D203a38535A651150C1E49';

let erc20Contract: ethers.Contract;
let guessContract: ethers.Contract;

const guessButton = document.getElementById('guess-button') as HTMLButtonElement;
const approveButton = document.getElementById('approve-button') as HTMLButtonElement;
const guessInput = document.getElementById('guess-input') as HTMLInputElement;
const approveInput = document.getElementById('approve-input') as HTMLInputElement;
const guessRange = document.getElementById('guess-range') as HTMLSpanElement;
const connectedAddress = document.getElementById('connected-address') as HTMLSpanElement;
const chainId = document.getElementById('chain-id') as HTMLSpanElement;
const allowanceLabel = document.getElementById('allowance') as HTMLSpanElement;
const SUPPORTED_CHAIN_IDS = [421613, 443, 11155111];

const provider = new ethers.providers.Web3Provider(window.ethereum)

const connectButton = document.getElementById('connect-button') as HTMLButtonElement;

connectButton?.addEventListener('click', async () => {
    try {
        await provider.send('eth_requestAccounts', []);
        connectButton.style.display = 'none';
        initializeApp();
    } catch (error) {
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
    erc20Contract = new ethers.Contract(ERC20_ADDRESS, ERC20.abi, signer);
    guessContract = new ethers.Contract(GUESS_ADDRESS, Guess.abi, signer);
    const signerAddress = await signer.getAddress();
    const filterApproval = erc20Contract.filters.Approval(signerAddress);
    const filterGuess = guessContract.filters.GuessResult(signerAddress);

    const symbol = await erc20Contract.symbol();
    guessRange.innerText = await guessContract.guessRange();
    connectedAddress.innerText = signerAddress.substring(0, 18) + '..';
    provider.getSigner().getChainId().then(result => {chainId.innerText = result.toString()});
    erc20Contract.allowance(signerAddress, GUESS_ADDRESS).then((result: bigint) => {
        updateAllowance(result);
    });

    erc20Contract.on(filterApproval, (owner, _, value) => {
        updateAllowance(value);
        alert(`Approval of ${ethers.utils.formatEther(value)} ${symbol} by account ${owner} to the game was successful. `);
    });
    guessContract.on(filterGuess, (_, allowance, prize, guess, msg) => {
        updateAllowance(allowance);
        alert(`Your guess of ${guess} was ${msg} ${ethers.utils.formatEther(prize)} ETH.`);
    });
}


guessButton?.addEventListener('click', e => { e.preventDefault(); guess() });
approveButton?.addEventListener('click', e => { e.preventDefault(); approve() });

function updateAllowance(allowance: bigint) {
    guessButton.disabled = (allowance == BigInt(0));
    allowanceLabel.innerText = formatEther(allowance).split('.')[0];
}

async function approve() {
    try {
        const approval = await erc20Contract.approve(
            GUESS_ADDRESS,
            ethers.utils.parseEther(approveInput.value),
            { gasLimit: 400000 }
        );
        approval.wait();
    } catch (error) {
        alert('Error while attempting to approve.' + JSON.stringify(error));
    }
}

async function guess() {
    try {
        const attempt = await guessContract.attempt(
            parseInt(guessInput.value),
            { gasLimit: 400000 }
        );
        attempt.wait();
    } catch (error) {
        alert('Error while attempting to guess.' + JSON.stringify(error));
    }
}
