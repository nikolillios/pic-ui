import { useState, useEffect } from 'react';
import { MODEL_TO_ASPECT } from "../config/api";
import editIcon from "../assets/white_pencil.png";

const DeviceConfigPanel = ({displays, collections, updateDisplay, setCurrentCollection}) => {

    const [editDisplay, setEditDisplay] = useState()
    const [newCollection, setNewCollection] = useState()
    const [error, setError] = useState("")

    const onCollectionChanged = (e) => {
        const selectedCollectionId = e.target.value;
        setNewCollection(selectedCollectionId)
        setCurrentCollection(selectedCollectionId)
        
        // Clear any previous error when collection changes
        setError("")
        
        // Real-time validation for compatibility
        if (editDisplay && collections && selectedCollectionId) {
            const currentCollection = displays[editDisplay].collection;
            if (currentCollection == selectedCollectionId) {
                setError("Same collection");
            } else if (collections[currentCollection] && collections[selectedCollectionId] && 
                      collections[currentCollection].device_model !== collections[selectedCollectionId].device_model) {
                setError("Incompatible models");
            }
        }
    }
    
    const onEditSubmitted = () => {
        if (!collections || !newCollection || !(newCollection in collections)) return;
        
        // Don't submit if there's an error
        if (error) return;
        
        console.log(`SETTING DISPLAY ${displays[editDisplay].display_name} to ${newCollection}`)
        setError("")
        updateDisplay(editDisplay, newCollection, null)
        setEditDisplay(undefined)
    }

    const editClicked = (serialId) => {
        if (!displays) return;
        setEditDisplay(serialId)
        setNewCollection(displays[serialId].collection)
        setError("") // Clear any previous error when starting to edit
    }

    return (
        <div className='flex flex-col'>
            {displays ? Object.keys(displays).map((serialId, i) => 
                <div className="bg-gray-800 border-gray-600 border rounded-md flex flex-col p-5 text-left" key={i}>
                    <div>
                        <label className='font-bold text-gray-300'>Device: </label>
                        <span className="text-white">{displays[serialId].display_name}</span>
                    </div>
                    <div>
                        <label className='font-bold text-gray-300'>Collection: </label>
                        {editDisplay === serialId && collections ?
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
                            {collections && displays[serialId].collection ? (
                                <label className="text-white">{collections[displays[serialId].collection].name}</label>
                            ) : (
                                <label className="text-gray-400 italic">No collection assigned</label>
                            )}
                            <button className='p-1 ml-2 bg-gray-700 hover:bg-gray-600 rounded' onClick={() => editClicked(serialId)}>
                                <img className="w-4 inline-block" src={editIcon} alt="edit"></img>
                            </button>
                        </>}
                    </div>
                    <div>
                        <label className='font-bold text-gray-300'>Dimensions: </label>
                        <span className="text-blue-400">{MODEL_TO_ASPECT[displays[serialId].device_model].join("x")}</span>
                    </div>
                </div>
            ): <></>}
        </div>
    )
}

export default DeviceConfigPanel;
