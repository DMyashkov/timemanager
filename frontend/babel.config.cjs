module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    sourceType: "unambiguous",
    plugins: [
      "react-native-reanimated/plugin",
      ["inline-import", { extensions: [".sql"] }],
    ],
  };
};
