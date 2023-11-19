import { sizeToTxt } from '@/common'
import type { XmShrinkResponse } from '@/types'
import { get } from 'lodash-es'

// 压缩后结果信息 toHtml转换为要展示的通知内容
export class ShrinkInfo {
    xmResp: XmShrinkResponse
    private constructor(res) {
        this.xmResp = res
    }

    get shrinkInfo() {
        const shrink = this.xmResp
        if (this.xmResp) {
            return {
                url: get(shrink, 'output.url'),
                originSize: get(shrink, 'input.size', 0),
                size: get(shrink, 'output.size'),
                width: get(shrink, 'output.width'),
                height: get(shrink, 'output.height'),
                ratio: get(shrink, 'output.ratio'),
                type: get(shrink, 'output.type'),
            }
        }
        return null
    }

    toHtml(): string {
        const info = this.shrinkInfo
        const sizeText = `大小: ${sizeToTxt(info.size)}(${sizeToTxt(info.originSize)})
                    ${((1 - info.ratio) * 100).toFixed(1)}%`
        return `
        <div class='shrink-info'>
          <p>尺寸: w:${info.width},h:${info.height}</p>
          <p title='${sizeText}'>${sizeText}</p>
        </div>
    `
    }

    static from(xmResponse: XmShrinkResponse) {
        return new ShrinkInfo(xmResponse)
    }
}
