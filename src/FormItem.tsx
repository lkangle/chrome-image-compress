import { Form, type FormItemProps } from 'antd'
import { useMemo } from 'react'

function FormItem(props: FormItemProps) {
    let rules = useMemo(() => {
        let rs = props.rules || []
        if (props.required) {
            rs.push({
                required: true,
                message: `'${props.name}'是必填的`
            })
        }
        return rs
    }, [props])

    return <Form.Item {...props} rules={rules} />
}

export default FormItem