# CloudVault - Guide Complet d'Installation et d'Architecture

## Qu'est-ce que CloudVault ?

CloudVault est une plateforme de stockage en cloud open source. Les utilisateurs peuvent :
- Créer un compte personnel
- Uploader des fichiers
- Télécharger leurs fichiers de n'importe où
- Supprimer et gérer leurs fichiers

C'est comme **Google Drive ou Nextcloud**, mais hébergé sur **ta propre infrastructure**.

---

## Architecture du Système

```
┌────────────────────────────────────────────────────────────────┐
│                        INTERNET                                │
└────────────────────────┬───────────────────────────────────────┘
                         │
                    ┌────▼────┐
                    │ Routeur │
                    │ Réseau  │
                    └────┬────┘
                         │
        ┌────────────────┼──────────────┐
        │                │              │
   ┌────▼────┐      ┌────▼────┐    ┌────▼────┐
   │   PC    │      │ Proxmox │    │ TrueNAS │
   │ Admin   │      │ Serveur │    │ Stockage│
   │ (Dev)   │      │ Calcul  │    │         │
   └────┬────┘      └───┬─────┘    └────┬────┘
        │               │               │
        │        ┌──────┼──────┐        │
        │        │      │      │        │
    ┌───▼──┐  ┌──▼─┐ ┌──▼─┐ ┌──▼─┐      │
    │ Code │  │K3s │ │K3s │ │PG  │      │
    │React │  │Mas │ │Wor │ │SQL │      │
    │Node  │  │ter │ │ker │ │    │      │
    └──────┘  └──┬─┘ └──┬─┘ └──┬─┘      │
                 │      │      │        │
                 └──────┼──────┼────────┤
                        │      │        │
              ┌─────────▼──────▼───┐    │
              │   Kubernetes K3s   │    │
              │  ┌──────────────┐  │    │
              │  │ API Pods     │  │    │
              │  │ (x2 replicas)│  │    │
              │  │ Frontend Pod │  │    │
              │  └──────────────┘  │    │
              │  ┌────────────┐    │    │
              │  │ Persistent │    │    │
              │  │ Volume NFS │────┼────┤
              │  └────────────┘    │    │
              └────────────────────┘    │
                                        │
                            ┌───────────▼──────┐
                            │ TrueNAS Stockage │
                            │ - Partage NFS    │
                            │ - Fichiers users │
                            │ - Backup         │
                            └──────────────────┘
```

### Comment ça marche ?

1. **L'utilisateur** accède au frontend React via son navigateur
2. **L'utilisateur** se connecte ou crée un compte
3. **L'utilisateur** upload un fichier
4. **Le frontend** envoie le fichier à l'API Node.js
5. **L'API** vérifie l'authentification (JWT token)
6. **L'API** sauvegarde le fichier sur TrueNAS via NFS
7. **L'API** enregistre les métadonnées dans PostgreSQL
8. **L'API** retourne une confirmation
9. **Le fichier** est maintenant stocké en sécurité

---

## Technologies Utilisées

**Infrastructure :**
- **Proxmox** : hyperviseur pour créer les VMs
- **Kubernetes K3s** : orchestre les conteneurs
- **Docker** : conteneurise les applications
- **TrueNAS** : stockage distribué via NFS

**Développement :**
- **Backend** : Node.js + Express (JavaScript)
- **Frontend** : React 18 (JavaScript/JSX)
- **Base de Données** : PostgreSQL (SQL)
- **Authentification** : JWT (tokens sécurisés)
- **Stockage Fichiers** : NFS via TrueNAS

**Langages que tu vas utiliser :**
```
├─ JavaScript   : pour l'API Node.js et le Frontend React
├─ JSX          : pour les composants React
├─ SQL          : pour PostgreSQL
├─ YAML         : pour les configurations Kubernetes et Docker
└─ Bash         : pour les scripts de déploiement
```

---

## Ce Que Tu Dois Avoir

### Matériel

- **Serveur Proxmox** : déjà installé ✅
- **Serveur TrueNAS** : pour le stockage ✅
- **PC Admin** : ton ordinateur pour développer
- **Switch Réseau** : pour connecter tout ça

### Logiciels sur PC Admin

```bash
Node.js 18+       # pour développer l'API et frontend
npm               # gestionnaire de paquets (vient avec Node.js)
Docker            # pour créer les images
Git               # pour versionner le code
```

**Installation :**

- **Node.js** : télécharger sur https://nodejs.org (version LTS)
- **Docker** : télécharger sur https://docker.com
- **Git** : télécharger sur https://git-scm.com

---

## Installation Complète

### ÉTAPE 0 : Vérifier le Réseau

Assurez-vous que :
- [ ] Votre réseau local est bien en 192.168.11.0/24
- [ ] La plage 192.168.11.100-102 est libre (pas d'autres appareils)
- [ ] Vous pouvez pinguer 192.168.11.10 (TrueNAS) depuis votre PC
- [ ] Votre PC admin peut accéder à Proxmox

**Test rapide :**
```bash
# Depuis votre PC
ping 192.168.11.10  # TrueNAS
ping 192.168.11.1   # Gateway (votre routeur)
```

Si les pings fonctionnent, vous pouvez continuer.

---

### ÉTAPE 1 : Vérifier TrueNAS

Tu dois avoir TrueNAS avec :

```
Dataset créé : /mnt/pool/cloudvault
Partage NFS configuré
IP : 192.168.11.10
```

**Pour créer le dataset et le partage NFS sur TrueNAS :**

1. Se connecter à l'interface TrueNAS : http://192.168.11.10
2. Aller dans **Storage** → **Pools**
3. Créer un dataset nommé `cloudvault`
4. Aller dans **Sharing** → **Unix Shares (NFS)**
5. Créer un partage NFS :
   - Path : `/mnt/pool/cloudvault`
   - Authorized Networks : `192.168.11.0/24`
   - Mapall User : `root`
   - Mapall Group : `wheel`

---

### ÉTAPE 2 : Créer les VMs dans Proxmox

Tu dois créer **3 machines virtuelles** dans Proxmox.

#### VM 1 : K3s-Master

C'est le serveur principal qui orchestre tout (Kubernetes).

```
Accéder à Proxmox : https://IP-PROXMOX:8006

Créer la VM :
├─ Name           : k3s-master
├─ VM ID          : 100
├─ Memory         : 8192 MB (8 GB)
├─ Cores          : 4
├─ Disk           : 50 GB
├─ OS             : Debian 12 (télécharger ISO)
└─ Network        : Bridged

Installer Debian avec configuration réseau :
├─ IP             : 192.168.11.100/24
├─ Gateway        : 192.168.11.1
└─ DNS            : 8.8.8.8
```

#### VM 2 : PostgreSQL

C'est le serveur de base de données.

```
Créer la VM :
├─ Name           : postgresql
├─ VM ID          : 101
├─ Memory         : 4096 MB (4 GB)
├─ Cores          : 2
├─ Disk           : 30 GB
├─ OS             : Debian 12
└─ Network        : Bridged

Installer Debian avec configuration réseau :
├─ IP             : 192.168.11.101/24
├─ Gateway        : 192.168.11.1
└─ DNS            : 8.8.8.8
```

#### VM 3 : K3s-Worker (OPTIONNEL)

Ça peut servir à scaler si tu as beaucoup de charge.

```
Créer la VM :
├─ Name           : k3s-worker
├─ VM ID          : 102
├─ Memory         : 8192 MB (8 GB)
├─ Cores          : 4
├─ Disk           : 50 GB
├─ OS             : Debian 12
└─ Network        : Bridged

Installer Debian avec configuration réseau :
├─ IP             : 192.168.11.102/24
├─ Gateway        : 192.168.11.1
└─ DNS            : 8.8.8.8
```

---

### ÉTAPE 3 : Installer K3s sur K3s-Master

K3s est une version légère de Kubernetes.

```bash
# Se connecter à la VM
ssh root@192.168.11.100

# Mettre à jour Debian
apt update && apt upgrade -y

# Installer les outils NFS (REQUIS pour monter les volumes NFS)
apt install nfs-common -y

# Installer K3s (prend 2-3 minutes)
curl -sfL https://get.k3s.io | sh -

# Attendre que ça démarre
sleep 120

# Vérifier que K3s fonctionne
kubectl get nodes

# Tu devrais voir :
# NAME         STATUS   ROLES                  AGE
# k3s-master   Ready    control-plane,master   2m

# Récupérer le TOKEN (tu en auras besoin si tu crées un worker)
cat /var/lib/rancher/k3s/server/node-token

# IMPORTANT : copier ce token quelque part, tu en auras besoin !
```

---

### ÉTAPE 4 : Installer K3s-Worker (SI TU LE CRÉES)

```bash
# Se connecter à la VM worker
ssh root@192.168.11.102

# Mettre à jour Debian
apt update && apt upgrade -y

# Installer les outils NFS
apt install nfs-common -y

# Installer K3s en mode worker
# Remplacer TOKEN par ce que tu as copié à l'étape 3
curl -sfL https://get.k3s.io | \
  K3S_URL=https://192.168.11.100:6443 \
  K3S_TOKEN=K1234567890abc... sh -

# Vérifier sur le master que le worker est connecté
ssh root@192.168.11.100
kubectl get nodes

# Tu devrais voir :
# NAME         STATUS   ROLES                  AGE
# k3s-master   Ready    control-plane,master   10m
# k3s-worker   Ready    <none>                 2m
```

---

### ÉTAPE 5 : Installer PostgreSQL

PostgreSQL est la base de données pour stocker les utilisateurs et les métadonnées.

```bash
# Se connecter à la VM PostgreSQL
ssh root@192.168.11.101

# Mettre à jour Debian
apt update && apt upgrade -y

# Installer PostgreSQL
apt install postgresql postgresql-contrib -y

# Vérifier que c'est actif
systemctl status postgresql

# Définir un mot de passe pour l'utilisateur postgres
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'VotreMotDePasseSecurise';"

# IMPORTANT : noter ce mot de passe quelque part !

# Trouver la version PostgreSQL installée
PG_VERSION=$(ls /etc/postgresql/)

# Modifier postgresql.conf pour écouter sur toutes les interfaces
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/$PG_VERSION/main/postgresql.conf

# Autoriser les connexions distantes depuis le réseau K3s
echo "host    cloudvault    postgres    192.168.11.0/24    md5" >> /etc/postgresql/$PG_VERSION/main/pg_hba.conf

# Redémarrer PostgreSQL
systemctl restart postgresql

# Vérifier qu'il écoute sur toutes les interfaces
ss -tlnp | grep 5432
# Tu devrais voir : tcp  0 0 0.0.0.0:5432  LISTEN

# Tester la connexion depuis le master K3s
ssh root@192.168.11.100
apt install postgresql-client -y
psql -h 192.168.11.101 -U postgres -d cloudvault -c "\dt"
# Si tu vois les tables "users" et "files", c'est bon !
```

---

### ÉTAPE 6 : Configurer le Stockage NFS dans Kubernetes

Kubernetes doit savoir comment accéder à TrueNAS.

```bash
# Se connecter au master
ssh root@192.168.11.100

# Tester manuellement le montage NFS (optionnel mais recommandé)
mkdir -p /mnt/test-nfs
mount -t nfs 192.168.11.10:/mnt/pool/cloudvault /mnt/test-nfs
ls -la /mnt/test-nfs
# Si tu vois des fichiers ou un dossier vide, c'est bon !
umount /mnt/test-nfs

# Créer le fichier de configuration du stockage
cat > nfs-storage.yaml << 'EOF'
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
    server: 192.168.11.10
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
EOF

# Appliquer cette configuration à Kubernetes
kubectl apply -f nfs-storage.yaml

# Vérifier que ça fonctionne
kubectl get pv,pvc

# Tu devrais voir :
# NAME                                  CAPACITY   STATUS   CLAIM
# persistentvolume/cloudvault-storage   500Gi      Bound    default/cloudvault-pvc
#
# NAME                                    STATUS   VOLUME
# persistentvolumeclaim/cloudvault-pvc    Bound    cloudvault-storage
```

---

### ÉTAPE 7 : Créer les Secrets Kubernetes

Avant de déployer les applications, créer les secrets pour ne pas exposer les mots de passe.

```bash
# Se connecter au master
ssh root@192.168.11.100

# Créer le secret pour PostgreSQL et JWT
kubectl create secret generic cloudvault-secrets \
  --from-literal=db-password='VotreMotDePassePostgreSQL' \
  --from-literal=jwt-secret=$(openssl rand -base64 32)

# Vérifier
kubectl get secrets

# Tu devrais voir :
# NAME                  TYPE     DATA   AGE
# cloudvault-secrets    Opaque   2      10s
```

---

## Prochaines Étapes (Développement)

Une fois l'infrastructure prête, tu dois :

### 1. Développer l'API Node.js (JavaScript - sur ton PC)

- Routes d'authentification (login/register)
- Routes de fichiers (upload/download/delete)
- Connexion à PostgreSQL
- Packages : express, pg, bcryptjs, jsonwebtoken, multer

### 2. Développer le Frontend React (JavaScript/JSX - sur ton PC)

- Pages de login/register
- Dashboard avec liste des fichiers
- Formulaire d'upload
- Packages : react, axios, react-router-dom

### 3. Créer les Dockerfiles (Docker)

- Dockerfile pour l'API Node.js
- Dockerfile pour le Frontend React

### 4. Construire les images Docker

```bash
# Se placer dans le dossier de l'API
cd cloudvault-api
docker build -t tonusername/cloudvault-api:1.0 .

# Se placer dans le dossier du Frontend
cd ../cloudvault-frontend
docker build -t tonusername/cloudvault-frontend:1.0 .
```

### 5. Pousser sur Docker Hub

```bash
docker login
docker push tonusername/cloudvault-api:1.0
docker push tonusername/cloudvault-frontend:1.0
```

### 6. Déployer dans Kubernetes (YAML)

- Créer un fichier `deployment.yaml`
- `kubectl apply -f deployment.yaml`
- Accéder à CloudVault !

---

## Résumé de la Configuration

```
Adresses IP à retenir :
├─ K3s-Master      : 192.168.11.100 (IP FIXE OBLIGATOIRE)
├─ PostgreSQL      : 192.168.11.101 (IP FIXE OBLIGATOIRE)
├─ K3s-Worker      : 192.168.11.102 (IP FIXE OBLIGATOIRE) - optionnel
├─ TrueNAS         : 192.168.11.10  (IP FIXE OBLIGATOIRE)
└─ PC Admin        : DHCP OK ✅

Base de données PostgreSQL :
├─ Host       : 192.168.11.101
├─ Port       : 5432
├─ Database   : cloudvault
├─ User       : postgres
└─ Password   : (défini lors de l'installation - ÉTAPE 5)

Stockage TrueNAS :
├─ Server   : 192.168.11.10
├─ Path     : /mnt/pool/cloudvault
└─ Type     : NFS

Kubernetes K3s :
├─ Master     : 192.168.11.100
├─ Worker     : 192.168.11.102 (optionnel)
└─ Stockage   : Persistent Volume avec NFS

Secrets Kubernetes :
├─ db-password  : mot de passe PostgreSQL
└─ jwt-secret   : secret pour les tokens JWT
```

## IMPORTANT - Configuration IP :

Toutes les machines de l'infrastructure DOIVENT avoir une IP fixe configurée directement dans le système (pas via DHCP avec réservation). Lors de l'installation de Debian sur chaque VM, configurez manuellement l'IP statique.
Si une IP change, l'infrastructure entière cesse de fonctionner !

---

## Checklist d'Installation

- [ ] TrueNAS avec partage NFS configuré
- [ ] Réseau vérifié (ping TrueNAS, gateway)
- [ ] VM K3s-Master créée et Debian installé
- [ ] VM PostgreSQL créée et Debian installé
- [ ] VM K3s-Worker créée (optionnel)
- [ ] K3s installé sur K3s-Master
- [ ] nfs-common installé sur K3s-Master
- [ ] K3s installé sur K3s-Worker (si créé)
- [ ] PostgreSQL installé et base créée
- [ ] Tables users et files créées
- [ ] PostgreSQL écoute sur 0.0.0.0:5432
- [ ] Connexion PostgreSQL testée depuis K3s-Master
- [ ] Montage NFS testé manuellement
- [ ] Stockage NFS configuré dans Kubernetes
- [ ] kubectl get pv,pvc montre "Bound"
- [ ] Secrets Kubernetes créés

Une fois tout ça complété, l'infrastructure est **prête pour le déploiement** !

---

## Support et Vérification

Pour vérifier que tout fonctionne :

```bash
# Vérifier les VMs Proxmox
# → Aller dans l'interface Proxmox, vérifier que toutes les VMs tournent

# Vérifier K3s
ssh root@192.168.11.100
kubectl get nodes
# Doit afficher : Ready

# Vérifier PostgreSQL
ssh root@192.168.11.101
psql -U postgres -d cloudvault -c "\dt"
# Doit afficher : users, files

# Vérifier la connexion PostgreSQL depuis K3s
ssh root@192.168.11.100
psql -h 192.168.11.101 -U postgres -d cloudvault -c "SELECT version();"
# Doit afficher la version PostgreSQL

# Vérifier le stockage NFS
ssh root@192.168.11.100
kubectl get pv,pvc
# Doit afficher : Bound

# Vérifier les secrets
kubectl get secrets
# Doit afficher : cloudvault-secrets
```

Si tout affiche "Ready" et "Bound", **tu es bon à déployer** !

---

## Conseils Importants

### Sécurité

1. **NE JAMAIS** commiter les mots de passe dans Git
2. Créer un fichier `CREDENTIALS.txt` avec tous vos mots de passe (à ne JAMAIS commit)
3. Utiliser des mots de passe complexes (au moins 16 caractères)

### Sauvegardes

1. Prendre des **snapshots Proxmox** avant chaque étape majeure
2. Sauvegarder la base PostgreSQL régulièrement
3. Sauvegarder le dataset TrueNAS

### Troubleshooting

Si un pod ne démarre pas :
```bash
kubectl get pods
kubectl describe pod nom-du-pod
kubectl logs nom-du-pod
```

Si le montage NFS ne fonctionne pas :
```bash
# Vérifier que le service NFS tourne sur TrueNAS
# Vérifier les permissions du dataset
# Vérifier le firewall
```

Si PostgreSQL refuse les connexions :
```bash
# Vérifier pg_hba.conf
# Vérifier postgresql.conf (listen_addresses)
# Vérifier le firewall
```
