import { connectToMongo } from "@/dbConfig/dbConfig";
import Dev from "@/models/devModel";
import App from "@/models/appModel";
import { NextRequest, NextResponse } from "next/server";

connectToMongo();

export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { appID, appName, redirectAfterLogin } = reqBody;

        if (!appID || !appName || !redirectAfterLogin) {
            return NextResponse.json(
                { message: "All fields (appId, appName, redirectAfterLogin) are required" },
                { status: 400 }
            );
        }

        const appExists = await App.findOne({appName});
        if(appExists){
            return NextResponse.json(
                { message: "This app name is already registerd in our system" },
                { status: 400 }
            );
        }

        const updatedApp = await App.findOneAndUpdate(
            { "appID": appID }, // Find the app by appId
            { 
                appName, 
                redirectAfterLogin 
            },
            { new: true } // Return the updated document
        );

        // If no app is found, return an error
        if (!updatedApp) {
            return NextResponse.json(
                { message: "App not found" },
                { status: 404 }
            );
        }

        // Return success response
        return NextResponse.json(
            { message: "App updated successfully", app: updatedApp },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error in api/app/update: ", error);
        return NextResponse.json(
            { error: (error as Error).message || "An unexpected error occurred" },
            { status: 500 }
        );
    }
}