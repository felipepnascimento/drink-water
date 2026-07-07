# Aquário da Sede 🐠

App pessoal, feito para incentivar minha filha de 3 anos a beber água.
Uma tela só: um aquário anima e enche conforme ela bebe, até bater a meta
diária. Sem login, sem internet, sem anúncio.

![Demonstração do aquário enchendo conforme a criança bebe água](./docs/aquario-demo.gif)

## Como funciona

- Ela toca em **Pouca**, **Média** ou **Muita** a cada golpe de água.
- O aquário enche aos poucos, com o cardume de peixes nadando.
- Ao bater a meta do dia, o aquário celebra com um 🎉.
- Um adulto configura a meta diária e o nome da criança na engrenagem (⚙️).

## Stack

- [Expo](https://expo.dev) (React Native + TypeScript)
- `react-native-svg` para os peixes e a água
- `@react-native-async-storage/async-storage` para salvar o progresso —
  tudo local, sem backend e sem conta

## Rodando localmente

```bash
npm install
npm start
```

Abra no Expo Go (Android/iOS) escaneando o QR code, ou rode `npm run web`
para testar no navegador.

## Planejamento

Veja [`TODO.md`](./TODO.md) para o escopo do MVP e o backlog de ideias
futuras (notificações, histórico semanal, sons, múltiplos perfis).
