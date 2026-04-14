# Docker Infrastructure - PDF Intelligence Engine

## Project Overview
This repository contains a containerized suite of tools for high-precision PDF extraction and structural intelligence. The infrastructure is built on Docker to ensure a "plug-and-play" experience across different environments, from local development to cloud-based microservices.

---

## 1. Architectural Strategy: Image Construction

**Objective**  
Develop a lightweight, high-performance container environment optimized for Python-based PDF processing.

**Key Technical Implementations:**
- **Base Layer:** Utilized `python:3.10-slim` to reduce image size by approximately 60%, ensuring faster deployment and a smaller attack surface.
- **Dependency Isolation:** System libraries (like `libgl1` and `libxfixes3`) are installed at the system layer to support PDF rendering, while Python dependencies are managed separately to leverage Docker's layer caching.
- **Multi-Stage Readiness:** The Dockerfile is structured to easily transition into multi-stage builds for production environments.

**Build Commands:**
```bash
# Build the Extraction Service
docker build -t pdf-extraction-service:v1.0 ./pdf-extraction-service

# Build the Structure Analyzer
docker build -t pdf-structure-analyzer:v1.0 ./pdf-structure-analyzer
```

---

## 2. Container Lifecycle & Execution Management

**Objective**  
Standardize how the engine starts, processes data, and shuts down, treating the PDF tools as a modular executable.

**Lifecycle Features:**
- **Entrypoint Logic:** Used `ENTRYPOINT` to allow the container to accept dynamic CLI arguments, making it versatile for batch processing tasks.
- **Graceful Termination:** Configured environment variables (`PYTHONUNBUFFERED=1`) to ensure real-time logging and clean process exits.

**Execution Patterns:**
- **Status Check:** `docker ps -a` (to monitor the engine's state).
- **Execution Logs:** `docker logs [container_id]` (to capture extraction telemetry).

---

## 3. Data Persistence & I/O Orchestration

**Objective**  
Enable seamless data transfer between the host machine and the containerized engine without compromising data integrity.

**Volume Mapping Strategy:**
To process local PDF files and save the extracted JSON metadata, we utilize **Bind Mounts**. This allows the container to operate directly on the project's `input` and `output` directories.

**Deployment Command:**
```bash
docker run -it --name engine-v1 \
  -v ${PWD}/data/input:/app/input \
  -v ${PWD}/data/output:/app/output \
  pdf-extraction-service:v1.0
```

---

## 4. Resource Isolation (Networking)

**Objective**  
Prepare the PDF Intelligence Engine for a distributed service architecture.

**Implementation:**
- **Custom Bridge Network:** Created a dedicated network to allow the Extraction Service and Structure Analyzer to communicate securely if needed in a multi-container setup.
- **Isolation:** Each service runs in its own namespace, preventing port conflicts and ensuring resource stability.

---

## 5. Artifact Distribution & Versioning

**Objective**  
Standardize image versioning for consistent deployments across CI/CD pipelines.

**Workflow:**
- **Semantic Tagging:** Each build is tagged with a version number (e.g., `v1.0.1-stable`) for auditability.
- **Registry Management:** Images are prepared for distribution via private/public registries, enabling "One-Click" deployment on cloud providers like Render, AWS, or Azure.

**Distribution Commands:**
```bash
docker tag pdf-extraction-service:v1.0 your-registry-user/pdf-extraction:latest
docker push your-registry-user/pdf-extraction:latest
```

---

### Engineering Advantages:
1. **Zero-Configuration Setup:** No need for local Python or library installation; everything is encapsulated within the container.
2. **Reproducibility:** Guarantees that the PDF extraction output is identical regardless of the host OS (Linux, Mac, or Windows).
3. **Scalability:** The architecture is designed to be easily orchestrated via Kubernetes for large-scale enterprise data processing.

### Theory References
** https://github.com/Sarvesh-Shelgaonkar/Placement-Materials **
