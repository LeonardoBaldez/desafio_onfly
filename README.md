# N8N Custom Node: True Random Number Generator

Este repositório contém um conector (custom node) para a plataforma de automação de workflows [n8n.io](https://n8n.io/).

O conector utiliza a API pública do **[Random.org](https://www.random.org/)** para gerar um número inteiro verdadeiramente aleatório a partir de um intervalo definido pelo usuário (mínimo e máximo).

## 📋 Funcionalidades

* **Operação Única**: "True Random Number Generator", que busca um número aleatório na API externa.
* **Inputs Configuráveis**: Permite ao usuário definir os parâmetros `Min` (valor mínimo, inclusivo) e `Max` (valor máximo, inclusivo).
* **Integração Real**: Garante aleatoriedade de alta qualidade, em vez de usar `Math.random()` pseudo-aleatório.

## 🛠️ Pré-requisitos

Antes de começar, certifique-se de que você tem os seguintes softwares instalados:

* [Node.js](https://nodejs.org/) (versão 22 LTS ou superior)
* [npm](https://www.npmjs.com/) (instalado com o Node.js)
* [Docker](https://www.docker.com/products/docker-desktop/)
* [Docker Compose](https://docs.docker.com/compose/install/)

## 🚀 Guia Rápido de Instalação e Execução

Siga os passos abaixo para configurar e executar o ambiente n8n com o conector customizado.

### 1. Preparação do Ambiente

Primeiro, clone o repositório e, em seguida, instale as dependências e compile o projeto.

```bash
# Clone este repositório
git clone <URL_DO_SEU_REPOSITORIO>
cd <NOME_DO_REPOSITORIO>

# Instale as dependências do projeto
npm install

# Compile o código TypeScript para JavaScript (Garanta que antes de rodar esteja dentro da pasta \custom\n8n-nodes-random)
npm run build
```
O comando `npm run build` criará uma pasta `dist` com o código que será executado pelo n8n.

### 2. Executando o Serviço com Docker

O `docker-compose.yml` deste projeto foi configurado para subir o n8n e um banco de dados PostgreSQL, além de carregar automaticamente o conector customizado.

**Atenção:** Para simplificar, o `docker-compose.yml` foi ajustado para mapear a pasta `dist` diretamente, eliminando a necessidade de mover arquivos manualmente.

**`docker-compose.yml` revisado:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: n8n
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: n8n_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  n8n:
    image: n8nio/n8n:latest # Usando a imagem mais recente
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=n8n_password
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=admin_password
      - GENERIC_TIMEZONE=America/Sao_Paulo
      - N8N_CUSTOM_EXTENSIONS=/home/node/custom_nodes
    volumes:
      # Mapeia o código compilado diretamente para a pasta de custom nodes
      - ./dist:/home/node/custom_nodes/dist
      # Adiciona o package.json para que o n8n reconheça o nó
      - ./package.json:/home/node/custom_nodes/package.json
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres

volumes:
  postgres_data:
  n8n_data:

```

**Inicie os serviços:**
```bash
# Execute na raiz do projeto
docker-compose up --build
```

### 3. Acessando e Testando o Conector

1.  Após os contêineres iniciarem, acesse o n8n em: `http://localhost:5678`
2.  Faça login com as credenciais:
    * **Usuário**: `admin`
    * **Senha**: `admin_password`
3.  Crie um novo workflow e adicione um nó, procurando por **"True Random Number Generator"**.
4.  Configure os campos e execute o nó para validar o resultado.
