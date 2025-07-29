import axios from "axios"
import { useState, useEffect } from 'react'

const CreateCollection = ({createCollection}) => {
    const modelToSize = {
        "4in0e": (800, 480),
        "7in3e": (600, 400),
        "13in3e": (1600, 1200),
    }
    const SUPPORTED_EPAPER = [
        "4inch E-Paper",
        "7.3inch E-Paper",
        "13.3inch E-Paper",
    ]
    const [name, setName] = useState("")
    const [device, setDevice] = useState(-1)
    const [error, setError] = useState("")
    const nameChanged = (e) => {
        setName(e.target.value)
    }
    const deviceChanged = (e) => {
        setError("")
        setDevice(e.target.value)
    }
    const submitCollection = () => {
        if (!name) {
            setError("Please provide a name for the collection")
            return
        }
        if (device === -1) {
            setError("You must select a device")
            return
        }
        createCollection(name, device)
        setName("")
        setDevice(-1)
    }
    return (
        <form action={submitCollection} className="flex flex-col justify-start">
            <label className="m-2">Name</label>
            <input type="text" value={(name)} onChange={nameChanged}></input>
            <label className="m-2">Device Model</label>
            <select onChange={deviceChanged} value={device}>
                <option key={-1} value={-1}>Select Device</option>
                {SUPPORTED_EPAPER.map((model, i) => 
                    <option key={i} value={i}>{model}</option>
                )}
            </select><br/>
            <label>{error}</label>
            <button className="text-xs p-2" type="submit">Create</button>
        </form>
    )
}

export default CreateCollection;