<script lang="ts">
	import { primaryButton } from '$lib/app/lib/tailwindClasses';
	import Dialog from './Dialog.svelte';
	let {
		title,
		children,
		shown = $bindable(false),
		onOk
	}: {
		title: string;
		children: any;
		shown: boolean;
		onOk?: () => any;
	} = $props();
</script>

<Dialog {title} bind:shown>
	<div class="flex w-full flex-col items-center justify-center space-y-12 p-4 pt-12 md:px-36">
		<div class={`text-white`}>{@render children()}</div>
		<div class="flex items-center justify-center gap-2">
			<button
				onclick={() => {
					shown = false;
					onOk?.();
				}}
				class={primaryButton}>OK</button
			>
		</div>
	</div>
</Dialog>
