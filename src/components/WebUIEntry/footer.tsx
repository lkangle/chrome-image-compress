import useRootContext from '@/hooks/context'
import { SettingFilled } from '@ant-design/icons'
import { Flex, Form, Input, Modal } from 'antd'
import { useState } from 'react'

import { author } from '../../../package.json'

function Footer() {
    const { rootContainer } = useRootContext()
    const [open, setOpen] = useState(false)

    const onClick = () => {
        setOpen(true)
    }

    return (
        <Flex justify="space-between">
            <div className="text-[12px] text-[#a9a9a9]">
                By&nbsp;
                <a style={{ color: '#a9a9a9' }} href={`mailto:${author}`}>
                    Lkl
                </a>
                .
            </div>
            <div onClick={onClick} className="cursor-pointer text-[15px]">
                <SettingFilled />
            </div>

            <Modal
                title="高级复制"
                getContainer={() => rootContainer}
                open={open}
                footer={false}
                classNames={{
                    footer: 'hidden',
                    body: 'pt-5 mb-[-15px]',
                }}
                centered
                width={400}
                destroyOnClose
                onCancel={() => setOpen(false)}>
                <Form labelCol={{ span: 6 }}>
                    <Form.Item label="单图格式化">
                        <Input.TextArea
                            autoSize={{ minRows: 3, maxRows: 3 }}
                            placeholder="单图复制配置"
                        />
                    </Form.Item>
                    <Form.Item label="倍图格式化">
                        <Input.TextArea
                            autoSize={{ minRows: 3, maxRows: 3 }}
                            placeholder="倍图复制配置"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Flex>
    )
}

export default Footer
