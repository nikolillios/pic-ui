import { useState, useEffect } from 'react';
import { MODEL_TO_ASPECT } from "../config/api";
import editIcon from "../assets/white_pencil.png";

const DeviceConfigPanel = ({configs, collections, modifyConfig, setCurrentCollection}) => {

    const [editConfig, setEditConfig] = useState()
    const [newCollection, setNewCollection] = useState()
    const [error, setError] = useState("")

    const onCollectionChanged = (e) => {
        const selectedCollectionId = e.target.value;
        setNewCollection(selectedCollectionId)
        setCurrentCollection(selectedCollectionId)
        
        // Clear any previous error when collection changes
        setError("")
        
        // Real-time validation for compatibility
        if (editConfig && collections && selectedCollectionId) {
            const editCollection = configs[editConfig].collection;
            if (editCollection == selectedCollectionId) {
                setError("Same collection");
            } else if (collections[editCollection].device_model !== collections[selectedCollectionId].device_model) {
                setError("Incompatible models");
            }
        }
    }
    
    const onEditSubmitted = () => {
        if (!collections || !newCollection || !(newCollection in collections)) return;
        
        // Don't submit if there's an error
        if (error) return;
        
        console.log(`SETTING CONFIG ${configs[editConfig].name} to ${newCollection}`)
        setError("")
        modifyConfig(newCollection, editConfig)
        setEditConfig(undefined)
    }

    const editClicked = (id) => {
        if (!configs) return;
        setEditConfig(id)
        setNewCollection(configs[id].collection)
        setError("") // Clear any previous error when starting to edit
    }

    return (
        <div className='flex flex-col'>
            {configs ? Object.keys(configs).map((id, i) => 
                <div className="bg-gray-800 border-gray-600 border rounded-md flex flex-col p-5 text-left" key={i}>
                    <div>
                        <label className='font-bold text-gray-300'>Device: </label>
                        <span className="text-white">{configs[id].name}</span>
                    </div>
                    <div>
                        <label className='font-bold text-gray-300'>Collection: </label>
                        {editConfig && collections ?
                        <div className='inline-block'>
                            <select 
                                value={newCollection} 
                                onChange={onCollectionChanged}
                                className="bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                            >
                                {Object.keys(collections).map(
                                    (id, i) => 
                                        <option key={i} value={id}>{collections[id].name}</option>
                                )}
                            </select>
                            {error && <p className="text-red-400 text-xs">{error}</p>}
                            <button 
                                className={`w-14 m-2 text-xs bg-green-600 text-white rounded px-2 py-1 ${error ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
                                onClick={onEditSubmitted}
                                disabled={!!error}
                            >
                                Save
                            </button>
                        </div>
                        : <>
                            {collections && <label className="text-white">{collections[configs[id].collection].name}</label>}
                            <button className='p-1 ml-2 bg-gray-700 hover:bg-gray-600 rounded' onClick={() => editClicked(id)}>
                                <img className="w-4 inline-block" src={editIcon} alt="edit"></img>
                            </button>
                        </>}
                    </div>
                    <div>
                        <label className='font-bold text-gray-300'>Dimensions: </label>
                        <span className="text-blue-400">{MODEL_TO_ASPECT[configs[id].device_model].join("x")}</span>
                    </div>
                </div>
            ): <></>}
        </div>
    )
}

export default DeviceConfigPanel;
