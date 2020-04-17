<h1 align="center">
  <img alt="Fastfeet" title="Fastfeet" src="./github/logo.png" width="300px" />
</h1>

<h3 align="center">
  Desafio  FastFeet
</h3>

### 📜 Sobre a aplicação

Esta é uma aplicação construída para uma transportadora fictícia, a FastFeet, usando a stack Node, React e React Native.

- **BACKEND:** Uma API feita em NodeJs destinada para servir de backend para as demais aplicações.
- **FRONTEND:** A parte Web desenvolvida para o administrador visualizar, analisar e manipular dados da aplicação.
- **MOBILE:** A parte Mobile para o uso de usuários entregadores.

### Requisitos

1. Ter o **NodeJs** e o **Yarn** instalado
2. Ter instâncias do **Redis** e **PostgreSQL** em execução
3. Um dispositivo ou emulador **Android** conectado ao computador
4. **Reactotron** rodando na porta 9090 (**Opcional**)

### Clonando repositorio

```sh
git clone https://github.com/Mazin97/FastFeet
```

### Iniciando o backend

1. `cd backend`
2. `yarn`
3. `Criar o arquivo .env com base no .env.example`
4. `yarn sequelize db:migrate`
5. `yarn sequelize db:seed:all`
6. `yarn dev`

### Iniciando o Front-end

1. `cd frontend`
2. `yarn`
3. `yarn start`

### Iniciando o Mobile (Apenas Android)

1. `cd mobile`
2. `yarn`
3. `Criar o arquivo .env com base no .env.example`
4. `adb reverse tcp:9090 tcp:9090 (Reactotron)`
5. `adb reverse tcp:8080 tcp:8080 (Device)`
6. `react-native run-android`

### Ferramentas utilizadas

- ⚛️ **ReactJs** - Biblioteca Javascript para criar interfaces de usuário.
- ⚛️ **React Native** - Framework para criar apps nativos usando React.
- 💅 **Styled Components** - Biblioteca Javascript pra estilizar componentes.
- 🔁 **Redux** - Biblioteca JavaScript de código aberto para gerenciar o estado do aplicativo.
- 🔂 **Redux Saga** - Biblioteca Javascript que torna os efeitos colaterais do aplicativo mais faceis de gerenciar.

<hr>
