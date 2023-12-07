import { AwaitSuspense } from '@/components/await'
import useDarkMode from '@/hooks/useDarkMode'
import { useLocalStorageState } from 'ahooks'
import { Card, Col, ConfigProvider, Menu, Row, theme } from 'antd'
import { useCallback, useMemo } from 'react'

import { cdnMenuItems, findComponentByKey, findMenuByKey } from './menu'

import '@/style.less'
import './index.less'

function OptionsIndex() {
    const [ossType, setOssType] = useLocalStorageState('ZIMAGE_OPTION_TAB', {
        defaultValue: 'smms',
    })
    const onMenuSelect = useCallback((info) => {
        setOssType(info.key)
    }, [])
    // 菜单下对应数据
    const dataPromise = useMemo(async () => {
        const menu = findMenuByKey(ossType)
        return menu?.loader?.()
    }, [ossType])

    const Component = useMemo(() => findComponentByKey(ossType), [ossType])

    return (
        <div className="flex h-[100vh] items-center justify-center bg-bcf1 dark:bg-[#0d1117]">
            <Card className="z-card h-[70vh] w-[800px]" bodyStyle={{ padding: 1 }} title="应用设置">
                <Row>
                    <Col span={6}>
                        <Menu
                            mode="inline"
                            onSelect={onMenuSelect}
                            defaultOpenKeys={['cdns']}
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
