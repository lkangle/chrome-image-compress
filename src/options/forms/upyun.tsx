import { removeCdnConfig, setSingleCdnConfig } from '@/common/config'
import { CdnTypes } from '@/common/contants'
import FormItem, { ZxForm } from '@/components/form-item'
import { Button, Input, message, Space } from 'antd'

function UpYun({ data }) {
    const onFinish = async (values: any) => {
        await setSingleCdnConfig(CdnTypes.UPYUN, values)
        message.success('保存成功!')
    }

    const onClear = () => {
        removeCdnConfig(CdnTypes.UPYUN)
    }

    return (
        <ZxForm defaultData={data} onFinish={onFinish} onReset={onClear} labelCol={{ span: 6 }}>
            <FormItem label="操作员" name="operator" required>
                <Input placeholder="如: me" />
            </FormItem>
            <FormItem label="操作员密码" name="password" required>
                <Input type="password" placeholder="输入操作员密码" />
            </FormItem>
            <FormItem label="存储空间名" name="bucket" required>
                <Input placeholder="Bucket" />
            </FormItem>
            <FormItem label="加速域名" name="url" required>
                <Input placeholder="如 https://xxx.com" />
            </FormItem>
            <FormItem label="指定存储路径" name="path">
                <Input placeholder="如 img/" />
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

export default UpYun
