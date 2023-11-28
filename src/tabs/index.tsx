import { getItemInfo, readDirectory } from '@/common/filesystem'
import { CloudUploadOutlined } from '@ant-design/icons'
import { useLocalStorageState } from 'ahooks'
import { Select } from 'antd'
import type { DragEvent } from 'react'
import React, { useEffect, useRef } from 'react'

import { UploadImageList } from './upload/upload-images'
import useUploadFiles from './upload/useUploadFiles'

import './index.less'

const acceptTypes = ['image/png', 'image/jpeg']
const notDefault: any = (e: Event) => e.preventDefault()

// 提交压缩上传
function emitToUpload(fileList: File[], strategy = 0) {
    const emitFiles = fileList
        .filter((file) => acceptTypes.includes(file.type))
        .map((file) => ({
            file,
            strategy,
        }))

    useUploadFiles.getState().addFiles(emitFiles)

    console.log(emitFiles, '[[emitFiles')
}

function DragUpload() {
    const iptRef = useRef<HTMLInputElement>()
    // 上传策略
    const [strategy, setUpStrategy] = useLocalStorageState('AL_UPLOAD_STRATEGY', {
        defaultValue: 2,
    })
    // 拖拽处理
    const onDrop = async (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const items = e.dataTransfer.items
        const fileList = []

        for (const item of items) {
            const [isDir, fileOrEntry] = getItemInfo(item)
            if (isDir) {
                const fs = await readDirectory(fileOrEntry)
                fileList.push(...fs)
            } else {
                fileList.push(fileOrEntry)
            }
        }
        emitToUpload(fileList, strategy)
    }
    // 点击选择文件
    const onDivClick = () => {
        iptRef.current.click()
    }
    useEffect((): any => {
        const el = iptRef.current as HTMLInputElement
        if (!el) return
        const _change = (ev: any) => {
            ev.preventDefault()
            const fileList = ev.target.files
            emitToUpload([...fileList], strategy)
            el.value = ''
        }
        el.addEventListener('change', _change)
        return () => {
            el.removeEventListener('change', _change)
        }
    }, [strategy])

    return (
        <div className="mx-auto min-w-[600px] max-w-[920px] px-60 pb-10 pt-40 text-center">
            <div id="dragable" onDragOver={notDefault} onDragEnter={notDefault} onDrop={onDrop}>
                <div
                    className="box-border cursor-pointer rounded-[8px] border border-dashed border-[#d9d9d9] bg-[#fafafa] pb-40 pt-30 transition-[border-color] duration-[0.3s] hover:border-[#2891f1]"
                    onClick={onDivClick}>
                    <input
                        ref={iptRef}
                        className="hidden"
                        type="file"
                        accept="image/png,image/jpeg"
                        multiple
                    />
                    <div className="flex flex-col items-center text-[18px] text-[#8f8f8f]">
                        <CloudUploadOutlined className="text-[66px]" />
                        <span>点击或拖拽文件(夹)至框内可上传图片</span>
                    </div>
                </div>
            </div>

            <div className="mb-6 mt-8 flex h-30 select-none items-center justify-end text-[#818181]">
                <span>上传策略：</span>
                <Select
                    className="w-95 text-left text-[#818181]"
                    size="small"
                    onChange={setUpStrategy}
                    defaultValue={strategy}>
                    <Select.Option value={0}>不上传</Select.Option>
                    <Select.Option value={1}>保留原图</Select.Option>
                    <Select.Option value={2}>仅压缩图</Select.Option>
                </Select>
            </div>

            <UploadImageList />
        </div>
    )
}

export default React.memo(DragUpload)
