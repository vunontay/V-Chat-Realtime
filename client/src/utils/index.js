export const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp|tiff|svg)(\?.*)?$/i;
    return imageRegex.test(filePath);
};
