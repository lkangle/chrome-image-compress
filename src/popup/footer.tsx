import { optionsURL, uploadTabURL } from '@/common/contants'
import Link from '@/components/Link'
import { ChromeOutlined, GithubOutlined, SettingOutlined } from '@ant-design/icons'

import { version } from '../../package.json'

function Footer() {
    return (
        <div className="fixed bottom-0 left-0 flex h-38 w-[100%] items-center justify-between bg-[#f2f5fa] px-12 text-[16px] text-c60 dark:bg-[#24292f] dark:text-[#818995]">
            <div className="flex items-center gap-8">
                <Link target="_blank" href={uploadTabURL}>
                    <ChromeOutlined />
                </Link>
                <Link target="_blank" href="https://github.com/lkangle/chrome-image-compress">
                    <GithubOutlined />
                </Link>
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
