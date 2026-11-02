---
layout: page
title: sources
order: 5
---

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}
{% include styles/styles-common.css.html %}

<div class="section-header"><h4 data-i18n="src.heading">Sources</h4></div>

<div id="sources-cards"></div>

<div id="source-works-panel" class="source-works-hidden">
  <div id="source-works-header"></div>
  <div id="source-search-bar">
    <input type="text" id="source-input" onkeyup="sourceSearch()" placeholder="Filter by title, composer…" data-i18n-placeholder="src.search_placeholder">
    <span id="source-count"></span>
  </div>
  <div id="source-works-list"></div>
</div>
