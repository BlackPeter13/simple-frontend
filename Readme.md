
# BCA Data Viewer

A responsive web interface for displaying data from the BCA API endpoint.

## Prerequisites

- Ubuntu 20.04 LTS
- Node.js v18.x
- npm v9.x+
- Git
- Docker (optional)
- Firewall configured (if applicable)

## 1. System Setup

### Install Node.js v18
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x
npm --version   # Should show 9.x+

Install Additional Dependencies
bash
Copy

sudo apt-get install -y git build-essential

2. Application Installation
Clone Repository
bash
Copy

git clone https://github.com/your-username/foundation-v1-client.git
cd foundation-v1-client

Install Dependencies
bash
Copy

npm install

Environment Configuration
bash
Copy

# Create environment file
echo "API_ENDPOINT=http://radioactive.sytes.net:3001/api/v1/BCA/" > .env

3. Development Setup
Run Application
bash
Copy

npm start

Application will be available at: http://localhost:8080
Run Tests
bash
Copy

npm test

Build for Production
bash
Copy

npm run build

4. Docker Setup
Build Docker Image
bash
Copy

docker build -t bca-viewer .

Run Container
bash
Copy

docker run -d -p 8080:8080 --name bca-container bca-viewer

Verify Container
bash
Copy

docker ps -a | grep bca-container

5. Production Deployment
Using PM2 Process Manager
bash
Copy

npm install -g pm2
pm2 start server.js --name "bca-viewer"

Configure as System Service
bash
Copy

pm2 startup systemd
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
pm2 save

Nginx Reverse Proxy (Optional)
nginx
Copy

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

6. Maintenance
Update Application
bash
Copy

git pull origin main
npm install
npm run build
pm2 restart bca-viewer

Monitor Logs
bash
Copy

pm2 logs bca-viewer

Security Updates
bash
Copy

sudo apt update && sudo apt upgrade -y
npm outdated
npm update

Troubleshooting
Common Issues

    Permission Errors

bash
Copy

sudo chown -R $USER:$USER /path/to/project

    Port Conflicts

bash
Copy

sudo lsof -i :8080
kill -9 <PID>

    Dependency Issues

bash
Copy

rm -rf node_modules
npm cache clean --force
npm install

    Docker Issues

bash
Copy

docker logs bca-container
docker system prune -a

License

MIT License - See LICENSE for details

Note: Replace API endpoint in .env file with your actual endpoint URL before deployment.
Copy


This guide includes:

1. Complete setup instructions for Ubuntu 20.04
2. Node.js v18 specific installation steps
3. Docker integration
4. Production deployment options
5. Maintenance procedures
6. Troubleshooting common issues
7. Security best practices

The guide assumes:
- Basic familiarity with Linux command line
- Standard Ubuntu 20.04 server setup
- Internet connectivity for package downloads

For production deployments, consider adding:
- HTTPS configuration
- Monitoring setup (Prometheus/Grafana)
- Load balancing configuration
- Backup procedures

Here's where and how to modify the endpoint configuration:

1. Create/Edit the .env file
Create a new file in the project root directory called .env:
bash
Copy

nano .env

Add this content (modify the URL):
env
Copy

# API Configuration
API_ENDPOINT=http://your-actual-endpoint-here/api/v1/BCA/
PORT=8080

2. Modify the app.js
Update the API_ENDPOINT constant in public/js/app.js:
javascript
Copy

// Change from this:
const API_ENDPOINT = 'http://radioactive.sytes.net:3001/api/v1/BCA/';

// To this:
const API_ENDPOINT = process.env.API_ENDPOINT;

3. Update server.js
Modify the server configuration to load environment variables:
javascript
Copy

import dotenv from 'dotenv';
dotenv.config();

// Then use for port:
const port = process.env.PORT || 8080;

4. Restart the Application
After making changes:
bash
Copy

npm run build && npm start

Verification Steps:

    Check environment variables are loaded:

bash
Copy

echo $API_ENDPOINT

    Test endpoint in browser:

Copy

http://localhost:8080/health

    Check network requests in browser DevTools to confirm API calls are going to your endpoint.

Important Security Note:
If you need to change the endpoint to HTTPS later:
env
Copy

API_ENDPOINT=https://your-secure-endpoint.com/api/v1/BCA/

This configuration allows easy endpoint changes without modifying source code, making it ideal for different environments (development/staging/production).
