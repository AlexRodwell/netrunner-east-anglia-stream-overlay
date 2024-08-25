<script lang="ts">
	import {
		PUBLIC_WEBSOCKET_CONNECTION,
		PUBLIC_WEBSOCKET_URL,
	} from "$env/static/public";
	import { onMount } from "svelte";
	import {
		globalData,
		playerOneData,
		playerTwoData,
		deploy,
	} from "$lib/store";
	import type {
		PlayerAttributes as TPlayerAttributes,
		GlobalData as TGlobalData,
		TimerData as TTimerData,
		PlayerSide as TPlayerSide,
		GameSide as TGameSide,
	} from "$lib/types";
	import Player from "$components/dashboard/Player.svelte";
	import Header from "$components/dashboard/Header.svelte";

	let socket: WebSocket;

	let websocket = PUBLIC_WEBSOCKET_CONNECTION.toLowerCase() === "true";

	onMount(() => {
		if (websocket) {
			socket = new WebSocket(PUBLIC_WEBSOCKET_URL);
		}
	});

	const swap_deck = (swap: {
		currentPlayer: TPlayerSide;
		selected: {
			active: TGameSide;
			inactive: TGameSide;
		};
	}) => {
		if (swap.currentPlayer === "playerOne") {
			$playerOneData.side = swap.selected.active;
			$playerTwoData.side = swap.selected.inactive;
			$playerOneData.decks[swap.selected.active].active = true;
			$playerOneData.decks[swap.selected.inactive].active = false;
			$playerTwoData.decks[swap.selected.active].active = false;
			$playerTwoData.decks[swap.selected.inactive].active = true;
			store_data({
				type: "playerOne",
				data: $playerOneData,
			});
			store_data({
				type: "playerTwo",
				data: $playerTwoData,
			});
		} else {
			$playerTwoData.side = swap.selected.active;
			$playerOneData.side = swap.selected.inactive;
			$playerTwoData.decks[swap.selected.active].active = true;
			$playerTwoData.decks[swap.selected.inactive].active = false;
			$playerOneData.decks[swap.selected.active].active = false;
			$playerOneData.decks[swap.selected.inactive].active = true;
			store_data({
				type: "playerTwo",
				data: $playerTwoData,
			});
			store_data({
				type: "playerOne",
				data: $playerOneData,
			});
		}
	};

	type DataTypeMap = {
		global: TGlobalData;
		playerOne: TPlayerAttributes;
		playerTwo: TPlayerAttributes;
		timer: TTimerData;
	};

	const store_data = (incoming: {
		type: keyof DataTypeMap;
		data: DataTypeMap[keyof DataTypeMap];
	}) => {
		const { type, data } = incoming;

		// Store data locally
		localStorage.setItem(`hold_${type}`, JSON.stringify(data));

		if ($deploy.type === "manual") {
			$deploy.proceed = true;
		} else {
			deploy_data();
		}
	};

	const deploy_data = () => {
		["global", "playerOne", "playerTwo", "timer"].forEach(
			(type: string) => {
				const hold_key = `hold_${type}`;
				const raw_data = localStorage.getItem(hold_key);

				if (!raw_data) {
					console.warn(`No data found for ${hold_key}, skipping`);
					return;
				}

				let hold;
				try {
					hold = JSON.parse(raw_data);
				} catch (error) {
					console.error(`Error parsing data for ${hold_key}:`, error);
					return;
				}

				if (
					typeof hold !== "object" ||
					hold === null ||
					Object.keys(hold).length === 0
				) {
					console.warn(
						`Invalid or empty hold data for ${type}, skipping deployment`,
					);
					return;
				}

				if (websocket) {
					try {
						socket.send(JSON.stringify({ _type: type, ...hold }));
					} catch (error) {
						console.error(
							`Failed to update ${type} data via WebSocket:`,
							error,
						);
						alert(`Failed to update ${type} data via WebSocket`);
					}
				}

				console.info(
					`%c DEPLOYED %c${type}'s' data`,
					"background: DarkGreen",
				);

				// Update the real value
				localStorage.setItem(type, JSON.stringify(hold));

				// Remove hold value
				localStorage.removeItem(hold_key);
			},
		);

		$deploy.proceed = false;
	};
</script>

<main
	class="bg-[#101010] text-foreground w-screen min-h-screen grid grid-rows-[auto_1fr]"
>
	<!-- Pass the deploy_data function as a property to header, so we can utilise the socket, without having to create a new WebSocket -->
	<Header update={store_data} {deploy_data} />
	<section class="grid grid-cols-1 md:grid-cols-2 p-4 gap-4">
		<Player
			update={store_data}
			name="playerOne"
			on:swap_deck={(event) => swap_deck(event.detail)}
		/>
		<Player
			update={store_data}
			name="playerTwo"
			on:swap_deck={(event) => swap_deck(event.detail)}
		/>
	</section>
</main>
