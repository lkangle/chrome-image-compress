import type { UnionImage } from "@/types"
import GroupImageItem from "./group"
import SingleItem from "./item"

type IProps = {
    item: UnionImage
}

function ImageItem({ item }: IProps) {
    if (!item) {
        return null;
    }
    if (item.img2x) {
        return <GroupImageItem item={item} />
    }
    return <SingleItem item={item} mask />
}

export default ImageItem