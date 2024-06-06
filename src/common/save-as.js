import { saveAs as save_as } from 'file-saver'

export const saveAs = (blob, filename) => {
    // Remove the @1x, @2x, @3x from the filename
    const name = filename.replace(/@[1-3]x\.(\w+\.)?/, '.')
    save_as(blob, name)
}
