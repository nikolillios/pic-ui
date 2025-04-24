import {useEffect, useState, useRef} from "react";
import axios from "axios";
import {Navigate} from "react-router-dom";
import ImageCropper from "./ImageCropper";
import Modal from "./Modal";

const API_URL = 'http://127.0.0.1:8000/'

const Home = () => {
    const imageUrl = useRef(
        "https://avatarfiles.alphacoders.com/161/161002.jpg"
    );
    const [modalOpen, setModalOpen] = useState(false);

    const uploadImageUrl = async (dataUrl) => {
        console.log("uploading image")
        imageUrl.current = dataUrl;
        console.log(dataUrl)
        const body = {
            image: dataUrl
        }
        await axios.post(
            API_URL + 'images/uploadImageFile/', body
        ).then((res) => {
            print("Upload res")
            // console.log(res)
        }).catch((e) => {
            console.log(e)
        });
    };

    return (
        <div className="flex flex-col items-center pt-12">
            <div className="relative">
            <h3>Hi {localStorage.getItem('uid')}</h3>
            <button
                // className="absolute -bottom-3 left-0 right-0 m-auto w-fit p-[.35rem] rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600"
                title="Change photo"
                onClick={() => setModalOpen(true)}>
                Upload Image
            </button>
            </div>
            {modalOpen && (
                <Modal callback={uploadImageUrl}
                        closeModal={() => setModalOpen(false)}/>
            )}
            <img src={imageUrl.current} width="400"/>
            <label>{}</label>
        </div>
    )
}

export default Home