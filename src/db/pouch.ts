import PouchDB from "pouchdb-browser";
import type { AnyDoc, PersonDoc, TaskDoc } from "./types";
import {useEffect, useState} from "react";

export const db = new PouchDB<AnyDoc>("local-db");

// ⚠️ Включи это если нужен sync с CouchDB
const REMOTE = "http://admin:admin@localhost:5984/example-db";

db.sync(REMOTE, {
    live: true,
    retry: true,
}).on("change", (info:any) => console.log("sync change", info))
    .on("error", (err :any)=> console.error("sync error", err));


// ===== CRUD Helpers =====

export function createPerson(name: string): Promise<PersonDoc> {
    const doc: PersonDoc = {
        _id: `person:${crypto.randomUUID()}`,
        type: "person",
        name,
        tasks: [],
    };
    return db.put(doc).then(() => doc);
}

export function createTask(name: string): Promise<TaskDoc> {
    const doc: TaskDoc = {
        _id: `task:${crypto.randomUUID()}`,
        type: "task",
        name,
    };
    return db.put(doc).then(() => doc);
}

export async function addTaskToPerson(personId: string, taskId: string) {
    const person = await db.get<PersonDoc>(personId);
    person.tasks.push(taskId);
    return db.put(person);
}

export function useLiveQuery<T extends AnyDoc>(query: (docs: T[]) => T[]) {
    const [data, setData] = useState<T[]>([]);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            const res = await db.allDocs({ include_docs: true });
            const docs = res.rows.map((r:any) => r.doc!) as T[];
            if (!cancelled) setData(query(docs));
        };

        load();
        const changes = db
            .changes({ live: true, include_docs: true })
            .on("change", load);

        return () => {
            cancelled = true;
            changes.cancel();
        };
    }, []);

    return data;
}
