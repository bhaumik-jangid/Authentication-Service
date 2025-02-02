import { connectToMongo } from "@/dbConfig/dbConfig";
import Dev from "@/models/devModel";
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectToMongo();

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        const user = await Dev.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
        }

        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
        }

        if (!user.isVerified) {
            return NextResponse.json(
                { message: "Please verify your email before logging in" },
                { status: 401 }
            );
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        const token = jwt.sign(tokenData, process.env.JWT_SECRET!, { expiresIn: "1d" });

        const response = NextResponse.json(
            { message: "Developer logged in successfully", success: true },
            { status: 200 }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return response;
    } catch (error) {
        console.error("Error in /api/dev/login:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
