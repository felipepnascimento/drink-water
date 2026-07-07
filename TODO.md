# Aquário da Sede — plano e TODO

App em React Native (Expo) para incentivar uma criança pequena a beber água.
Tela única com um aquário animado: a água sobe conforme a criança bebe, até
bater a meta diária. Sem backend — tudo salvo no aparelho.

Código (variáveis, componentes, arquivos) em **inglês**. Textos exibidos na
tela em **pt-BR**.

## Stack

- Expo (React Native + TypeScript)
- `AsyncStorage` para persistência local (sem backend, sem conta)
- `react-native-svg` para os peixes/plantas vetoriais
- `react-native-reanimated` (ou `Animated` da própria RN) para o nível da
  água e a natação dos peixes

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

- [ ] Header discreto: nome da criança ativa + engrenagem (⚙️) só para o
      adulto configurar meta/perfis.
- [ ] Aquário: nível da água = `amountMl / dailyGoalMl`, com animação de
      subida suave a cada toque.
- [ ] Peixes nadando (SVG + `Animated`), várias no mesmo tanque para dar vida.
- [ ] 3 botões fixos: **Pouca** (+100 ml) / **Média** (+200 ml) / **Muita**
      (+350 ml) — valores editáveis nos ajustes.
- [ ] Sem números na tela principal para a criança — só o desenho subindo.
- [ ] Celebração ao bater 100% da meta (confete simples / peixe "feliz").
- [ ] Modal de ajustes (adulto): definir meta diária em ml, cadastrar/editar
      perfis de criança, editar os valores dos 3 botões.
- [ ] Persistência via AsyncStorage, reset automático à meia-noite (baseado
      na data do dia).

## Fora do MVP (backlog para depois)

- [ ] Notificação lembrando de beber água (`expo-notifications`, ainda sem
      backend).
- [ ] Histórico semanal simples (quantos dias a meta foi batida).
- [ ] Sons/vozes de incentivo ao tocar nos botões ou ao completar a meta.
- [ ] Múltiplos temas de aquário (dia/noite, fundo do mar, etc).
- [ ] Suporte a mais de uma criança com troca rápida de perfil na tela
      principal (hoje só troca pelos ajustes).
- [ ] Exportar/backup do progresso (ex: compartilhar um resumo por imagem).

## Decisões já tomadas

- Sem backend, sem login — 100% offline, um único dispositivo.
- App gratuito, sem anúncios previstos no MVP.
- Uma tela só; ajustes ficam atrás da engrenagem para não distrair a
  criança.
- Mockup visual de referência: ver artifact "Aquário da Sede — mockup"
  (aquario-mockup.html no scratchpad da sessão que gerou este plano).
