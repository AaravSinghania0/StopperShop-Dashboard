# StopperShop Dashboard

A project to learn modern full-stack web development.

### An Admin Dashboard & CMS for any E-Commerce Front

**Visit [StopperShop Dashboard](https://stoppershop-dashboard.vercel.app) to start creating your own store.**

**Visit [StopperShop](https://stoppershop-store.vercel.app) to see the store I created.**

### Features

-   An overview for each store that shows total revenue, sales, and stock available, along with a chart to visualize the revenue earned in each month of the year.
-   An easy-to-use CMS that allows users to manage (i.e. create, update or delete) store products, categories, billboards, sizes, and colors.
-   An orders page that automatically captures data from the store and shows the products ordered, the customer’s phone number and address, and whether the payment was successful or not.
-   Integration with Cloudinary allows users to upload images for their products and billboards. This feature makes it easy for users to showcase their products and provide customers with high-quality images.
-   Integration with Clerk provides secure authentication for the dashboard, ensuring that only authorized users can access the admin features.
-   The standout feature of this dashboard is, it exposes custom API endpoints for all the content created (stores, products, categories, billboards, sizes, and colors).

### Tech Stack

-   **Language:** TypeScript & JSX

-   **Frameworks & libraries:**

    -   NextJS with Tailwind CSS,
    -   Shadcn UI (component library),
    -   Zustand (for state management),
    -   Stripe (secure payment gateway),
    -   Cloudinary (cloud based CDN), and
    -   Clerk (3rd party authentication provider).

-   **Database:** PlanetScale (serverless MySQL platform)

-   **ORM:** Prisma

### Acknowledgements

-   The branding _StopperShop_ is just for styling purposes, I hold no affiliation or rights under this name. I’m simply too lazy to think of a more creative name, rather than ripping off a popular Indian franchise.
-   This project was made by following the brilliant tutorial by [Code With Antonio](https://www.youtube.com/watch?v=5miHyP6lExg).
-   This project is not completely optimized for mobile responsiveness.
