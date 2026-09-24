# Product Admin Dashboard

A responsive product administration dashboard built with **Next.js, React, Tailwind CSS, and Axios**, using the **DummyJSON API**.

## Features

* User login and logout
* Protected product routes
* Product listing
* Responsive desktop table and mobile cards
* Pagination with page numbers
* Page size selection: 10, 20, and 50
* Product search with debounce
* Category filtering
* Product sorting by:

  * Price
  * Rating
  * Title
* Product details page
* Product images and reviews
* Add product
* Edit product
* Delete product with confirmation
* Loading states
* Empty states
* Error states
* Retry functionality
* URL-based pagination, search, category, and sorting
* Request cancellation for fast search changes
* Duplicate-submit protection
* Invalid URL handling
* Client-side persistence for product mutations

## Tech Stack

* **Next.js**
* **React**
* **Tailwind CSS**
* **Axios**
* **DummyJSON API**
* **JavaScript**

## API

This project uses the DummyJSON API:

https://dummyjson.com

Main API operations:

* Authentication
* Product listing
* Product search
* Product categories
* Category-based product filtering
* Product details
* Product creation
* Product update
* Product deletion

## Demo Login

The application uses the demo credentials provided in the assignment.

```text
Username: emilys
Password: emilyspass
```

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the project

```bash
cd product-admin-dashboard
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

## Pagination

The application uses DummyJSON's `limit` and `skip` parameters for pagination.

The `skip` value is calculated using:

```text
skip = (page - 1) × limit
```

Supported page sizes:

```text
10
20
50
```

The current page and page size are stored in the URL.

Example:

```text
/products?page=2&limit=20
```

## Search

Product search uses the DummyJSON search endpoint.

A debounce is implemented so the application does not send a request for every keystroke.

The page automatically resets to page 1 when the search value changes.

Example:

```text
/products?page=1&limit=20&search=phone
```

### Race-condition handling

An `AbortController` is used to cancel previous product requests when a newer request starts.

This prevents an older, slower response from replacing the results of a newer search.

## Category Filtering

Categories are loaded from the DummyJSON categories endpoint.

Users can select a category from the dropdown.

Example:

```text
/products?page=1&limit=20&category=beauty
```

DummyJSON does not provide a combined search-and-category endpoint for this implementation.

When both search and category are present, the application gives priority to the category filter.

## Sorting

Products can be sorted by:

* Price
* Rating
* Title

Both ascending and descending orders are supported.

Example:

```text
/products?page=1&limit=20&sortBy=price&order=desc
```

Sorting state is also preserved in the URL.

## Product Details

Each product has a dedicated details page.

The details page displays:

* Product title
* Product images
* Description
* Price
* Rating
* Stock
* Category
* Brand
* Customer reviews

Example:

```text
/products/1
```

Invalid product IDs are handled with a Product Not Found state.

## Add, Edit and Delete

The dashboard supports:

* Adding products
* Editing products
* Deleting products
* Delete confirmation
* Form validation
* Duplicate-submit protection

### Product mutation persistence

DummyJSON simulates product creation, updating, and deletion, but these mutations are not permanently stored by the API.

To keep the application state consistent after refresh, product mutations are stored in the browser's `localStorage`.

This allows added, edited, and deleted products to remain reflected in the application during subsequent visits from the same browser.

## Authentication

The login endpoint is used to authenticate the user.

After successful login:

* The authentication token is stored in `localStorage`.
* Protected product pages become accessible.
* The token is automatically added to Axios requests.

After logout:

* The stored token is removed.
* Protected pages redirect the user back to the login page.

## Axios Configuration

A shared Axios instance is used for API communication.

The Axios configuration handles:

* Base API URL
* JSON headers
* Authentication token
* Centralized API error handling
* Request cancellation

API calls are separated from the UI components through service functions.

## Error Handling

The application handles:

* Invalid login credentials
* API request failures
* Product-not-found errors
* Empty search results
* Loading states
* Retry actions
* Invalid page values
* Invalid page numbers
* Duplicate form submissions

For example:

```text
/products?page=abc
```

falls back to a valid page.

An invalid high page such as:

```text
/products?page=999
```

is redirected to the last valid page.

## Responsive Design

The dashboard is responsive across desktop and mobile devices.

### Desktop

Products are displayed in a table containing:

* Image
* Title
* Category
* Price
* Rating
* Stock
* Actions

### Mobile

Products are displayed as responsive cards for easier viewing on smaller screens.

## Project Structure

```text
product-admin-dashboard/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── login/
│   │   ├── products/
│   │   │   ├── [id]/
│   │   │   │   └── edit/
│   │   │   └── new/
│   │
│   ├── components/
│   │   └── ProductTable.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── productService.js
│   │
│   └── utils/
│       ├── auth.js
│       └── productStorage.js
│
├── package.json
├── README.md
└── ...
```

## AI Usage

AI assistance was used during development for:

* Understanding API integration
* Debugging implementation issues
* Reviewing edge cases
* Understanding React and Next.js behavior
* Improving error handling
* Implementing request cancellation and race-condition handling
* Reviewing implementation approaches

All generated or suggested code was reviewed, tested, and understood before submission.

## Testing

The application was tested for:

* Login and logout
* Protected routes
* Product listing
* Pagination
* Page-size changes
* Search
* Fast search changes
* Category filtering
* Sorting
* Product details
* Invalid product IDs
* Add product
* Edit product
* Delete product
* Refresh persistence
* Loading states
* Error states
* Retry
* Empty search results
* Invalid URL parameters
* Duplicate login submissions
* Duplicate product submissions
* Responsive desktop/mobile layouts

## Project Status

Completed and tested against the assignment requirements.

## License

## Submission Notes

### Key Choices

- Used a shared Axios instance for all API requests.
- Added Axios interceptors to attach the authentication token and handle API errors centrally.
- Used URL query parameters for pagination, search, category, and sorting so the current state can be shared and refreshed.
- Used `AbortController` with debounced search to prevent outdated search requests from replacing newer results.
- Used localStorage to persist added, edited, and deleted products because DummyJSON does not permanently persist CRUD changes.
- Used responsive table/card layouts so the dashboard works on both desktop and mobile screens.
- Added loading, empty, error, retry, validation, and duplicate-submit handling for a better user experience.

### Problem Faced & Fix

One issue I faced was with products created through the DummyJSON API.

DummyJSON accepts add, edit, and delete requests for demonstration purposes, but these changes are not permanently persisted. Because of this, an added product could disappear after refreshing the page.

I solved this by storing local CRUD changes in `localStorage`. The dashboard merges these local changes with the API products, allowing added, edited, and deleted products to remain visible during subsequent visits to the application.

Another issue occurred when opening a locally created product's details page. The application initially tried to request the local ID from DummyJSON, which returned a 404 error. I fixed this by detecting local product IDs and loading those products from `localStorage` instead of making an API request.

### AI Assistance

I used AI as a development assistant during the assignment.

AI helped me with:
- Understanding the DummyJSON API and endpoint usage.
- Reviewing the project structure and implementation approach.
- Debugging errors during development.
- Reviewing edge cases such as invalid pagination values and fast search requests.
- Understanding and implementing request cancellation with `AbortController`.
- Reviewing responsive UI and improving code structure.
- Testing ideas and identifying potential issues.

I reviewed, tested, and integrated the suggestions into the application myself and verified the functionality locally and on the deployed application.

