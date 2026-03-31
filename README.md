# CloudVault - Plateforme de Stockage Cloud Self-Hosted

**CloudVault** est une plateforme de stockage cloud open source, auto-hébergée, offrant une alternative sécurisée et personnalisable à Google Drive ou Nextcloud. Le projet est conçu pour fonctionner sur une infrastructure privée avec orchestration Kubernetes.

---

## Vue d'ensemble

CloudVault permet aux utilisateurs de :
- Créer un compte personnel sécurisé
- Uploader des fichiers de n'importe quelle taille
- Télécharger leurs fichiers à distance via VPN
- Gérer leur espace de stockage (liste, suppression, organisation)
- Accéder à leurs données depuis n'importe où de manière sécurisée

### Philosophie du projet

Dans un contexte où la confidentialité des données devient cruciale et où les solutions cloud commerciales imposent des coûts récurrents élevés, CloudVault propose une approche différente : **vous possédez votre infrastructure, vous contrôlez vos données**.

---

## Architecture Technique

### Stack Technologique

**Backend :**
- **Go 1.21+** avec framework **Gin** (API REST)
- **PostgreSQL 15** (base de données relationnelle)
- **JWT** (authentification sécurisée)
- **Bcrypt** (hashage des mots de passe)

**Frontend :**
- **React 18** (Single Page Application)
- **Tailwind CSS** (styling moderne)
- **Axios** (requêtes HTTP)
- **React Router** (navigation)

**Infrastructure :**
- **Kubernetes K3s** (orchestration légère)
- **Docker** (conteneurisation)
- **NFS** (stockage distribué)
- **OpenVPN** (accès distant sécurisé)

**Virtualisation :**
- **Proxmox VE** (hyperviseur Type 1)
- **Debian 12** (système d'exploitation des VMs)

---

### Architecture Système

```
┌─────────────────────────────────────────────────────────┐
│                      INTERNET                           │
└──────────────────────┬──────────────────────────────────┘
                       │
                  ┌────▼─────┐
                  │   VPN    │ OpenVPN (port 1194 UDP)
                  │ Gateway  │ Accès sécurisé à distance
                  └────┬─────┘
                       │
        ┌──────────────┼─────────────┐
        │              │             │
   ┌────▼────┐    ┌────▼────┐   ┌────▼─────┐
   │ Firewall│    │ Switch  │   │ Storage  │
   │ pfSense │    │ Managed │   │ Server   │
   └────┬────┘    └────┬────┘   └────┬─────┘
        │              │             │
        └──────┬───────┴──────┬──────┘
               │              │
        ┌──────▼──────┐  ┌────▼──────────┐
        │ VLAN Admin  │  │ VLAN Serveurs │
        │ Management  │  │ Production    │
        └─────────────┘  └───┬───────────┘
                             │
                    ┌────────┼────────┐
                    │        │        │
               ┌────▼───┐┌───▼───┐┌───▼────┐
               │Hyperv. ││Storage││Network │
               │Proxmox ││NFS    ││Services│
               └───┬────┘└───────┘└────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
   ┌────▼───┐ ┌───▼────┐ ┌───▼────┐
   │K3s     │ │PostSQL │ │K3s     │
   │Master  │ │Server  │ │Worker  │
   └────────┘ └────────┘ └────────┘
```

---

### Infrastructure Kubernetes

```
┌─────────────────────────────────────────┐
│         Kubernetes K3s Cluster          │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  CloudVault API (Go)              │  │
│  │  - Replicas: 2                    │  │
│  │  - Port: 3000                     │  │
│  │  - Health checks: /health         │  │
│  └─────────────┬─────────────────────┘  │
│                │                        │
│  ┌─────────────▼─────────────────────┐  │
│  │  CloudVault Frontend (React)      │  │
│  │  - Replicas: 2                    │  │
│  │  - Port: 80                       │  │
│  │  - Nginx web server               │  │
│  └─────────────┬─────────────────────┘  │
│                │                        │
│  ┌─────────────▼─────────────────────┐  │
│  │  PersistentVolume (NFS)           │  │
│  │  - Capacity: 500Gi                │  │
│  │  - Access: ReadWriteMany          │  │
│  │  - Backend: NFS Storage Server    │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
          │                    │
          ▼                    ▼
   ┌─────────────┐      ┌─────────────┐
   │ PostgreSQL  │      │ NFS Storage │
   │ Database    │      │ Server      │
   │ - Users     │      │ - Files     │
   │ - Metadata  │      │ - Backups   │
   └─────────────┘      └─────────────┘
```

---

## Sécurité

### Authentification & Autorisation
- **JWT tokens** avec expiration configurable (24h par défaut)
- **Hashage bcrypt** des mots de passe (cost factor: 12)
- **Middleware d'authentification** sur toutes les routes protégées
- **Validation des inputs** pour prévenir les injections SQL

### Réseau
- **Segmentation VLAN** : séparation administration/production
- **Firewall pfSense** : règles strictes par interface
- **VPN OpenVPN** : accès distant chiffré (AES-256-CBC)
- **TLS/SSL** : certificats pour toutes les communications HTTPS

### Stockage
- **Isolation utilisateurs** : chaque utilisateur accède uniquement à ses fichiers
- **Métadonnées séparées** : stockage des fichiers (NFS) distinct de la base de données
- **Backups automatisés** : sauvegardes régulières de la base PostgreSQL

---

## Déploiement

### Prérequis Infrastructure

**Matériel :**
- Serveur de virtualisation (Proxmox VE 8+)
- Serveur de stockage avec support NFS
- Switch réseau manageable (VLANs)
- Firewall/routeur (pfSense recommandé)

**Logiciels :**
- Kubernetes K3s
- Docker Engine
- PostgreSQL 15+
- OpenVPN (pour accès distant)

### Machines Virtuelles

**3 VMs Debian 12 minimales :**

```
VM 1 : K3s-Master
├─ CPU    : 4 cores
├─ RAM    : 8 GB
├─ Disk   : 50 GB
└─ Role   : Kubernetes master node

VM 2 : PostgreSQL
├─ CPU    : 2 cores
├─ RAM    : 4 GB
├─ Disk   : 30 GB
└─ Role   : Database server

VM 3 : K3s-Worker (optionnel)
├─ CPU    : 4 cores
├─ RAM    : 8 GB
├─ Disk   : 50 GB
└─ Role   : Kubernetes worker node
```

---

## Structure du Projet

```
cloudvault/
├── backend/
│   ├── cmd/
│   │   └── server/
│   │       └── main.go 
│   ├── internal/
│   │   ├── config/
│   │   │   └── config.go
│   │   ├── database/
│   │   │   └── postgres.go
│   │   ├── domain/
│   │   │   ├── user.go
│   │   │   ├── file.go
│   │   │   └── errors.go
│   │   ├── repository/
│   │   │   └── *.go
│   │   ├── service/
│   │   │   ├── auth.service.go
│   │   │   └── file.service.go
│   │   ├── handler/
│   │   │   ├── auth.handler.go
│   │   │   └── file.handler.go
│   │   ├── middleware/
│   │   │   ├── auth.go
│   │   │   ├── cors.go
│   │   │   └── logger.go
│   │   └── router/
│   │       └── router.go
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── go.sum
│   └── go.mod
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   │   ├── *.svg
│   │   │   │   └── *.png
│   │   │   └── css/
│   │   │       └── *.css
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── *.jsx
│   │   │   ├── files/
│   │   │   │   └── *.jsx
│   │   │   ├── layout/
│   │   │   │   └── *.jsx
│   │   │   └── common/
│   │   │       └── *.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
│
├── k8s/
│   └── *.yaml
│
├── docs/
│   └── *.md
│
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## Performances

### Capacités

- **Utilisateurs simultanés** : 100+ (avec 2 replicas API)
- **Stockage** : Limité par le serveur NFS (plusieurs TB possibles)
- **Upload max** : 5 GB par fichier (configurable)
- **Débit** : Limité par la bande passante réseau

### Optimisations

- **Streaming de fichiers** : pas de chargement complet en mémoire
- **Connection pooling** : réutilisation des connexions PostgreSQL
- **Load balancing** : Kubernetes distribue la charge entre replicas
- **Caching** : Nginx cache les assets statiques du frontend

---

## ‍Auteur

**Corazzini Alain** - Projet Hub (1er Bachelor 2025)

---

## Remerciements

- [Gin Web Framework](https://github.com/gin-gonic/gin) - Framework Go
- [React](https://reactjs.org/) - Library frontend
- [K3s](https://k3s.io/) - Lightweight Kubernetes
- [PostgreSQL](https://www.postgresql.org/) - Base de données
- [OpenVPN](https://openvpn.net/) - Solution VPN
- [Roadmap.sh](https://roadmap.sh/) - L'apprentissage des différentes techno

---

## Support

Pour toute question ou problème :
- Ouvrir une [issue](https://github.com/Juyuroto/cloudvault/issues)
- Consulter la [documentation](./docs/)
- Contacter l'auteur : corazzinialain@gmail.com

---

**CloudVault** - *Vos données, votre infrastructure, votre contrôle.*