# POC - Sistema QR Code para Catracas

## 🎯 Visão Geral
POC completa demonstrando o sistema de QR Code para controle de acesso em catracas de prédios.

## 🏗️ Arquitetura
- **Frontend**: HTML/CSS/JavaScript puro
- **Backend**: Node.js + Express + MongoDB
- **Integração**: APIs dos microsserviços (QR Manager + Turnstile Service)

## 🚀 Como Executar

### 1. Instalar Dependências
```bash
cd poc-tcc
npm install
```

### 2. Configurar Ambiente
- MongoDB rodando na porta 27017
- QR Manager Service na porta 3000
- Turnstile Service na porta 3031

### 3. Inicializar Banco de Dados
```bash
npm run init-db
```

### 4. Executar POC
```bash
npm start
# ou para desenvolvimento:
npm run dev
```

### 4. Acessar
- **POC**: http://localhost:3002
- **Admin**: http://localhost:3002/admin
- **Morador**: http://localhost:3002/resident
- **Catraca**: http://localhost:3002/turnstile

## 📋 Fluxo Completo

### 1. **Administrador** (http://localhost:3002/admin)
- Cadastrar prédios (tenants)
- Cadastrar moradores
- Gerenciar catracas automaticamente

### 2. **Morador** (http://localhost:3002/resident)
- Login com email/senha
- Gerar QR Code para visitantes
- Definir janela de tempo e usos

### 3. **Catraca** (http://localhost:3002/turnstile)
- Selecionar catraca
- Escanear/colar QR Code
- Feedback visual de liberação/negação
- Histórico de acessos

## 🔧 Funcionalidades

### Admin
- ✅ CRUD de prédios
- ✅ CRUD de moradores
- ✅ Criação automática de catracas
- ✅ Interface responsiva

### Morador
- ✅ Sistema de login
- ✅ Geração de QR Code
- ✅ Configuração de janela de tempo
- ✅ Controle de usos máximos

### Catraca
- ✅ Seleção de catraca
- ✅ Processamento de QR Code
- ✅ Feedback visual claro
- ✅ Histórico local de acessos
- ✅ Suporte a fallback offline

## 🎨 Interface

### Design Responsivo
- Layout limpo e intuitivo
- Cores diferenciadas por tipo de usuário
- Feedback visual claro
- Navegação simples

### Experiência do Usuário
- **Admin**: Vermelho - Controle total
- **Morador**: Verde - Geração de QR
- **Catraca**: Amarelo - Leitura pública

## 🔄 Integração com Microsserviços

### QR Manager Service
- Criação de QR Codes
- Validação de tokens
- Controle de usos

### Turnstile Service
- CRUD de catracas
- Processamento de scans
- Fallback offline
- Sincronização

## 📊 Dados de Teste

### Credenciais Padrão
- **Admin**: `admin` / `admin123`
- **Morador**: `joao@email.com` / `123456`

### Dados Criados Automaticamente
- **Prédio**: Edifício Central (tenant: edificio-central)
- **Morador**: João Silva - Apto 101
- **Catraca**: edificio-central-MAIN (criada automaticamente)

## 🛡️ Segurança
- Senhas hasheadas com bcrypt
- JWT para autenticação
- Validação de dados
- Controle de acesso por prédio

## 📱 Responsividade
- Interface adaptável
- Funciona em desktop e mobile
- Otimizada para tablets (catracas)

## 🎯 Demonstração Completa
1. **Admin cadastra prédio** → Catraca criada automaticamente
2. **Admin cadastra morador** → Morador pode fazer login
3. **Morador gera QR Code** → Token JWT criado
4. **Visitante usa catraca** → Acesso liberado/negado
5. **Sistema funciona offline** → Sincronização posterior