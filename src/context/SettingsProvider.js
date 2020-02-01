import React, {useState} from 'react';

export const SettingsContext = React.createContext()

export default function SettingsProvider(props) {
    const [size,setSize] = useState(4)
    const [mines,setMines] = useState(4)

    return (
        <SettingsContext.Provider
            value={{
                size,setSize,
                mines,setMines
            }}>
            {props.children}
        </SettingsContext.Provider>
    )
}