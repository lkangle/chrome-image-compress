import { randomStr } from '@/common'
import { addUploadedListener } from '@/common/WebIpc'
import type { CdnImage } from '@/types'
import { each } from 'lodash-es'
import { useEffect, useState } from 'react'

function useUploadObserve(observeFn: VoidFunction): CdnImage[] {
    // 图片列表
    const [images, setImages] = useState([])

    // 监听图片上传完成事件，给数据
    useEffect(() => {
        const removeListener = addUploadedListener((info) => {
            each(info?.images, (img) => {
                if (!img.id) {
                    img.id = randomStr(5)
                }
                if (img) {
                    setImages((prev) => [img, ...prev])
                    observeFn()
                }
            })
        })
        return removeListener
    }, [observeFn])

    return images
}

export default useUploadObserve
