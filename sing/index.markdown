---
layout: page
title: sing along
nav_exclude: true
---

<script async src="https://www.googletagmanager.com/gtag/js?id=G-38882FHV3H"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-38882FHV3H');
</script>

{% include_relative styles-local.html %}
{% include styles/styles-common.css.html %}

<!-- ── Grid view ───────────────────────────────────────────────────────── -->
<div id="sing-grid-view">

  <div class="sing-hero">
    <div class="sing-hero-icon">🎵</div>
    <h2 class="sing-hero-title">Chantons ensemble!</h2>
    <p class="sing-hero-sub">Choose a song — <em>Choisissez une chanson</em></p>
  </div>

  <div class="sing-toolbar">
    <input type="search" id="sing-search" class="sing-search" placeholder="Search / Rechercher…" oninput="filterSongs()">
    <button class="sing-btn surprise-btn" onclick="pickRandom()">🎲 Surprise!</button>
  </div>

  <div id="sing-count" class="sing-count"></div>
  <div id="sing-grid" class="sing-grid"></div>

</div>

<!-- ── Stage view ──────────────────────────────────────────────────────── -->
<div id="sing-stage" class="hidden">

  <!-- Song title — first thing kids see -->
  <div class="stage-info">
    <div class="stage-title-row">
    <div id="stage-title" class="stage-title"></div>
    <a id="stage-youtube"
       class="stage-youtube hidden"
       href="#"
       target="_blank"
       rel="noopener noreferrer"
       aria-label="Watch on YouTube"
       title="Watch on YouTube"></a>
</div>
    <div id="stage-comp" class="stage-comp"></div>
  </div>

  <div id="stage-youtube-player" class="stage-youtube-player hidden"></div>

  <!-- Player: prev · play/pause · next in one row -->
  <div class="stage-player">
    <button id="stage-prev" class="sing-btn arrow-btn" onclick="prevSong()" aria-label="Previous song">‹</button>
    <button id="stage-play-btn" class="play-btn" onclick="togglePlay()" disabled aria-label="Play">▶</button>
    <button id="stage-next" class="sing-btn arrow-btn" onclick="nextSong()" aria-label="Next song">›</button>
  </div>

  <div id="kp-progress" class="kp-progress"><div id="kp-progress-fill" class="kp-progress-fill"></div></div>

<div class="tempo-row">
  <button class="tempo-btn" data-scale="0.5" onclick="setTempoScale(0.5)" title="Slow">🐢</button>

  <input id="sing-tempo-slider"
         class="sing-tempo-slider"
         type="range"
         min="20"
         max="240"
         value="120"
         oninput="setSingTempo(this.value)">

  <button class="tempo-btn" data-scale="1.5" onclick="setTempoScale(1.5)" title="Fast">🐇</button>

  <label class="sing-tempo-input-wrap">
    <span>♩</span>
    <input id="sing-tempo-input"
           class="sing-tempo-input"
           type="number"
           min="20"
           max="240"
           value="120"
           onchange="setSingTempo(this.value)">
    <span>bpm</span>
  </label>
</div>

  <div id="stage-lyrics" class="stage-lyrics"></div>

  <!-- Back link at the bottom so it doesn't interrupt the song view -->
  <div class="stage-back-wrap">
    <button class="sing-btn back-btn" onclick="showGrid()">← All songs</button>
  </div>

  <!-- Hidden KernPlayer DOM hooks -->
  <div id="audiobutton-container" style="position:absolute;width:0;height:0;overflow:hidden;opacity:0;pointer-events:none;">
    <span id="audiobutton-play"></span>
  </div>

</div>

{% include scripts/kern-player.html %}
{% include_relative scripts-local.html %}
