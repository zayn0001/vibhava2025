"use client";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch(`/api/getScores`, {credentials:"include"});
        const data = await res.json();
        if (res.ok) {
          setScores(data.scores);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    if (session?.user) {
      fetchScores();
    }
  }, [session]);

  // Handle Sign Out
  const handleSignOut = async () => {
    await signOut();
  };

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-xl font-semibold">You are not signed in.</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen gap-6 p-6">
      {/* User Info Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Welcome {session.user.name}!
        </h2>
      </div>

      {/* Scores Table */}
      <div className="w-full max-w-3xl rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">
                Game Name
              </th>
              <th scope="col" className="px-6 py-3">
                Total Points
              </th>
            </tr>
          </thead>
          <tbody>
            {scores.length > 0 ? (
              scores.map((score: any) => (
                <tr key={score.game_name} className="bg-white border-b">
                  <td className="px-6 py-4">{score.game_name}</td>
                  <td className="px-6 py-4">{score.total_points}</td>
                </tr>
              ))
            ) : (
              <tr className="bg-white">
                <td
                  colSpan={2}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No scores available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition duration-200"
      >
        Sign Out
      </button>
    </div>
  );
}
