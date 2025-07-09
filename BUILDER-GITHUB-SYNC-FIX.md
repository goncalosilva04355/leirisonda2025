# 🔧 CORREÇÃO BUILDER.IO → GITHUB SYNC

## 🚨 **Problema Identificado**

O "Send PR" do Builder.io não está enviando para o GitHub.

**Evidências:**

- ❌ Imagem ainda usa API key antigo (24b5ff5dbb9f4bb493659e90291d92bc)
- ❌ Botão teste quota ainda aparece no Builder.io
- ❌ Mudanças não chegam ao GitHub

## 🔧 **SOLUÇÕES PASSO-A-PASSO**

### **SOLUÇÃO 1: Verificar Configuração GitHub**

1. **No Builder.io Dashboard:**

   - Vá a Project Settings (⚙️)
   - Clique em "Integrations"
   - Procure "GitHub"

2. **Verificar se está conectado:**
   - ✅ **Se conectado:** Account: goncalosilva04355
   - ❌ **Se desconectado:** Precisa reconectar

### **SOLUÇÃO 2: Reconectar GitHub**

1. **Desconectar:**

   - No Builder.io → Integrations → GitHub
   - Clique "Disconnect"

2. **Reconectar:**
   - Clique "Connect GitHub"
   - Autorizar acesso para **goncalosilva04355**
   - Selecionar repositório: **Builder-stellar-landing**

### **SOLUÇÃO 3: Verificar Repositório**

1. **Confirmar repositório existe:**

   - Vá a: https://github.com/goncalosilva04355/Builder-stellar-landing
   - ✅ **Se existe:** Continuar
   - ❌ **Se não existe:** Criar ou transferir repositório

2. **Verificar permissões:**
   - Repositório deve ser público ou ter permissões corretas
   - Token GitHub deve ter scope "repo"

### **SOLUÇÃO 4: Criar Novo Token GitHub**

1. **No GitHub:**

   - Vá a Settings → Developer settings → Personal access tokens
   - Generate new token (classic)

2. **Scopes necessários:**

   ```
   ✅ repo (full control)
   ✅ workflow
   ✅ write:packages
   ```

3. **Copiar token e usar no Builder.io**

### **SOLUÇÃO 5: Branch Strategy**

1. **Verificar branch configurado:**

   - Builder.io → Project Settings → GitHub
   - Target branch deve ser: **main**

2. **Se estiver errado:**
   - Mudar para "main"
   - Save settings

## 🧪 **TESTE RÁPIDO**

### **No Builder.io:**

1. Fazer pequena mudança (ex: alterar texto)
2. Clicar "Send PR"
3. Verificar se aparece no GitHub

### **Se funcionar:**

✅ PR aparece em: https://github.com/goncalosilva04355/Builder-stellar-landing/pulls

### **Se não funcionar:**

❌ Problema persiste - usar SOLUÇÃO ALTERNATIVA

## 🚀 **SOLUÇÃO ALTERNATIVA: Push Manual**

Se Builder.io continuar a falhar:

### **1. Download do código:**

- Builder.io → More → Download code
- Extrair ZIP

### **2. Upload manual ao GitHub:**

- Ir a: https://github.com/goncalosilva04355/Builder-stellar-landing
- Upload files ou usar Git commands

### **3. Configurar webhook GitHub → Netlify:**

- Para deploy automático

## 📋 **CHECKLIST DE VERIFICAÇÃO**

Verificar na ordem:

- [ ] GitHub account correto (goncalosilva04355)
- [ ] Repositório existe e é acessível
- [ ] Builder.io conectado ao GitHub
- [ ] Token GitHub válido e com permissões
- [ ] Target branch = "main"
- [ ] Test Send PR com mudança pequena

## 🔗 **Links Úteis**

- **Repositório:** https://github.com/goncalosilva04355/Builder-stellar-landing
- **Builder.io Settings:** Project Settings → Integrations
- **GitHub Tokens:** https://github.com/settings/tokens

## ⚡ **RESULTADO ESPERADO**

Após correção:
✅ "Send PR" funciona
✅ Mudanças aparecem no GitHub
✅ Sync automático Builder.io ↔ GitHub

---

**💡 Dica:** Comece pela SOLUÇÃO 2 (reconectar GitHub) - resolve 90% dos casos!
