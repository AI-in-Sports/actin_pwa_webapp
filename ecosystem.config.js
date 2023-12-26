module.exports = {
    apps: [
        {
            name: 'Actin PWA',
            port: '3000',
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs'
        }
    ]
}
