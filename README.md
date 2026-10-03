# BeeOnCode Internship — Admin Panel

React admin-panel work completed during my BeeOnCode internship.

This project is based on the **Fuse React Admin** template. My work focuses on implementing and integrating assigned functionality within the existing application.

## Internship Work

### Services

Implemented the Services management workflow:

- Service list loading
- Add and edit service
- Delete service
- Publish / unpublish
- Service ordering
- Form validation
- Image/icon integration
- REST API integration

## Screenshots

### Services

![Services list](https://github.com/user-attachments/assets/c31b16e1-f746-4588-86ec-c1dbef691987)

### Add / Edit Service

![Add or edit service](https://github.com/user-attachments/assets/e73391f9-bdfa-4f0a-833c-b1c105651eca)

### Service Management

![Service management](https://github.com/user-attachments/assets/9e87a5b8-c64f-4dd4-b737-67700c875b35)

## Tech Stack

- React
- JavaScript
- Fuse React
- REST API
- HTTP API integration
- Git

## API Integration

Representative service-management endpoints:

```http
GET    /auth/services/all
POST   /auth/services/add
GET    /auth/services/get/{id}
DELETE /auth/services/delete/{id}
PUT    /auth/services/edit/{id}
PUT    /auth/services/is_published/{id}
PUT    /auth/services/order
```

The exact request and response contract is defined by the internship backend.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Keep environment-specific configuration and secrets in local environment files.

## Attribution

This project was developed as part of my internship at **BeeOnCode**.

The application was built on top of the existing **Fuse React Admin** template. The repository documents the functionality I implemented and integrated during the internship.

## Status

Internship project — actively updated as additional tasks are completed.
