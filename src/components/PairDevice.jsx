import { useState } from "react";
import apiClient from "../services/apiClient";

const PairDevice = ({ onSuccess, onCancel }) => {
    const [serialId, setSerialId] = useState("");
    const [pairingCode, setPairingCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");
        
        try {
            const pairingData = {
                serial_id: serialId,
                pairing_code: pairingCode
            };
            
            const { data } = await apiClient.post('pi/pair/', pairingData);
            
            setSuccess(data.message || "Device paired successfully!");
            setSerialId("");
            setPairingCode("");
            
            // Call onSuccess callback after a short delay to show success message
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess(data);
                }
            }, 1500);
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to pair device. Please check your credentials and try again.";
            setError(errorMessage);
            console.error('Pairing error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-black border border-gray-700 rounded-lg shadow-xl p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Pair New Device</h2>
                <p className="text-sm text-gray-400">
                    Enter your device's serial ID and pairing code to connect it to your account.
                </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md text-sm">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-md text-sm">
                        {success}
                    </div>
                )}
                
                <div>
                    <label htmlFor="serialId" className="block text-sm font-medium text-gray-300 mb-2">
                        Serial ID
                    </label>
                    <input
                        id="serialId"
                        name="serialId"
                        type="text"
                        required
                        value={serialId}
                        onChange={e => setSerialId(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter device serial ID"
                        disabled={isLoading}
                    />
                </div>
                
                <div>
                    <label htmlFor="pairingCode" className="block text-sm font-medium text-gray-300 mb-2">
                        Pairing Code
                    </label>
                    <input
                        id="pairingCode"
                        name="pairingCode"
                        type="text"
                        required
                        value={pairingCode}
                        onChange={e => setPairingCode(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter pairing code"
                        disabled={isLoading}
                    />
                </div>
                
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                            isLoading 
                                ? 'bg-gray-600 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Pairing...
                            </div>
                        ) : (
                            'Pair Device'
                        )}
                    </button>
                    
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500">
                    <strong>Note:</strong> You can find the serial ID and pairing code on your Raspberry Pi device display or in the device setup documentation.
                </p>
            </div>
        </div>
    );
};

export default PairDevice;
