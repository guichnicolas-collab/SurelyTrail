# SurelyTrail

## Overview

SurelyTrail is a free trail discovery and navigation platform designed to make hiking more accessible. Many existing hiking platforms lock useful features behind subscriptions, creating barriers for casual hikers and outdoor enthusiasts.

Our goal is to provide an easy-to-use application that helps people discover, explore, and share hiking trails without requiring a paid membership.

---

## Problem

Many trail discovery platforms:

* Require paid subscriptions for core features
* Focus heavily on monetization
* Create barriers for new hikers
* Make trail information less accessible

We believe outdoor recreation should be easy to access for everyone.

---

## Vision

Build a platform where users can:

* Discover trails anywhere in the world
* Browse trails on an interactive map
* Search for nearby hikes
* Explore famous hiking routes
* Plan custom hiking adventures
* Track and save hiking activity
* Share experiences with the community

---

## Roadmap

### Version 0 (MVP)

* Browse trails by location (e.g. Lake Tahoe)
* Interactive map displaying available trails
* Search for trails in a selected area
* Click trails directly from the map
* Preset collections of popular routes

### Version 1

* Trail statistics panel

  * Estimated hiking time
  * Distance
  * Difficulty
  * Elevation gain
* Custom route planning
* Live hike timer
* Personal hike history

### Version 2

* Trail ratings
* User reviews
* Community contributions
* Social features

---

## Technology Stack

### Frontend

* React Native
* Single codebase for:

  * iOS
  * Android
  * Web

### Mapping

* Leaflet
* OpenStreetMap

### Data Format

* GeoJSON

---

## Similar Applications

* AllTrails
* Trailforks
* Gaia GPS
* Hiking Project
* Strava

### Inspiration

* Falling Fruit

  * Community-driven map experience
  * Similar map-based discovery concept

---

## Data Sources

### Current Candidate

#### OpenStreetMap (OSM)

Pros:

* Open data
* Global coverage
* Existing trail information
* Active contributor community

Potential concerns:

* Dataset size
* Data consistency
* Regional coverage quality

---

## Technical Challenges

### Trail Coverage

**Question:** Should SurelyTrail focus on a single region or support all locations?

**Current Direction:** Global coverage.

---

### Data Importing

Potential challenge:

* Full OSM Planet dataset is approximately 163 GB
* Trails represent only a subset of that data

Questions:

* How much of the dataset consists of trails?
* Can trail data be extracted efficiently?
* How frequently should updates occur?

Status: TBD

---

### Storage

Questions:

* How large will the trail dataset be after extraction?
* What database architecture is appropriate?
* How should GeoJSON be stored and indexed?

Status: TBD

---

### Performance

Mobile users often have limited bandwidth.

Potential solutions:

* Load trail data based on map viewport
* Progressive downloading
* Tile-based data delivery
* Local caching of previously viewed regions

---

### Elevation & Distance Calculations

Questions:

* Can selected APIs provide elevation profiles?
* Can routes be measured accurately?
* What additional data sources may be required?

Status: TBD

---

### Moderation

Future community features will require moderation for:

* Inappropriate reviews
* Spam content
* Harassment
* Misinformation

Status: TBD

---

## Open Questions

* What is the best trail data source?
* How should offline support work?
* How should custom routes be stored?
* Should users be able to submit new trails?
* What level of moderation is required?
* How can map data remain lightweight on mobile devices?

---

## Research Resources

### Potentially Useful

* OpenStreetMap
* OpenTrailMap
* US Forest Service Trail Data
* USGS Trail Resources
* National Map Trails Explorer
* Data.gov Trail Datasets

### Notes

Several trail data sources and GIS tools have been identified for future evaluation. Data quality, licensing, coverage, update frequency, and storage requirements still need investigation before a final architecture decision is made.
