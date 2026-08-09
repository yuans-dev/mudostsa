<script lang="ts">
	import FileUploadField from '$lib/app/components/FileUploadField.svelte';
	import MaterialIcon from '$lib/app/components/MaterialIcon.svelte';
	import Title from '$lib/app/components/Title.svelte';
	import { submitApplication } from '$lib/app/lib/supabase.js';
	import { container, fieldInput, primaryButton } from '$lib/app/lib/tailwindClasses.js';
	import { membershipApplicationSchema } from '$lib/app/lib/zod/application_forms.js';

	let { data } = $props();
	let applyContainer: HTMLDivElement;
	let error = $state('');
	let studentNumber = $derived(data.renewal);
	let name = $state('');
	let program = $state('');
	let year = $state(1);
	let proofOfPayment = $state<File | null>(null);
	let processing = $state(false);
	async function handleSubmit() {
		processing = true;
		const result = membershipApplicationSchema.safeParse({
			studentNumber,
			name,
			program,
			year
		});
		if (result.error) {
			error = 'form:' + result.error.issues[0].message;
		}

		if (proofOfPayment && result.data) {
			try {
				await submitApplication(
					result.data.studentNumber,
					result.data.name,
					result.data.program,
					result.data.year,
					proofOfPayment
				);
			} catch (e) {
				console.log(e);
				error = 'server:' + (e instanceof Error ? e.message : 'An unknown error occurred');
			}
		} else {
			error = 'form:' + 'Proof of payment is required';
		}
		processing = false;
	}
	$effect(() => {
		if (error) {
			applyContainer.scrollTop = 0;
		}
	});
</script>

<div class="{container} mx-[33%] mt-20 mb-20" bind:this={applyContainer}>
	<form class="  space-y-6" onsubmit={handleSubmit}>
		<h2 class="mb-4 text-2xl font-bold text-white">Apply for Membership</h2>
		{#if error}
			{#if error.startsWith('form:')}
				<div class="flex items-center justify-center gap-2 bg-red-600 p-2 text-white">
					<MaterialIcon icon="warning" size={1.5}></MaterialIcon>
					{error.substring(5)}
				</div>
			{:else if error.startsWith('server:')}
				<div class="flex items-center justify-center gap-2 bg-red-600 p-2 text-white">
					<MaterialIcon icon="warning" size={1.5}></MaterialIcon>
					{error.substring(7)}
				</div>
			{/if}
		{/if}

		<div>
			<label for="studentNumber"><Title className="opacity-70">Student Number</Title></label>
			<input
				id="studentNumber"
				class={fieldInput}
				type="text"
				bind:value={studentNumber}
				required
				placeholder="2025XXXXXX"
			/>
		</div>
		<div>
			<label for="name"><Title className="opacity-70">Full Name</Title></label>
			<input
				id="name"
				class={fieldInput}
				type="text"
				bind:value={name}
				required
				placeholder="Juan Dela Cruz"
			/>
		</div>
		<div>
			<label for="program"><Title className="opacity-70">Program</Title></label>
			<input
				id="program"
				class={fieldInput}
				type="text"
				bind:value={program}
				required
				placeholder="BS Computer Science"
			/>
		</div>
		<div>
			<label for="year"><Title className="opacity-70">Year</Title></label>
			<input
				id="year"
				class={fieldInput}
				type="number"
				min="1"
				max="10"
				bind:value={year}
				required
			/>
		</div>
		<div class="audiowide glow flex w-full items-center justify-center p-4 text-center text-white">
			<span>Membership Fee: 150 PHP</span>
		</div>
		<div class="flex flex-col gap-4">
			<label for="year"><Title className="opacity-70">Proof of Payment</Title></label>
			<FileUploadField
				onFilesChange={async (f) => {
					const file = f[0];
					if (file) {
						proofOfPayment = file;
					}
				}}
				maxSizeMb={1}
				maxNumberOfFiles={1}
				allowedTypes={['image/png', 'image/jpeg']}
			></FileUploadField>
		</div>

		<button class="{primaryButton} w-full" type="submit" disabled={processing}> Apply </button>
		<p class="text-sm text-white italic">
			By applying, you agree to MU-DOST SA Online's <a
				href="/termsOfService"
				class="text-blue-400 hover:underline">terms of service</a
			>
			and
			<a href="/privacyPolicy" class="text-blue-400 hover:underline">privacy policy</a>
		</p>
	</form>
</div>
