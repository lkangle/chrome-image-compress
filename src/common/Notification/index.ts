import type { ShrinkNotice } from '@/types'
import { NoticeIcon, SHRINK_STATUS } from '@/types'
import { get } from 'lodash-es'

import { insertEl, sleep } from '..'
import { emitUploaded } from '../web-ipc'

class Notification {
    container: HTMLDivElement
    box: HTMLDivElement
    // 加载中的icon
    loadingDiv: HTMLDivElement
    // 完成ok的icon
    doneDiv: HTMLDivElement
    // 出现错误的icon
    errorDiv: HTMLDivElement
    // 关闭按钮
    closeDiv: HTMLDivElement
    // 内容容器
    textDiv: HTMLDivElement
    timer: number

    constructor(private root: HTMLElement = document.body) {
        this.container = document.createElement('div')
        this.container.innerHTML = `
            <div class="notice-container">
              <div class="notice-body">
                <div class="notice-icon">
                  <div class="loading f-fcc">
                    <svg class="lds-balls" width="50px" height="50px" xmlns="http://www.w3.org/2000/svg"
                         xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                      <circle cx="67.8023" cy="59.9068" r="6" fill="#51CACC">
                        <animate attributeName="cx" values="75;57.72542485937369" keyTimes="0;1" dur="1s"
                                 repeatCount="indefinite"></animate>
                        <animate attributeName="cy" values="50;73.77641290737884" keyTimes="0;1" dur="1s"
                                 repeatCount="indefinite"></animate>
                        <animate attributeName="fill" values="#51CACC;#9DF871" keyTimes="0;1" dur="1s"
                                 repeatCount="indefinite"></animate>
                      </circle>
                      <circle cx="46.0792" cy="69.9923" r="6" fill="#9DF871">
                        <animate attributeName="cx" values="57.72542485937369;29.774575140626318" keyTimes="0;1" dur="1s"
                                 repeatCount="indefinite"></animate>
                        <animate attributeName="cy" values="73.77641290737884;64.69463130731182" keyTimes="0;1" dur="1s"
                                 repeatCount="indefinite"></animate>
                        <animate attributeName="fill" values="#9DF871;#E0FF77" keyTimes="0;1" dur="1s"
                                 repeatCount="indefinite"></animate>
                      </circle>
                      <circle cx="29.7746" cy="52.4491" r="6" fill="#E0FF77">
                        <animate attributeName="cx" values="29.774575140626318;29.774575140626315" keyTimes="0;1" dur="1s"
                                 repeatCount="indefinite"></animate>
                        <animate attributeName="cy" values="64.69463130731182;35.30536869268818" keyTimes="0;1" dur="1s"
                                 repeatCount="indefinite"></animate>
                        <animate attributeName="fill" values="#E0FF77;#DE9DD6" keyTimes="0;1" dur="1s"
                                 repeatCount="indefinite"></animate>
                      </circle>
                      <circle cx="41.4208" cy="31.5213" r="6" fill="#DE9DD6">
                        <animate attributeName="cx" values="29.774575140626315;57.72542485937368" keyTimes="0;1" dur="1s"
                                 repeatCount="indefinite"></animate>
                        <animate attributeName="cy" values="35.30536869268818;26.22358709262116" keyTimes="0;1" dur="1s"
                                 repeatCount="indefinite"></animate>
                        <animate attributeName="fill" values="#DE9DD6;#FF708E" keyTimes="0;1" dur="1s"
                                 repeatCount="indefinite"></animate>
                      </circle>
                      <circle cx="64.9232" cy="36.1304" r="6" fill="#FF708E">
                        <animate attributeName="cx" values="57.72542485937368;75" keyTimes="0;1" dur="1s"
                                 repeatCount="indefinite"></animate>
                        <animate attributeName="cy" values="26.22358709262116;49.99999999999999" keyTimes="0;1" dur="1s"
                                 repeatCount="indefinite"></animate>
                        <animate attributeName="fill" values="#FF708E;#51CACC" keyTimes="0;1" dur="1s"
                                 repeatCount="indefinite"></animate>
                      </circle>
                    </svg>
                  </div>
                  <div class="done f-fcc">
                    <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                         p-id="2432" width="38" height="38">
                      <path
                          d="M511.950005 512.049995m-447.956254 0a447.956254 447.956254 0 1 0 895.912508 0 447.956254 447.956254 0 1 0-895.912508 0Z"
                          fill="#20B759" p-id="2433"></path>
                      <path
                          d="M458.95518 649.636559L289.271751 479.95313c-11.698858-11.698858-30.697002-11.698858-42.39586 0s-11.698858 30.697002 0 42.395859l169.683429 169.68343c11.698858 11.698858 30.697002 11.698858 42.39586 0 11.798848-11.598867 11.798848-30.597012 0-42.39586z"
                          fill="#FFFFFF" p-id="2434"></path>
                      <path
                          d="M777.62406 332.267552c-11.698858-11.698858-30.697002-11.698858-42.39586 0L424.158578 643.437164c-11.698858 11.698858-11.698858 30.697002 0 42.39586s30.697002 11.698858 42.39586 0l311.069622-311.069622c11.798848-11.798848 11.798848-30.796992 0-42.49585z"
                          fill="#FFFFFF" p-id="2435"></path>
                    </svg>
                  </div>
                  <div id="error" class="done f-fcc">
                    <svg t="1635569311257" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                         p-id="2547" width="38" height="38">
                      <path d="M512 0a512 512 0 0 0-512 512 512 512 0 0 0 512 512 512 512 0 0 0 512-512 512 512 0 0 0-512-512z"
                            fill="#FD6B6D" p-id="2548"></path>
                      <path
                          d="M513.755429 565.540571L359.277714 720.018286a39.058286 39.058286 0 0 1-55.296-0.073143 39.277714 39.277714 0 0 1 0.073143-55.442286l154.331429-154.331428-155.062857-155.136a36.571429 36.571429 0 0 1 51.712-51.785143l365.714285 365.714285a36.571429 36.571429 0 1 1-51.785143 51.785143L513.755429 565.540571z m157.549714-262.582857a35.254857 35.254857 0 1 1 49.737143 49.737143l-106.057143 108.982857a35.254857 35.254857 0 1 1-49.883429-49.810285l106.203429-108.982858z"
                          fill="#FFFFFF" p-id="2549"></path>
                    </svg>
                  </div>
                </div>
                <div class="notice-text">
                  准备压缩
                </div>
                <div class="notice-close">
                  <svg viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor"
                       aria-hidden="true">
                    <path
                        d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                  </svg>
                </div>
              </div>
            </div>
          `
        this.box = this.container.querySelector('.notice-container')
        this.loadingDiv = this.container.querySelector('.loading')
        this.doneDiv = this.container.querySelector('.done')
        this.errorDiv = this.container.querySelector('#error')
        this.textDiv = this.container.querySelector('.notice-text')
        this.closeDiv = this.container.querySelector('.notice-close')
        this.closeDiv.addEventListener('click', () => {
            this.unmount(0)
        })
    }

    update(content: string, done: boolean, error: boolean) {
        try {
            this.textDiv.innerHTML = content
            if (done || error) {
                this.loadingDiv.style.display = 'none'
                if (error) {
                    this.errorDiv.style.display = 'flex'
                    this.closeDiv.style.display = 'block'
                } else {
                    this.doneDiv.style.display = 'flex'
                }
            }
        } catch (e) {
            console.error(e)
        }
    }

    /**
     * 更新内容
     * @param content 内容
     * @param icon 要显示的icon
     */
    update2(content: string, icon: NoticeIcon) {
        const done = icon === NoticeIcon.OK
        const error = icon === NoticeIcon.ERROR
        this.update(content, done, error)
    }

    async mount() {
        return new Promise<void>((resolve) => {
            window.clearTimeout(this.timer)
            this.closeDiv.style.display = 'none'
            this.errorDiv.style.display = 'none'
            this.doneDiv.style.display = 'none'
            this.loadingDiv.style.display = 'flex'
            this.root.appendChild(this.container)
            setTimeout(() => {
                this.box.style.transform = 'translateX(0%)'
                resolve()
            }, 16)
        })
    }

    async unmount(delay = 4e3) {
        return new Promise((resolve) => {
            this.timer = window.setTimeout(() => {
                this.box.style.transform = 'translateX(120%)'
                setTimeout(() => {
                    this.root.removeChild(this.container)
                    resolve(delay)
                }, 500)
            }, delay)
        })
    }
}

const DEFAULT = '__DEFAULT__'

// 通知储存上传的结果
const yunluPostMessage = (notice) => {
    const yunlu = get(notice, 'info.isYunLu', false)
    if (yunlu) {
        sleep(300).then(() => emitUploaded(notice.info))
    }
}

class ShrinkGroup {
    root: HTMLDivElement
    groups: Map<string, Notification>

    constructor() {
        this.groups = new Map()
        this.root = document.createElement('div')
        this.root.className = 'zm-notification-group-231120'
        insertEl(this.root)
    }

    private getByGroupId(groupId: string, create = false): Notification {
        if (this.groups.has(groupId)) {
            return this.groups.get(groupId)
        }
        if (!create) return undefined
        const notice = new Notification(this.root)
        this.groups.set(groupId, notice)
        return notice
    }

    mount(groupId = DEFAULT, okCb = null) {
        this.getByGroupId(groupId, true)
            .mount()
            .then(() => {
                okCb?.(this)
            })
        return this
    }

    update2(content: string, icon: NoticeIcon, groupId: string) {
        const nt = this.getByGroupId(groupId)
        if (!nt) {
            this.mount(groupId, () => {
                this.update2(content, icon, groupId)
            })
            return
        }

        if (content) {
            nt?.update2(content, icon)
        }
    }

    unmount(groupId = DEFAULT, delay = 4e3) {
        const nt = this.getByGroupId(groupId)
        if (!nt) return console.warn('不存在与之对应的groupId...')

        return nt.unmount(delay).then(() => {
            // 卸载成功后要清除
            this.groups.delete(groupId)
        })
    }

    // 触发通知，通知可根据groupId更新
    emit(notice: ShrinkNotice) {
        const groupId = notice.groupId
        let icon = NoticeIcon.LOADING
        if (notice.code === SHRINK_STATUS.DONE) {
            icon = NoticeIcon.OK
            Notice.unmount(groupId)
        }
        if (notice.code === SHRINK_STATUS.ERROR) {
            icon = NoticeIcon.ERROR
            Notice.unmount(groupId, 4200)
        }
        if (notice.error) {
            console.warn('%c[error]', 'color:red;', notice.error)
        }
        yunluPostMessage(notice)
        Notice.update2(notice.content, icon, groupId)
    }
}

export const Notice = new ShrinkGroup()

export * from './info'
