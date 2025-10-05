import { useState, useCallback } from 'react';
import apiClient from '../services/apiClient';
import { getApiEndpoint } from '../config/api';

export const useDisplays = () => {
    const [displays, setDisplays] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getDisplays = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.get(getApiEndpoint('IMAGES', 'GET_DISPLAYS'));
            const newDisplays = {};
            for (const display of res.data) {
                newDisplays[display["serial_id"]] = display;
            }
            setDisplays(newDisplays);
        } catch (e) {
            setError(e.message);
            console.log("Error fetching displays:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateDisplay = useCallback(async (serialId, newCollection, newDisplayName) => {
        setLoading(true);
        setError(null);
        try {
            const body = {
                "serial_id": serialId,
            };
            
            if (newCollection) {
                body["collection_id"] = newCollection;
            }
            
            if (newDisplayName) {
                body["display_name"] = newDisplayName;
            }
            
            const res = await apiClient.post(getApiEndpoint('IMAGES', 'UPDATE_DISPLAY'), body);
            if (!res.data) {
                console.log("No updated display returned");
                return null;
            }
            setDisplays(prev => ({ ...prev, [res.data["serial_id"]]: res.data }));
            return res.data; // Return the updated display
        } catch (e) {
            setError(e.message);
            console.log("Error updating display:", e);
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        displays,
        loading,
        error,
        getDisplays,
        updateDisplay
    };
};
