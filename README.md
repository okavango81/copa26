# Copa26

Este projeto foi desenvolvido utilizando [Angular CLI](https://github.com/angular/angular-cli) versão 21.0.4.

# 🏆 Copa 26 - Álbum de Figurinhas

Aplicação Angular criada para o gerenciamento e organização de figurinhas de álbuns, com persistência de dados local.

## 🌐 Link do Projeto
Acesse a aplicação online aqui:
👉 [https://okavango81.github.io/copa26/](https://okavango81.github.io/copa26/)

---

## 🚀 Como Publicar e Atualizar (Deploy)

O projeto está configurado para hospedagem no **GitHub Pages**. Para enviar atualizações do código para o site oficial, siga os passos abaixo:

### 1. Pré-requisitos
Certifique-se de ter a ferramenta de deploy instalada globalmente em sua máquina:
```bash
npm install -g angular-cli-ghpages

# 1. Gera o build de produção ajustando os caminhos para o GitHub Pages
ng build --base-href /copa26/

# 2. Faz o upload dos arquivos para a branch gh-pages
npx ngh --dir=dist/copa26/browser 
