// Inside vue.config.js
module.exports = {
    // ...other vue-cli plugin options...
    pwa: {
        name: 'anyform',
        themeColor: '#4DBA87',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',

        manifestOptions: {
            start_url: '/'
        },

        manifestPath: '/manifest.json',
    }
}