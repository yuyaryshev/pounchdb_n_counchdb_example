import React from 'react'
import { createRoot } from 'react-dom/client'
import { Persons } from "./components/Persons.js";
import { Tasks } from "./components/Tasks.js";

// import { theme } from './theme.js'
// import { router } from './router.js'
// import { addTestData } from './app_odb/addTestData.js'

// // @ts-ignore
// window.store = client.localChangesLayer

const app = document.getElementById('app')!
const root = createRoot(app)

root.render(
    <React.StrictMode>
        <div style={{ display: "flex", gap: 40 }}>
            Hello App
            <Persons />
            <Tasks />
        </div>
        {/*<ThemeProvider theme={theme}>*/}
        {/*    <RouterProvider*/}
        {/*        router={router}*/}
        {/*        future={*/}
        {/*            {*/}
        {/*                v7_startTransition: true,*/}
        {/*                v7_relativeSplatPath: true,*/}
        {/*                v7_normalizeFormMethod: true,*/}
        {/*                v7_fetcherPersist: true,*/}
        {/*                v7_partialHydration: true,*/}
        {/*                v7_skipActionErrorRevalidation: true,*/}
        {/*            } as any*/}
        {/*        }*/}
        {/*    />*/}
        {/*</ThemeProvider>*/}
    </React.StrictMode>
)

/*

        <div>
            --- CODE00000000{' '}
            {
                // @ts-ignore
                'odbp_bundle/packages/ui/' + import.meta.url.split('?')[0].split('/').slice(3).join('/')
            }
            ---
        </div>
        <App />

*/

