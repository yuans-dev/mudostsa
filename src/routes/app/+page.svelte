<script lang="ts">
	import { supabaseUrl } from '$lib/app/lib/supabase';
	import { innerContent } from '$lib/app/lib/tailwindClasses';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let downloadLink = $state('');
	let downloading = $state(false);
	$effect(() => {
		if (downloading) {
			setTimeout(() => {
				downloading = false;
			}, 1000);
		}
	});
	onMount(async () => {
		downloadLink = (
			await (
				await fetch(`${supabaseUrl}/storage/v1/object/public/app_releases/manifests/stable.json`)
			).json()
		).platforms['windows-x86_64'].url;
	});
</script>

<div class="{innerContent} flex h-full flex-col items-center justify-center text-white">
	<div class="flex flex-col items-center gap-8 p-12 text-center">
		<img
			src="/logo.svg"
			alt="MU-DOST SA Logo"
			class="aspect-square h-16 select-none"
			draggable="false"
		/>

		<div class="flex flex-col gap-4">
			<h2 class="audiowide glow border-b border-b-white/10 pb-4 text-5xl font-semibold">
				MU-DOST SA Online
			</h2>

			<span class="text-white/70"> An online management system for DOST scholars. </span>
		</div>
	</div>

	{#if downloadLink}
		<button
			in:fly={{ y: -20, duration: 200 }}
			disabled={downloading}
			onclick={() => {
				window.open(downloadLink, '_blank', 'noopener,noreferrer');
				downloading = true;
			}}
			class="border-2 border-blue-400 px-6 py-3 text-xl transition-all duration-200 hover:bg-blue-400 hover:text-black"
		>
			{downloading ? 'Downloading' : 'Download Latest'}
		</button>
	{/if}
</div>
