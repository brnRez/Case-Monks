# Entrega Case Técnico - .Monks

 >Referente ao Case do Processo Seletivo de Engineering Intern.

## Objetivo do Case

Você foi encarregado de construir uma aplicação web para gestores de uma
agência de Marketing Digital, onde serão exibidos dados de performance de
diversas contas da agência.

Para o desenvolvimento do case é disponibilizado para o candidato dois
arquivos .csv, um arquivo contendo as métricas de performance extraídas de
uma plataforma, e um arquivo contendo os usuários do sistema. O candidato
tem a liberdade de modificar estes dados conforme achar necessário.

## Abordagem Utilizada

A fim de deixar o processo melhor simplificado também para execução, optei por utilizar a biblioteca Pandas para criação de Dataframes para consumo dos dados em CSV, desta forma, seria possível apresentá-los devidamente para o Front-end, assim como também efetuar a autenticação dos acessos na planilha "Users.csv".

O Consumo do Front-End se dá por meio da paginação dos dados fornecidos, visto que o relatório se encontra com aproximadamente Um Milhão de linhas, carregá-lo de uma vez seria danoso para a performance, por conta disso, optei por seguir desta forma. Desta maneira, os dados são exibidos por páginas de 100 linhas cada.



## Como Executar
Graças ao Docker, foi possível simplificar a execução da aplicação, por meio de um Dockerfile junto a um docker-compose.yaml, sendo assim, para executar a aplicação, basta:

- Clonar este repositório:
`git clone https://github.com/brnRez/Case-Monks.git`
- Garantir de que o [Docker](https://docs.docker.com/desktop/setup/install/windows-install/) esteja instalado em sua máquina
- Abrir um terminal no diretório raíz da aplicação
- Executar o comando `docker-compose up --build`.

A API criada deverá subir na Porta `8000`, enquanto o Frontend subirá na porta `8080`.

Caso ajude, [também gravei um vídeo demonstrando a execução e teste do app.](https://youtu.be/XrWAygPgp-U)

## Requisitos Funcionais

- [X] A Aplicação deve possuir um sistema de login por e-mail e senha;
- [X]  O Frontend deve apresentar os dados para usuários em um formato tabelar;
    - [X]  Deve ser possível filtrar os dados por data;
    - [X]  Deve ser possível ordenar os dados por qualquer coluna escolhida;
- [X]  A Coluna “cost_micros” deve ser exibida apenas para usuários que tenham o papel “admin”, estando oculta para demais usuários.


## Endpoints

> A Aplicação conta com 2 endpoints
- `/Auth/Login` - Para autenticação de Acesso.
- `/Metrics/` - Para visualização do Relatório. Recebe os parâmetros base `page, size` e diversos parâmetros opcionais - `sort_by, sort_order, start_date, end_date`.


## Ferramentas Utilizadas
- Python 3.13.7
- FastAPI - Criação da API
- Pandas - Tratamento dos Dados
- OAuth2 - Autenticação
- Javascript/HTML/CSS - Construção do Frontend
- Docker - Conteinerização do App