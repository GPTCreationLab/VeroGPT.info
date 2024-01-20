import {LucideIcon} from "lucide-react";
import {cn} from "@/lib/utils";

interface HeadingProps {
    title: string;
    description: string;
    icon: LucideIcon;
    iconColor?: string;
    bgColor?: string
}

export const Heading = ({
    title,
    description,
    icon: Icon
}: HeadingProps) => {
    return (
            <div className={"px-4 md:px-20 lg:px-32 flex items-center gap-x-3 mb-8"}>
                <div>
                    <h2 className={"text-3xl text-[#4CC534]"}>{title}</h2>
                    <p className={"text-sm text-white"}>{description}</p>
                </div>
            </div>
    )
}