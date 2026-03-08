import 'dotenv/config';
import { Worker } from 'bullmq';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from "langchain/vectorstores/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/web/pdf"; 
import { CharacterTextSplitter } from '@langchain/textsplitters';

/* ===============================
   Redis Connection
================================ */
const connection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
};

/* ===============================
   Worker
================================ */
const worker = new Worker(
  'file-upload-queue',

  async (job) => {
    try {
      console.log('📄 Processing job:', job.id);
      console.log('Data:', job.data);

      const { path, documentId } = job.data;

      /* ===============================
         1. Load PDF
      ================================= */
      const loader = new PDFLoader(path);
      const docs = await loader.load();

      console.log(`✅ PDF Loaded (${docs.length} pages)`);

      /* ===============================
         2. Split Documents
      ================================= */
      const splitter = new CharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const splitDocs = await splitter.splitDocuments(docs);

      console.log(`✂️ Split into ${splitDocs.length} chunks`);

      /* ===============================
         3. Create Embeddings (OpenRouter)
      ================================= */
      const embeddings = new OpenAIEmbeddings({
        model: 'openai/text-embedding-3-small',
        apiKey: process.env.OPENROUTER_API_KEY,
        configuration: {
          baseURL: 'https://openrouter.ai/api/v1',
        },
      });

      /* ===============================
         4. Connect Qdrant
      ================================= */
      const vectorStore =
        await QdrantVectorStore.fromExistingCollection(
          embeddings,
          {
            url: process.env.QDRANT_URL,
            collectionName: process.env.COLLECTION_NAME,
          }
        );

      console.log('🧠 Connected to Qdrant');

      /* ===============================
         5. Attach Metadata
      ================================= */
      const docsWithMetadata = splitDocs.map((doc) => ({
        pageContent: doc.pageContent,
        metadata: {
          ...doc.metadata,
          documentId: documentId || "unknown",
        },
      }));

      /* ===============================
         6. Store in Vector DB
      ================================= */
      await vectorStore.addDocuments(docsWithMetadata);

      console.log('✅ Documents stored in Qdrant successfully');

      return { success: true };
    } catch (error) {
      console.error('❌ Worker Error:', error);
      throw error; // important for BullMQ retry
    }
  },

  {
    concurrency: 5,
    connection,
  }
);

/* ===============================
   Worker Events (Production Ready)
================================ */

worker.on('completed', (job) => {
  console.log(`✅ Job completed: ${job.id}`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job failed: ${job?.id}`, err.message);
});

worker.on('error', (err) => {
  console.error('🚨 Worker crashed:', err);
});

console.log('🚀 Worker started and waiting for jobs...');