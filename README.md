# Loja Veloz — Modernização Cloud Native

Projeto acadêmico de modernização de um sistema de e-commerce utilizando microsserviços, containers, Kubernetes e práticas DevOps.

## Tecnologias

- Node.js 22
- PostgreSQL
- Docker e Docker Compose
- Kubernetes
- GitHub Actions
- Helm
- Terraform

## Arquitetura

O sistema possui quatro serviços:

- **API Gateway:** ponto de entrada das requisições.
- **Pedidos:** gerenciamento de pedidos com PostgreSQL.
- **Pagamentos:** serviço de pagamentos.
- **Estoque:** serviço de controle de estoque.

O PostgreSQL é utilizado para persistência dos pedidos.

## Estrutura do projeto

- `api-gateway/` — API Gateway
- `pedidos/` — microsserviço de pedidos
- `pagamentos/` — microsserviço de pagamentos
- `estoque/` — microsserviço de estoque
- `database/` — arquivos relacionados ao banco
- `kubernetes/` — manifestos Kubernetes e HPA
- `terraform/` — infraestrutura como código
- `observabilidade/` — recursos de monitoramento
- `.github/workflows/` — pipeline CI/CD

## Executando com Docker Compose

Na raiz do projeto:

```bash
docker compose up -d --build
```

A API Gateway utiliza a porta 3000.

## Executando com Kubernetes

Com as imagens disponíveis no ambiente Kubernetes:

```bash
kubectl apply -f kubernetes/
```

Para acessar a API:

```bash
kubectl port-forward service/api-gateway 3100:3000
```

Endpoint de saúde:

`http://localhost:3100/health`

## CI/CD

O GitHub Actions realiza verificação de sintaxe, construção das imagens Docker e publicação no GitHub Container Registry após alterações na branch principal.

## Escalabilidade

A API Gateway possui duas réplicas iniciais e um Horizontal Pod Autoscaler configurado para até cinco réplicas, com meta de utilização de CPU de 70%.

## Observabilidade

O Metrics Server fornece métricas de CPU e memória ao Kubernetes. Os logs dos serviços podem ser consultados pelo `kubectl logs`.

A integração completa com Prometheus, Grafana e rastreamento distribuído permanece como evolução futura.

## Infraestrutura como código

A pasta `terraform/` contém um esqueleto de provisionamento de namespace Kubernetes.

## Repositório

https://github.com/christophereduardo605-debug/loja-veloz
