import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    // Get token from request to get user ID

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    // Call the RPC function to get scores grouped by game
    const { data, error } = await supabaseAdmin.rpc("get_user_scores", {
      uid: userId, // Pass the user ID
    });

    if (error) {
      console.error("Error fetching scores:", error.message);
      return NextResponse.json({ error: "Error fetching scores" }, { status: 500 });
    }

    // Return the grouped and summed data in JSON format
    return NextResponse.json({ scores: data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
