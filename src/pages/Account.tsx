import { useEffect, useState } from "react";
import {
  adminLogout,
  deleteUser,
  logout,
  updateUser,
  type User,
} from "../features/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { FaTrashCan } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

export default function AccountPage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const users = useAppSelector((state) => state.auth.users);
  const adminLog = useAppSelector((state) => state.auth.adminLog);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
  });
  const [success, setSuccess] = useState("");

  const [bg, setBG] = useState<string>("");
  const [profileInitials, setProfileInitials] = useState<string>();

  const lastLoginTime = currentUser?.lastLogin;

  const [searchedData, setSearchedData] = useState("");
  const [filterSearchData, setFilterSearchData] = useState<User[]>([]);
  const [accountCreatedDate, setAccountCreatedDate] = useState('');

  useEffect(() => {
    const BgColour: string[] = [
      "#fca5a5",
      "#d1d5db",
      "#d8b4fe",
      "#86efac",
      "#fde047",
      "#93c5fd",
    ];

    if (!currentUser) return;

    const randomBgColour =
      BgColour[Math.floor(Math.random() * BgColour.length)];
    setBG(randomBgColour);

    const initials =
      formData.firstName.charAt(0).toUpperCase() +
      formData.lastName.charAt(0).toUpperCase();
    setProfileInitials(initials);
  }, [currentUser, formData]);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
      });
    }
  }, [currentUser]);

  const userLastSeen = (lastSeen?: number) => {
    if (!lastSeen) return "First Login";

    const difference = Date.now() - lastSeen;

    const sec = Math.floor(difference / 1000);
    if (sec < 60) return "Last Login: Just Now";

    const min = Math.floor(sec / 60);
    if (min < 60) return `Last Login: ${min} min ago`;

    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `Last Login ${hrs} hours ag`;

    const days = Math.floor(hrs / 24);
    if (days > 1) return `Last Login ${days} days ago`;
  };

  useEffect(() => {
    if(!currentUser?.firstTimeLogin){
      setAccountCreatedDate('N/A');
      return;
    }
    
    const accountCreated = () => {
      const date = new Date(Number(currentUser?.firstTimeLogin));
      const formatedDate = date.toISOString().split('T')[0];
      setAccountCreatedDate(formatedDate);
    }
    accountCreated()
  }, [currentUser]);

  // Handle input changes in edit mode
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Save updated user information
  const handleSave = () => {
    dispatch(updateUser(formData));
    setIsEditing(false);
    setSuccess("Account information updated successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Cancel editing and reset form
  const handleCancel = () => {
    setFormData({
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
    });
    setIsEditing(false);
  };

  const handleUserLogout = () => {
    if (window.confirm("Are you sure you want to Logout?")) {
      dispatch(logout(formData.email));
    }
  };

  const handleAdminLogout = () => {
    if (window.confirm("Are you sure you want to Logout?")) {
      dispatch(adminLogout());
    }
  };

  const handleSearch = () => {
    const searching = searchedData.toLowerCase().trim();

    if (!searching) {
      // Clear filtered results when search input is empty
      setFilterSearchData([]);
      return;
    }

    const search = users.filter((u) => {
      const firstName = u.firstName.toLowerCase();
      const lastName = u.lastName.toLowerCase();
      const email = u.email.toLowerCase();

      return (
        u.id.includes(searching) ||
        firstName.includes(searching) ||
        lastName.includes(searching) ||
        email.includes(searching) ||
        u.phone.includes(searching)
      );
    });
    setFilterSearchData(search);
  };

  useEffect(() => {
    setFilterSearchData([]);
  }, [searchedData]);

  return (
    <>
      <div
        className={`min-h-screen py-8 ${adminLog === "true" ? "hidden" : "block"
          }`}
      >
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Header with logout button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">My Account</h2>
              <span>Account Created: {accountCreatedDate}</span>
              <div className="flex items-center">
                <div
                  style={{ backgroundColor: bg }}
                  className={`user-profile-avatar-initials border border-white rounded-full h-12 w-12 me-5 text-white font-bold text-2xl flex items-center justify-center`}
                >
                  {profileInitials}
                </div>
                <button
                  onClick={handleUserLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="py-2 px-5 inline rounded-2xl   bg-green-200 font-bold">
              {userLastSeen(lastLoginTime)}
            </div>

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            {/* Account information display/edit form */}
            <div className="space-y-4 mt-5">
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
                  <p className="text-gray-800 py-2">
                    {formData?.phone || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 cursor-pointer"
                >
                  Edit Account
                </button>
              )}
            </div>

            <div className="deleteAccount flex justify-center">
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete the account. Once you click on delete all data of your account will be deleted permanently"
                    )
                  ) {
                    dispatch(deleteUser(currentUser?.email));
                  }
                }}
                className="mt-4 flex items-center gap-3 cursor-pointer hover:bg-red-100 py-2 px-3 transition-colors rounded-3xl"
              >
                <FaTrashCan color="red" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`min-h-screen py-8 ${adminLog === "true" ? "block" : "hidden"
          }`}
      >
        <div className="flex justify-between items-center px-10 bg-gray-500 p-5 text-white">
          <h2 className="text-2xl">All Users</h2>
          <button
            onClick={handleAdminLogout}
            className="text-xl cursor-pointer bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-2xl"
          >
            Logout
          </button>
        </div>

        <div className="search-bar mt-5 flex items-center justify-center">
          <input
            type="search"
            className="border w-3xl h-10 rounded-2xl placeholder:ps-3 ps-3"
            placeholder="Search..."
            value={searchedData}
            onChange={(e) => setSearchedData(e.target.value)}
          />

          <button
            onClick={handleSearch}
            className="flex items-center gap-3 ms-3 border border-gray-400 px-4 py-2 rounded-2xl cursor-pointer hover:bg-gray-400 "
          >
            <FaSearch /> Search
          </button>
        </div>

        <div className="flex items-center justify-center h-[60vh]">
          <table
            className={`border-separate border-spacing-4 ${searchedData ? "hidden" : "block"
              }`}
          >
            <thead className="border border-gray-300 rounded-2xl p-5 font-bold">
              <tr>
                <td>Id</td>
                <td>UserName</td>
                <td>Email</td>
                <td>Phone</td>
              </tr>
            </thead>
            <tbody className="font-normal">
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.firstName + u.lastName}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table
            className={`border-separate border-spacing-4 ${searchedData && filterSearchData.length > 0 ? "block" : "hidden"
              }`}
          >
            <thead className="border border-gray-300 rounded-2xl p-5 font-bold">
              <tr>
                <td>Id</td>
                <td>UserName</td>
                <td>Email</td>
                <td>Phone</td>
              </tr>
            </thead>

            <tbody className="font-normal">
              {filterSearchData.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.firstName + u.lastName}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            className={`${(!searchedData && filterSearchData.length !== 0) ||
              (!searchedData && users.length === 0)
              ? "block"
              : "hidden"
              }`}
          >
            No Data Found
          </div>
        </div>
      </div>
    </>
  );
}
