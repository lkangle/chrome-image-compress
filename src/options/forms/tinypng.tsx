import { setTinyConfig } from '@/common/config'
import FormItem, { ZxForm } from '@/components/form-item'
import { Button, Input, message, Space } from 'antd'

function TinyPng({ data }) {
    const onFinish = async (values: any) => {
        await setTinyConfig(values)
        message.success('保存成功!')
    }

    return (
        <ZxForm defaultData={data} onFinish={onFinish} labelCol={{ span: 6 }}>
            <FormItem label="API Key" name="token" required>
                <Input type="password" placeholder="token" />
            </FormItem>
            <FormItem label="接口地址" name="url">
                <Input autoComplete="off" placeholder="默认: https://api.tinify.com/shrink" />
            </FormItem>
            <FormItem wrapperCol={{ span: 18, offset: 6 }}>
                <Space>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                </Space>
            </FormItem>
        </ZxForm>
    )
}

export default TinyPng
