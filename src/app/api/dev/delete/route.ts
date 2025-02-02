import { connectToMongo } from "@/dbConfig/dbConfig";
import Dev from "@/models/devModel";
import DataFromJWT from "@/utils/DataFromJWT";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

connectToMongo();

export async function POST(request: NextRequest) {
    try {
        // Extract dev ID from JWT token
        const dev = await DataFromJWT(request);
        const devId = dev.id;
        if (!devId) {
            return NextResponse.json(
                { message: "Unauthorized: Invalid or missing token" },
                { status: 401 }
            );
        }

        // Delete developer account
        const deletedUser = await Dev.findByIdAndDelete(devId);
        if (!deletedUser) {
            return NextResponse.json(
                { message: "Developer account not found" },
                { status: 404 }
            );
        }

        // Clear auth token from cookies
        const response = NextResponse.json(
            { message: "Account deleted successfully. Redirecting to login page..." },
            { status: 200 }
        );
        response.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            expires: new Date(0), // Expire the cookie immediately
        });
        
        console.log(`Developer account (ID: ${devId}) deleted successfully.`);
        return response; 

    } catch (error) {
        console.error("Error in /api/dev/delete:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
