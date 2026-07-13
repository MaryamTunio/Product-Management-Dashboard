# ShopAdmin - Product Management Dashboard

A sleek, responsive, single-page E-Commerce Product Management Dashboard built using modern vanilla web technologies. This project features full CRUD operations, reactive metrics calculation, data pipelines for filtering, searching, dynamic sorting, client-side validation, and image uploading via Base64 serialization.

##  Live Demo & Preview
* **Tech Stack:** HTML5, CSS3, Tailwind CSS (via CDN), FontAwesome Icons, Vanilla JavaScript (ES6)
* **Architecture:** In-Memory Reactive State Machine with DOM-driven view syncing.

---

##  Features

### 1. Dynamic CRUD Management
* **Create & Update:** Dual-mode interactive modal layout with automatic execution branching based on target payload IDs.
* **Delete:** Data purging engine equipped with a verification interceptor to avoid accidental loss.

### 2. Live Metric Summaries
* Calculates inventory statistics in real time.
* Tracks **Total Products**, **Low Stock Alerts** ($Stock \le 5$), and **Out of Stock** signals ($Stock = 0$) using custom filtering arrays.

### 3. Advanced Filtering & Data Pipeline
* **Real-time Search:** Listens to search inputs to continuously match product titles without requiring form submissions.
* **Category Filter:** Isolates target market sections instantly (e.g., Electronics, Apparel, Sports).
* **Multi-Column Sorting:** Toggles ascending and descending orders across product names, categories, values, or inventory depth.

---

##  Project Structure

```text
Product-Management-Dashboard/
│
├── index.html        # App layout, grid system, interactive modal, and state structures
├── script.js        # State engine, UI render loops, validation checkers, and CRUD pipelines
├── style.css        # Extensible styles sheet placeholder matching production expectations
└── README.md        # Technical project overview and runtime setup guide
