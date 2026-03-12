# NexTicket · Générateur de tickets QR code

Application web progressive (PWA) permettant de générer des tickets personnalisés avec QR codes sécurisés.  
Idéal pour les événements, concerts, festivals ou toute occasion nécessitant des billets numériques.

## Fonctionnalités

- **Génération unique ou en lot** : jusqu'à 50 tickets par lot.
- **Extraction automatique de l'ID** depuis le nom du fichier QR (format `(ID-123)` ou `Id-123`).
- **Personnalisation complète du ticket** : titre, dates, lieu, type, statut, prix.
- **Aperçu en temps réel** des modifications.
- **Statistiques détaillées** : nombre de tickets générés, montant total, répartition par statut.
- **Stockage local IndexedDB** : toutes les opérations sont sauvegardées.
- **Export des données** au format JSON.
- **Téléchargement des tickets** :
  - En JPG pour un ticket unique.
  - En archive ZIP pour un lot.
- **Effet de confettis** après chaque téléchargement réussi.
- **Interface responsive** et menu latéral adapté aux mobiles.

## Technologies utilisées

- HTML5 / CSS3
- JavaScript (ES6 modules)
- [IndexedDB](https://developer.mozilla.org/fr/docs/Web/API/IndexedDB_API) pour le stockage local
- [html2canvas](https://html2canvas.hertzen.com/) pour la capture d'écran du ticket
- [JSZip](https://stuk.github.io/jszip/) et [FileSaver.js](https://github.com/eligrey/FileSaver.js/) pour la génération et le téléchargement d'archives ZIP
- [Chart.js](https://www.chartjs.org/) pour les graphiques statistiques
- [canvas-confetti](https://github.com/catdad/canvas-confetti) pour les animations de succès
- [Font Awesome](https://fontawesome.com/) pour les icônes
- [Google Fonts](https://fonts.google.com/) (Poppins, Montserrat)

## Installation

1. **Cloner le dépôt** (ou télécharger les fichiers) :
   ```bash
   git clone https://github.com/votre-compte/nexticket.git