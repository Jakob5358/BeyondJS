import 'reflection';
import { Service } from '../structs/mod.ts';
import { setClassMetadata, MetadataKeys } from './mod.ts';

export const Controller = (path?: string) =>
  setClassMetadata(MetadataKeys.Controller, target => {
    Service()(target);
    return path;
  });
