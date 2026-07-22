# Integração com GameMaker

## 1. Objetivo

Permitir que os jogos desenvolvidos em GameMaker funcionem como módulos da plataforma sem conhecer dados de professores, escolas ou crianças.

O jogo deve receber apenas o contexto técnico necessário para executar a atividade e enviar respostas válidas.

## 2. Carregamento do jogo

Fluxo sugerido:

```text
Criança abre o link da atividade
        ↓
A plataforma valida o token público
        ↓
A plataforma identifica a versão do módulo
        ↓
É gerado um token de jogo de curta duração
        ↓
A página carrega o export HTML5 do GameMaker
        ↓
O jogo envia respostas autorizadas pela atividade
```

O token público não deve ser repassado diretamente para todas as chamadas do jogo. Depois da validação inicial, a plataforma pode gerar um token curto e limitado às operações de jogo.

## 3. Versionamento

Cada atividade deve apontar para uma versão exata do módulo.

Exemplo:

```text
alimentacao-saudavel@1.2.0
```

Isso evita combinar respostas produzidas por textos, dilemas ou alternativas diferentes.

Um manifesto de versão pode conter:

```json
{
  "module": "alimentacao-saudavel",
  "version": "1.2.0",
  "buildUrl": "/games/alimentacao-saudavel/1.2.0/",
  "eventSchemaVersion": "1",
  "status": "published"
}
```

Builds publicados não devem ser substituídos silenciosamente. Uma mudança pedagógica relevante gera uma nova versão.

## 4. Contrato de eventos

O jogo deve usar identificadores estáveis definidos pelo conteúdo:

- `activityId`: minijogo ou etapa;
- `dilemmaId`: dilema apresentado;
- `answerId`: alternativa escolhida;
- `eventId` ou `submissionId`: identificador técnico de uso único;
- `sequence`: opcional, para ordenar eventos em conexões instáveis.

Exemplo de resposta individual:

```json
{
  "eventId": "evento-aleatorio",
  "activityId": "onibus-escolar",
  "dilemmaId": "conflito-01",
  "answerId": "pedir-ajuda"
}
```

Exemplo de envio final:

```json
{
  "submissionId": "envio-aleatorio",
  "answers": [
    {
      "dilemmaId": "conflito-01",
      "answerId": "pedir-ajuda"
    },
    {
      "dilemmaId": "travessia-01",
      "answerId": "esperar-sinal"
    }
  ]
}
```

## 5. Validação no servidor

A API não deve aceitar livremente qualquer identificador enviado pelo navegador.

Ao receber uma resposta, deve confirmar:

- atividade aberta;
- token válido;
- módulo e versão corretos;
- dilema pertencente à versão;
- alternativa pertencente ao dilema;
- formato e tamanho esperados;
- ausência de duplicidade técnica.

A atividade deve ser derivada do token validado, e não de um `assignmentId` informado pelo jogo.

## 6. Conexões instáveis

Como as crianças podem jogar em casa, a solução deve tolerar interrupções de rede.

Alternativas:

- guardar respostas temporariamente no navegador;
- tentar novamente quando a conexão retornar;
- enviar tudo ao final;
- enviar checkpoints e repetir somente o que falhou;
- usar identificadores idempotentes para não duplicar registros.

A experiência não deve travar a cada resposta aguardando o servidor, salvo quando isso for essencial ao funcionamento do jogo.

## 7. Adaptador de plataforma

Recomenda-se que o código do jogo dependa de uma interface simples, e não diretamente de detalhes do site.

Exemplo conceitual:

```text
startActivity()
submitAnswer(dilemmaId, answerId)
completeActivity(answers)
reportTechnicalError(code)
```

No HTML5, essa interface pode ser implementada por chamadas HTTP do GameMaker ou por uma extensão JavaScript que se comunica com a página hospedeira.

A escolha técnica pode ser feita durante um protótipo. O contrato de eventos deve permanecer igual para evitar acoplamento.

## 8. Conteúdo e respostas

Na primeira versão:

- usar somente alternativas predefinidas;
- não enviar nomes ou apelidos;
- não enviar texto livre;
- não enviar dados da conta do professor ao jogo;
- não armazenar histórico individual no navegador além do necessário para concluir a atividade;
- limpar dados temporários após conclusão ou expiração.

## 9. Modos de execução

Podem existir dois modos claramente separados:

### Modo demonstração

- acesso público ou institucional;
- sem vínculo com uma atividade;
- sem relatório para professor;
- respostas descartadas ou não coletadas.

### Modo atividade

- aberto por link criado por adulto autenticado;
- módulo e versão definidos pela atividade;
- respostas agrupadas para relatório;
- atividade sujeita a abertura, prazo e encerramento.

## 10. Testes mínimos

Antes de publicar um módulo:

- o link carrega somente a versão correta;
- atividade encerrada não recebe novas respostas;
- uma alternativa inexistente é rejeitada;
- repetição da mesma requisição não duplica dados;
- perda de rede não perde silenciosamente as escolhas;
- o jogo não recebe dados pessoais desnecessários;
- o relatório agrega corretamente as respostas;
- versões diferentes não são misturadas.
