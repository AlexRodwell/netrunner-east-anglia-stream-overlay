import { writable } from "svelte/store";
import type {
	GlobalData,
	PlayerData,
	TimerData,
	PlayerAttributes,
	Card
} from "./types";

// JSON
import DefaultGlobal from "$lib/data/default/global.json";
import DefaultPlayer from "$lib/data/default/player.json";
import DefaultTimer from "$lib/data/default/timer.json";

// Session token
export const websocketToken = writable<string>();

// API data
export const netrunnerDB = writable<{
	data: Card[];
	links: {
		first: string;
		last?: string;
	};
}>({
	data: [],
	links: {
		first: ""
	}
});

// Websocket data
export const globalData = writable<GlobalData>(DefaultGlobal);
export const playerData = writable<PlayerData>(DefaultPlayer);
export const timerData = writable<TimerData>(DefaultTimer);

export const playerOneData = writable<PlayerAttributes>(
	DefaultPlayer.playerOne
);

export const playerTwoData = writable<PlayerAttributes>(
	DefaultPlayer.playerTwo
);

// Local data
export const deploy = writable<{
	type: "automatic" | "manual";
	proceed: boolean;
	last?: string;
}>({
	type: "automatic",
	proceed: true,
});
