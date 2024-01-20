"use client";

import Link from "next/link";
import Image from "next/image";
import {Montserrat} from "next/font/google";
import {cn} from "@/lib/utils";
import {BookTemplateIcon, Bot, LayoutDashboard, MessageSquare, Settings} from "lucide-react";
import {usePathname} from "next/navigation";
import {FreeCounter} from "@/components/free-counter";

const montserrat = Montserrat({weight: '600', subsets: ["latin"]})

const chatHistory = [
    {
        label: "Question about taxes",
        icon: LayoutDashboard,
        href: "/",
        color: "text-sky-500"
    },
    {
        label: "Vero",
        icon: Bot,
        href: "/edit/vero",
        color: "text-green-500"
    },
    {
        label: "Belastingdienst",
        icon:  Bot,
        href: "/edit/belastingdienst",
        color: "text-green-500"
    },
    {
        label: "Settings",
        icon:  Settings,
        href: "/settings"
    }

]

interface SidebarProps {
    bgColor: string,
    headerImage: React.ReactNode,
    chatHistory: any,
    trialLimitCount: number
}

const Sidebar = ({bgColor, headerImage, chatHistory, trialLimitCount = 0}: SidebarProps) => {
    const pathname = usePathname()

    return (
        <div className={`flex flex-col h-full ${bgColor} text-white`}>
            <div className={"flex-1"}>
                {headerImage}
                <div className={"space-y-1"}>
                </div>
            </div>
            <FreeCounter
                trialLimitCount={trialLimitCount}
            />
        </div>
    )
}
export default Sidebar;