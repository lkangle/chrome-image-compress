import SparkMD5 from 'spark-md5'

export async function fileHash(file: File) {
    const chunkSize = 1024 * 1e3
    const chunkNum = Math.ceil(file.size / chunkSize)

    const promises: Promise<ArrayBuffer>[] = []

    let start = 0
    for (let index = 0; index < chunkNum; index++) {
        start += index * chunkSize
        const end = start + chunkSize > file.size ? file.size : start + chunkSize

        console.log('[[start, end', start, end)

        const b = file.slice(start, end, file.type)
        promises.push(b.arrayBuffer())
    }

    const buffers = await Promise.all(promises)

    const spark = new SparkMD5.ArrayBuffer()
    buffers.forEach((buf) => {
        spark.append(buf)
    })

    const hash = spark.end(false)

    const allBuffer = await file.arrayBuffer()

    const allHash = SparkMD5.ArrayBuffer.hash(allBuffer, false)

    console.log('hash对比:', hash, allHash, hash === allHash)
    return hash
}
