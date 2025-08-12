# 🚀 Complete EC2 Deployment Guide for Skill Matrix Portal

## 📋 Prerequisites
- AWS Account with EC2 access
- Basic knowledge of Linux commands
- Domain name (optional, for custom domain)

## 🔧 Step 1: Launch EC2 Instance

### 1.1 Create EC2 Instance
1. **Login to AWS Console** → Navigate to EC2 Dashboard
2. **Launch Instance** with these specifications:
   - **AMI**: Ubuntu Server 22.04 LTS (Free Tier Eligible)
   - **Instance Type**: t2.micro (Free Tier) or t3.small (Recommended)
   - **Key Pair**: Create new or use existing SSH key pair
   - **Security Group**: Create with these rules:
     ```
     SSH (22)     - Your IP only
     HTTP (80)    - 0.0.0.0/0
     HTTPS (443)  - 0.0.0.0/0
     Custom (3000) - 0.0.0.0/0 (for development)
     ```

### 1.2 Connect to Instance
```bash
# Replace with your key file and instance IP
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
```

## 🛠️ Step 2: Server Setup

### 2.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 Install Node.js & npm
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2.3 Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2.4 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 2.5 Install Git
```bash
sudo apt install git -y
```

## 📥 Step 3: Download and Deploy Application

### 3.1 Method 1: Download from Current Session
```bash
# Create application directory
mkdir -p /home/ubuntu/skill-matrix-portal
cd /home/ubuntu/skill-matrix-portal

# If you have the code as a zip file, upload it:
# Use SCP to transfer from your local machine:
scp -i "your-key.pem" skill-matrix-portal.zip ubuntu@your-ec2-ip:/home/ubuntu/
cd /home/ubuntu
unzip skill-matrix-portal.zip
cd skill-matrix-portal
```

### 3.2 Method 2: Clone from Repository (if available)
```bash
# If you have pushed to GitHub/GitLab
git clone https://github.com/yourusername/skill-matrix-portal.git
cd skill-matrix-portal
```

### 3.3 Method 3: Manual File Transfer
Create these files manually on the server:

**Create package.json:**
```bash
nano package.json
```
Copy the package.json content from the project.

**Create all source files:**
```bash
mkdir -p src/{components/{Auth,Dashboard,Layout,Skills,SkillMatrix},contexts,pages}
```

Then create each file using `nano` and copy the content.

## 🔨 Step 4: Build and Configure Application

### 4.1 Install Dependencies
```bash
npm install
```

### 4.2 Build Production Version
```bash
npm run build
```

### 4.3 Configure Environment
```bash
# Create environment file
nano .env

# Add these variables:
VITE_APP_NAME="Skill Matrix Portal"
VITE_APP_VERSION="1.0.0"
NODE_ENV=production
```

## 🌐 Step 5: Configure Nginx

### 5.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/skill-matrix-portal
```

**Add this configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain or EC2 IP
    
    root /home/ubuntu/skill-matrix-portal/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security
    location ~ /\. {
        deny all;
    }
}
```

### 5.2 Enable Site
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/skill-matrix-portal /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## 🔒 Step 6: SSL Certificate (Optional but Recommended)

### 6.1 Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 6.2 Get SSL Certificate
```bash
# Replace with your domain
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🚀 Step 7: Start Application with PM2

### 7.1 Create PM2 Configuration
```bash
nano ecosystem.config.js
```

**Add this configuration:**
```javascript
module.exports = {
  apps: [{
    name: 'skill-matrix-portal',
    script: 'serve',
    args: '-s dist -l 3000',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

### 7.2 Install serve globally and start
```bash
sudo npm install -g serve
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔧 Step 8: Configure Firewall

```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

## 📊 Step 9: Monitoring and Logs

### 9.1 PM2 Monitoring
```bash
# View running processes
pm2 list

# View logs
pm2 logs skill-matrix-portal

# Monitor resources
pm2 monit
```

### 9.2 Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

## 🔄 Step 10: Deployment Script

Create an automated deployment script:

```bash
nano deploy.sh
chmod +x deploy.sh
```

**deploy.sh content:**
```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Pull latest changes (if using git)
# git pull origin main

# Install dependencies
npm install

# Build application
npm run build

# Restart PM2
pm2 restart skill-matrix-portal

# Reload Nginx
sudo systemctl reload nginx

echo "✅ Deployment completed!"
```

## 🌍 Step 11: Access Your Application

1. **Via IP**: `http://your-ec2-public-ip`
2. **Via Domain**: `http://your-domain.com` (if configured)
3. **HTTPS**: `https://your-domain.com` (if SSL configured)

## 🔐 Step 12: Security Best Practices

### 12.1 Update SSH Configuration
```bash
sudo nano /etc/ssh/sshd_config
```

**Add/modify these settings:**
```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 2222  # Change default SSH port
```

```bash
sudo systemctl restart ssh
```

### 12.2 Install Fail2Ban
```bash
sudo apt install fail2ban -y
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### 12.3 Regular Updates
```bash
# Create update script
nano update.sh
chmod +x update.sh
```

**update.sh:**
```bash
#!/bin/bash
sudo apt update && sudo apt upgrade -y
npm update
pm2 update
```

## 🐛 Troubleshooting

### Common Issues:

1. **Application not loading:**
   ```bash
   # Check PM2 status
   pm2 list
   pm2 logs skill-matrix-portal
   
   # Check Nginx status
   sudo systemctl status nginx
   sudo nginx -t
   ```

2. **Permission issues:**
   ```bash
   # Fix ownership
   sudo chown -R ubuntu:ubuntu /home/ubuntu/skill-matrix-portal
   ```

3. **Port conflicts:**
   ```bash
   # Check what's using port 80
   sudo netstat -tulpn | grep :80
   ```

4. **Memory issues:**
   ```bash
   # Check memory usage
   free -h
   # Restart PM2 if needed
   pm2 restart all
   ```

## 📱 Step 13: Mobile Optimization

The application is already responsive, but ensure mobile performance:

1. **Test on mobile devices**
2. **Check loading speeds**
3. **Verify touch interactions**

## 🔄 Step 14: Backup Strategy

### 14.1 Create Backup Script
```bash
nano backup.sh
chmod +x backup.sh
```

**backup.sh:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
APP_DIR="/home/ubuntu/skill-matrix-portal"

mkdir -p $BACKUP_DIR

# Backup application
tar -czf $BACKUP_DIR/skill-matrix-portal_$DATE.tar.gz $APP_DIR

# Keep only last 7 backups
find $BACKUP_DIR -name "skill-matrix-portal_*.tar.gz" -mtime +7 -delete

echo "Backup completed: skill-matrix-portal_$DATE.tar.gz"
```

### 14.2 Schedule Backups
```bash
crontab -e
```

**Add this line for daily backups at 2 AM:**
```
0 2 * * * /home/ubuntu/backup.sh
```

## ✅ Final Checklist

- [ ] EC2 instance running
- [ ] Node.js and npm installed
- [ ] Application built and deployed
- [ ] Nginx configured and running
- [ ] PM2 managing the application
- [ ] Firewall configured
- [ ] SSL certificate installed (optional)
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Security measures in place

## 🎉 Success!

Your Skill Matrix Portal is now live on EC2! 

**Demo Accounts:**
- Admin: `admin@company.com`
- Employee: `john@company.com`, `sarah@company.com`, `mike@company.com`
- Password: Any non-empty value

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review PM2 and Nginx logs
3. Ensure all services are running
4. Verify security group settings

**Estimated Total Setup Time: 30-45 minutes**
**Monthly Cost: $5-15 (depending on instance type)**