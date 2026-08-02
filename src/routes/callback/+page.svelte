<script>
	import { onMount } from 'svelte';

	let { data } = $props();

	onMount(() => {
		window.location.replace(`mudostsa://auth/callback?code=${encodeURIComponent(data.code)}`);
	});
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
	<h1 class="glow text-3xl text-blue-300">Authentication success!</h1>
	<p class="font-mono text-gray-300">Please wait while we are returning you to MU-DOST SA Online</p>
</div>
