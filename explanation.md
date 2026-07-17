# 📖 FreshMart E-Commerce Platform — Plain-English Code Explanation

This document is a complete walkthrough of the entire codebase. If you have **zero programming experience**, this guide is written specifically for you! It explains what every folder represents, what every file does, and how the actual code makes things happen.

---

## 🗺️ High-Level Map of the Project Folders

Imagine this website is like a restaurant:
*   **`src/app/` (The Kitchen & Front Desk)**: This is where we prepare the food (the backend server routes) and design the dining tables (the frontend web pages). Next.js uses this folder to decide what page to show when a user types a link (like `/products`).
*   **`src/components/` (The Furniture & Decor)**: These are reusable elements like chairs, tables, and salt shakers. In code, these are things like the **Navbar** (header navigation bar) or **Product Cards** that we build once and use on multiple pages.
*   **`src/context/` (The Server's Notepad)**: This keeps track of information as you move around the restaurant (like what items you currently have in your shopping cart).
*   **`prisma/` (The Storage Room & Pantry)**: This handles our database where all our inventory (products, categories, order logs, reviews) is safely stored on disk.
*   **`src/lib/` (The Utility Closet)**: Special helper tools, specifically the tool that turns on the lights and connects us to the storage pantry (database).

---

## 🗄️ 1. The Database Layer (`prisma/`)

This folder manages our storage. Our database tool is called **Prisma**. It lets us talk to a database file (`dev.db`) using easy-to-read English terms instead of complex database instructions.

### 📄 `prisma/schema.prisma` (The Blueprints)
This file defines the exact structure of our database. It's like a spreadsheet layout with tables, columns, and rules on how they connect.

Key parts of the file:
*   **`datasource db`**: Tells Prisma we are using a **SQLite** database. SQLite is unique because it stores the entire database in a single local file (`dev.db`) right in our project, so we don't need a heavy external database server.
*   **`model User`**: A blueprint for registering accounts. It saves each user's `id` (a unique random serial number), `name`, `email`, and an encrypted `password`.
*   **`model Category`**: Represents product categories (e.g., "Dairy & Eggs"). It holds a name, an emoji icon, and keeps a list of all products belonging to it.
*   **`model Product`**: Describes a grocery item. It holds `name`, `price`, `description`, `stock` (how many are left), `rating` (average score), and how many people reviewed it. It links to a `Category` using a relation: `category Category @relation(...)`.
*   **`model Order`**: Records checkout details. It holds who ordered it, the transaction totals (subtotal, tax, final total), the shipping address, and the current status (e.g., "placed", "processing", "shipped", "delivered").
*   **`model OrderItem`**: A specific line item inside an order. For example, if you buy 3 milks and 2 breads, one `Order` will contain two `OrderItem` records linking back to the `Product` table.
*   **`model Review`**: Stores a star rating (1 to 5) and a written comment left by a `User` on a specific `Product`.
*   **`model SupportTicket`**: Stores inquiries submitted through the contact form (name, email, subject, message).

### 📄 `prisma/seed.ts` (The Initial Inventory Loader)
When you first start the database, it's empty. This script runs once to prepopulate it with 20 grocery products (Apples, Bread, Coffee, etc.) and a mock user (`demo@localstore.com`).

*   **How it works**: It connects to Prisma (`new PrismaClient`), wipes out any old data (`deleteMany()`), inserts a demo user account with a hashed/scrambled password (`hashSync`), creates 5 categories, and runs a loop to create the product list. Finally, it prints confirmation details to the terminal.

---

## 🧠 2. Global State Management (`src/context/`)

When you browse from page to page, the browser usually forgets everything. We need a way to remember what is in your shopping cart. We do this using **React Context**.

### 📄 `src/context/CartContext.tsx` (The Cart Brain)
This file is the "brain" of the shopping cart.
*   **`CartItem` Interface**: Defines what information we store for each item in the cart (its database `id`, `name`, `price`, `image emoji`, `quantity`, and its URL `slug`).
*   **`cartReducer` Function**: A central decision-maker. It takes the current cart state and an action (like `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, or `CLEAR_CART`) and outputs the new cart state.
    *   *Example logic*: If you add a product that is already in the cart, it doesn't create a duplicate row. Instead, it finds the index (`findIndex`) and adds the new quantity to the existing one.
*   **`CartProvider` Component**:
    *   Contains a `useEffect` hook that checks the browser's storage closet (`localStorage.getItem('cart')`) when you first load the page. If it finds saved items, it loads them so your cart doesn't disappear when you refresh!
    *   It contains another `useEffect` hook that saves the cart back to `localStorage` every time the items list changes.
    *   It calculates live totals: `totalItems` (sum of quantities), `subtotal` (prices multiplied by quantities), `tax` (8%), and the final `total`.

---

## 🧱 3. Reusable Elements (`src/components/`)

These files build modular interface parts that are repeated on different pages.

### 📄 `src/components/Navbar.tsx` (The Header Navigation)
This is the glass-effect bar stuck to the top of the screen.
*   It displays the **FreshMart** logo, a search box input, a shop link, a user login link, an orders link, and a shopping cart button.
*   It reads `totalItems` from the `CartContext` to display the green circle count badge (e.g., `🛒 3`) only if you have items in your cart.
*   Clicking the cart button calls `toggleDrawer(true)`, which opens the slide-out cart sidebar.

### 📄 `src/components/CartDrawer.tsx` (The Slide-out Cart Sidebar)
A drawer that slides out from the right side of the screen when you click the cart icon.
*   It displays a list of items currently in your cart.
*   For each item, it shows the price, quantity, and provides `+` and `−` buttons to increase/decrease quantity, and a trash can icon to remove the item completely.
*   It calculates and displays the live order subtotal, tax, and total.
*   It contains a button that links to `/cart` for checking out.

### 📄 `src/components/ProductCard.tsx` (The Product Preview Box)
The card grid item displayed on the home page and catalog search pages.
*   It extracts an emoji representation from a map (`productEmojis`) corresponding to the product's slug (e.g., `organic-red-apples` maps to 🍎).
*   Displays a star rating block (`StarRating`) by drawing filled star symbols `★` and empty ones depending on the product's average score.
*   Contains a round `+` button. Clicking it calls the cart context's `addItem` function directly, prompting the CartDrawer to slide out instantly to confirm the item was added.

### 📄 `src/components/AddToCartButton.tsx` (Detail Page Quantity Selector)
Used exclusively on the product details page.
*   Provides a larger quantity selector so users can adjust quantity before adding (e.g., adding 5 packs of strawberries at once).
*   It disables itself (`disabled={product.stock === 0}`) if the item is out of stock.

### 📄 `src/components/ReviewForm.tsx` (User Reviews & Star Inputs)
Handles displaying customer reviews and letting users submit new ones.
*   **`ReviewForm`**: Uses a hover state (`hoverRating`) to light up stars as you mouse over them. When a user clicks a star and writes a comment, it sends a web request (POST) to `/api/reviews`. If the request fails because the user isn't logged in, it shows a red alert banner.
*   **`ReviewList`**: Renders all previous reviews. It creates a colored circular avatar using the first letter of the reviewer's name (e.g., "D" for "Demo User") and displays the date formatted nicely.

### 📄 `src/components/Footer.tsx` (The Page Footer)
The dark background footer at the bottom of the page containing shop shortcuts, help resources, store location, operating hours, and copyright text.

---

## 🌐 4. The Pages & Logic Layer (`src/app/`)

This is the core structure of our page routing. Next.js creates a web page URL for every folder that contains a `page.tsx` file.

### 📄 `src/app/layout.tsx` (The Master Wrapper)
This is the master template. Every page loads inside this layout.
*   It injects the **Inter Font** from Google Fonts.
*   It wraps everything inside the `<CartProvider>`, which ensures the cart memory is shared across the entire site.
*   It places the `<Navbar />` at the top, the main content in the middle (`<main>{children}</main>`), the `<CartDrawer />` on the side, and the `<Footer />` at the bottom.

### 📄 `src/app/page.tsx` (The Home Page)
When you type the main website URL, this page loads.
*   It is a **Server Component** (runs code on the server before sending it). It directly connects to our database (`prisma.product.findMany`) to pull "featured" products and categories.
*   It renders the main Hero Section (the big header with statistics and action buttons), lists category card circles, lists featured product cards, and displays a promo banner.

### 📄 `src/app/products/page.tsx` (The Store Catalog & Search)
The page where you can search, sort, and filter products.
*   It reads URL variables (like `?category=bakery&sort=price-asc`) sent by the browser.
*   It builds a database query dynamically based on those variables. If the user typed a price minimum, it filters results where the price is greater than or equal to that number.
*   It splits results into pages (pagination), showing 12 products per page.
*   It displays a sidebar on the left (`FilterSidebar.tsx`) where users check boxes to filter or change sorts, which dynamically updates the URL parameters and triggers Next.js to fetch the filtered database results automatically.

### 📄 `src/app/products/[slug]/page.tsx` (Individual Product Details)
The `[slug]` in the folder name means it's a **Dynamic Route**. If you visit `/products/sweet-strawberries`, Next.js reads `"sweet-strawberries"` as a variable parameter (`slug`).
*   It queries the database for a product matching that slug. If it doesn't exist, it displays a "Not Found" error page.
*   It queries related products belonging to the same category to show a "You Might Also Like" section.
*   Renders the product page details, the add-to-cart controls, and the reviews lists.

### 📄 `src/app/cart/page.tsx` (The Full Cart Page)
A complete page version of your shopping cart.
*   Lists all items, their individual line totals, and lets you adjust quantities.
*   Shows a checkout order summary box. It calculates shipping cost: if the subtotal is over $50, shipping is free! Otherwise, it adds a flat `$4.99` fee.
*   Contains a link to proceed to the Checkout page.

### 📄 `src/app/checkout/page.tsx` (Shipping Details & Mock Payment)
*   Displays a form requesting shipping information (Name, Email, Address, City, ZIP code, Phone).
*   Displays an order summary.
*   Submitting the form triggers a fetch request sending the checkout payload to `/api/orders`. Once the backend saves it, it clears the cart memory (`clearCart()`) and redirects the user to their new order tracking page.

### 📄 `src/app/orders/page.tsx` (Order History List)
Queries the database to list all orders placed on the system.
*   Orders are ordered by date (newest first).
*   Displays status badges colored dynamically depending on status: "placed" (yellow warning), "processing"/"shipped" (blue primary), "delivered" (green success).

### 📄 `src/app/orders/[id]/page.tsx` (Real-Time Order Tracking Details)
A page dedicated to tracking a specific order.
*   Displays a visual timeline list: **Order Placed** ➔ **Processing** ➔ **Shipped** ➔ **Delivered**. It checks the current database status and colors the completed stages green.
*   Shows the exact shipping address and items purchased.

### 📄 `src/app/support/page.tsx` (FAQ & Customer Support Portal)
*   Displays an interactive FAQ Accordion. It uses the native HTML `<details>` and `<summary>` tags which expand and collapse smoothly when clicked.
*   Provides a contact form. Submitting it sends a request to `/api/support` to log a support ticket in the database.

---

## 🔌 5. Backend Server Routes (`src/app/api/`)

Next.js lets you write backend code in files named `route.ts`. These behave like separate mini-servers.

### 📄 `src/app/api/orders/route.ts` (Order Creation Server Endpoint)
*   **POST request**: Receives the checkout form payload. It validates that the cart isn't empty and that address data is present. It queries the database to match a user account, saves the order details inside the `Order` and `OrderItem` tables, and returns the newly generated order ID so the browser can redirect the user to it.
*   **GET request**: Simply fetches and returns a list of all orders.

### 📄 `src/app/api/reviews/route.ts` (Review Submission Endpoint)
*   **POST request**: Saves a customer review. After adding it to the `Review` table, it queries the database for all reviews belonging to that product, calculates the new mathematical average, and updates the product's `rating` and `reviewCount` columns so it reflects on the catalog instantly.

### 📄 `src/app/api/support/route.ts` (Support Ticket Submission Endpoint)
*   **POST request**: Receives support form inputs and inserts a new entry inside the `SupportTicket` table.

### 📄 `src/app/api/auth/login/route.ts` & `register/route.ts` (Authentication Endpoints)
*   **`register/route.ts`**: Receives registration info, checks if the email is already in use, runs the password through `bcryptjs` (a password scrambling machine) to create a safe hashed password, saves it, and logs the user in.
*   **`login/route.ts`**: Finds the user by email, compares the inputted password with the database's hashed password (`compareSync`), and logs them in if they match.
