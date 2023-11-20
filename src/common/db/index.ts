import type { CdnImage } from '@/types'
import Dexie from 'dexie'

import { randomStr } from '../index'

class ImageDB {
    db: Dexie

    table(name: string): Dexie.Table {
        return this.db[name]
    }

    constructor(name = 'zimage_db') {
        const db = new Dexie(name)
        db.version(2).stores({
            images: '++_index,id,name,url',
        })
        this.db = db
    }

    async add(...datas: CdnImage[]): Promise<Required<CdnImage>[]> {
        const images: any = datas.map((d) => {
            if (!d.id) {
                d.id = randomStr(10)
            }
            return d
        })

        await this.table('images').bulkAdd(images)

        return images
    }

    async findPage(page = 0, limit = 20): Promise<CdnImage[]> {
        const offset = page * limit

        return this.table('images').limit(limit).offset(offset).toArray()
    }
}

export default ImageDB
