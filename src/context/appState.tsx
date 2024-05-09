"use client"
import { AppProvider } from "./appContext";


type AppStateProps = {
    children:React.ReactNode;
}


export default function AppState({children}:AppStateProps){
    return <AppProvider>{children}</AppProvider>
}