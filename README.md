# 💻 TechWare – E-Commerce Platform for Computer Hardware

TechWare is a full-scale e-commerce solution tailored for the computer hardware domain. It serves a wide range of users including individuals, resellers, small businesses, and corporate IT teams.

---

## 🚀 Features

- **🛍 Comprehensive Product Catalog**
  - Categorized listings: internal components, peripherals, networking devices, etc.
  - Filter by condition: new, rental, second-hand

- **👥 Secure User Onboarding**
  - Role-based registration: Buyers, Sellers, Admins
  - Role detection and dynamic dashboard redirection

- **💳 Transaction Management**
  - Full cart & checkout system
  - Dynamic rental pricing based on duration
  - PayFast payment gateway integration

- **🔐 Product Verification**
  - PKI digital certificates per product
  - View certificate to ensure product originality

- **📡 Real-Time Functionality**
  - Live seller dashboard updates via Socket.io
  - Instant inventory sync post-transaction

- **🛠 Admin Dashboard**
  - User management
  - Product approvals, analytics, and reporting

- **☁️ Cloud Integration**
  - **Supabase**: Real-time PostgreSQL database
  - **Cloudinary**: Fast & reliable image hosting

---

## ⚙️ Tech Stack

- **Frontend**: React (Vite), Material UI, CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL via Supabase
- **Cloud Services**: Cloudinary for image storage
- **Authentication**: JWT-based
- **Real-time**: Socket.io

---

## 📁 Project Structure


---

## 🔧 Installation Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/CSsamrah/Ecommerce-project.git
cd Ecommerce-project

### 2. Install Dependencies
### Backend

cd server
npm install

### Frontend
cd ../client
npm install

### 3. Environment Setup
Create a .env file in the server directory with the following keys:

# App
PORT=3000
NODE_ENV=development

# Supabase PostgreSQL
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PG_USER=your_postgres_user
PG_PASSWORD=your_postgres_password
PG_HOST=your_postgres_host
PG_PORT=your_postgres_port
PG_DATABASE=your_database_name

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Nodemailer (SMTP)
NODEMAIL_HOST=your_smtp_host
NODEMAIL_USER=your_email
NODEMAIL_PASS=your_email_password
NODEMAIL_PORT=587

# Cloudinary
CLOUDINARY_CLOUDNAME=your_cloud_name
CLOUDINARY_APIKEY=your_api_key
CLOUDINARY_APISECRET=your_api_secret

### 4. Running the Application
Backend Server

cd server
npm run dev

Frontend Dev Server

cd client
npm run dev

### 5.🖼 Image Upload Instructions
Inside server, create the following folders:

mkdir -p public/temp
Images are first saved to public/temp/, then uploaded to Cloudinary via backend API.

🧪 Prerequisites
* Node.js (v18.x or above)
* Git
* Supabase account
* Cloudinary account
* Chrome / Edge browser

🤝 Contributing
We welcome contributions! Feel free to open issues or submit pull requests for improvements or bug fixes.

📄 License
This project is licensed under the MIT License.

