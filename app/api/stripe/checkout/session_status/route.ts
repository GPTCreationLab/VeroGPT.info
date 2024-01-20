import {auth, currentUser} from "@clerk/nextjs";
import {NextResponse} from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(req: Request) {
    try {
        const {userId} = auth();
        const user = await currentUser();
        const body = await req.json();
        const session_id: string = body.session_id;
        if (!userId || !user) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        const session = await stripe.checkout.sessions.retrieve(session_id)
        let customer;
        if (typeof session.customer === "string") {
            customer = await stripe.customers.retrieve(session.customer);
        } else {
            customer = session.customer
        }
        if (customer!.deleted === true) {
            return new NextResponse(JSON.stringify({
                status: session.status,
                payment_status: session.payment_status,
            }), {status: 200})
        } else {
            return new NextResponse(JSON.stringify({
                status: session.status,
                payment_status: session.payment_status,
                customer_email: customer!.email
            }), {status: 200})
        }
        return new NextResponse("test", {status: 200})
    }
    catch(error) {
        console.log("[STRIPE_ERROR]", error)
        new NextResponse("Internal Error", {status: 500})
    }
    return new NextResponse("test", {status: 200})
}