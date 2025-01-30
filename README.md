# FastOrder
**FastOrder** é um sistema inovador para gerenciamento de pedidos em restaurantes, projetado para otimizar a produtividade e simplificar o fluxo de trabalho. Ele combina tecnologias modernas para oferecer uma experiência eficiente, escalável e organizada, com atualizações em tempo real.

## 🛠️ Tecnologias Utilizadas
- Backend: Ruby '3.3.6', Rails 7 com suporte a API e WebSocket.
- Frontend: React integrado ao Rails, utilizando Styled-Components e MUI para estilização.
- Banco de Dados: PostgreSQL.
- Infraestrutura:
  - Docker para containerização.
  - Redis: Usado para gerenciamento de conexões em tempo real e filas do Action Cable.
  - NGINX como proxy reverso.

## ✨ Funcionalidades Principais
### 1. Autenticação e Autorização
- Autenticação com Devise.
- Roles de usuário (admin e collaborator):
  - Apenas administradores podem criar novos colaboradores.
  - Novo usuário deve completar o cadastro preenchendo o nome.
### 2. Gerenciamento de Pedidos
- Organização dos pedidos por status:
  - "Novos pedidos", "Entregue", "Pago", "Cancelado".
- Atualizações em tempo real para todos os usuários conectados.
### 3. Gestão de Produtos
- Produtos categorizados para seleção rápida e eficiente.
- Integração direta com o fluxo de pedidos.
### 4. Dashboard
- Gráficos interativos com dados semanais, mensais e anuais.
- Resumo de lucros, pedidos, novos clientes, novos colaboradores e cartões de fidelidade.
### 5. Cartões de Fidelidade
- Clientes podem ter um ou mais cartões associados.
- A ideia é que após 10 compras, o cliente ganha um pedido gratuito.
### 6. Outras Funcionalidades
Exclusão automática de pedidos antigos (1 ano).
## ⚙️ Configuração e Uso
### Pré-requisitos
- Docker e Docker Compose instalados.
### Passos para Configuração
### 1. Clone o repositório:

```
git clone git@github.com:adoniranfranceh/fast_order.git
cd fast_order
```
### 2. Configure o ambiente:

```
cp env.example .env
```
Ajuste as variáveis no arquivo .env conforme necessário.
### 3. Construção dos containers Docker (caso seja a primeira vez):

```
docker-compose --build
```
### 4. Suba os containers Docker:

```
docker-compose up -d
```
### 5. Configure o banco de dados:
Durante a primeira execução, será necessário configurar o banco de dados e popular com dados iniciais:

```
docker-compose exec app rails db:seed
```
### 6. Acesse a aplicação em http://localhost.

### 7. Faça o login:
Para acessar o sistema:
#### Como Admin:
  - Email: `admin@admin.com`
  - Senha: `123456`
  - Após o login, você precisará atualizar o nome para acessar outras páginas.
#### Como Colaborador:
##### 1. Registrando um novo colaborador:
  - Acesse a página de colaboradores em http://localhost/colaboradores enquanto logado com a conta admin.
  - Clique em **Novo Colaborador** para adicionar um novo usuário preechendo o form.
##### 2. Login com um colaborador existente:
  - Caso já tenha um colaborador cadastrado, basta usar o email de um colaborador existente e a senha `123456` para fazer o login diretamente como colaborador

## 🔍 Rodando os Testes
Testes são implementados com RSpec. Para executar:
```
docker-compose exec app bundle exec rspec
```

## 🚀 Inspiração
A interface foi inspirada no modelo **Kanban**, utilizando cards para cada pedido. Isso ajuda a organizar e priorizar os pedidos de forma visual, permitindo aos colaboradores e administradores visualizar claramente o status de cada um, facilitando o gerenciamento e aumentando a eficiência no fluxo de trabalho.

