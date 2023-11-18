import { imageInfo } from "@/common";
import useCopyRule from "@/hooks/useCopyRule";
import type { CdnImage } from "@/types";
import { DownloadOutlined, LinkOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useMemo } from "react";
import { saveAs } from "file-saver";

interface Props {
    item: CdnImage
    mask?: boolean;
}

export const copy = (text: string) => {
    if (!text) return;
    console.log('%c[Copy Text]', 'color:#3875a9;', text);
    window.navigator.clipboard?.writeText(text).then(() => {
        return message.success('复制成功！');
    });
}

export const save = (item: CdnImage) => {
    const { url, name } = item || {};
    if (!url) return;
    saveAs(url, name)
}

function SingleItem({ item, mask = true }: Props) {
    const img = useMemo(() => imageInfo(item), [item]);

    const { parse } = useCopyRule()

    const onCopy = () => {
        copy(parse(item.url))
    }

    return (
        <div className="w-120 mb-12 rounded-[12px] single-item">
            <div className="w-120 h-120 relative p-4 rounded-[12px] overflow-hidden bg-[#00000019]">
                <div className="h-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${img.url})` }} />
                {mask && (
                    <div className="z-mask text-[#565656] bg-[rgba(0,0,0,0.5)] absolute top-0 left-0 w-full h-full select-none">
                        <div onClick={onCopy} className="link-icon w-60 h-60 absolute left-30 top-30">
                            <div className="text-[20px] flex items-center justify-center">
                                <LinkOutlined />
                            </div>
                        </div>
                        <div onClick={() => save(item)} className="z-icon w-20 h-20 absolute left-8 bottom-8">
                            <DownloadOutlined />
                        </div>
                    </div>
                )}
            </div>
            <div className="pt-2 pb-5 px-5 text-[13px] leading-[18px]">
                <div className="text-[#151515] break-keep whitespace-nowrap overflow-hidden text-ellipsis">{img.name}</div>
                <div className="flex justify-between text-[#919191] text-[12px]">
                    <span>{img.rectTxt}</span>
                    <span>{img.sizeTxt}</span>
                </div>
            </div>
        </div>
    );
}

export default SingleItem