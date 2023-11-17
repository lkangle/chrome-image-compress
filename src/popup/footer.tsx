import { AdvSetIcon, ChromeIcon, GithubIcon } from "@/icons"
import { version } from "../../package.json"
import { optionsURL } from "@/contants"
import Link from "@/components/Link"

function Footer() {
    return (
        <div className="dark:bg-[#24292f] dark:text-[#818995] bg-[#f2f5fa] text-c60 fixed bottom-0 left-0 px-12 w-[100%] h-38 flex justify-between items-center">
            <div className="h-20 flex items-center gap-6">
                <Link target="_blank" href="https://baidu.com" className="w-20 h-20">
                    <ChromeIcon />
                </Link>
                <Link target="_blank" href="https://baidu.com" className="w-19 h-19">
                    <GithubIcon />
                </Link>
            </div>
            <div className="h-20 flex items-center gap-6">
                <Link target="_blank" href={optionsURL} className="w-16 h-16">
                    <AdvSetIcon />
                </Link>
                <span className="text-[14px]">v{version}</span>
            </div>
        </div>
    )
}

export default Footer