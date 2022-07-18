<script>
	import { ethers } from "ethers";
	import {
		connected,
		provider,
		chainId,
		signer,
		signerAddress,
		defaultEvmStores,
		contracts,
	} from "svelte-ethers-store";
	import { JSEncrypt } from "jsencrypt";
	import Guess from "../artifacts/contracts/Guess.sol/Guess.json";
	defaultEvmStores.setProvider();
	// Contract address is hard-coded for now.
	const contractAddress = "0x770B66fE16997b9af32218E655d5341b0DF54505";
	defaultEvmStores.attachContract(
		"guessContract",
		contractAddress,
		Guess.abi
	);
	$: network = $connected ? $provider.getNetwork() : "";
	let guessVal;

	async function attempt() {
		// Start our encryptor.
		var encrypt = new JSEncrypt();

		// Copied from https://github.com/travist/jsencrypt
		var publicKey = 
`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN
FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76
xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4
gwQco1KRMDSmXSMkDwIDAQAB
-----END PUBLIC KEY-----`;

		// Copied from https://github.com/travist/jsencrypt
		var privateKey = 
`-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQ
WMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNR
aY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB
AoGAfY9LpnuWK5Bs50UVep5c93SJdUi82u7yMx4iHFMc/Z2hfenfYEzu+57fI4fv
xTQ//5DbzRR/XKb8ulNv6+CHyPF31xk7YOBfkGI8qjLoq06V+FyBfDSwL8KbLyeH
m7KUZnLNQbk8yGLzB3iYKkRHlmUanQGaNMIJziWOkN+N9dECQQD0ONYRNZeuM8zd
8XJTSdcIX4a3gy3GGCJxOzv16XHxD03GW6UNLmfPwenKu+cdrQeaqEixrCejXdAF
z/7+BSMpAkEA8EaSOeP5Xr3ZrbiKzi6TGMwHMvC7HdJxaBJbVRfApFrE0/mPwmP5
rN7QwjrMY+0+AbXcm8mRQyQ1+IGEembsdwJBAN6az8Rv7QnD/YBvi52POIlRSSIM
V7SwWvSK4WSMnGb1ZBbhgdg57DXaspcwHsFV7hByQ5BvMtIduHcT14ECfcECQATe
aTgjFnqE/lQ22Rk0eGaYO80cc643BXVGafNfd9fcvwBMnk0iGX0XRsOozVt5Azil
psLBYuApa66NcVHJpCECQQDTjI2AQhFc1yRnCU/YgDnSpJVm1nASoRUnU8Jfm3Oz
uku7JUXcVpt08DFSceCEX9unCuMcT72rAQlLpdZir876
-----END RSA PRIVATE KEY-----`;

		// Assign our encryptor to utilize the public key.
		encrypt.setPublicKey(publicKey);

		try {
			const unsignedTx =
				await $contracts.guessContract.populateTransaction.attempt(
					guessVal,
					{
						gasLimit: 400000,
						value: ethers.utils.parseEther("0.1"),
					}
				);
			// Encrypt using the shared secret public key.
			unsignedTx.data  = '0x' + 
				Array.from(atob(encrypt.encrypt(unsignedTx.data)))
				.map(c=>c.charCodeAt(0).toString(16).padStart(2,'0'))
				.join('');
			const sentTx = await $signer.sendTransaction(unsignedTx);
			await sentTx.wait();
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
			<p>
				Connected {$signerAddress} to chain {$chainId} with network {#await network then value} {value.name} {/await}
			</p>
		{/if}
	</nav>
</header>

<main>
	<p>Welcome to the L2 PoC Guessing Game!</p>
	<p>
		The game contract contains a secret whole number between 0 and 255.
		Submit a guess with your payment, and if you guess correctly, you'll win
		all of the prize pool!
	</p>
	<p>
		<!-- Guesses: {#await $contracts.guessContract.guesses()} waiting {:then value} {value} {/await} -->
	</p>
	<p>
		{#if $connected}
			{#await network}
				<span>waiting...</span>
			{:then value}
				<p>Connected to {value.name} network.</p>
				{#await $contracts.guessContract.guesses()}
					<span>waiting...</span>
				{:then guesses}
					There have been {guesses} incorrect guess(es) so far. It could be your 
					lucky day!
				{/await}
			{/await}
		{:else}
			<p>Please first connect network to be able to use this page</p>
		{/if}

		<!-- Prize Pool: {#await $contracts.guessContract.getBalance()}
			waiting
		{:then value}
			{value}
		{/await} -->
	</p>
	<form on:submit={attempt}>
		<fieldset>
			<legend>Please guess the secret number from 0 to 255</legend>
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
</main>

<footer />
