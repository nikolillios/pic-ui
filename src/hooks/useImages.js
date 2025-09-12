import { useState, useCallback } from 'react';
import apiClient from '../services/apiClient';
import { getApiEndpoint } from '../config/api';

export const useImages = () => {
    const [images, setImages] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchImages = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.get(getApiEndpoint('IMAGES', 'GET_BY_USER'));
            const imObj = {};
            for (const img of res.data) {
                imObj[img.id] = img.image;
            }
            setImages(imObj);
        } catch (e) {
            setError(e.message);
            console.log("Error fetching images:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    const uploadImageToCollection = useCallback(async (dataUrl, collectionId, refreshCollections) => {
        setLoading(true);
        setError(null);
        try {
            const body = {
                image_url: dataUrl,
                collection_id: collectionId
            };
            await apiClient.post(getApiEndpoint('IMAGES', 'UPLOAD_TO_COLLECTION'), body);
            console.log("Successfully uploaded image");
            // Refresh images after upload
            await fetchImages();
            // Also refresh collections if callback provided
            if (refreshCollections) {
                await refreshCollections();
            }
        } catch (e) {
            setError(e.message);
            console.log("Exception when trying to upload image:", e);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [fetchImages]);

    const deleteImage = useCallback(async (imageId, refreshCollections) => {
        setLoading(true);
        setError(null);
        try {
            await apiClient.delete(getApiEndpoint('IMAGES', 'DELETE_IMAGE') + imageId);
            console.log(`Deleted image: ${imageId}`);
            // Remove from local state
            setImages(prev => {
                const newImages = { ...prev };
                delete newImages[imageId];
                return newImages;
            });
            // Also refresh collections if callback provided
            if (refreshCollections) {
                await refreshCollections();
            }
        } catch (e) {
            setError(e.message);
            console.log("Error deleting image:", e);
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        images,
        loading,
        error,
        fetchImages,
        uploadImageToCollection,
        deleteImage
    };
};
