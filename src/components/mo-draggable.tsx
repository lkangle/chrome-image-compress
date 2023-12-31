import { useLocalStorageState, useThrottleFn } from 'ahooks'
import { useMemo } from 'react'
import Draggable, { type DraggableProps } from 'react-draggable'

type IProps = Omit<DraggableProps, 'defaultPosition'> & {
    onHoverWait: () => void
}

let timer = 0

function MoDraggable(props: Partial<IProps>) {
    const { axis, onHoverWait, onDrag, children, ...rest } = props

    const [position, setPosition] = useLocalStorageState('ZIMAGE_FLOAT_DRAG')
    const { run: onDragFn } = useThrottleFn(
        (_, data: any) => {
            setPosition({ x: data.x, y: data.y })
        },
        { wait: 200 },
    )

    // 保存的默认位置
    const defaultPosition: any = useMemo(() => {
        const { x = 0, y = 0 } = (position || {}) as any

        if (axis === 'both') {
            return { x: x || 0, y: y || 0 }
        }
        if (axis === 'x') {
            return { x: x || 0, y: 0 }
        }
        if (axis === 'y') {
            return { x: 0, y: y || 0 }
        }
        return { x: 0, y: 0 }
    }, [])

    const onMouseEnter = () => {
        timer = window.setTimeout(() => {
            onHoverWait?.()
        }, 333)
    }
    const onMouseLeave = () => {
        window.clearTimeout(timer)
    }
    const onMouseDown = () => {
        onMouseLeave()
    }

    const onInDrag = (e, data) => {
        onDrag?.(e, data)
        onDragFn(e, data)

        onMouseLeave()
    }

    return (
        <div
            data-id="memory-drag"
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}>
            <Draggable {...rest} axis={axis} defaultPosition={defaultPosition} onDrag={onInDrag}>
                {children}
            </Draggable>
        </div>
    )
}

export default MoDraggable
