"use client"

import * as z from "zod";
import {MessageSquare} from "lucide-react";
import {Heading} from "@/components/heading";
import {useForm} from "react-hook-form";
import { formSchema } from "@/app/(chat)/constants";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import axios from "axios";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {ChatCompletionRequestMessage} from "openai-edge";
import {Empty} from "@/components/empty";
import {Loader} from "@/components/loader";
import {cn} from "@/lib/utils";
import {v4 as uuid} from 'uuid';
import {UserAvatar} from "@/components/user-avatar";
import {BotAvatar} from "@/components/bot-avatar";
import {useProModal} from "@/hooks/use-pro-modal";
import {useCheckPayment} from "@/hooks/check-payment";

const ChatbotPage = () => {
    const proModal = useProModal()
    const router = useRouter()
    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])
    const [chatId, setChatId] = useState("")
    const payment = useCheckPayment();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    useEffect(()=>{
        if (!chatId) {
            if (messages) {
                setChatId(uuid())
            }
        }
    }, [chatId, messages])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            console.log(values.prompt);
            const userMessage: ChatCompletionRequestMessage = {
                role: "user",
                content: values.prompt
            }

            const response = await axios.post("/api/chat", {
                messages: userMessage,
                chatId: chatId
            })

            if (response.data) {
                const responseMessage: ChatCompletionRequestMessage =  {
                        role: "assistant",
                        content: response.data
                }
                setMessages((current) => [...current, responseMessage, userMessage]);
            }


            form.reset();
        } catch(error: any) {
            if (error?.response?.status === 403) {
                proModal.onOpen();
            }
            console.log(error)
        } finally {
            router.refresh();
        }
    }

    return (
        <div>
            <div className={"mb-8 space-y-4"}>
                <Heading
                    title={"Chat with veroGPT"}
                    description={"Get up to date information from the Vero.fi website"}
                    icon={MessageSquare}
                />
            </div>
            <div className={"px-4 md:px-20 lg:px-32 space-y-4"}>
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className={"rounded-3xl mb-8 bg-white border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"}
                        >
                            <FormField name={"prompt"} render={({field}) => (
                                <FormItem className={"col-span-12 lg:col-span-10"}>
                                    <FormControl className={"m-0 p-0"}>
                                        <Input
                                            className={"border-0 text-lg outline-none focus-visible:ring-0 focus-visible:ring-transparent"}
                                            disabled={isLoading}
                                            placeholder={"Ask vero.fi a question..."}
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                            />
                            <Button
                                className={"rounded-full text-lg col-span-12 lg:col-span-2 w-full bg-[#4CC534] hover:bg-[#4CC534]/80"}
                                disabled={isLoading}
                            >Ask</Button>
                        </form>
                    </Form>
                </div>
                <div className={"space-y-4 mt-4"}>
                    {isLoading && (
                        <div className={"p-8 rounded-lg w-full flex items-center justify-center"}>
                            <Loader/>
                        </div>
                    )}
                    {messages.length === 0 && !isLoading && (
                        <Empty label={"No Conversation Started"}/>
                    )}
                    <div className={"flex flex-col-reverse"}>
                        {messages.map((message) => (
                            <div className={"mb-4"} key={message.content}>
                                {message.role === "user" ?
                                    <div className={"p-4 w-full flex gap-x-4 rounded-3xl bg-white border-solid border-2 border-[#DDDDDD]"}>
                                        <div className={"self-start"}>
                                            <UserAvatar/>
                                        </div>
                                        {message.content && (
                                            <p style={{whiteSpace: 'pre-wrap'}} className={"text-md self-center"}
                                               dangerouslySetInnerHTML={{__html: message.content}}>
                                            </p>
                                        )}
                                    </div>
                                    :
                                    <div className={"p-4 w-full flex gap-x-4 rounded-3xl bg-[#D4FFB9]  border-solid border-2 border-[#BEFF96]"}>
                                        <div className={"self-start"}>
                                            <BotAvatar/>
                                        </div>
                                        {message.content && (
                                            <p style={{whiteSpace: 'pre-wrap'}} className={"text-md self-center"}
                                               dangerouslySetInnerHTML={{__html: message.content}}>
                                            </p>
                                        )}
                                    </div>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatbotPage;
