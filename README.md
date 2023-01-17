# nlw-setup
# Configuração do projeto back-end
## Após criada a pasta do projeto, rodar o comando: npm init -y
## Para rodar o servidor back-end, usar o comando: npm run dev
#### Deve ser feito a configuração do script no arquivo "package.json"
## No projeto, estará sendo usado o framework Fastify para roteamento, ele é paralelo ao Express. Para instalar, usar o comando: npm install fastify
## A linguagem a ser utilizada será o typescript, para isso é necessário instalá-lo ao projeto utilizando o comando: npm install typescript
### Instalado o ts, é preciso executá-lo utilizando o seguinte comando: npx tsc --init
### Logo após: npm install tsx -D
## Para comunicação com o banco de dados, utilizar o ORM Prisma, instalando com o comando: npm install -D prisma
### E também o Prisma Client: npm install @prisma/client
### Após instalado, é necessário dizer o banco que estará sendo utilizado, que será o SQLite, usando o comando: npx prisma init --datasource-provider SQLite
## Depois de configurado o model no arquivo "schema.prisma", usar o seguinte comando para que o prisma rode as queries: npx prisma migrate dev
### Para abrir um visual do banco, basta utilizar o comando: npx prisma studio
## Por fim, é necessário instalar o cors para que bloqueie aplicações front-end de acessar a API, usando o comando: npm i @fastify/cors


# Configuração do projeto front-end
## Criar o projeto com o seguinte comando: npm create vite@latest
#### Selecionar React e TypeScript
## Pós criado o projeto, rodar o comando a seguir para instalar todas as dependências básicar para rodar o projeto: npm install
## Para rodar o projeto front-end, usar o comando: npm run dev
## Na parte da estilização, será usado o TailwindCSS, para instalar, seguir a documentação: https://tailwindcss.com/docs/installation/using-postcss
