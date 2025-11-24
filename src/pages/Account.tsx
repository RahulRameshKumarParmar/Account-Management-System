import { useEffect, useState } from "react";
import { deleteUser, logout, updateUser } from "../features/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { FaTrashCan } from "react-icons/fa6";

export default function AccountPage() {

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || ''
  });
  const [success, setSuccess] = useState('');
  const BgColour: string[] = ['#fca5a5', '#d1d5db', '#d8b4fe', '#86efac', '#fde047', '#93c5fd'];
  const [bg, setBG] = useState<string>("");
  const [profileInitials, setProfileInitials] = useState<string>();

  useEffect(() => {
    if (!currentUser) return;

    const randomBgColour = BgColour[Math.floor(Math.random() * BgColour.length)];
    setBG(randomBgColour);

    const initials = formData.firstName.charAt(0) + formData.lastName.charAt(0);
    setProfileInitials(initials);
  }, []);

  //Continue From Here 

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
      })
    }
  }, [currentUser])

  // Handle input changes in edit mode
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Save updated user information
  const handleSave = () => {

    dispatch(updateUser(formData));
    setIsEditing(false);
    setSuccess('Account information updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Cancel editing and reset form
  const handleCancel = () => {
    setFormData({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || ''
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to Logout?')) {
      dispatch(logout());
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header with logout button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Account</h2>
            <div className="flex items-center">
              <div style={{ backgroundColor: bg }} className={`user-profile-avatar-initials border border-white rounded-full h-12 w-12 me-5 text-white font-bold text-2xl flex items-center justify-center`}>
                {profileInitials}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {/* Account information display/edit form */}
          <div className="space-y-4">
            {/* First Name field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800 py-2">{formData?.firstName}</p>
              )}
            </div>

            {/* Last Name field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800 py-2">{formData?.lastName}</p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800 py-2">{formData?.email}</p>
              )}
            </div>

            {/* Phone field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800 py-2">{formData?.phone || 'Not provided'}</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Edit Account
              </button>
            )}
          </div>

          <div className="deleteAccount flex justify-center">
            <button
              onClick={() => {
                dispatch(deleteUser(currentUser?.email));
              }
              }
              className="mt-4 flex items-center gap-3 cursor-pointer hover:bg-red-100 py-2 px-3 transition-colors rounded-3xl">
              <FaTrashCan color="red" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}