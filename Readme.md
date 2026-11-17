<div align="center">

<svg width="72" height="72" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#7B61FF" />
      <stop offset="100%" stop-color="#00E5A0" />
    </linearGradient>
    <linearGradient id="boltGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#C8BFFF" stop-opacity="0.8" />
    </linearGradient>
  </defs>
  <rect width="44" height="44" rx="12" fill="url(#logoGrad)" />
  <rect x="12" y="20" width="20" height="4" rx="2" fill="white" fill-opacity="0.9" />
  <rect x="8" y="15" width="5" height="14" rx="2.5" fill="white" />
  <rect x="31" y="15" width="5" height="14" rx="2.5" fill="white" />
  <path d="M25 10 L19 23 H23.5 L19 34 L29 20 H24.5 Z" fill="url(#boltGrad)" fill-opacity="0.92" />
</svg>

# Workout

**Gerencie seus treinos com inteligência.**  
Crie séries de exercícios personalizadas, calcule seu IMC e receba recomendações baseadas no seu objetivo.

</div>

---

## Sobre o projeto

Workout é uma aplicação fullstack de gerenciamento de treinos. O usuário cria uma conta, preenche seu perfil de saúde (peso, altura, idade, objetivo) e monta séries de exercícios semanais com base nas recomendações geradas pelo cálculo do IMC.

**Stack:**
- **Back-end:** Node.js · Express · Prisma · PostgreSQL
- **Front-end:** Next.js · React · TypeScript · Tailwind CSS
- **Infraestrutura:** Docker · Docker Compose

**Principais funcionalidades:**
- Autenticação com JWT (cadastro, login, logout)
- Perfil de saúde com cálculo automático de IMC e classificação
- Recomendações de categorias de exercícios com base no objetivo
- Catálogo de exercícios com filtros por músculo e busca por nome
- Criação e gerenciamento de séries de treino semanais (múltiplos dias)

---

## Como executar

### Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados

### Subindo a aplicação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd workout

# Suba todos os serviços
docker compose up -d
```

Aguarde os containers inicializarem (o backend executa as migrations automaticamente). Em seguida acesse a aplicação pelo navegador.

### Encerrando

```bash
docker compose down
```

Para remover também o volume do banco de dados:

```bash
docker compose down -v
```

---

## Serviços e portas

| Serviço    | Container          | Porta local | Descrição                        |
|------------|--------------------|-------------|----------------------------------|
| Frontend   | `workout_frontend` | **3001**    | Interface web (Next.js)          |
| Backend    | `workout_backend`  | **3000**    | API REST (Express)               |
| PostgreSQL | `postgres_db`      | **5432**    | Banco de dados                   |

- **Frontend:** [http://localhost:3001](http://localhost:3001)
- **API:** [http://localhost:3000/api](http://localhost:3000/api)

---

## Estrutura do projeto

```
workout/
├── backend/          # API REST
│   ├── prisma/       # Schema e migrations
│   └── src/
│       ├── controllers/
│       ├── middlewares/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       └── types/
├── frontend/         # Aplicação Next.js
│   └── src/
│       ├── app/      # Rotas e páginas (App Router)
│       ├── components/
│       ├── services/ # Clientes da API
│       └── types/
└── docker-compose.yml
```

---

## Variáveis de ambiente

As variáveis já estão configuradas no `docker-compose.yml` para ambiente local. Para personalizar, edite o arquivo ou crie um `.env` na pasta `backend/`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/workout_db"
JWT_SECRET="sua_chave_secreta"
JWT_EXPIRES_IN="7d"
PORT=3000
```
