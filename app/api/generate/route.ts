import { NextResponse } from "next/server";
import service from "../service";

// const mockWait = () => {
//   return new Promise((s, e) => {
//     setTimeout(() => {
//       s(true);
//     }, 5000);
//   });
// };

export async function POST(req: Request) {
  try {
    const { feelings, authors, concept } = await req.json();
    const poem = await service.generate(feelings, authors, concept);
    return NextResponse.json({ message: poem }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "An error occured" }, { status: 400 });
  }
}
