
const path = require('path');
const os = require('os');

let iconFile;
const platform = os.platform();

if (platform === 'darwin') {
    iconFile = path.resolve(__dirname, 'src/icons/mac/icon.icns');
} else if (platform === 'win32') {
    iconFile = path.resolve(__dirname, 'src/icons/win/icon.ico');
}

module.exports = {
    packagerConfig: {
        appCopyright: 'Copyright (c) 2016, MIT',
        icon: iconFile,
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'ScratchJr',
                iconUrl: path.resolve(__dirname, 'src/icons/win/icon.ico'),
                setupIcon: path.resolve(__dirname, 'src/icons/win/icon.ico'),
            },
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin'],
        },
        {
            name: '@electron-forge/maker-deb',
            config: {},
        },
    ],
    hooks: {
        generateAssets: async () => {
            const { build } = require('esbuild');
            await build({
                entryPoints: ['./src/app/appEntry.js'],
                bundle: true,
                outfile: './src/app/appEntry.bundle.js',
                platform: 'browser',
                target: ['chrome130'],
                sourcemap: true,
            });
            console.log('esbuild: renderer bundle generated'); // eslint-disable-line no-console
        },
    },
};
