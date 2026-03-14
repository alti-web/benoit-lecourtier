---
title: "Tailwind CSS : l'astuce clsx + twMerge que j'utilise partout"
description: "Comment je gère les classes Tailwind conditionnelles sans conflit à Toulon. Un pattern simple qui évite beaucoup de bugs CSS."
date: "2026-03-10"
tags: ["Tailwind CSS", "CSS", "Toulon"]
---

## Le problème que tout le monde rencontre

Quand on construit un composant React avec Tailwind, on finit toujours par avoir des classes conditionnelles. Et très vite, on tombe sur un bug classique : **deux classes Tailwind qui se contredisent**.

```tsx
// Bug : bg-red-500 et bg-blue-500 sont tous les deux appliqués
<div className={`bg-blue-500 ${isError ? 'bg-red-500' : ''}`}>
```

Tailwind ne « remplace » pas une classe par une autre. L'ordre dans le CSS compilé décide. Et cet ordre est **imprévisible**.

## La solution : `cn()` avec `tailwind-merge`

J'utilise cette fonction utilitaire dans **tous** mes projets à Toulon :

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`clsx` gère les conditions, `twMerge` résout les conflits :

```tsx
cn('bg-blue-500', isError && 'bg-red-500')
// Si isError: "bg-red-500" (blue supprimé)
// Sinon: "bg-blue-500"
```

## Comparatif des approches

| Méthode | Gère les conditions | Résout les conflits | Taille (KB) | Recommandée |
|---|---|---|---|---|
| Template literals | Oui (manuel) | Non | 0 | Non |
| `clsx` seul | Oui | Non | 0.5 | Partiel |
| `cn` (clsx + twMerge) | Oui | Oui | 3.2 | Oui |
| `cva` (class-variance-authority) | Oui (variants) | Oui (avec twMerge) | 5.1 | Pour design systems |

## Pattern avancé : les variants

Pour un composant avec plusieurs variantes, je combine `cn` avec un objet de config :

```typescript
const buttonVariants = {
  primary: 'bg-blue-500 text-white hover:bg-blue-400',
  danger: 'bg-red-500 text-white hover:bg-red-400',
  ghost: 'bg-transparent text-gray-400 hover:bg-gray-800',
} as const;

type ButtonProps = {
  variant?: keyof typeof buttonVariants;
  className?: string;
};

function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants[variant], className)} {...props} />
  );
}
```

Le `className` passé en prop **écrase** proprement les classes par défaut grâce à `twMerge`.

> « Le meilleur code est celui qu'on n'a pas à débugger. » Je trouve que cette fonction `cn` illustre parfaitement cette idée : 3 lignes qui éliminent toute une catégorie de bugs CSS.

## En pratique à Toulon

C'est un des premiers fichiers que je crée quand je démarre un nouveau projet Tailwind. Que ce soit pour un site Astro, une app React ou un projet Next.js, ce pattern me fait gagner un temps considérable.

Découvrez [comment j'utilise Tailwind avec Astro](/developpeur-astro-toulon), mes [réalisations](/projets) ou [parlons de votre projet](/contact).
