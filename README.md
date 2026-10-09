# BeeOnCode Internship — Admin Panel

React admin-panel work completed during a BeeOnCode internship, focused on service-management workflows and REST API integration in an existing application.

## Work Covered

- List and retrieve service records
- Create, edit, and delete services
- Publish and unpublish services
- Change service ordering
- Form validation
- Image/icon integration
- REST API integration and admin UI workflows

## Technology

React · JavaScript · Fuse React · REST API · Git

## Services API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/auth/services/all` | List services |
| POST | `/auth/services/add` | Create service |
| GET | `/auth/services/get/{id}` | Retrieve one service |
| DELETE | `/auth/services/delete/{id}` | Delete service |
| PUT | `/auth/services/edit/{id}` | Update service |
| PUT | `/auth/services/is_published/{id}` | Change publication state |
| PUT | `/auth/services/order` | Update service order |

These are the endpoint paths used by the project; the host, authentication method, and request/response schemas depend on the configured API environment.

## Screenshots

### Services list
![Services list](https://github.com/user-attachments/assets/c31b16e1-f746-4588-86ec-c1dbef691987)

### Add and edit service
![Add and edit service](https://github.com/user-attachments/assets/e73391f9-bdfa-4f0a-833c-b1c105651eca)

### Service management
![Service management](https://github.com/user-attachments/assets/9e9f5dc8-c64f-4dd7-b737-67700c875b35)

## Project Context

This repository builds on the Fuse React Admin template. The portfolio focus is the assigned service-management functionality, validation, API integration, and work within an existing React codebase.

> Internship project — shared for portfolio and learning purposes.
