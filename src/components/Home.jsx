import { useEffect, useState } from "react";
import { useCollections } from "../hooks/useCollections";
import { useImages } from "../hooks/useImages";
import { useDisplays } from "../hooks/useDisplays";
import { MODEL_TO_ASPECT } from "../config/api";
import Modal from "./Modal";
import CreateCollection from "./CreateCollection";
import DeviceConfigPanel from "./DeviceConfigPanel";

const Home = () => {
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
        displays,
        loading: displaysLoading,
        error: displaysError,
        getDisplays,
        updateDisplay
    } = useDisplays();

    // Local component state
    const [modalOpen, setModalOpen] = useState(false);
    const [currCollection, setCurrCollection] = useState(0);
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
            getDisplays();
        }
    }, []);

    // Handle collection creation
    const handleCreateCollection = async (name, device) => {
        try {
            const newCollection = await createCollection(name, device);
            setCurrCollection(newCollection.id);
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

    // Handle display modification
    const handleUpdateDisplay = async (serialId, newCollection, newDisplayName) => {
        try {
            const updatedDisplay = await updateDisplay(serialId, newCollection, newDisplayName);
            if (updatedDisplay) {
                setCurrCollection(updatedDisplay["collection"]);
            }
        } catch (error) {
            // Error is already handled in the hook
            console.log("Failed to update display");
        }
    };

    const selectCollection = (id) => {
        setCurrCollection(id);
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
    if (collectionsLoading || imagesLoading || displaysLoading) {
        return <div>Loading...</div>;
    }

    // Show error state
    if (collectionsError || imagesError || displaysError) {
        return <div>Error: {collectionsError || imagesError || displaysError}</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Picturesque</h1>
                    <p className="text-gray-300">Manage your digital photo collections</p>
                </div>
                
                <div className="bg-black border border-gray-700 rounded-lg shadow-xl p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-white mb-6">Image Collections</h2>
                    <div className="flex flex-row items-center gap-4 mb-6">
                        {collections ? (
                            <select 
                                className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                                value={currCollection} 
                                onChange={collectionSelected}
                            >
                                <option disabled={true} value={0}>Select a Collection</option>
                                {Object.keys(collections).map((id) => 
                                    <option key={id} value={id}>{collections[id].name}</option>
                                )}
                            </select>
                        ) : <></>}
                        <button 
                            className={`px-6 py-3 rounded-md font-medium transition-colors ${
                                !createOpen 
                                    ? "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                    : "bg-gray-600 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            }`}
                            onClick={() => setCreateOpen(!createOpen)}
                        >
                            {!createOpen ? "Create New" : "Close"}
                        </button>
                    </div>
                    
                    {createOpen && (
                        <div className="mb-6">
                            <CreateCollection createCollection={handleCreateCollection}/>
                        </div>
                    )}
                    
                    {currCollection ? (
                        <div className="mb-6">
                            <button
                                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors font-medium"
                                onClick={() => setModalOpen(true)}>
                                Upload New Image
                            </button>
                        </div>
                    ): <></>}
                    
                    {currCollection ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {currCollection && collections[currCollection].images.map(id => 
                                <div 
                                    key={id} 
                                    onClick={() => onSelectImage(id)}
                                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                                        id === selectedImage 
                                            ? "ring-4 ring-blue-500 shadow-lg transform scale-105" 
                                            : "hover:shadow-lg hover:transform hover:scale-102"
                                    }`}
                                >
                                    <img 
                                        src={images[id]}
                                        alt={`Collection image ${id}`}
                                        className="w-full h-48 object-cover"
                                    />
                                    {id === selectedImage && (
                                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                                            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                Selected
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : <></>}
                    
                    {currCollection && collections[currCollection].images.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <div className="text-6xl mb-4">📷</div>
                            <p className="text-lg mb-2">No images in this collection yet</p>
                            <p className="text-sm">Upload your first image to get started</p>
                        </div>
                    ): <></>}
                    
                    {tempImgSrc && (
                        <div className="mt-6 opacity-50">
                            <img src={tempImgSrc} alt="Uploading..." className="w-48 h-32 object-cover rounded-lg" />
                            <p className="text-sm text-gray-400 mt-2">Uploading...</p>
                        </div>
                    )}
                    
                    {selectedImage && (
                        <div className="mt-6 flex justify-end">
                            <button
                                className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors font-medium"
                                onClick={handleDeleteImage}
                            >
                                Delete Selected Image
                            </button>
                        </div>
                    )}
                </div>
                
                {modalOpen && (
                    <Modal 
                        callback={handleUploadImage}
                        cropDims={MODEL_TO_ASPECT[collections[currCollection].device_model]}
                        closeModal={() => setModalOpen(false)}
                    />
                )}
                
                <div className="bg-black border border-gray-700 rounded-lg shadow-xl p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-white mb-6">Device Configurations</h2>
                    <DeviceConfigPanel 
                        displays={displays}
                        collections={collections}
                        updateDisplay={handleUpdateDisplay}
                        setCurrentCollection={setCurrCollection}
                    />
                </div>
                
                <div className="bg-black border border-gray-700 rounded-lg shadow-xl p-8">
                    <h2 className="text-2xl font-semibold text-white mb-6">Image Library</h2>
                    {images && Object.keys(images).length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {Object.keys(images).map(id => 
                                <div key={id} className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                    <img 
                                        src={images[id]} 
                                        alt={`Image ${id}`} 
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <div className="text-6xl mb-4">🖼️</div>
                            <p className="text-lg mb-2">No images in your library yet</p>
                            <p className="text-sm">Create a collection and upload images to get started</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
