# FreightAIO

## Overview

FreightAIO will be able to track the rail movement of sea container in Canada wide.

### Problem Space

The traditional tool is CN tracker, which is hard to use and has limited access to client or oversea agent. User can easily miss super important updates or information.

### User Profile

Target users will be the freight forwarder operations, canadian importers (client), and oversea agents. There will be a login function and different user will have different role to access associated features after login.

### Features

List the functionality that your app will include. These can be written as user stories or descriptions with related details. Do not describe _how_ these features are implemented, only _what_ needs to be implemented.

Operations will have access to all features, will be able to track containers' movement and get all information. Client will be only see ETA of a container. Oversea agent will have access to track a particular container and see all containers' ETA.

Login function.
Tracking a single container.
Adding multiple containers and save as users' own table, asign to associated agent and client.
Showing most updated information of each container.
Showing delivery appointment for each container.
Retrieving all movements log for each container.
Sorting by urgency, in order of time sensitivity.
Sorting by agents name, clients name.

## Implementation

### Tech Stack

- React
- TypeScript
- Scss
- MySQL
- Express
- Client libraries:
  - react
  - react-router
  - axios
- Server libraries:
  - knex
  - express
  - bcrypt for password hashing

### APIs

CN Track + Trace API

### Sitemap

-Login page
-Single container tracking page
-Associated user's tracking table
-Key in container page

### Mockups

Provide visuals of your app's screens. You can use pictures of hand-drawn sketches, or wireframing tools like Figma.

### Data

Describe your data and the relationships between the data points. You can show this visually using diagrams, or write it out.

### Endpoints

**POST /users/register**

- Add a user account

Parameters:

- email: User's email
- password: User's provided password

Response:

```
{
    "token": "seyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6I..."
}
```

**POST /users/login**

- Login a user

Parameters:

- email: User's email
- password: User's provided password

Response:

```
{
    "token": "seyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6I..."
}
```

**GET /:containerid**

- Tracking a container info

Parameters:

- container number

Response:

```
[
    {
        "id": "ABCD1234567",
        "status": "On the way to destination",
        "location": equipment.Event?.Location?.Station || "Unknown",
        "eventTime": equipment.Event?.Time || "N/A",
        "eventDescription": equipment.Event?.Description || "N/A",
        "customsStatus": equipment.CustomsHold?.Description || "N/A",
        "storageLastFreeDay": equipment.StorageCharge?.LastFreeDay || "N/A",
    }
]
```

**GET /:userId**

- Get all containers info for a specific user

Parameters:

- user id

Response:

```
[
    {
        "id": equipment.EquipmentId || "N/A",
        "status": equipment.WaybillStatus || "N/A",
        "location": equipment.Event?.Location?.Station || "Unknown",
        "eventTime": equipment.Event?.Time || "N/A",
        "eventDescription": equipment.Event?.Description || "N/A",
        "customsStatus": equipment.CustomsHold?.Description || "N/A",
        "storageLastFreeDay": equipment.StorageCharge?.LastFreeDay || "N/A",
        "appointment_date": 2025-05-01,
    },
    ...
]
```

**PUT /:userid/:containerid**

- Add a new container to a user's table

Parameters:

- container id
- user id
- agent's name

Response:

```
[
    {
        "id": "ABCD1234567",
        "userid": 1,
        "agent": "ONQG",
    }

]
```

**DELETE /:userid/:containerid**

- Delete a container from a user's table

Parameters:

- container id
- user id

Response:

```
"container id has been deleted"
```

**PATCH /:userid/:containerid**

- Add an appointment date to a container in the user's table

Parameters:

- container id
- user id
- appointment date

Response:

```
[
    {
        "id": "ABCD1234567",
        "userid": 1,
        "appointment_date": 2025-05-01,
    }

]
```

### Auth

- JWT auth
  - Before adding auth, all API requests will be using a fake user with id 1
  - Added after core features have first been implemented
  - Store JWT in localStorage, remove when a user logs out
  - Add states for logged in showing different UI in places listed in mockups

## Roadmap

Scope your project as a sprint. Break down the tasks that will need to be completed and map out timeframes for implementation working back from the capstone due date.

- Create client

  - react project with routes and boilerplate pages

- Create server

  - express project with routing, with placeholder 200 responses

- Deploy client and server projects so all commits will be reflected in production

- Feature: Tracking single container

- Feature: Adding new container

- Feature: A user's container table, showing all info

- Feature: Updating data base every 5 mins

- Feature: Edite delivery appointment with a calendar selection

- Feature: One container's movement log

- Feature: Sorting by client's name, ETA, agents' name

- Feature: Home page

- Feature: Login

  - Implement login page + form
  - Create POST /users/login endpoint

- Feature: Implement JWT tokens

  - Server: Update expected requests / responses on protected endpoints
  - Client: Store JWT in local storage, include JWT on axios calls

- Bug fixes

- DEMO DAY

---

## Future Implementations

Your project will be marked based on what you committed to in the above document. Here, you can list any additional features you may complete after the MVP of your application is built, or if you have extra time before the Capstone due date.

- Send notification if there is update of a container, by SMS or Email
- Coloring by urgency, in order of time sensitivity.
