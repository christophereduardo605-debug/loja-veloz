# Loja Veloz — Plataforma Cloud-Native com DevOps

Projeto acadêmico de modernização de uma plataforma de pedidos de e-commerce, utilizando arquitetura de microsserviços, Docker, Kubernetes, CI/CD, observabilidade e infraestrutura como código.

## 1. Tecnologias

- Node.js 22 e Express
- PostgreSQL
- Docker e Docker Compose
- Kubernetes
- GitHub Actions
- GitHub Container Registry (GHCR)
- OpenTelemetry
- Kubernetes Metrics Server
- Terraform

## 2. Arquitetura

A aplicação é composta por:

- **API Gateway:** entrada HTTP e roteamento de requisições.
- **Pedidos:** criação e consulta de pedidos, com persistência no PostgreSQL.
- **Pagamentos:** microsserviço responsável pelas operações de pagamento.
- **Estoque:** microsserviço responsável pelas operações de estoque.
- **PostgreSQL:** armazenamento persistente dos pedidos.

O API Gateway centraliza o acesso aos serviços internos.

## 3. Estrutura do projeto

- `api-gateway/` — API Gateway e instrumentação OpenTelemetry
- `pedidos/` — microsserviço de pedidos
- `pagamentos/` — microsserviço de pagamentos
- `estoque/` — microsserviço de estoque
- `database/` — arquivos relacionados ao banco
- `kubernetes/` — Deployments, Services, ConfigMap, Secret de exemplo, HPA e observabilidade
- `observabilidade/` — configurações do OpenTelemetry
- `terraform/` — esqueleto de infraestrutura como código
- `.github/workflows/` — pipeline automatizado de CI/CD

## 4. Ambiente local com Docker Compose

Requisitos:

- Docker Desktop
- Docker Compose

Na raiz do projeto, executar:

```bash
docker compose up -d --build
```

Para verificar os containers:

```bash
docker compose ps
```

Para consultar logs:

```bash
docker compose logs
```

Para encerrar:

```bash
docker compose down
```

O API Gateway utiliza a porta 3000.

Endpoint de saúde:

http://localhost:3000/health

## 5. Kubernetes

O projeto utiliza Kubernetes com:

- Deployments e Services internos do tipo ClusterIP
- ConfigMap para configurações não sensíveis
- Secret para a senha do PostgreSQL
- Readiness e liveness probes
- Limites e solicitações de CPU e memória
- Execução dos microsserviços com usuário não-root
- Bloqueio de elevação de privilégios
- Redução das capacidades dos containers

### Credenciais

O arquivo `kubernetes/postgres-secret.example.yaml` contém apenas um modelo de configuração.

Para um ambiente novo, é necessário criar o Secret `postgres-secret` com uma senha própria antes de iniciar os serviços dependentes do banco.

Não utilizar a senha de exemplo em produção.

### Imagens Docker

Os manifests utilizados no ambiente local estão configurados com imagens `loja-veloz-*:latest` e `imagePullPolicy: Never`.

Isso exige que as imagens estejam previamente disponíveis no cluster.

Para ambientes externos, as imagens devem ser referenciadas pelo endereço do GHCR, utilizando tags versionadas ou digests e uma política de pull adequada.

### Aplicação dos manifests

Após configurar o Secret e disponibilizar as imagens no cluster:

```bash
kubectl apply -f kubernetes/
```

Verificar os Pods:

```bash
kubectl get pods
```

Acompanhar os Deployments:

```bash
kubectl get deployments
```

Acessar o API Gateway:

```bash
kubectl port-forward service/api-gateway 3100:3000
```

Endpoint:

http://localhost:3100/health

## 6. CI/CD

O GitHub Actions executa automaticamente o pipeline em alterações na branch `main` e em pull requests.

O pipeline realiza:

1. Instalação das dependências com `npm ci`
2. Verificação de sintaxe JavaScript
3. Testes automatizados
4. Construção das imagens Docker
5. Publicação das imagens no GitHub Container Registry em pushes para `main`

Os quatro serviços são processados individualmente por uma matriz de execução.

A autenticação no GHCR utiliza o `GITHUB_TOKEN` disponibilizado pelo GitHub Actions.

A publicação das imagens é automatizada. O deploy no cluster Kubernetes é realizado separadamente.

## 7. Estratégia de deploy

O API Gateway utiliza RollingUpdate, permitindo substituir gradualmente os Pods durante atualizações.

A estratégia busca reduzir indisponibilidades, mantendo réplicas disponíveis durante a implantação.

As readiness probes impedem que Pods ainda não preparados recebam tráfego.

## 8. Escalabilidade

O API Gateway possui:

- 2 réplicas iniciais
- HPA com mínimo de 2 réplicas
- Máximo de 5 réplicas
- Meta de utilização de CPU de 70%

O Kubernetes Metrics Server fornece as métricas utilizadas pelo HPA.

Para verificar:

```bash
kubectl get hpa
kubectl top pods
```

## 9. Observabilidade

### Métricas

O Metrics Server permite consultar consumo de CPU e memória dos Pods e fornece dados para o HPA.

### Logs

Os logs dos serviços podem ser consultados pelo Kubernetes:

```bash
kubectl logs deployment/api-gateway
kubectl logs deployment/pedidos
kubectl logs deployment/pagamentos
kubectl logs deployment/estoque
```

### Tracing

O API Gateway possui instrumentação OpenTelemetry.

O OpenTelemetry Collector recebe os traces por OTLP e utiliza um exportador de depuração para disponibilizar informações nos logs.

Para consultar:

```bash
kubectl logs deployment/otel-collector
```

A implementação demonstra a coleta de traces do API Gateway. A instrumentação completa dos demais microsserviços e a integração com uma plataforma de visualização de traces são possibilidades de evolução.

## 10. Infraestrutura como código

A pasta `terraform/` apresenta um esqueleto de infraestrutura como código utilizando o provider Kubernetes.

O exemplo demonstra a definição declarativa de um namespace, servindo como base para evolução do provisionamento.

## 11. Segurança

As principais medidas adotadas incluem:

- Containers Node.js executados como usuário não-root
- Dependências de produção instaladas com `npm ci --omit=dev`
- Secrets separados das configurações públicas
- Limites de CPU e memória
- Bloqueio de elevação de privilégios
- Remoção de capacidades Linux desnecessárias
- Perfil seccomp RuntimeDefault nos serviços configurados

O projeto é um MVP acadêmico. Para produção real, seriam necessárias medidas adicionais, como políticas de rede, gestão externa de segredos e verificações contínuas de vulnerabilidades.

## 12. Vídeo de apresentação

Vídeo pitch do projeto, com duração máxima de 4 minutos.

**YouTube:** [INSERIR LINK APÓS A PUBLICAÇÃO]

## 13. Repositório

https://github.com/christophereduardo605-debug/loja-veloz
