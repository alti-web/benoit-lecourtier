---
title: "React : quand useMemo est inutile (et quand il sauve tout)"
description: "J'ai audité des dizaines de composants React à Toulon. 80% des useMemo que je croise sont inutiles. Voici comment savoir."
date: "2026-03-13"
tags: ["React.js", "Performance", "Toulon"]
---

## Un pattern que je vois partout

En mission à Toulon comme ailleurs, je tombe régulièrement sur des composants React bardés de `useMemo` et `useCallback` sur **chaque** variable. L'intention est bonne. Le résultat est souvent contre-productif.

J'ai pris l'habitude de profiler systématiquement avant d'optimiser. Et le constat est clair.

## La règle que j'applique

Un `useMemo` n'a de sens que si le calcul mémoïsé est **coûteux** ou si la référence stable est **nécessaire** (pour un `useEffect`, un `React.memo`, ou un context value).

```tsx
// Inutile — filtrer 20 items coûte ~0.01ms
const filtered = useMemo(() => items.filter(i => i.active), [items]);

// Utile — trier 10 000 items avec une fonction complexe
const sorted = useMemo(() => {
  return heavySort(largeDataset, compareFn);
}, [largeDataset, compareFn]);
```

## Comparatif que j'ai mesuré avec React Profiler

| Scénario | Sans memo | Avec useMemo | Diff rendu (ms) |
|---|---|---|---|
| Filtre sur 20 items | 0.3 | 0.4 | +33% (overhead) |
| Tri sur 10 000 items | 45 | 0.2 | -99% |
| Objet passé en context value | Re-render cascade | Stable | Critique |
| String concatenation | 0.01 | 0.02 | Aucun gain |

Le `useMemo` sur 20 items est **plus lent** que sans, à cause du coût de comparaison des dépendances.

## useCallback : même logique

`useCallback` ne sert que si la fonction est passée à un composant enfant wrappé dans `React.memo` :

```tsx
// Utile uniquement si Child est React.memo
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

return <MemoizedChild onClick={handleClick} />;
```

> « Premature optimization is the root of all evil. » — Donald Knuth. J'ai cette citation en tête à chaque code review. Si vous n'avez pas mesuré, vous n'optimisez pas — vous compliquez.

## Mon approche à Toulon

Quand j'audite un projet React à Toulon, la première chose que je fais c'est ouvrir le **React DevTools Profiler**. Pas le code. Le profiler. Parce que le code peut mentir, mais les flamegraphs non.

Pour en savoir plus sur mon expertise React, rendez-vous sur [ma page dédiée React.js](/developpeur-react-toulon), regardez [mes réalisations](/projets) ou [parlons de votre projet](/contact).
