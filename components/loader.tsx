import Image from "next/image";

export const Loader = () => {
    return (
        <div className={"h-full flex flex-col gap-y-4 items-center justify-center"}>
            <div className={"w-60 h-60 relative animate-spin"}>
                <Image src={"/loading.svg"} alt={"logo"} fill />
            </div>
            <p className={"text-lg text-white"}>
                Vero is thinking....
            </p>
        </div>
    )
}