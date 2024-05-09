import React, { useEffect, useRef } from "react";

interface PropsInterface {
    props: {
        options: { name: string, callback: () => void }[],
        cordinates: {
            x: number,
            y: number,
        },
        contextMenu: boolean,
        setContextMenu: (value: boolean) => void;
    }
}
export default function ContextMenu({ props: { options, contextMenu, setContextMenu, cordinates } }: PropsInterface) {

    const contextMenuRef = useRef(null);


    function handleClick(e: React.SyntheticEvent, callback: any) {
        e.stopPropagation();
        setContextMenu(false);
        callback();
    }

    // useEffect(() => {
    //     const handleOutSideClick = (e:any) => {
    //         if (e.target.id !== "context-opener") {
    //             if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as HTMLElement)) {
    //                 setContextMenu(false);
    //             }

    //         }
    //     };
    //     document.addEventListener("click", handleOutSideClick);
    //     return document.removeEventListener("click", handleOutSideClick);
    // }, [])

    return <div className={`bg-dropdown-background fixed py-2 z-[100]  shadow-xl`} ref={contextMenuRef} style={{ top: cordinates.y, left: cordinates.x }}>
        <ul>
            {options.map(({ name, callback }) => (
                <li key={name} onClick={(e) => handleClick(e, callback)} className="px-5 py-2 cursor-pointer hover:bg-background-default-hover"> <span className="text-white">{name}</span></li>
            ))}
        </ul>
    </div>

}