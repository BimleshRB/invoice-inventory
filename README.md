# Inventory & Invoice Management System

A professional, full-featured inventory and invoice management system built with Next.js, TypeScript, and shadcn/ui.

## Features

- **Dashboard** - Real-time overview of key metrics, sales charts, and recent activity
- **Product Management** - Full CRUD operations for products with category support
- **Invoice Generation** - Create professional invoices with automatic calculations
- **Customer Database** - Manage customer information and track relationships
- **Stock Management** - Track inventory levels, movements, and get low stock alerts
- **Bulk Import** - Import products and customers from CSV files
- **Reports & Analytics** - Generate business insights and export reports
- **Settings** - Configure store information, logo, and product categories
- **Dark/Light Mode** - Full theme support for comfortable viewing

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Getting Started

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000)

## Backend Integration

- Create `frontend-next/.env.local` with this content:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

- Start the backend (see `backend-java/README.md`) and ensure `NEXT_PUBLIC_API_URL` points to the backend API.
- During development the Next.js dev server rewrites `/api/**` to the backend using `NEXT_PUBLIC_API_URL` so frontend code can call `/api/...` directly.
 - A small API helper is provided at `lib/api.ts`. Import `apiFetch(path, options)` and call backend routes like `apiFetch('/products')`.

## Project Structure

\`\`\`
├── app/
│   ├── dashboard/
│   │   ├── page.tsx          # Dashboard
│   │   ├── products/         # Products management
│   │   ├── invoices/         # Invoice management
│   │   ├── customers/        # Customer management
│   │   ├── stock/            # Stock management
│   │   ├── import/           # Bulk import
│   │   ├── reports/          # Reports & analytics
│   │   ├── settings/         # Store settings
│   │   └── docs/             # Documentation
│   ├── layout.tsx
│   └── page.tsx              # Landing page
├── components/
│   ├── dashboard/            # Dashboard components
│   ├── products/             # Product components
│   ├── invoices/             # Invoice components
│   ├── customers/            # Customer components
│   ├── stock/                # Stock components
│   ├── import/               # Import components
│   ├── settings/             # Settings components
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── store.ts              # Data store
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Utility functions
\`\`\`

## CSV Import Format

### Products
\`\`\`csv
sku,name,description,category,cost_price,selling_price,quantity,min_stock,unit,barcode,expiry_date
SKU-001,Product Name,Description,Electronics,10.00,25.00,100,10,pcs,1234567890,2025-12-31
\`\`\`

### Customers
\`\`\`csv
name,email,phone,address
John Smith,john@example.com,+1 555-123-4567,"123 Main St, City, ST 12345"
\`\`\`

## API Reference

See the in-app documentation at `/dashboard/docs` for detailed API reference.

## License

MIT License
\`\`\`

```tsx file="" isHidden
