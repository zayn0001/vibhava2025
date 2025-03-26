import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    // Call the RPC function to get user summary data
    const { data, error } = await supabaseAdmin.rpc("get_user_summary");

    if (error) {
      console.error("Error fetching user summary:", error.message);
      return NextResponse.json({ error: "Error fetching user summary" }, { status: 500 });
    }

    // Return the aggregated data in JSON format
    return NextResponse.json({ users: data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
