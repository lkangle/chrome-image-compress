import { getMimeType, randomStr } from '@/common'
import type { DownImageInput } from '@/types'
import JSZip from '@progress/jszip-esm'

/**
 * 如果是zip包，则先解压
 * @param input
 */
export async function extractImages(input: DownImageInput): Promise<DownImageInput[]> {
    const zip = new JSZip()
    const inputBlob = input.blob
    const images = []

    if (input.filename.endsWith('.zip') || inputBlob.type === 'application/zip') {
        const group = randomStr(2)
        const zipValue = await zip.loadAsync(inputBlob)

        for (const fileEntry of Object.entries(zipValue.files)) {
            const [imageName, zipItem] = fileEntry

            const buffer = await zipItem.async('arraybuffer')
            const mimetype = getMimeType(imageName)
            const blob = new Blob([buffer], { type: mimetype })

            images.push({
                filename: imageName,
                blob,
                group,
            })
        }
    } else {
        images.push(input)
    }
    return images
}

interface NFile {
    file: File
    filename: string
}

export async function zipPack(files: NFile[]): Promise<Blob> {
    const zip = new JSZip()
    files.forEach((f) => {
        zip.file(f.filename, f.file)
    })
    return zip.generateAsync({ type: 'blob' })
}
