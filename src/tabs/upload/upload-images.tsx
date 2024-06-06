import { sizeToTxt } from '@/common'
import { saveAs } from '@/common/save-as'
import type { CdnImage } from '@/types'
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons'
import { useLockFn, useMemoizedFn, useMount } from 'ahooks'
import { message } from 'antd'
import { get, isEmpty } from 'lodash-es'
import React, { useMemo, useState } from 'react'

import useFiles, { emitShrinkUpload, type IFileItem } from './useUploadFiles'

const keepOrigin = (uf) => uf?.upload === 1

const hasHttpUrl = (result: CdnImage): boolean => {
    const u = result?.url
    return /^https?:/.test(u)
}

function LoadProgress({ error, success, onReTry }: any) {
    const onClick = () => {
        if (error) {
            onReTry?.()
        }
    }

    return (
        <div
            className="relative box-border h-14 w-160 rounded-[100px] border-[#fff] border-[solid]"
            onClick={onClick}>
            <div className={`x-progress-bar ${error ? 'error' : ''} ${success ? 'success' : ''}`} />
        </div>
    )
}

interface Props {
    ufile: IFileItem
}

function ListItemComp({ ufile }: Props) {
    // 上传后的结果数据
    const [resp, setResp] = useState<CdnImage[]>()
    // 上传失败的错误
    const [error, setError] = useState(null)

    // 执行压缩上传
    const doUpload = useMemoizedFn(
        useLockFn(async () => {
            if (ufile.finish) {
                return
            }
            setError(null)

            try {
                const images = await emitShrinkUpload(ufile)
                setResp(images)
                ufile.finish = true
            } catch (err) {
                setResp([])
                setError(err)
            }
        }),
    )

    useMount(doUpload)

    // 压缩后展示的信息
    const info = useMemo(() => {
        const result = resp?.[0]
        if (!result) return { dp: '-', size: '-' }
        const osize = ufile.file.size
        const zsize = result.size
        const p = ((osize - zsize) / osize) * 100
        return {
            size: sizeToTxt(result.size),
            dp: p.toFixed(0) + '%',
            url: result.url,
        }
    }, [resp, ufile])
    // 下载压缩后的文件
    const onDownFile = () => {
        const result = resp?.[0]
        if (!result) return
        saveAs(result.url, result.name)
    }
    // 复制url
    const genCopy = (idx = 0) => {
        return () => {
            const res = resp[idx]
            if (!res) return
            window.navigator.clipboard?.writeText(res.url).then(() => {
                return message.success('复制成功！')
            })
        }
    }

    return (
        <div className="relative flex min-h-[24px] items-center justify-between rounded-lg bg-[#f5f5f5] px-12 py-5 text-[14px] text-[#4d4f56]">
            <div className="flex items-center gap-8">
                <span className="max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {get(ufile, 'file.name')}
                </span>
                {keepOrigin(ufile) && <CopyOutlined onClick={genCopy(1)} />}
            </div>
            <div className="absolute left-2/4 top-5 flex -translate-x-2/4 items-center justify-between gap-4">
                <div className="w-70 text-right text-[#0e78dd]">
                    {sizeToTxt(get(ufile, 'file.size'), true)}
                </div>
                <LoadProgress onReTry={doUpload} success={!isEmpty(resp)} error={error} />
                <div className="w-70 text-[#0e78dd]">{info.size}</div>
            </div>
            <div className="flex items-center gap-8">
                <DownloadOutlined onClick={onDownFile} />
                {hasHttpUrl(resp?.[0]) && <CopyOutlined onClick={genCopy(0)} />}
                <div className="w-32">{info.dp}</div>
                <img className="h-22 w-22 object-contain" src={info.url} />
            </div>
        </div>
    )
}

export function UploadImageList() {
    const fileList = useFiles((stat) => stat.fileList)

    if (isEmpty(fileList)) {
        return null
    }
    return (
        <div className="relative z-[6] mx-auto mb-10 mt-20 flex flex-col gap-10 rounded-[2px] border border-[#c4ccd3] bg-white p-12">
            {fileList.map((f, idx) => (
                <ListItemComp ufile={f} key={idx} />
            ))}
        </div>
    )
}
