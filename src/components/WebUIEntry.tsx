import { ZipIcon } from "@/icons"
import MemoryDraggable from "./MemoryDraggable"
import { Drawer } from "antd"
import { useSafeState } from "ahooks"
import useClickOuter from "@/hooks/useClickOuter"
import useRootContext from "@/hooks/context"

const topBound = 150 - window.innerHeight

function WebUIEntry() {
    const { rootContainer, shadowElement } = useRootContext()

    const [isOpen, setIsOpen] = useSafeState(false)

    useClickOuter(() => setIsOpen(false), shadowElement)

    return (
        <>
            <MemoryDraggable onWait={() => setIsOpen(true)} axis="y" bounds={{ top: topBound, bottom: 0 }}>
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
                onClose={() => setIsOpen(false)}
                mask={false}
                getContainer={rootContainer}
                destroyOnClose
                width={280}
                placement="right"
            >
                这是侧边栏
            </Drawer>
        </>
    )
}

export default WebUIEntry
