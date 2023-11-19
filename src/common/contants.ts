export const optionsURL = chrome.runtime.getURL('options.html')

export const CdnTypes = {
    CUSTOM: 'custom',
    ALIYUN: 'aliyun',
    QINIU: 'qiniu',
    SMMS: 'smms',
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
        key: CdnTypes.ALIYUN,
        label: '阿里云oss',
    },
    {
        key: CdnTypes.CUSTOM,
        label: '自定义web图床',
    },
]
