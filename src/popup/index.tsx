import { getAppConfig, setAppConfig, type AppConfig } from '@/common/config'
import { AwaitSuspense } from '@/components/await'
import useDarkMode from '@/hooks/useDarkMode'
import { Card, Col, ConfigProvider, Form, Row, Select, Switch, theme } from 'antd'
import { useCallback, useState } from 'react'

import CdnSelect from './cdn-select'
import Footer from './footer'

import './index.less'
import '@/style.less'

function App({ data }: any) {
    const [value, setValue] = useState<AppConfig>(data)

    const onValuesChange = useCallback((_, values: any) => {
        setAppConfig(values)
        setValue(values)
    }, [])

    return (
        <Card
            bordered={false}
            type="inner"
            bodyStyle={{ padding: 0 }}
            className="rounded-none px-20 pb-55 pt-15">
            <Form initialValues={value} onValuesChange={onValuesChange}>
                <Row align="middle" className="mb-10 h-32">
                    <Col span={8}>启用压缩:</Col>
                    <Col flex={1} className="text-right">
                        <Form.Item noStyle valuePropName="checked" name="enable">
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>

                <Row align="middle" className="mb-10 h-32">
                    <Col span={8}>压缩服务:</Col>
                    <Col flex={1} className="text-right">
                        <Form.Item noStyle name="backend">
                            <Select className="w-[100%]" disabled={!value?.enable}>
                                <Select.Option value={0}>内置程序</Select.Option>
                                <Select.Option value={1}>TinyPNG</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row align="middle" className="mb-10 h-32">
                    <Col span={8}>压缩质量:</Col>
                    <Col flex={1} className="text-right">
                        <Form.Item noStyle name="quality">
                            <Select
                                className="w-[100%]"
                                disabled={!!value?.backend || !value?.enable}>
                                <Select.Option value={0}>优质</Select.Option>
                                <Select.Option value={1}>一般</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row align="middle" className="mb-10 h-32">
                    <Col span={8}>上传图床:</Col>
                    <Col flex={1} className="text-right">
                        <Form.Item noStyle name="uploadType">
                            <CdnSelect />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            <Footer />
        </Card>
    )
}

export default () => {
    const isDark = useDarkMode()

    return (
        <div className="h-240 w-250">
            <ConfigProvider
                theme={{
                    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
                }}>
                <AwaitSuspense promise={getAppConfig()}>
                    <App />
                </AwaitSuspense>
            </ConfigProvider>
        </div>
    )
}
