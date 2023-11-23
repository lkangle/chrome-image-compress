export const optionsURL = chrome.runtime.getURL('options.html')

export class CodeError extends Error {
    code: number
    constructor(code: number, message = '未知异常') {
        const msg = `code(${code}) ${message}`
        super(msg)
        this.code = code
    }
}

export const CdnTypes = {
    CUSTOM: 'custom',
    ALIYUN: 'aliyun',
    QINIU: 'qiniu',
    SMMS: 'smms',
    UPYUN: 'upyun',
}

export const cdnMenuItems = [
    {
        key: CdnTypes.SMMS,
        label: 'SM.MS图床',
    },
    {
        key: CdnTypes.QINIU,
        label: '七牛图床',
    },
    {
        key: CdnTypes.UPYUN,
        label: '又拍云图床',
    },
    {
        key: CdnTypes.ALIYUN,
        label: '阿里云oss',
    },
    {
        key: CdnTypes.CUSTOM,
        label: '自定义web图床',
    },
]
