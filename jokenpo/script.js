document.addEventListener('DOMContentLoaded', () => {

    // --- Seleção dos Elementos do DOM ---
    const menuInicialEl = document.getElementById('menu-inicial');
    const telaJogoEl = document.getElementById('tela-jogo');

    const btnMaquinaEl = document.getElementById('btn-maquina');
    const btnJogadorEl = document.getElementById('btn-jogador');
    const btnVoltarEl = document.getElementById('btn-voltar');

    const resultadoMensagemEl = document.getElementById('resultado-mensagem');
    const jogoAreaEl = document.getElementById('jogo-area');
    const escolhaJogador1El = document.getElementById('escolha-jogador1');
    const escolhaJogador2El = document.getElementById('escolha-jogador2');
    
    const nomeJogador1El = document.getElementById('nome-jogador1');
    const pontosJogador1El = document.getElementById('pontos-jogador1');
    const nomeJogador2El = document.getElementById('nome-jogador2');
    const pontosJogador2El = document.getElementById('pontos-jogador2');
    
    const cartas = document.querySelectorAll('.carta');

    // --- Variáveis de Estado do Jogo ---
    let modoDeJogo = null; // 'maquina' ou 'jogador'
    let pontosJogador1 = 0;
    let pontosJogador2 = 0;
    let podeJogar = true;

    // Estado para modo Jogador vs Jogador
    let turnoAtual = 1;
    let escolhaJogador1 = null;

    // Mapa de opções
    const opcoes = {
        pedra: { nome: 'Pedra', imagem: 'pedra.jpg' },
        papel: { nome: 'Papel', imagem: 'papel.jpg' },
        tesoura: { nome: 'Tesoura', imagem: 'tesoura.jpg' }
    };

    // --- Lógica de Navegação e Inicialização ---

    btnMaquinaEl.addEventListener('click', () => iniciarJogo('maquina'));
    btnJogadorEl.addEventListener('click', () => iniciarJogo('jogador'));
    btnVoltarEl.addEventListener('click', voltarAoMenu);

    function iniciarJogo(modo) {
        modoDeJogo = modo;
        menuInicialEl.classList.add('escondido');
        telaJogoEl.classList.remove('escondido');
        reiniciarEstado(); // Reseta placar e textos para o novo modo
    }

    function voltarAoMenu() {
        telaJogoEl.classList.add('escondido');
        menuInicialEl.classList.remove('escondido');
        modoDeJogo = null;
    }

    function reiniciarEstado() {
        pontosJogador1 = 0;
        pontosJogador2 = 0;
        escolhaJogador1 = null;
        turnoAtual = 1;
        podeJogar = true;
        
        // Atualiza nomes no placar
        nomeJogador1El.textContent = "Jogador 1";
        nomeJogador2El.textContent = (modoDeJogo === 'maquina') ? "Computador" : "Jogador 2";
        
        atualizarPlacarUI();
        resultadoMensagemEl.textContent = 'O jogo começou! Jogador 1, faça sua jogada.';
        jogoAreaEl.classList.remove('visivel');
    }

    // --- Lógica Principal do Clique na Carta ---
    
    cartas.forEach(carta => {
        carta.addEventListener('click', () => {
            if (!podeJogar) return;
            const escolha = carta.dataset.escolha;

            if (modoDeJogo === 'maquina') {
                jogarVsMaquina(escolha);
            } else {
                jogarVsJogador(escolha);
            }
        });
    });

    // --- Modos de Jogo ---

    async function jogarVsMaquina(escolhaUsuario) {
        podeJogar = false;
        
        const escolhaPC = getEscolhaComputador();
        const resultado = determinarVencedor(escolhaUsuario, escolhaPC);

        if (resultado === 'vitoria') pontosJogador1++;
        if (resultado === 'derrota') pontosJogador2++;

        await exibirResultados(escolhaUsuario, escolhaPC, resultado);
        
        atualizarPlacarUI();
        podeJogar = true;
    }

    async function jogarVsJogador(escolha) {
        if (turnoAtual === 1) {
            escolhaJogador1 = escolha;
            turnoAtual = 2;
            resultadoMensagemEl.textContent = `${nomeJogador2El.textContent}, é a sua vez!`;
            // Efeito visual para indicar que a jogada foi recebida
            jogoAreaEl.classList.remove('visivel');

        } else { // Turno do Jogador 2
            podeJogar = false; // Bloqueia jogadas enquanto o resultado é mostrado
            const escolhaJogador2 = escolha;
            const resultado = determinarVencedor(escolhaJogador1, escolhaJogador2);
            
            if (resultado === 'vitoria') pontosJogador1++;
            if (resultado === 'derrota') pontosJogador2++;

            await exibirResultados(escolhaJogador1, escolhaJogador2, resultado);
            
            atualizarPlacarUI();
            
            // Prepara para a próxima rodada
            turnoAtual = 1;
            escolhaJogador1 = null;
            setTimeout(() => {
                if(modoDeJogo === 'jogador'){
                   resultadoMensagemEl.textContent = 'Próxima rodada! Jogador 1, sua vez.';
                }
                podeJogar = true;
            }, 1500); // Dá um tempo para ver o resultado
        }
    }


    // --- Funções Auxiliares ---
    
    function getEscolhaComputador() {
        const chaves = Object.keys(opcoes);
        return chaves[Math.floor(Math.random() * chaves.length)];
    }

    function determinarVencedor(j1, j2) {
        if (j1 === j2) return 'empate';
        if (
            (j1 === 'pedra' && j2 === 'tesoura') ||
            (j1 === 'papel' && j2 === 'pedra') ||
            (j1 === 'tesoura' && j2 === 'papel')
        ) {
            return 'vitoria'; // Jogador 1/quem iniciou ganha
        }
        return 'derrota'; // Jogador 1/quem iniciou perde
    }
    
    function atualizarPlacarUI() {
        pontosJogador1El.textContent = pontosJogador1;
        pontosJogador2El.textContent = pontosJogador2;
    }

    async function exibirResultados(escolha1, escolha2, resultado) {
        // Mostra os resultados na tela
        jogoAreaEl.classList.remove('visivel');
        await esperar(100);

        escolhaJogador1El.innerHTML = `<img src="${opcoes[escolha1].imagem}" alt="${opcoes[escolha1].nome}"><p>${nomeJogador1El.textContent}</p>`;
        escolhaJogador2El.innerHTML = `<img src="${opcoes[escolha2].imagem}" alt="${opcoes[escolha2].nome}"><p>${nomeJogador2El.textContent}</p>`;

        // Limpa classes
        escolhaJogador1El.className = 'escolha';
        escolhaJogador2El.className = 'escolha';

        if (resultado === 'vitoria') {
            escolhaJogador1El.classList.add('vitoria');
            escolhaJogador2El.classList.add('derrota');
            resultadoMensagemEl.textContent = `${nomeJogador1El.textContent} venceu a rodada!`;
        } else if (resultado === 'derrota') {
            escolhaJogador1El.classList.add('derrota');
            escolhaJogador2El.classList.add('vitoria');
            resultadoMensagemEl.textContent = `${nomeJogador2El.textContent} venceu a rodada!`;
        } else {
            escolhaJogador1El.classList.add('empate');
            escolhaJogador2El.classList.add('empate');
            resultadoMensagemEl.textContent = 'A rodada terminou em empate!';
        }

        jogoAreaEl.classList.add('visivel');
    }

    function esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});