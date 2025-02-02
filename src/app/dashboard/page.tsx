"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import PopupModal from "@/components/PopupModal"

export default function Dashboard() {
    interface App {
        appID: string;
        appName: string;
        redirectAfterLogin: string;
        createdAt: string;
    }

    const [apps, setApps] = useState<App[]>([]);
    const [loading, setLoading] = useState(true);
    const [newApp, setNewApp] = useState({
        appName: "",
        redirectAfterLogin: "/dashboard",
    });
    const [selectedAppIndex, setSelectedAppIndex] = useState<number | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const  handleAddApp = async (appName: string, redirectAfterLogin: string) => {
        if (!appName.trim()) {
            alert("App Name is required!");
            return;
        }

        try {
            await axios.post("/api/app/register", newApp);
            alert("App added successfully!");
            fetchApps();
        } catch (error) {
            console.error("Error adding app:", error);
            alert("Error adding app. Please try again later.");
        }
        setNewApp({ appName: "", redirectAfterLogin: "/dashboard" });
        setShowAddModal(false);
    };
    
    const handleUpdateApp = async (appName: string, redirectAfterLogin: string) => {
    
            if (!appName.trim()) {
                alert("App Name is required!");
                return;
            }
            const selectedApp = apps[selectedAppIndex!];
    
            try {
                
                await axios.post(`/api/app/update/${selectedApp.appID}`, { appName, redirectAfterLogin });
                alert("App updated successfully!");
                fetchApps();
            } catch (error) {
                console.error("Error updating app:", error);
                alert("Error updating app. Please try again later.");
            }
            setNewApp({ appName: "", redirectAfterLogin: "/dashboard" });
            setShowUpdateModal(false);
        };

    const fetchApps = async () => {
        try {
            const response = await axios.get("/api/app/fetchApp");
            setApps(response.data.data || []);
        } catch (err) {
            console.error("Error fetching apps:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApps();
    }, []);

    return (
        <div className="flex flex-col gap-10 px-[10%] mt-[5%]">
            {/* New App Button */}
            <div>
            <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
            >
                New App
            </button>

            <PopupModal
                show={showAddModal}
                title="Add New App"
                appName={newApp.appName}
                redirectAfterLogin={newApp.redirectAfterLogin}
                submitBUttonTitle="Add App"
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddApp}
                onAppNameChange={(value) =>
                    setNewApp({ ...newApp, appName: value })
                }
                onRedirectChange={(value) =>
                    setNewApp({ ...newApp, redirectAfterLogin: value })
                }
            />
        </div>

            {/* App Details Table */}
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:py-1 mb-[5%]">
                <h4 className="mb-6 text-xl font-semibold text-black">App Details</h4>
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-">
                    {loading ? (
                        <p>Loading...</p>
                    ) : apps.length === 0 ? (
                        <p>No Details</p>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-2 dark:bg-meta-4">
                                    <th className="p-2.5 text-sm font-medium uppercase xsm:text-base xl:p-5 text-center">
                                        App ID
                                    </th>
                                    <th className="p-2.5 text-sm font-medium uppercase xsm:text-base xl:p-5 text-center">
                                        App Name
                                    </th>
                                    <th className="hidden p-2.5 text-sm font-medium uppercase xsm:text-base xl:p-5 text-center sm:table-cell">
                                        Login Redirects
                                    </th>
                                    <th className="hidden p-2.5 text-sm font-medium uppercase xsm:text-base xl:p-5 text-center sm:table-cell">
                                        Created At
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {apps.map((app, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-stroke dark:border-strokedark hover:bg-gray-100"
                                    >
                                        <td className="p-2.5 xl:p-5 text-center">
                                            <p className="text-black">{app.appID}</p>
                                        </td>
                                        <td className="p-2.5 text-center xl:p-5">
                                            <p className="text-black">{app.appName}</p>
                                        </td>
                                        <td className="hidden p-2.5 text-center sm:table-cell xl:p-5">
                                            <p className="text-black">{app.redirectAfterLogin}</p>
                                        </td>
                                        <td className="hidden p-2.5 text-center sm:table-cell xl:p-5">
                                            <p className="text-meta-5">
                                                {format(
                                                    toZonedTime(new Date(app.createdAt), "Asia/Kolkata"),
                                                    "MMM dd, yyyy, h:mm a"
                                                )}
                                            </p>
                                        </td>
                                        {/* Add a column for the three-dot menu */}
                                        <td className="p-2.5 xl:p-5 text-center relative">
                                            <button
                                                className="text-gray-600 hover:text-black focus:outline-none p-1 rounded-full hover:bg-gray-300 transition-all duration-300 ease-in-out w-10 h-10 flex items-center justify-center"
                                                onClick={() => {
                                                    setSelectedAppIndex(index);
                                                    setNewApp({
                                                        appName: app.appName,
                                                        redirectAfterLogin: app.redirectAfterLogin,
                                                    });
                                                    setShowUpdateModal(true);
                                                }}
                                            >
                                                &#x22EE; {/* Vertical Ellipsis */}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <PopupModal
                        show={showUpdateModal}
                        title="Update App"
                        appName={newApp.appName}
                        redirectAfterLogin={newApp.redirectAfterLogin}
                        submitBUttonTitle="Update App"
                        onClose={() => setShowUpdateModal(false)}
                        onSubmit={() => handleUpdateApp(newApp.appName, newApp.redirectAfterLogin)}
                        onAppNameChange={(value) => setNewApp({ ...newApp, appName: value })}
                        onRedirectChange={(value) => setNewApp({ ...newApp, redirectAfterLogin: value })}
                    />
                </div>
            </div>
        </div>
    );
}
