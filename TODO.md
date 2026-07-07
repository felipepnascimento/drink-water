# Aquário da Sede — plano e TODO

PWA (Next.js) para incentivar uma criança pequena a beber água. Tela única
com um aquário animado: a água sobe conforme a criança bebe, até bater a
meta diária. Sem backend — tudo salvo no navegador (`localStorage`).

Código (variáveis, componentes, arquivos) em **inglês**. Textos exibidos na
tela em **pt-BR**.

## Stack

- Next.js (App Router + TypeScript), deploy na Vercel
- `localStorage` para persistência local (sem backend, sem conta)
- SVG + CSS (keyframes/transitions) para os peixes, a água e as animações —
  sem libs de animação externas
- Manifest + service worker próprios para instalar como PWA (sem `next-pwa`)

> Já foi um app Expo/React Native — migrado pra Next.js pra rodar como PWA
> (instala direto do navegador, sem Expo Go/App Store/SDK compat) e fazer
> deploy contínuo na Vercel.

## Modelo de dados (local)

```ts
type Child = { id: string; name: string; dailyGoalMl: number };

type Drink = { amountMl: number; at: string /* ISO timestamp */ };

type DayProgress = { amountMl: number; drinks: Drink[] };

type AppState = {
  children: Child[];
  activeChildId: string;
  // chave: `${childId}_${YYYY-MM-DD}`
  progress: Record<string, DayProgress>;
};
```

O reset diário é automático: cada dia vira uma chave nova em `progress`, sem
precisar zerar nada manualmente.

## MVP — tela única

- [x] Header discreto: nome da criança ativa + engrenagem (⚙️) só para o
      adulto configurar meta/perfis.
- [x] Aquário: nível da água = `amountMl / dailyGoalMl`, com animação de
      subida suave a cada toque.
- [x] Peixes nadando (SVG + CSS keyframes), várias no mesmo tanque para dar
      vida.
- [x] 3 botões fixos de copo (pouco / médio / cheio, sem texto — a criança
      ainda não lê): valores editáveis nos ajustes.
- [x] Sem números na tela principal para a criança — só o desenho subindo.
- [x] Celebração ao bater 100% da meta (🎉).
- [x] Reação animada ao beber: copo salta, gota flutua subindo, aquário dá
      um "gulp" (bounce + flash) e solta bolhas extras na água.
- [x] Modal de ajustes (adulto): definir meta diária em ml, editar nome da
      criança, **zerar a água de hoje**.
- [x] Persistência via `localStorage`, reset automático à meia-noite
      (baseado na data do dia).
- [x] PWA instalável (manifest + ícones + service worker básico).
- [ ] Editar os valores dos 3 tamanhos de copo (hoje fixos em 100/200/350 ml
      no código).
- [ ] Cadastrar/editar múltiplos perfis de criança pelos ajustes.

## Fora do MVP (backlog para depois)

- [ ] Notificação lembrando de beber água (Web Push — precisa de permissão
      do usuário e é limitado em iOS Safari).
- [ ] Histórico semanal simples (quantos dias a meta foi batida).
- [ ] Sons/vozes de incentivo ao tocar nos botões ou ao completar a meta.
- [ ] Múltiplos temas de aquário (dia/noite, fundo do mar, etc).
- [ ] Suporte a mais de uma criança com troca rápida de perfil na tela
      principal (hoje só troca pelos ajustes).
- [ ] Exportar/backup do progresso (ex: compartilhar um resumo por imagem).

## Decisões já tomadas

- Sem backend, sem login — 100% offline, um único dispositivo/navegador.
- App gratuito, sem anúncios previstos no MVP.
- Uma tela só; ajustes ficam atrás da engrenagem para não distrair a
  criança.
- PWA em vez de app nativo: instala direto do Safari/Chrome, sem loja e sem
  builds nativos; deploy é só dar push (Vercel builda e publica).
