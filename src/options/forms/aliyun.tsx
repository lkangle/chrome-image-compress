import FormItem from "@/FormItem"
import { setSingleCdnConfig } from "@/common/config"
import { CdnTypes } from "@/contants"
import { Button, Form, Input } from "antd"

function Aliyun({ data }) {
    const onFinish = (values: any) => {
        setSingleCdnConfig(CdnTypes.ALIYUN, values)
    }

    return (
        <Form initialValues={data} onFinish={onFinish} labelCol={{ span: 6 }}>
            <FormItem label="设定KeyId" name="accessKeyId" required>
                <Input placeholder="AccessKeyId" />
            </FormItem>
            <FormItem label="设定KeySecret" name="accessKeySecret" required>
                <Input type="password" placeholder="AccessKeySecret" />
            </FormItem>
            <FormItem label="设定存储空间名" name="bucket" required>
                <Input placeholder="Bucket" />
            </FormItem>
            <FormItem label="确认存储区域" name="area" required>
                <Input placeholder="如 oss-cn-beijing" />
            </FormItem>
            <FormItem label="指定存储路径" name="path">
                <Input placeholder="如 img/" />
            </FormItem>
            <FormItem label="设置自定义网址" name="customUrl">
                <Input placeholder="如 https://xxx.com" />
            </FormItem>
            <FormItem wrapperCol={{ span: 18, offset: 6 }}>
                <Button type="primary" htmlType="submit">保存</Button>
            </FormItem>
        </Form>
    )
}

export default Aliyun