import { useEffect, useState } from 'react';
import { addUploadedListener } from '@/common/WebIpc';
import { randomStr } from '@/common';
import type { CdnImage } from '@/common/types';
import { each } from 'lodash-es';

const toImageData = (info: any): CdnImage => {
    if (!info?.url) return null;
    const id = randomStr(5);
    return {
        ...info,
        id,
        created_at: new Date(info.uploadTime)
    };
};

function useUploadObserve(observeFn: VoidFunction): CdnImage[] {
    // 图片列表
    const [images, setImages] = useState([]);

    // 监听图片上传完成事件，给数据
    useEffect(() => {
        const removeListener = addUploadedListener((info) => {
            each(info?.images, (single) => {
                const img = toImageData(single);
                if (img) {
                    setImages((prev) => [img, ...prev]);
                    observeFn();
                }
            })
        });
        return removeListener;
    }, [observeFn]);

    return images;
}

export default useUploadObserve;
