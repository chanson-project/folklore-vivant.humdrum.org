---
layout: default
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

    <div class="create-side create-side-original">
      <h3>👀 Sing it like this</h3>
      <p class="create-side-subtitle">Follow the original words</p>

      <div id="create-original-lyrics">
        Loading lyrics...
      </div>
    </div>

    <div class="create-side create-side-yours">
      <h3>🌟 Now make it yours!</h3>
      <p class="create-side-subtitle">Write your own words</p>

      <div id="create-your-lyrics"></div>
    </div>

  </div>

</div>

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}