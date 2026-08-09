<script lang="ts">
	import getStroke from 'perfect-freehand';
	import { onMount, onDestroy } from 'svelte';
	import { secondaryButton } from '../lib/tailwindClasses';

	let {
		onSave,
		onCancel,
		onClearRequested = $bindable()
	}: {
		onSave?: (base64: string) => void;
		onCancel?: () => void;
		onClearRequested?: () => void;
	} = $props();

	type Point = [number, number, number];

	const BASE_WIDTH = 600;
	const BASE_HEIGHT = 300;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let svg: SVGSVGElement;

	let resizeObserver: ResizeObserver;

	let drawing = false;

	let currentPoints: Point[] = [];
	let strokes: string[] = $state([]);

	const strokeOptions = {
		size: 7,
		thinning: 0.6,
		smoothing: 0.5,
		streamline: 0.7,
		easing: (t: number) => t,
		start: { taper: 0, cap: true },
		end: { taper: 0, cap: true }
	};

	/* =======================================================
		Canvas Helpers
	======================================================= */

	function resizeCanvas() {
		if (!canvas) return;

		const ratio = window.devicePixelRatio || 1;

		const width = canvas.clientWidth;
		const height = canvas.clientHeight;

		canvas.width = width * ratio;
		canvas.height = height * ratio;

		ctx = canvas.getContext('2d')!;

		// reset transform before applying DPI scale
		ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

		ctx.fillStyle = 'white';

		redrawAll();
	}

	function getScale() {
		return {
			x: canvas.clientWidth / BASE_WIDTH,
			y: canvas.clientHeight / BASE_HEIGHT
		};
	}

	function getPoint(e: PointerEvent): Point {
		const rect = canvas.getBoundingClientRect();

		const { x: sx, y: sy } = getScale();

		return [(e.clientX - rect.left) / sx, (e.clientY - rect.top) / sy, e.pressure || 0.5];
	}

	function scalePath(path: string) {
		const { x: sx, y: sy } = getScale();

		return new Path2D(
			path.replace(
				/(-?\d+\.?\d*) (-?\d+\.?\d*)/g,
				(_, x, y) => `${Number(x) * sx} ${Number(y) * sy}`
			)
		);
	}

	function clearCanvas() {
		ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	}

	/* =======================================================
		Drawing
	======================================================= */

	function redrawAll() {
		clearCanvas();

		for (const d of strokes) {
			ctx.fill(scalePath(d));
		}
	}

	function drawPreview() {
		if (currentPoints.length < 2) return;

		const { x: sx, y: sy } = getScale();

		const scaledPoints = currentPoints.map(([x, y, p]) => [x * sx, y * sy, p]);

		const stroke = getStroke(scaledPoints, {
			...strokeOptions,
			size: strokeOptions.size * sx
		});

		const path = getSvgPathFromStroke(stroke);

		ctx.fill(new Path2D(path));
	}

	function pointerDown(e: PointerEvent) {
		drawing = true;

		canvas.setPointerCapture(e.pointerId);

		currentPoints = [getPoint(e)];
	}

	function pointerMove(e: PointerEvent) {
		if (!drawing) return;

		const events = e.getCoalescedEvents?.() ?? [e];

		for (const ev of events) {
			currentPoints.push(getPoint(ev));
		}

		redrawAll();
		drawPreview();
	}

	function pointerUp(e: PointerEvent) {
		if (!drawing) return;

		drawing = false;

		canvas.releasePointerCapture(e.pointerId);

		if (currentPoints.length > 1) {
			const stroke = getStroke(currentPoints, strokeOptions);

			strokes = [...strokes, getSvgPathFromStroke(stroke)];
		}

		currentPoints = [];

		redrawAll();

		exportImage();
	}

	/* =======================================================
		Actions
	======================================================= */

	function clear() {
		strokes = [];
		currentPoints = [];
		clearCanvas();
		exportImage();
	}

	function exportImage() {
		const exportCanvas = document.createElement('canvas');
		const exportCtx = exportCanvas.getContext('2d')!;

		exportCanvas.width = BASE_WIDTH;
		exportCanvas.height = BASE_HEIGHT;

		exportCtx.fillStyle = 'black';

		for (const d of strokes) {
			exportCtx.fill(new Path2D(d));
		}

		if (strokes.length === 0) {
			onSave?.('');
			return;
		}

		onSave?.(exportCanvas.toDataURL('image/png'));
	}

	/* =======================================================
		SVG
	======================================================= */

	function getSvgPathFromStroke(stroke: number[][]) {
		if (!stroke.length) return '';

		let d = `M ${stroke[0][0]} ${stroke[0][1]}`;

		for (let i = 1; i < stroke.length; i++) {
			d += ` L ${stroke[i][0]} ${stroke[i][1]}`;
		}

		return d + ' Z';
	}

	/* =======================================================
		Lifecycle
	======================================================= */

	onMount(() => {
		resizeCanvas();

		resizeObserver = new ResizeObserver(() => {
			resizeCanvas();
		});

		resizeObserver.observe(canvas);

		onClearRequested = clear;
	});

	onDestroy(() => {
		resizeObserver?.disconnect();
	});
</script>

<div class="flex w-full flex-col items-center justify-center gap-8">
	<div class="w-full max-w-3xl">
		<div class="relative aspect-[2/1] w-full">
			<!-- Live Drawing Canvas -->
			<canvas
				bind:this={canvas}
				class="absolute inset-0 h-full w-full cursor-crosshair touch-none border-2 border-blue-400 bg-blue-950/50"
				onpointerdown={pointerDown}
				onpointermove={pointerMove}
				onpointerup={pointerUp}
				onpointerleave={pointerUp}
			></canvas>

			<!-- Hidden SVG (stores vector paths) -->
			<svg bind:this={svg} class="hidden" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
				{#each strokes as d}
					<path {d} fill="white" />
				{/each}
			</svg>
		</div>
	</div>

	<div class="flex flex-wrap justify-center gap-3">
		<button type="button" onclick={clear} class={secondaryButton}> Clear Signature </button>

		{#if onCancel}
			<button type="button" onclick={onCancel} class={secondaryButton}> Cancel </button>
		{/if}
	</div>
</div>
