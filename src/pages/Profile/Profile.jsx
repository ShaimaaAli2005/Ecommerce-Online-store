import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const handleLogout = async () => {
    try {
      if (logoutUser) {
        await logoutUser();
      }
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#0F172A] text-[#1F2937] dark:text-white px-4 py-8 font-['Inter'] transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Page Title */}
        <h1 className="text-2xl font-bold font-['Poppins'] text-[#17233C] dark:text-white">
          My Profile
        </h1>

        {/* 1. Account Info Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[#E5E7EB] dark:border-gray-700 p-6 space-y-6">
          
          <div className="flex items-start justify-between">
            {/* Left side: Avatar + Name, Email, and Customer text */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 text-2xl shrink-0">
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="space-y-0.5">
                <h2 className="text-lg font-bold text-[#17233C] dark:text-white uppercase tracking-wide">
                  {user?.name || 'CUSTOMER'}
                </h2>
                <p className="text-xs text-[#7B8190] dark:text-gray-400">
                  {user?.email || 'customer@koda.com'}
                </p>
                <p className="text-xs font-semibold text-[#E89A5B]">
                  Customer
                </p>
              </div>
            </div>

            {/* Edit Profile Button on the right or top */}
            
          </div>

          {/* Email and Phone details placed before/above edit section structure */}
          <div className="space-y-3 text-xs text-[#7B8190] dark:text-gray-400 pt-2">
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-envelope"></i>
              <span>{user?.email || 'customer@koda.com'}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-phone"></i>
              <span>Not set</span>
            </div>
            <button className="bg-[#17233C] hover:bg-[#E89A5B] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm cursor-pointer mt-4">
              Edit Profile
            </button>
           
          </div>
        </div>

        {/* 2. Addresses Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[#E5E7EB] dark:border-gray-700 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] dark:border-gray-700 pb-3">
            <i className="fa-solid fa-location-dot text-[#E89A5B]"></i>
            <h2 className="text-sm font-bold text-[#17233C] dark:text-white">Addresses</h2>
          </div>
          
          <p className="text-xs text-[#7B8190] dark:text-gray-400">No addresses yet.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <input 
              type="text" 
              placeholder="Country" 
              className="bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#17233C] dark:focus:border-[#E89A5B] dark:text-white"
            />
            <input 
              type="text" 
              placeholder="City" 
              className="bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#17233C] dark:focus:border-[#E89A5B] dark:text-white"
            />
            <input 
              type="text" 
              placeholder="Street" 
              className="bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#17233C] dark:focus:border-[#E89A5B] dark:text-white"
            />
            <input 
              type="text" 
              placeholder="Building" 
              className="bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#17233C] dark:focus:border-[#E89A5B] dark:text-white"
            />
            <input 
              type="text" 
              placeholder="Postal code" 
              className="bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-xs outline-none md:col-span-2 focus:border-[#17233C] dark:focus:border-[#E89A5B] dark:text-white"
            />
          </div>

          <div>
            <button className="bg-[#17233C] hover:bg-[#E89A5B] text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm">
              <i className="fa-solid fa-plus text-[10px]"></i>
              <span>Add Address</span>
            </button>
          </div>
        </div>

        {/* 3. Change Password Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[#E5E7EB] dark:border-gray-700 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] dark:border-gray-700 pb-3">
            <i className="fa-solid fa-lock text-[#E89A5B]"></i>
            <h2 className="text-sm font-bold text-[#17233C] dark:text-white">Change Password</h2>
          </div>
          <div>
            <button className="border border-[#17233C] dark:border-gray-600 text-[#17233C] dark:text-white hover:bg-[#17233C] hover:text-white dark:hover:bg-gray-700 text-xs font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 cursor-pointer">
              Change Password
            </button>
          </div>
        </div>

        {/* 4. Long Red Logout Button at the bottom */}
        <div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white transition-all py-3 rounded-xl text-xs font-bold tracking-wider cursor-pointer shadow-sm hover:shadow flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-right-from-bracket text-sm"></i>
            <span>Logout</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;