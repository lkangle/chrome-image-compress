function use<T>(_promise: Promise<T>): T {
    const promise: any = _promise
    if (promise.status === 'fulfilled') {
        return promise.value
    }

    if (promise.status === 'rejected') {
        throw promise.reason
    } else if (promise.status === 'pending') {
        throw promise
    } else {
        promise.status = 'pending'
        promise.then(
            (result: T) => {
                promise.status = 'fulfilled'
                promise.value = result
            },
            (reason: Error) => {
                promise.status = 'rejected'
                promise.reason = reason
            },
        )
        throw promise
    }
}

export default use
