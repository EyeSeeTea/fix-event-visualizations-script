export type Id = string;
export type Ref = { id: Id };
export type NamedRef = { id: Id; name: string };

export type Path = string;
export type Username = string;

export type IndexedById<T> = Record<Id, T>;

export function getId<Obj extends Ref>(obj: Obj): Id {
    return obj.id;
}

export type Code = string;
export type Name = string;

export type Identifiable = Id | Code | Name;
