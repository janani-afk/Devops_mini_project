# Dosekeeper Stockwatch Hub

Build a modern, professional, responsive web application called **MediStock — Smart Medicine Inventory and Expiry Monitoring System**.

**Project purpose:**
Help small pharmacies and clinics manage medicine inventory, track expiry dates, identify low-stock medicines, and generate inventory reports.

**Design requirements:**
- Create a clean healthcare SaaS dashboard.
- Use a professional white background with teal and navy-blue accents.
- Use a left sidebar, clean cards, readable tables, and simple charts.
- Make the interface responsive for desktop and mobile.
- Use realistic sample medicine data for the initial preview.

**Pages and features:**

1. **Dashboard**
   - Total medicines
   - Total stock units
   - Medicines nearing expiry
   - Low-stock medicines
   - Recent inventory activity
   - Stock and expiry summary charts

2. **Medicine Inventory**
   - Display medicine name, category, batch number, quantity, expiry date, and supplier.
   - Add, edit, search, filter, and delete medicine records.
   - Display clear status labels for low stock and near-expiry medicines.

3. **Add Medicine**
   - Create a form with medicine name, category, batch number, quantity, minimum stock threshold, manufacturing date, expiry date, and supplier.
   - Validate required fields and reject invalid dates or negative quantities.

4. **Expiry Monitoring**
   - Display medicines approaching their expiry dates.
   - Provide configurable warning periods, such as 30, 60, and 90 days.
   - Highlight expired medicines separately.

5. **Low-Stock Monitoring**
   - Automatically flag medicines whose quantity is at or below their configured minimum stock threshold.

6. **Reports**
   - Display inventory summaries and expiry reports.
   - Provide an option to export inventory data as CSV.

7. **Settings**
   - Allow configuration of stock thresholds and expiry warning periods.

**Technical requirements:**
- Use reusable components and maintain a clean project structure.
- Use realistic sample data initially, clearly separated from production data.
- Prepare the frontend to connect to a separate Java Spring Boot REST API.
- Create an API service layer that can be configured to use a backend base URL through an environment variable.
- Do not hardcode a database password or API secret.
- Include loading states, empty states, error messages, and form validation.
- Do not claim that data is saved permanently until the backend is connected.

First build the complete frontend with functional navigation, forms, tables, filters, and dashboard interactions. Keep the design polished and suitable for a college DevOps mini-project demonstration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6238ddc5-5acb-4602-b9d4-f3c276b1c47f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
