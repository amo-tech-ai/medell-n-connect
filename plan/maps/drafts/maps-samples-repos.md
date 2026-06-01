Do **not** install all of [googlemaps-samples](https://github.com/googlemaps-samples?utm_source=chatgpt.com).

Use it as:

- reference code
    
- architecture examples
    
- copy/pattern source
    

Most samples are standalone demos, not reusable production packages.

---

# What you SHOULD install

## 1. MarkerClusterer

Install:

```bash
cd /home/sk/mde
npm install @googlemaps/markerclusterer
```

Use for:

- apartments
    
- events
    
- restaurants
    
- nearby search
    

Critical once you have many pins.

---

## 2. JS API Loader

Install:

```bash
npm install @googlemaps/js-api-loader
```

This should become your standard Maps loader.

---

## 3. Extended Component Library

Install:

```bash
npm install @googlemaps/extended-component-library
```

Best UI acceleration package.

---

# What you should COPY from googlemaps-samples

## Best samples for mdeai

|Priority|Sample type|Score /100|Use case|
|---|---|--:|---|
|1|Advanced Markers|98|apartment/event pins|
|2|Marker clustering|97|many rentals|
|3|Place Autocomplete|96|venue search|
|4|Places UI Kit|95|venue/place panels|
|5|Nearby Search|94|nearby restaurants/events|
|6|Directions/Routes|92|apartment → venue|
|7|InfoWindow patterns|90|rich listing previews|
|8|Data-driven styling|86|neighborhood layers|
|9|3D maps|75|future|
|10|Deck.gl/WebGL overlays|72|future advanced geo|

---

# Best exact sample categories for your app

## Rentals map

Study:

- Advanced markers
    
- Clustering
    
- Info windows
    
- Custom marker HTML
    

Goal:

```text
🏠 Apartment card preview
💰 Price badge
📶 Wifi score
⭐ Rating
```

---

## Events map

Study:

- Nearby Search
    
- Place Overview
    
- Routes
    
- Venue markers
    

Goal:

```text
🎉 Event pin
📍 Venue details
🚶 Directions
🍽 Nearby places
```

---

## Chat map

Study:

- Split layouts
    
- Overlay layouts
    
- Dynamic markers
    
- Marker updates
    

Matches your:

- 3-panel architecture
    
- right-side synced map
    
- inline cards
    

Your architecture already aligns with this pattern.

---

# Best strategy

## DO THIS

```text
googlemaps-samples
    ↓
study patterns
    ↓
copy only needed logic
    ↓
adapt into React + Vite + Mastra
```

NOT:

```text
install entire samples repo into production
```

---

# Recommended folders to study first

Inside samples:

|Folder topic|Why|
|---|---|
|advanced-markers|core UX|
|marker-clustering|scale|
|places-autocomplete|venue picker|
|nearby-search|recommendations|
|directions-routes|routes|
|place-details|venue pages|
|map-id/vector|advanced rendering|
|accessibility|production readiness|

---

# What fits your current roadmap best

Based on your PRDs and Maps strategy:

## Highest value RIGHT NOW

|Feature|Why|
|---|---|
|Advanced markers|core rentals/events UX|
|Clustering|scalability|
|Place picker|venue workflows|
|Place overview|venue details|
|Overlay layouts|mobile UX|
|Nearby search|event/rental cross-sell|
|Route overview|directions|
|Accessibility examples|production quality|

Your architecture already emphasizes:

- synced map pins
    
- rentals/events/restaurants
    
- map/chat integration
    
- structured map layouts
    

---

# Do NOT install these yet

|Sample type|Why|
|---|---|
|Fleet tracking|unrelated|
|Navigation SDK|mobile-focused|
|Android/iOS|web MVP|
|AR/Immersive|premature|
|WebGL overlays|complexity|
|deck.gl heavy visualizations|overkill|
|Firebase integrations|you already use Supabase|

---

# Recommended final stack

|Layer|Tool|
|---|---|
|Maps rendering|Maps JS API|
|Loader|js-api-loader|
|UI components|extended-component-library|
|Clustering|markerclusterer|
|AI docs|platform-ai MCP|
|Backend|Supabase|
|Agents|Mastra|
|Geo AI|Grounding Lite|
|Search|Places API New|

---

# Exact install commands

```bash
cd /home/sk/mde

npm install @googlemaps/js-api-loader

npm install @googlemaps/markerclusterer

npm install @googlemaps/extended-component-library

npm install -D @googlemaps/jest-mocks
```

---

# Final recommendation

| Action                             | Priority     |
| ---------------------------------- | ------------ |
| Install js-api-loader              | 🔴 Critical  |
| Install markerclusterer            | 🔴 Critical  |
| Install extended-component-library | 🔴 Critical  |
| Study advanced-marker samples      | 🔴 Critical  |
| Study Places UI Kit examples       | 🟡 Important |
| Clone full samples repo            | 🟢 Optional  |
| Install everything blindly         | ❌ Avoid      |