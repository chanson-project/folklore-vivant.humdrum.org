---
layout: page
title: documentation
order: 2
nav_exclude: true
---

{% include_relative styles-local.html %}
{% include styles/styles-common.css.html %}

<div class="section-header"><h4 data-i18n="doc.heading"></h4></div>

<p data-i18n-html="doc.intro"></p>

<h2>Encoding Repository</h2>

<details>
<summary><h3>Repository Overview</h3></summary>
<div>

<p>The Chanson Repository is a collection of Francophone folk songs encoded in Humdrum <strong><code>**kern</code></strong> format, featuring musical scores, poetic text, phonemes, and rhyme analysis.</p>

<h4>Key Collections</h4>
<ul>
  <li><strong>BC100</strong>: Initial encoding stage with developing editorial policies</li>
  <li><strong>EG104</strong>: Similar encoding standards</li>
</ul>
<p>Both are accessible through <a href="https://folklore-vivant.humdrum.org" target="_blank">folklore-vivant.humdrum.org</a> (viewing, downloading, and export options) and Verovio Humdrum View under "Monophonic Songs" → "Scores".</p>

<h4>Encoding Structure</h4>
<p>Each file uses three primary spines:</p>
<ul>
  <li><code>**kern</code> — melody, rhythm, slurs, ties, accents, tempo and structure markings</li>
  <li><code>**dynam</code> — dynamic markings (crescendi and decrescendi)</li>
  <li><code>**text</code> — lyrics with syllabification</li>
</ul>

<h4>Text Encoding Conventions</h4>
<ul>
  <li>Hyphenation for middle and end syllables</li>
  <li>Line numbering using <code>*pline:n</code> notation</li>
  <li>Refrain identification with <code>*refrain</code> and <code>*italic</code> interpretations</li>
  <li>Elision marking using square brackets for unstated final vowels</li>
</ul>

<h4>Metadata &amp; Analysis</h4>
<p>Reference records precede each song with authorship, publication, and copyright information. Analysis data — including rhyme phonemes (<code>*rp</code>), rhyme groups (<code>*rf</code>), and structure labels (<code>*rs</code>) — are collected in a master spreadsheet for later export to kern files.</p>

</div>
</details>

<h2 data-i18n="doc.h_procedure"></h2>

<details>
<summary><h3 data-i18n="doc.h_general"></h3></summary>
<div data-i18n-html="doc.content_general"></div>
</details>

<details>
<summary><h3 data-i18n="doc.h_text"></h3></summary>
<div data-i18n-html="doc.content_text"></div>
</details>

<details>
<summary><h3 data-i18n="doc.h_music"></h3></summary>
<div data-i18n-html="doc.content_music"></div>
</details>

<details>
<summary><h3 data-i18n="doc.h_text_analysis"></h3></summary>
<div data-i18n-html="doc.content_text_analysis"></div>
</details>

<h2 data-i18n="doc.h_additional"></h2>

<details>
<summary><h3 data-i18n="doc.h_formatting"></h3></summary>
<div data-i18n-html="doc.content_formatting"></div>
</details>
