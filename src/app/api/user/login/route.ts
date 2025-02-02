import {connectToMongo} from "@/dbConfig/dbConfig"
import User from "@/models/userModel";
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Dev from "@/models/devModel";

connectToMongo();

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {email, password, isDev} = reqBody

        var user = null;

        if(isDev){
            user = await Dev.findOne({email})
        }
        else{
            user = await User.findOne({email})
        }

        const validPassword = await bcryptjs.compare(password, user.password);
        if(!validPassword) {
            return NextResponse.json({message: "check your credentials"}, {status: 400})
        }

        // Check if the user is verified
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
            isDev
        }

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET!, {expiresIn: "1d"})
        
        const response = NextResponse.json({message: "User logged in successfully", success: true}, {status: 200})
        
        response.cookies.set("token", token, {httpOnly: true, expires: Date.now() + 6400000})
        
        return response

    } catch (error) {
        console.log("Error in users/login : ", error);
        return NextResponse.json({error: (error as Error).message}, {status: 500})
    }
}