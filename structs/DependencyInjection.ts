import { getMetadata } from 'reflection';
import { Collection } from 'discordeno';
import { Constructable } from '../types/mod.ts';

class Container {
  private register = new Collection<string, Constructable>();
  private cache = new Collection<string, unknown>();

  private resolveDeps(Target: Constructable) {
    const params = getMetadata<Constructable[]>('design:paramtypes', Target) ?? [];
    params.forEach(param => this.resolveDeps(param));

    const res = new Target(...params.map(param => this.cache.get(param.name)));
    this.cache.set(Target.name, res);
    return res;
  }

  resolve<T extends Constructable>(Target: T) {
    const { name } = Target;
    if (this.cache.has(name)) return this.cache.get(name) as InstanceType<T>;

    return this.resolveDeps(Target) as InstanceType<T>;
  }

  add(service: Constructable) {
    this.register.set(service.name, service);
  }
}
export const container = new Container();

export const Service = () => (target: Constructable) => container.add(target);
