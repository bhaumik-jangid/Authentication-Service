import {connectToMongo} from "@/dbConfig/dbConfig"
import User from "@/models/userModel";
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from "@/utils/mailer";

connectToMongo();

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {token} = reqBody;

        const user = await User.findOneAndUpdate(
            {
                emailVerifyToken: token,
                emailVerifyTokenExpire: { $gt: Date.now() },
            },
            {
                $set: { 
                    isVerified: true, 
                    emailVerifyToken: null, 
                    emailVerifyTokenExpire: null 
                }
            },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { message: "Invalid or expired token" }, 
                { status: 400 }
            );
        }
        await sendEmail({
            username: user.username,
            email: user.email, 
            emailType: "USER_CONFIRM", 
            userID: user._id
        })
        return NextResponse.json({message: 'Email verified succesfully'}, {status: 201})

    } catch (error) {
        console.log("Error in users/verifymail api : " + error);
        return NextResponse.json({error: (error as Error).message || "An unexpected error occurred"}, {status: 500})
    }
}