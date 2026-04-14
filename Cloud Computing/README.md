# CuraBot - AI-Powered Medical Assistant

## Description
As part of the Cloud Computing module, I developed and deployed CuraBot, a Retrieval-Augmented Generation (RAG) medical chatbot. This project leverages cloud services to provide intelligent, context-aware responses to medical queries by indexing a specialized medical textbook.

This project demonstrates:
- Cloud Infrastructure: Launching and configuring an AWS EC2 (Ubuntu) instance.
- Vector Database: Utilizing Pinecone (Serverless on AWS) for high-performance semantic search.
- LLM Integration: Implementing Google Gemini-1.5-Flash for natural language understanding.
- Web Deployment: Running a production-ready Flask application on a cloud server.
- CI/CD Basics: Managing environment variables and dependencies in a cloud environment.

---

## Project Architecture
The architecture follows a modern RAG (Retrieval-Augmented Generation) pipeline:

1.  Data Ingestion: A medical PDF is processed, chunked, and transformed into embeddings using HuggingFace.
2.  Vector Storage: Embeddings are stored in Pinecone (AWS Region) for efficient retrieval.
3.  User Query: A user asks a question via the Flask-based web interface.
4.  Retrieval: The system performs a similarity search in Pinecone to find relevant medical context.
5.  Generation: The context and the query are sent to Google Gemini, which generates an empathetic and accurate response.
6.  Response: The answer is delivered back to the user in real-time.

---

## Deployment Steps (AWS EC2)

### 1. Launch EC2 Instance
- AMI: Ubuntu Server 24.04 LTS.
- Instance Type: t2.medium (recommended for LLM pipelines).
- Security Group: Allowed inbound traffic on:
  - SSH (Port 22) for management.
  - Custom TCP (Port 8080) for the Flask application.
  - HTTP (Port 80) for web access.

### 2. Connect and Environment Setup
Connect via SSH and update the system:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3-pip -y
```

### 3. Project Deployment
Clone the repository and install dependencies:
```bash
git clone <your-repo-link>
cd CuraBot
pip install -r requirements.txt
```

### 4. Configure Cloud Secrets
Create a .env file to securely store cloud API keys:
```bash
nano .env
# Add the following:
# PINECONE_API_KEY=your_pinecone_key
# GOOGLE_API_KEY=your_gemini_key
```

### 5. Start the Application
Run the application in the background using nohup or screen:
```bash
python3 app.py
```

---

## Tech Stack
- Cloud: AWS EC2 (Compute), Pinecone (Vector DB on AWS).
- AI/ML: LangChain, Google Gemini-1.5-Flash, HuggingFace Embeddings.
- Backend: Python, Flask.
- Frontend: HTML, CSS (Custom UI).

## Output
Successfully deployed a scalable, AI-powered medical chatbot accessible via an AWS Public IP, demonstrating end-to-end cloud-native application development.


