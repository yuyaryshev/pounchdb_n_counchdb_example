import { useState } from "react";
import { createTask, addTaskToPerson, useLiveQuery } from "../db/pouch.js";
import type { TaskDoc, PersonDoc } from "../db/types";

export function Tasks() {
    const tasks = useLiveQuery<TaskDoc>(docs => docs.filter(d => d.type === "task"));
    const persons = useLiveQuery<PersonDoc>(docs => docs.filter(d => d.type === "person"));

    const [taskName, setTaskName] = useState("");

    return (
        <div>
            <h2>Tasks</h2>

            <input
                value={taskName}
                onChange={e => setTaskName(e.target.value)}
                placeholder="Task name"
            />
            <button onClick={() => { createTask(taskName); setTaskName(""); }}>
                Add Task
            </button>

            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        {task.name}
                        <br />
                        <select
                            onChange={e => addTaskToPerson(e.target.value, task._id)}
                            defaultValue=""
                        >
                            <option value="">Assign to person</option>
                            {persons.map(p => (
                                <option key={p._id} value={p._id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </li>
                ))}
            </ul>
        </div>
    );
}
