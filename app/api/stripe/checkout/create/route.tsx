import {absoluteUrl} from "@/lib/utils";
import {auth, currentUser} from "@clerk/nextjs";
import {NextResponse} from "next/server";
import {stripe} from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const settingsUrl = absoluteUrl("/settings");

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const user = await currentUser();
        const body = await req.json();
        const { path } = body;

        if (!userId || !user) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        const intent = await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [
                {
                    // Change this to the products...
                    price: 'price_1OZfffE2vn5fxmgKafTBTXxT',
                    quantity: 1,
                }
            ],
            ui_mode: "embedded",
            payment_method_configuration: process.env.STRIPE_PAYMENT_METHOD_CONFIGURATION!,
            return_url: process.env.NEXT_PUBLIC_APP_URL + `${path}?session_id={CHECKOUT_SESSION_ID}`
        })

        console.log(intent);

        const userSubscription = await prismadb.userSubscription.findUnique({
            where: {
                userId
            }
        })
        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl
            })
            return new NextResponse(JSON.stringify({url: stripeSession.url}), {status: 301});
        }
        return new NextResponse(JSON.stringify({client_secret: intent.client_secret}), {status: 200});
    } catch(error) {
        console.log("[STRIPE_ERROR]", error);
        return new NextResponse("Internal error", {status: 500});
    }
}