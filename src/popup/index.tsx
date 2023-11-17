import { Col, Form, Row, Select, Switch, ConfigProvider, theme, Card, Spin } from "antd"
import Footer from "./footer"
import { useCallback, useState } from "react"
import CdnSelect from "./cdn-select"
import { getAppConfig, setAppConfig } from "@/common/config"
import { AwaitSuspense } from "@/await"
import useDarkMode from "@/hooks/useDarkMode"
import "./index.less"
import "@/style.less"

function App({ data }: any) {
  const [value, setValue] = useState(data)

  const onValuesChange = useCallback((values: any) => {
    setAppConfig(values)
    setValue(values)
  }, [])

  return (
    <Card
      bordered={false}
      type="inner"
      bodyStyle={{ padding: 0 }}
      className="px-20 pt-15 pb-55 rounded-none"
    >
      <Form initialValues={value} onValuesChange={onValuesChange}>
        <Row align="middle" className="h-32 mb-10">
          <Col span={8}>启用压缩:</Col>
          <Col flex={1} className="text-right">
            <Form.Item noStyle valuePropName="checked" name="enable">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row align="middle" className="h-32 mb-10">
          <Col span={8}>压缩服务:</Col>
          <Col flex={1} className="text-right">
            <Form.Item noStyle name="backend">
              <Select className="w-[100%]">
                <Select.Option value={0}>内置程序</Select.Option>
                <Select.Option value={1}>TinyPNG</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row align="middle" className="h-32 mb-10">
          <Col span={8}>压缩质量:</Col>
          <Col flex={1} className="text-right">
            <Form.Item noStyle name="quality">
              <Select className="w-[100%]" disabled={value?.backend == 1}>
                <Select.Option value={0}>优质</Select.Option>
                <Select.Option value={1}>一般</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row align="middle" className="h-32 mb-10">
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
    <div className="w-250 h-240">
      <ConfigProvider theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}>
        <AwaitSuspense promise={getAppConfig()}>
          <App />
        </AwaitSuspense>
      </ConfigProvider>
    </div>
  )
}
