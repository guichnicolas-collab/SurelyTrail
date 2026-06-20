# Example Software Design Document

## Purpose

The app will be a full-stack, multi-user wiki application, basically a simplified Wikipedia.

## Technologies

- Front end: React with React Router and the [marked](https://www.npmjs.com/package/marked) library for rendering markdown
- Back end:
  - Node/Express/express-session for the API
  - Mongo/Mongoose for the database layer
- Hosting: Render free tier, Mongo Atlas

## Features in Scope

- Users can sign up, log in, view, create and modify wiki articles
- Users can search across all wiki titles, see a page of results and click to open a specific article
- Wiki articles will have a route like `/article/slug-title` where `slug-title` is created and stored in the DB as a unique, normalized (lower kebab-cased) identifier
- User editing will be markdown-based, with a live preview similar to GitHub gists
- Submitting an edit appends a new version to the list of previous idempotent edits
- Each wiki article has a history of versions that can be viewed, with version timestamps and the user creating the new version
- Extremely minimal styling, just basic flexbox layouts, dark/light mode with `<meta name="color-scheme" content="dark light">`
- Anyone can view any article or history, but only logged in users see editing options, also enforced on the backend with protected routes

## Features out of Scope

- Social elements, like following users, favoriting articles or discussions
- Paginated search results, deep search within article text, fuzzy search, tags
- User account recovery, password changing or user profile/settings
- Ability to modify article history or delete articles
- Version diff displays
- Image/attachment uploading, except when hosted third-party as markdown links
- Fancy editing features, like diagrams, latex or audio
- Restoring previous versions of articles
- Testing
- Collaborative editing
- Validation of requests/error handling for badly formed API requests (we will enforce DB constraints/auth only)
- Rate limiting or capping the number of articles or edits made by users

## Backend API

- Users
  - POST `/api/users` creates a user
  - GET `/api/users/:id` returns a user by id
  - POST `/api/users/login` logs a user in
  - POST `/api/users/logout` logs a user out
- Articles
  - POST `/api/articles` creates an article
  - GET `/api/articles/:slug` returns an article by slug
  - POST `/api/articles/:slug/version` updates an article by creating a new version
  - GET `/api/articles/:slug/version` returns the history of edits for an article
  - GET `/api/articles/:slug/history/:id` returns a specific version for an article
  - GET `/api/articles/search/:query` returns the top 50 articles with `:query` in the title

## Frontend SPA Routes

- `/` landing page
- `/login` form to log in
- `/register` form to sign up
- `/new` shows a form to create a new article
- `/search?q=foobar` shows a list of search results with titles matching `foobar`
- `/articles/:slug` shows the latest version of an article with `:slug` or a 404 page if not found
- `/articles/:slug/versions` shows article's list of versions
- `/articles/:slug/versions/:id` shows article's history by version id
- `/articles/:slug/edit` shows article editing view
- All other routes 404
- FE nav links to search bar, login/sign up when not logged in
- FE nav links to search bar, new article, sign out when logged in

## Data Model

- `User`:
  - id, name, passwordHash
  - All fields are immutable
- `Article`:
  - id, title, slug, currentVersionId, createdAt
  - All fields are immutable
  - Always has at least one `ArticleVersion`
  - The most recent `ArticleVersion` is the current default shown
- `ArticleVersion`:
  - id, body, articleId, userId, createdAt
  - All fields are immutable
  - An idempotent edit version of an article

## Questions

- How will we handle session persistence?
  - We can use express-session's Mongo connector
- How will we sanitize user input markdown to avoid XSS?
  - We can use a library like dompurify

## Sequencing

- Day 1 (all days 1 hour):
  - set up the project IDE
  - set up a GitHub repo
  - set up Mongo Atlas
  - install npm packages
  - create Express/DB scaffolding
- Day 2:
  - DB models
  - article API routes
  - article rendering (hardcode the first article)
- Day 3:
  - article creation/editing (hardcoded user)
- Day 4:
  - auth
  - sessions
- Day 5:
  - history/versioning UI
- Day 6:
  - article title search
  - markdown preview for create/edit
- Day 7:
  - ui polish
  - deploy to Render
