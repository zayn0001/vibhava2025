import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase"; // Import your Supabase instance


// PUT /api/updateScore/{user_id}/{game_name}
export async function PUT(
  req: NextRequest,
  { params }: { params: { user_id: string; game_name: string } }
) {
  try {
    // Get points from the request body
    const { points } = await req.json();

    // Validate that points are provided
    if (!points) {
      return NextResponse.json(
        { error: "Missing points value" },
        { status: 400 }
      );
    }

    // Extract path params
    const { user_id, game_name } = await params;

    // Update points for the given user and game in Supabase
    const { error } = await supabaseAdmin
      .from("vibhava_points")
      .update({ points: Number(points) })
      .match({ user_id, game_name });

    // Handle errors if any
    if (error) {
      console.error("Error updating points:", error);
      return NextResponse.json(
        { error: "Error updating points" },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({ message: "Points updated successfully!" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
