import { removeCdnConfig, setSingleCdnConfig } from '@/common/config'
import { CdnTypes } from '@/common/contants'
import FormItem, { ZxForm } from '@/components/form-item'
import { Button, Input, message, Select, Space } from 'antd'

function Smms({ data }) {
    const onFinish = async (values: any) => {
        await setSingleCdnConfig(CdnTypes.SMMS, values)
        message.success('保存成功!')
    }

    const onClear = () => {
        removeCdnConfig(CdnTypes.SMMS)
    }

    return (
        <ZxForm defaultData={data} onFinish={onFinish} onReset={onClear} labelCol={{ span: 6 }}>
            <FormItem label="设定Token" name="token" required>
                <Input type="password" placeholder="token" />
            </FormItem>
            <FormItem label="域" name="domain" required>
                <Select>
                    <Select.Option value="smms.app">国内</Select.Option>
                    <Select.Option value="sm.ms">海外</Select.Option>
                </Select>
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

export default Smms
