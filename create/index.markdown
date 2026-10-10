---
layout: page
title: Create
nav_exclude: true
---



<div id="create-score-test-output"></div>

<div class="create-back-wrap">
  <a id="create-sing-link" class="create-back-btn" href="/sing/">
  🎤 <span data-i18n="nav.sing_along">Sing Along!</span>
</a>

  <a id="create-chanson-link" class="create-back-btn" href="/work/">
    🎼 Chansons
  </a>
</div>

<script>
  const CREATE_WORKS = {% include metadata/works.json %};
</script>

<div class="create-page">

  <h1 id="create-title" class="create-song-title"></h1>
  <p id="create-composer" class="create-composer"></p>
  <p id="create-song-id" class="create-song-id"></p>

<div class="create-export-actions">
  <button
    id="create-save-pdf"
    class="create-save-pdf-btn"
    type="button">
    📄 Save as PDF
  </button>
</div>

<div class="create-tempo-control">

  <button
    type="button"
    class="create-tempo-btn"
    data-scale="0.5"
    title="Slow"
    aria-label="Slow">
    🐢
  </button>

  <input
    id="create-tempo-slider"
    class="create-tempo-slider"
    type="range"
    min="20"
    max="240"
    value="120"
    aria-label="Tempo">

  <button
    type="button"
    class="create-tempo-btn"
    data-scale="1.5"
    title="Fast"
    aria-label="Fast">
    🐇
  </button>

  <label class="create-tempo-input-wrap">
    <span>♩</span>
    <input
      id="create-tempo-input"
      type="number"
      min="20"
      max="240"
      value="120">
    <span>bpm</span>
  </label>

</div>

  <div class="create-title-editor">

    <div class="create-title-editor-label">
      Title
    </div>

    <div class="create-title-original">
      <span class="create-title-label">
        Original:
      </span>

      <span id="create-original-title"></span>
    </div>

    <div class="create-title-input-wrap">

      <label
        for="create-user-title"
        class="create-title-label">
        Your title:
      </label>

      <input
        id="create-user-title"
        class="create-title-input"
        type="text"
        placeholder="Write your title..."
      >

    </div>

  </div>


  <div class="create-editor">

    <div id="create-lines">
      Loading song...
    </div>

  </div>

</div>


<!-- Hidden KernPlayer DOM hooks -->
<div
  id="audiobutton-container"
  style="
    position:absolute;
    width:0;
    height:0;
    overflow:hidden;
    opacity:0;
    pointer-events:none;
  "
>
  <span id="audiobutton-play"></span>
</div>


<!-- Humdrum score rendering -->
<script src="https://plugin.humdrum.org/scripts/humdrum-notation-plugin-worker.js"></script>


<!-- Humdrum audio player -->
{% include scripts/kern-player.html %}


{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}