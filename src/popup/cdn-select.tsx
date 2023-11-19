import { getCdnConfig } from '@/common/config'
import { cdnMenuItems, optionsURL } from '@/common/contants'
import useAsyncState from '@/hooks/useAsyncState'
import { Select } from 'antd'
import { entries, isEmpty, map } from 'lodash-es'

function CdnSelect({ value, onChange }: any) {
    const [options] = useAsyncState(async () => {
        const c = await getCdnConfig()
        const opts = entries(c)
            .map(([key, value]) => {
                if (isEmpty(value)) {
                    return false
                }
                return cdnMenuItems.find((it) => it.key === key)
            })
            .filter(Boolean)

        if (isEmpty(opts)) {
            return []
        }
        return [{ key: false, label: '禁用' }, ...opts]
    })

    return (
        <div>
            <Select
                value={value}
                onChange={onChange}
                className="w-[100%]"
                style={{ display: isEmpty(options) ? 'none' : '' }}>
                {map(options, (op: any) => (
                    <Select.Option key={op.key} value={op.key}>
                        {String(op.label).replace('图床', '')}
                    </Select.Option>
                ))}
            </Select>
            {isEmpty(options) && (
                <a type="link" target="__blank" href={optionsURL}>
                    去配置
                </a>
            )}
        </div>
    )
}

export default CdnSelect
