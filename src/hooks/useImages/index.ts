import { getXByName } from '@/common/index'
import { yunluImages } from '@/mock'
import type { CdnImage, UnionImage } from '@/types'
import { concat, find, get, set, sortBy, sum, uniqBy } from 'lodash-es'
import { useMemo, useState } from 'react'

import useUploadObserve from './useUploadObserve'

const flag = '@{%}x'
// TODO: 1x并不会带有@1x..不过也没事，分组也分不到一起
// figma不会下载zip，没法在下载时进行分组，保持这种模式吧
// fn: getXByName

// 几个图片是否是相同比例的，长宽比例标准差在0.01内
const someScale = (images: CdnImage[]) => {
    const rs = images.map((img) => Number((img.width / img.height).toFixed(2)))
    const ave = sum(rs) / rs.length
    const e = Math.sqrt(sum(rs.map((v) => Math.pow(v - ave, 2))) / rs.length)
    return e <= 0.01
}

// 5秒内 认为是同一时间
// 倍数关系正常
const hasAccuracyRelation = (images: CdnImage[]) => {
    const [o1, o2] = images.map((img) => {
        const { width, uploadTime, xNum } = img as any
        const time = uploadTime
        const bw = width / xNum
        return { time, bw }
    })

    const tok = o1.time - o1.time <= 5e3
    if (!tok) {
        return false
    }
    return Math.abs(o1.bw - o2.bw) < 1
}

interface IResult {
    data: UnionImage[]
    loading: boolean
    error: Error | null
    refresh: () => Promise<void>
    loadMore: () => Promise<UnionImage[]>
}

function useImages(showDrawer: VoidFunction): IResult {
    // TODO: 本地数据库中保存的图片
    const [dbImages] = useState(() => yunluImages)
    // 新上传的图片列表
    const uploadImages = useUploadObserve(showDrawer)

    const imageList = useMemo(() => {
        const uniqImages = uniqBy(concat(uploadImages, dbImages), 'url').filter((it) => !!it.url)

        // 对数据进行分组，并保留原顺序
        const keyIndex = {}
        const groupList = []
        uniqImages.forEach((image, index) => {
            set(image, 'oindex', index)
            const name = image.name
            const key = name.replace(/@[23]x/g, flag)
            const xNum = getXByName(name)
            set(image, 'xNum', xNum)
            const idx = groupList.length
            if (keyIndex[key] == null) {
                keyIndex[key] = idx
                groupList[idx] = { key, images: [image] }
            } else {
                const prevIdx = keyIndex[key]
                const { images } = groupList[prevIdx]
                groupList[prevIdx] = { key, images: concat(images, [image]) }
            }
        })

        // 合并后的图片列表
        const unionImages = groupList.reduce((arr, group: { key: string; images: CdnImage[] }) => {
            const { key, images } = group || {}
            const len = images.length
            // 有可能是一图多倍，这里暂且去掉1x的干扰
            if (key.includes(flag) && len === 2) {
                const outs = []
                const x2 = find(images, (img) => get(img, 'xNum') === 2)
                const x3 = find(images, (img) => get(img, 'xNum') === 3)

                // 2x或3x有一个不存在就结束
                if (!x2 || !x3) {
                    outs.push(...images)
                } else {
                    const isSome = someScale([x2, x3])
                    const accuracy = hasAccuracyRelation([x2, x3])
                    // 满足2x和3x的关系，就把2x嵌到3x图中
                    if (isSome && accuracy) {
                        set(x3, 'img2x', x2)
                        set(x3, 'id', x3.id + '_' + x2.id)
                        outs.push(x3)
                    } else {
                        outs.push(...images)
                    }
                }
                return concat(arr, outs.filter(Boolean))
            }

            return concat(arr, images)
        }, [])

        return sortBy(unionImages, 'oindex')
    }, [uploadImages, dbImages])

    return {
        data: imageList,
        loading: false,
        error: null,
        refresh: async () => {},
        loadMore: async () => [],
    }
}

export default useImages
