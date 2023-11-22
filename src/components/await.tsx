import { Spin } from 'antd'
import React, { Suspense } from 'react'

import use from '../hooks/use'

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

export function SpinSuspense({ children }: Pick<IProps, 'children'>) {
    return (
        <Suspense
            fallback={
                <div className="text-center w-[100%] pt-44 pb-60">
                    <Spin spinning />
                </div>
            }>
            {children}
        </Suspense>
    )
}

export function AwaitSuspense({ promise, children }: IProps) {
    return (
        <SpinSuspense>
            <Await promise={promise}>{children}</Await>
        </SpinSuspense>
    )
}
