# ProductHub - Enhanced Product Gallery

A modern, feature-rich e-commerce product management system built with React, TypeScript, and Express.

## Features

- **Product Management**: Add, edit, delete, and view products with rich details
- **Search & Filter**: Advanced search with category and price range filtering
- **Shopping Cart**: Full cart functionality with quantity management
- **Product Reviews**: User review system with ratings
- **Theme Support**: Dark/light mode toggle
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **View Modes**: Switch between grid and list view
- **Sorting**: Multiple sorting options (name, price, rating)

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Radix UI components
- TanStack Query for state management
- React Hook Form with Zod validation
- Wouter for routing

### Backend
- Node.js with Express
- TypeScript
- In-memory storage (easily replaceable with database)
- RESTful API design

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Aylward-99/product-store.git
cd product-store
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/             # React frontend
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   └── pages/      # Page components
├── server/             # Express backend
│   ├── index.ts        # Server entry point
│   ├── routes.ts       # API routes
│   └── storage.ts      # Data storage layer
├── shared/             # Shared TypeScript types
└── components.json     # shadcn/ui configuration
```

## API Endpoints

### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/toggle-favorite` - Toggle favorite status

### Categories
- `GET /api/categories` - Get all categories

### Reviews
- `GET /api/products/:id/reviews` - Get product reviews
- `POST /api/products/:id/reviews` - Add product review

### Cart
- `GET /api/cart/:sessionId` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove cart item
- `DELETE /api/cart/clear/:sessionId` - Clear cart

## Features in Detail

### Product Gallery
- Responsive grid layout with hover effects
- Quick actions (view, favorite, add to cart)
- Product badges and ratings display
- Image optimization and lazy loading

### Search & Filtering
- Real-time search across product names and descriptions
- Category-based filtering
- Price range slider
- Multiple sorting options

### Shopping Cart
- Session-based cart persistence
- Quantity management
- Real-time total calculation
- Slide-out cart sidebar

### Theme System
- System preference detection
- Persistent theme selection
- Smooth theme transitions
- Dark/light mode support

## Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Consistent naming conventions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Transformation Documentation

This project was transformed from a simple HTML gallery into a full-stack e-commerce platform. See the detailed documentation:

- **[ORIGINAL_PROMPT.md](./ORIGINAL_PROMPT.md)** - The original AI prompt used to create this project
- **[TRANSFORMATION_GUIDE.md](./TRANSFORMATION_GUIDE.md)** - Complete guide showing the before/after comparison
- **[Original HTML](./attached_assets/Pasted--DOCTYPE-html-html-lang-en-head-meta-charset-UTF-8-meta-name-viewport-conte-1752750749185_1752750749189.txt)** - The original static HTML gallery

## License

MIT License - see LICENSE file for details