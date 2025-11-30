const unsupportedFunc = function unsupportedFunc() {
    throw new Error(`CODE00400454 @notSupported in browser!`)
}

export const existsSync = unsupportedFunc,
    mkdirSync = unsupportedFunc,
    readFileSync = unsupportedFunc,
    statSync = unsupportedFunc,
    writeFileSync = unsupportedFunc,
    join = unsupportedFunc,
    resolve = unsupportedFunc,
    readdirSync = unsupportedFunc
