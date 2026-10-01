---
layout: page
title: chansons
order: 3

---

<script async src="https://www.googletagmanager.com/gtag/js?id=G-38882FHV3H"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-38882FHV3H');
</script>

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}
{% include styles/styles-common.css.html %}

<div class="section-header"><h4 data-i18n="rep.heading">Repertoire</h4></div>

<div id="search-interface">
  <div class="row">
    <div class="left-group">
      <input type="text" id="input" onkeyup="FreeTextSearch()" placeholder="Enter title, composer, etc." data-i18n-placeholder="rep.search_placeholder">
      <input type="text" id="melodic-input" onkeyup="handleMelodicInput()" placeholder="Melodic: G A G F# E …" data-i18n-placeholder="rep.melodic_placeholder">
      <div id="search-count"></div>
    </div>
    <div class="right-group">
      <div id="dropdowns">
        <div class="top-line">
          <div id="composer-container"></div>
          <div id="lyricist-container"></div>
          <div id="origin-container"></div>
          <div id="collection-container"></div>
          <div id="editor-container"></div>
        </div>
        <div class="top-line">
          <div id="genre-container"></div>
          <div id="topic-container"></div>
          <div id="key-container"></div>
          <div id="time-container"></div>
          <div id="texted-container"></div>
        </div>
      </div>
      <div class="bottom-controls">
        <button onclick="clearSearchFields()" data-i18n="rep.clear_all" title="Clear all search fields" aria-label="Clear all search fields">Clear All</button>
        <a href="/guide/" class="help-btn" data-i18n-title="rep.user_guide" title="User Guide">?</a>
      </div>
    </div>
  </div>
</div>
<div id="list"></div>