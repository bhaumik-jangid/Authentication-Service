import {connectToMongo} from "@/dbConfig/dbConfig"
import User from "@/models/userModel";
import DataFromJWT from "@/utils/DataFromJWT";
import { NextRequest, NextResponse } from 'next/server'

connectToMongo();

export async function POST(request: NextRequest){
    try {
        const data = await DataFromJWT(request);
        const userId = data?.id;
        if (!userId) {
            return NextResponse.json(
                { message: "Invalid or missing token", status: 401 },
                { status: 401 }
            );
        }

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return NextResponse.json(
                { message: "User not found", status: 404 },
                { status: 404 }
            );
        }

        const response = NextResponse.json(
            { message: "User deleted successfully, Redirecting to login page...", status: 200 },
            { status: 200 }
        );
        response.cookies.set("token", "", {
            httpOnly: true,
            path: "/",
            expires: new Date(0), // Expire the cookie immediately
        });

        return response; 
    } catch (error) {
        console.log("Error in users/deleteuser : ", error);
        return NextResponse.json(
          { error: (error as Error).message, status: 500 },
          { status: 500 }
        );
    }
}