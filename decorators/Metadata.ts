// deno-lint-ignore-file no-explicit-any
import { deepmerge } from 'https://deno.land/x/deepmergets@v4.1.0/dist/deno/index.ts';
import { getMetadata, defineMetadata } from './mod.ts';

export enum MetadataKeys {
  Controller = 'a',
  Command = 'b',
  Listener = 'c',
  SubGroupRoot = 'd',
  CommandRoot = 'e'
}

export const setClassMetadata =
  <T>(metaKey: string, value: ((target: any) => T) | T) =>
  (target: any) => {
    const res = value instanceof Function ? value(target) : value;
    defineMetadata(metaKey, deepmerge(getMetadata<T>(metaKey, target), res), target);
  };

export const setMethodMetadata =
  <T>(metaKey: string, value: ((target: any, key: string) => T) | T) =>
  (target: any, key: string) => {
    const res = value instanceof Function ? value(target, key) : value;
    defineMetadata(metaKey, deepmerge(getMetadata<T>(metaKey, target, key), res), target, key);
  };

export const setParameterMetadata =
  <T>(metaKey: string, value: ((target: any, key: string, index: number) => T) | T) =>
  (target: any, key: string, index: number) => {
    const res = value instanceof Function ? value(target, key, index) : value;
    defineMetadata(metaKey, deepmerge(getMetadata<T>(metaKey, target, key), res), target, key);
  };
