import { ZipIcon } from '@/common/icons'
import useRootContext from '@/hooks/context'
import useClickOuter from '@/hooks/useClickOuter'
import useImages from '@/hooks/useImages'
import { useMemoizedFn, useSafeState } from 'ahooks'
import { Drawer } from 'antd'

import ImageItem from './ImageItem'
import InfiniteScroll from './InfiniteScroll'
import MoDraggable from './MoDraggable'

const topBound = 150 - window.innerHeight

function WebUIEntry() {
    const { rootContainer, shadowElement } = useRootContext()

    const [isOpen, setIsOpen] = useSafeState(false)
    const hideDrawer = useMemoizedFn(() => setIsOpen(false))
    const showDrawer = useMemoizedFn(() => setIsOpen(true))
    useClickOuter(hideDrawer, shadowElement)

    const imgParams = useImages(showDrawer)

    return (
        <>
            <MoDraggable onHoverWait={showDrawer} axis="y" bounds={{ top: topBound, bottom: 0 }}>
                <div className="fixed bottom-40 right-0 cursor-progress">
                    <div className="float-btn w-30 h-26 flex items-center translate-x-4 opacity-40 hover:opacity-100 hover:translate-x-2">
                        <div className="ml-8 w-13 h-13 font-bold text-white">
                            <ZipIcon />
                        </div>
                    </div>
                </div>
            </MoDraggable>

            <Drawer
                title="图片列表"
                open={isOpen}
                onClose={hideDrawer}
                mask={false}
                getContainer={rootContainer}
                destroyOnClose
                width={285}
                placement="right"
                styles={{
                    body: {
                        padding: '16px 0',
                    },
                }}>
                <InfiniteScroll {...imgParams}>
                    {(list) => list.map((item) => <ImageItem item={item} key={item.id} />)}
                </InfiniteScroll>
            </Drawer>
        </>
    )
}

export default WebUIEntry
