import {connectToMongo} from "@/dbConfig/dbConfig"
import User from "@/models/userModel";
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from "@/utils/mailer";
import bcryptjs from 'bcryptjs';
import crypto from "crypto";
import Dev from "@/models/devModel";

connectToMongo();

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {email, emailType, isDev} = reqBody

        if (isDev && !["DEV_VERIFY", "DEV_CONFIRM"].includes(emailType)) {
            return NextResponse.json(
                { message: "Invalid emailType for developer" },
                { status: 400 }
            );
        }

        if (!isDev && !["USER_VERIFY", "USER_CONFIRM"].includes(emailType)) {
            return NextResponse.json(
                { message: "Invalid emailType for user" },
                { status: 400 }
            );
        }

        const token = crypto.randomBytes(32).toString("hex");
        const hashedToken = await bcryptjs.hash(token.toString(), 10);
        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + 1);

        var user = null;
        if(isDev){
            user = await Dev.findOneAndUpdate(
                { email },
                {
                    emailVerifyToken: hashedToken,
                    emailVerifyTokenExpire: expirationTime,
                },
                { new: true }
            );
        }
        else{
            user = await User.findOneAndUpdate(
                { email },
                {
                    emailVerifyToken: hashedToken,
                    emailVerifyTokenExpire: expirationTime,
                },
                { new: true }
            );
        }
        if (!user) {
            return NextResponse.json({ message: "User does not exist" }, { status: 400 });
        }
            
        if ( ( emailType === "USER_VERIFY" ||  emailType === "DEV_VERIFY") && user.isVerified) {
            return NextResponse.json({ message: "Already verified" }, { status: 400 });
        }

        await sendEmail({
            username: user.username,
            email, 
            emailType: emailType, 
            userID: user._id,
            token: hashedToken
        })
        
        return NextResponse.json({message: "Email sent successfully", success: true})

    } catch (error) {
        console.log("Error in users/sendverificationmail : " + error)
        return NextResponse.json({error: (error as Error).message}, {status: 500})
    }
}