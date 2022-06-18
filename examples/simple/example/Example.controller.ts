import { sendInteractionResponse, InteractionResponseTypes } from 'discordeno';
import type { Interaction, Bot } from 'discordeno';
import { Command } from 'beyondjs';
import { BotClient } from '../mod.ts';

export class ExampleController {
  constructor() {}

  @Command('Replies pong')
  ping(interaction: Interaction, @BotClient() bot: Bot) {
    return sendInteractionResponse(bot, interaction.id, interaction.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource
    });
  }
}
