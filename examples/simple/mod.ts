import 'dotenv';
import { createBot, GatewayIntents } from 'discordeno';
import { startBot, loadControllers, container, MetadataKeys } from 'beyondjs';
import { enableCachePlugin, enableCacheSweepers } from '@discordeno/cache';
import { CommonController } from './common/Common.controller.ts';

const bot = enableCachePlugin(
  createBot({
    botId: BigInt(Deno.env.get('CLIENT_ID')!),
    intents: GatewayIntents.Guilds | GatewayIntents.GuildMembers,
    token: Deno.env.get('TOKEN')!
  })
);

enableCacheSweepers(bot);

export const BotClient = container.makeInjector(bot, MetadataKeys.Command);

loadControllers(bot, CommonController);
await startBot(bot);
