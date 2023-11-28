import { getCdnConfig } from '@/common/config'
import { cdnMenuItems, CdnTypes } from '@/common/contants'
import { AwaitSuspense } from '@/components/await'
import useDarkMode from '@/hooks/useDarkMode'
import { Card, Col, ConfigProvider, Menu, Row, theme } from 'antd'
import { useCallback, useMemo } from 'react'

import Aliyun from './forms/aliyun'
import Custom from './forms/custom'
import Qiniu from './forms/qiniu'
import Smms from './forms/smms'
import UpYun from './forms/upyun'

import '@/style.less'
import './index.less'

import { useLocalStorageState } from 'ahooks'

function OptionsIndex() {
    const [ossType, setOssType] = useLocalStorageState('ZIMAGE_OPTION_TAB', {
        defaultValue: 'smms',
    })
    // 初始化数据
    const dataPromise = useMemo(() => getCdnConfig(ossType), [ossType])

    const onMenuSelect = useCallback((info) => {
        setOssType(info.key)
    }, [])

    const Component: any = useMemo(() => {
        switch (ossType) {
            case CdnTypes.ALIYUN:
                return Aliyun
            case CdnTypes.CUSTOM:
                return Custom
            case CdnTypes.QINIU:
                return Qiniu
            case CdnTypes.UPYUN:
                return UpYun
            case CdnTypes.SMMS:
                return Smms
            default:
                return () => null
        }
    }, [ossType])

    return (
        <div className="flex h-[100vh] items-center justify-center bg-bcf1 dark:bg-[#0d1117]">
            <Card className="z-card h-[70vh] w-[800px]" bodyStyle={{ padding: 1 }} title="图床设置">
                <Row>
                    <Col span={6}>
                        <Menu
                            mode="inline"
                            onSelect={onMenuSelect}
                            defaultSelectedKeys={[ossType]}
                            style={{ height: '100%' }}
                            items={cdnMenuItems}
                        />
                    </Col>
                    <Col flex={1} className="px-40 pt-40">
                        <AwaitSuspense promise={dataPromise}>
                            <Component />
                        </AwaitSuspense>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}

export default () => {
    const isDark = useDarkMode()

    return (
        <ConfigProvider
            theme={{
                algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}>
            <OptionsIndex />
        </ConfigProvider>
    )
}
