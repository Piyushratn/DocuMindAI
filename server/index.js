import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Queue } from 'bullmq';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import chatRoutes from "./routes/chat.js";

/* =========================
   App Setup
========================= */
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes);

/* =========================
   Redis Connection
========================= */
const connection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
};

/* =========================
   OpenRouter Client
========================= */
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "DocuMindAI",
  },
});

/* =========================
   BullMQ Queue
========================= */
const queue = new Queue('file-upload-queue', {
  connection,
});

/* =========================
   Ensure Upload Folder Exists
========================= */
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

/* =========================
   Multer Storage
========================= */
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, 'uploads/'),
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/* =========================
   Health Check
========================= */
app.get('/', (_, res) => {
  res.json({ status: 'Server Running ✅' });
});

/* =========================
   Upload PDF Endpoint
========================= */
app.post('/upload/pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded ❌" });
    }

    const documentId = uuidv4();

    await queue.add('file-ready', {
      documentId,
      filename: req.file.originalname,
      path: req.file.path,
    });

    console.log(`📄 Uploaded: ${req.file.originalname}`);
    console.log(`🆔 Document ID: ${documentId}`);

    res.json({
      message: 'PDF uploaded successfully ✅',
      documentId,
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Upload failed ❌' });
  }
});

/* =========================
   Chat Endpoint (RAG)
========================= */
app.get('/chat', async (req, res) => {
  try {
    const { message: userQuery, documentId } = req.query;

    if (!userQuery || !documentId) {
      return res.status(400).json({
        error: "message and documentId required ❌",
      });
    }

    /* ---------- Embeddings ---------- */
    const embeddings = new OpenAIEmbeddings({
      model: 'openai/text-embedding-3-small',
      apiKey: process.env.OPENROUTER_API_KEY,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
      },
    });

    /* ---------- Vector Store ---------- */
    const vectorStore =
      await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
          url: process.env.QDRANT_URL,
          collectionName: process.env.COLLECTION_NAME,
        }
      );

    /* ---------- Retriever ---------- */
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

    const docs = await retriever.invoke(userQuery);

    console.log(`🔎 Retrieved ${docs.length} chunks`);

    /* ---------- Prompt ---------- */
    const SYSTEM_PROMPT = `
You are an AI assistant.
Answer ONLY using the provided context.
If answer not found, say "Information not found in document".

Context:
${JSON.stringify(docs)}
`;

    /* ---------- LLM Call ---------- */
    const chatResult = await client.chat.completions.create({
      model: "openai/gpt-4.1",
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userQuery },
      ],
      max_tokens: 800,
    });

    res.json({
      message: chatResult.choices[0].message.content,
      docs,
    });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'Something went wrong ❌' });
  }
});

/* =========================
   Start Server
========================= */
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});