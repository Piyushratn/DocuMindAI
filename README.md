# 🚀 DocuMind AI

DocuMind AI is an **AI-powered document question-answering system** that allows users to upload PDF files and ask questions about the content.
It uses **Retrieval-Augmented Generation (RAG)** to provide accurate answers based on the uploaded document.

The system processes documents using **LangChain, OpenAI embeddings, and Qdrant vector database**, while **BullMQ workers** handle background document processing for scalability.

---

# ✨ Features

• Upload and process PDF documents
• Ask questions based on document content
• AI-powered answers using RAG
• Vector search with Qdrant
• Background processing using BullMQ workers
• Scalable architecture using Docker
• Modern UI built with Next.js

---

# 🧠 Architecture

The system follows a **Retrieval-Augmented Generation (RAG)** pipeline:

1. User uploads a PDF document
2. Worker extracts and splits document text
3. Text embeddings are generated using OpenAI
4. Embeddings are stored in Qdrant vector database
5. User asks a question
6. Relevant chunks are retrieved from Qdrant
7. LLM generates an answer using retrieved context

---

# 🛠 Tech Stack

### Frontend

* Next.js
* Tailwind CSS

### Backend

* Node.js
* Express.js

### AI / ML

* LangChain
* OpenAI Embeddings
* Retrieval-Augmented Generation (RAG)

### Database

* Qdrant Vector Database

### Background Jobs

* BullMQ
* Redis

### DevOps

* Docker
* Docker Compose

---

# 📂 Project Structure

```
DocuMindAI
 ├ client        # Next.js frontend
 ├ server        # Backend APIs + worker
 ├ docker-compose.yml
 └ README.md
```

---

# ⚙️ Installation

### 1️⃣ Clone the repository

```
git clone https://github.com/Piyushratn/DocuMindAI.git
cd DocuMindAI
```

### 2️⃣ Install dependencies

```
cd server
npm install

cd ../client
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file inside the **server folder**

```
OPENAI_API_KEY=your_openai_api_key
REDIS_HOST=localhost
```

### 4️⃣ Start services with Docker

```
docker-compose up
```

---

# 🚀 Running the Project

Start the backend:

```
cd server
node index.js
```

Start the worker:

```
node worker.js
```

Start the frontend:

```
cd client
npm run dev
```

---

# 📸 Future Improvements

• Multi-document search
• Chat history
• Streaming responses
• Authentication system
• Cloud deployment

---

# 👨‍💻 Author

**Piyush**

GitHub:
https://github.com/Piyushratn



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
