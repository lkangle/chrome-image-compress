import React, { useCallback, useState } from 'react';
import RcInfiniteScroll from 'react-infinite-scroll-component';
import { debounce, isEmpty } from 'lodash-es';
import { Empty, Spin } from 'antd';

// .show-more {
//     width: 250px;
//     text-align: center;
//     padding-bottom: 5px;
// }

interface Props {
    children: (list: any[]) => React.ReactNode;
    data: any[];
    loading: boolean;
    error: Error | null;
    refresh: VoidFunction;
    loadMore: () => Promise<any[]>;
}

function InfiniteScroll({ data, children, loadMore, error, loading, refresh }: Props) {
    // 是否还有更多
    const [hasMore, setHasMore] = useState(true);
    // 数据
    // 获取下一页数据
    const fetchNextPage = useCallback(async () => {
        const list = await loadMore();
        if (isEmpty(list)) {
            setHasMore(false);
        }
    }, [loadMore]);
    // 刷新图库
    const onRefresh = useCallback(debounce(refresh, 800, { leading: true, trailing: false }), [
        refresh
    ]);

    return (
        <Spin spinning={loading} tip="刷新中...">
            {isEmpty(data) && <Empty className='text-[#919191] mt-88' description="暂无图片" />}
            {!isEmpty(data) && !error && (
                <div className="overflow-auto mx-2 px-5 text-[14px] text-[#919191]">
                    <RcInfiniteScroll
                        className='flex flex-wrap justify-between h-full px-4'
                        hasMore={hasMore}
                        next={fetchNextPage}
                        dataLength={data.length}
                        loader={<div className="text-center">加载中...</div>}
                        endMessage={<div className="text-center">我是有底线的</div>}
                        scrollThreshold={0.9}
                        scrollableTarget="infinite-box"
                    >
                        {children(data)}
                    </RcInfiniteScroll>
                </div>
            )}
            {error && (
                <div onClick={onRefresh} className='text-center text-[14px] text-[#9a9a9a] cursor-pointer underline mt-10 px-15 py-10'>
                    {error?.message || '重新加载'}
                </div>
            )}
        </Spin>
    );
}

export default React.memo(InfiniteScroll);
