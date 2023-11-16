import { Button, Form, Select, Switch } from "antd"
import useConfig from "./useConfig"
import Footer from "./footer"
import "./index.less"
import "@/style.less"

function IndexPopup() {
  const { updateConfig, form } = useConfig()

  return (
    <div className="dark:bg-[#202124] h-172 w-280 py-15 px-12">
      <div className="bg-[#f2f5fa] rounded-[5px]">
        <Form
          form={form}
          onValuesChange={updateConfig}
          className="z-form"
          layout="horizontal"
          size="small"
        >
          <Form.Item label="开启压缩" valuePropName="checked" name="enable">
            <Switch />
          </Form.Item>
          <Form.Item label="质量" name="quality">
            <Select>
              <Select.Option value={0}>优质</Select.Option>
              <Select.Option value={1}>一般</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="上传图床" name="uploadType">
            {/* <Select>
              <Select.Option value={0}>七牛云</Select.Option>
              <Select.Option value={1}>自定义</Select.Option>
            </Select> */}
            <Button type="link">去配置</Button>
          </Form.Item>
        </Form>
      </div>
      <Footer />
    </div>
  )
}

export default IndexPopup
