# Calculadora React

Projeto de calculadora feita com HTML, CSS, JavaScript, React via CDN e um servidor Python simples para registrar operacoes em arquivo.

## Funcionalidades

- Calculadora normal com soma, subtracao, multiplicacao, divisao e decimal.
- Calculadora cientifica com `sin`, `cos`, `tan`, `sqrt`, `log`, `ln`, `pi`, `e`, `%`, parenteses e potencia.
- Switch para alternar entre modo normal e modo cientifico.
- Tema claro e escuro.
- Efeitos visuais em botoes, display, modal e troca de modo.
- Registro das operacoes no arquivo `ARQUIVOX.txt`.
- Modal com os ultimos 5 registros salvos.

## Estrutura

```text
.
+-- index.html       # Estrutura base e importacao do React via CDN
+-- script.js        # Aplicacao React e logica da calculadora
+-- style.css        # Estilos, temas e animacoes
+-- servidor.py      # Servidor HTTP e rotas de historico
+-- ARQUIVOX.txt     # Arquivo onde as operacoes sao registradas
```

## Requisitos

- Python 3 instalado.
- Navegador com acesso a internet para carregar React e ReactDOM pelo CDN do `unpkg`.

## Como Rodar

No terminal, dentro da pasta do projeto:

```bash
python servidor.py
```

Depois acesse no navegador:

```text
http://127.0.0.1:3000
```

## Como Usar

1. Use a calculadora normalmente pelos botoes da tela.
2. Clique em `Normal` ou `Cientifica` para alternar o modo.
3. Clique em `=` para calcular.
4. Clique em `Ultimos registros` para abrir o modal com as 5 operacoes mais recentes.
5. Use o switch `LIGHT / DARK` para alternar o tema.

## Historico

Quando uma operacao e calculada, o navegador envia o registro para a rota:

```text
POST /registrar-operacao
```

O servidor salva a operacao em `ARQUIVOX.txt`.

Para exibir os ultimos registros, a aplicacao consulta:

```text
GET /ultimos-registros
```

Essa rota retorna os ultimos 5 registros do arquivo.

## Observacoes

- O resultado da calculadora recebe `+1` depois do calculo, conforme a regra atual do projeto.
- Funcoes trigonometricas usam o comportamento nativo do JavaScript, ou seja, valores em radianos.
- Se abrir apenas o `index.html` sem rodar o servidor, a calculadora aparece, mas o historico nao sera salvo nem carregado.
