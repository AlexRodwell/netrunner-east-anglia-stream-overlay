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
				left: "left-[2.5%] origin-bottom-left",
				right: "right-[2.5%] origin-bottom-right",
			},
			secondary: {
				shared: {
					default: "h-[80%] -mt-4",
					inactive: "-50vw",
				},
				left: "left-[35%] origin-bottom-left",
				right: "right-[35%] origin-bottom-right",
			},
		},
	};
</script>

<div class="{classes.wrapper.base} {$$props.class ?? ''}">
	{#each ["primary", "secondary"] as type}
		<div
			id="{player}-card-{type}"
			class="h-full absolute flex flex-row translate-x-[var(--translate-x)] rotate-[var(--rotate)] {classes
				.wrapper[align]} {classes.card[type].shared.default} {classes
				.card[type][align]}"
			style="--translate-x: {data[type].active
				? '0'
				: player === 'playerOne'
					? '-300'
					: '300'}%; transition: transform 200ms ease-in-out 260ms; --transition-delay: {data[
				type
			].active
				? '480ms'
				: '0ms'};
				--rotate: {type === 'primary'
				? data[type].active
					? player === 'playerOne'
						? '-2'
						: '2'
					: '0'
				: data[type].active
					? player === 'playerOne'
						? '2'
						: '-2'
					: '0'}deg
			"
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
