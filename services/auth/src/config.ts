//Goal is to create a config object that contains the necessary configuration for the auth service,
// including the port and database connection details.
// The required function is used to ensure that certain environment variables are set,
// throwing an error if they are missing.

function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const config = {
    port: Number(process.env.AUTH_PORT ?? 3001),
    db: {
        host: required("AUTH_DB_HOST"),
        port: Number(process.env.AUTH_DB_PORT ?? 5432),
        database: required("AUTH_DB_NAME"),
        user: required("AUTH_DB_USER"),
        password: required("AUTH_DB_PASSWORD"),
    },
};
