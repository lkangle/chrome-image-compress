import { removeCdnConfig, setSingleCdnConfig } from '@/common/config'
import { CdnTypes } from '@/common/contants'
import FormItem, { ZxForm } from '@/components/form-item'
import { Button, Input, message, Space } from 'antd'

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
                <Input placeholder="token" />
            </FormItem>
            <FormItem wrapperCol={{ span: 18, offset: 6 }}>
                <Space>
                    <Button disabled title="敬请期待" type="primary" htmlType="submit">
                        保存
                    </Button>
                    <Button htmlType="reset">清除</Button>
                </Space>
            </FormItem>
        </ZxForm>
    )
}

export default Smms
