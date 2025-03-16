// import { parse } from "cookie";

// import { NextRequest, NextResponse } from "next/server";

// export default function GET(req: NextRequest) {
//   const responseHeaders = new Headers({
//     "Access-Control-Allow-Origin": "*", // Replace '*' with specific domains in production
//     "Access-Control-Allow-Methods": "GET, POST",
//     "Access-Control-Allow-Headers": "Content-Type",
// });

// const cookies = req.headers.get("cookie"); // Get cookies from the request headers
// if (cookies) {
//     const parsedCookies = parse(cookies);
//     const token = parsedCookies.auth_token;

//     console.log("Retrieved Token:", token);
//     return NextResponse.json({ token }, { headers: responseHeaders }); // Respond with the token
// } else {
//     return NextResponse.json(
//         { error: "No cookies found" },
//         { status: 400, headers: responseHeaders }
//     ); // Respond with an error if no cookies are found
// }
// }

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret });
  // console.log("JWT TOKEN: ", secret);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Return only the JWT token
  return NextResponse.json({ token }, { status: 200 }); 
}
  