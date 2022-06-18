import { startBot as startDiscordenoBot, EventHandlers, Collection, ApplicationCommandOptionTypes, Bot } from 'discordeno';
import { Command, Listener, MetadataKeys, Describable, RawCommand, getMetadata } from '../decorators/mod.ts';
import { Cog, Constructable } from '../types/mod.ts';
import { container } from './mod.ts';

const cogs = new Collection<string, Cog>();

export const listCommands = () => cogs.map(cog => cog.commands).flat();

export const mountCog = (cog: Cog) => cogs.set(cog.name, cog);
export const unMountCog = (cog: Cog) => cogs.delete(cog.name);

export const reload = (bot: Bot) => {
  Object.keys(bot.events).forEach(event => (bot.events[event as keyof EventHandlers] = () => 0));

  const allListeners = cogs.map(cog => cog.listeners).flat();
  const events = new Set(allListeners.map(listener => listener.event));

  events.forEach(event => {
    const listeners = allListeners.filter(l => l.event === event);
    if (!listeners.length) return;

    bot.events[event] = (...args: Parameters<EventHandlers[keyof EventHandlers]>) => {
      listeners.forEach(async listener => {
        try {
          await listener.trigger([bot, ...args.slice(1)]);
        } catch (err) {
          console.error('Listener error:', err);
        }
      });
    };
  });
};

export const loadControllers = (bot: Bot, ...controllers: Constructable[]) => {
  controllers.forEach(Controller => {
    const controller = container.resolve(Controller);
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(controller));

    // const prefix = getMetadata<string>(MetadataKeys.Controller, Controller) ?? '';

    const roots = getMetadata<Describable[]>(MetadataKeys.CommandRoot, Controller) ?? [];
    const groups = getMetadata<Describable[]>(MetadataKeys.SubGroupRoot, Controller) ?? [];

    const commands = new Collection<string, Command>();
    const listeners = new Collection<string, Listener>();

    methods.forEach(method => {
      const command = getMetadata<RawCommand>(MetadataKeys.Command, controller, method);
      if (command) {
        if (!command.root) commands.set(command.name, command as Command);
        else {
          const root = roots.find(root => root.name === command.root);
          if (!root) throw new Error('Root not found.');
          const group = groups.find(group => group.name === command.group);

          const cmd = {
            name: command.name,
            description: command.description,
            options: command.options.reverse(),
            run: command.run.bind(controller),
            type: ApplicationCommandOptionTypes.SubCommand
          } as const;

          const previousOptions = commands.find(cmd => cmd.name === root.name)?.options ?? [];

          commands.set(root.name, {
            ...root,
            options: [
              group
                ? {
                    ...group,
                    type: ApplicationCommandOptionTypes.SubCommandGroup,
                    options: [
                      cmd,
                      ...previousOptions.filter(option => option.name === group.name).flatMap(o => o.options ?? [])
                    ]
                  }
                : cmd,
              ...previousOptions.filter(
                option =>
                  [ApplicationCommandOptionTypes.SubCommand, ApplicationCommandOptionTypes.SubCommandGroup].includes(
                    option.type
                  ) && option.name !== group?.name
              )
            ]
          });
        }
      }

      const listener = getMetadata<Listener>(MetadataKeys.Listener, controller, method);
      if (listener) listeners.set(listener.event, { ...listener, trigger: listener.trigger.bind(controller) });
    });

    mountCog({
      name: Controller.name,
      commands: commands.array(),
      listeners: listeners.array()
    });
  });
  reload(bot);
};

export const startBot = async (bot: Bot) => {
  await bot.helpers.upsertApplicationCommands(cogs.map(cog => cog.commands).flat());
  await startDiscordenoBot(bot);
};
