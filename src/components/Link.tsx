import type React from "react"

function Link(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    const { className = '', children, ...rest } = props

    const onClick = (e) => {
        props.onClick?.(e)
        if (props.href) {
            window.open(props.href, props.target, '')
        }
    }

    return (
        <div
            {...rest as any}
            className={"inline-block cursor-pointer " + className}
            onClick={onClick}
        >
            {children}
        </div>
    )
}

export default Link