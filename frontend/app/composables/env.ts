export const useEnv = () => {
  const config = useRuntimeConfig();
  return {
    api: config.public.api,
    ENV_BASE: config.public.URL
  };
};