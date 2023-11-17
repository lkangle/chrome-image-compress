import { storage } from "./storage"

const S_KEY = "z-image-appconfig"
const CDN_KEY = "z-image-cdnconfig"

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


// -------- 图床cdn配置 --------

// 不指定type则获取全部
export async function getCdnConfig(type?: string): Promise<any> {
    let c = await storage.getItem(CDN_KEY)

    if (type && c?.[type]) {
        return c[type]
    }
    return c
}

export async function setCdnConfig(config: any) {
    storage.setItem(CDN_KEY, config)
}

export async function setSingleCdnConfig(type: string, value: string) {
    let config = await getCdnConfig()

    let newConfig = Object.assign({}, config, {
        [type]: value
    })
    await setCdnConfig(newConfig)
}