import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase"; // Import your Supabase instance
import { getToken } from "next-auth/jwt";


// PUT /api/updateScore/{user_id}/{game_name}
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ user_id: string; game_name: string }> }
) {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req, secret:secret,secureCookie:true });
    console.log(token)
    const { data: user } = await supabaseAdmin
    .from("vibhava_users")
    .select("*")
    .eq("email", token?.email)
    .single();
    if (user.role != "admin"){
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Get points from the request body
    const { points } = await req.json();

    // Validate that points are provided
    if (points == null) {
      return NextResponse.json(
        { error: "Missing points value" },
        { status: 400 }
      );
    }

    // Extract path params
    const { user_id, game_name } = await context.params;

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
