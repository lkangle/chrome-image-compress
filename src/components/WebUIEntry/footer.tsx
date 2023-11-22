import useRootContext from '@/hooks/context'
import { SettingFilled } from '@ant-design/icons'
import { Flex, Modal } from 'antd'
import { useState } from 'react'

import { author } from '../../../package.json'
import SettingForm from './setting'

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
                    body: 'pt-5 mb-[-10px]',
                }}
                centered
                width={410}
                destroyOnClose
                onCancel={() => setOpen(false)}>
                <SettingForm />
            </Modal>
        </Flex>
    )
}

export default Footer
