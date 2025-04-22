import {useEffect, useState, useRef} from "react";
import axios from "axios";
import {Navigate} from "react-router-dom";
import ImageCropper from "./ImageCropper";
import Modal from "./Modal";

const Home = () => {
  const imageUrl = useRef(
    "https://avatarfiles.alphacoders.com/161/161002.jpg"
  );
  const [modalOpen, setModalOpen] = useState(false);

  const uploadImageUrl = (imgSrc) => {
    console.log("uploading image")
    console.log(imgSrc)
    imageUrl.current = imgSrc;
  };
    const [imageFile, setImageFile] = useState('');

    useEffect(() => {
        if(localStorage.getItem('access_token') === null){
            window.location.href = '/login'  
        }
        // else{
        //     (async () => {
        //     try {
        //         const {data} = await axios.get('http://localhost:8000/home/', {
        //         headers: {
        //           'Content-Type': 'application/json',
        //         }
        //       });

        //       setMessage(data.message);
        //     } catch (e) {
        //         console.log('not auth')
        //     }
        // })()};
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImageFile(e.target.files[0])
        }
    }

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
          <img src={imageUrl.current}/>
          <label>{}</label>
        </div>
    )
}

export default Home