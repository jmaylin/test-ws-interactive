# Test Ws Interactive
### Consigne
Sur une page Internet, réalisez une génération aléatoire de 500 cercles.
Chaque cercle (Cx) réalisé doit avoir son enfant (Cx’) placé par rapport à un point de symétrie au centre de l’écran (1000 cercles au total). À chaque fois qu’on ajoute un nouveau cercle (Cx) on augmente le ton de la couleur utilisée de 1. Chaque cercle enfant (Cx’) est de la même couleur que son parent (Cx).
À chaque clique sur la page, tous les cercles doivent tourner de 30° autour du curseur. Ajoutez une animation de déplacement.
##### Bonus
Modifiez l’effet du clic sur la page, pour que seulement les cercles dans un rayon de 200px tournent autour du curseur.
### Installation
Pour réaliser cet exercice, cloner le dépôt [Git] pour récupérer la base Webpack et utiliser [React] avec une architecture [Flux].
### Utilisation
```bash
# Start for development
npm run hot-dev-server

# Build
npm run production
```

[Git]: <https://github.com/davidmottet/test-ws-interactive>
[React]: <https://facebook.github.io/react/>
[Flux]: <https://facebook.github.io/flux/>