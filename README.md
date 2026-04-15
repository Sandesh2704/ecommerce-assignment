# Ecommerce Application

A modern ecommerce application built with **React + TypeScript** featuring product listing, filtering, cart management, and end-to-end testing using Playwright.

---



### Live Preview
👉 https://ecommerce-assignment-coral.vercel.app


## 🚀 Setup & Run

### 1. Clone Repository

```bash
git clone https://github.com/Sandesh2704/ecommerce-assignment.git
cd ecommerce-assignment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Application

```bash
npm start
```

App runs at:
👉 [http://localhost:3000](http://localhost:3000)

---

## 🌐 API Usage (IMPORTANT)

This project uses external API:
👉 [https://fakeapi.platzi.com](https://fakeapi.platzi.com)

### Key Points:

* Products are fetched dynamically from API
* Categories are fetched dynamically
* Filtering is **NOT done locally**
* On filter change → API is called again
* Pagination also uses API (`offset`, `limit`)

This follows assignment requirement:
✔ Dynamic data fetching
✔ No local filtering
✔ Always API-driven updates

---

## 📱 Responsiveness

* Fully responsive design using Tailwind CSS
* Mobile + Tablet + Desktop supported
* Separate UI behavior handled for:

  * Product images (mobile slider / desktop gallery)
  * Layout adjustments

---

## 🧪 Testing (Playwright)

This project uses **Playwright** for end-to-end testing.

### Install Browsers

```bash
npx playwright install
```

### Run Tests

```bash
npx playwright test
```

### Run with UI

```bash
npx playwright test --ui
```

---

## ✅ Test Coverage

### Home Page

* Page load
* Product listing
* Navigation to product page
* Add to cart
* Category filtering (API-based)
* Pagination (API-based)

### Product Page

* Product load from API
* Quantity increment/decrement
* Add to cart
* Tabs switching
* Image navigation

### Cart Page

* Add item to cart
* Increase/decrease quantity
* Remove item
* Empty cart state

---

## 📁 Project Structure

```
src/
├── api/                # API calls
├── components/         # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── Modal.tsx
├── context/            # Cart state (React Context)
├── pages/
│   ├── HomePage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
├── section/            # Feature sections
│   ├── ProductImages.tsx
│   ├── ProductInfo.tsx
│   ├── ProductDetailsSkeleton.tsx
├── tests/              # Playwright tests
│   ├── home.spec.ts
│   ├── product.spec.ts
│   ├── cart.spec.ts
├── types/
```

---

## 🛠 Tech Stack

* React
* TypeScript
* Tailwind CSS
* Playwright (E2E Testing)

---

## ⚠️ Notes

* Cart is managed using React Context (not persisted)
* API dependency may cause slight delays
* Tests rely on `data-testid` selectors

---

## ✅ Submission Compliance

✔ Uses API for data fetching
✔ No local filtering (API-based filtering)
✔ Fully responsive UI
✔ End-to-end test coverage
✔ Proper README with setup + testing instructions

---

## 👤 Author

Sandesh Deshmukh
