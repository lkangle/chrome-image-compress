import React from "react"
import use from "./hooks/use"

type IProps = {
    children: React.ReactElement
    promise: Promise<any>
}

function Await({ promise, children }: IProps) {
    const data = use(promise)

    return React.cloneElement(children, {
        data
    })
}

export default Await