import { ZipIcon } from '@/common/icons'
import useRootContext from '@/hooks/context'
import useClickOuter from '@/hooks/useClickOuter'
import useImages from '@/hooks/useImages'
import { useMemoizedFn, useSafeState } from 'ahooks'
import { Drawer } from 'antd'

import ImageItem from '../image-item'
import InfiniteScroll from '../infinite-scroll'
import MoDraggable from '../mo-draggable'
import Footer from './footer'
import Title from './title'

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
                    <div className="float-btn flex h-26 w-30 translate-x-4 items-center opacity-40 hover:translate-x-2 hover:opacity-100">
                        <div className="ml-8 h-13 w-13 font-bold text-white">
                            <ZipIcon />
                        </div>
                    </div>
                </div>
            </MoDraggable>

            <Drawer
                title={<Title />}
                footer={<Footer />}
                open={isOpen}
                onClose={hideDrawer}
                mask={false}
                getContainer={rootContainer}
                destroyOnClose
                width={280}
                placement="right"
                styles={{
                    body: {
                        padding: '14px 0',
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
