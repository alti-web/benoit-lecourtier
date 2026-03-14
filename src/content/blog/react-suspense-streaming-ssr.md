---
title: "React Suspense + streaming SSR : ce que j'ai appris"
description: "J'ai implémenté le streaming SSR avec React Suspense sur un projet à Toulon. Voici ce qui change réellement côté performance."
date: "2026-03-09"
tags: ["React.js", "SSR", "Toulon"]
---

## Pourquoi j'ai testé le streaming

Sur un dashboard React à Toulon, le Time to First Byte (TTFB) était de **2.8 secondes**. La raison : le serveur attendait que toutes les requêtes API soient terminées avant d'envoyer le moindre octet de HTML.

Le streaming SSR avec `Suspense` change fondamentalement ce modèle.

## Le principe en 30 secondes

Au lieu d'attendre que tout soit prêt, le serveur envoie immédiatement le shell HTML, puis **streame** les parties asynchrones au fur et à mesure.

```tsx
// Le serveur envoie immédiatement le layout
// puis streame chaque Suspense boundary quand ses données arrivent
export default function Dashboard() {
  return (
    <main>
      <h1>Dashboard</h1>
      <Suspense fallback={<StatsSkeletons />}>
        <Stats />  {/* Requête API: 200ms */}
      </Suspense>
      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />  {/* Requête API: 1.2s */}
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <RecentOrders />  {/* Requête API: 800ms */}
      </Suspense>
    </main>
  );
}
```

## Les résultats mesurés

| Métrique | SSR classique | Streaming SSR | Amélioration |
|---|---|---|---|
| TTFB | 2800 ms | 120 ms | -96% |
| FCP (First Contentful Paint) | 3100 ms | 450 ms | -85% |
| LCP | 3400 ms | 1400 ms | -59% |
| TTI (Time to Interactive) | 3800 ms | 2200 ms | -42% |
| Taille HTML initiale | 84 KB | 12 KB (shell) | -86% |

Le **TTFB passe de 2.8s à 120ms**. L'utilisateur voit le skeleton du dashboard quasi instantanément.

## Le piège de la granularité

J'ai d'abord mis un seul `Suspense` autour de tout le contenu. Erreur : le streaming n'apporte rien si tout est dans un seul boundary.

La règle que j'applique : **un `Suspense` par source de données indépendante**.

```tsx
// Mauvais — un seul boundary, on attend tout
<Suspense fallback={<FullPageSkeleton />}>
  <Stats />
  <RevenueChart />
  <RecentOrders />
</Suspense>

// Bon — chaque section streame indépendamment
<Suspense fallback={<StatsSkeletons />}>
  <Stats />
</Suspense>
<Suspense fallback={<ChartSkeleton />}>
  <RevenueChart />
</Suspense>
```

> « L'utilisateur ne se soucie pas du temps de chargement total, mais du temps avant la première information utile. » C'est cette réalisation qui a changé mon approche du SSR.

## Quand ne pas utiliser le streaming

Le streaming n'est pas toujours la solution. Si votre page a une seule requête API rapide (<200ms), le SSR classique est plus simple et le gain est négligeable.

Je trouve que le streaming SSR brille vraiment sur les pages complexes avec **3+ sources de données** de latences différentes — ce qui est typique des dashboards et back-offices que je développe à Toulon.

Pour en savoir plus, consultez [mon expertise React](/developpeur-react-toulon), mes [projets livrés](/projets) ou [contactez-moi](/contact).
