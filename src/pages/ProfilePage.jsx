import { useState, useEffect } from "react";
import { 
  StatCard, FormInput, 
  FormSelect, Button 
} from "../components/UIcomponents";
import {
  BookOpen,
  ChevronRight,
  Key,
  Smartphone,
  Shield,
  AlertTriangle,
  Clock
} from "lucide-react";
import api from "../api/axiosInstance.js";
import { recentActivities } from "../utils/mapactivity";
import { toast } from "react-toastify";
import ChangePasswordPopup  from '../components/ChangePassword.jsx';
import { DefaultPopup } from "../components/DefaultPopup.jsx";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    contact: "",
    department: "",
  });
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [originalProfile, setOriginalProfile] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [defaultPopupTitle, setDefaultPopupTitle] = useState("");


  const securitySettings = [
    { icon: Key, title: "Change Password", description: "Update your account password" },
    { icon: Smartphone, title: "Login Devices", description: "Manage your logged-in devices" },
    { icon: Shield, title: "Two-Factor Auth", description: "Enable additional security" },
  ];

  const fetchProfile = async () => {
    try {      
      setLoading(true);
      const [profileRes, statsRes, activityRes] = await Promise.all([
        api.get(`/users/me`, { withCredentials: true,}),
        api.get(`/users/me/stats`, { withCredentials: true }),
        api.get(`/users/me/activities`, { withCredentials: true }),
      ]);

      if (profileRes.status === 200) {
        console.log(profileRes.data);
        setProfileData(profileRes.data);
        setOriginalProfile(profileRes.data);
      }

      if (statsRes.status === 200) {
        const data = statsRes.data;
        setStats([
          { id: 0, title: "Books Issued", value: data.issuedBooks || 0, icon: BookOpen, bgColor: "bg-gradient-to-br from-green-400 to-green-600" },
          { id: 1, title: "Overdue Books", value: data.overdueBooks || 0, icon: AlertTriangle, bgColor: "bg-gradient-to-br from-orange-400 to-red-500" },
          { id: 2, title: "Active Requests", value: data.requestedBooks || 0, icon: Clock, bgColor: "bg-gradient-to-br from-blue-400 to-blue-600" },
        ]);
      }

      if (activityRes.status === 200 && activityRes.data?.activities) {
        const mapped = recentActivities(activityRes.data.activities); 
        setRecentActivity(mapped);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);

      const changes = {};
      if (profileData.name !== originalProfile.name) changes.name = profileData.name;
      if (profileData.contact !== originalProfile.contact) changes.contact = profileData.contact;
      if (profileData.department !== originalProfile.department) changes.department = profileData.department;
  
      const response = await api.put(
        `/users/me`,
        changes,
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        toast.success("✅ Profile updated successfully!")
        fetchProfile(); // Re-fetch to refresh data
      } else {
        toast.error("⚠️ Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("❌ Something went wrong while saving changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelChanges = () => {
    setProfileData(originalProfile);
    toast.done("🔁 Changes reverted.");
  };


  useEffect(() => {
    fetchProfile();
  }, []);

  // 🔄 Animated Loading Component
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-purple-300 rounded-full animate-ping"></div>
        <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">Loading your profile...</p>
    </div>
  );

  const handleSettingClick = (title) => {
    if (title === "Change Password") {
      setPopupType("changePassword");
      setIsPopupOpen(true);
    } else {
      setPopupType("default");
      setDefaultPopupTitle(title);
      setIsPopupOpen(true);
    }
  };

  if (loading) return <LoadingSpinner />;

  const initials =
    profileData.name
      ? profileData.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "?";

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 
          bg-clip-text text-transparent pb-2">My Profile</h1>
          <p className="text-slate-600 font-medium">Manage your library account and personal information</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {initials}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-slate-800 mb-4">
                    {profileData.name || "Unknown User"}
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-4">
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-orange-600 mb-1">Student ID</p>
                        <p className="text-slate-800 font-semibold">{profileData.studentId || "N/A"}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-green-700 mb-1">Phone</p>
                        <p className="text-slate-800 font-semibold">{profileData.phone || "N/A"}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-600 mb-1">Email</p>
                        <p className="text-slate-800 font-semibold">{profileData.email || "N/A"}</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-purple-700 mb-1">Department</p>
                        <p className="text-slate-800 font-semibold">{profileData.department || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat) => (
                <StatCard
                  key={stat.id}
                  icon={stat.icon}
                  title={stat.title}
                  value={stat.value}
                  bgColor={stat.bgColor}
                />
              ))}
            </div>
        

            {/* Edit Profile Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-all duration-300">
              <h3 className="text-2xl font-bold text-slate-800 mb-8">Edit Profile Information</h3>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormInput
                    label="Full Name"
                    value={profileData.name || ""}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                  <FormInput
                    label="Email Address"
                    type="email"
                    value={profileData.email || ""}
                    disabled = {true}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormInput
                    label="Phone Number"
                    value={profileData.phone || ""}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                  <FormSelect
                    label="Department"
                    value={profileData.department || ""}
                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                    options={[
                      { value: "COMPUTER SCIENCE", label: "Computer Science" },
                      { value: "ELECTRICAL", label: "Electrical" },
                      { value: "MECHANICAL", label: "Mechanical" },
                      { value: "CIVIL", label: "Civil" },
                      { value: "CHEMICAL", label: "Chemical" },
                    ]}
                  />
                </div>

                <div className="flex block space-x-4 pt-4">
                    <Button variant="primary" onClick={handleSaveChanges} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outline" onClick={handleCancelChanges}>
                      Cancel
                    </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="grid md:grid-cols-1 gap-6 mb-8">
            { profileData.fine ? (
              
              <StatCard
                key={1}
                icon={Clock}
                title={"Fine Balance"}
                value={profileData.fine}
                bgColor={"bg-gradient-to-br from-teal-400 to-teal-600"}
              /> 
            ): null}
            </div>
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <p className="text-gray-500 text-sm">No recent activity found.</p>
                ) : (
                  recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          activity.type === "borrow"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
              <div className="space-y-2">
                {securitySettings.map((setting, index) => (
                  <button
                    key={index}
                    onClick={() => handleSettingClick(setting.title)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                        <setting.icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{setting.title}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                  </button>
                ))}
              </div>
            </div>
            {popupType === "changePassword" && (
              <ChangePasswordPopup
                isOpen={isPopupOpen}
                onClose={() => { setIsPopupOpen(false); setPopupType(null); }}
              />
            )}
            {popupType === "default" && (
              <DefaultPopup
                isOpen={isPopupOpen}
                onClose={() => { setIsPopupOpen(false); setPopupType(null); }}
                title={defaultPopupTitle}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
