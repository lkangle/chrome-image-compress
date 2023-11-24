import SparkMD5 from 'spark-md5'

export async function fileHash(file: File) {
    const chunkSize = 1024 * 1e3
    const chunkNum = Math.ceil(file.size / chunkSize)

    const promises: Promise<ArrayBuffer>[] = []

    let start = 0
    for (let index = 0; index < chunkNum; index++) {
        start += index * chunkSize
        const end = start + chunkSize > file.size ? file.size : start + chunkSize

        const b = file.slice(start, end, file.type)
        promises.push(b.arrayBuffer())
    }

    const buffers = await Promise.all(promises)

    const spark = new SparkMD5.ArrayBuffer()
    buffers.forEach((buf) => {
        spark.append(buf)
    })

    const hash = spark.end(false)
    return hash
}

export async function fileHashName(file: File): Promise<string> {
    const hash = await fileHash(file)
    const ext = file.name.split('.').slice(-1)[0]
    return `${hash}.${ext}`
}
