# Website Deployment Guide

This guide explains how to deploy a static website to a server using Docker and Nginx with SSL.

## Prerequisites

- A server with Ubuntu/Debian (or similar Linux)
- Docker and Docker Compose installed
- Nginx installed
- A domain pointing to your server's IP address
- SSH access to the server

## Variables

Replace these placeholders throughout the guide:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `YOUR_DOMAIN` | Your domain name | `example.com` |
| `YOUR_SERVER_IP` | Your server's IP address | `80.190.83.73` |
| `YOUR_CONTAINER_NAME` | Docker container name | `my-website` |
| `YOUR_REPO_URL` | Git repository URL | `git@github.com:user/repo.git` |

---

## First-Time Setup

### 1. Clone the Repository

```bash
git clone YOUR_REPO_URL /path/to/project
cd /path/to/project
```

### 2. Configure DNS

Go to your domain registrar's dashboard and set up A records:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `YOUR_SERVER_IP` |
| A | `www` | `YOUR_SERVER_IP` |

Verify DNS propagation:
```bash
dig YOUR_DOMAIN +short
# Should return: YOUR_SERVER_IP
```

You can also check online at: https://dnschecker.org

### 3. Open Firewall Ports

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

Or if using iptables:
```bash
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

**Note:** If using a cloud provider (AWS, DigitalOcean, Hetzner, etc.), also open ports 80 and 443 in their firewall/security group settings.

### 4. Build and Start Docker Container

```bash
cd /path/to/project
docker compose up -d --build
```

Verify it's running:
```bash
docker ps
curl http://localhost:3000
```

### 5. Configure Nginx

Create HTTP config for initial SSL setup:

```bash
sudo tee /etc/nginx/sites-available/YOUR_DOMAIN << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name YOUR_DOMAIN www.YOUR_DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/YOUR_DOMAIN /etc/nginx/sites-enabled/
sudo mkdir -p /var/www/certbot
sudo nginx -t && sudo systemctl reload nginx
```

### 6. Install SSL Certificate

Install certbot if not already installed:
```bash
sudo apt update && sudo apt install certbot python3-certbot-nginx -y
```

Get SSL certificate:
```bash
sudo certbot --nginx -d YOUR_DOMAIN -d www.YOUR_DOMAIN
```

Certbot will automatically:
- Obtain the SSL certificate
- Update Nginx config for HTTPS
- Set up auto-renewal (every 90 days)

---

## Deploying Updates

After making changes to the codebase:

### 1. Push Changes to Git

```bash
git add .
git commit -m "Your commit message"
git push
```

### 2. Deploy on Server

```bash
cd /path/to/project
git pull
docker compose up -d --build
```

That's it! The site will be updated within a few seconds.

---

## Useful Commands

### Docker

```bash
# Check running containers
docker ps

# View container logs
docker logs YOUR_CONTAINER_NAME

# Stop the site
docker compose down

# Restart the site
docker compose restart

# Rebuild and restart
docker compose up -d --build

# View real-time logs
docker logs -f YOUR_CONTAINER_NAME
```

### Nginx

```bash
# Test config
sudo nginx -t

# Reload config
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# View access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### SSL

```bash
# Check certificate status
sudo certbot certificates

# Manually renew (usually not needed, auto-renews)
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal
```

---

## Troubleshooting

### Site not loading

1. Check if Docker container is running:
   ```bash
   docker ps
   ```

2. Check container logs:
   ```bash
   docker logs YOUR_CONTAINER_NAME
   ```

3. Check if Nginx is running:
   ```bash
   sudo systemctl status nginx
   ```

4. Check Nginx error logs:
   ```bash
   sudo tail -50 /var/log/nginx/error.log
   ```

5. Test local connection:
   ```bash
   curl http://localhost:3000
   ```

### SSL certificate issues

1. Check certificate status:
   ```bash
   sudo certbot certificates
   ```

2. Check if ports are open:
   ```bash
   sudo ufw status
   ```

3. Force renewal:
   ```bash
   sudo certbot renew --force-renewal
   ```

### DNS issues

1. Verify DNS records:
   ```bash
   dig YOUR_DOMAIN +short
   dig www.YOUR_DOMAIN +short
   ```

2. Check propagation online: https://dnschecker.org

3. Flush local DNS cache (on your machine, not server):
   ```bash
   # macOS
   sudo dscacheutil -flushcache
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```

### Container won't start

1. Check build logs:
   ```bash
   docker compose build --no-cache
   ```

2. Check for port conflicts:
   ```bash
   sudo lsof -i :3000
   ```

---

## Typical File Structure

```
project/
├── Dockerfile           # Docker build instructions
├── docker-compose.yml   # Docker Compose config
├── nginx.conf           # Nginx config inside container
├── src/                 # Source files
└── dist/                # Built static files (generated)
```

---

## Important Notes

- SSL certificates auto-renew every 90 days via certbot
- The Docker container typically runs the site on port 3000
- Nginx proxies requests from port 80/443 to the container
- DNS changes can take 5-30 minutes to propagate (sometimes longer)
- Always test Nginx config with `sudo nginx -t` before reloading
