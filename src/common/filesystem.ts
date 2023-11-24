export const getItemInfo = (item: DataTransferItem): [boolean, File | any] => {
    if (item.webkitGetAsEntry) {
        const entry = item.webkitGetAsEntry()
        if (entry.isDirectory) {
            return [true, entry]
        }
        return [false, item.getAsFile()]
    } else {
        if (item.kind === 'file' && item.type) {
            return [false, item.getAsFile()]
        }
        return [true, null]
    }
}

export function toFile(entry: any): Promise<File> {
    return new Promise<File>((resolve, reject) => {
        entry.file(resolve, reject)
    })
}

export function readDirectory(entry: FileSystemDirectoryEntry): Promise<File[]> {
    const render = entry.createReader()

    return new Promise<File[]>((resolve, reject) => {
        render.readEntries(async (entries: any[]) => {
            const fileList = []
            for (const innerEntry of entries) {
                if (innerEntry.isDirectory) {
                    const fs = await readDirectory(innerEntry)
                    fileList.push(...fs)
                } else {
                    const f = await toFile(innerEntry)
                    fileList.push(f)
                }
            }
            resolve(fileList)
        }, reject)
    })
}

export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const fr = new FileReader()

        fr.onload = () => {
            resolve(fr.result as string)
        }
        fr.onerror = reject
        fr.readAsDataURL(file)
    })
}
