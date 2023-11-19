import type { UnionImage } from '@/types'

function useCopyRule() {
    const setRule = () => {}

    const parse = (url: string) => {
        return url
    }

    const parseGroup = (item: UnionImage) => {
        return item.url
    }

    return {
        setRule,
        parse,
        parseGroup,
    }
}

export default useCopyRule
