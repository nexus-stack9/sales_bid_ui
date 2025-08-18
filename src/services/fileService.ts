import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';


const fileService = {

uploadFile: async (file, folderName, folderId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', folderName);
    formData.append('id', folderId);

    // Debugging: Log FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/file/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return {
        success: true,
        data: response.data,
        error: null,
      };
    } catch (error) {
      let errorMessage = 'Error uploading file';
      
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'No response from server';
      }

      console.error('Upload error:', error);
      return {
        success: false,
        data: null,
        error: errorMessage,
      };
    }
  }
}
export default fileService;
