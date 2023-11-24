import { optionsURL, uploadTabURL } from '@/common/contants'
import Link from '@/components/Link'
import { ChromeOutlined, GithubOutlined, SettingOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'

import { version } from '../../package.json'

function Footer() {
    return (
        <div className="dark:bg-[#24292f] dark:text-[#818995] bg-[#f2f5fa] text-[16px] text-c60 fixed bottom-0 left-0 px-12 w-[100%] h-38 flex justify-between items-center">
            <div className="flex items-center gap-8">
                <Link target="_blank" href={uploadTabURL}>
                    <ChromeOutlined />
                </Link>
                <Tooltip title="敬请期待" placement="right">
                    <Link target="_blank" href="javascript:">
                        <GithubOutlined />
                    </Link>
                </Tooltip>
            </div>
            <div className="flex items-center gap-8">
                <Link target="_blank" href={optionsURL}>
                    <SettingOutlined />
                </Link>
                <span className="text-[14px]">v{version}</span>
            </div>
        </div>
    )
}

export default Footer
