import {Metadata} from "next";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Image from "next/image";
import {getTrialLimitCount} from "@/lib/trial-limit";


const ChatbotLayout = async ({
                         children
                     }: {
    children: React.ReactNode;
}) => {
    const trialLimitCount = await getTrialLimitCount();

    return (
        <div className={"bg-[#339021]/10 relative"}>
            <div className={"hidden h-full md:flex md:w-72  md:flex-col md:fixed md:inset-y-0 z-[50] bg-gray-900"}>
                <Sidebar trialLimitCount={trialLimitCount} chatHistory={""} bgColor={"bg-[#339021]"} headerImage={
                    <div className={"relative w-full aspect-video"}>
                        <Image fill alt={"logo"} src={"/logo.svg"}/>
                    </div>}
                />
            </div>
            <main className={"md:pl-72 w-full h-full min-h-screen bg-[#006600]"}>
                <Navbar/>
                {children}
            </main>
        </div>
    )
}

export default ChatbotLayout;