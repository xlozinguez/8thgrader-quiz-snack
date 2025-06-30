const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable web platform
config.resolver.platforms = ['web', 'ios', 'android', 'native'];

module.exports = config;