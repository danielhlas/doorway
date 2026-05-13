import { useAppwrite } from "@/hooks/useAppwrite";
import React, { createContext, useContext } from "react";
import { getCurrentUser } from "./appwrite";

type User = {
    $id: string,
    name: string,
    email: string,
    avatar: string
}

type ContextType = {
    logged: boolean,
    data: User | null,
    loading: boolean,
    refetch: (newParams: Record<string, string | number>) => Promise<void>
}

//Context:
const Context = createContext<ContextType | undefined>(undefined)

//Provider Component:
export function ContextProvider({ children }: { children: React.ReactNode }) {

    const { data, loading, refetch } = useAppwrite({ fn: getCurrentUser })

    const logged = !!data;
    /*Dva vykřičníky ptž zavoláním ! na null získáme true, a druhý ! převede true na false 
     zavoláme-li však ! na existující obj (ten obsahuje např property name), získáme false ptž {} je v JS truthy value,
     a druhý vykřiční z toho udělá true */


    return (
        <Context.Provider value={{
            logged,
            data: data ?? null,
            loading,
            refetch
        }}>
            {children}
        </Context.Provider>
    )
}



export function useGlobalContext() {
    const context = useContext(Context)

    if (!context) {
        throw new Error("useGlobalContext must be used within a ContextProvider")
    }

    return context;
}

export default ContextProvider;