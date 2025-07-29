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
    const [createOpen, setCreateOpen] = useState(false)
    const [tempImgSrc, setTempImgSrc] = useState("")

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
                if (!res.data) {
                    console.log("No collection data available")
                    return
                }
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

    useEffect(() => {
        setTempImgSrc("")
    }, [images])
    const reloadImages = async () => {
        await fetchImages()
        await fetchCollections()
    }

    const uploadImageToCollection = async (dataUrl) => {
        const body = {
            image_url: dataUrl,
            collection_id: currCollection
        }
        setTempImgSrc(dataUrl)
        await axios.post(
            API_URL + 'images/uploadImageToCollection/', body
        ).then((res) => {
            console.log("Successfully uploaded image")
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
            for (const config of res.data){
                newConfigs[config["id"]] = config
            }
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
            setCurrCollection(res.data["collection"])
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
        if (id === selectedImage) {
            setSelectedImage(null)
        } else {
            setSelectedImage(id)
        }
    }

    return (
        <div>
                <h2 className="text-lg">Image Collections</h2>
            <div className="card flex flex-col mt-20">
                <div className="flex flex-row h-30">
                    {collections ? (
                    <select className="w-40 h-8" value={currCollection} onChange={collectionSelected}>
                        <option disabled={true} value={0}>Select a Collection</option>
                        {Object.keys(collections).map((id, i) => 
                            <option key={i} value={id}>{collections[id].name}</option>
                        )}
                    </select>) : <></>}
                    <button className="ml-2 p-2 w-13 h-10" onClick={() => setCreateOpen(!createOpen)}>{!createOpen ? "Create New" : "Close"}</button>
                </div>
                {createOpen ? (
                <div className="flex justify-start">
                    <CreateCollection createCollection={createCollection}/>
                </div>
                ) : <div></div>}
                <div className="flex justify-start mt-5">
                    {currCollection ? 
                        <button
                            className="w-25 text-xs"
                            // className="absolute -botto-3 left0 right-0 m-auto w-fit p-[.35rem] rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600"
                            title="Add photo"
                            onClick={() => setModalOpen(true)}>
                            Upload New Image
                        </button> : <></>}
                </div>
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
                    <div className="opacity-20">
                        {tempImgSrc && <img width="200" src={tempImgSrc}></img>}
                    </div>
                </div>
                <div className="flex flex-row space-x-4 justify-end">
                    <div className="relative pt-10">
                        {selectedImage ? <button className="bg-red-500" onClick={deleteImage}>Delete Image</button> : <></>}
                    </div>
                    {modalOpen && (
                        <Modal callback={uploadImageToCollection}
                                cropDims={cropDims}
                                closeModal={() => setModalOpen(false)}/>
                    )}
                </div>
            </div>
            <label className='mb-5'>Device Configurations</label>
            <div className="card">
                <DeviceConfigPanel configs={deviceConfigs}
                    collections={collections}
                    modifyConfig={modifyConfig}
                    setCurrentCollection={setCurrCollection}>
                </DeviceConfigPanel>
            </div>
            <label>Image Library</label>
            <div className="card">
                <div className="flex flex-row flex-wrap pt-5">{
                    images ? Object.keys(images).map(id => 
                        <div key={id}>
                            <img width="200" src={images[id]}></img>
                        </div>
                    ) : <></>}
            </div>
            </div>
        </div>
    )
}

export default Home