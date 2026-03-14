---
title: "Next.js Server Actions : 3 erreurs que j'ai commises"
description: "Retour d'expérience sur les Server Actions de Next.js. Depuis Toulon, je partage les pièges que j'ai rencontrés en production."
date: "2026-03-12"
tags: ["Next.js", "Full-stack", "Toulon"]
---

## Contexte

J'ai migré plusieurs projets vers les **Server Actions** de Next.js depuis le App Router. Chaque fois, j'ai appris quelque chose à la dure. Voici les 3 erreurs que je ne fais plus.

## Erreur 1 : ne pas valider côté serveur

Les Server Actions reçoivent un `FormData` brut. Sans validation, on s'expose à des injections.

```typescript
// Mauvais — aucune validation
async function createPost(formData: FormData) {
  'use server';
  const title = formData.get('title') as string;
  await db.insert({ title }); // injection possible
}

// Correct — validation avec Zod
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1).max(200).trim(),
});

async function createPost(formData: FormData) {
  'use server';
  const { title } = schema.parse({
    title: formData.get('title'),
  });
  await db.insert({ title });
}
```

## Erreur 2 : oublier revalidatePath

Après une mutation, le cache de Next.js garde l'ancienne donnée. Si on oublie `revalidatePath`, l'utilisateur ne voit pas son changement.

```typescript
import { revalidatePath } from 'next/cache';

async function deletePost(id: string) {
  'use server';
  await db.delete(id);
  revalidatePath('/posts'); // sans ça, la liste reste identique
}
```

## Erreur 3 : des actions trop lourdes

J'ai fait l'erreur de mettre toute la logique métier dans l'action. Résultat : des fichiers de 300 lignes impossibles à tester.

| Approche | Testabilité | Lisibilité | Maintenance |
|---|---|---|---|
| Tout dans l'action | Difficile (besoin de mock FormData) | Faible | Complexe |
| Action → Service → Repository | Unitaire sur chaque couche | Claire | Simple |
| Action avec validation Zod + service | Idéale | Excellente | Scalable |

La bonne architecture : l'action valide, appelle un service, et revalide le cache. Rien de plus.

> « Make it work, make it right, make it fast. » — Kent Beck. J'applique cette séquence à chaque Server Action. D'abord ça marche, ensuite je structure, enfin j'optimise.

## Ce que j'en retiens

Depuis mon bureau à Toulon, j'ai accompagné plusieurs équipes sur cette migration. Les Server Actions sont puissantes, mais elles demandent la même rigueur qu'une API REST classique.

Découvrez [mon expertise Next.js](/developpeur-nextjs-toulon), parcourez mes [projets livrés](/projets) ou [discutons de votre migration](/contact).
