<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;
	import {
		// globalData,
		playerOneData,
		playerTwoData,
	} from "$lib/store";
	import CardHighlight from "$components/overlay/CardHighlight.svelte";
	// import layout from "$lib/data/layout.json";
	import Wrapper from "$components/overlay/Wrapper.svelte";

	let side = data.slug;
</script>

<Wrapper
	class="flex flex-row {side === 'left' ? 'justify-start' : 'justify-end'}"
>
	{#if side === "left"}
		<CardHighlight
			player="playerOne"
			data={$playerOneData.highlight}
			side={$playerOneData.side}
			width={100}
		/>
	{:else if side === "right"}
		<CardHighlight
			player="playerTwo"
			data={$playerTwoData.highlight}
			side={$playerTwoData.side}
			width={40}
		/>
	{/if}
</Wrapper>
