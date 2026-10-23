---
layout: page
title: Explore Map
permalink: /map/
---

<link rel="stylesheet" href="/map/assets/leaflet.css">
<link rel="stylesheet" href="/map/assets/MarkerCluster.css">
<link rel="stylesheet" href="/map/assets/MarkerCluster.Default.css">
{% include_relative styles-local.html %}

<section class="song-map-page" aria-label="Map of Canadian folk songs">
  <div class="song-map-intro" data-lang="en">
    <h2>Explore Canadian folk songs</h2>
    <p>Discover songs through the Canadian places recorded in their metadata. Select a pin to see the songs associated with that place.</p>
  </div>
  <div class="song-map-intro" data-lang="fr">
    <h2>Explorer les chansons folkloriques canadiennes</h2>
    <p>Découvrez les chansons grâce aux lieux canadiens indiqués dans leurs métadonnées. Sélectionnez un repère pour voir les chansons associées à ce lieu.</p>
  </div>

  <div class="song-map-toolbar">
    <label for="song-map-collection"><span data-lang="en">Collection</span><span data-lang="fr">Collection</span></label>
    <select id="song-map-collection" aria-label="Filter songs by collection"><option value="">All collections</option></select>
    <label for="song-map-search"><span data-lang="en">Search</span><span data-lang="fr">Rechercher</span></label>
    <input id="song-map-search" type="search" placeholder="Song or place / Chanson ou lieu" autocomplete="off" aria-label="Search song titles or places">
    <button type="button" id="song-map-reset" class="song-map-button"><span data-lang="en">Clear filters</span><span data-lang="fr">Effacer les filtres</span></button>
    <button type="button" id="song-map-focus" class="song-map-button"><span data-lang="en">Show song locations</span><span data-lang="fr">Voir les lieux des chansons</span></button>
  </div>

  <p id="song-map-summary" class="song-map-summary" role="status" aria-live="polite">Loading song locations…</p>
  <div id="canada-song-map" role="region" aria-label="Interactive map of Canada with song location markers"></div>

  <p class="song-map-note" data-lang="en">Pins indicate the place named in a song's <code>!!!ARE</code> metadata, not necessarily where the song was composed. Only locations that have been manually matched to verified coordinates are shown; incomplete or ambiguous records are omitted.</p>
  <p class="song-map-note" data-lang="fr">Les repères indiquent le lieu inscrit dans le champ <code>!!!ARE</code>, et non nécessairement le lieu de composition. Seuls les lieux associés manuellement à des coordonnées vérifiées sont affichés; les données incomplètes ou ambiguës sont omises.</p>
</section>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin="anonymous"></script>
<script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
{% include_relative scripts-local.html %}
