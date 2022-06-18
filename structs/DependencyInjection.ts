import { getMetadata, setParameterMetadata } from '../decorators/mod.ts';
import { Collection } from 'discordeno';
import { Constructable } from '../types/mod.ts';

class Container {
  private register = new Collection<string, Constructable>();
  private cache = new Collection<string, unknown>();
  private values = new Collection<symbol, unknown>();

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

  makeInjector(value: unknown, context: string) {
    const sym = Symbol();

    this.values.set(sym, value);
    return setParameterMetadata(context, (target, key, index) => {
      const params = getMetadata<{ params?: unknown[] }>(context, target, key)?.params ?? [];
      params[index] = value;
      return { params };
    });
  }
}
export const container = new Container();

export const Service = () => (target: Constructable) => container.add(target);
