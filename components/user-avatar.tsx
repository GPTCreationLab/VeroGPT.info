import { useUser } from "@clerk/nextjs";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export const UserAvatar = () => {
    const { user } = useUser();

    return (
    <Avatar
        className={"h-12 w-12"}
    >
        <AvatarImage src={user?.profileImageUrl}/>
        <AvatarFallback>
            {user?.firstName?.charAt(0)}
        </AvatarFallback>
    </Avatar>
    )
}