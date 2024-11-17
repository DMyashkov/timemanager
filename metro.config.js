const { getDefaultConfig } = require("expo/metro-config");

const config = async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  const { transformer, resolver } = defaultConfig;

  return {
    ...defaultConfig,
    transformer: {
      ...transformer,
      babelTransformerPath: require.resolve(
        "react-native-svg-transformer/expo",
      ),
    },
  };
};

module.exports = config;
