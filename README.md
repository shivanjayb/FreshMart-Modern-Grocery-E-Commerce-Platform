<<<<<<< HEAD
# FreshMart — Modern Grocery E-Commerce Platform 🛒

Welcome to **FreshMart**! This is a professional, production-ready full-stack grocery e-commerce web application. It was designed and built to bridge the gap between neighborhood stores and online convenience, offering local residents instant access to fresh produce, artisan goods, and daily essentials with seamless same-day delivery.

This project showcases a highly interactive, responsive glassmorphism UI built to handle everything from user authentication and persistent shopping carts to live order tracking, support ticket submission, and real-time product reviews.

---

---

## 🛠️ Tech Stack

This platform is built using a modern, full-stack JavaScript environment:
*   **Frontend Framework**: **Next.js 16 (App Router)** - Renders pages dynamically on the server and provides interactive interfaces on the client.
*   **Programming Language**: **TypeScript** - Adds static types to JavaScript to catch bugs early and structure data models cleanly.
*   **Database Tool (ORM)**: **Prisma 7** - Connects the JavaScript code to the database and manages database queries.
*   **Database**: **SQLite** (via `@prisma/adapter-libsql`) - A lightweight, file-based database requiring no external database servers.
*   **Styling**: **Vanilla CSS (globals.css)** - Direct, ultra-responsive glassmorphism UI variables without heavy library overhead.
*   **Security**: **bcryptjs** - Encrypts user passwords securely.

---

## 🏗️ Basic Project Structure

Here is how the project directories are laid out:
*   `prisma/`: Contains database models (`schema.prisma`) and the setup script (`seed.ts`) that populates the database with initial products.
*   `src/app/`: The page routes and server-side logic of the application.
    *   `src/app/api/`: Backend server routes (like endpoints for logging in, checking out, and saving reviews).
    *   `src/app/products/`, `src/app/orders/`, etc.: The specific pages you see in your browser.
*   `src/components/`: Reusable interface pieces (like the Navbar, Cart Drawer, and Product Cards).
*   `src/context/`: Handles global website states like the items added to the shopping cart, making them available across all pages.
*   `src/lib/`: Custom helpers (specifically setting up a single shared database connection).

---

## 🔄 How the Website Works (High-Level)

1.  **Requesting a Page**: When you visit the site, Next.js receives your request. For product lists, it queries the SQLite database using **Prisma** on the server.
2.  **Displaying Products**: The server generates the HTML containing the fresh product info and returns it to your browser.
3.  **Managing the Cart**: When you click "+ Add to Cart", a React **Context Provider** updates the browser memory (`localStorage`), making the updated cart instantly visible in the slide-out **CartDrawer**.
4.  **Checking Out**: Filling out the checkout form triggers a POST request to `/api/orders`. The server processes it, creates an order record in the database, and redirects you to the tracking page.
5.  **Tracking & Feedback**: The client periodically checks order status, and users can submit reviews, which triggers another API endpoint to recalculate product ratings in real-time.

---

## 🚀 Experience & Reflections on Vibe Coding

### Why Vibe Coding is Amazing
* **Speed to Prototype**: Going from a database schema concept to a fully building Next.js 16 app with vanilla CSS and SQLite took only a fraction of the time it would manually.
* **Focus on Creativity**: Since I already know coding very well, I don't need to waste time typing out repetitive boilerplate or basic component markup. I can direct my creativity, refine the user experience, and structure the system while the AI handles the heavy execution.
* **Dynamic Iteration**: Seeing code update in real-time based on high-level instructions makes development feel fluid and interactive.

### The Human Touch: What Vibe Coding Lacks
While AI handles execution exceptionally well, there are critical software engineering disciplines where human intelligence remains indispensable:
1. **Deployment**: Managing hosting environments, configuring environment secrets, and handling runtime infrastructure.
2. **Database & Driver Adaptations**: Debugging schema compatibility (e.g., handling breaking configuration changes in Prisma 7, switching to driver adapters like libSQL for serverless/local SQLite).
3. **Error Handling & Resiliency**: Writing robust fallback logic and ensuring edge-case handling across complex integration paths.
4. **System Design**: Architecting database relationships, planning state management flow (like React Context vs database persistence), and choosing the right framework paths.

*Learning these human-centric system design and deployment challenges has been an excellent part of this learning experience!*

---

## 🛠️ Features Built So Far
- **Prisma 7 + SQLite Integration**: Complete models for Users, Categories, Products, Orders, Reviews, and Support Tickets.
- **State Management**: Persisted Cart Context (localStorage) with slide-out drawer UI.
- **Dynamic Catalog**: Full product browsing with category filtering, sort-by options, and manual price filters.
- **Secure Mock Checkout**: Places active orders directly into the database.
- **Real-Time Tracking**: Visual progress bars representing Order Placed ➔ Processing ➔ Shipped ➔ Delivered.
- **Reviews & Ratings**: Average ratings update dynamically when users leave feedback.
- **Support Portal**: Help section with FAQ accordions and message tracking.

---

## 📦 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Prepare Database
This project uses SQLite and Prisma 7. Initialize and seed your database:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

**Demo Account Info:**
* **Email:** `demo@localstore.com`
* **Password:** `password123`

---

## 🔮 Future Enhancements
- [ ] Add deployment configurations for Vercel/Fly.io.
- [ ] Implement production-grade auth session cookies (e.g., Next-Auth/Auth.js).
- [ ] Integrate actual stripe payment gateway instead of mockup.
- [ ] Enhance UI animations with Framer Motion.
=======
# FreshMart — Modern Grocery E-Commerce Platform

>>>>>>> ab02a6da1e6cdfc957df8985e696c06dc6539fbe
