<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Card from "$components/dashboard/ui/Card.svelte";
	import { globalData, deploy } from "$lib/store";
	import * as Dialog from "$lib/components/ui/dialog";

	// Icons
	import { Settings } from "lucide-svelte";
	import { buttonVariants } from "$lib/components/ui/button";
	import Column from "./ui/Column.svelte";
	import { Label } from "$lib/components/ui/label";
	import { Switch } from "$lib/components/ui/switch";
	import * as CardNew from "$lib/components/ui/card";
	import { t } from "$lib/translations";
	import type { GlobalData as TGlobalData } from "$lib/types";
	import { Slider } from "$lib/components/ui/slider";
	import { Input } from "$lib/components/ui/input";

	let global: TGlobalData = $globalData;
	let deployType: boolean = $deploy.type !== "automatic";

	const icons: Record<string, string> = {
		clicks: "/NSG_CLICK.svg",
		credits: "/NSG_CREDIT.svg",
		agendas: "/NSG_AGENDA.svg",
	};

	const dispatch = createEventDispatcher();
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
		<Settings size={16} class="mr-1" />
		{$t("global_settings")}
	</Dialog.Trigger>
	<Dialog.Content class="min-w-[fit-content]">
		<Dialog.Header>
			<Dialog.Title>{$t("global_settings")}</Dialog.Title>
		</Dialog.Header>
		<div>
			<Card outline={false} uid="display">
				<Column>
					<CardNew.Root>
						<CardNew.Header>Deployment type</CardNew.Header>
						<CardNew.Content class="switch-group">
							<Switch
								id="deploy-type"
								bind:checked={deployType}
								on:click={(event) => {
									$deploy.type = deployType
										? "automatic"
										: "manual";
									$deploy.proceed =
										$deploy.type === "automatic";
								}}
							/>
							<Label for="deploy-type">
								{$deploy.type === "manual"
									? "Manual"
									: "Automatic (instant)"}
							</Label>
						</CardNew.Content>
					</CardNew.Root>
				</Column>
			</Card>
		</div>

		<Dialog.Header>
			<Dialog.Title>{$t("global_settings")}</Dialog.Title>
		</Dialog.Header>
		<div>
			<Card>
				<Column columns={3}>
					<!-- <Column span="1/-1">
						<CardNew.Root>
							<CardNew.Header
								class="switch-group justify-between"
							>
								<Label for="card_size">Layout</Label>
							</CardNew.Header>
							<CardNew.Content>
								<Select.Root
									onSelectedChange={(event) => {
										global.overlay.layout = event.value;
										dispatch("global");
									}}
								>
									<Select.Trigger class="w-[180px]">
										<Select.Value placeholder="Size" />
									</Select.Trigger>
									<Select.Content>
										{#each ["ttb", "btt"] as layout}
											<Select.Item value={layout}
												>{layout}</Select.Item
											>
										{/each}
									</Select.Content>
								</Select.Root>
							</CardNew.Content>
						</CardNew.Root>
					</Column> -->

					{#each Object.keys(global).filter((key) => !["deploy", "websocket", "overlay", "card_size"].includes(key)) as name}
						<CardNew.Root>
							<CardNew.Header
								class="switch-group justify-between"
							>
								<div class="flex flex-row gap-1 items-center">
									{#if ["clicks", "credits", "agendas"].includes(name)}
										<!-- svelte-ignore a11y-missing-attribute -->
										<img
											class="w-6 h-6 fill-white"
											src={icons[name]}
										/>
									{/if}
									<Label for="deploy-type">
										{$t(name)}
									</Label>
								</div>
								<Switch
									id="deploy-type"
									bind:checked={global[name]}
									on:click={(event) => {
										global[name] = !global[name];
										dispatch("global");
									}}
								/>
							</CardNew.Header>
						</CardNew.Root>
					{/each}

					<CardNew.Root>
						<CardNew.Header class="switch-group justify-between">
							<Label for="opacity">
								{global.overlay.opacity}% opacity</Label
							>
							<Slider
								id="opacity"
								value={[global.overlay.opacity]}
								max={100}
								step={1}
								onValueChange={(event) => {
									// https://www.bits-ui.com/docs/components/slider#component-api
									global.overlay.opacity = event[0];
									dispatch("global");
								}}
							/>
						</CardNew.Header>
					</CardNew.Root>

					<CardNew.Root class="col-[auto/span_2]">
						<CardNew.Header class="switch-group justify-between">
							<Label for="commentators">Commentators</Label>
						</CardNew.Header>
						<CardNew.Content>
							<Input
								id="commentators"
								bind:value={global.overlay.commentators}
								type="text"
								placeholder="Metropole Grid, Neon Static, etc."
								class="max-w-xs"
								on:input={(e) => {
									dispatch("global");
								}}
							/>
						</CardNew.Content>
					</CardNew.Root>

					<!-- <CardNew.Root>
						<CardNew.Header class="switch-group justify-between">
							<Label for="card_size">Card size</Label>
						</CardNew.Header>
						<CardNew.Content>
							<Select.Root
								onSelectedChange={(event) => {
									global.card_size = event.value;
									dispatch("global");
								}}
							>
								<Select.Trigger class="w-[180px]">
									<Select.Value placeholder="Size" />
								</Select.Trigger>
								<Select.Content>
									{#each ["Small", "Medium", "Large"] as size}
										<Select.Item value={size.toLowerCase()}
											>{size}</Select.Item
										>
									{/each}
								</Select.Content>
							</Select.Root>
						</CardNew.Content>
					</CardNew.Root> -->
				</Column>
			</Card>
		</div>
	</Dialog.Content>
</Dialog.Root>
