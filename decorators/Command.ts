import { setMethodMetadata, setClassMetadata, MetadataKeys } from './mod.ts';
import { ApplicationCommandOption, Interaction } from 'discordeno';

type CommandRun = (interaction: Interaction, ...args: unknown[]) => unknown;

export interface RawCommand {
  name: string;
  description: string;
  options: ApplicationCommandOption[];
  group?: string;
  root?: string;
  run: CommandRun;
}

export type Command = Omit<RawCommand, 'run' | 'options'> & {
  run?: CommandRun;
  options: (Omit<ApplicationCommandOption, 'options'> & {
    run?: CommandRun;
    options: (ApplicationCommandOption & { run?: CommandRun })[];
  })[];
};

export const Command = (description: string) =>
  setMethodMetadata<Command>(MetadataKeys.Command, (target, key) => ({
    name: key.replaceAll('$', ''),
    description,
    options: [],
    run: target[key]
  }));

export type Describable = { name: string; description: string };
export const CommandRoot = (name: string, description: string) =>
  setClassMetadata<Describable[]>(MetadataKeys.CommandRoot, [{ name, description }]);
export const SubGroupRoot = (name: string, description: string) =>
  setClassMetadata<Describable[]>(MetadataKeys.SubGroupRoot, [{ name, description }]);

export const SubCommand = (root: string) => setMethodMetadata<Partial<Command>>(MetadataKeys.Command, { root });
export const SubGroup = (group: string) => setMethodMetadata<Partial<Command>>(MetadataKeys.Command, { group });
