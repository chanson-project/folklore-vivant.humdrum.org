---
layout: page
title: tools
order: 6
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
{% include_relative scripts-local.html %}
{% include styles/styles-common.css.html %}

<div class="section-header"><h4 data-i18n="edu.heading">Educational Resources</h4></div>
<p class="edu-intro" data-i18n="edu.intro">Digital tools for Francophone music and language education in K–12 schools.</p>

<div id="edu-filters">
  <div id="edu-access-tabs">
    <button class="edu-tab active" data-filter="all" data-i18n="edu.filter_all" title="Show all resources" aria-label="Show all resources">All</button>
    <button class="edu-tab" data-filter="free" data-i18n="edu.filter_free" title="Show free resources" aria-label="Show free resources">Free</button>
    <button class="edu-tab" data-filter="subscription" data-i18n="edu.filter_sub" title="Show subscription resources" aria-label="Show subscription resources">Subscription</button>
  </div>
  <div id="edu-category-tabs">
    <button class="edu-cat active" data-cat="all" data-i18n="edu.cat_all" title="Show all categories" aria-label="Show all categories">All categories</button>
    <button class="edu-cat" data-cat="music" data-i18n="edu.cat_music" title="Show music creation resources" aria-label="Show music creation resources">Music creation</button>
    <button class="edu-cat" data-cat="language" data-i18n="edu.cat_language" title="Show language learning resources" aria-label="Show language learning resources">Language learning</button>
    <button class="edu-cat" data-cat="literacy" data-i18n="edu.cat_curriculum" title="Show music literacy resources" aria-label="Show music literacy resources">Music literacy</button>
  </div>
</div>

<div id="edu-count"></div>
<div id="edu-grid"></div>

<!-- Suggestion modal -->
<div id="edu-suggestion-modal" class="edu-suggestion-overlay hidden" onclick="closeSuggestionIfOverlay(event)">
  <div class="edu-suggestion-box">
    <div class="edu-suggestion-header">
      <span id="edu-suggestion-tool" class="edu-suggestion-tool"></span>
      <button class="edu-suggestion-close" onclick="closeSuggestion()" title="Close suggestion" aria-label="Close suggestion">✕</button>
    </div>
    <div id="edu-suggestion-content" class="edu-suggestion-content"></div>
  </div>
</div>
