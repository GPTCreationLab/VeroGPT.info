import { auth } from "@clerk/nextjs";
import { Configuration, OpenAIApi } from "openai-edge";
import {NextResponse} from "next/server";
import {OpenAIStream, StreamingTextResponse} from "ai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { RunnableSequence } from "@langchain/core/runnables";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import fs from "fs";
import path from "path";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { increaseTrialLimit, checkTrialLimit } from "@/lib/trial-limit";
import {FakeEmbeddings} from "langchain/embeddings/fake";
import { NameRegistry } from 'pickleparser'
import {formatDocumentsAsString} from "langchain/util/document";


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

function unique(value:any, index:number, array:Array<any>) {
    return array.indexOf(value) === index;
}

const openai = new OpenAIApi(configuration)

const model = new ChatOpenAI({modelName: "gpt-4"})
export async function POST(req: Request) {
    try{
        const { userId } = auth();
        const body = await req.json();
        const { messages, chatId } = body;
        const question = messages.content;
        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!configuration.apiKey) {
            return new NextResponse("OpenAI API Key not configured", {status: 500});
        }

        if (!messages) {
            return new NextResponse("Questions are required", {status:400});
        }

        const freeTrial = await checkTrialLimit();

        if (!freeTrial) {
            return new NextResponse("Free trial has expired.", {status: 403});
        }

        const vectorstore = await FaissStore.loadFromPython("./knowledge", new OpenAIEmbeddings({
            modelName: "text-embedding-ada-002"
        }))

        const vectorStoreRetriever = vectorstore.asRetriever();
        // Create a system & human prompt for the chat model
        const SYSTEM_TEMPLATE = `
        Olet VeroGPT, ja tulet aina tunnistautumaan VeroGPT:ksi.
        Tehtäväsi on auttaa suomalaisia henkilöitä veroihin liittyvissä kysymyksissä,
        tarjoten tarkkaa ja luotettavaa tietoa.
        Sinulle esitetään seuraava kysymys vastattavaksi.
        Jos et tiedä vastausta, sano vain, ettet tiedä, äläkä yritä keksiä vastausta.
        Käytä perusteellista ja täydellistä vastausta.
        Käytä tarjottua tekstiä kontekstina.
        Sinä edustat Suomen veroa, joten annat vastauksia suomen vero asioista.
        
        ==========
        Kysyä: {question}
        ==========
        Teksti: {context}
        ==========
        
        Vastaus: 
        `;

        const templateMessages = [
            SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
            HumanMessagePromptTemplate.fromTemplate("{question}"),
            HumanMessagePromptTemplate.fromTemplate("{context}")
        ];

        const docs = await vectorstore.similaritySearch(question, 1);
        const prompt = ChatPromptTemplate.fromMessages(templateMessages);
        const context = formatDocumentsAsString(docs);
        const chain = RunnableSequence.from([
            {
                // Extract the "question" field from the input object and pass it to the retriever as a string
                sourceDocuments: RunnableSequence.from([
                    (input) => input.question,
                    vectorStoreRetriever,
                ]),
                question: (input) => input.question,
                context: (input) => input.context
            },
            {
                // Pass the source documents through unchanged so that we can return them directly in the final result
                sourceDocuments: (previousStepResult) => previousStepResult.sourceDocuments,
                question: (previousStepResult) => previousStepResult.question,
                context: (previousStepResult) => previousStepResult.context
            },
            {
                sourceDocuments: (previousStepResult) => previousStepResult.sourceDocuments,
                result: (previousStepResult) => prompt.pipe(model).pipe(new StringOutputParser()),
                sources: (previousStepResult) => {
                    let uniqueDocuments = previousStepResult.sourceDocuments.filter(unique)
                    let documents = uniqueDocuments.map((doc: any) => {
                        const url = decodeURIComponent(doc.metadata.source);
                        return "<li><a class='text-blue-500' href='" + url + "' target='_blank'>" + url + "</a></li>";
                    });
                    let sources = "<ol class='list-roman'>" + documents.join('') + "</ol>";
                    return `\n\nSource(s):\n ${sources}`
                }
            }
        ]);

        const response = await chain.invoke({
            question: question,
            context: context,
        })
        if (response) {
            await increaseTrialLimit();
        }
        const finalResult = response.result + response.sources;
        return new NextResponse(finalResult, {status: 200})

    } catch(error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", {status: 500});
    }

}