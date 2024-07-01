import { NextResponse } from "next/server";
import service from "../service";

export async function POST(req: Request) {
  try {
    const { feeling } = await req.json();
    return NextResponse.json(
      { message: await service.getPoets(feeling) },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "An error occured" }, { status: 400 });
  }
}
