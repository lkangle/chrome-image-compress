import { Empty, Spin } from 'antd'
import { debounce, isEmpty } from 'lodash-es'
import React, { useCallback, useState } from 'react'
import RcInfiniteScroll from 'react-infinite-scroll-component'

interface Props<T> {
    children: (list: T[]) => React.ReactNode
    data: T[]
    loading: boolean
    error: Error | null
    loadMore: (page?: number) => Promise<any[]>
}

function InfiniteScroll<T>({ data, children, loadMore, error, loading }: Props<T>) {
    // 是否还有更多
    const [hasMore, setHasMore] = useState(true)
    // 数据
    // 获取下一页数据
    const fetchNextPage = useCallback(async () => {
        const list = await loadMore()
        if (isEmpty(list)) {
            setHasMore(false)
        }
    }, [loadMore])

    // 错误时刷新图库
    const onErrorRefresh = useCallback(
        debounce(() => loadMore(0), 800, { leading: true, trailing: false }),
        [loadMore],
    )

    return (
        <Spin
            wrapperClassName="pretty-scrollbar h-full overflow-auto px-2"
            spinning={loading}
            tip="刷新中...">
            {isEmpty(data) && <Empty className="mt-88 text-[#919191]" description="暂无图片" />}
            {!isEmpty(data) && !error && (
                <RcInfiniteScroll
                    className="flex h-full flex-wrap justify-between px-10"
                    hasMore={hasMore}
                    next={fetchNextPage}
                    dataLength={data.length}
                    loader={<div className="text-center">加载中...</div>}
                    endMessage={<div className="text-center">我是有底线的</div>}
                    scrollThreshold={0.9}>
                    {children(data)}
                </RcInfiniteScroll>
            )}
            {error && (
                <div
                    onClick={onErrorRefresh}
                    className="mt-10 cursor-pointer px-15 py-10 text-center text-[14px] text-[#9a9a9a] underline">
                    {error?.message || '重新加载'}
                </div>
            )}
        </Spin>
    )
}

export default InfiniteScroll
