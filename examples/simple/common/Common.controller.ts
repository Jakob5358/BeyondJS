import { Listener, Context } from 'beyondjs';

export class CommonController {
  @Listener('ready', true)
  onceReady([_, payload]: Context<'ready'>) {
    console.log(`Logged in as ${payload.user.username}#${payload.user.discriminator}`);
  }
}
