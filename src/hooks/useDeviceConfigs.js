import { useState, useCallback } from 'react';
import apiClient from '../services/apiClient';
import { getApiEndpoint } from '../config/api';

export const useDeviceConfigs = () => {
    const [deviceConfigs, setDeviceConfigs] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getDeviceConfigs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.get(getApiEndpoint('IMAGES', 'GET_DEVICE_CONFIGS'));
            const newConfigs = {};
            for (const config of res.data) {
                newConfigs[config["id"]] = config;
            }
            setDeviceConfigs(newConfigs);
        } catch (e) {
            setError(e.message);
            console.log("Error fetching device configs:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    const modifyConfig = useCallback(async (newCollection, editConfig) => {
        setLoading(true);
        setError(null);
        try {
            const body = {
                "config_id": editConfig,
                "collection_id": newCollection,
            };
            const res = await apiClient.post(getApiEndpoint('IMAGES', 'UPDATE_DEVICE_CONFIG'), body);
            if (!res.data) {
                console.log("No updated config returned");
                return null;
            }
            setDeviceConfigs(prev => ({ ...prev, [res.data["id"]]: res.data }));
            return res.data; // Return the updated config
        } catch (e) {
            setError(e.message);
            console.log("Error updating device config:", e);
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        deviceConfigs,
        loading,
        error,
        getDeviceConfigs,
        modifyConfig
    };
};
