'use client'

import React from "react"

interface InputProps {
    props: {

        name: string,
        state: string,
        setState: (value: string) => void; // Function to update state
        label: boolean,
    }
}
// onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setState(e.target.value)}
export default function Input({ props: { name, state, setState, label } }: InputProps) {
    return <div className="flex gap-1 flex-col">
        {
            label && (
                <label htmlFor={name} className="text-teal-light text-lg px-1">{name}</label>
            )
        }

        <div>
            <input type="text" name={name} value={state} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setState(e.target.value)
            } className="bg-input-background text-start focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full" />
        </div>
    </div>
}