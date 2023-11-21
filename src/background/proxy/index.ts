import ImageDB from '@/common/db'
import type { IpcMessage } from '@/types'

import { parseArgs } from './args'
import { request } from './request'

const db = new ImageDB()

const methodmap = {
    fetch: request,
    dbAdd: db.add.bind(db),
    dbFindPage: db.findPage.bind(db),
}

// 请求代理
chrome.runtime.onMessage.addListener((message: IpcMessage, sender, sendResponse) => {
    const { type, payload } = message || {}

    if (type === 'proxy_method') {
        let { args, method } = payload

        const fn = methodmap[method]
        args = parseArgs(...args)

        if (!fn) {
            sendResponse({ success: false, message: 'no method.' })
        } else {
            const res = fn.apply(undefined, args)

            if (res instanceof Promise) {
                res.then((data) => {
                    sendResponse({ success: true, data })
                }).catch((error) => {
                    sendResponse({ success: false, message: error.message })
                })
            } else {
                sendResponse({ success: true, data: res })
            }
        }
    }

    return true
})
