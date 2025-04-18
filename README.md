# SimplesHub Test

Este é um projeto de teste que consiste em um frontend Vue e um backend Node.js para processamento de PDFs e extração de CPFs.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm, yarn ou pnpm
- Conta no Firebase (para o banco de dados)

## Configuração do Backend

1. Navegue até a pasta do backend:
```bash
cd back
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure o Firebase:
   - Crie um arquivo `firebaseAdminConfig.json` na pasta `back` com as credenciais do Firebase:
   ```json
   {
     "private_key": "sua_chave_privada",
     "project_id": "seu_project_id",
     "client_email": "seu_email_de_servico"
     // outras credenciais necessárias
   }
   ```

4. Inicie o servidor backend:
```bash
npm start
```

O servidor backend estará rodando em `http://localhost:3000`

## Configuração do Frontend

1. Navegue até a pasta do frontend:
```bash
cd front
```

2. Instale as dependências:
```bash
pnpm install
```

3. Inicie o servidor de desenvolvimento:
```bash
pnpm run serve
```

O frontend estará rodando em `http://localhost:8080`

## Funcionalidades

- Upload de arquivos PDF
- Extração automática de CPFs do PDF
- Armazenamento dos CPFs no Firebase
- Visualização do histórico de CPFs processados

## Estrutura do Projeto

```
simpleshub-test/
├── back/                 # Backend Node.js
│   ├── controllers/      # Controladores da aplicação
│   ├── routes/          # Rotas da API
│   ├── firebaseAdminConfig.json # Configuração do Firebase
│   └── server.js        # Ponto de entrada do servidor
│
└── front/               # Frontend Vue
    ├── public/          # Arquivos estáticos
    ├── src/            # Código fonte
    │   ├── components/ # Componentes Vue
    │   ├── assets/     # Recursos estáticos
    │   └── App.vue     # Componente principal
    └── package.json    # Dependências do frontend
```

## Observações

- Certifique-se de que o backend está rodando antes de iniciar o frontend
- O frontend se comunica com o backend através da URL `http://localhost:3000`
- Os PDFs processados são armazenados temporariamente e depois excluídos
- O histórico de CPFs é armazenado no Firebase Realtime Database

## Solução de Problemas

Se encontrar problemas ao processar PDFs:
1. Tente enviar repetidas vezes
2. Verifique se o PDF é válido e não está corrompido
3. Tente converter o PDF para um formato mais simples antes de enviar
4. Verifique os logs do console para identificar possíveis erros
