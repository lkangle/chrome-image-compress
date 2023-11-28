import useRootContext from '@/hooks/context'
import useAdvCopyEnable from '@/hooks/useAdvCopyEnable'
import { Flex, Switch, Tooltip } from 'antd'

function Title() {
    const { enable, setEnable } = useAdvCopyEnable()
    const { rootContainer } = useRootContext()

    return (
        <Flex justify="space-between">
            <span>图片列表</span>
            <Tooltip
                getPopupContainer={() => rootContainer}
                title={<span className="text-[13px]">高级复制开关</span>}>
                <Switch size="small" defaultChecked={enable} onChange={setEnable} />
            </Tooltip>
        </Flex>
    )
}

export default Title
