# Progresso — Pezão Capoeira

Registro das mudanças realizadas na sessão de desenvolvimento.

---

## 1. Repositório e configuração Git

- Confirmado vínculo com `https://github.com/rhaastt/pezao-capoeira.git`
- Resolvido conflito de merge com a branch remota (mantida versão local)
- Corrigido `credential.helper` de `manager-core` → `manager` (eliminado aviso no push)
- Adicionado `.gitignore` ignorando a pasta `.claude/`

---

## 2. Auditoria do projeto

Problemas identificados no HTML/JS:

| # | Arquivo | Problema |
|---|---------|----------|
| 1 | `javascript.js:219` | Countdown referencia `#cd-h`, `#cd-m`, `#cd-s` que não existem no HTML |
| 2 | `index.html:583` | Link "Instagram" no footer apontava para URL do YouTube |
| 3 | `index.html:125` | `data-count="200"` deveria ser `1200` para animar corretamente |
| 4 | `index.html:579` | Telefone ainda é placeholder `(11) 99999-9999` |
| 5 | `index.html:134` | Texto "Estados com Visitados" gramaticalmente incorreto |
| 6 | múltiplos | Mesma imagem reutilizada em 4 seções diferentes |

---

## 3. Padronização de alinhamento (tudo à esquerda)

Eliminada a mistura de elementos centralizados e alinhados à esquerda. Tudo passou a seguir padrão editorial (esquerda), consistente com o hero.

**Elementos corrigidos:**

| Elemento | Antes | Depois |
|----------|-------|--------|
| Divisor "visão geral dos módulos" | `text-align: center` | `text-align: left` |
| Card de exemplos de aulas | `margin: 0 auto` | `margin: 0 0 2rem` |
| Botão "Ver programa completo" | `justify-content: center` | `justify-content: flex-start` |
| Frase final da seção Diferencial | `text-align: center` | `text-align: left` |
| Bloco "O que você pode esperar" | `margin: 0 auto` | `margin: 0` |
| Grid de depoimentos | `margin-inline: auto` | sem auto-margin |
| Card de oferta | `justify-items: center` | `justify-items: start` |
| Logo e texto Hotmart | `align-items: center` | `align-items: flex-start` |
| Linha de garantia | `justify-content: center` | `justify-content: flex-start` |
| Seção CTA final (urgência) | `text-align: center` | sem `text-align` |
| `.container-center` | `align-items: center` | `align-items: flex-start` |
| Botão de compra grande | `width: 100%` | `width: fit-content` |

---

## 4. Separação do CSS em arquivos

O arquivo `style.css` (≈2000 linhas) foi dividido em 14 arquivos dentro da pasta `css/`:

```
css/
  style.css       ← entry point (apenas @imports)
  variables.css   ← tokens: cores, fontes, espaçamentos
  base.css        ← reset, body, ícones Lucide
  layout.css      ← .container, .section, reveal on scroll
  nav.css         ← navegação desktop + mobile + hamburger
  hero.css        ← hero completo (base, animações, mobile)
  autoridade.css
  problema.css
  para-quem.css
  metodo.css
  diferencial.css
  prova.css
  oferta.css
  urgencia.css
  footer.css
```

`index.html` atualizado: `href="style.css"` → `href="css/style.css"`

---

## 5. Ícones de redes sociais no footer

Links de texto substituídos por botões circulares com ícones Lucide brancos:

- Instagram → `data-lucide="instagram"` (URL corrigida — antes apontava para YouTube)
- YouTube → `data-lucide="youtube"`
- Facebook → `data-lucide="facebook"`

Classe alterada de `.footer-social-text-link` → `.footer-social-link` (estilo circular já existente no CSS).

---

## Pendências identificadas (não corrigidas)

- `data-count="200"` no stat de alunos deveria ser `1200`
- Telefone no footer ainda é placeholder `(11) 99999-9999`
- Links dos alunos nos depoimentos são genéricos/placeholder
- Texto "Estados com Visitados" precisa revisão gramatical
- Countdown no JS referencia elementos HTML inexistentes
- Imagem `66cda588...jpg` reutilizada em 4 seções diferentes
