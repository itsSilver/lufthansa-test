const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

// @expo/cli pulls in expo-router, which otherwise blocks react-navigation imports
process.env.EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK = '1';

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './src/global.css' });
