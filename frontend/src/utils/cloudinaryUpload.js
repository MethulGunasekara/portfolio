import axios from 'axios';

export const uploadToCloudinary = async (file) => {
  try {
    // 1. Get the secure signature and timestamp from our Express backend
    const token = localStorage.getItem('adminToken');
    const signatureRes = await axios.get('/api/admin/cloudinary-signature', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const { timestamp, signature } = signatureRes.data;
    console.log("Signature securely obtained.");

    // 2. Prepare the multipart form data payload for Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', 'portfolio_assets'); 

    // 3. Send the file directly to Cloudinary's upload API
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`;
    
    const uploadRes = await axios.post(cloudinaryUrl, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    console.log("Upload successful!");
    return uploadRes.data.secure_url; 

  } catch (error) {
    console.error("Error during Cloudinary upload:", error);
    throw error;
  }
};