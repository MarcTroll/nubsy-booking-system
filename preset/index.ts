import type {NitroContext, NitroPreset} from '@nuxt/nitro'

const preset: NitroPreset = {
    entry: 'server/entry',
    externals: true,
    serveStatic: true,
    hooks: {
        'nitro:compiled' ({ output }: NitroContext) {
            console.log('Ready to run "node ' + output.serverDir + '/index.mjs"')
        }
    }
}

export default preset