// Inside vue.config.js
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/anyform/' : '/',
    pwa: {
            name: 'anyform',
        //     themeColor: '#4DBA87',
        //     msTileColor: '#000000',
        //     appleMobileWebAppCapable: 'yes',
        //     appleMobileWebAppStatusBarStyle: 'black',

        // manifestOptions: {
        //     start_url: './dist/'
        // },

        // manifestPath: './dist/manifest.json',
    }
}