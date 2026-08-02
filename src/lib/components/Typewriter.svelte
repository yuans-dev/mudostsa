<script lang="ts">
	let {
		text,
		progress = 0
	}: {
		text: string;
		progress: number;
	} = $props();

	const displayed = $derived(text.slice(0, Math.round(text.length * progress)));
</script>

<span class="typewriter">
	{displayed}
</span>
