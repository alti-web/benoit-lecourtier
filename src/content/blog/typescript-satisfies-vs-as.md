---
title: "TypeScript : pourquoi j'ai remplacé tous mes 'as' par 'satisfies'"
description: "Le mot-clé satisfies de TypeScript a changé ma façon de typer. Retour technique depuis Toulon sur cette migration silencieuse."
date: "2026-03-11"
tags: ["TypeScript", "Qualité", "Toulon"]
---

## Le problème avec `as`

J'utilisais `as` partout. C'était rapide, ça compilait, et ça me donnait un faux sentiment de sécurité. Jusqu'au jour où un bug en production m'a coûté une demi-journée de debug.

```typescript
// Dangereux — as force le type sans vérifier
const config = {
  port: '3000', // string au lieu de number
  host: 'localhost',
} as ServerConfig; // aucune erreur à la compilation
```

Le `as` dit à TypeScript : « fais-moi confiance ». Mais TypeScript ne devrait pas nous faire confiance.

## `satisfies` : la vérification sans perte

`satisfies` vérifie que la valeur est compatible avec le type **sans élargir le type inféré**.

```typescript
type ServerConfig = {
  port: number;
  host: string;
};

// Erreur à la compilation : port est string, pas number
const config = {
  port: '3000',
  host: 'localhost',
} satisfies ServerConfig;

// Correct — et le type inféré est le plus précis possible
const config = {
  port: 3000,
  host: 'localhost',
} satisfies ServerConfig;
// typeof config.host = 'localhost' (littéral), pas string
```

## Comparatif détaillé

| Aspect | `as` | `satisfies` | Type annotation |
|---|---|---|---|
| Vérification à la compilation | Non | Oui | Oui |
| Préserve le type littéral | Non | Oui | Non |
| Autocomplétion précise | Non | Oui | Partielle |
| Détecte les propriétés en trop | Non | Oui | Oui |
| Cas d'usage | Narrowing forcé | Validation | Déclaration |

## Cas concret : configuration de routes

```typescript
type Route = {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
};

const routes = {
  users: { path: '/api/users', method: 'GET' },
  createUser: { path: '/api/users', method: 'POST' },
} satisfies Record<string, Route>;

// routes.users.method est typé 'GET', pas string
// Autocomplétion parfaite dans tout le projet
```

> « Les types sont de la documentation qui ne ment jamais. » C'est une conviction que j'ai développée après 8 ans de JavaScript puis TypeScript. Le type system est mon premier filet de sécurité.

## Mon workflow à Toulon

Quand je refactore un projet TypeScript à Toulon, je commence par chercher tous les `as` avec un simple grep. Chaque `as` est un risque potentiel. Je les remplace un par un par `satisfies` quand c'est possible, ou par une vraie validation runtime (Zod) quand les données viennent de l'extérieur.

Pour voir comment j'applique TypeScript en production, consultez [mes projets](/projets), [mon approche React](/developpeur-react-toulon) ou [contactez-moi](/contact).
