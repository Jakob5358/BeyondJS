import 'dotenv';
import { createBot, GatewayIntents } from 'discordeno';
import { startBot, loadControllers } from 'beyondjs';
import { enableCachePlugin, enableCacheSweepers } from '@discordeno/cache';

const bot = enableCachePlugin(
  createBot({
    botId: BigInt(Deno.env.get('CLIENT_ID')!),
    intents: GatewayIntents.Guilds | GatewayIntents.GuildMembers,
    token: Deno.env.get('TOKEN')!
  })
);

enableCacheSweepers(bot);

loadControllers(bot);
await startBot(bot);
