# CloudVault - Plateforme de Stockage Cloud Open Source

![Version](https://img.shields.io/badge/version-1.0-blue)
![Status](https://img.shields.io/badge/status-Production-green)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Installation Infrastructure](#installation-infrastructure)
- [Installation Application](#installation-application)
- [Déploiement Kubernetes](#déploiement-kubernetes)
- [Utilisation](#utilisation)
- [Troubleshooting](#troubleshooting)
- [Contribution](#contribution)

---

## 🎯 Vue d'ensemble

CloudVault est une plateforme de stockage en cloud open source permettant aux utilisateurs de :
- ✅ Créer un compte personnel sécurisé
- ✅ Uploader et télécharger des fichiers à distance
- ✅ Organiser ses fichiers dans une interface web intuitive
- ✅ Accéder à ses fichiers depuis n'importe où
- ✅ Gérer ses fichiers (supprimer, lister, etc.)

C'est une alternative open source à Google Drive ou Nextcloud, déployée sur une infrastructure cloud personnelle.

---

## 🏗️ Architecture

### Diagramme Infrastructure

```
┌─────────────────────────────────────────────────────────┐
│                    Internet / Utilisateurs              │
└──────────────────────────┬────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │ Load Balancer│
                    │  (HAProxy)   │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼───┐        ┌────▼────┐      ┌─────▼────┐
   │API Pod 1│        │API Pod 2│      │Frontend  │
   │Node.js  │        │Node.js  │      │React     │
   └────┬───┘        └────┬────┘      └─────┬────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                    Kubernetes K3s
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌────▼────┐    ┌──────▼──────┐   ┌─────▼──────┐
   │PostgreSQL│    │TrueNAS (NFS)│   │Prometheus  │
   │Métadonnées   │Stockage      │   │Monitoring  │
   └──────────┘    └──────────────┘   └────────────┘
```

### Stack Technologique

**Infrastructure :**
- Proxmox (hyperviseur de virtualisation)
- Kubernetes K3s (orchestration conteneurs)
- Docker (conteneurisation)
- TrueNAS (stockage distribué)

**Backend :**
- Node.js 18+
- Express.js
- PostgreSQL 15+
- JWT (authentification)
- Multer (upload fichiers)

**Frontend :**
- React 18
- Axios (requêtes HTTP)
- React Router (navigation)
- TailwindCSS (styling)

**DevOps :**
- Kubernetes YAML
- Docker
- Prometheus + Grafana (monitoring optionnel)

---

## ✨ Fonctionnalités

### Actuelles (MVP)

- ✅ **Authentification**
  - Création de compte (register)
  - Connexion sécurisée (login)
  - Tokens JWT pour sessions

- ✅ **Gestion Fichiers**
  - Upload de fichiers
  - Téléchargement de fichiers
  - Liste des fichiers personnels
  - Suppression de fichiers
  - Métadonnées (nom, taille, date)

- ✅ **Interface Web**
  - Dashboard utilisateur
  - Formulaires login/register
  - Gestion des fichiers graphique
  - Design responsive

- ✅ **Infrastructure**
  - Déploiement Kubernetes
  - Stockage persistant NFS
  - Base de données PostgreSQL
  - Monitoring basique

### Futures Améliorations

- 🔜 Partage de fichiers
- 🔜 Versioning des fichiers
- 🔜 Chiffrement end-to-end
- 🔜 Application mobile
- 🔜 API publique
- 🔜 Intégration OAuth2
- 🔜 Auto-scaling avancé

---

## 📋 Prérequis

### Matériel

- **Serveur de calcul** : 4+ CPU, 8GB+ RAM (pour Proxmox + K3s)
- **Serveur de stockage** : 2+ CPU, 4GB RAM, 500GB+ stockage (pour TrueNAS)
- **Switch réseau** : pour connecter les serveurs
- **PC administrateur** : pour développement et gestion

### Logiciels

- **Proxmox 8.0+** : déjà installé sur serveur de calcul
- **TrueNAS** : déjà installé sur serveur de stockage
- **Kubernetes K3s** : sera installé dans les VMs
- **Docker** : sera installé dans les VMs
- **Node.js 18+** : sur PC admin pour développement
- **Git** : pour versionner le code

---

## 🚀 Installation Infrastructure

### Étape 1 : Configurer TrueNAS

1. **Accéder à l'interface TrueNAS**
   ```
   http://IP-TRUENAS:8000
   ```

2. **Créer un dataset CloudVault**
   - Storage → Datasets
   - Create Dataset : `cloudvault`
   - Confirmer

3. **Configurer le partage NFS**
   - Storage → Datasets → cloudvault
   - Partages → NFS
   - Create NFS Share
   - Path : `/mnt/pool/cloudvault`
   - Note l'IP TrueNAS et le chemin

### Étape 2 : Créer les VMs dans Proxmox

1. **Créer VM K3s-Master**
   ```
   - CPU : 4 cores
   - RAM : 8GB
   - Storage : 50GB
   - OS : Debian 12
   - IP : 192.168.1.100
   ```

2. **Créer VM PostgreSQL**
   ```
   - CPU : 2 cores
   - RAM : 4GB
   - Storage : 30GB
   - OS : Debian 12
   - IP : 192.168.1.101
   ```

3. **Créer VM K3s-Worker (optionnel)**
   ```
   - CPU : 4 cores
   - RAM : 8GB
   - Storage : 50GB
   - OS : Debian 12
   - IP : 192.168.1.102
   ```

### Étape 3 : Installer K3s

**Sur VM K3s-Master :**

```bash
# Se connecter à la VM
ssh root@192.168.1.100

# Installer K3s
curl -sfL https://get.k3s.io | sh -

# Récupérer le token (noté pour les workers)
cat /var/lib/rancher/k3s/server/node-token
```

**Sur VM K3s-Worker (si vous en avez) :**

```bash
ssh root@192.168.1.102

curl -sfL https://get.k3s.io | K3S_URL=https://192.168.1.100:6443 \
  K3S_TOKEN=votre-token-ici sh -
```

### Étape 4 : Configurer le Stockage NFS dans K3s

Sur VM K3s-Master, créer `nfs-storage.yaml` :

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: cloudvault-storage
spec:
  capacity:
    storage: 500Gi
  accessModes:
    - ReadWriteMany
  nfs:
    server: 192.168.1.10
    path: "/mnt/pool/cloudvault"

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: cloudvault-pvc
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 500Gi
  volumeName: cloudvault-storage
```

Appliquer :

```bash
kubectl apply -f nfs-storage.yaml
kubectl get pv,pvc
```

### Étape 5 : Installer PostgreSQL

**Sur VM PostgreSQL :**

```bash
ssh root@192.168.1.101

# Installer PostgreSQL
apt update
apt install postgresql postgresql-contrib -y

# Créer la base de données
sudo -u postgres psql << EOF
CREATE DATABASE cloudvault;
\c cloudvault

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  filepath VARCHAR(255) NOT NULL,
  file_size BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EOF

# Autoriser les connexions distantes
echo "host    cloudvault    all    192.168.1.0/24    md5" >> /etc/postgresql/15/main/pg_hba.conf
systemctl restart postgresql
```

---

## 💻 Installation Application

### Sur ton PC Admin

### Étape 1 : Cloner/Créer le Backend

```bash
git clone https://github.com/tonusername/cloudvault-api.git
cd cloudvault-api

# Ou créer de zéro
mkdir cloudvault-api && cd cloudvault-api
npm init -y
npm install express pg bcryptjs jsonwebtoken cors multer dotenv
npm install --save-dev nodemon
```

Structure du projet :

```
cloudvault-api/
├── src/
│   ├── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── files.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── filesController.js
│   └── middleware/
│       └── auth.js
├── .env
├── Dockerfile
└── package.json
```

Fichier `.env` :

```
DATABASE_URL=postgresql://postgres:password@192.168.1.101:5432/cloudvault
JWT_SECRET=votre-secret-tres-securise
STORAGE_PATH=/app/files
NODE_ENV=production
PORT=3000
```

### Étape 2 : Cloner/Créer le Frontend

```bash
npx create-react-app cloudvault-frontend
cd cloudvault-frontend
npm install axios react-router-dom
```

Structure :

```
cloudvault-frontend/
├── src/
│   ├── components/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   └── FileList.js
│   ├── services/
│   │   └── api.js
│   └── App.js
├── Dockerfile
└── package.json
```

Fichier `src/services/api.js` :

```javascript
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const registerUser = (username, email, password) => {
  return axios.post(`${API_BASE}/auth/register`, { username, email, password });
};

export const loginUser = (email, password) => {
  return axios.post(`${API_BASE}/auth/login`, { email, password });
};

export const getFiles = (token) => {
  return axios.get(`${API_BASE}/files`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const uploadFile = (file, token) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_BASE}/files/upload`, formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteFile = (fileId, token) => {
  return axios.delete(`${API_BASE}/files/${fileId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
```

---

## 🐳 Déploiement Kubernetes

### Étape 1 : Créer les Dockerfiles

**cloudvault-api/Dockerfile :**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 3000
CMD ["node", "src/index.js"]
```

**cloudvault-frontend/Dockerfile :**

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Étape 2 : Construire et Pousser les Images

```bash
# Build API
cd cloudvault-api
docker build -t monusername/cloudvault-api:1.0 .

# Build Frontend
cd ../cloudvault-frontend
docker build -t monusername/cloudvault-frontend:1.0 .

# Push sur Docker Hub (ou registre privé)
docker login
docker push monusername/cloudvault-api:1.0
docker push monusername/cloudvault-frontend:1.0
```

### Étape 3 : Créer le Deployment Kubernetes

Fichier `deployment.yaml` :

```yaml
---
# API Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cloudvault-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cloudvault-api
  template:
    metadata:
      labels:
        app: cloudvault-api
    spec:
      containers:
      - name: api
        image: monusername/cloudvault-api:1.0
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          value: "postgresql://postgres:password@192.168.1.101:5432/cloudvault"
        - name: JWT_SECRET
          value: "votre-secret-tres-securise"
        - name: STORAGE_PATH
          value: "/app/files"
        volumeMounts:
        - name: storage
          mountPath: /app/files
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
      volumes:
      - name: storage
        persistentVolumeClaim:
          claimName: cloudvault-pvc

---
# API Service
apiVersion: v1
kind: Service
metadata:
  name: cloudvault-api-service
spec:
  selector:
    app: cloudvault-api
  ports:
  - protocol: TCP
    port: 3000
    targetPort: 3000
  type: LoadBalancer

---
# Frontend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cloudvault-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cloudvault-frontend
  template:
    metadata:
      labels:
        app: cloudvault-frontend
    spec:
      containers:
      - name: frontend
        image: monusername/cloudvault-frontend:1.0
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "250m"

---
# Frontend Service
apiVersion: v1
kind: Service
metadata:
  name: cloudvault-frontend-service
spec:
  selector:
    app: cloudvault-frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
```

### Étape 4 : Déployer

```bash
# Copier deployment.yaml sur VM K3s-Master
scp deployment.yaml root@192.168.1.100:/root/

# SSH sur Master et déployer
ssh root@192.168.1.100
kubectl apply -f deployment.yaml

# Vérifier le déploiement
kubectl get pods
kubectl get services
```

---

## 🎮 Utilisation

### Accéder à CloudVault

Une fois déployé :

```
Frontend  : http://IP-LOADBALANCER
API       : http://IP-LOADBALANCER:3000
```

Récupérer l'IP du LoadBalancer :

```bash
kubectl get services
```

### Workflow Utilisateur

1. **S'inscrire**
   - Aller sur le frontend
   - Cliquer "Register"
   - Entrer username, email, password
   - Compte créé

2. **Se connecter**
   - Entrer email et password
   - Obtenir un token JWT
   - Redirection vers dashboard

3. **Uploader des fichiers**
   - Sélectionner des fichiers
   - Cliquer "Upload"
   - Fichiers sauvegardés sur TrueNAS

4. **Télécharger des fichiers**
   - Cliquer sur le fichier dans la liste
   - Fichier téléchargé sur l'ordinateur

5. **Supprimer des fichiers**
   - Cliquer le bouton "Supprimer"
   - Fichier supprimé du stockage et BDD

---

## 🛠️ Troubleshooting

### Kubernetes

**Les pods ne démarrent pas :**

```bash
kubectl describe pod cloudvault-api-xxxxx
kubectl logs cloudvault-api-xxxxx
```

**Stockage NFS non monté :**

```bash
kubectl get pv,pvc
# Vérifier que le PersistentVolume et Claim existent
```

### Application

**Erreur de connexion à PostgreSQL :**

```bash
# Vérifier que PostgreSQL écoute
ssh root@192.168.1.101
psql -U postgres -d cloudvault -c "SELECT 1"
```

**Fichiers non sauvegardés :**

```bash
# Vérifier le montage NFS
df -h | grep cloudvault
ls -la /app/files
```

### Docker Images

**Image non trouvée :**

```bash
# Vérifier que l'image est poussée
docker images | grep cloudvault
# Ou sur Docker Hub
```

---

## 📊 Monitoring (Optionnel)

Pour ajouter du monitoring avec Prometheus + Grafana :

```bash
# Installer Prometheus
kubectl apply -f prometheus-deployment.yaml

# Accéder aux dashboards
http://IP-LOADBALANCER:9090  (Prometheus)
http://IP-LOADBALANCER:3000  (Grafana)
```

---

## 📝 Contribution

Pour contribuer au projet :

```bash
git clone https://github.com/tonusername/cloudvault.git
git checkout -b feature/nouvelle-feature
# Faire les changements
git commit -m "Ajouter nouvelle feature"
git push origin feature/nouvelle-feature
# Créer une Pull Request
```

---

## 📄 License

Ce projet est sous license MIT. Voir `LICENSE` pour plus de détails.

---

## 📧 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter : ton-email@example.com

---

## 🎓 Crédits

Projet créé comme démonstration d'infrastructure cloud moderne avec Kubernetes, Docker, PostgreSQL et TrueNAS.
