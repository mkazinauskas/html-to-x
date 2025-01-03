docker-compose up --build --detach --wait --wait-timeout 30
NEXT_PUBLIC_API_URL=http://localhost:3000 npm run test
docker-compose down