# proptech-IA — Hub de Expansão & Qualificação Imobiliária 🏢🤖

> **Plataforma de Inteligência Artificial Full-Stack para Incorporadoras e Consultores Imobiliários.**
> Integração de **Análise Técnica de Terrenos**, **Due Diligence Documental por Visão Computacional** e **Qualificação Conversacional de Leads no WhatsApp**.

---

## 💡 Visão Geral

O **proptech-IA** é um ecossistema inteligente desenhado para otimizar os dois pilares mais críticos do mercado imobiliário:

1. **Expansão & Captação (Incorporadoras):** Acelera a prospecção de terrenos, viabilidade técnica inicial, análise de risco documental e geração de propostas de permuta.
2. **Qualificação & Triagem de Vendas (Corretores):** Automatiza o primeiro atendimento de leads via WhatsApp com linguagem humanizada, separando compradores reais de contatos curiosos.

---

## 🚀 Módulos da Plataforma

### 🏢 Módulo 1: Captação & Expansão de Terrenos (Incorporadoras)
Módulo voltado para equipes de **Novos Negócios, Inteligência Imobiliária e Expansão**.

* 📐 **Análise Técnica de Terrenos & Zoneamento (IA Geográfica):**
  * Processa parâmetros como **Área Total**, **Valor Pedido**, **Zoneamento (ZR, ZEU, ZCOR, ZM)**, **Coeficiente de Aproveitamento (CA)** e **Taxa de Ocupação (TO)**.
  * Calcula automaticamente a **Área Computável**, **Potencial Construtível Estima**, **Estimativa de VGV (Valor Geral de Vendas)** e sugere a **tipologia de projeto ideal** (ex: Studios, 1/2 dorms ou residencial multifamiliar).

* 📄 **Validação Documental & Due Diligence (Visão Computacional Multimodal):**
  * Leitura e interpretação automatizada de PDFs e imagens de **Matrículas de Imóveis**, **Certidões de Ônus** e **Carne de IPTU**.
  * Identificação instantânea de **gravames**, **penhoras**, **hipotecas**, **usufruto**, **averbações pendentes** ou **divergências de metragem**.
  * Emissão de **Parecer Jurídico Prévia** com Nível de Risco (Baixo, Médio, Alto).

* ✉️ **Gerador de Abordagens Comerciais & Propostas de Permuta:**
  * Criação automática de **Scripts de Abordagem via WhatsApp** para proprietários ou corretores parceiros.
  * Elaboração de **Minutas de E-mail para Permuta Física ou Financeira** enriquecidas com argumentos jurídicos de garantia patrimonial (SPE, Patrimônio de Afetação, Garantias Bancárias).

---

### 💬 Módulo 2: Qualificação & Triagem Inteligente de Leads (Vendas)
Simulador conversacional em formato de **WhatsApp Web** alimentado pelo Gemini AI.

* 🎯 **Atendimento Humanizado em Pingue-Pongue:**
  * Diálogo fluido e focado (uma pergunta por vez) para manter engajamento máximo sem sobrecarregar o cliente.
* 🔄 **Tratamento de Objeções para Listas Frias:**
  * Abordagem estratégica para contatos que não lembram do cadastro inicial ("Desarmando a objeção de forma leve").
* 🔍 **Pivô de Intenção & Funil Condicional:**
  * **Perfil Moradia:** Captura de urgência de mudança, número de dormitórios e estilo de vida.
  * **Perfil Investimento:** Mapeamento de estratégia (Ganho de Capital em obras vs. Renda com Locação/Airbnb), experiência no mercado e orçamento disponível (Ticket de Entrada).
* 📋 **Ficha do Lead & Exportação:**
  * Atualização dinâmica da **Ficha de Qualificação** do cliente e gerador de relatório `.txt` pronto para integração com CRM.

---

## 🛠️ Stack Tecnológica

* **Frontend:** React 18, Vite, Tailwind CSS v4, Lucide React, Motion (fka Framer Motion).
* **Backend / API Server:** Express.js + Node.js (Servidor TypeScript compilado via esbuild).
* **Inteligência Artificial:** SDK Oficial Google Gen AI (`@google/genai`) usando modelo **Gemini 2.5 Flash**.
* **Engenharia de Prompts:** System Instructions parametrizadas com contexto de negócios imobiliários e análise documental.

---

## 📂 Estrutura de Arquivos

```
proptech-ia/
├── metadata.json                 # Metadados e permissões do applet
├── package.json                  # Scripts e dependências
├── server.ts                     # Servidor Express & Rotas de IA (/api/chat, /api/analyze-land, etc.)
├── index.html                    # Ponto de entrada HTML
├── prompt-instructions.md        # Guia de System Instructions do Agente
└── src/
    ├── App.tsx                   # Layout principal e chaveador dos 2 Módulos
    ├── main.tsx                  # Ponto de entrada do React
    ├── types.ts                  # Definições de Tipos TypeScript (Lead, Terreno, Análise)
    └── components/
        ├── ExpansionModule.tsx   # Módulo de Expansão, Análise de Terrenos & Documentos
        └── LeadQualificationModule.tsx # Módulo de Qualificação de Leads & Simulador WhatsApp
```

---

## ⚙️ Como Executar Localmente

### 1. Clonar o Repositório e Instalar Dependências
```bash
git clone https://github.com/seu-usuario/proptech-ia.git
cd proptech-ia
npm install
```

### 2. Configurar Variável de Ambiente
Crie um arquivo `.env` na raiz do projeto contendo sua chave da API do Google AI Studio:
```env
GEMINI_API_KEY=sua_chave_aqui
```

### 3. Iniciar o Servidor em Modo de Desenvolvimento
```bash
npm run dev
```
O aplicativo estará acessível em `http://localhost:3000`.

### 4. Build de Produção
```bash
npm run build
npm start
```

---

## 🚀 Como Publicar no GitHub

1. Inicialize o repositório git caso ainda não esteja inicializado:
   ```bash
   git init
   ```
2. Adicione os arquivos ao commit:
   ```bash
   git add .
   git commit -m "feat: lancamento do hub proptech-IA com modulos de Expansao e Qualificacao"
   ```
3. Vincule ao seu repositório do GitHub e realize o push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/proptech-ia.git
   git push -u origin main
   ```

---

## 👨‍💻 Autor

Desenvolvido por **Aldo Santos (Paes Valmont)**  
* Especialista em Inteligência Imobiliária & Soluções PropTech.
* Conecte-se comigo no [LinkedIn](https://www.linkedin.com/in/aldo-santos-80a409106).

