"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface UserSummary {
  id: string;
  name: string;
  email: string;
  total_points: number;
}

export default function AdminPage() {
  const [userSummary, setUserSummary] = useState<UserSummary[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    const fetchUserSummary = async () => {
      try {
        const res = await fetch("/api/getUserSummary");
        const data = await res.json();
        if (res.ok) {
          setUserSummary(data.users);
          setFilteredUsers(data.users); // Initialize filtered users
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching user summary:", error);
      }
    };

    if (session?.user?.role !== "admin"){
        router.replace("/")
    }

    fetchUserSummary();
  }, []);

  // Handle row click to navigate to user details
  const handleRowClick = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  // Handle search and filter users
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredUsers(userSummary);
    } else {
      const filtered = userSummary.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, userSummary]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen gap-6 p-6">
      <h2 className="text-2xl font-bold">Admin Panel - User Scores</h2>

      {/* Search Bar */}
      <div className="w-full max-w-3xl">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by User name"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* User Table */}
      <div className="w-full max-w-4xl max-h-[500px] bg-white rounded-lg shadow-md overflow-y-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">User ID</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Total Points</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(user.id)}
                >
                  <td className="px-6 py-4 text-blue-600 hover:underline">
                    {user.id}
                  </td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.total_points}</td>
                </tr>
              ))
            ) : (
              <tr className="bg-white">
                <td
                  colSpan={3}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No matching users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
