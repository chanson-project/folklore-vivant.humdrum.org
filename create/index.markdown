---
layout: default
title: Create
nav_exclude: true
---

<script>
  const CREATE_WORKS = {% include metadata/works.json %};
</script>

<div class="create-page">

  <h1>Create your own version ✨</h1>

  <h2 id="create-title"></h2>
  <p id="create-composer"></p>
  <p id="create-song-id"></p>

<div class="create-editor">
  <div class="create-column">
    <h3>Original</h3>
    <div id="create-original-lyrics" class="create-original-lyrics">
      Loading lyrics...
    </div>
  </div>

  <div class="create-column">
    <h3>Your version</h3>
    <textarea
      id="create-your-lyrics"
      class="create-your-lyrics"
      placeholder="Write your own lyrics here..."
    ></textarea>
  </div>
</div>

</div>

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}