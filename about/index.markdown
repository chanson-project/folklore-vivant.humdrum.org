---
layout: page
title: about
order: 1

---

<script src="https://cdn.jsdelivr.net/npm/vega@5.25.0"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-lite@5.15.1"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-embed@6.22.2"></script>

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}
{% include styles/styles-common.css.html %}

<div class="section-header"><h4 data-i18n="about.heading"></h4></div>

<h2 data-i18n="about.h_project"></h2>
<p data-i18n="about.project"></p>

<h2 data-i18n="about.h_feedback"></h2>
<p data-i18n-html="about.feedback"></p>

<h2 data-i18n="about.h_people">People</h2>

<div class="team-container">
    <div class="team-member">
        <img src="/images/headshots/Poudrier.jpg" alt="Ève Poudrier">
        <div class="bio">
            <h3>Ève Poudrier</h3>
            <p class="role" data-i18n="about.role_director">Director</p>
            <p data-i18n-html="about.bio_eve"></p>
        </div>
    </div>
    <div class="team-member">
        <img src="/images/headshots/Sapp.jpg" alt="Craig Sapp">
        <div class="bio">
            <h3>Craig Sapp</h3>
            <p class="role" data-i18n="about.role_tech_director">Technical Director</p>
            <p data-i18n-html="about.bio_craig"></p>
        </div>
    </div>
    <div class="team-member">
        <img src="/images/headshots/Ayan.png" alt="Irem Ayan">
        <div class="bio">
            <h3>Irem Ayan</h3>
            <p class="role" data-i18n="about.role_researcher">Researcher</p>
            <p data-i18n-html="about.bio_irem"></p>
        </div>
    </div>
    <div class="team-member">
        <img src="/images/headshots/Boone.jpg" alt="Samuel Boone">
        <div class="bio">
            <h3>Samuel Boone</h3>
            <p class="role" data-i18n="about.role_ra">Research Assistant</p>
            <p data-i18n-html="about.bio_sam"></p>
        </div>
    </div>
    <div class="team-member">
        <img src="/images/headshots/Howie.jpg" alt="Isaac Howie">
        <div class="bio">
            <h3>Isaac Howie</h3>
            <p class="role" data-i18n="about.role_ra">Research Assistant</p>
            <p data-i18n-html="about.bio_isaac"></p>
        </div>
    </div>
    <div class="team-member">
        <img src="/images/headshots/Tang.jpg" alt="Karissa Tang">
        <div class="bio">
            <h3>Karissa Tang</h3>
            <p class="role" data-i18n="about.role_ra">Research Assistant</p>
            <p data-i18n-html="about.bio_karissa"></p>
        </div>
    </div>
</div>

<h2 data-i18n="about.h_support">Support</h2>

<div class="support-section">
  <p data-i18n-html="about.support"></p>

  <div class="support-logos-top">
    <a href="https://disa.arts.ubc.ca/" target="_blank">
      <img src="/images/DiSA%20Incubators.jpg" alt="UBC Digital Scholarship in the Arts logo" class="support-logo">
    </a>
    <a href="https://languagesciences.ubc.ca/" target="_blank">
      <img src="/images/LanguageSciences_logo.svg" alt="UBC Language Sciences Initiative logo" class="support-logo">
    </a>
    <a href="https://www.ccarh.org/" target="_blank">
      <img src="/images/CCARH_logo.png" alt="CCARH logo" class="support-logo">
    </a>
  </div>
</div>
