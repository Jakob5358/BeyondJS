import { Command, Listener } from '../decorators/mod.ts';

export interface Cog {
  name: string;
  commands: Command[];
  listeners: Listener[];
}
