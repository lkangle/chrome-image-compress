import React, { useContext } from "react"

interface IContext {
    rootContainer: HTMLElement
    shadowElement: HTMLElement
}

const context = React.createContext<IContext>({} as any)

export default function useRootContext(): IContext {
    return useContext(context) as any
}

export const RootContextProvider = context.Provider