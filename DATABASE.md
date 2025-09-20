# 📦 Banco de Dados - POC QR System

## 🏗️ Estrutura do Banco

### Database: `poc-qr-system`

## 📋 Collections

### 1. **admins**
```javascript
{
  _id: ObjectId,
  username: String,        // "admin"
  password: String,        // Hash bcrypt
  isActive: Boolean,       // true
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **buildings** (Prédios/Tenants)
```javascript
{
  _id: ObjectId,
  name: String,           // "Edifício Central"
  address: String,        // "Rua das Flores, 123"
  tenantId: String,       // "edificio-central" (único)
  isActive: Boolean,      // true
  createdAt: Date,
  updatedAt: Date
}
```

### 3. **residents** (Moradores)
```javascript
{
  _id: ObjectId,
  name: String,           // "João Silva"
  email: String,          // "joao@email.com" (único)
  password: String,       // Hash bcrypt
  apartment: String,      // "101"
  buildingId: ObjectId,   // Referência para buildings
  isActive: Boolean,      // true
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Inicialização

### Comando de Setup
```bash
npm run init-db
```

### Dados Criados
- **1 Admin**: admin/admin123
- **1 Prédio**: Edifício Central
- **1 Morador**: João Silva (joao@email.com/123456)

## 🔗 Relacionamentos

```
Building (1) ←→ (N) Residents
```

- Um prédio pode ter vários moradores
- Cada morador pertence a um prédio
- TenantId é usado para integração com microsserviços

## 📊 Índices

### buildings
- `tenantId` (único)

### residents  
- `email` (único)
- `buildingId`

### admins
- `username` (único)

## 🔄 Integração com Microsserviços

### QR Manager Service
- Usa `tenantId` para identificar catracas
- Cria QR Codes vinculados ao `turnstileId`

### Turnstile Service  
- Recebe catracas via `tenant` (tenantId)
- Processa scans com validação JWT

## 🛠️ Comandos Úteis

```bash
# Inicializar banco com dados exemplo
npm run init-db

# Criar apenas admin
npm run create-admin

# Conectar ao MongoDB
mongo poc-qr-system

# Ver collections
show collections

# Ver dados
db.buildings.find().pretty()
db.residents.find().pretty()
db.admins.find().pretty()
```