import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from './ThemeContext'; 
import API_URL from './config';
function ProfilePage() {
    const { isDarkMode } = useTheme();
    const [profileImage, setProfileImage] = useState(null);
    const [userDetails, setUserDetails] = useState({
        username: '',
        email: '',
       
    });

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/getuser`, {
                withCredentials: true,
            });
            setUserDetails(response.data);
            setProfileImage(response.data.profilePic || null); // Use existing profile picture if available
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profileImage', file);
            try {
                const response = await axios.post(`${API_URL}/api/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true
                });
                setProfileImage(response.data.url); // Set to the newly uploaded image URL
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    const handleLogout = () => {
        console.log('Logged out');
    };

    const handleUpdate = () => {
        console.log('Profile updated');
    };

    return (
        <div className={`flex flex-col items-center min-h-screen p-6 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>
            <h1 className="text-4xl font-bold mb-6">Profile Page</h1>
            <div className={`shadow-lg rounded-lg p-6 w-full max-w-lg transition-transform duration-200 ${isDarkMode ? 'bg-black border border-white' : 'bg-white border border-gray-300'}`}>
                <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 border-4 border-gray-300 rounded-full overflow-hidden mb-4 transition-transform duration-300 transform hover:scale-110">
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <span className="text-gray-500">No Image</span>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mb-2"
                    />
                    <span className="text-gray-500 text-sm">Upload a profile picture</span>
                </div>
                <div className={`shadow-inner rounded-lg p-4 mb-6 ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
                    <div className="mb-4">
                        <strong className="block text-lg">Name:</strong> {userDetails.username}
                    </div>
                    <div className="mb-4">
                        <strong className="block text-lg">Email:</strong> {userDetails.email}
                    </div>
                    
                </div>
                {/* <div className="flex justify-between space-x-4">
                    <button
                        className="bg-black text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                        onClick={handleUpdate}
                    >
                        Update
                    </button>
                    <button
                        className="bg-black text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div> */}
            </div>
        </div>
    );
}

export default ProfilePage;
