---
title: "Next.js App Router : comprendre le cache en 5 minutes"
description: "Le système de cache de Next.js App Router m'a rendu fou. Depuis Toulon, voici le guide que j'aurais aimé avoir."
date: "2026-03-08"
tags: ["Next.js", "Cache", "Toulon"]
---

## Le problème

Next.js App Router a **4 couches de cache** qui interagissent entre elles. Quand on ne les comprend pas, on se retrouve avec des données obsolètes en production sans savoir pourquoi. J'ai passé des heures à débugger ce type de problème à Toulon avant de systématiser mon approche.

## Les 4 couches

| Couche | Où | Durée par défaut | Opt-out |
|---|---|---|---|
| Request Memoization | Serveur (par requête) | Durée de la requête | Aucun (automatique avec `fetch`) |
| Data Cache | Serveur (persistant) | Infini | `{ cache: 'no-store' }` |
| Full Route Cache | Serveur (build) | Jusqu'au revalidate | `export const dynamic = 'force-dynamic'` |
| Router Cache | Client (navigation) | 30s (dynamique) / 5min (statique) | `router.refresh()` |

## Ce qui m'a piégé : le Data Cache

Par défaut, `fetch` dans un Server Component est **caché indéfiniment**. Oui, indéfiniment.

```typescript
// Cette donnée ne sera JAMAIS rafraîchie après le build
const res = await fetch('https://api.example.com/data');

// Option 1 : pas de cache du tout
const res = await fetch('https://api.example.com/data', {
  cache: 'no-store',
});

// Option 2 : revalidation temporelle
const res = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 }, // rafraîchir toutes les 60s
});

// Option 3 : revalidation à la demande (via Server Action)
import { revalidateTag } from 'next/cache';

const res = await fetch('https://api.example.com/data', {
  next: { tags: ['products'] },
});

// Dans une Server Action après mutation :
revalidateTag('products');
```

## Le Router Cache côté client

C'est la couche la plus traître. Même après une revalidation côté serveur, le **client garde son cache** pendant 30 secondes pour les routes dynamiques.

```typescript
'use client';
import { useRouter } from 'next/navigation';

function RefreshButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.refresh()}>
      Rafraîchir
    </button>
  );
}
```

`router.refresh()` invalide le Router Cache **sans perdre l'état client** (contrairement à un `window.location.reload()`).

## Ma règle décisionnelle

```
Données qui changent rarement (blog, docs) → revalidate: 3600
Données qui changent souvent (dashboard) → cache: 'no-store'
Données après mutation → revalidateTag / revalidatePath
Affichage client obsolète → router.refresh()
```

> « Il n'y a que deux choses difficiles en informatique : l'invalidation du cache et nommer les choses. » — Phil Karlton. Après avoir travaillé avec le cache de Next.js, je confirme que l'invalidation du cache reste le problème le plus sous-estimé du développement web.

## En résumé

Depuis que j'ai intégré cette grille de lecture dans mes projets Next.js à Toulon, je n'ai plus de surprise en production. La clé, c'est de décider **à l'avance** la stratégie de cache pour chaque donnée.

Consultez [mon expertise Next.js](/developpeur-nextjs-toulon), parcourez mes [réalisations](/projets) ou [discutons de votre projet](/contact).
