import { array2buf, buf2Array } from '@/common'
import { assign, entries, isArray, isObject } from 'lodash-es'

interface BlobObject {
    name: string
    type: string
    dataArray: number[]
    _type: string
}

interface ArgStruct {
    type: 'blob' | 'formData' | 'object' | 'array' | string
    data: any
}

const file2Object = async (file: File | any): Promise<BlobObject> => {
    const buffer = await file.arrayBuffer()
    const array = buf2Array(buffer)

    return {
        name: file.name,
        type: file.type,
        dataArray: array,
        _type: 'blob',
    }
}

const object2File = (data: BlobObject) => {
    const { dataArray, name, type } = data
    return new File([array2buf(dataArray)], name, { type })
}

async function toStruct(arg: any): Promise<ArgStruct> {
    if (arg instanceof Blob) {
        const data = await file2Object(arg)
        return { type: 'blob', data }
    }

    if (arg instanceof FormData) {
        let formEntries: any[] = Array.from(arg.entries())
        formEntries = await Promise.all(
            formEntries.map(async ([key, value]) => {
                if (value instanceof Blob) {
                    const o = await file2Object(value)
                    return [key, o]
                }
                return [key, value]
            }),
        )

        const data = formEntries.reduce((data, item) => {
            const [key, value] = item
            return {
                ...data,
                [key]: value,
            }
        }, {})

        return { type: 'formData', data }
    }

    if (isObject(arg) || isArray(arg)) {
        const promises = entries(arg).map(async ([key, value]) => {
            const data = await toStruct(value)
            return {
                [key]: data,
            }
        })

        const objList = await Promise.all(promises)
        const data = objList.reduce((ob, item) => {
            return assign(ob, item)
        }, {})

        return { type: isArray(arg) ? 'array' : 'object', data }
    }

    return { type: '', data: arg }
}

function fromStruct(arg: ArgStruct): any {
    const type = arg.type

    let value: any

    switch (type) {
        case 'blob': {
            value = object2File(arg.data)
            break
        }
        case 'formData': {
            const fd = new FormData()

            entries(arg.data).forEach(([key, value]) => {
                if (isObject(value)) {
                    const file = object2File(value as any)
                    fd.append(key, file)
                } else {
                    fd.append(key, value as string)
                }
            })

            value = fd
            break
        }
        case 'object':
        case 'array': {
            const data = entries(arg.data).reduce(
                (res, [key, value]) => {
                    const o = fromStruct(value as any)
                    res[key] = o
                    return res
                },
                type === 'array' ? [] : {},
            )

            value = data
            break
        }
        default: {
            value = arg.data
        }
    }

    return value
}

export async function stringifyArgs(...args: any[]): Promise<ArgStruct[]> {
    return Promise.all(args.map((arg) => toStruct(arg)))
}

export function parseArgs(...args: ArgStruct[]): any[] {
    return args.map((arg) => fromStruct(arg))
}
