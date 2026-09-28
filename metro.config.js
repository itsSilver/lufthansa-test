const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

// expo-router is still installed as a dependency of @expo/cli, which makes Expo block react-navigation imports
process.env.EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK = '1';

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './src/global.css' });
