import { ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import ERC20 from '../artifacts/contracts/ERC20.sol/ERC20.json';
import Guess from '../artifacts/contracts/Guess.sol/Guess.json';
const ERC20_ADDRESS = '0xeDa66Cc53bd2f26896f6Ba6b736B1Ca325DE04eF';
const GUESS_ADDRESS = '0xC0370e0b5C1A41D447BDdA655079A1B977C71aA9';

const guessButton = document.getElementById('guess-button') as HTMLButtonElement;
const approveButton = document.getElementById('approve-button') as HTMLButtonElement;
const guessInput = document.getElementById('guess-input') as HTMLInputElement;
const approveInput = document.getElementById('approve-input') as HTMLInputElement;
const guessRange = document.getElementById('guess-range') as HTMLSpanElement;
const connectedAddress = document.getElementById('connected-address') as HTMLSpanElement;
const chainId = document.getElementById('chain-id') as HTMLSpanElement;
const allowanceLabel = document.getElementById('allowance') as HTMLSpanElement;

const provider = new ethers.providers.Web3Provider(window.ethereum)
await provider.send('eth_requestAccounts', []);
const signer = provider.getSigner();
const erc20Contract = new ethers.Contract(ERC20_ADDRESS, ERC20.abi, signer);
const guessContract = new ethers.Contract(GUESS_ADDRESS, Guess.abi, signer);
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

guessButton?.addEventListener('click', e => { e.preventDefault(); guess() });
approveButton?.addEventListener('click', e => { e.preventDefault(); approve() });

erc20Contract.on(filterApproval, (owner, _, value) => {
    updateAllowance(value);
    displayMessage(`Approval of ${ethers.utils.formatEther(value)} ${symbol} by account ${owner} to the game was successful. `);
});
guessContract.on(filterGuess, (_, allowance, prize, guess, msg) => {
    updateAllowance(allowance);
    displayMessage(`Your guess of ${guess} was ${msg} ${ethers.utils.formatEther(prize)} OGG.`);
});

function updateAllowance(allowance: bigint) {
    guessButton.disabled = (allowance == BigInt(0));
    allowanceLabel.innerText = formatEther(allowance).split('.')[0];
}

async function approve() {
    try {
        const approval = await erc20Contract.approve(
            GUESS_ADDRESS,
            // parse ether into a BigNumber instance of the amount of wei
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

function displayMessage(msg: string) {
    const para = (<HTMLTemplateElement>document.getElementById('message')).content.querySelector('p');
    const message = document.importNode(para as HTMLParagraphElement, true);
    message.append(msg);

    document.querySelector('main')?.prepend(message);
}