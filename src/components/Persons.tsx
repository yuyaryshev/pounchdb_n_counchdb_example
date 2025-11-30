import { useState } from "react";
import { createPerson, useLiveQuery } from "../db/pouch.js";
import type { PersonDoc } from "../db/types";

export function Persons() {
    const persons = useLiveQuery<PersonDoc>(docs => docs.filter(d => d.type === "person"));
    const [name, setName] = useState("");

    return (
        <div>
            <h2>Persons</h2>

            <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Name"
            />
            <button onClick={() => { createPerson(name); setName(""); }}>
                Add Person
            </button>

            <ul>
                {persons.map(p => (
                    <li key={p._id}>
                        {p.name} — Tasks: {p.tasks.length}
                    </li>
                ))}
            </ul>
        </div>
    );
}
