export interface ImageEntry {
    name: string;
    width: number;
    height: number;
    size: number;
    url: string
}

export interface CdnImage extends ImageEntry {
    id?: string | number;
    uploadTime: number
}

export type UnionImage = CdnImage & {
    img2x: CdnImage
}

