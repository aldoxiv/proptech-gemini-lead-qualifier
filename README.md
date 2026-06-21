# PropTech: Qualificação Automatizada de Leads com Google AI Studio e Gemini 🏢🤖

Este projeto apresenta a arquitetura e a engenharia de prompt para um **Agente de Inteligência Artificial** focado no mercado imobiliário. O objetivo principal é automatizar a triagem e a qualificação de leads (tanto vindos de campanhas/sites quanto de listas frias de plantão) antes do direcionamento para o corretor humano.

---

## 🎯 O Desafio do Mercado
No dia a dia do mercado imobiliário, os corretores perdem muito tempo precioso tentando qualificar manualmente listas antigas ou contatos frios. A abordagem humana inicial geralmente gera atrito ou respostas evasivas ("Não lembro de ter me cadastrado"). 

## 💡 A Solução (IA Conversacional)
Este agente utiliza o modelo **Gemini (Google AI Studio)** estruturado com técnicas avançadas de Engenharia de Prompt para rodar de forma assíncrona no WhatsApp. Ele foi desenhado para:
1. **Desarmar Objeções:** Tratar de forma humanizada e estratégica o lead que esqueceu o cadastro.
2. **Identificar o Perfil (Pivô):** Descobrir rapidamente se a intenção do cliente é **Investimento** ou **Moradia Própria**.
3. **Coletar Dados Críticos (Filtro):** Capturar orçamento (ticket), prazo de mudança, número de dormitórios ou objetivo do investimento (ROI/Locação).
4. **Handoff Inteligente:** Encerrar a automação assim que o lead estiver qualificado, acionando o corretor humano com o histórico pronto.

---

## 🛠️ Tecnologias e Ferramentas Utilizadas
* **LLM Engine:** Google AI Studio (Versão Free / Gemini)
* **Técnica de Prompting:** Role-playing, Few-shot exemplos e Funil de Decisão Condicional (If/Else no fluxo de diálogo).
* **Stack de Integração Futura:** Conexão recomendada via Make.com / Typebot para WhatsApp API.

---

## 📁 Estrutura do Repositório
* `README.md`: Apresentação do projeto e modelo de negócio (este arquivo).
* `prompt-instructions.md`: O prompt de sistema estruturado utilizado dentro das *System Instructions* do Google AI Studio.

---

## 🚀 Como Testar este Modelo
1. Acesse o [Google AI Studio](https://aistudio.google.com/).
2. Crie um novo **Chat Prompt**.
3. No painel esquerdo (**System Instructions**), copie e cole o conteúdo do arquivo `prompt-instructions.md` deste repositório.
4. Altere os placeholders como `[Seu Nome]` e `[Sua Cidade]` para os seus dados.
5. Use o painel central para simular a conversa digitando "Quero informações de um imóvel" ou "Quem é você?".

---

## 👨‍💻 Autor
Desenvolvido por: **PAES VALMONT [ALDO]** 
* Associado à Lopes Consultoria Imobiliária.
* Conecte-se comigo no [Linkedin](https://www.linkedin.com/in/paes-valmont/)
