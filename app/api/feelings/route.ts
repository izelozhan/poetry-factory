import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import service from "../service";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    return NextResponse.json(
      { message: await service.getFeelings() },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: "An error occured" }, { status: 400 });
  }
}
