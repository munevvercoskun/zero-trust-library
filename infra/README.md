# infra

Everything needed to run the system.

- `compose/`: Docker Compose for local development
- `k8s/`: Kubernetes manifests and network policies
- `terraform/`: Google Cloud resources

No secrets live here. Local values come from `.env`; cloud values come from Secret Manager.
