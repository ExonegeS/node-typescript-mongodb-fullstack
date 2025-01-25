const getEnv = (key: string, defaultValue?: string):string => {
    const value = process.env[key] || defaultValue;

    if (value == undefined) {
        throw new Error(`Missing environment variable ${key}`)
    }

    return value
}

export const MONGO_URI = getEnv("MONGO_URI")

export const NODE_ENV = getEnv("NODE_ENV", "development")
export const PORT = getEnv("BACKEND_PORT", "4004")
export const APP_ORIGIN = getEnv("APP_ORIGIN", "localhost:5500")
export const BACK_ORIGIN = getEnv("BACK_ORIGIN")
export const JWT_SECRET = getEnv("JWT_SECRET")
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET")
