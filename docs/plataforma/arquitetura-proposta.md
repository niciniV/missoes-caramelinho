# Arquitetura proposta

## 1. Objetivo

Expandir o site institucional para uma plataforma que permita:

- publicar diferentes módulos educativos;
- disponibilizar jogos desenvolvidos em GameMaker;
- permitir que professores criem atividades para suas turmas;
- coletar respostas sem exigir identificação das crianças;
- apresentar resultados agregados aos adultos autorizados;
- controlar a disponibilidade de módulos sensíveis.

## 2. Fluxo principal

```text
Professor entra na plataforma
        ↓
Escolhe um módulo
        ↓
Cria uma atividade
        ↓
Define informações opcionais, como nome interno e prazo
        ↓
Recebe um link opaco para compartilhar
        ↓
A criança acessa e joga sem cadastro
        ↓
O jogo envia respostas vinculadas à atividade
        ↓
O professor consulta resultados agregados
```

## 3. Conceitos principais

### Módulo

Representa um tema educativo, como alimentação saudável, saúde emocional ou cultura de paz.

Cada módulo deve possuir metadados como:

- título e descrição;
- faixa etária recomendada;
- ano ou etapa escolar recomendada, quando aplicável;
- nível de sensibilidade;
- necessidade de mediação de um adulto;
- status de publicação;
- versão do conteúdo e do jogo.

A faixa etária serve para orientar e filtrar o catálogo. O professor não precisa selecionar uma faixa etária separadamente ao criar a atividade.

### Atividade

É uma aplicação específica de um módulo criada por um professor.

Exemplos:

- “Alimentação saudável — turma 4º B — agosto”;
- “Saúde emocional — atividade antes da aula de sexta”;
- “Cultura de paz — avaliação inicial”.

A atividade deve guardar, no mínimo:

- professor responsável;
- organização ou escola, caso esse nível exista;
- versão exata do módulo;
- nome interno opcional;
- data de abertura;
- prazo ou data de encerramento opcional;
- estado: rascunho, aberta, encerrada ou arquivada;
- token público armazenado de forma segura.

### Link da atividade

O link deve conter apenas um identificador opaco e imprevisível.

Exemplo:

```text
https://dominio.exemplo/jogar/a/7KQ3M9XP
```

O identificador não deve revelar:

- nome do professor;
- escola;
- turma;
- módulo;
- faixa etária;
- qualquer informação sobre uma criança.

No servidor, o identificador resolve a atividade e, por consequência, o módulo correto e o agrupamento no qual as respostas serão registradas.

## 4. Componentes da solução

### Site público

Pode continuar usando Astro para:

- apresentação institucional;
- explicação do projeto;
- catálogo público de módulos;
- materiais gerais;
- informações sobre segurança e privacidade;
- acesso à área de professores.

### Área de professores

Responsável por:

- autenticação de adultos;
- consulta e filtro de módulos;
- criação, encerramento e arquivamento de atividades;
- cópia do link de compartilhamento;
- visualização de resultados agregados;
- exportação de relatórios, caso aprovada pelo cliente.

### Página de jogo

A rota pública recebe o token da atividade, consulta o servidor e carrega exclusivamente a versão autorizada do módulo.

Ela deve:

- validar se a atividade existe e está aberta;
- carregar o jogo correto;
- fornecer ao jogo um token de curta duração;
- bloquear acesso a módulos não associados à atividade;
- apresentar mensagens neutras para links inválidos ou expirados.

### API

A API deve atender funções como:

- autenticação dos adultos;
- gerenciamento de módulos;
- criação e gerenciamento de atividades;
- validação dos links públicos;
- recebimento das respostas;
- geração dos resultados agregados;
- gerenciamento das permissões administrativas.

### Banco de dados

Entidades iniciais sugeridas:

```text
organizations
adult_users
organization_memberships
modules
module_versions
assignments
submissions
response_events
audit_events
```

Não é necessária uma tabela de estudantes na primeira versão.

## 5. Estrutura de aplicação sugerida

```text
apps/
├── web/
│   ├── site-publico
│   ├── area-professores
│   └── pagina-jogo
└── api/
    ├── autenticacao
    ├── modulos
    ├── atividades
    ├── respostas
    └── relatorios

packages/
├── contratos
├── banco-de-dados
├── regras-de-modulos
├── componentes-visuais
└── agregacoes
```

A estrutura física final pode ser adaptada ao provedor de hospedagem e à equipe disponível. O ponto importante é manter separadas as responsabilidades do site público, da área autenticada, da execução do jogo e da coleta de dados.

## 6. Controle de módulos sensíveis

Módulos sensíveis não devem aparecer livremente para crianças.

Controles recomendados:

- o catálogo infantil não permite navegar por módulos;
- o módulo é carregado somente por uma atividade válida;
- o professor vê apenas módulos permitidos para sua organização;
- determinados módulos podem exigir habilitação administrativa;
- a versão do conteúdo fica registrada na atividade;
- alterações de conteúdo não modificam retroativamente atividades anteriores;
- ações administrativas importantes ficam registradas.

## 7. Autenticação

A recomendação inicial é autenticar somente adultos responsáveis pela criação e análise das atividades.

Autenticar pais ou responsáveis somente para intermediar o acesso ao jogo não traz benefício funcional para o escopo atual. Na prática, isso cria uma ligação entre uma conta familiar e as respostas da criança, além de aumentar suporte, cadastro, recuperação de acesso e responsabilidade sobre dados.

Essa decisão deve ser revista somente se surgir uma necessidade real de:

- progresso individual persistente;
- confirmação formal de participação;
- relatório individual para a família;
- autorização registrada por responsável;
- acompanhamento longitudinal da mesma criança.

## 8. Limites conscientes do modelo anônimo

Sem identificar participantes, a plataforma não consegue garantir:

- exatamente uma resposta por criança;
- quem realizou a atividade;
- que o link não foi compartilhado;
- comprovação individual de conclusão;
- continuidade individual entre atividades.

Esses limites são aceitáveis se o objetivo for análise agregada, discussão pedagógica e avaliação geral do conteúdo. Caso o cliente exija comprovação individual, será necessário rever o modelo de identidade.
