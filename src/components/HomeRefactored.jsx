import { useEffect, useState } from "react";
import { useCollections } from "../hooks/useCollections";
import { useImages } from "../hooks/useImages";
import { useDeviceConfigs } from "../hooks/useDeviceConfigs";
import { MODEL_TO_ASPECT } from "../config/api";
import Modal from "./Modal";
import CreateCollection from "./CreateCollection";
import DeviceConfigPanel from "./DeviceConfigPanel";

const HomeRefactored = () => {
    // Use custom hooks
    const { 
        collections, 
        loading: collectionsLoading, 
        error: collectionsError,
        fetchCollections, 
        createCollection 
    } = useCollections();
    
    const { 
        images, 
        loading: imagesLoading, 
        error: imagesError,
        fetchImages, 
        uploadImageToCollection, 
        deleteImage 
    } = useImages();

    const {
        deviceConfigs,
        loading: deviceConfigsLoading,
        error: deviceConfigsError,
        getDeviceConfigs,
        modifyConfig
    } = useDeviceConfigs();

    // Local component state
    const [modalOpen, setModalOpen] = useState(false);
    const [currCollection, setCurrCollection] = useState(0);
    const [cropDims, setCropDims] = useState();
    const [selectedImage, setSelectedImage] = useState();
    const [createOpen, setCreateOpen] = useState(false);
    const [tempImgSrc, setTempImgSrc] = useState("");

    // Load data on mount
    useEffect(() => {
        if (localStorage.getItem('access_token') === null) {                   
            window.location.href = '/login';
        } else {
            fetchImages();
            fetchCollections();
            getDeviceConfigs();
        }
    }, []);

    // Handle collection creation
    const handleCreateCollection = async (name, device) => {
        try {
            const newCollection = await createCollection(name, device);
            setCurrCollection(newCollection.id);
            setCropDims(MODEL_TO_ASPECT[newCollection.device_model]);
        } catch (error) {
            // Error is already handled in the hook
            console.log("Failed to create collection");
        }
    };

    // Handle image upload
    const handleUploadImage = async (dataUrl) => {
        setTempImgSrc(dataUrl);
        try {
            await uploadImageToCollection(dataUrl, currCollection, fetchCollections);
            setTempImgSrc(""); // Clear temp image on success
        } catch (error) {
            // Error is already handled in the hook
            console.log("Failed to upload image");
        }
    };

    // Handle image deletion
    const handleDeleteImage = async () => {
        try {
            await deleteImage(selectedImage, fetchCollections);
            setSelectedImage(null);
        } catch (error) {
            // Error is already handled in the hook
            console.log("Failed to delete image");
        }
    };

    // Handle device config modification
    const handleModifyConfig = async (newCollection, editConfig) => {
        try {
            const updatedConfig = await modifyConfig(newCollection, editConfig);
            if (updatedConfig) {
                setCurrCollection(updatedConfig["collection"]);
            }
        } catch (error) {
            // Error is already handled in the hook
            console.log("Failed to modify device config");
        }
    };

    const selectCollection = (id) => {
        setCurrCollection(id);
        if (collections && collections[id] && collections[id].device_model) {
            setCropDims(MODEL_TO_ASPECT[collections[id].device_model]);
        } else {
            console.warn('Collection not found or missing device_model:', id, collections);
        }
    };

    const collectionSelected = (e) => {
        const curr = collections[e.target.value];
        selectCollection(curr.id);
    };

    const onSelectImage = (id) => {
        if (id === selectedImage) {
            setSelectedImage(null);
        } else {
            setSelectedImage(id);
        }
    };

    // Show loading state
    if (collectionsLoading || imagesLoading || deviceConfigsLoading) {
        return <div>Loading...</div>;
    }

    // Show error state
    if (collectionsError || imagesError || deviceConfigsError) {
        return <div>Error: {collectionsError || imagesError || deviceConfigsError}</div>;
    }

    return (
        <div>
            <h2 className="text-lg">Image Collections</h2>
            <div className="card flex flex-col mt-20">
                <div className="flex flex-row h-30">
                    {collections ? (
                        <select className="w-40 h-8" value={currCollection} onChange={collectionSelected}>
                            <option disabled={true} value={0}>Select a Collection</option>
                            {Object.keys(collections).map((id) => 
                                <option key={id} value={id}>{collections[id].name}</option>
                            )}
                        </select>
                    ) : <></>}
                    <button 
                        className="ml-2 p-2 w-13 h-10" 
                        onClick={() => setCreateOpen(!createOpen)}
                    >
                        {!createOpen ? "Create New" : "Close"}
                    </button>
                </div>
                
                {createOpen && (
                    <div className="flex justify-start">
                        <CreateCollection createCollection={handleCreateCollection}/>
                    </div>
                )}
                
                <div className="flex justify-start mt-5">
                    {currCollection && cropDims ? (
                        <button
                            className="w-25 text-xs"
                            title="Add photo"
                            onClick={() => setModalOpen(true)}>
                            Upload New Image
                        </button>
                    ) : <></>}
                </div>
                
                <div className="flex flex-row flex-wrap pt-5">
                    {currCollection ? collections[currCollection].images.map(id => 
                        <div key={id} onClick={() => onSelectImage(id)}>
                            <img 
                                width="200" 
                                src={images[id]}
                                alt={`Collection image ${id}`}
                                className={id === selectedImage ? 
                                    "border-sky-500 border-2 border-solid"
                                    : ""}
                            />
                        </div>
                    ) : <></>}
                    <div className="opacity-20">
                        {tempImgSrc && <img width="200" src={tempImgSrc} alt="Uploading..." />}
                    </div>
                </div>
                
                <div className="flex flex-row space-x-4 justify-end">
                    <div className="relative pt-10">
                        {selectedImage ? 
                            <button className="bg-red-500" onClick={handleDeleteImage}>
                                Delete Image
                            </button> : <></>}
                    </div>
                    {modalOpen && (
                        <Modal 
                            callback={handleUploadImage}
                            cropDims={cropDims}
                            closeModal={() => setModalOpen(false)}
                        />
                    )}
                </div>
            </div>
            
            <label className='mb-5'>Device Configurations</label>
            <div className="card">
                <DeviceConfigPanel 
                    configs={deviceConfigs}
                    collections={collections}
                    modifyConfig={handleModifyConfig}
                    setCurrentCollection={setCurrCollection}
                />
            </div>
            
            <label>Image Library</label>
            <div className="card">
                <div className="flex flex-row flex-wrap pt-5">
                    {images ? Object.keys(images).map(id => 
                        <div key={id}>
                            <img width="200" src={images[id]} alt={`Image ${id}`} />
                        </div>
                    ) : <></>}
                </div>
            </div>
        </div>
    );
};

export default HomeRefactored;
