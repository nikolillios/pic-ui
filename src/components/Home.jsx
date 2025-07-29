import {useEffect, useState, useRef} from "react";
import axios from "axios";
import {Navigate} from "react-router-dom";
import ImageCropper from "./ImageCropper";
import Modal from "./Modal";
import CreateCollection from "./CreateCollection";
import DeviceConfigPanel from "./DeviceConfigPanel";

const API_URL = 'http://127.0.0.1:8000/'

export const MODEL_TO_ASPECT = {
    1: [600, 400],
    2: [800, 480],
    3: [1600, 1200],
}

const Home = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [images, setImages] = useState({});
    const [collections, setCollections] = useState()
    const [currCollection, setCurrCollection] = useState(0)
    const [cropDims, setCropDims] = useState()
    const [selectedImage, setSelectedImage] = useState()
    const [deviceConfigs, setDeviceConfigs] = useState({})

    const fetchImages = async () => {
        await axios.get(API_URL + 'images/getImagesByUser')
            .then((res) => {
                const imObj = {}
                for (const img of res.data) {
                    imObj[img.id] = img.image
                }
                setImages(imObj)
            }).catch((e) => {
                console.log(e)
            });
    }

    const fetchCollections = async () => {
        await axios.get(API_URL + 'images/getCollections')
            .then((res) => {
                const newColls = {}
                for (const collection of res.data) {
                    newColls[collection.id] = collection
                }
                setCollections(newColls)
            })
    }

    useEffect(() => {
        if (localStorage.getItem('access_token') === null) {                   
            window.location.href = '/login'
        } else {
            reloadImages()
            getDeviceConfigs()
        }
    }, [])

    const reloadImages = async () => {
        await fetchImages()
        await fetchCollections()
    }

    const uploadImageToCollection = async (dataUrl) => {
        const body = {
            image_url: dataUrl,
            collection_id: currCollection
        }
        await axios.post(
            API_URL + 'images/uploadImageToCollection/', body
        ).then((res) => {
            console.log("Successfully uploaded image")
            console.log(res.data)
            //TODO: instantly update images
            reloadImages()
        }).catch((e) => {
            console.log("Exception when trying to upload image")
            console.log(e)
        });
    };

    const createCollection = (name, device) => {
        console.log(name)
        console.log(device)
        const body = {
            "collection_name": name,
            "model": device,
        }
        axios.post(
            API_URL + 'images/createCollection', body
        ).then((res) => {
            addCollection(res.data.id, res.data)
            selectCollection(res.data.id)
            console.log("created collection")
        }).catch((e) => {
            console.log("Error: %s", e)
        })
    }

    const deleteImage = () => {
        axios.delete(
            API_URL + 'images/deleteImage/' + selectedImage
        ).then((res) => {
            console.log(`Deleted image: ${selectedImage}`)
            setSelectedImage(null)
            reloadImages()
        }).catch((e) => {
            console.log("Error: %s", e)
        })
    }

    const getDeviceConfigs = () => {
        axios.get(
            API_URL + 'images/getDeviceConfigs'
        ).then((res) => {
            const newConfigs = {}
            console.log("New configs")
            console.log(res.data)
            for (const config of res.data){
                newConfigs[config["id"]] = config
            }
            console.log("new configs")
            console.log(newConfigs)
            setDeviceConfigs(newConfigs)
        }).catch((e) => {
            console.log("Error: %s", e)
        })
    }

    const modifyConfig = (newCollection, editConfig) => {
        const body = {
            "config_id": editConfig,
            "collection_id": newCollection,
        }
        axios.post(
            API_URL + 'images/updateDeviceConfig/', body
        ).then((res) => {
            if (!res.data) {
                console.log("No updated config returned")
            }
            const newConfigs = {...deviceConfigs}
            newConfigs[res.data["id"]] = res.data
            setDeviceConfigs(newConfigs)
        }).catch((e) => {
            console.log("Error: %s", e)
        })
    }

    const addCollection = (id, collection) => {
        const newColls = collections
        newColls[id] = collection
        setCollections(newColls)
    }

    const selectCollection = (id) => {
        setCurrCollection(id)
        setCropDims(MODEL_TO_ASPECT[collections[id].device_model])
    }
    const collectionSelected = (e) => {
        const curr = collections[e.target.value]
        selectCollection(curr.id)
    }

    const onSelectImage = (id) => {
        console.log(`Selecting: ${id}`)
        setSelectedImage(id)
    }

    return (
        <div>
            <h3 className="mb-10">Hi, {localStorage.getItem('uid')}</h3>
            <label>Create Collection</label>
            <CreateCollection createCollection={createCollection}/>
            <label>Select Collection</label><br/>
            {collections ? (
                <select value={currCollection} onChange={collectionSelected}>
                    <option disabled={true} value={0}>Select a Collection</option>
                    {Object.keys(collections).map((id, i) => 
                        <option key={i} value={id}>{collections[id].name}</option>
                    )}
                </select>) : <></>}
            <br/>
            {currCollection ? 
            <label>{collections[currCollection].name}</label>: <></>}<br/>
            {selectedImage ? <button onClick={deleteImage}>Delete Image</button> : <></>}
            <div className="flex flex-row flex-wrap pt-5">{
                currCollection ? collections[currCollection].images.map(id => 
                    <div key={id} onClick={() => onSelectImage(id)}>
                        <img width="200" src={images[id]}
                            className={id === selectedImage ? 
                                       "border-sky-500 border-2 border-solid"
                                       : ""}>
                        </img>
                    </div>
                ) : <></>}
            </div>
            <div className="flex flex-col items-center pt-12 pb-20">
                <div className="relative">
                    {currCollection ? 
                    <button
                        // className="absolute -bottom-3 left-0 right-0 m-auto w-fit p-[.35rem] rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600"
                        title="Add photo"
                        onClick={() => setModalOpen(true)}>
                        Upload Image
                    </button> : <></>}
                </div>
                {modalOpen && (
                    <Modal callback={uploadImageToCollection}
                            cropDims={cropDims}
                            closeModal={() => setModalOpen(false)}/>
                )}
            </div>
            <label>DEVICE CONFIGS</label>
            <DeviceConfigPanel configs={deviceConfigs}
                collections={collections}
                modifyConfig={modifyConfig}>
            </DeviceConfigPanel>
            <label>Image Library</label>
            <div className="flex flex-row flex-wrap pt-5">{
                images ? Object.keys(images).map(id => 
                    <div key={id}>
                        <img width="200" src={images[id]}></img>
                    </div>
                ) : <></>}
            </div>
        </div>
    )
}

export default Home