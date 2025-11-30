export interface BaseDoc {
    _id: string;
    _rev?: string;
    name: string;
    type: "person" | "task";
}

// Сущности
export interface PersonDoc extends BaseDoc {
    type: "person";
    tasks: string[]; // id задач
}

export interface TaskDoc extends BaseDoc {
    type: "task";
}

export type AnyDoc = PersonDoc | TaskDoc;
