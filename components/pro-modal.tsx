"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {useProModal} from "@/hooks/use-pro-modal";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Zap} from "lucide-react";
import {EmbeddedCheckout, EmbeddedCheckoutProvider} from "@stripe/react-stripe-js";
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import axios from "axios";
import {loadStripe} from "@stripe/stripe-js";


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)
const createCheckout = async(pathname: string) => {
    return await axios.post("/api/stripe/checkout/create", {path: pathname})
}

export const ProModal = () => {
    const proModal = useProModal();
    const [clientSecret, setClientSecret] = useState('')
    const pathname = usePathname()

    useEffect(()=>{
        createCheckout(pathname).then((response) => {
            if (response.status === 200) {
                console.log(response.data.client_secret);
                setClientSecret(response.data.client_secret)
            }
        })
    },[pathname])


    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle
                        className={"flex justify-center items-center flex-col gap-y-4 pb-2"}
                    >
                        <div className={"flex  items-center gap-x-2 font-bold py-1"}>
                            Upgrade VeroGPT!
                            <Badge variant="premium" className={"uppercase text-sm py-1"}>
                                Pro
                            </Badge>
                        </div>
                    </DialogTitle>
                    <DialogDescription className={"text-center pt-2 space-y-2 text-zinc-900 font-medium"}>
                        Keep using VeroGPT to your hearts content!
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    {clientSecret &&
                        <EmbeddedCheckoutProvider stripe={stripePromise} options={{clientSecret: clientSecret}}>
                            <EmbeddedCheckout />
                        </EmbeddedCheckoutProvider>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}