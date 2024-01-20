import {useRouter, useSearchParams} from "next/navigation";
import axios from "axios";

export const useCheckPayment = async () => {
    const searchParams = useSearchParams()
    const router = useRouter();
    const sessionId = searchParams.get('session_id');
    console.log(sessionId);
    const response = await axios.post("/api/stripe/checkout/session_status", {session_id: sessionId});
    if (response.status === 200) {
        const session = response.data;
        if (session.status === "open") {
            //Checkout is still open and hasn't completed or failed, refresh the checkout page!
            router.refresh();
        } else if (session.status === "complete") {
            // Show Balloons and confetti!

        } else if (session.status === "expired") {
            // Checkout has been expired, the page was open for too long!
            // Show expired message
        }
    }

}