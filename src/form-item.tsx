import { Form, type FormItemProps, type FormProps } from 'antd'
import { useEffect, useMemo } from 'react'

type IFormProps = {
    defaultData?: any
} & FormProps

export function ZxForm(props: IFormProps) {
    const { defaultData, ...rest } = props
    const [form] = Form.useForm()

    useEffect(() => {
        form.setFieldsValue(defaultData)
    }, [])

    return (
        <Form {...rest as any} form={form} />
    )
}

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