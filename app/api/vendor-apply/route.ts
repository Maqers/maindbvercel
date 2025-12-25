// import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// const supabase = createClient(supabaseUrl,supabaseKey);

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const business_name = String(body?.business_name ?? "").trim();
//     const email = String(body?.email ?? "").trim().toLowerCase();
//     const role = String(body?.role ?? "").trim();
//     const phone = String(body?.phone ?? "").trim();

//     if (!email || !role) {
//       return NextResponse.json({ error: "email and role are required" }, { status: 400 });
//     }

//     // This maps object keys -> table column names
//     const { error } = await supabase
//       .from("maindb_contactinfo")
//       .insert([{ business_name, email, role, phone }]);

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     return NextResponse.json({ ok: true });
//   } catch {
//     return NextResponse.json({ error: "invalid request" }, { status: 400 });
//   }
// }

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
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
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Invalid request" },
      { status: 400 }
    );
  }
}
