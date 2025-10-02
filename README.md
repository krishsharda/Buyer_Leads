# 🏡 PropertyLead Pro - Real Estate Lead Management System

A professional buyer lead management system built for real estate agents and agencies. Track, manage, and convert property leads with advanced filtering, budget tracking, and timeline management.

![PropertyLead Pro Dashboard](https://buyerleads-production.up.railway.app/og-image.png)

## 🚀 Live Demo

**🌐 [Try PropertyLead Pro](https://buyerleads-production.up.railway.app)**

## ✨ Features

### 📊 **Lead Management**
- ✅ Create and manage buyer leads
- ✅ Advanced search and filtering
- ✅ Budget range tracking
- ✅ Timeline and status management
- ✅ Property type categorization (Apartment, Villa, Commercial, etc.)
- ✅ BHK specifications
- ✅ Contact information management

### 🔐 **Authentication & Security**
- ✅ Secure login system with NextAuth.js
- ✅ User session management
- ✅ Protected routes and API endpoints
- ✅ Professional credential-based authentication

### 🎨 **Modern UI/UX**
- ✅ Responsive design for all devices
- ✅ Professional dashboard interface
- ✅ Intuitive form handling
- ✅ Real-time data updates
- ✅ Modern glassmorphism design elements

### 📱 **Mobile Friendly**
- ✅ Fully responsive design
- ✅ Touch-optimized interface
- ✅ Mobile-first approach
- ✅ Progressive Web App (PWA) ready

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React, TypeScript
- **Styling:** Tailwind CSS, Modern UI Components
- **Authentication:** NextAuth.js v5
- **Database:** SQLite with Drizzle ORM
- **Deployment:** Railway Platform
- **Forms:** React Hook Form with Zod validation
- **Icons:** Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/krishsharda/Buyer_Leads.git
cd Buyer_Leads
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Configure your environment variables**
```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

This application is optimized for Railway deployment:

1. **Connect your GitHub repository to Railway**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically on git push**

### Environment Variables for Production:
```env
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.up.railway.app
```

## 📖 Usage Guide

### 🔑 **Login**
1. Navigate to the application
2. Use the credential-based login system
3. Access your personalized dashboard

### 📝 **Managing Leads**
1. **Create New Lead:** Click "Add New Buyer Lead"
2. **Fill Details:** Enter buyer information, preferences, budget
3. **Save & Track:** Lead appears in your dashboard immediately
4. **Search & Filter:** Use advanced filters to find specific leads

### 🔍 **Search & Filter Options**
- Search by name, phone, or email
- Filter by city, property type, BHK
- Budget range filtering
- Status and timeline filtering
- Sort by creation date or last update

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── buyers/            # Buyer management pages
│   └── api/               # API routes
├── components/            # Reusable UI components
├── db/                    # Database schema and config
├── lib/                   # Utility functions and configs
└── styles/                # Global styles and Tailwind config
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Buyer Management
- `GET /api/buyers` - Fetch all buyers with filtering
- `POST /api/buyers-static` - Create new buyer lead
- `GET /api/buyers/[id]` - Get specific buyer details

### System
- `GET /api/health` - Health check endpoint
- `GET /api/diagnostic` - System diagnostics

## 🎯 Target Users

- **Real Estate Agents** - Individual agents managing their leads
- **Real Estate Agencies** - Teams tracking multiple agents' leads
- **Property Consultants** - Managing client requirements
- **Real Estate Startups** - Building their lead management system

## 📈 Future Enhancements

- 📧 Email integration and automation
- 📱 Mobile app (React Native)
- 📊 Advanced analytics and reporting
- 🔗 CRM integrations
- 💾 Document management
- 🏠 Property matching algorithms
- 📅 Calendar integration
- 💬 Communication tracking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Krish Sharda**
- GitHub: [@krishsharda](https://github.com/krishsharda)
- LinkedIn: [Krish Sharda](https://linkedin.com/in/krishsharda)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Railway for seamless deployment
- Tailwind CSS for beautiful styling
- The open-source community

---

**⭐ Star this repository if you find it helpful!**

Built with ❤️ using Next.js and deployed on Railway.
