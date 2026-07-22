# Plataforma Missões Caramelinho

Esta pasta reúne a proposta inicial para transformar o site institucional em uma plataforma com jogos educativos, área de professores e coleta de respostas agregadas.

A documentação parte das seguintes premissas já discutidas:

- apenas adultos responsáveis pela atividade precisam se autenticar;
- cada atividade gera um link opaco e temporário;
- o link representa uma atividade específica, e não uma criança;
- as crianças jogam de forma assíncrona, normalmente em casa;
- não há multiplayer;
- não há cadastro, pseudônimo persistente ou histórico individual da criança;
- a idade é uma característica orientadora do módulo, usada para filtro e comunicação, e não uma seleção adicional ao criar a atividade;
- as respostas são agrupadas pela atividade e apresentadas de forma agregada.

## Documentos

- [Arquitetura proposta](./arquitetura-proposta.md): visão dos componentes e do fluxo principal.
- [Decisões para validação](./decisoes-para-validacao.md): perguntas que precisam ser respondidas pelo cliente antes da implementação completa.
- [Dados e privacidade](./dados-e-privacidade.md): modelo de coleta mínima, relatórios e retenção.
- [Integração com GameMaker](./integracao-gamemaker.md): contrato sugerido entre o jogo e a plataforma web.
- [ADR 0001 — acesso anônimo por atividade](./registro-decisoes/0001-acesso-anonimo-por-atividade.md): registro da decisão recomendada e das condições que poderiam alterá-la.

## Status

Esta documentação descreve uma proposta para validação. Ela não substitui a validação pedagógica, administrativa, jurídica ou de proteção de dados realizada pelo município e pelos responsáveis pelo projeto.
