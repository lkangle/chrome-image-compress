import AsyncQueue from '@/common/AsyncQueue'
import { getAppConfig, type AppConfig } from '@/common/config'
import { buildArray, randomStr, sleep } from '@/common/index'
import { Notice, ShrinkInfo } from '@/common/Notification'
import { addIpcListener } from '@/common/web-ipc'
import type { DownImageInput, ShrinkNotice } from '@/types'
import { SHRINK_STATUS } from '@/types'
import { imageCompress } from '@/zimage'
import { saveAs } from 'file-saver'
import type { PlasmoCSConfig } from 'plasmo'

import { extractImages, zipPack } from './zip-util'

export const config: PlasmoCSConfig = {
    matches: ['<all_urls>'],
    run_at: 'document_idle',
    css: ['./style.less'],
}

const normalizeName = (name: string): string => {
    return name.replace(/[ /]+/g, '_').toLocaleLowerCase()
}

const bindSendMessage = (groupId: string) => {
    return (
        message: Omit<ShrinkNotice, 'code' | 'groupId'> | string,
        code = SHRINK_STATUS.LOADING,
    ) => {
        let o: any = message
        if (typeof message === 'string') {
            o = { content: message }
        }

        Notice.emit({ ...o, groupId, code })
    }
}

// 图片压缩任务回调
async function shrinkTaskCallback(input: DownImageInput, option: AppConfig, isLast: boolean) {
    const sendMessage = bindSendMessage(randomStr(8))
    const { uploadType, enable } = option || {}

    let resInfo: ShrinkInfo
    // 不上传，就用来保存要下载的文件信息
    let fileInfo: any
    try {
        const { filename, blob, group } = input
        if (blob.size <= 0) {
            return console.warn('无效的blob...', filename)
        }

        sendMessage('开始处理...')
        await sleep(100)

        let file = new File([blob], filename, { type: blob.type })

        if (enable) {
            const result: any = await imageCompress(file, option, group)
            file = result.outFile

            resInfo = ShrinkInfo.from(result)

            // 展示下压缩后的结果
            sendMessage('压缩完成')
            await sleep(200)
            sendMessage(resInfo.toHtml())
        }

        // TODO: 这里根据配置回去上传服务
        const upload: any = () => {}

        // 需要上传
        if (uploadType) {
            sendMessage('开始上传...')
            try {
                const res = await upload(file)
                sendMessage({
                    content: '上传完成',
                    info: {
                        isYunLu: true,
                        uploadImages: buildArray(res),
                    },
                })
            } catch (error) {
                sendMessage({
                    content: '上传失败,即将下载...',
                    error: error?.message || error,
                })
                fileInfo = { file, filename }
            }
        } else {
            fileInfo = { file, filename }
            sendMessage('即将下载...')
        }
    } catch (error) {
        sendMessage(
            { content: isLast ? '异常，直接下载...' : '等待重试...', error },
            SHRINK_STATUS.ERROR,
        )
        throw error
    }

    await sleep(200)
    sendMessage(resInfo?.toHtml() || '处理完成', SHRINK_STATUS.DONE)
    return fileInfo
}

{
    const qu = new AsyncQueue(shrinkTaskCallback).setMax(6)
    addIpcListener('__DOWNLOAD_IMAGE__', async (input: DownImageInput) => {
        const opt = await getAppConfig()
        console.log('%c[ZImage]', 'color:#2878ff;', 'download', input)

        const inputList = await extractImages(input)
        const isZip = inputList.length > 1

        const resultList = (
            await Promise.all(
                inputList.map((it) => {
                    it.filename = normalizeName(it.filename)

                    return qu.emit(it, opt).catch(() => {
                        return { file: it.blob, ...it }
                    })
                }),
            )
        ).filter(Boolean)

        if (resultList.length <= 0) {
            return
        }

        // 保留原zip格式
        if (isZip) {
            const blob = await zipPack(resultList)
            saveAs(blob, input.filename)
        } else {
            resultList.forEach((f) => {
                saveAs(f.file, f.filename)
            })
        }
    })
}

console.log('runtime loaded...')