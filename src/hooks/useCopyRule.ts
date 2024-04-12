import { storage } from '@/common/storage'
import type { CdnImage, UnionImage } from '@/types'

export interface ICopyRule {
    format: string
    doubleMode: 'media' | 'imageset' | 'custom'
    doubleFormat: string
}

export const getCopyRule = async (): Promise<ICopyRule> => {
    return storage.getItem<any>('copy_settings').then((d) => d || { doubleMode: 'media' })
}

const baseParse = (item: UnionImage, format: string, isDouble = false) => {
    const { width, height, url, xNum = 1 } = item
    const time = Date.now()
    const uo = new URL(url)
    let replaceList = [
        ['{time}', '{t}', time],
        ['{url}', url],
        ['{nurl}', `//${uo.host}${uo.pathname}${uo.search}`],
    ]

    const bw = Math.round(width / xNum)
    const bh = Math.round(height / xNum)

    if (!isDouble) {
        replaceList = replaceList.concat([
            ['{protocol}', '{pt}', uo.protocol],
            ['{host}', '{H}', uo.host],
            ['{path}', '{P}', uo.pathname + uo.search],
            ['{width}', '{w}', width],
            ['{height}', '{h}', height],
            ['{bw}', bw],
            ['{bh}', bh],
        ])
    } else {
        const u2 = new URL(item.img2x.url)
        replaceList = replaceList.concat([
            ['{2xurl}', item.img2x.url],
            ['{2xnurl}', `//${u2.host}${u2.pathname}${u2.search}`],
        ])
    }

    let text = format
    replaceList.forEach((it: string[]) => {
        const value = it.at(-1)
        it.slice(0, -1).forEach((key) => {
            text = text.replaceAll(key, value)
        })
    })

    return text
}

function useCopyRule() {
    const parse = async (item: CdnImage) => {
        const rule = await getCopyRule()

        const format = rule.format
        if (format) {
            return baseParse(item as any, format)
        }

        return item.url
    }

    const parseGroup = async (item: UnionImage) => {
        if (!item.img2x?.url) {
            return parse(item)
        }
        const rule = await getCopyRule()

        if (rule.doubleMode === 'custom' && !!rule.doubleFormat) {
            return baseParse(item, rule.doubleFormat, true)
        }

        if (rule.doubleMode === 'imageset') {
            const css = `background: no-repeat top center / contain image-set(
    url("${item.img2x.url}") 2x,
    url("${item.url}") 3x
);`
            return css
        }

        const css = `background: no-repeat top center / contain url("${item.img2x.url}");
@media only screen and (min-resolution: 3dppx) {
    background-image: url("${item.url}");
}`
        return css
    }

    return {
        parse,
        parseGroup,
    }
}

export default useCopyRule
