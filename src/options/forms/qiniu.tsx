import FormItem from "@/FormItem"
import { setSingleCdnConfig } from "@/common/config"
import { CdnTypes } from "@/contants"
import { Button, Form, Input } from "antd"

function Qiniu({ data }) {
    const onFinish = (values: any) => {
        setSingleCdnConfig(CdnTypes.QINIU, values)
    }

    return (
        <Form initialValues={data} onFinish={onFinish} labelCol={{ span: 6 }}>
            <FormItem label="设定AccessKey" name="accessKey" required>
                <Input placeholder="AccessKey" />
            </FormItem>
            <FormItem label="设定SecretKey" name="secretKey" required>
                <Input type="password" placeholder="SecretKey" />
            </FormItem>
            <FormItem label="设定存储空间名" name="bucket" required>
                <Input placeholder="Bucket" />
            </FormItem>
            <FormItem label="设置访问网址" name="url" required>
                <Input placeholder="如 https://xxx.com" />
            </FormItem>
            <FormItem label="确认存储区域" name="area" required>
                <Input placeholder="如 z0" />
            </FormItem>
            <FormItem label="指定存储路径" name="path">
                <Input placeholder="如 img/" />
            </FormItem>
            <FormItem wrapperCol={{ span: 18, offset: 6 }}>
                <Button type="primary" htmlType="submit">保存</Button>
            </FormItem>
        </Form>
    )
}

export default Qiniu