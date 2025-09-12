import { useState, useCallback } from 'react';
import apiClient from '../services/apiClient';
import { getApiEndpoint } from '../config/api';

export const useCollections = () => {
    const [collections, setCollections] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCollections = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.get(getApiEndpoint('IMAGES', 'GET_COLLECTIONS'));
            const newColls = {};
            if (!res.data) {
                console.log("No collection data available");
                return;
            }
            for (const collection of res.data) {
                newColls[collection.id] = collection;
            }
            setCollections(newColls);
        } catch (e) {
            setError(e.message);
            console.log("Error fetching collections:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    const createCollection = useCallback(async (name, device) => {
        setLoading(true);
        setError(null);
        try {
            const body = {
                "collection_name": name,
                "model": device,
            };
            const res = await apiClient.post(getApiEndpoint('IMAGES', 'CREATE_COLLECTION'), body);
            setCollections(prev => ({ ...prev, [res.data.id]: res.data }));
            console.log("Created collection");
            return res.data; // Return the created collection
        } catch (e) {
            setError(e.message);
            console.log("Error creating collection:", e);
            throw e; // Re-throw so component can handle it
        } finally {
            setLoading(false);
        }
    }, []);

    const addCollection = useCallback((id, collection) => {
        setCollections(prev => ({ ...prev, [id]: collection }));
    }, []);

    return {
        collections,
        loading,
        error,
        fetchCollections,
        createCollection,
        addCollection
    };
};
