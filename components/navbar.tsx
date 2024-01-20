import {Button} from "@/components/ui/button";
import {Menu} from "lucide-react";
import {UserButton} from "@clerk/nextjs";
import MobileSidebar from "@/components/mobile-sidebar";
import {getTrialLimitCount} from "@/lib/trial-limit";

const Navbar = async () => {
    const trialLimitCount = await getTrialLimitCount()

    return(
        <div className={"flex items-center p-4"}>
            <MobileSidebar trialLimitCount={trialLimitCount}/>
            <div className={"flex w-full justify-end"}>
                <UserButton afterSignOutUrl={"/"}/>
            </div>
        </div>
    );
}

export default Navbar;