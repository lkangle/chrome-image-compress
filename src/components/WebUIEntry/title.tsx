import useRootContext from '@/hooks/context'
import { Flex, Switch, Tooltip } from 'antd'

function Title() {
    const { rootContainer } = useRootContext()

    return (
        <Flex justify="space-between">
            <span>图片列表</span>
            <Tooltip
                getPopupContainer={() => rootContainer}
                title={<span className="text-[13px]">高级复制开关</span>}>
                <Switch size="small" />
            </Tooltip>
        </Flex>
    )
}

export default Title
