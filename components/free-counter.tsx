"use client"

import {useEffect, useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {MAX_FREE_QUESTIONS} from "@/constants";
import {Progress} from "@/components/ui/progress";
import {Button} from "@/components/ui/button";
import {Zap} from "lucide-react";
import {useProModal} from "@/hooks/use-pro-modal";

interface FreeCounterProps {
    trialLimitCount: number
}

export const FreeCounter = ({trialLimitCount = 0}: FreeCounterProps) => {
    const proModal = useProModal();
    const [mounted, setMounted] = useState(false);

    useEffect(()=>{
        setMounted(true);
    },[])

    if (!mounted) {
        return null;
    }

    return (
        <div className={"px-3"}>
            <Card className={"bg-white/10 border-0"}>
                <CardContent className={"py-6"}>
                    <div className={"text-center text-sm text-white mb-4 space-y-2"}>
                        <p>
                            {trialLimitCount} / {MAX_FREE_QUESTIONS} Free Questions
                        </p>
                        <Progress indicatorColor="bg-[#4CC534]" className={"h-3"} value={(trialLimitCount / MAX_FREE_QUESTIONS) * 100} />
                    </div>
                    <Button onClick={proModal.onOpen} className={"w-full"} variant={"premium"}>
                        Upgrade
                        <Zap
                            className={"2-4 h-4 ml-2 fill-white"}
                        />
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}