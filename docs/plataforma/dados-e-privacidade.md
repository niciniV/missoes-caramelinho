# Dados e privacidade

## 1. Princípio de projeto

A plataforma deve coletar apenas o necessário para disponibilizar a atividade, registrar escolhas e produzir resultados agregados.

A proposta inicial não cria identidade infantil, perfil persistente, pseudônimo de estudante ou vínculo entre diferentes atividades realizadas pela mesma criança.

Este documento é uma orientação de arquitetura e produto. A política final deve ser validada pelos responsáveis jurídicos e de proteção de dados do projeto.

## 2. Dados dos adultos

Adultos autenticados podem precisar fornecer:

- nome;
- e-mail institucional ou outro identificador de acesso;
- organização ou escola;
- função e permissões;
- registros administrativos relevantes, como criação e encerramento de atividades.

As permissões devem seguir a estrutura real do cliente e não uma hierarquia presumida.

## 3. Dados da atividade

Uma atividade pode registrar:

- identificador interno;
- adulto responsável;
- módulo e versão;
- nome interno opcional;
- escola ou organização, quando aplicável;
- abertura, prazo e encerramento;
- estado da atividade;
- token público armazenado de forma segura.

O token não deve carregar essas informações diretamente.

## 4. Dados enviados pelo jogo

Exemplo de envio mínimo:

```json
{
  "submissionId": "valor-aleatorio-de-uso-unico",
  "answers": [
    {
      "dilemmaId": "dilema-01",
      "answerId": "alternativa-b"
    }
  ]
}
```

O servidor identifica a atividade por meio de um token de curta duração gerado após a validação do link público.

### `submissionId`

Serve somente para impedir que a mesma transmissão seja registrada duas vezes por falha de rede ou repetição automática.

Não deve:

- representar a criança;
- ser reutilizado em outra atividade;
- ser associado a nome, e-mail ou cadastro;
- ser usado para criar histórico individual.

## 5. Informações que não devem ser solicitadas no MVP

- nome da criança;
- e-mail;
- CPF;
- matrícula escolar;
- data de nascimento;
- nome do responsável;
- conta familiar;
- apelido persistente;
- identificador de publicidade;
- impressão digital do navegador;
- localização precisa;
- texto livre.

## 6. Registros técnicos

Mesmo sem cadastro infantil, infraestrutura de hospedagem pode registrar automaticamente:

- endereço IP;
- horário de acesso;
- agente do navegador;
- erros da aplicação;
- identificadores de requisição.

A configuração deve minimizar esses registros nas rotas infantis:

- não copiar IP para o banco analítico;
- limitar retenção de logs de servidor e CDN;
- não usar ferramentas de replay de sessão;
- não usar publicidade ou rastreamento comportamental;
- evitar serviços de análise que criem perfis persistentes;
- revisar dados enviados a ferramentas de erro e observabilidade.

Por isso, a comunicação pública deve preferir a formulação:

> A plataforma não solicita nem cria identidade da criança, e os resultados apresentados são agregados.

Evitar prometer anonimato absoluto sem validar toda a cadeia de infraestrutura.

## 7. Relatórios

Relatórios para professores devem priorizar:

- total de conclusões recebidas;
- distribuição percentual das escolhas;
- resultados por dilema;
- identificação da atividade e do módulo;
- data ou período da atividade.

Não devem mostrar:

- sequência individual de uma criança;
- horários exatos de cada resposta;
- endereço IP;
- identificador técnico da submissão;
- tentativa de inferir quem respondeu.

Para grupos muito pequenos, deve ser considerada a ocultação ou simplificação de resultados que facilitem inferências sobre participantes.

## 8. Retenção

A retenção precisa ser decidida pelo cliente e validada pelos responsáveis por proteção de dados.

Estratégia recomendada:

1. registros detalhados ficam disponíveis somente pelo tempo necessário para processamento e correção de falhas;
2. depois desse prazo, são removidos ou consolidados;
3. resultados agregados podem ser mantidos pelo período necessário à finalidade institucional;
4. atividades encerradas podem ser arquivadas sem manter dados técnicos desnecessários;
5. exclusões e alterações administrativas relevantes devem ser registradas.

## 9. Contagem e duplicidade

Sem identidade, a plataforma não consegue provar que cada criança respondeu uma única vez.

Podem ser usados controles técnicos moderados para reduzir abuso, sem criar perfil infantil:

- token de atividade imprevisível;
- prazo de encerramento;
- limitação de requisições anormais;
- deduplicação da mesma transmissão;
- detecção de volumes muito acima do esperado;
- encerramento manual pelo professor.

Esses mecanismos não devem ser apresentados como comprovação individual de participação.

## 10. Módulos sensíveis

Módulos sensíveis exigem decisões adicionais sobre:

- aprovação do conteúdo;
- público recomendado;
- profissionais autorizados;
- mediação de adultos;
- comunicação às famílias;
- disponibilidade por organização;
- retenção e uso das respostas;
- encaminhamento de situações de risco, especialmente se futuramente houver texto livre.

O acesso ao módulo deve ser determinado no servidor pela atividade válida, nunca apenas por um parâmetro modificável no navegador.

## 11. Mudanças que exigem nova análise

A arquitetura de privacidade deve ser revista antes de implementar:

- contas de pais ou responsáveis vinculadas às respostas;
- contas infantis;
- códigos individuais distribuídos a estudantes;
- histórico entre atividades;
- pontuação persistente;
- recomendações personalizadas;
- relatórios individuais;
- integração com matrícula escolar;
- campos de texto ou áudio enviados pela criança;
- pesquisa acadêmica com dados individualizados.
