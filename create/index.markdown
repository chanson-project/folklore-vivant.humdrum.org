---
layout: page
title: Create
nav_exclude: true
---

<div class="create-back-wrap">
  <a id="create-back-link" class="create-back-btn" href="/sing/">
    ← Back to song
  </a>
</div>

<script>
  const CREATE_WORKS = {% include metadata/works.json %};
</script>

<div class="create-page">

  <h1 id="create-title" class="create-song-title"></h1>
  <p id="create-composer" class="create-composer"></p>
  <p id="create-song-id" class="create-song-id"></p>

  <div class="create-editor">

  <div id="create-lines">
    Loading song...
  </div>

</div>

</div>

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}