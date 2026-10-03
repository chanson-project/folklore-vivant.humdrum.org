---
layout: work
---

{% include_relative styles-local.html %}
{% include styles/styles-common.css.html %}

<script async src="https://www.googletagmanager.com/gtag/js?id=G-38882FHV3H"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-38882FHV3H');
</script>

<audio id="audio"></audio>

<table id="work-info">
   <thead>
       <tr>
           <th class="left-column">Left Column</th>
           <th class="middle-column">Middle Column</th>
           <th class="right-column">Right Column</th>
       </tr>
   </thead>
   <tbody id="work-info-body"></tbody>
</table>

<div id="external-info"></div>

<div id="search-nav" class="hidden">
  <button class="button nav-btn" id="nav-prev" onclick="navigateSearchResult(-1)" title="Previous search result" aria-label="Previous search result">&#9664;</button>
  <span id="nav-position"></span>
  <button class="button nav-btn" id="nav-next" onclick="navigateSearchResult(1)" title="Next search result" aria-label="Next search result">&#9654;</button>
  <a id="nav-back-link" href="/repertoire/" class="button nav-btn" title="Return to search" aria-label="Return to search">&#8592; Search</a>
  <a id="nav-sing-link"
   href="/sing/"
   class="button nav-btn"
   title="Open Sing Along version"
   aria-label="Open Sing Along version">
   🎤 <span data-i18n="nav.sing_along">Sing Along!</span>
</a>

<a id="nav-compose-link"
   href="/create/"
   class="button nav-btn"
   title="Create your own version"
   aria-label="Create your own version">
   ✏️ <span data-i18n="sing.compose">Create</span>
</a>

</div>


<div id="button-container" class="button-container">
    <div id="audiobutton-container">
        <span id="audiobutton-play"
              class="play"
              title="Play or pause the chanson"
              aria-label="Play or pause the chanson">play</span>
    </div>

    <div id="textSelect">
       <div class="button show-text"
            onclick="displayText()"
            data-i18n="work.show_text"
            title="Show or hide the text"
            aria-label="Show or hide the text">Show Text</div>

       <div class="button show-deg"
            onclick="displayScaleDegrees()"
            data-i18n="work.show_deg"
            title="Show or hide scale degrees"
            aria-label="Show or hide scale degrees">Show Scale Degrees</div>

       <div class="button show-cadences"
            onclick="displayCadences()"
            data-i18n="work.show_cadences"
            title="Show or hide cadences"
            aria-label="Show or hide cadences">Show Cadences</div>
    </div>
</div>

<div id="cadence-panel" class="hidden"></div>

<div class="PREHTML" style="display:none"></div>
<div class="POSTHTML" style="display:none"></div>

<script type="text/x-humdrum" id="my-score"></script>

<div id="work-footer"></div>

{% include_relative listeners.html %}
{% include_relative scripts-local.html %}
<script>{% include_relative cadence-analysis.js %}</script>
{% include scripts/kern-player.html %}
{% include styles/svgdefs.html %}
