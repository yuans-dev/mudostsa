<script lang="ts">
	import { fieldInput, innerContent } from '$lib/app/lib/tailwindClasses';
	import Typewriter from '$lib/components/Typewriter.svelte';
	import { DotLottie } from '@lottiefiles/dotlottie-web';
	import { onMount } from 'svelte';
	let { children } = $props();
	const resourcesLinks = [
		{
			name: 'Document Templates',
			href: '/resources/documents/',
			description:
				'Access official forms and document templates for common MU-DOST SA and DOST processes and submissions.'
		},
		{
			name: 'Frequently Asked Questions',
			href: '/resources/faq/',
			description:
				'Find answers to common questions about the system, membership, and organization services.'
		},
		{
			name: 'Contacts',
			href: '/resources/contacts/',
			description:
				'Get in touch with the MU-DOST SA organization for support, inquiries, and other concerns.'
		}
	];
</script>

<div class={innerContent}>
	<div class="flex w-full flex-col items-center justify-center gap-4">
		<span class=" w-full text-center text-white">What are you looking for?</span>

		<input placeholder="Search" class="{fieldInput} max-w-100" />
	</div>
	<div class="grid h-[80%] w-full grid-cols-1 gap-4 md:grid-cols-3">
		{#each resourcesLinks as link}
			<a
				href={link.href}
				class="flex h-full w-full flex-col items-center justify-center gap-4 border-l-2 border-l-blue-400 bg-gradient-to-r from-blue-900/10 to-blue-800/50 px-6 py-4 text-white backdrop-blur-2xl transition-all duration-200 hover:brightness-110"
			>
				<span class="text-center text-xl">{link.name}</span>
				<p class="text-justify indent-5 text-white/70">{link.description}</p>
			</a>
		{/each}
	</div>

	<div>
		{@render children()}
	</div>
</div>
