import { imageInfo } from '@/common'
import useAdvCopyEnable from '@/hooks/useAdvCopyEnable'
import useCopyRule from '@/hooks/useCopyRule'
import type { CdnImage } from '@/types'
import { DownloadOutlined, LinkOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { saveAs } from 'file-saver'
import { useMemo } from 'react'

interface Props {
    item: CdnImage
    mask?: boolean
}

export const copy = (text: string) => {
    if (!text) return
    console.log('%c[Copy Text]', 'color:#3875a9;', text)
    window.navigator.clipboard?.writeText(text).then(() => {
        return message.success('复制成功！')
    })
}

export const save = (item: CdnImage) => {
    const { url, name } = item || {}
    if (!url) return
    saveAs(url, name)
}

function SingleItem({ item, mask = true }: Props) {
    const img = useMemo(() => imageInfo(item), [item])

    const enablePro = useAdvCopyEnable((stat) => stat.enable)

    const { parse } = useCopyRule()

    const onCopy = async () => {
        if (!enablePro) {
            return copy(item.url)
        }
        const txt = await parse(item)
        copy(txt)
    }

    return (
        <div className="single-item mb-12 w-120 rounded-[12px] text-[14px] text-[#919191]">
            <div className="relative h-120 w-120 overflow-hidden rounded-[12px] bg-[#00000019] p-4">
                <div
                    className="h-full bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${img.url})` }}
                />
                {mask && (
                    <div className="z-mask absolute left-0 top-0 h-full w-full select-none bg-[rgba(0,0,0,0.5)] text-[#565656]">
                        <div
                            onClick={onCopy}
                            className="link-icon absolute left-30 top-30 h-60 w-60">
                            <div className="flex items-center justify-center text-[20px]">
                                <LinkOutlined />
                            </div>
                        </div>
                        <div
                            onClick={() => save(item)}
                            className="z-icon absolute bottom-8 left-8 h-20 w-20">
                            <DownloadOutlined />
                        </div>
                    </div>
                )}
            </div>
            <div className="px-5 pb-5 pt-2 text-[13px] leading-[18px]">
                <div
                    title={img.name}
                    className="overflow-hidden text-ellipsis whitespace-nowrap break-keep text-[#151515]">
                    {img.name}
                </div>
                <div className="flex justify-between text-[12px] text-[#919191]">
                    <span>{img.rectTxt}</span>
                    <span>{img.sizeTxt}</span>
                </div>
            </div>
        </div>
    )
}

export default SingleItem
