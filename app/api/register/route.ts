import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";

const schema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email(),
  password: z.string().min(5),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = schema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser = await prisma.user.create({
      data: {
        name: body.name || body.email.split("@")[0],
        email: body.email,
        hashedPassword,
      },
    });

    return NextResponse.json(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
