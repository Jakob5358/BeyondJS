// deno-lint-ignore-file no-explicit-any

export type Constructable<T = any> = new (...args: any[]) => T;
