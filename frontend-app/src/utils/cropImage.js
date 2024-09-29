// utils/cropImage.js
export default async function getCroppedImg(imageSrc, croppedAreaPixels) {
    const image = new Image();
    image.src = imageSrc;
  
    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
  
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
  
        ctx.drawImage(
          image,
          croppedAreaPixels.x * scaleX,
          croppedAreaPixels.y * scaleY,
          croppedAreaPixels.width * scaleX,
          croppedAreaPixels.height * scaleY,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
  
        canvas.toBlob((blob) => {
          const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
          const url = URL.createObjectURL(file);
          resolve(url);
        }, "image/jpeg");
      };
    });
  }
  