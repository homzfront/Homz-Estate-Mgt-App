# Homz Estate Management Application

**Homz** is an integrated estate management platform designed for property managers, estate managers, landlords, and tenants (residents). The application streamlines estate operations including tenant management, billing & payments, visitor access control, and community administration.

## 🌟 Overview

Homz provides a comprehensive solution for managing residential estates with two primary user roles:
- **Estate Managers/Community Managers**: Full administrative access to manage properties, tenants, billing, and access control
- **Residents/Tenants**: Access to view estate information, manage visitor access, and track bills

## 🚀 Tech Stack

### Core Framework & Libraries
- **Next.js 15.3.5** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework

### State Management & Data Fetching
- **Zustand** - Lightweight state management with persistence
- **Axios** - HTTP client with interceptors for authentication

### UI Components & Features
- **React Hook Form** - Form validation and management
- **React Hot Toast** - Toast notifications
- **React Icons** - Icon library
- **React Modal** - Modal dialogs
- **React Slick & Swiper** - Carousels and sliders
- **@tanstack/react-virtual** - Virtual scrolling for large lists

### Development Tools
- **ESLint** - Code linting
- **PostCSS & Autoprefixer** - CSS processing

## 📁 Project Structure

```
homz-estate-mgt-app/
├── src/
│   ├── app/
│   │   ├── (authentication)/          # Authentication routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── verify-email/
│   │   │   └── forgetpassword/
│   │   ├── (account-profile)/         # Profile setup
│   │   │   ├── select-profile/
│   │   │   └── estate-form/
│   │   ├── (dashboard)/               # Protected dashboard routes
│   │   │   ├── (estate-manager)/      # Manager-specific routes
│   │   │   │   ├── dashboard/
│   │   │   │   ├── access-control/
│   │   │   │   ├── add-estate/
│   │   │   │   ├── estate-info/
│   │   │   │   ├── manage-resident/
│   │   │   │   ├── manage-users/
│   │   │   │   ├── bill-utility/
│   │   │   │   ├── finance/
│   │   │   │   ├── profile/
│   │   │   │   ├── settings/
│   │   │   │   └── support/
│   │   │   ├── resident/              # Resident-specific routes
│   │   │   │   ├── dashboard/
│   │   │   │   ├── profile/
│   │   │   │   ├── estate-info/
│   │   │   │   └── visitor-access/
│   │   │   ├── components/
│   │   │   └── features/
│   │   ├── estate-management/         # Public landing page
│   │   ├── api/
│   │   └── utils/
│   ├── components/
│   │   ├── auth/                      # Authentication components
│   │   ├── general/                   # Reusable UI components
│   │   ├── icons/                     # SVG icon components
│   │   └── layout/                    # Layout components
│   ├── store/                         # Zustand stores
│   │   ├── authStore.ts               # Authentication state
│   │   ├── useAccessStore.ts          # Access control state
│   │   ├── useResidentStore.tsx       # Resident state
│   │   ├── useSelectedCommunity.ts    # Selected community
│   │   ├── useSelectedEstate.ts       # Selected estate
│   │   ├── useResidentsListStore.ts   # Residents list
│   │   └── ...
│   ├── hooks/                         # Custom React hooks
│   ├── utils/                         # Utility functions
│   │   ├── api.ts                     # Axios instance & interceptors
│   │   ├── cookies.ts                 # Cookie management
│   │   └── ...
│   └── middleware.ts                  # Auth middleware
├── public/                            # Static assets
├── tailwind.config.js                 # Tailwind configuration
├── next.config.ts                     # Next.js configuration
└── tsconfig.json                      # TypeScript configuration
```

## 🔑 Key Features

### Authentication & Authorization
- User registration with email verification
- Secure login with JWT tokens
- Password reset functionality
- Token refresh mechanism with automatic retry
- Protected routes using Next.js middleware
- Role-based access (Estate Manager vs Resident)

### Estate Manager Features
1. **Dashboard**
   - Estate overview and statistics
   - Quick access to key functions
   - Resident and access control summaries

2. **Estate Management**
   - Create and manage multiple estates
   - Configure estate zones and properties
   - Upload estate photos (Cloudinary integration)
   - Set contact information and bank details

3. **Resident Management**
   - Register new residents/tenants
   - Bulk CSV import functionality
   - Update resident status (active/inactive)
   - View resident profiles and history
   - Manage tenant lists by estate

4. **Billing & Utilities**
   - Create custom bill types (estate fees, water, security, etc.)
   - One-time and recurring billing
   - Due date management
   - Real-time payment tracking
   - Billing history and reports
   - Automatic reminders and notifications

5. **Access Control**
   - Generate visitor access codes
   - Manage access permissions
   - Track visitor entry logs
   - Assign security guards
   - Monitor access history
   - Manual and automated access control

6. **User Management**
   - Add and manage staff users
   - Set user roles and permissions
   - Control access levels

### Resident Features
1. **Dashboard**
   - View assigned estates/properties
   - Quick access to visitor access codes
   - Bill notifications and status

2. **Visitor Access**
   - Generate access codes for visitors
   - View access code history
   - Export access records
   - Track visitor requests

3. **Estate Information**
   - View estate details and contacts
   - Access emergency numbers
   - Community announcements

4. **Profile Management**
   - Update personal information
   - View billing history
   - Manage account settings

## 🔐 Authentication Flow

1. **Registration**: User creates account → Email verification required
2. **Profile Setup**: User selects role (Manager/Resident) → Completes profile
3. **Login**: Credentials validated → JWT tokens stored in cookies
4. **Authorization**: Middleware checks token → Routes protected based on role
5. **Token Refresh**: Expired tokens automatically refreshed using refresh token

## 🗄️ State Management

The application uses **Zustand** for state management with the following key stores:

- `authStore`: User authentication, profile data, estates list
- `useAccessStore`: Access control and visitor management
- `useResidentStore`: Resident-specific data
- `useSelectedCommunity`: Currently selected community/estate
- `useResidentsListStore`: Resident list with pagination
- `useRequestStore`: Resident invitation requests

## 🌐 API Integration

- Base URL configured via `NEXT_PUBLIC_BACKEND_API_URL` environment variable
- Axios interceptors handle:
  - Automatic JWT token attachment
  - Token expiration and refresh
  - Error handling and retry logic
- Cookie-based token storage for security

## 🎨 UI/UX Features

- Responsive design for mobile, tablet, and desktop
- Custom color scheme (Blue and Gray variants)
- Loading states and skeleton loaders
- Toast notifications for user feedback
- Custom modals and dropdowns
- Image optimization with Next.js Image
- Virtual scrolling for large lists
- Interactive carousels and sliders

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- Mobile devices (< 768px)
- Tablets (768px - 1024px)
- Desktops (> 1024px)
- Max container width: 1440px

## 🚦 Getting Started

### Prerequisites
- Node.js 20 or higher
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd homz-estate-mgt-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_BACKEND_API_URL=your_backend_api_url
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration Files

- `next.config.ts` - Next.js configuration with CORS headers and image domains
- `tailwind.config.js` - Custom colors, fonts, and Tailwind extensions
- `tsconfig.json` - TypeScript compiler options
- `eslint.config.mjs` - ESLint rules and configuration

## 🌍 Environment Variables

Required environment variables:
- `NEXT_PUBLIC_BACKEND_API_URL` - Backend API base URL

## 📦 Deployment

### Deploy on Vercel

The easiest way to deploy this Next.js app is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Import the repository to Vercel
3. Configure environment variables
4. Deploy

For more details, check the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 📞 Support

For support, please contact the Homz team or open an issue in the repository.

## 🔗 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)
