const resolveApiBaseUrl = () => {
  return (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    'http://localhost:3000'
  );
};

export const ENV = {
  API_BASE_URL: resolveApiBaseUrl(),
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
} as const;

const validateEnv = () => {
  if (!ENV.API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is required');
  }
};

validateEnv();
