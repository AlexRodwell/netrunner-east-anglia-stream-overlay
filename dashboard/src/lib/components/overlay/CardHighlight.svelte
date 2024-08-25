<script lang="ts">
	import Card from "../Card.svelte";
	import type {
		Highlight as THighlight,
		PlayerSide as TPlayerSide,
		GameSide as TGameSide,
	} from "$lib/types";

	export let player: TPlayerSide;
	export let data: {
		[key in "primary" | "secondary"]: THighlight;
	};
	export let side: TGameSide;
	export let width: number = 12;

	$: align = player === "playerOne" ? "left" : "right";

	let classes = {
		wrapper: {
			base: "aspect-video flex flex-row items-center relative bottom-0 h-full items-center",
			left: `left-0 justify-start`,
			right: `right-0 justify-end`,
		},
		card: {
			primary: {
				shared: {
					default: "z-10 h-[90%]",
					inactive: "50vw",
				},
				left: "left-[2.5%] origin-bottom-left -rotate-2",
				right: "right-[2.5%] origin-bottom-right rotate-2",
			},
			secondary: {
				shared: {
					default: "top-1/2 -translate-y-1/2 h-[80%] -mt-6",
					inactive: "-50vw",
				},
				left: "left-[25%] origin-bottom-left rotate-3",
				right: "right-[25%] origin-bottom-right -rotate-3",
			},
		},
	};
</script>

<!-- style="--width: {width}vw" -->
<div class="{classes.wrapper.base} {$$props.class ?? ''}">
	{#each ["primary", "secondary"] as type}
		<div
			id="{player}-card-{type}"
			class="h-full absolute flex flex-row {classes.wrapper[
				align
			]} {classes.card[type].shared.default} {classes.card[type][align]}"
			style="--tw-transform-x: translateX({data[type].active
				? '0'
				: player === 'playerOne'
					? '-300'
					: '300'}%); transition: transform 200ms ease-in-out 260ms; --transition-delay: {data[
				type
			].active
				? '480ms'
				: '0ms'}"
		>
			<Card
				code={data[type].current}
				flip={!data[type].active}
				{side}
				class="h-full"
			/>
		</div>
	{/each}
</div>
