import {useEffect, useState, useRef} from "react";
import axios from "axios";
import {Navigate} from "react-router-dom";
import ImageCropper from "./ImageCropper";
import Modal from "./Modal";
import CreateCollection from "./CreateCollection";

const API_URL = 'http://127.0.0.1:8000/'

const MODEL_TO_ASPECT = {
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

    const fetchImages = async () => {
        await axios.get(API_URL + 'images/getImagesByUser')
            .then((res) => {
                const imObj = {}
                for (const img of res.data) {
                    console.log(img)
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
                console.log("new collections")
                console.log(newColls)
                setCurrCollection(0)
            })
    }

    useEffect(() => {
        if (localStorage.getItem('access_token') === null) {                   
            window.location.href = '/login'
        } else {
            fetchImages()
            fetchCollections()
        }
    }, [])

    const uploadImageUrl = async (dataUrl) => {
        const body = {
            image: dataUrl
        }
        await axios.post(
            API_URL + 'images/uploadImageFile/', body
        ).then((res) => {
            console.log("Upload res")
            fetchImages()
            // console.log(res)
        }).catch((e) => {
            console.log(e)
        });
    };
    const uploadImageToCollection = async (dataUrl) => {
        const body = {
            image_url: dataUrl,
            collection_id: currCollection
        }
        await axios.post(
            API_URL + 'images/uploadImageToCollection/', body
        ).then((res) => {
            console.log("Upload res")
            fetchImages()
            // console.log(res)
        }).catch((e) => {
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
            console.log("created collection")
        }).catch((e) => {
            console.log("Error: %s", e)
        })
    }
    const collectionSelected = (e) => {
        const curr = collections[e.target.value]
        setCurrCollection(curr.id)
        setCropDims(MODEL_TO_ASPECT[collections[curr.id].device_model])
    }


    return (
        <div>
            <h3>Hi {localStorage.getItem('uid')}</h3>
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
            <label>{collections[currCollection].name}</label>: <></>}
            <div className="flex flex-row flex-wrap pt-5">{
                currCollection ? collections[currCollection].images.map(id => 
                    <div key={id}>
                        <img width="200" src={images[id]}></img>
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