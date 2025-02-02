import React, { FC } from "react";

interface PopupModalProps {
    show: boolean;
    title: string;
    appName: string;
    redirectAfterLogin: string;
    submitBUttonTitle: string;
    onClose: () => void;
    onSubmit: (appName: string, redirectAfterLogin: string) => void;
    onAppNameChange: (value: string) => void;
    onRedirectChange: (value: string) => void;
}

const PopupModal: FC<PopupModalProps> = ({
    show,
    title,
    appName,
    redirectAfterLogin,
    submitBUttonTitle,
    onClose,
    onSubmit,
    onAppNameChange,
    onRedirectChange,
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-black focus:outline-none"
                >
                    ✕
                </button>

                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">App Name</label>
                    <input
                        type="text"
                        value={appName}
                        onChange={(e) => onAppNameChange(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter app name"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Redirect After Login
                    </label>
                    <input
                        type="text"
                        value={redirectAfterLogin}
                        onChange={(e) => onRedirectChange(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter redirect URL"
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => onSubmit(appName, redirectAfterLogin)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
                    >
                        {submitBUttonTitle}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupModal;
