# Deployment Documentation

## 1. Deployment Architecture

### 1.1 System Components
- Frontend (React Native Mobile App)
- Backend (Django REST API)
- Database (PostgreSQL)
- Cache (Redis)
- Web Server (Nginx)
- Container Orchestration (Docker)

### 1.2 Infrastructure Requirements
- Cloud Provider: AWS
- Container Registry: Docker Hub
- CI/CD: GitHub Actions
- Monitoring: Prometheus + Grafana
- Logging: ELK Stack

## 2. Deployment Process

### 2.1 Backend Deployment

#### Docker Configuration
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "timemanager.wsgi:application", "--bind", "0.0.0.0:8000"]
```

#### Docker Compose Configuration
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/timemanager
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  db:
    image: postgres:14
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=timemanager
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 2.2 Frontend Deployment

#### Expo Configuration
```json
{
  "expo": {
    "name": "Time Manager",
    "slug": "timemanager",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.timemanager.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.timemanager.app"
    }
  }
}
```

## 3. CI/CD Pipeline

### 3.1 GitHub Actions Workflow
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1

      - name: Login to DockerHub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push backend
        uses: docker/build-push-action@v2
        with:
          context: ./backend
          push: true
          tags: yourusername/timemanager-backend:latest

      - name: Deploy to AWS
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Update ECS service
        run: |
          aws ecs update-service --cluster timemanager-cluster --service backend-service --force-new-deployment
```

## 4. Environment Configuration

### 4.1 Environment Variables
```bash
# Backend (.env)
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@db:5432/timemanager
REDIS_URL=redis://redis:6379/0
ALLOWED_HOSTS=api.timemanager.com
CORS_ALLOWED_ORIGINS=https://app.timemanager.com

# Frontend (.env)
API_URL=https://api.timemanager.com
APP_ENV=production
```

### 4.2 Security Configuration
```python
# settings.py
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
```

## 5. Monitoring and Logging

### 5.1 Prometheus Configuration
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'backend'
    static_configs:
      - targets: ['backend:8000']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
```

### 5.2 Grafana Dashboard
```json
{
  "dashboard": {
    "id": null,
    "title": "Time Manager Dashboard",
    "tags": ["timemanager"],
    "timezone": "browser",
    "panels": [
      {
        "title": "API Response Time",
        "type": "graph",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "rate(http_request_duration_seconds_sum[5m])"
          }
        ]
      }
    ]
  }
}
```

## 6. Backup and Recovery

### 6.1 Database Backup
```bash
#!/bin/bash
# backup.sh
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
PGPASSWORD=$POSTGRES_PASSWORD pg_dump -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB > $BACKUP_DIR/backup_$TIMESTAMP.sql
```

### 6.2 Backup Schedule
```yaml
# backup-cron.yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: database-backup
spec:
  schedule: "0 0 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:14
            command:
            - /bin/sh
            - -c
            - /backup.sh
          restartPolicy: OnFailure
```

## 7. Scaling Configuration

### 7.1 Horizontal Scaling
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: yourusername/timemanager-backend:latest
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

### 7.2 Auto Scaling
```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## 8. Security Measures

### 8.1 SSL Configuration
```nginx
# nginx.conf
server {
    listen 443 ssl;
    server_name api.timemanager.com;

    ssl_certificate /etc/nginx/ssl/timemanager.crt;
    ssl_certificate_key /etc/nginx/ssl/timemanager.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 8.2 Security Headers
```nginx
# security.conf
add_header X-Frame-Options "DENY";
add_header X-XSS-Protection "1; mode=block";
add_header X-Content-Type-Options "nosniff";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
add_header Content-Security-Policy "default-src 'self'";
```

## 9. Disaster Recovery

### 9.1 Recovery Procedures
1. Database Recovery
```bash
# restore.sh
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB < $BACKUP_FILE
```

2. Application Recovery
```bash
# redeploy.sh
docker-compose down
docker-compose pull
docker-compose up -d
```

### 9.2 Recovery Testing
```bash
# test-recovery.sh
#!/bin/bash
# Simulate disaster
docker-compose down

# Restore from backup
./restore.sh

# Verify system
curl -f https://api.timemanager.com/health
```

## 10. Maintenance Procedures

### 10.1 Update Process
1. Backend Updates
```bash
# update-backend.sh
git pull origin main
docker-compose build backend
docker-compose up -d backend
```

2. Frontend Updates
```bash
# update-frontend.sh
expo publish
```

### 10.2 Health Checks
```python
# health_check.py
def check_health():
    checks = {
        'database': check_database(),
        'redis': check_redis(),
        'api': check_api()
    }
    return all(checks.values())
``` 