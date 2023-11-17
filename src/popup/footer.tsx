import { AdvSetIcon, ChromeIcon, GithubIcon } from "@/icons"
import { version } from "../../package.json"
import { optionsURL } from "@/contants"

function Footer() {
    return (
        <div className="bg-[#f2f5fa] fixed bottom-0 left-0 px-12 w-[100%] h-38 flex justify-between items-center">
            <div className="h-20 flex items-center gap-6">
                <a target="_blank" href="https://baidu.com" className="w-20 h-20 inline-block text-c60">
                    <ChromeIcon />
                </a>
                <a target="_blank" href="https://baidu.com" className="w-19 h-19 inline-block text-c60">
                    <GithubIcon />
                </a>
            </div>
            <div className="h-20 flex items-center gap-6">
                <a target="_blank" href={optionsURL} className="w-16 h-16 inline-block text-c60">
                    <AdvSetIcon />
                </a>
                <span className="text-[14px] text-c60">v{version}</span>
            </div>
        </div>
    )
}

export default Footer