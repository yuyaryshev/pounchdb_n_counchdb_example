import React from "react";

import { Persons } from "./components/Persons.js";
import { Tasks } from "./components/Tasks.js";

export default function App() {
    return (
        <div style={{ display: "flex", gap: 40 }}>
            <Persons />
            <Tasks />
        </div>
    );
}
