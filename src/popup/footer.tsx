import { AdvSetIcon, ChromeIcon, GithubIcon } from "@/icons"
import { version } from "../../package.json"

function Footer() {
    return (
        <div className="fixed bottom-0 left-0 px-12 bg-[#f2f5fa] w-[100%] h-28 flex justify-between items-center">
            <div className="h-20 flex items-center gap-6">
                <a target="_blank" href="https://baidu.com" className="w-20 h-20 inline-block text-c60">
                    <ChromeIcon />
                </a>
                <a target="_blank" href="https://baidu.com" className="w-19 h-19 inline-block text-c60">
                    <GithubIcon />
                </a>
            </div>
            <div className="h-20 flex items-center gap-6">
                <a target="_blank" href="https://baidu.com" className="w-16 h-16 inline-block text-c60">
                    <AdvSetIcon />
                </a>
                <span className="text-[13px] text-c60">v{version}</span>
            </div>
        </div>
    )
}

export default Footer