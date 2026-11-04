# Podcast Management API

API em Node.js e TypeScript para gerenciar podcasts e episódios, armazenar arquivos no Amazon S3 e consultar métricas de reprodução.

## Funcionalidades

- Operações de criação, consulta, atualização e remoção de podcasts.
- Gerenciamento de episódios e upload de arquivos para o S3.
- Autenticação e autorização com JWT.
- Agregação de métricas de reprodução.
- Migrations para versionamento do esquema do banco.

## Arquitetura

A aplicação separa responsabilidades em camadas:

- **Apresentação:** controllers e rotas Express.
- **Aplicação:** serviços que coordenam a lógica de negócio.
- **Domínio:** entidades e interfaces.
- **Infraestrutura:** repositórios TypeORM e integração com AWS.

O acesso a dados utiliza o padrão Repository. DTOs e class-validator apoiam a validação de entrada.

## Tecnologias

Node.js, TypeScript, Express, TypeORM, PostgreSQL, AWS SDK v3, Amazon S3, JWT, class-validator e Jest.

## Configuração

Defina as variáveis necessárias no ambiente:

```env
DATABASE_URL=postgres://user:pass@localhost:5432/podcasts
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET_NAME=podcast-bucket
```

Instale as dependências, compile e aplique as migrations:

```bash
npm install
npm run build
npm run typeorm migration:run
```

> Use credenciais de desenvolvimento para o S3 e mantenha segredos fora do controle de versão. Consulte os scripts do projeto para iniciar a API e executar os testes.

## Exemplo

```bash
curl -X POST http://localhost:3000/api/podcasts \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"title":"Dev Insights","description":"Podcast sobre desenvolvimento"}'
```

## Testes e documentação

A estratégia descrita no projeto inclui testes unitários dos serviços, testes de integração da API e mocks para interações com o S3. A documentação OpenAPI, a coleção Postman e os diagramas estão nos diretórios correspondentes.
