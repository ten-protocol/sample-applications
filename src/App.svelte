<script>
	import {
		// main connection helper defaultEvmStore can be use to initiate a connection.
		defaultEvmStores,
		// connected: store value is true a connection has been set up.
		connected,
		// provider: store value is an Ethers.js Provider instance if connected.
		provider,
		// chainId: store value is the current chainId if connected.
		chainId,
		// signerAddress: store value is a shortcut to get $signer.getAddress() when connected.
		signerAddress,
		// contracts: store value is an Object for all ethers.Contract instances
		contracts,
	} from 'svelte-ethers-store';
	import ERC20 from '../artifacts/contracts/Guess.sol/ERC20Basic.json';
	import Guess from '../artifacts/contracts/Guess.sol/Guess.json';
	defaultEvmStores.setProvider();
	// Contract address is hard-coded for now.
	const ERC20_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
	defaultEvmStores.attachContract(
		'erc20Contract',
		ERC20_ADDRESS,
		ERC20.abi
	);
	const GUESS_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
	defaultEvmStores.attachContract(
		'guessContract',
		GUESS_ADDRESS,
		Guess.abi
	);
	$: network = $connected ? $provider.getNetwork() : null;
	$: guessContract = $connected ? $contracts.guessContract : null;
	$: erc20Contract = $connected ? $contracts.erc20Contract : null;
	let guessVal;

	async function approve() {
		try {
			const approval = await erc20Contract.approve(
				GUESS_ADDRESS, 
				1.0,
				{gasLimit: 400000}
			);
			approval.wait();
			alert('Approval for 1 JAM granted to spend on Guessing Game.');
		} catch (error) {
			alert('Error while attempting to approve.', JSON.stringify(error));
		}
	}

	async function attempt() {
		try {
			const attempt = await guessContract.attempt(
				guessVal,
				{gasLimit: 400000}
			);
			attempt.wait();
			alert('Guess accepted.');
		} catch (error) {
			alert('Error while attempting to guess.', JSON.stringify(error));
		}
	}
</script>

<header>
	<h1>The Guessing Game</h1>
	<nav>
		{#if !$connected}
			<p>Application is not yet connected.</p>
		{:else}
			<p>Connected address: {$signerAddress}</p>
			<p>
				Network {#await network}
					...looking up...
				{:then network}
					ID: {network.chainId} Name: {network.name}
				{/await}
			</p>
		{/if}
	</nav>
</header>

<main>
	<p>Welcome to the Obscuro Number Guessing Game!</p>
	<p>
		The game contract contains a secret whole number, generated when the
		contract was deployed, and visible only within the trusted execution
		environments of the Obscuro network. It can not be seen by the node
		computer or by any node operator.
	</p>
	<p>
		Submit a guess with your payment, and if you guess correctly, you'll win
		all of the prize pool!
	</p>
	{#if guessContract}
		<p>
			The secret number is between 0 and
			{#await guessContract.size()}
				<span>...looking up...</span>
			{:then value}
				<span>{value}.</span>
			{/await}
			The prize pool is already
			{#await guessContract.getBalance()}
				<span>...looking up...</span>
			{:then value}
				<span>{value},</span>
			{/await}
			and if you guess correctly, you'd receive all of this. It could be your
			lucky day!
		</p>
		<p>
			First up: please approve the Game to take the entry fee of 1 JAM token.<br/>
			<button on:click={approve} disabled={!$connected}>Approve game fee</button>
		</p>
		<form on:submit={attempt}>
			<fieldset>
				<legend
					>Please guess the secret number from 0 to
					{#await guessContract.size()}<span>...looking up...</span
						>{:then value}<span>{value}.</span>{/await}
				</legend>
				<input
					type="number"
					min="0"
					max="255"
					bind:value={guessVal}
					size="200"
					required
					title="Secret number."
					placeholder="secret number."
				/>
			</fieldset>
			<button type="submit" disabled={!$connected}>Submit guess</button>
		</form>
	{:else}
		<p>Please first connect network to be able to use this page</p>
	{/if}
</main>

<footer />
