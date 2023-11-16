import { storage } from "./storage"

const S_KEY = "z-image-appconfig"

const DEFAULT_CONFIG: any = {
    enable: true,
    quality: 0,
    uploadType: '',
}

export interface AppConfig {
    enable: boolean
    quality: 0 | 1
    uploadType: string
}

export async function getAppConfig(): Promise<AppConfig> {
    let o = await storage.getItem<AppConfig>(S_KEY)
    return {
        ...DEFAULT_CONFIG,
        ...o
    }
}

export function setAppConfig(config: AppConfig) {
    storage.setItem(S_KEY, config)
}