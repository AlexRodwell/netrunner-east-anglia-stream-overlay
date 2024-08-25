<script lang="ts">
	import { PUBLIC_WEBSOCKET_CONNECTION } from "$env/static/public";
	import { globalData } from "$lib/store";
	import Loading from "$components/Loading.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Check } from "lucide-svelte";

	$: connection = $globalData.websocket.status;
</script>

{#if PUBLIC_WEBSOCKET_CONNECTION.toLowerCase() === "true"}
	<Button
		variant="outline"
		class="flex flex-row gap-2 items-center {connection
			? 'bg-green-500/10 border-green-500 hover:bg-transparent cursor-default'
			: 'bg-red-500/10 border-red-500'}"
		disabled={!connection}
	>
		{#if connection}
			<Check slot="icon-before" size={16} class="mt-0.5" />
			WebSocket Connected
		{:else}
			<Loading slot="icon-before" size={0.75} />
			Connecting
		{/if}
	</Button>
{/if}
