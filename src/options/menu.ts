import { getCdnConfig, getTinyConfig } from '@/common/config'
import { CdnTypes } from '@/common/contants'
import { isArray } from 'lodash-es'
import type React from 'react'

import Aliyun from './forms/aliyun'
import Custom from './forms/custom'
import Qiniu from './forms/qiniu'
import Smms from './forms/smms'
import TinyPng from './forms/tinypng'
import UpYun from './forms/upyun'

interface IMenu {
    key: string
    label: string
    component: React.ComponentType
    loader: () => Promise<any>
}

export const cdnMenuItems = [
    {
        key: 'cdns',
        label: '图床',
        children: [
            {
                key: CdnTypes.SMMS,
                label: 'SM.MS图床',
                component: Smms,
                loader: () => getCdnConfig(CdnTypes.SMMS),
            },
            {
                key: CdnTypes.QINIU,
                label: '七牛图床',
                component: Qiniu,
                loader: () => getCdnConfig(CdnTypes.QINIU),
            },
            {
                key: CdnTypes.UPYUN,
                label: '又拍云图床',
                component: UpYun,
                loader: () => getCdnConfig(CdnTypes.UPYUN),
            },
            {
                key: CdnTypes.ALIYUN,
                label: '阿里云oss',
                component: Aliyun,
                loader: () => getCdnConfig(CdnTypes.ALIYUN),
            },
            {
                key: CdnTypes.CUSTOM,
                label: '自定义web图床',
                component: Custom,
                loader: () => getCdnConfig(CdnTypes.CUSTOM),
            },
        ],
    },
    {
        key: 'tinypng',
        label: 'TinyPNG',
        component: TinyPng,
        loader: () => getTinyConfig(),
    },
]

export function findMenuByKey(key: string): IMenu | undefined {
    const find = <T>(menus: T[]): T => {
        let target: T
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < menus.length; i++) {
            const item: any = menus[i]
            if (item.key === key) {
                target = item
                break
            }

            if (isArray(item.children)) {
                target = find(item.children)
            }
        }

        return target
    }

    return find(cdnMenuItems) as any
}

export function findComponentByKey(key: string): React.ComponentType {
    const target = findMenuByKey(key)
    return target?.component || (() => null)
}
