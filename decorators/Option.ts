// deno-lint-ignore-file ban-types

import { setParameterMetadata, MetadataKeys, RawCommand, getMetadata } from './mod.ts';
import { ApplicationCommandOptionTypes } from 'discordeno';

const resolveType = (type?: string) => {
  if (type?.toLowerCase().includes('channel')) return { type: ApplicationCommandOptionTypes.Channel, isMember: false };
  if (type === 'Member') return { type: ApplicationCommandOptionTypes.User, isMember: true };
  return { type: ApplicationCommandOptionTypes[type as keyof typeof ApplicationCommandOptionTypes], isMember: false };
};

export const Option = (name: string, description: string, required = true) =>
  setParameterMetadata<Pick<RawCommand, 'options'>>(MetadataKeys.Command, (target, key, index) => {
    const params = getMetadata<Function[]>('design:paramtypes', target, key);
    if (!params) throw new Error(`No typeinfo found for option at index ${index} on command ${key}`);

    const { type, isMember } = resolveType(params[index].name);

    return { options: [{ name, description, type, isMember, required }] };
  });
