import WebUIEntry from '@/components/WebUIEntry'
import { RootContextProvider } from '@/hooks/context'
import { StyleProvider } from '@ant-design/cssinjs'
import cssText2 from 'data-text:./index.less'
import cssText from 'data-text:@/style.less'
import type { PlasmoCSConfig } from 'plasmo'
import { createRoot } from 'react-dom/client'

export const config: PlasmoCSConfig = {
    run_at: 'document_idle',
    matches: [
        'https://lanhuapp.com/*',
        'https://*.figma.com/*',
        'https://mastergo.com/*',
        '*://mastergo.netease.com/*',
    ],
}

const getStyle = () => {
    const style = document.createElement('style')
    style.textContent = cssText + '\n' + cssText2
    return style
}

export const render = async () => {
    const div = document.createElement('zimage-div')
    const shadow = div.attachShadow({ mode: 'open' })

    const style = getStyle()
    const app = document.createElement('div')
    app.id = 'app'
    app.style.position = 'fixed'
    app.style.zIndex = '99999'

    shadow.append(style, app)

    const root = createRoot(app)
    root.render(
        <RootContextProvider value={{ rootContainer: app, shadowElement: div }}>
            <StyleProvider container={shadow} hashPriority="high">
                <WebUIEntry />
            </StyleProvider>
        </RootContextProvider>,
    )

    document.body.append(div)
}
