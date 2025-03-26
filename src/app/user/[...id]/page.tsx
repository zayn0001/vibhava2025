"use client";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [scores, setScores] = useState<{game_name:string, total_points:number}[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedPoints, setEditedPoints] = useState<string | null>(null);
  const params = useParams();
  const { id } = params;
  const router = useRouter(); // To refresh page after submission

  useEffect(() => {

    const fetchScores = async () => {
      try {
        const res = await fetch(`/api/getScores?user_id=${id}`);
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

  const updateScoreAtIndex = (index: number, newPoints: number) => {
    setScores((prevScores) => {
      // Create a new array with updated value
      const updatedScores = [...prevScores];
      updatedScores[index] = {
        ...updatedScores[index],
        total_points: newPoints,
      };
      console.log(updatedScores)
      return updatedScores;
    });
  };

  // Handle Double Click for Editing
  const handleDoubleClick = (index: number, currentPoints: string) => {
    setEditIndex(index);
    setEditedPoints(currentPoints);
  };

  // Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPoints(e.target.value);
  };

  // Handle Update Points Submission
  const handleUpdatePoints = async (gameName: string) => {
    if (editedPoints === null || editIndex === null) return;

    try {
      const res = await fetch(`/api/updateScore/${id}/${gameName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify({
          points: Number(editedPoints),
        }),
      });

      if (res.ok) {
        console.log("Points updated successfully!");
        
        updateScoreAtIndex(editIndex, Number(editedPoints))
        
      } else {
        console.error("Error updating points:", await res.json());
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // Reset state after submission
    setEditIndex(null);
    setEditedPoints(null);
  };

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-xl font-semibold">You are not signed in.</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen gap-6 p-6">
      {/* User Info Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold">{session.user.name}</h2>
      </div>

      {/* Scores Table */}
      <div className="w-full max-w-3xl rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">Game Name</th>
              <th scope="col" className="px-6 py-3">Total Points</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {scores.length > 0 ? (
              scores.map((score: any, index: number) => (
                <tr key={score.game_name} className="bg-white border-b">
                  <td className="px-6 py-4">{score.game_name}</td>

                  {/* Editable Points Field */}
                  <td
                    className="px-6 py-4"
                    onDoubleClick={() =>
                      handleDoubleClick(index, score.total_points)
                    }
                  >
                    {editIndex === index ? (
                      <input
                        type="number"
                        value={editedPoints ?? score.total_points}
                        onChange={handleInputChange}
                        className="border rounded px-2 py-1 w-20"
                      />
                    ) : (
                      <span className="cursor-pointer">{score.total_points}</span>
                    )}
                  </td>

                  {/* Submit Button */}
                  <td className="px-6 py-4">
                    {editIndex === index && (
                      <button
                        onClick={() => handleUpdatePoints(score.game_name)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Submit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white">
                <td
                  colSpan={3}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No scores available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
