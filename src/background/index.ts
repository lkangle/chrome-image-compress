import './proxy'

function inject(eventName: string) {
    const ikey = '__ZM_INJECT__'
    if (window[ikey]) {
        return
    }
    window[ikey] = 1
    console.warn('[ZImage] inject interceptor.')
    const originClick: Function = HTMLElement.prototype.click
    const originDispatchEvent: Function = EventTarget.prototype.dispatchEvent

    // 发送要下载的图片给内容脚本
    function sendDownImage(url: string, name: string) {
        const filename = name.replace(/[ /]+/g, '_').toLocaleLowerCase()
        fetch(url)
            .then((resp) => {
                return resp.blob()
            })
            .then((blob) => {
                const payload = { filename, blob }
                window.postMessage({ type: eventName, payload }, '*')
            })
    }

    // figma|通用a.click下载
    Object.defineProperty(HTMLAnchorElement.prototype, 'click', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (flag = true) {
            const href = this.href
            const filename = this.download
            if (flag && filename && /^blob:/.test(href)) {
                sendDownImage(href, filename)
                return false
            }
            return originClick.apply(this, [false])
        },
    })

    // 蓝湖a事件下载
    Object.defineProperty(HTMLAnchorElement.prototype, 'dispatchEvent', {
        writable: true,
        configurable: true,
        enumerable: true,
        value: function (event: any, flag = true) {
            const nodeName = this.nodeName
            const href = this.href
            const filename = this.download
            if (flag && nodeName === 'A' && filename && /^blob:/.test(href)) {
                sendDownImage(href, filename)
                return false
            }
            return originDispatchEvent.apply(this, [event, false])
        },
    })
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.status === 'complete' && /^https?/.test(tab.url || '')) {
        chrome.scripting
            .executeScript({
                func: inject,
                target: { tabId },
                world: 'MAIN',
                args: ['__DOWNLOAD_IMAGE__'],
            })
            .catch((err) => {
                console.error('注入拦截脚本失败', err)
            })
    }
})
