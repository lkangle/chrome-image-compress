import { ZipIcon } from "@/common/icons"
import MemoryDraggable from "./MemoryDraggable"
import { Drawer } from "antd"
import { useMemoizedFn, useSafeState } from "ahooks"
import useClickOuter from "@/hooks/useClickOuter"
import useRootContext from "@/hooks/context"
import InfiniteScroll from "./InfiniteScroll"
import useImages from "@/hooks/useImages"

const topBound = 150 - window.innerHeight

function WebUIEntry() {
    const { rootContainer, shadowElement } = useRootContext()

    const [isOpen, setIsOpen] = useSafeState(false)
    const hideDrawer = useMemoizedFn(() => setIsOpen(false))
    useClickOuter(hideDrawer, shadowElement)

    const imgParams = useImages(hideDrawer)

    return (
        <>
            <MemoryDraggable onHoverWait={() => setIsOpen(true)} axis="y" bounds={{ top: topBound, bottom: 0 }}>
                <div className="fixed bottom-40 right-0 cursor-progress">
                    <div className="float-btn w-30 h-26 flex items-center translate-x-4 opacity-40 hover:opacity-100 hover:translate-x-2">
                        <div className="ml-8 w-13 h-13 font-bold text-white">
                            <ZipIcon />
                        </div>
                    </div>
                </div>
            </MemoryDraggable>

            <Drawer
                title="图片列表"
                open={isOpen}
                onClose={hideDrawer}
                mask={false}
                getContainer={rootContainer}
                destroyOnClose
                width={285}
                placement="right"
            >
                <InfiniteScroll {...imgParams}>
                    {(list) =>
                        list.map((item) => <div key={item.id} />)
                    }
                </InfiniteScroll>
            </Drawer>
        </>
    )
}

export default WebUIEntry
