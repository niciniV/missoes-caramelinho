# ADR 0001 — Acesso anônimo por atividade

- **Status:** proposta recomendada
- **Data:** 2026-07-22
- **Escopo:** primeira versão da plataforma

## Contexto

Professores precisam selecionar um módulo, compartilhar uma atividade para ser realizada de forma assíncrona e consultar as respostas agrupadas.

As crianças não precisam jogar simultaneamente, não existe multiplayer e não foi identificada necessidade de histórico individual, personalização persistente ou relatório por estudante.

Foi considerada a possibilidade de autenticar pais ou responsáveis para liberar o acesso da criança. Entretanto, no escopo atual, essa autenticação não atende a uma necessidade funcional adicional. Ela cria uma ligação entre uma conta familiar e a participação da criança, além de aumentar cadastro, suporte, recuperação de acesso e governança de dados.

## Decisão recomendada

Autenticar somente os adultos que criam e consultam atividades.

Cada atividade recebe um identificador público opaco e imprevisível. Esse identificador resolve, no servidor:

- o adulto responsável;
- a organização, quando aplicável;
- o módulo e sua versão;
- o período de disponibilidade;
- o agrupamento das respostas.

A criança acessa o link sem criar conta e sem informar identidade ou pseudônimo persistente.

As respostas são registradas somente no contexto da atividade e apresentadas de forma agregada.

## Consequências positivas

- menor atrito para crianças e famílias;
- menor quantidade de dados pessoais;
- ausência de senha e recuperação de conta infantil;
- ausência de vínculo persistente entre atividades da mesma criança;
- fluxo simples para dever de casa;
- módulo correto selecionado automaticamente pelo link;
- agrupamento das respostas sem expor dados no endereço;
- menor custo de suporte e administração.

## Limitações aceitas

- não é possível comprovar quem realizou a atividade;
- não é possível garantir uma resposta por criança;
- o link pode ser compartilhado;
- não existe histórico individual;
- não existe retomada vinculada à mesma pessoa em outro dispositivo;
- não existe relatório individual para professor ou responsável.

Essas limitações são compatíveis com análise agregada e discussão pedagógica. Não são compatíveis com presença formal, avaliação individual ou acompanhamento longitudinal.

## Medidas de proteção

- tokens com entropia suficiente e sem dados legíveis;
- armazenamento seguro do token;
- prazo opcional e encerramento manual;
- validação do módulo no servidor;
- deduplicação técnica de transmissões repetidas;
- limitação de tráfego anormal;
- minimização de logs nas páginas infantis;
- ausência de ferramentas de publicidade ou perfil comportamental;
- relatórios agregados;
- versionamento dos módulos.

## Alternativas consideradas

### Conta de pai ou responsável

Rejeitada para o MVP porque não existe finalidade funcional que justifique associar uma família às respostas. Pode ser reconsiderada se houver área familiar autenticada, autorização formal registrada ou relatório individual destinado ao responsável.

### Conta infantil ou integração com matrícula

Rejeitada para o MVP porque adiciona identificação persistente sem necessidade atual. Pode ser reconsiderada se houver progresso individual, personalização, presença formal ou intervenção direcionada.

### Código individual de uso único

Não adotado no MVP porque o objetivo não exige controlar uma participação por estudante. Pode ser reconsiderado se for necessário contabilizar conclusões individuais sem criar uma conta completa.

## Condições para rever a decisão

Este ADR deve ser revisto se o cliente confirmar qualquer um dos seguintes requisitos:

- comprovar que cada estudante realizou a atividade;
- impedir mais de uma participação por estudante;
- comparar a mesma criança antes e depois de uma ação;
- manter progresso entre módulos;
- gerar relatório individual;
- oferecer recomendações personalizadas;
- registrar autorização do responsável ligada à participação;
- integrar com cadastro escolar;
- usar respostas para decisões individuais sobre a criança.

## Decisões ainda pendentes

A adoção desta arquitetura não resolve automaticamente:

- quais papéis adultos existirão;
- quem poderá ver resultados de escola ou município;
- quanto tempo dados detalhados e agregados serão mantidos;
- quais módulos exigirão habilitação especial;
- quais relatórios serão exportáveis;
- se haverá modo de demonstração sem coleta;
- quem será responsável pela operação e por solicitações relativas a dados.

Esses pontos devem ser definidos com o cliente antes da implementação final.
