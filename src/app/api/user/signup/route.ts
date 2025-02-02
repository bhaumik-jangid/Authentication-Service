import { connectToMongo } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Dev from "@/models/devModel";
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import axios from "axios";

connectToMongo();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password, isDev } = reqBody;
        const emailType = isDev ? "DEV_VERIFY" : "USER_VERIFY";

        // Check if user already exists
        let user = null;
        if (isDev) {
            user = await Dev.findOne({ email });
        } else {
            user = await User.findOne({ email });
        }

        if (user) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the user in the appropriate collection
        let savedUser = null;
        if (isDev) {
            const newDev = new Dev({
                username,
                email,
                password: hashedPassword,
            });
            savedUser = await newDev.save();
        } else {
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
            });
            savedUser = await newUser.save();
        }

        // Send verification email
        await axios.post(`${process.env.DOMAIN}/api/user/sendVerificationEmail`, {
            email,
            emailType,
            isDev
        });

        return NextResponse.json(
            {
                message: "User created successfully",
                success: true,
                savedUser,
            },
            { status: 200 }
        );

    } catch (error) {
        console.log("Error in users/signup :", error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}