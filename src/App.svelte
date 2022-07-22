<script>
	import { ethers } from "ethers";
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
	} from "svelte-ethers-store";
	import Guess from "../artifacts/contracts/Guess.sol/Guess.json";
	defaultEvmStores.setProvider();
	// Contract address is hard-coded for now.
	const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
	defaultEvmStores.attachContract(
		"guessContract",
		CONTRACT_ADDRESS,
		Guess.abi
	);
	$: network = $connected ? $provider.getNetwork() : null;
	$: contract = $connected ? $contracts.guessContract : null;
	let guessVal;

	async function attempt() {
		try {
			const transaction = await contract.attempt(
				guessVal,
				{
					gasLimit: 100000,
					value: ethers.utils.parseEther("1"),
				}
			);
			await transaction.wait();
		} catch (error) {
			alert("Error while attempting to guess.", error);
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
	{#if contract}
		<p>
			The secret number is between 0 and
			{#await contract.size()}
				<span>...looking up...</span>
			{:then value}
				<span>{value}.</span>
			{/await}
			The prize pool is already
			{#await contract.getBalance()}
				<span>...looking up...</span>
			{:then value}
				<span>{value},</span>
			{/await}
			and if you guess correctly, you'd receive all of this. It could be your
			lucky day!
		</p>
		<form on:submit={attempt}>
			<fieldset>
				<legend
					>Please guess the secret number from 0 to
					{#await contract.size()}<span>...looking up...</span
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
			<button type="submit" disabled={!$connected}>Submit Guess</button>
		</form>
	{:else}
		<p>Please first connect network to be able to use this page</p>
	{/if}
</main>

<footer />
