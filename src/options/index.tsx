import { Card, Row, Col, Menu, ConfigProvider, theme } from "antd"
import { useCallback, useMemo, useState } from "react"
import Smms from "./forms/smms"
import Qiniu from "./forms/qiniu"
import Aliyun from "./forms/aliyun"
import Custom from "./forms/custom"
import { CdnTypes, cdnMenuItems } from "@/contants"
import { getCdnConfig } from "@/common/config"
import { AwaitSuspense } from "@/await"
import useDarkMode from "@/hooks/useDarkMode"
import "@/style.less"
import "./index.less"

function OptionsIndex() {
    const [ossType, setOssType] = useState(() => 'smms')
    // 初始化数据
    const dataPromise = useMemo(() => getCdnConfig(ossType), [ossType])

    const onMenuSelect = useCallback((info) => {
        setOssType(info.key);
    }, [])

    const Component: any = useMemo(() => {
        switch (ossType) {
            case CdnTypes.ALIYUN:
                return Aliyun
            case CdnTypes.CUSTOM:
                return Custom
            case CdnTypes.QINIU:
                return Qiniu
            case CdnTypes.SMMS:
                return Smms
            default:
                return (() => null)
        }
    }, [ossType])

    return (
        <div className="h-[100vh] dark:bg-[#0d1117] bg-bcf1 flex items-center justify-center">
            <Card className="z-card w-[800px] h-[70vh]" bodyStyle={{ padding: 1 }} title="图床设置">
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
                    <Col flex={1} className="pt-40 px-40">
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
        <ConfigProvider theme={{
            algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm
        }}>
            <OptionsIndex />
        </ConfigProvider>
    )
}