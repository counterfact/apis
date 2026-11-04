/**
 * References an environment variable of type 'auth_connection' by label.
 * At runtime, resolves to the auth connection for the current environment,
 * falling back to the default environment.
 */
export type EnvironmentAuthConnectionLocator = { env_var_label: string };
