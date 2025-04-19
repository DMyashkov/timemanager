import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const baseConfig = config as ExpoConfig;
  return {
    ...baseConfig,
    extra: {
      ...baseConfig.extra,
      apiUrl: process.env.API_URL,
    },
  };
}; 