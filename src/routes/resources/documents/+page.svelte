<script lang="ts">
	import MaterialIcon from '$lib/app/components/MaterialIcon.svelte';
	import { readRows } from '$lib/app/lib/supabase';
	import { container } from '$lib/app/lib/tailwindClasses';
	import type { UploadedDocument } from '$lib/app/lib/types';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let documents = $state<UploadedDocument[]>([]);

	onMount(async () => {
		documents = (await readRows('uploaded_documents')).data ?? [];
	});

	const documentMap: Record<string, string> = {
		spef_latest: 'Semestral Progress and Engagement Form (SPEF)'
	};
</script>

<div class={container}>
	<h2 class="mb-4 font-semibold text-white">Documents ({documents.length})</h2>
	<div>
		{#each documents as document}
			<div
				in:fly={{ x: -10, duration: 200 }}
				class="flex items-center justify-start gap-4 text-blue-200"
			>
				<MaterialIcon icon="docs" size={1.2}></MaterialIcon>
				<a href={'/resources/documents/' + document.file_path} class="text-blue-200 hover:underline"
					>{documentMap[document.key] ?? document.key}</a
				>
				<div class="flex gap-2 text-xs text-black uppercase">
					{#each document.tags as tag}
						<span class="bg-blue-400 px-2 py-1">{tag}</span>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
