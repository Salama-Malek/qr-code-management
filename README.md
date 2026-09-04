# QR Code Management

A lightweight Node.js/Express app for generating, tracking, and resolving QR codes tied to registered user data.

## Overview

QR Code Management lets you generate one or many unique QR codes from a simple web UI. Each code encodes a link back to the app; scanning it either shows the registered contact details for that code or prompts the visitor to register their name, email, and phone number if none exist yet. All codes and their associated user data are persisted in MongoDB via Mongoose, and codes can be listed, viewed, or deleted from the main page.

## Features

- Generate a single QR code or a batch of QR codes in one request
- Each QR code is a UUID-backed record persisted in MongoDB, rendered as a scannable data-URL image
- Public registration flow: scanning an unregistered code redirects to a form capturing name, email, and phone
- Lookup page that displays the registered user data for a given QR code, or prompts registration if missing
- List all generated QR codes with delete and "view details" actions
- REST API for generation, registration, listing, pagination, counting, lookup, and deletion of QR codes
- Static error page for unhandled/invalid states

## Tech stack

- **Runtime:** Node.js, Express 4
- **Database:** MongoDB via Mongoose 8
- **QR generation:** `qrcode` (data-URL output)
- **IDs:** `uuid`
- **Config:** `dotenv`
- **Frontend:** static HTML/CSS/vanilla JavaScript served directly by Express (no build step or framework)

## Getting started

### Prerequisites

- Node.js
- A running MongoDB instance (local or remote)

### Install

```bash
npm install
```

### Configure environment variables

Create a `server/.env` file (already gitignored) with:

```
PORT=3000
MONGODB_URI=mongodb://localhost/qr_codes
```

Both variables have fallback defaults in `server/index.js` (`PORT=3000`, `mongodb://localhost/qr_codes`) if the file is omitted.

### Run

```bash
node server/index.js
```

The server starts on `http://localhost:3000` (or the configured `PORT`), connects to MongoDB, and serves the static client alongside the API.

### Build

No build step is required — the client is plain static HTML/CSS/JS served by Express.

### Test

No test suite is currently configured (`npm test` is a placeholder that exits with an error).

## Project structure

```
.
├── client/                 # Static frontend
│   ├── index.html           # Generate / list / delete QR codes
│   ├── register.html        # User registration form for a scanned code
│   ├── userData.html        # Displays registered data for a QR code
│   ├── error.html           # Generic error page
│   └── styles/styles.css
├── server/
│   ├── index.js              # Express app bootstrap, MongoDB connection, static + API mounting
│   ├── controllers/
│   │   └── qrController.js   # Generate, register, list, paginate, count, fetch, delete QR codes
│   ├── models/
│   │   └── qrCode.js         # Mongoose schema (code, qrCodeData, url, userData)
│   ├── routes/
│   │   └── qrRoutes.js       # /api/qr/* route definitions
│   └── utils/
│       └── qrUtils.js        # QR code data-URL helper
└── package.json
```

## API endpoints

| Method | Path                     | Description                                  |
|--------|--------------------------|-----------------------------------------------|
| POST   | `/api/qr/generate`       | Generate one or more QR codes (`count` in body) |
| POST   | `/api/qr/register`       | Register name/email/phone for a QR code       |
| GET    | `/api/qr/list`           | List all QR codes                             |
| GET    | `/api/qr/:id`            | Get registered user data for a QR code        |
| DELETE | `/api/qr/:id`            | Delete a QR code by its Mongo `_id`            |
| GET    | `/api/qr/user-data`      | Serve the user data page                      |
