import { Command } from 'beyondjs';
import { Interaction, sendInteractionResponse, InteractionResponseTypes } from 'discordeno';

export class ExampleController {
  constructor() {}

  @Command('Replies pong')
  ping(interaction: Interaction) {
    return sendInteractionResponse(interaction.bot, interaction.id, interaction.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource
    });
  }
}
