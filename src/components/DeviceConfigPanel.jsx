import { useState, useEffect } from 'react';
import {MODEL_TO_ASPECT} from "./Home";
import editIcon from "../assets/white_pencil.png";

const DeviceConfigPanel = ({configs, collections, modifyConfig, setCurrentCollection}) => {

    const [editConfig, setEditConfig] = useState()
    const [newCollection, setNewCollection] = useState()
    const [error, setError] = useState("")

    const onCollectionChanged = (e) => {
        setNewCollection(e.target.value)
        setCurrentCollection(e.target.value)
    }
    
    const onEditSubmitted = () => {
        if (!collections || !newCollection || !(newCollection in collections)) return;
        const editCollection = configs[editConfig].collection
        if (editCollection == newCollection) {
            setError("Same collection")
            return
        }
        if (collections[editCollection].device_model !== collections[newCollection].device_model) {
            setError("Incompatible models")
            return
        }
        console.log(`SETTING CONFIG ${configs[editConfig].name} to ${newCollection}`)
        setError("")
        modifyConfig(newCollection, editConfig)
        setEditConfig(undefined)
    }

    const editClicked = (id) => {
        if (!configs) return;
        setEditConfig(id)
        setNewCollection(configs[id].collection)
    }

    return (
        <div className='flex flex-col'>
            {configs ? Object.keys(configs).map((id, i) => 
                <div className="border-grey-500 border-1 border rounded-md flex flex-col p-5 text-left" key={i}>
                    <div>
                        <label className='font-bold'>Device: </label>
                        <span>{configs[id].name}</span>
                    </div>
                    <div>
                        <label className='font-bold'>Collection: </label>
                        {editConfig && collections ?
                        <div className='inline-block'>
                            <select value={newCollection} onChange={onCollectionChanged}>{Object.keys(collections).map(
                                (id, i) => 
                                    <option key={i} value={id}>{collections[id].name}</option>
                            )}</select>
                            {error && <p className="text-red-400 text-xs">{error}</p>}
                            <button className='w-14 m-2 text-xs' onClick={onEditSubmitted}>Save</button>
                        </div>
                        : <>
                            {collections && <label>{collections[configs[id].collection].name}</label>}
                            <button className='p-1 ml-2' onClick={() => editClicked(id)}>
                                <img className="w-4 inline-block" src={editIcon} alt="edit"></img>
                            </button>
                        </>}
                    </div>
                    <div>
                        <label className='font-bold'>Dimensions: </label>
                        <span>{MODEL_TO_ASPECT[configs[id].device_model].join("x")}</span>
                    </div>
                </div>
            ): <></>}
        </div>
    )
}

export default DeviceConfigPanel;
