import path from 'node:path'
import { defineConfig } from 'vite'
import pluginReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const EMPTY_IMPORT = path.resolve(`./empty_import.js`)
export default defineConfig({
    plugins: [
        pluginReact(),
        tsconfigPaths({
            configFile: 'tsconfig_vite.json', // specify tsconfig file
        } as any),
        nodePolyfills({
            include: ['path', 'stream'],
            exclude: ['fs'],
            overrides: {},
            protocolImports: true,
        }),
    ],
    resolve: {
        alias: {
            '~': path.resolve(),
            'node:fs': EMPTY_IMPORT,
            fs: EMPTY_IMPORT,
        },
    },
})
