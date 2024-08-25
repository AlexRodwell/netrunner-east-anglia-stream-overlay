<script lang="ts">
	import {
		globalData,
		netrunnerDB,
		playerOneData,
		playerTwoData,
	} from "$lib/store";
	import CardHighlight from "$components/overlay/CardHighlight.svelte";
	import Loading from "$components/Loading.svelte";
	import Commentators from "$components/overlay/Commentators.svelte";
	import layout from "$lib/data/layout.json";
	import { default as Side } from "$components/overlay/MetaSide.svelte";
	import type { ThemeClasses as TThemeClasses } from "$lib/types";
	import Wrapper from "$components/overlay/Wrapper.svelte";

	const theme: TThemeClasses = layout[$globalData.overlay.layout];

	$: {
		import(`$lib/styles/${$globalData.overlay.layout}.css`).catch(
			(error) => {
				console.error(`Failed to import CSS file: ${error}`);
			},
		);
	}
</script>

{#if $netrunnerDB && $playerOneData && $playerTwoData}
	<Wrapper
		class="grid gap-[calc(var(--padding)/2)] grid-cols-2 grid-rows-[auto_1fr_auto] items-end py-[var(--padding)]"
	>
		<div class="col-span-2">
			<Commentators />
		</div>
		<div class="flex flex-row justify-start pl-[var(--padding)]">
			<CardHighlight
				class="h-[40vh]"
				player="playerOne"
				data={$playerOneData.highlight}
				side={$playerOneData.side}
			/>
		</div>
		<div class="flex flex-row justify-end pr-[var(--padding)]">
			<CardHighlight
				class="h-[40vh]"
				player="playerTwo"
				data={$playerTwoData.highlight}
				side={$playerTwoData.side}
			/>
		</div>

		<div class=" bottom-0 left-0 w-[50vw]">
			<Side player="playerOne" {theme} />
		</div>
		<div class=" bottom-0 right-0 w-[50vw]">
			<Side player="playerTwo" {theme} />
		</div>
	</Wrapper>
{:else}
	<main
		class="wrapper flex place-content-center place-items-center flex-col gap-4"
	>
		<Loading />
		<p>Awaiting data...</p>
	</main>
{/if}
