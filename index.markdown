---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page
---

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}
{% include styles/styles-common.css.html %}

<div class="homepage-grid">

  <!-- LEFT COLUMN -->
  <div class="left-column">
    <div class="section-header"><h4 data-i18n="home.browse">Search</h4></div>
    <div class="browse-box">
      <div class="apple-search">
        <input
          type="search"
          id="input"
          placeholder="Search composers, works, genres…"
          data-i18n-placeholder="home.search_placeholder"
          autocomplete="off"
        >
        <div id="search-suggestions"
             class="search-suggestions hidden"></div>
      </div>
      <div class="apple-search home-melodic-search">
        <input
          type="text"
          id="melodic-input"
          placeholder="Melody: G A F# E …"
          data-i18n-placeholder="home.melodic_placeholder"
          autocomplete="off"
        >
      </div>
    </div>
    <div class="section-header"><h4 data-i18n="home.project_data">Project Data</h4></div>
    <div class="data-box apple-data">
      <div class="data-metrics">
        <div class="metric">
          <div class="metric-value" id="work-count"></div>
          <div class="metric-label" data-i18n="home.works">Works</div>
        </div>
        <div class="metric">
          <div class="metric-value" id="home-source-count"></div>
          <div class="metric-label" data-i18n="home.sources">Sources</div>
        </div>
      </div>
      <div class="data-genres">
        <div class="genre-row">
          <span class="genre-count" id="home-composer-count"></span>
          <span class="genre-label" data-i18n="home.composers">Composers</span>
        </div>
        <div class="genre-row">
          <span class="genre-count" id="home-page-count"></span>
          <span class="genre-label" data-i18n="home.pages">Pages</span>
        </div>
        <div class="genre-row">
          <span class="genre-count" id="home-encoder-count"></span>
          <span class="genre-label" data-i18n="home.encoders">Encoders</span>
        </div>
      </div>
    </div>
  </div>

  <!-- RIGHT COLUMN -->
  <div class="right-column">
    <div class="section-header"><h4 data-i18n="home.top_topics">Most Common Topics</h4></div>
    <div id="topic-plot"></div>
  </div>

</div>

<div class="section-header"><h4 data-i18n="home.sources">Sources</h4></div>
<div id="home-sources-cards"></div>
