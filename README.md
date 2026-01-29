# CloudVault — Guide d'installation et d'architecture

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

1. L'utilisateur accède au frontend React via son navigateur  
2. L'utilisateur se connecte ou crée un compte  
3. L'utilisateur upload un fichier  
4. Le frontend envoie le fichier à l'API Node.js  
5. L'API vérifie l'authentification (JWT token)  
6. L'API sauvegarde le fichier sur TrueNAS via NFS  
7. L'API enregistre les métadonnées dans PostgreSQL  
8. L'API retourne une confirmation  
9. Le fichier est maintenant stocké en sécurité

---

## Technologies Utilisées

Infrastructure :
- Proxmox — hyperviseur pour créer les VMs  
- Kubernetes K3s — orchestration légère  
- Docker — conteneurisation  
- TrueNAS — stockage via NFS

Développement :
- Backend : Node.js + Express  
- Frontend : React 18  
- Base de données : PostgreSQL  
- Auth : JWT  
- Stockage fichiers : NFS via TrueNAS

Langages principaux :
- JavaScript / JSX, SQL, YAML, Bash

---

## Avant de commencer — points pratiques
- Réseau recommandé : 192.168.11.0/24  
- Vérifie que TrueNAS (192.168.11.10) répond au ping depuis ton PC admin  
- Prépare Proxmox pour créer les VMs (k3s-master, postgresql, optionnellement k3s-worker)  
- Installe Node.js, Docker, Git sur ton PC si tu vas build les images localement

Test rapide :
```bash
ping 192.168.11.10   # TrueNAS
ping 192.168.11.100  # k3s-master
```

---

## Configuration recommandée (IPs statiques)
- K3s-Master : 192.168.11.100  
- PostgreSQL  : 192.168.11.101  
- K3s-Worker  : 192.168.11.102 (optionnel)  
- TrueNAS     : 192.168.11.10

Important : configure les IPs statiquement dans Debian lors de l'installation des VMs (évite surprises réseau).

---

## Étapes clés (résumé pragmatique)

1. TrueNAS : créer dataset `/mnt/pool/cloudvault` et partage NFS (Authorized Networks = 192.168.11.0/24, mapall user = root si besoin)  
   - Tester le montage depuis une machine Linux (mount -t nfs ...)  
   - Si "permission denied" → vérifier Authorized Networks, permissions dataset, firewall

2. Proxmox : créer VMs
   - k3s-master : Debian 12, 8GB RAM, 4 cores, IP 192.168.11.100
   - postgresql  : Debian 12, 4GB RAM, 2 cores, IP 192.168.11.101
   - k3s-worker (optionnel) : Debian 12, IP 192.168.11.102

3. Installer K3s sur le master
   - apt update && apt upgrade -y
   - apt install nfs-common -y
   - curl -sfL https://get.k3s.io | sh -
   - kubectl get nodes (vérifier Ready)
   - conserver /var/lib/rancher/k3s/server/node-token pour joindre des workers

4. Installer PostgreSQL sur VM dédiée
   - apt install postgresql
   - créer database cloudvault et utilisateur applicatif
   - modifier postgresql.conf (listen_addresses='*') et pg_hba.conf pour autoriser 192.168.11.0/24
   - redémarrer et tester depuis k3s-master avec psql client

5. Provisionner PV/PVC NFS dans Kubernetes
   - Créer PersistentVolume pointant sur 192.168.11.10:/mnt/pool/cloudvault
   - Créer PersistentVolumeClaim (ReadWriteMany)
   - kubectl get pv,pvc → PVC doit être Bound

6. Créer secrets Kubernetes
   - kubectl create secret generic cloudvault-secrets --from-literal=db-password='...' --from-literal=jwt-secret=$(openssl rand -base64 32)
   - Ne jamais commiter ces secrets en clair

7. Développer API (Node.js) et Frontend (React), dockeriser, push sur un registre (Docker Hub ou privé), puis créer Deployment/Service/Ingress dans K3s

---

## Conseils pratiques & problèmes fréquents

- NFS & permissions : les conflits d'UID/GID sont fréquents. Mapall ou aligner les UID peut sauver du temps.  
- PVC Pending : vérifier que le path NFS est correct et accessible depuis les nodes. Tester montage manuel.  
- PostgreSQL : si "connection refused", vérifier listen_addresses, pg_hba.conf et firewall.  
- Pod CrashLoopBackOff : kubectl describe pod && kubectl logs pod pour diagnostiquer.

---

## Sécurité & sauvegardes (minimum conseillé)
- TLS : utiliser Ingress (Traefik) + cert-manager pour HTTPS si tu exposes le service.  
- Secrets : en production, envisager SealedSecrets, ExternalSecrets ou HashiCorp Vault.  
- Sauvegarde DB : pg_dump régulier + rotation (ex : conserver 7 jours).  
- Snapshot TrueNAS : active snapshots automatiques sur le dataset.

---

## Checklist finale
- [ ] TrueNAS dataset + NFS OK  
- [ ] VMs créées + IPs statiques configurées  
- [ ] K3s master installé  
- [ ] PostgreSQL installé, DB et user créés  
- [ ] PV/PVC NFS appliqué et Bound  
- [ ] Secrets Kubernetes créés  
- [ ] Docker images construites & poussées  
- [ ] Deployments appliqués et pods Ready

---

Si tu veux que je génère maintenant :
- le deployment.yaml complet pour l'API + frontend (avec PVC + secrets)  
- un Dockerfile pour l'API Node.js prêt à builder  
- un schéma SQL minimal (tables users, files)  
- un script de sauvegarde PostgreSQL

Dis‑moi lequel tu veux en premier et je le produis prêt à copier/coller.  
