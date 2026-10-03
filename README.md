# BeeOnCode Internship — Admin Panel

React admin-panel work completed during my BeeOnCode internship.

This repository contains the internship application based on the **Fuse React Admin** template. The template provides the initial application structure and UI foundation; my work focuses on implementing and integrating assigned functionality within that codebase.

## Internship Work

### Services

The implemented Services area covers the service-management workflow, including:

- Service list loading
- Add service
- Edit service
- Delete service
- Publish / unpublish state
- Service ordering
- Form validation
- Image/icon integration
- API integration with the provided backend

The implementation uses the existing application's React architecture and backend contract rather than presenting the template itself as original work.

## Tech Stack

- React
- JavaScript
- Fuse React
- REST API
- Fetch / HTTP API integration
- Git

## Repository Structure

The project follows the structure of the provided Fuse React application:

~~~text
src/
├── app/
├── components/
├── auth/
└── ...

public/
package.json
~~~

The exact structure may evolve as internship tasks are added.

## API Integration

The Services functionality communicates with the internship backend through service-management endpoints.

Representative operations include:

~~~http
GET    /auth/services/all
POST   /auth/services/add
GET    /auth/services/get/{id}
DELETE /auth/services/delete/{id}
PUT    /auth/services/edit/{id}
PUT    /auth/services/is_published/{id}
PUT    /auth/services/order
~~~

The exact request and response contract is defined by the internship backend.

## Local Development

Install dependencies:

~~~bash
npm install
~~~

<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/c31b16e1-f746-4588-86ec-c1dbef691987" />
<img width="1919" height="905" alt="image" src="https://github.com/user-attachments/assets/e73391f9-bdfa-4f0a-833c-b1c105651eca" />
<img width="1919" height="913" alt="image" src="https://github.com/user-attachments/assets/9e87a5b8-c64f-4dd4-b737-67700c875b35" />




Start the development server:

~~~bash
npm start
~~~

Environment-specific configuration should stay in local environment files and must not contain committed secrets.

## Attribution

This project is part of internship work at **BeeOnCode**.

The application was built on top of an existing **Fuse React Admin** template. The repository is intended to show the functionality I implemented and integrated during the internship, not to claim ownership of the underlying template.

## Status

This repository is a record of internship work and may continue to receive updates as additional tasks are completed.
