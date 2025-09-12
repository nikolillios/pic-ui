const setCanvasPreview = (
  image, // HTMLImageElement
  canvas, // HTMLCanvasElement
  crop, // PixelCrop
  targetWidth = null, // Target width to scale to
  targetHeight = null // Target height to scale to
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2d context");
  }

  const pixelRatio = window.devicePixelRatio;
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Calculate the actual crop dimensions in natural image coordinates
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;
  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  // Use target dimensions if provided, otherwise use crop dimensions
  const finalWidth = targetWidth || cropWidth;
  const finalHeight = targetHeight || cropHeight;

  // Set canvas to final dimensions
  canvas.width = Math.floor(finalWidth * pixelRatio);
  canvas.height = Math.floor(finalHeight * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";
  ctx.save();

  // Draw the cropped portion of the image, scaled to target dimensions
  ctx.drawImage(
    image,
    cropX, cropY, cropWidth, cropHeight, // Source: cropped area
    0, 0, finalWidth, finalHeight // Destination: full canvas at target size
  );

  ctx.restore();
};
export default setCanvasPreview;
