import { Card, Row, Col, Menu, Spin } from "antd"
import { Suspense, useCallback, useMemo, useState } from "react"
import Smms from "./forms/smms"
import Qiniu from "./forms/qiniu"
import Aliyun from "./forms/aliyun"
import Custom from "./forms/custom"
import { CdnTypes } from "@/contants"
import { getCdnConfig } from "@/common/config"
import Await from "@/Await"
import "@/style.less"
import "./index.less"

const menuItems = [
    {
        key: CdnTypes.SMMS,
        label: 'SM.MS图床',
        component: Smms
    },
    {
        key: CdnTypes.QINIU,
        label: '七牛图床',
        component: Qiniu
    },
    {
        key: CdnTypes.ALIYUN,
        label: '阿里云oss',
        component: Aliyun
    },
    {
        key: CdnTypes.CUSTOM,
        label: '自定义web图床',
        component: Custom
    }
]

function OptionsIndex() {
    const [ossType, setOssType] = useState(() => 'smms')
    // 初始化数据
    const dataPromise = useMemo(() => getCdnConfig(ossType), [ossType])

    const onMenuSelect = useCallback((info) => {
        setOssType(info.key);
    }, [])

    const Component: any = useMemo(() => {
        let m = menuItems.find(it => it.key === ossType)
        return m?.component || (() => null)
    }, [ossType])

    return (
        <div className="h-[100vh] bg-bcf1 flex items-center justify-center">
            <Card className="z-card w-[800px] h-[70vh]" bodyStyle={{ padding: 1 }} title="图床设置">
                <Row>
                    <Col span={6}>
                        <Menu
                            mode="inline"
                            onSelect={onMenuSelect}
                            defaultSelectedKeys={[ossType]}
                            style={{ height: '100%' }}
                            items={menuItems}
                        />
                    </Col>
                    <Col flex={1} className="pt-40 px-40">
                        <Suspense fallback={<Spin className="w-[100%] pt-60" spinning />}>
                            <Await promise={dataPromise}>
                                <Component />
                            </Await>
                        </Suspense>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}

export default OptionsIndex