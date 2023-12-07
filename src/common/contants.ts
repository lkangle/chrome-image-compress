export const optionsURL = chrome?.runtime.getURL('options.html')
export const uploadTabURL = chrome?.runtime.getURL('tabs/index.html')

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

export const CdnLabelMap = {
    [CdnTypes.SMMS]: 'SM.MS图床',
    [CdnTypes.QINIU]: '七牛图床',
    [CdnTypes.UPYUN]: '又拍云图床',
    [CdnTypes.ALIYUN]: '阿里云oss',
    [CdnTypes.CUSTOM]: '自定义web图床',
}
