---
layout: page
title: Create
nav_exclude: true
---

<script type="text/x-humdrum" id="create-score-test"></script>
<div id="create-score-test-output"></div>

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

<script type="text/x-humdrum" id="create-score-test"></script>

  <div id="create-lines">
    Loading song...
  </div>

</div>

</div>

<script src="https://plugin.humdrum.org/scripts/humdrum-notation-plugin-worker.js"></script>

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}