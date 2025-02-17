import App from "@/models/appModel";
import Dev from "@/models/devModel";
import {connectToMongo} from "@/dbConfig/dbConfig"
import DataFromJWT from "@/utils/DataFromJWT";
import axios from "axios";
import { NextRequest, NextResponse } from 'next/server'

connectToMongo();

export async function POST(request: NextRequest){
    try {
        const data = await DataFromJWT(request);
        const devID = data?.id;

        const reqbody = await request.json()
        const {appID} = reqbody;
        const dev = await Dev.findOne({_id: devID});
        const app = await App.findOne({appID});
        if (!app || !dev) {
            return NextResponse.json(
                { message: "Invalid or missing App", status: 401 },
                { status: 401 }
            );
        }

        if (String(app.developerID) !== String(devID)) {
            return NextResponse.json(
                { message: "You are not authorized to delete this app", status: 401 },
                { status: 401 }
            );
        }
        
        const deleteApp = await App.findByIdAndDelete(app._id);
        if (!deleteApp) {
            return NextResponse.json(
                { message: "App not found", status: 404 },
                { status: 404 }
            );
        }

        await axios.post(`${process.env.DOMAIN}/api/auth/sendMail`,{developerID: devID, email: dev.email, emailType: "APP_DELETED", appID, appName: app.appName});
        const response = NextResponse.json(
            { message: "App deleted successfully, Redirecting to Dashboard...", status: 200 },
            { status: 200 }
        );

        return response; 
    } catch (error) {
        console.log("Error in app/delete : ", error);
        return NextResponse.json(
          { error: (error as Error).message, status: 500 },
          { status: 500 }
        );
    }
}