"use client";

import {Menu} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {useEffect, useState} from "react";
import Sidebar from "@/components/sidebar";
import Image from "next/image";

interface MobileSidebarProps {
    trialLimitCount: number
}

const MobileSidebar = ({trialLimitCount}: MobileSidebarProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(()=>{
        setIsMounted(true);
    },[])

    if (!isMounted) {
        return null
    }

    return (
        <Sheet>
            <SheetTrigger>
                <Button variant={"ghost"} size={"icon"} className={"md:hidden"}>
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side={"left"} className={"p-0"}>
                <Sidebar trialLimitCount={trialLimitCount} chatHistory={""} bgColor={"bg-[#339021]"} headerImage={
                    <div className={"relative w-full aspect-video"}>
                        <Image fill alt={"logo"} src={"/logo.svg"}/>
                    </div>}
                />
            </SheetContent>
        </Sheet>
    )
}

export default MobileSidebar;