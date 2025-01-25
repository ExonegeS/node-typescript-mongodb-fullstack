# Backend

```shell
cd backend;
npm run build;
cd ..;
docker compose -f 'docker-compose.yml' up -d --build 'backend'

docker compose -f 'docker-compose.yml' up -d --build 'frontend'

http://localhost:3000
```