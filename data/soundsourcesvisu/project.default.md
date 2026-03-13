# Sound Sources Visualization – Lorient

This project presents an interactive 3D visualization of urban sound sources measured by a network of 52 sensors deployed in Lorient, France.

## Overview

The visualization uses **deck.gl** to render 3D "data vases" and rose diagrams on an interactive map. Each sensor location displays the relative contribution of different sound sources:

- **Traffic** – road and motorized vehicle noise
- **Voices** – human speech and conversations
- **Birds** – birdsong and natural sounds

## COVID-19 Lockdown Analysis

The dataset spans three periods, allowing comparison of the urban soundscape before, during, and after the French COVID-19 lockdown:

- **Before lockdown** – baseline urban sound environment
- **Lockdown** – reduced traffic and human activity
- **After lockdown** – return to normal activity levels

Data is aggregated by **time of day** (24 hourly intervals) and **day of week** (7 daily intervals), enabling fine-grained temporal analysis of sound source patterns.

## Technical Details

- 52 sensor locations in Lorient city center
- Variables: traffic (t), voices (v), birds (b), Leq, LAeq
- Temporal resolution: hourly averages and day-of-week averages
- Visualization: deck.gl 3D rendering with MapLibre GL basemap
