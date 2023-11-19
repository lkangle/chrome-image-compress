import { removeCdnConfig, setSingleCdnConfig } from '@/common/config'
import { CdnTypes } from '@/contants'
import FormItem, { ZxForm } from '@/form-item'
import { Button, Input, message, Space } from 'antd'

function Custom({ data }) {
    const onFinish = async (values: any) => {
        await setSingleCdnConfig(CdnTypes.CUSTOM, values)
        message.success('保存成功!')
    }

    const onClear = () => {
        removeCdnConfig(CdnTypes.CUSTOM)
    }

    return (
        <ZxForm defaultData={data} onFinish={onFinish} onReset={onClear} labelCol={{ span: 6 }}>
            <FormItem label="API地址" name="url" required>
                <Input placeholder="API地址" />
            </FormItem>
            <FormItem label="POST参数名" name="paramName" required>
                <Input placeholder="file" />
            </FormItem>
            <FormItem label="图片JSON路径" name="jsonPath" required>
                <Input placeholder="图片URL JSON路径 (eg: data.url)" />
            </FormItem>
            <FormItem label="自定义请求头" name="customHeader">
                <Input placeholder={`自定义Header 标准JSON (eg: {"key":"value"})`} />
            </FormItem>
            <FormItem label="自定义Body" name="customBody">
                <Input placeholder={`自定义Body 标准JSON (eg: {"key":"value"})`} />
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

export default Custom
