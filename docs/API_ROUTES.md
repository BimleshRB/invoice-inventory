# API Routes and Backend Requirements

This document describes recommended REST API endpoints, payloads, authentication, and behaviors required by the frontend.

Base path: `/api`

Authentication
- Use JWT bearer tokens (Authorization: Bearer <token>) for protected routes.
- Admin and user roles; only admin routes for store/product management.
- Endpoints that mutate data require authentication.

Suggested endpoints

## Store
GET /api/store
- Returns store settings and metadata.

PUT /api/store
- Body: Partial store fields (name, address, phone, email, logo, currency, taxId)
- Auth: admin
- Response: updated store

## Categories
GET /api/categories
- Returns all categories for the current store

GET /api/categories/:id
- Returns a single category

POST /api/categories
- Body: { name, description, storeId }
- Auth: admin
- Creates category

PUT /api/categories/:id
- Body: partial category
- Auth: admin

DELETE /api/categories/:id
- Auth: admin

## Products
GET /api/products
- Query: ?q=&category=&lowStock=true
- Returns list with `category` relation resolved

GET /api/products/:id
- Returns product with category

POST /api/products
- Body: { sku, name, description, categoryId, minStockLevel, unit, barcode, imageUrl, storeId }
- Auth: admin

PUT /api/products/:id
- Body: partial product fields
- Auth: admin

DELETE /api/products/:id
- Auth: admin

POST /api/products/bulk
- Bulk import products (CSV/JSON)
- Auth: admin

## Customers
GET /api/customers
GET /api/customers/:id
POST /api/customers
PUT /api/customers/:id
DELETE /api/customers/:id

## Invoices
GET /api/invoices
- Query: ?status=&customerId=&from=&to=&page=&limit=

GET /api/invoices/:id
POST /api/invoices
- Body: { customerId, storeId, items: [{productId, quantity, unitPrice, discount, total}], subtotal, taxRate, taxAmount, discount, total, dueDate, notes }
- Behavior: decrement product quantities, create stock movement, create activity log
- Auth: admin (or cashier role)

PUT /api/invoices/:id
- Update invoice (adjust stock if items changed)

DELETE /api/invoices/:id
- Restore product quantities if needed or create adjustments

GET /api/invoices/next-number
- Returns next invoice number

## Stock Movements
GET /api/stock-movements
POST /api/stock-movements
- Body: { productId, type: 'in' | 'out' | 'adjust', quantity, reason, referenceId?, referenceType?, storeId }
- Behavior: update product quantities and create activity log

## Activity Logs
GET /api/activity-logs
- Query: ?limit=&since=

## Dashboard / Reports
GET /api/dashboard/stats
- Returns aggregated metrics: totalProducts, lowStockProducts, expiringProducts, totalRevenue, pendingInvoices, totalCustomers, recentSales (7 days), topProducts

## File/Images
POST /api/uploads
- Auth: admin
- Accept multipart/form-data
- Return URL for image

## Exports
GET /api/reports/export?from=&to=&format=txt|csv|pdf
- Generates a downloadable report similar to the client exportReport()

Validation & Error Handling
- Validate payloads using schema validation (Zod or Joi)
- Return proper HTTP codes and error messages

Transactions & Consistency
- For operations that update product quantities and create related records (invoices, stock movements), perform them within a transaction to avoid partial updates.

Security
- Rate-limit auth endpoints
- Input sanitization

Notes
- Implement pagination for list endpoints
- Support optional filters and sorting for lists
- Consider a lightweight database: PostgreSQL for relational integrity
- Add background jobs for heavy exports or report generation

