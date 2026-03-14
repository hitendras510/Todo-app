This project follows a monorepo architecture where multiple services
(backend API, frontend, and WebSocket server) are managed in a single repository.

The application is containerized using Docker and deployed through a CI/CD pipeline
implemented with GitHub Actions.

Pipeline workflow:

1. Developer pushes code to GitHub
2. GitHub Actions builds Docker images
3. Images are pushed to Docker Hub
4. EC2 server pulls the latest images
5. Containers are restarted to deploy the new version

The backend service communicates with PostgreSQL through Prisma ORM,
while the WebSocket server handles real-time communication.
