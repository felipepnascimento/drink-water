# Aquário da Sede 🐠

App pessoal, feito para incentivar minha filha de 3 anos a beber água.
Uma tela só: um aquário anima e enche conforme ela bebe, até bater a meta
diária. Sem login, sem internet necessária depois de instalado, sem
anúncio.

É um PWA (Next.js): abre pelo navegador e pode ser "instalado" na tela de
início do celular, sem passar por loja de aplicativos.

![Demonstração do aquário enchendo conforme a criança bebe água](./docs/aquario-demo.gif)

## Como funciona

- Ela toca num dos três copos (pouco / médio / cheio — sem texto, ela ainda
  não lê) a cada golpe de água.
- O aquário enche aos poucos, com o cardume de peixes nadando, e reage com
  uma animação (bounce + bolhas + gota flutuando) a cada toque.
- Ao bater a meta do dia, o aquário celebra com um 🎉.
- Um adulto configura a meta diária, o nome da criança e pode zerar a água
  de hoje na engrenagem (⚙️).

## Stack

- [Next.js](https://nextjs.org) (App Router + TypeScript)
- SVG + CSS (keyframes/transitions) para as animações — sem lib externa
- `localStorage` para salvar o progresso — tudo local, sem backend e sem
  conta
- Manifest + service worker próprios para funcionar como PWA instalável

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy

Pensado pra rodar na [Vercel](https://vercel.com): conecta o repositório e
cada push na `main` já builda e publica.

## Instalar no celular

Abra a URL publicada no Safari (iOS) ou Chrome (Android) e use
"Adicionar à Tela de Início" — o app abre em tela cheia, como um app
nativo.

## Planejamento

Veja [`TODO.md`](./TODO.md) para o escopo do MVP e o backlog de ideias
futuras (notificações, histórico semanal, sons, múltiplos perfis).
