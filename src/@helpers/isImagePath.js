const isImagePath = (path) => {
  // Define an array of common image file extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'];

  // Extract the file extension from the path
  const fileExtension = path.substring(path.lastIndexOf('.'));

  // Check if the extracted extension is in the array of image extensions
  return imageExtensions.includes(fileExtension.toLowerCase());
};

export default isImagePath;
