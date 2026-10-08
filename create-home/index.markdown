---
layout: page
title: Create
nav_exclude: true
---

<div class="create-home-page">

<h1 class="create-home-title" id="create-home-title">
  ✨ Create
</h1>

<p class="create-home-subtitle" id="create-home-subtitle">
  Choose a song to create your own version.
</p>

<script>
(function () {
  function updateCreateHomeLanguage() {
    const lang = window.LANG ||
      localStorage.getItem('chanson_lang') || 'en';

    document.getElementById('create-home-title').textContent =
      lang === 'fr' ? '✨ Composez!' : '✨ Create';

    document.getElementById('create-home-subtitle').textContent =
      lang === 'fr'
        ? 'Choisissez une chanson pour créer votre propre version.'
        : 'Choose a song to create your own version.';
  }

  updateCreateHomeLanguage();
  document.addEventListener('DOMContentLoaded', updateCreateHomeLanguage);
})();
</script>

<div class="create-home-search-wrap">
  <input
    id="create-home-search"
    class="create-home-search"
    type="search"
    placeholder="Search / Rechercher..."
    aria-label="Search songs"
  >
</div>

<div
  id="create-home-count"
  class="create-home-count">
</div>

  <div id="create-home-grid"></div>

</div>

<script>
  const CREATE_HOME_WORKS = {% include metadata/works.json %};
</script>

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}