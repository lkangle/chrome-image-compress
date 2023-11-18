import { DownloadOutlined, LinkOutlined } from "@ant-design/icons"
import SingleItem, { copy, save } from "./item"
import type { UnionImage } from "@/types"
import { Flex } from "antd"
import useCopyRule from "@/hooks/useCopyRule"

type IProps = {
    item: UnionImage
}

function GroupImageItem({ item }: IProps) {
    const { parse, parseGroup } = useCopyRule()

    const onCopy = (url: string) => {
        copy(parse(url))
    }

    const onGroupCopy = () => {
        copy(parseGroup(item))
    }

    return (
        <div className="group-item w-full flex justify-between items-center relative">
            <SingleItem mask={false} item={item} />
            <SingleItem mask={false} item={item.img2x} />

            <div className="z-mask h-120 flex justify-center rounded-[12px] text-[#565656] bg-[rgba(0,0,0,0.5)] absolute top-0 left-0 w-full select-none">
                <div title="3x" className="absolute bottom-8 left-8">
                    <div className="text-center text-[15px] text-[#fff]">3x</div>
                    <Flex gap={6} align="flex-end">
                        <div onClick={() => save(item)} className="z-icon w-20 h-20">
                            <DownloadOutlined />
                        </div>
                        <div onClick={() => onCopy(item.url)} className="z-icon w-23 h-23">
                            <LinkOutlined />
                        </div>
                    </Flex>
                </div>
                <div className="link-icon w-60 h-60 mt-28" onClick={onGroupCopy}>
                    <div className="text-[20px] flex items-center justify-center">
                        <LinkOutlined />
                    </div>
                </div>
                <div title="2x" className="absolute bottom-8 right-8">
                    <div className="text-center text-[15px] text-[#fff]">2x</div>
                    <Flex gap={6} align="flex-end">
                        <div onClick={() => onCopy(item.img2x.url)} className="z-icon w-23 h-23">
                            <LinkOutlined />
                        </div>
                        <div onClick={() => save(item.img2x)} className="z-icon w-20 h-20">
                            <DownloadOutlined />
                        </div>
                    </Flex>
                </div>
            </div>
        </div>
    )
}

export default GroupImageItem