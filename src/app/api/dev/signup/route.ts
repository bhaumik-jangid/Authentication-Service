import { connectToMongo } from "@/dbConfig/dbConfig";
import Dev from "@/models/devModel";
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import axios from "axios";

connectToMongo();

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;
        const emailType = "DEV_VERIFY";

        // Check if the developer already exists
        const existingDev = await Dev.findOne({ email });

        if (existingDev) {
            return NextResponse.json(
                { message: "Username already in use" },
                { status: 400 }
            );
        }

        // Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the developer account
        const newDev = new Dev({
            username,
            email,
            password: hashedPassword,
        });

        const savedDev = await newDev.save();

        // Send verification email
        await axios.post(`${process.env.DOMAIN}/api/auth/sendMail`, {
            email,
            emailType
        });

        return NextResponse.json(
            {
                message: "Developer account created successfully",
                success: true,
                savedDev,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error in /api/dev/signup:", error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
