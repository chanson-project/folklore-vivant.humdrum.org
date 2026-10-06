---
layout: page
title: Create
nav_exclude: true
---

<div class="create-home-page">

  <h1 class="create-home-title">
    ✨ Create
  </h1>

  <p class="create-home-subtitle">
    Choose a song to create your own version.
  </p>

  <div id="create-home-grid"></div>

</div>

<script>
  const CREATE_HOME_WORKS = {% include metadata/works.json %};
</script>

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}