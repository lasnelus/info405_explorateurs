# Backlog Agile – Priorisation centrée Inscriptions & Listes d’attente
## PRIORITÉ ABSOLUE – Cœur métier (MVP réel)

Objectif :
```
Faire tourner le moteur d’inscription,
même avec une auth très basique ou inexistante.
```
---
### EPIC 1 – Modélisation des groupes & capacités
#### US-1.1 – Créer un groupe

**En tant que** gestionnaire
**Je veux** créer un groupe avec une capacité maximale
**Afin de** limiter le nombre d’enfants inscrits

Critères
- Capacité numérique
- Tranche d’âge
- Période associée


#### US-1.2 – Définir les jours d’accueil

**En tant que** gestionnaire
**Je veux** définir les jours d’accueil par période
**Afin de** contrôler les inscriptions possibles

#### US-1.3 – Visualiser les places disponibles

**En tant que** utilisateur
**Je veux** voir les places restantes par jour et par groupe
**Afin de** comprendre mes chances d’inscription

### EPIC 2 – Enfants & fratries (sans notion de compte)

Important :
```
On considère les enfants comme entités métiers,
indépendantes de l’auth.
```

#### US-2.1 – Déclarer un enfant

**En tant que** utilisateur
**Je veux** déclarer un enfant
**Afin de** pouvoir l’inscrire

Données minimales
- Nom / prénom
- Date de naissance
- Identifiant fratrie (optionnel) (jsp)

#### US-2.2 – Déclarer une fratrie

**En tant que** système
**Je veux** relier plusieurs enfants
**Afin de** les prioriser ensemble

### EPIC 3 – Inscription directe
#### US-3.1 – Inscrire un enfant à un groupe

**En tant que** utilisateur
**Je veux** inscrire un enfant à un groupe sur des jours donnés
**Afin de** réserver une place

#### US-3.2 – Validation immédiate si place disponible

**En tant que** système
**Je veux** valider automatiquement l’inscription
Si la capacité n’est pas atteinte

> Pas de modération, pas d’admin, juste la règle

### EPIC 4 – Liste d’attente

> La partie la plus critique du projet

#### US-4.1 – Passage automatique en liste d’attente

**En tant que** système
**Je veux** placer une inscription en liste d’attente
Si le groupe est complet

Critères
- Liste liée à un groupe + jour
- Ordre initial chronologique

#### US-4.2 – Calcul du score de priorité

**En tant que** système
**Je veux** calculer un score
**Afin de** prioriser les demandes

Facteurs
- Fratrie déjà inscrite
- Nombre de jours demandés
- autre priorisation

#### US-4.3 – Classement dynamique

**En tant que** système
**Je veux** recalculer l’ordre
À chaque changement de capacité ou d’inscription

#### US-4.4 – Proposition automatique de place

**En tant que** système
**Je veux** proposer une place
Quand une place se libère

#### US-4.5 – Délai de réponse

**En tant que** système
**Je veux** appliquer un délai de réponse
Afin de libérer la place si nécessaire

#### US-4.6 – Réattribution automatique

**En tant que** système
**Je veux** attribuer la place au suivant
Si la proposition expire

### EPIC 5 – Conservation des fratries
#### US-5.1 – Inscription groupée

**En tant que** système
**Je veux** favoriser l’inscription conjointe des fratries
**Afin de** éviter les séparations

#### US-5.2 – Blocage partiel

**En tant que** système
**Je veux** favorisé la conservation des fratries dans la liste d'attentes.

### EPIC 6 – Visualisation & transparence
#### US-6.1 – Visualisation de l’état d’inscription

**En tant que** utilisateur
**Je veux** voir si l’enfant est inscrit ou en attente

#### US-6.2 – Visualisation des listes d’attente

**En tant que** gestionnaire
**Je veux** voir l’ordre et les scores
**Afin de** comprendre les décisions

## PRIORITÉ SECONDAIRE – Administration légère
### EPIC 7 – Actions manuelles

- Forcer une inscription
- Libérer une place
- Déplacer un enfant

## PRIORITÉ FAIBLE – Connexion & comptes

> volontairement repoussé

- Auth simple (lien magique / code)
- Comptes parents
- Permissions