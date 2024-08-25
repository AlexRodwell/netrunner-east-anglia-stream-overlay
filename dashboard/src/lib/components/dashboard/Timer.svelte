<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { timerData } from "$lib/store";
	import type { TimerData as TTimerData } from "$lib/types";
	import { Timer } from "lucide-svelte";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Input } from "$lib/components/ui/input";

	let timer: TTimerData = $timerData;

	let svgText: SVGTextContentElement;
	let svgCounter: SVGPathElement;

	const dispatch = createEventDispatcher();

	const deploy = () => {
		dispatch("timer", timer);
	};

	const startCounter = () => {
		let currentValue = 0;
		const increment = 251.2 / timer.count; // Calculate the increment value

		const interval = setInterval(() => {
			if (currentValue >= 251.2) {
				clearInterval(interval); // Stop the interval when the maximum value is reached
			} else {
				currentValue += increment;
				svgCounter.style.strokeDasharray = `${currentValue}px 251.2px`;
			}
		}, 100); // Update every 10 milliseconds
	};
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
		<Timer size={16} slot="icon" class="mr-1" />
		Timer
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Timer</Dialog.Title>
		</Dialog.Header>
		<label>
			<span>Timer (minutes)</span>
			<Input bind:value={timer.count} type="number" />
		</label>
		<Dialog.Footer>
			<Button
				on:click={() => {
					timer.action = "set";
					timer.prev = new Date();
					startCounter();
					deploy();
				}}>Start timer</Button
			>
			<Button
				on:click={() => {
					timer.action = "clear";
					timer.prev = new Date();
					deploy();
				}}
				style="background: #242424; border: #242424; color: #fff;"
				>Clear timer</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
