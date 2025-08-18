# 🚀 Skill Matrix Backend API

A production-ready Node.js backend for the Skill Matrix Portal with TypeScript, Express.js, PostgreSQL, and Prisma.

## 📋 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Database**: PostgreSQL with Prisma ORM
- **API Documentation**: Swagger/OpenAPI integration
- **Security**: Helmet, CORS, rate limiting, input validation
- **Logging**: Winston with structured logging
- **Testing**: Jest test framework
- **Containerization**: Docker and Docker Compose
- **CI/CD**: GitHub Actions workflow
- **Production Ready**: Error handling, monitoring, health checks

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod
- **Documentation**: Swagger
- **Containerization**: Docker
- **Reverse Proxy**: Nginx

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skill-matrix-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Setup database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed database with sample data
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the API**
   - API: http://localhost:3001
   - Documentation: http://localhost:3001/api-docs
   - Health Check: http://localhost:3001/health

### Using Docker

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **Run migrations**
   ```bash
   docker-compose exec api npx prisma migrate deploy
   ```

3. **Seed database**
   ```bash
   docker-compose exec api npm run db:seed
   ```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/change-password` - Change password

### User Management

- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)
- `POST /api/users` - Create user (Admin)
- `POST /api/users/bulk` - Bulk create users (Admin)

### Skills Management

- `GET /api/skills` - Get all skills
- `GET /api/skills/:id` - Get skill by ID
- `POST /api/skills` - Create skill
- `PUT /api/skills/:id` - Update skill (Admin)
- `DELETE /api/skills/:id` - Delete skill (Admin)
- `POST /api/skills/bulk` - Bulk create skills (Admin)
- `GET /api/skills/user/:userId` - Get user skills
- `PUT /api/skills/user/:userId/:skillId` - Update user skill
- `DELETE /api/skills/user/:userId/:skillId` - Delete user skill

### Admin Endpoints

- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/skill-matrix` - Skill matrix data
- `GET /api/admin/export/:type` - Export data

## 🗄️ Database Schema

### Core Tables

- **users**: User accounts and profiles
- **skills**: Available skills in the system
- **user_skills**: User skill assessments (many-to-many)
- **certifications**: User certifications
- **trainings**: Training assignments and progress
- **reports**: Generated reports metadata
- **audit_logs**: System audit trail

### Key Relationships

- Users can have multiple skills with proficiency levels
- Users can have multiple certifications and trainings
- Skills are categorized and tagged
- All changes are audited

## 🔐 Authentication & Authorization

### JWT Authentication

- JWT tokens with configurable expiration
- Secure password hashing with bcrypt
- Role-based access control (ADMIN/USER)

### Authorization Levels

- **Public**: Health check, API docs
- **Authenticated**: Basic user operations
- **Owner**: User can access their own resources
- **Admin**: Full system access

## 🐳 Docker Deployment

### Services

- **postgres**: PostgreSQL database
- **redis**: Redis cache (optional)
- **api**: Node.js backend API
- **nginx**: Reverse proxy with SSL

### Production Configuration

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f api

# Scale API service
docker-compose up -d --scale api=3
```

## ☁️ AWS EC2 Deployment

### Prerequisites

1. **EC2 Instance**: Ubuntu 22.04 LTS (t3.small recommended)
2. **RDS Database**: PostgreSQL 15+
3. **Security Groups**: Configure ports 80, 443, 22
4. **Domain**: Optional, for SSL certificate

### Deployment Steps

1. **Connect to EC2**
   ```bash
   ssh -i "your-key.pem" ubuntu@your-ec2-ip
   ```

2. **Install Docker**
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose -y
   sudo usermod -aG docker ubuntu
   ```

3. **Clone repository**
   ```bash
   git clone <repository-url>
   cd skill-matrix-backend
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with RDS credentials
   ```

5. **Deploy application**
   ```bash
   docker-compose up -d
   ```

6. **Setup SSL (Optional)**
   ```bash
   # Install Certbot
   sudo apt install certbot -y
   
   # Get SSL certificate
   sudo certbot certonly --standalone -d your-domain.com
   
   # Update nginx.conf with SSL configuration
   ```

### RDS Configuration

1. **Create RDS Instance**
   - Engine: PostgreSQL 15+
   - Instance: db.t3.micro (Free Tier) or db.t3.small
   - Storage: 20GB GP2
   - Multi-AZ: No (for cost optimization)

2. **Security Group**
   - Allow PostgreSQL (5432) from EC2 security group
   - No public access

3. **Connection String**
   ```
   DATABASE_URL="postgresql://username:password@rds-endpoint:5432/skillmatrix"
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

1. **Test**: Run tests and linting
2. **Build**: Create Docker image
3. **Deploy**: Deploy to EC2 instance
4. **Notify**: Send deployment status

### Required Secrets

- `EC2_HOST`: EC2 instance IP address
- `EC2_USERNAME`: SSH username (ubuntu)
- `EC2_SSH_KEY`: Private SSH key
- `GITHUB_TOKEN`: Automatically provided

### Setup Instructions

1. **Add secrets to GitHub repository**
2. **Configure EC2 instance for deployment**
3. **Push to main branch to trigger deployment**

## 📊 Monitoring & Logging

### Health Checks

- Application health: `/health`
- Database connectivity check
- Docker health checks

### Logging

- Structured JSON logging with Winston
- Log levels: error, warn, info, debug
- Log rotation and retention
- Separate error and combined logs

### Monitoring

- Application metrics
- Database performance
- API response times
- Error tracking

## 🧪 Testing

### Test Structure

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- auth.test.ts
```

### Test Categories

- **Unit Tests**: Individual functions and methods
- **Integration Tests**: API endpoints
- **Database Tests**: Prisma operations

## 🔧 Development

### Code Quality

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Husky**: Git hooks (optional)

### Database Operations

```bash
# Generate Prisma client
npm run db:generate

# Create migration
npm run db:migrate

# Deploy migrations
npm run db:deploy

# Open Prisma Studio
npm run db:studio

# Seed database
npm run db:seed
```

## 📈 Performance

### Optimizations

- Connection pooling with Prisma
- Query optimization
- Response compression
- Rate limiting
- Caching with Redis (optional)

### Scaling

- Horizontal scaling with Docker
- Load balancing with Nginx
- Database read replicas
- CDN for static assets

## 🔒 Security

### Security Measures

- Helmet.js security headers
- CORS configuration
- Rate limiting
- Input validation with Zod
- SQL injection prevention
- XSS protection
- CSRF protection

### Best Practices

- Environment variable management
- Secure password hashing
- JWT token security
- Database connection security
- Regular security updates

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**
   ```bash
   # Check database connectivity
   docker-compose exec api npx prisma db pull
   ```

2. **Migration Issues**
   ```bash
   # Reset database (development only)
   npx prisma migrate reset
   ```

3. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R ubuntu:ubuntu /path/to/app
   ```

4. **Port Conflicts**
   ```bash
   # Check port usage
   sudo netstat -tulpn | grep :3001
   ```

## 📞 Support

### Getting Help

1. Check the troubleshooting section
2. Review application logs
3. Check database connectivity
4. Verify environment variables

### Useful Commands

```bash
# View application logs
docker-compose logs -f api

# Access database
docker-compose exec postgres psql -U skillmatrix_user -d skillmatrix

# Restart services
docker-compose restart api

# Update application
git pull && docker-compose up -d --build
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

**🎉 Your Skill Matrix Backend is now ready for production!**

**Default Credentials:**
- Admin: `admin@company.com` / `admin123`
- Users: `john@company.com`, `sarah@company.com`, `mike@company.com` / `user123`

**Estimated AWS Costs:**
- EC2 t3.small: ~$15/month
- RDS db.t3.micro: ~$15/month
- Total: ~$30/month