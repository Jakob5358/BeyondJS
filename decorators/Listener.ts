import { EventHandlers, Bot } from 'discordeno';
import { setMethodMetadata, MetadataKeys } from './mod.ts';
import { RemoveFirst } from '../types/mod.ts';

type GatewayEvent = keyof EventHandlers;
export type Context<T extends GatewayEvent> = [Bot, ...RemoveFirst<Parameters<EventHandlers[T]>>];

export interface Listener<T extends GatewayEvent = GatewayEvent> {
  event: GatewayEvent;
  once: boolean;
  trigger: (args: Context<T>) => unknown;
}

export const Listener = <T extends GatewayEvent>(event: T, once = false) =>
  setMethodMetadata<Listener<T>>(MetadataKeys.Listener, (target, key) => ({
    event,
    once,
    trigger: target[key]
  }));
