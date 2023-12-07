import { omit } from 'lodash-es'

import { storage } from './storage'

const S_KEY = 'z-image-appconfig'
const CDN_KEY = 'z-image-cdnconfig'

const DEFAULT_CONFIG: any = {
    enable: true,
    quality: 0,
    backend: 0,
    uploadType: false,
}

export interface AppConfig {
    enable: boolean
    // 0-优质   1-一般
    quality: 0 | 1
    // 0-wasm  1-TinyPNG
    backend: 0 | 1
    uploadType: string | false
}

export async function getAppConfig(): Promise<AppConfig> {
    const o = await storage.getItem<AppConfig>(S_KEY)
    return {
        ...DEFAULT_CONFIG,
        ...o,
    }
}

export function setAppConfig(config: AppConfig) {
    storage.setItem(S_KEY, config)
}

// -------- 图床cdn配置 --------

// 不指定type则获取全部
export async function getCdnConfig(type?: string): Promise<any> {
    const c = await storage.getItem(CDN_KEY)

    if (type && c?.[type]) {
        return c[type]
    }
    return c
}

export async function setCdnConfig(config: any) {
    await storage.setItem(CDN_KEY, config)
}

export async function setSingleCdnConfig(type: string, value: any) {
    const config = await getCdnConfig()

    const newConfig = { ...config, [type]: value }
    await setCdnConfig(newConfig)
}

export async function removeCdnConfig(type: string) {
    const o = await getCdnConfig()
    await setCdnConfig(omit(o, type))
}

// ---- tinypng配置 ----

interface TinyPNGConfig {
    token: string
    url: string
}

export async function setTinyConfig(config: TinyPNGConfig) {
    await storage.setItem('z-image-tinyconfig', config)
}

export async function getTinyConfig(): Promise<TinyPNGConfig> {
    const o = await storage.getItem<TinyPNGConfig>('z-image-tinyconfig')

    return {
        url: 'https://api.tinify.com/shrink',
        ...o,
    }
}
