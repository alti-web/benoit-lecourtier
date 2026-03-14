---
title: "Astro View Transitions : le détail qui change tout"
description: "J'ai testé les View Transitions d'Astro en production à Toulon. Retour sur la directive transition:persist et ses pièges."
date: "2026-03-14"
tags: ["Astro JS", "Performance", "Toulon"]
---

## Le constat depuis mon bureau à Toulon

J'ai longtemps cherché comment donner une sensation « SPA » à un site statique sans embarquer de framework client. Quand Astro a sorti les **View Transitions**, j'ai immédiatement voulu les utiliser sur un projet vitrine à Toulon.

Le résultat m'a surpris — dans le bon et le mauvais sens.

## `transition:persist` : la directive qu'il faut comprendre

La plupart des tutos montrent `<ViewTransitions />` dans le `<head>` et s'arrêtent là. En réalité, le vrai pouvoir est dans `transition:persist`. Cette directive garde un élément **vivant** entre les navigations.

```astro
<audio id="player" transition:persist>
  <source src="/ambient.mp3" type="audio/mp3" />
</audio>
```

Sans `transition:persist`, l'audio redémarre à chaque changement de page. Avec, il continue de jouer.

## Ce que j'ai mesuré

| Métrique | Sans View Transitions | Avec View Transitions | Delta |
|---|---|---|---|
| LCP (ms) | 820 | 640 | -22% |
| CLS | 0.12 | 0.03 | -75% |
| JS côté client (KB) | 0 | 3.2 | +3.2 KB |
| Sensation de fluidité | Page blanche | Transition douce | Qualitatif |

Le **CLS** est le gain le plus marquant. Les transitions masquent le flash blanc entre les pages, ce qui élimine les décalages de layout perçus.

## Le piège que j'ai rencontré

Sur un composant avec un `setInterval` à l'intérieur, `transition:persist` ne nettoie **pas** le timer. Résultat : après 5 navigations, j'avais 5 intervals empilés.

La solution :

```javascript
document.addEventListener('astro:before-swap', () => {
  clearInterval(window.__myTimer);
});
```

> « La simplicité est la sophistication suprême. » — Léonard de Vinci. C'est exactement ce que j'essaie d'appliquer quand je choisis Astro pour un projet : le minimum de JS, le maximum d'impact.

## Mon avis

Je trouve que les View Transitions d'Astro représentent le meilleur compromis entre performance et expérience utilisateur en 2026. Pour mes clients à Toulon qui veulent un site rapide sans React côté client, c'est devenu mon choix par défaut.

Si vous voulez en savoir plus sur mon approche, jetez un oeil à [ma page Astro JS](/developpeur-astro-toulon), mes [projets réalisés](/projets) ou [contactez-moi directement](/contact).
