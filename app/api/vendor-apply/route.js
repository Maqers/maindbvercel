import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


export async function POST(req) {

  try {
    const body = await req.json();

    const role = String(body.role ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      );
    }

    let result;

    if (role === "buyer") {
      result = await supabase.from("buyer_t").insert([
        {
          name: body.name,
          city: body.city,
          phone: body.phone,
          email,
        },
      ]);
    } else {
      result = await supabase.from("seller_t").insert([
        {
          business_name: body.business_name,
          city: body.city,
          phone: body.phone,
          email,
        },
      ]);
    }

    if (result.error) {
      // ✅ DUPLICATE EMAIL
      if (result.error.code === "23505") {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Invalid request" },
      { status: 400 }
    );
  }
}
