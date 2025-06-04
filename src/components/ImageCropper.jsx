import { useRef, useState, useEffect } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import setCanvasPreview from "../setCanvasPreview";

const CROP_HEIGHT = 480;
const CROP_WIDTH = 800;
const ASPECT_RATIO = CROP_WIDTH/CROP_HEIGHT;

const ImageCropper = ({ closeModal, uploadImageUrl, cropDims }) => {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [error, setError] = useState("");
  const [cropSelected, setCropSelected] = useState(false);
  const [aspectRatio, setAspectRatio] = useState();

  useEffect(() => {
    setAspectRatio(cropDims[0]/cropDims[1])
  }, [cropDims])

  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        if (error) setError("");
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalHeight < cropDims[0] || naturalWidth < cropDims[1]) {
          setError(`Image must be at least ${cropDims[0]} by ${cropDims[1]} pixels`)
          return setImgSrc("")
        }
      });
      setImgSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  };

  const onUploadCrop = () => {
    const dataUrl = previewCanvasRef.current.toDataURL();
    uploadImageUrl(dataUrl);
    console.log("called uploadImageUrl")
    closeModal();
  }

  const onImageLoad = (e) => {
    const { naturalWidth, naturalHeight, width, height } = e.currentTarget;
    const cropWidthInPercent = (cropDims[0] / naturalWidth) * 100;
    console.log("cro pwidths")
    console.log(naturalWidth)
    console.log(width)

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      aspectRatio,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  return (
    <>
      <label className="block mb-3 w-fit">
        <span className="sr-only">Choose profile photo</span>
        <input
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-gray-700 file:text-sky-300 hover:file:bg-gray-600"
        />
      </label>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {imgSrc && (
        <div className="flex flex-col items-center">
          <ReactCrop
            crop={crop}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            keepSelection
            aspect={aspectRatio}
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Upload"
              style={{ maxHeight: "70vh" }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
          <button
            className="text-white font-mono text-xs py-2 px-4 rounded-2xl mt-4 bg-sky-500 hover:bg-sky-600"
            onClick={() => {
              setCanvasPreview(
                imgRef.current, // HTMLImageElement
                previewCanvasRef.current, // HTMLCanvasElement
                convertToPixelCrop(
                  crop,
                  imgRef.current.width,
                  imgRef.current.height
                )
              );
              setCropSelected(true);
            }}
          >
            Crop Image
          </button>
        </div>
      )}
      {crop && (
        <>
            <label>Preview</label>
            <canvas
            ref={previewCanvasRef}
            className="mt-4"
            style={{
                // display: "none",
                border: "1px solid black",
                objectFit: "contain",
                width: 400,
                height: 240,
            }}
            />
            <button disabled={!cropSelected} onClick={onUploadCrop}>Upload Image to Library</button>
        </>
      )}
    </>
  );
};
export default ImageCropper;