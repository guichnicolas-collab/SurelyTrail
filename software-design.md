# Example Software Design Document

## Purpose

This will be a full-stack, multi-user trail application that allows users to browse trails globally.

## Technologies

- Front end: React Native (build for IOS, Android, and web) with React Router
- Back end:
  - Node/Express/express-session for the API
  - Mongo/Mongoose for the database layer
- Hosting: Render free tier, Mongo Atlas

## Features in Scope

- Users can sign up, log in, view, and create routes/trails
- Users can browse/search trails
- Includes an interactive map that allows users to click on a trail
- There can be presets of famous routes
- A menu pops up with stats (estimated time, length, difficulty, etc.)
- Users can plan custom routes
- Add a way to time your hike at the current moment
- Save all your previous hikes

## Features out of Scope

- Social elements like rating trails and writing reviews based on their experience

## Backend API

- Users
  - POST `/api/users` creates a user
  - GET `/api/users/:id` returns a user by id
  - POST `/api/users/login` logs a user in
  - POST `/api/users/logout` logs a user out
- Routes
  - POST `/api/route` creates a route
  - GET `/api/route/:id` returns the specified route and its stats
  - GET `/api/routes/search/:query` returns the top 50 routes with `:query` in the title

## Frontend SPA Routes

- `/` landing page
- `/login` form to log in
- `/register` form to sign up
- `/map/?loc='lat/lon/zoom'` shows interactive map with the current view
- `/search?q=foobar` shows a list of route results with titles matching `foobar` each link should navigate back to a `/map` view of the selected trail
- `/myStuff` view saved routes or start a new hike
- `/:routeName` view details of a past hike
- `/profile` to view and modify account settings
- All other routes 404
- FE nav links login/sign up when not logged in
- FE nav links to `/profile` and sign out when logged in

## Data Model

- `User`:
  - id, name, passwordHash
  - All fields are immutable
- `Route`:
  - id, name, stats, (geoJSON) (TBD)
## Questions

- Will this just be Tahoe or everywhere or USA?
  - Everywhere
- Will there be a mobile app or just a responsive website that looks good on phones?
  - React Native, single codebase for both web and mobile
- Rendering map (what apis or libraries will be used?)
  - Leaflet - map rendering and controls
- Data source (user add trails?, other sources?)
Open street map - seems to have trail data
- Data storage/format of data (GIS/GeoJSON? Schema issues?)
GeoJSON
- How can we bulk import a bunch of trail data?
https://planet.openstreetmap.org/ might work, but the dataset is MASSIVE 163 GB!!
But that 163 GB is everything--we just want trails.
   - How much of 163 GB is trails?
TBD 
  - This creates other problems: how can we store ~50 GB (or whatever the actual trail data size is) in the database?
  - How much will we send to the client when they request it?
    - Gradually download map data based on user location
    - Store downloaded map data locally
    - Note: our users are on mobile data, we don't want to send too much.
Any other options?
- Will these libraries/APIs allow us to measure distance and altitude?
  - Leaflet distanceTo for distance
  - OpenTopoData calls to get altitude at specific coordinates https://www.opentopodata.org/
  -Open-Meteo for weather at locations https://open-meteo.com/
  - Moderation for inappropriate content (Hateful/irrelevant reviews?)
  - TBD
