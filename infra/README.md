# infra

Everything needed to run the system.

- `compose/`: Docker Compose for local development (Phase 3)
- `k8s/`: Kubernetes manifests and network policies (Phase 4)
- `terraform/`: Google Cloud resources (Phase 5)

No secrets live here. Local values come from `.env`; cloud values come from Secret Manager.
