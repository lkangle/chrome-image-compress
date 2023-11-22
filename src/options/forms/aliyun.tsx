import { removeCdnConfig, setSingleCdnConfig } from '@/common/config'
import { CdnTypes } from '@/common/contants'
import FormItem, { ZxForm } from '@/components/form-item'
import { Button, Input, message, Space } from 'antd'

function Aliyun({ data }) {
    const onFinish = async (values: any) => {
        await setSingleCdnConfig(CdnTypes.ALIYUN, values)
        message.success('保存成功!')
    }

    const onClear = () => {
        removeCdnConfig(CdnTypes.ALIYUN)
    }

    return (
        <ZxForm defaultData={data} onReset={onClear} onFinish={onFinish} labelCol={{ span: 6 }}>
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
                <Space>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                    <Button htmlType="reset">清除</Button>
                </Space>
            </FormItem>
        </ZxForm>
    )
}

export default Aliyun
