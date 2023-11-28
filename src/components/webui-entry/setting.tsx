import { storage } from '@/common/storage'
import { getCopyRule, type ICopyRule } from '@/hooks/useCopyRule'
import { Form, Input, Radio } from 'antd'
import { useState } from 'react'

import { AwaitSuspense } from '../await'

function SettingForm({ data }: any) {
    const [settings, setSettings] = useState<ICopyRule>(data)

    const onValuesChange = (_, all: any) => {
        setSettings(all)
        storage.setItem('copy_settings', all)
    }

    return (
        <Form
            initialValues={settings}
            labelCol={{ span: 6 }}
            size="small"
            onValuesChange={onValuesChange}>
            <Form.Item name="format" label="单图格式化">
                <Input.TextArea autoSize={{ minRows: 2, maxRows: 2 }} placeholder="单图复制配置" />
            </Form.Item>
            <Form.Item name="doubleMode" label="倍图模式">
                <Radio.Group>
                    <Radio value="media">media</Radio>
                    <Radio value="imageset">image-set</Radio>
                    <Radio value="custom">自定义</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                hidden={settings.doubleMode !== 'custom'}
                name="doubleFormat"
                label="&nbsp;"
                colon={false}>
                <Input.TextArea
                    autoSize={{ minRows: 3, maxRows: 3 }}
                    placeholder="自定义倍图格式化模式"
                />
            </Form.Item>
        </Form>
    )
}

export default () => {
    const [promise] = useState(() => getCopyRule())

    return (
        <AwaitSuspense promise={promise}>
            <SettingForm />
        </AwaitSuspense>
    )
}
