export type ElementOf<Arr> = Arr extends readonly (infer ElementType)[] ? ElementType : never;

export type RemoveFirst<T> = T extends [infer F, ...infer Rest] ? Rest : never;
