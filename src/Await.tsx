import { Spin } from 'antd'
import React, { Suspense } from 'react'

import use from './hooks/use'

interface IProps {
    children: React.ReactElement
    promise: Promise<any>
}

function Await({ promise, children }: IProps) {
    const data = use(promise)

    return React.cloneElement(children, {
        data,
    })
}

export default Await

export function AwaitSuspense({ promise, children }: IProps) {
    return (
        <Suspense fallback={<Spin spinning className="w-[100%] pt-60" />}>
            <Await promise={promise}>{children}</Await>
        </Suspense>
    )
}
