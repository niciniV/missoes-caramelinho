# Decisões para validação com o cliente

Este documento reúne as decisões de produto, operação e governança que precisam ser confirmadas antes da implementação completa.

A apresentação ao cliente deve evitar aprofundamento técnico. O objetivo é confirmar como a plataforma será usada, quem poderá fazer o quê e qual nível de acompanhamento realmente é necessário.

## 1. Qual é a finalidade principal das respostas?

Escolher uma ou mais opções:

- apoiar uma conversa posterior em sala de aula;
- entender tendências gerais da turma;
- avaliar se o conteúdo do jogo foi compreendido;
- medir resultados de uma ação educativa;
- produzir indicadores da escola ou do município;
- identificar crianças que precisam de acompanhamento individual.

### Por que essa decisão importa

As cinco primeiras finalidades podem funcionar com respostas agregadas e sem identificação das crianças.

A última finalidade exige outro modelo, com identificação ou pseudonimização, regras de acesso mais rígidas e maior responsabilidade sobre dados pessoais.

### Recomendação inicial

Trabalhar com resultados agregados e não usar a plataforma para decisões individuais sobre crianças.

---

## 2. É necessário comprovar que cada criança realizou a atividade?

Possibilidades:

- não; basta receber um conjunto aproximado de respostas;
- é útil saber quantas pessoas concluíram, sem saber quem;
- é obrigatório confirmar a participação de cada estudante.

### Impacto

Se não houver necessidade de confirmação individual, o link anônimo é suficiente.

Se for obrigatório confirmar cada participação, será necessário criar códigos individuais, integração com dados escolares ou contas vinculadas a responsáveis. Isso muda significativamente o custo, a privacidade e a operação do projeto.

### Recomendação inicial

Não exigir comprovação individual na primeira versão.

---

## 3. Quem cria as atividades?

Confirmar quais pessoas terão acesso:

- professores;
- profissionais da saúde;
- coordenadores pedagógicos;
- diretores;
- equipe da secretaria;
- equipe responsável pelo conteúdo.

### Pergunta complementar

Todos podem criar qualquer atividade ou alguns módulos devem ser restritos?

### Recomendação inicial

Começar com dois níveis simples:

- **Usuário responsável:** cria atividades e consulta os próprios resultados;
- **Administrador:** gerencia usuários, módulos e resultados institucionais.

Criar novos papéis apenas se a estrutura real da organização exigir.

---

## 4. Quem pode consultar os resultados?

Definir se cada grupo poderá ver:

- apenas suas próprias atividades;
- todas as atividades de uma escola;
- resultados combinados de várias escolas;
- indicadores gerais do município;
- respostas brutas ou somente consolidadas.

### Recomendação inicial

Professores veem somente as próprias atividades. Administradores autorizados podem ver resultados agregados mais amplos.

---

## 5. Quais informações o professor preenche ao criar uma atividade?

Opções possíveis:

- módulo;
- nome interno da atividade;
- turma ou grupo, em texto livre;
- escola;
- data de abertura;
- prazo;
- observação interna.

### Recomendação inicial

Exigir apenas o módulo. Os demais campos devem ser opcionais ou preenchidos automaticamente conforme a conta do professor.

Não pedir idade da turma como uma seleção obrigatória. A idade é uma recomendação associada ao módulo e pode ser usada para filtrar o catálogo.

---

## 6. Como funcionará o prazo da atividade?

Possibilidades:

- o link não expira até o professor encerrá-lo;
- o professor informa um prazo;
- toda atividade recebe um prazo padrão;
- a atividade é encerrada automaticamente após o primeiro uso ou após um número definido de respostas.

### Recomendação inicial

Permitir um prazo opcional e oferecer encerramento manual. A interface deve deixar claro quando a atividade está aberta ou encerrada.

---

## 7. O cliente aceita os limites de uma atividade sem identificação?

Confirmar que o modelo inicial não garante:

- uma única resposta por criança;
- a identidade de quem respondeu;
- que o link não foi repassado;
- comprovação individual de conclusão;
- comparação da mesma criança ao longo do tempo.

### Recomendação inicial

Registrar formalmente que o objetivo é análise agregada, não controle de presença ou avaliação individual.

---

## 8. Pais ou responsáveis precisam ter uma área própria?

Separar duas necessidades diferentes:

1. disponibilizar materiais educativos para famílias;
2. criar uma conta familiar vinculada às respostas da criança.

A primeira pode existir sem autenticação.

A segunda cria um relacionamento persistente entre família, criança e atividade e só deve ser adotada quando houver uma finalidade clara.

### Recomendação inicial

Disponibilizar materiais familiares de forma pública. Não criar contas de responsáveis para intermediar o acesso ao jogo na primeira versão.

---

## 9. Como módulos sensíveis serão liberados?

Confirmar:

- quem aprova o conteúdo;
- quais organizações podem usá-lo;
- quais profissionais podem criar atividades;
- se é obrigatória mediação de um adulto;
- se há orientação específica para famílias;
- se o módulo fica oculto até ser habilitado.

### Recomendação inicial

Módulos sensíveis devem ter aprovação, versão registrada, habilitação administrativa e regras explícitas de mediação.

---

## 10. Quais relatórios são realmente necessários?

Possibilidades:

- quantidade de acessos;
- quantidade de conclusões;
- distribuição das escolhas em cada dilema;
- comparação entre atividades;
- comparação entre escolas;
- exportação em PDF;
- exportação em planilha;
- relatório individual.

### Recomendação inicial

Primeira versão:

- total de conclusões;
- distribuição agregada por dilema;
- visualização por atividade;
- exportação agregada somente se houver necessidade operacional confirmada.

Não incluir relatório individual.

---

## 11. Por quanto tempo os dados serão mantidos?

O cliente deve definir:

- prazo dos registros detalhados;
- prazo dos resultados agregados;
- quem pode solicitar exclusão;
- se uma atividade arquivada continua aparecendo nos relatórios;
- se dados serão usados para pesquisa ou publicação.

### Recomendação inicial

Definir um prazo curto para registros detalhados e manter somente agregados pelo período necessário. A política final deve ser validada pelos responsáveis por proteção de dados.

---

## 12. As respostas poderão incluir texto livre?

Texto livre pode conter espontaneamente nomes, relatos pessoais, informações de saúde ou situações de violência.

### Recomendação inicial

Usar somente alternativas previamente definidas na primeira versão. Qualquer campo de texto livre deve passar por uma análise específica de risco, moderação, encaminhamento e acesso.

---

## 13. Haverá uso do jogo fora das atividades criadas por professores?

Possibilidades:

- somente por links de atividades;
- demonstração pública sem coleta de respostas;
- uso livre por famílias;
- uso em eventos e espaços de saúde.

### Recomendação inicial

Separar claramente:

- **modo demonstração:** sem vínculo com turma e sem relatório;
- **modo atividade:** com link criado por adulto autenticado e respostas agregadas.

---

## 14. Quem será responsável pela operação cotidiana?

Confirmar quem fará:

- criação e bloqueio de contas;
- atendimento a professores;
- publicação de módulos;
- correção de conteúdo;
- análise de incidentes;
- atendimento de solicitações sobre dados;
- aprovação de relatórios institucionais.

Sem essas definições, funções administrativas podem ser construídas para pessoas que não existem ou deixar responsabilidades importantes sem responsável.

---

## Decisões recomendadas para o MVP

| Tema | Recomendação |
|---|---|
| Identidade infantil | Não criar |
| Conta de responsável | Não criar para acesso ao jogo |
| Acesso infantil | Link opaco de atividade |
| Tipo de uso | Assíncrono, individual e sem multiplayer |
| Escolha do professor | Selecionar somente o módulo |
| Idade | Filtro e recomendação do módulo |
| Resultados | Agregados por atividade |
| Texto livre | Não incluir |
| Papéis iniciais | Usuário responsável e administrador |
| Módulos sensíveis | Habilitação e aprovação específicas |
| Progresso individual | Fora do MVP |
