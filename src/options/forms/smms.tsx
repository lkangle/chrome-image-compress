import FormItem from "@/FormItem"
import { setSingleCdnConfig } from "@/common/config"
import { CdnTypes } from "@/contants"
import { Button, Form, Input } from "antd"

function Smms({ data }) {
    const onFinish = (values: any) => {
        setSingleCdnConfig(CdnTypes.SMMS, values)
    }

    return (
        <Form
            initialValues={data}
            onFinish={onFinish}
            labelCol={{ span: 6 }}
        >
            <FormItem label="设定Token" name="token" required>
                <Input placeholder="token" />
            </FormItem>
            <FormItem wrapperCol={{ span: 18, offset: 6 }}>
                <Button type="primary" htmlType="submit">保存</Button>
            </FormItem>
        </Form>
    )
}

export default Smms