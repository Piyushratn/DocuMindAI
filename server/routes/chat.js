import express from "express";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question, documentId } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "Question required",
      });
    }

    console.log("💬 Question:", question);
    console.log("📄 Document:", documentId);

    /* ===============================
       1️⃣ Embeddings (OpenRouter)
    =============================== */
    const embeddings = new OpenAIEmbeddings({
      model: "openai/text-embedding-3-small",
      apiKey: process.env.OPENROUTER_API_KEY,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
      },
    });

    /* ===============================
       2️⃣ Connect Qdrant
    =============================== */
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: process.env.COLLECTION_NAME,
      }
    );

    /* ===============================
       3️⃣ Retriever (PDF filter)
    =============================== */
    const retriever = vectorStore.asRetriever({
      k: 4,
      filter: {
        must: [
          {
            key: "metadata.documentId",
            match: { value: documentId },
          },
        ],
      },
    });

    /* ===============================
       4️⃣ LLM (OpenRouter)
    =============================== */
    const llm = new ChatOpenAI({
      model: "openai/gpt-4o-mini",
      apiKey: process.env.OPENROUTER_API_KEY,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
      },
      temperature: 0,
    });

    /* ===============================
       5️⃣ Prompt Template
    =============================== */
    const prompt = ChatPromptTemplate.fromTemplate(`
You are a helpful AI assistant.

Answer ONLY using the provided context.
If the answer is not in the context, say:
"I could not find this in the document."

Context:
{context}

Question:
{input}
`);

    /* ===============================
       6️⃣ Create RAG Chain (NEW WAY)
    =============================== */
    const combineDocsChain = await createStuffDocumentsChain({
      llm,
      prompt,
    });

    const ragChain = await createRetrievalChain({
      retriever,
      combineDocsChain,
    });

    /* ===============================
       7️⃣ Ask Question
    =============================== */
    const response = await ragChain.invoke({
      input: question,
    });

    console.log("✅ Answer generated");

    res.json({
      answer: response.answer,
    });

  } catch (err) {
    console.error("❌ Chat error:", err);

    res.status(500).json({
      error: "Chat failed",
    });
  }
});

export default router;