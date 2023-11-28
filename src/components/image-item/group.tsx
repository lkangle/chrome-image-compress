import useAdvCopyEnable from '@/hooks/useAdvCopyEnable'
import useCopyRule from '@/hooks/useCopyRule'
import type { CdnImage, UnionImage } from '@/types'
import { DownloadOutlined, LinkOutlined } from '@ant-design/icons'
import { Flex } from 'antd'

import SingleItem, { copy, save } from './item'

interface IProps {
    item: UnionImage
}

function GroupImageItem({ item }: IProps) {
    const enablePro = useAdvCopyEnable((stat) => stat.enable)

    const { parse, parseGroup } = useCopyRule()

    const onCopy = async (it: CdnImage) => {
        if (!enablePro) {
            return copy(it.url)
        }

        const txt = await parse(it)
        copy(txt)
    }

    const onGroupCopy = async () => {
        const txt = await parseGroup(item)
        copy(txt)
    }

    return (
        <div className="group-item relative flex w-full items-center justify-between">
            <SingleItem mask={false} item={item} />
            <SingleItem mask={false} item={item.img2x} />

            <div className="z-mask absolute left-0 top-0 flex h-120 w-full select-none justify-center rounded-[12px] bg-[rgba(0,0,0,0.5)] text-[#565656]">
                <div title="3x" className="absolute bottom-8 left-8">
                    <div className="text-center text-[15px] text-[#fff]">3x</div>
                    <Flex gap={6} align="flex-end">
                        <div onClick={() => save(item)} className="z-icon h-20 w-20">
                            <DownloadOutlined />
                        </div>
                        <div onClick={() => onCopy(item)} className="z-icon h-23 w-23">
                            <LinkOutlined />
                        </div>
                    </Flex>
                </div>
                <div className="link-icon mt-28 h-60 w-60" onClick={onGroupCopy}>
                    <div className="flex items-center justify-center text-[20px]">
                        <LinkOutlined />
                    </div>
                </div>
                <div title="2x" className="absolute bottom-8 right-8">
                    <div className="text-center text-[15px] text-[#fff]">2x</div>
                    <Flex gap={6} align="flex-end">
                        <div onClick={() => onCopy(item.img2x)} className="z-icon h-23 w-23">
                            <LinkOutlined />
                        </div>
                        <div onClick={() => save(item.img2x)} className="z-icon h-20 w-20">
                            <DownloadOutlined />
                        </div>
                    </Flex>
                </div>
            </div>
        </div>
    )
}

export default GroupImageItem
