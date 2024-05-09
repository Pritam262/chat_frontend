import React from "react";
import ReactDOM from "react-dom"
interface PropsInterface {
    props: {
        // onChange: () => void,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Include event type
        setState?: (value: string) => void;
    }
}

export default function PhotoPicker({ props: { onChange } }: PropsInterface) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const handleClick = () => {
        inputRef.current?.click(); // Safely access and click the input
    };
    const component = <input type="file" hidden id="photo-picker" onChange={onChange} />

    // @ts-ignore
    return ReactDOM.createPortal(component, document.getElementById("photo-picker-element"))
    // return (
    //     <div onClick={handleClick}>  {/* Button or element to trigger file selection*/}
    //   {/* Optional: Add visual representation of a photo picker here */}
    // </div>
    // )
}