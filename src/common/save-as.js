import { saveAs as save_as } from 'file-saver'

export const saveAs = (blob, filename) => {
    const name = filename.replace(/@([1-3])x\.(\w+\.)?/, (_, $0) => {
        return `-${$0}x.`
    })
    save_as(blob, name)
}
