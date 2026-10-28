const liquidoSelect = document.getElementById("liquido");
const modoSelect = document.getElementById("modo");
const temperaturaInput = document.getElementById("temperatura");
const temperaturaValor = document.getElementById("temperatura-valor");
const phTexto = document.getElementById("ph");
const ponteiro = document.getElementById("ponteiro");
const tipoPh = document.getElementById("tipo");
const nomeLiquido = document.getElementById("nome-liquido");
const volumeAtual = document.getElementById("volume-atual");
const variacaoVolume = document.getElementById("variacao-volume");
const explicacao = document.getElementById("explicacao");
const liquidoVisual = document.getElementById("liquido-visual");
const pistao = document.getElementById("pistao");
const estadoTermico = document.getElementById("estado-termico");
const reiniciar = document.getElementById("reiniciar");
const liquidoMistura1 = document.getElementById("liquido-mistura-1");
const liquidoMistura2 = document.getElementById("liquido-mistura-2");
const volumeMistura1 = document.getElementById("volume-mistura-1");
const volumeMistura2 = document.getElementById("volume-mistura-2");
const phMistura = document.getElementById("ph-mistura");
const tipoMistura = document.getElementById("tipo-mistura");
const ponteiroMistura = document.getElementById("ponteiro-mistura");
const resumoMistura = document.getElementById("resumo-mistura");
const explicacaoMistura = document.getElementById("explicacao-mistura");
const liquidoMisturaVisual = document.getElementById("liquido-mistura-visual");
const copoMistura = document.getElementById("copo-mistura");
const volumeTotalMistura = document.getElementById("volume-total-mistura");

const amostras = {
    cola: { nome: "Refrigerante de cola", ph: 2.5, cor: "#9a5b35", expansao: 0.00025 },
    urina: { nome: "Urina (referência aproximada)", ph: 6, cor: "#e8c94a", expansao: 0.00025 },
    saliva: { nome: "Saliva (referência aproximada)", ph: 6.8, cor: "#9dd8cf", expansao: 0.00025 },
    agua: { nome: "Água", ph: 7, cor: "#43b8d5", expansao: 0 },
    "limão": { nome: "Suco de limão", ph: 2, cor: "#c6d94b", expansao: 0.00025 },
    acidobateria: { nome: "Ácido de bateria (referência)", ph: 0.5, cor: "#e96369", expansao: 0.00025 },
    vinagre: { nome: "Vinagre", ph: 2.9, cor: "#d5a44a", expansao: 0.00025 },
    energetico: { nome: "Energético", ph: 3.3, cor: "#b666d0", expansao: 0.00025 },
    vinho: { nome: "Vinho", ph: 3.5, cor: "#9c3f63", expansao: 0.00025 },
    sangue: { nome: "Sangue (referência aproximada)", ph: 7.4, cor: "#c74252", expansao: 0.00025 },
    cerveja: { nome: "Cerveja", ph: 4.5, cor: "#c89037", expansao: 0.00025 },
    soro: { nome: "Solução fisiológica", ph: 6, cor: "#b7e4eb", expansao: 0.00025 },
    claraovo: { nome: "Clara de ovo", ph: 8.5, cor: "#e6dfbc", expansao: 0.00025 },
    detergente: { nome: "Detergente neutro", ph: 7, cor: "#4fa5a0", expansao: 0.00025 },
    leitemagnesia: { nome: "Leite de magnésia", ph: 10.5, cor: "#e6e8df", expansao: 0.00025 },
    aguasanitaria: { nome: "Água sanitária (referência)", ph: 12.5, cor: "#d8e3b0", expansao: 0.00025 },
    sodacaustica: { nome: "Soda cáustica diluída (referência)", ph: 13, cor: "#d6a8ef", expansao: 0.00025 },
};

const volumeInicial = 250;
const temperaturaInicial = 20;

function preencherOpcoesMistura(select) {
    Object.entries(amostras).forEach(([valor, amostra]) => {
        const opcao = document.createElement("option");
        opcao.value = valor;
        opcao.textContent = amostra.nome;
        select.append(opcao);
    });
}

function densidadeAgua(temperatura) {
    return 1000 * (1 - ((temperatura + 288.9414) / (508929.2 * (temperatura + 68.12963))) *
        (temperatura - 3.9863) ** 2);
}

function obterVolume(amostra, temperatura) {
    if (amostra === amostras.agua) {
        return volumeInicial * densidadeAgua(temperaturaInicial) / densidadeAgua(temperatura);
    }

    return volumeInicial * (1 + amostra.expansao * (temperatura - temperaturaInicial));
}

function atualizarPh(amostra) {
    phTexto.textContent = amostra.ph.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
    nomeLiquido.textContent = amostra.nome;

    const posicao = (amostra.ph / 14) * 100;
    ponteiro.style.left = `${posicao}%`;
    ponteiro.setAttribute("aria-label", `pH ${amostra.ph.toLocaleString("pt-BR")}`);

    if (amostra.ph < 7) {
        tipoPh.textContent = "Ácido";
        tipoPh.className = "etiqueta-ph acido";
    } else if (amostra.ph > 7) {
        tipoPh.textContent = "Básico";
        tipoPh.className = "etiqueta-ph basico";
    } else {
        tipoPh.textContent = "Neutro";
        tipoPh.className = "etiqueta-ph neutro";
    }
}

function atualizarVolume(amostra, temperatura) {
    const volumeCalculado = obterVolume(amostra, temperatura);
    const sistemaMovel = modoSelect.value === "movel";
    const volumeExibido = sistemaMovel ? volumeCalculado : volumeInicial;
    const variacao = volumeExibido - volumeInicial;
    const variacaoFormatada = `${variacao > 0 ? "+" : ""}${variacao.toLocaleString("pt-BR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })} mL`;

    temperaturaValor.value = `${temperatura} °C`;
    temperaturaValor.textContent = `${temperatura} °C`;
    volumeAtual.textContent = `${volumeExibido.toLocaleString("pt-BR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })} mL`;
    variacaoVolume.textContent = variacaoFormatada;
    variacaoVolume.classList.toggle("variacao-positiva", variacao > 0.05);
    variacaoVolume.classList.toggle("variacao-negativa", variacao < -0.05);
    liquidoVisual.style.backgroundColor = amostra.cor;
    liquidoVisual.style.height = `${Math.min(82, Math.max(28, 48 + variacao * 1.8))}%`;
    pistao.classList.toggle("oculto", !sistemaMovel);
    estadoTermico.textContent = temperatura < temperaturaInicial
        ? "Amostra resfriada"
        : temperatura > temperaturaInicial
            ? "Amostra aquecida"
            : "Temperatura de referência";

    if (!sistemaMovel) {
        explicacao.textContent = "No recipiente rígido, as paredes não se movem: o volume permanece em 250 mL. Ao aquecer ou resfriar, a pressão pode mudar.";
    } else if (amostra === amostras.agua && temperatura < temperaturaInicial) {
        explicacao.textContent = "A água tem um comportamento especial: entre 4 °C e 20 °C, ela se contrai ao resfriar; abaixo de cerca de 4 °C, começa a se expandir. O modelo considera água líquida.";
    } else {
        explicacao.textContent = "No sistema fechado com pistão móvel, a massa da amostra permanece constante e o pistão acompanha a expansão ou contração estimada do líquido.";
    }
}

function obterTipoPh(ph) {
    if (ph < 7) {
        return { texto: "Ácido", classe: "acido" };
    }

    if (ph > 7) {
        return { texto: "Básico", classe: "basico" };
    }

    return { texto: "Neutro", classe: "neutro" };
}

function formatarVolume(volume) {
    return volume.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
}

function misturarCores(primeiraCor, segundaCor, proporcaoPrimeira) {
    const canaisPrimeira = primeiraCor.match(/[a-f\d]{2}/gi).map((canal) => parseInt(canal, 16));
    const canaisSegunda = segundaCor.match(/[a-f\d]{2}/gi).map((canal) => parseInt(canal, 16));
    const canaisMisturados = canaisPrimeira.map((canal, indice) =>
        Math.round(canal * proporcaoPrimeira + canaisSegunda[indice] * (1 - proporcaoPrimeira))
    );

    return `rgb(${canaisMisturados.join(", ")})`;
}

function obterExplicacaoMistura(primeiraAmostra, segundaAmostra, primeiroVolume, segundoVolume, phFinal, classificacao) {
    const primeiraAcida = primeiraAmostra.ph < 7;
    const segundaAcida = segundaAmostra.ph < 7;
    const primeiraBasica = primeiraAmostra.ph > 7;
    const segundaBasica = segundaAmostra.ph > 7;
    const descricaoVolumes = `${formatarVolume(primeiroVolume)} mL de ${primeiraAmostra.nome} e ${formatarVolume(segundoVolume)} mL de ${segundaAmostra.nome}`;

    if ((primeiraAcida && segundaBasica) || (primeiraBasica && segundaAcida)) {
        if (classificacao.texto === "Neutro") {
            return `Ao misturar ${descricaoVolumes}, as contribuições ácida e básica ficam próximas no modelo. Parte dos íons H⁺ e OH⁻ se neutraliza, formando água, e o pH estimado fica próximo de 7.`;
        }

        const excesso = classificacao.texto === "Ácido" ? "ácida" : "básica";
        return `Ao misturar ${descricaoVolumes}, íons H⁺ e OH⁻ podem se neutralizar e formar água. No modelo, sobra contribuição ${excesso}, então a mistura fica ${classificacao.texto.toLowerCase()} (pH estimado ${phFinal.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}).`;
    }

    if (classificacao.texto === "Ácido") {
        return `Ao misturar ${descricaoVolumes}, a contribuição ácida continua predominando. Se uma das amostras for neutra, ela dilui a solução sem neutralizar os íons H⁺. O modelo estima pH ${phFinal.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}, ainda ácido.`;
    }

    if (classificacao.texto === "Básico") {
        return `Ao misturar ${descricaoVolumes}, a contribuição básica continua predominando. Se uma das amostras for neutra, ela dilui a solução sem neutralizar os íons OH⁻. O modelo estima pH ${phFinal.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}, ainda básico.`;
    }

    return `Ao misturar ${descricaoVolumes}, as contribuições estimadas de íons H⁺ e OH⁻ ficam próximas do equilíbrio. O modelo estima pH ${phFinal.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}, próximo do neutro.`;
}

function atualizarMistura() {
    const primeiraAmostra = amostras[liquidoMistura1.value];
    const segundaAmostra = amostras[liquidoMistura2.value];
    const primeiroVolume = Number(volumeMistura1.value);
    const segundoVolume = Number(volumeMistura2.value);
    const volumesValidos = [volumeMistura1, volumeMistura2].every((campo) => {
        const volume = Number(campo.value);
        const valido = Number.isFinite(volume) && volume >= 1 && volume <= 1000;
        campo.setAttribute("aria-invalid", String(!valido));
        return valido;
    });

    if (!primeiraAmostra || !segundaAmostra) {
        throw new Error("Não há dados cadastrados para um dos líquidos selecionados.");
    }

    if (!volumesValidos) {
        phMistura.textContent = "—";
        tipoMistura.textContent = "Volumes inválidos";
        tipoMistura.className = "etiqueta-ph";
        ponteiroMistura.style.display = "none";
        resumoMistura.textContent = "Informe volumes entre 1 e 1000 mL para calcular a mistura.";
        explicacaoMistura.textContent = "Ajuste os dois volumes para valores entre 1 e 1000 mL para atualizar a explicação.";
        liquidoMisturaVisual.style.height = "0%";
        volumeTotalMistura.textContent = "—";
        return;
    }

    const volumeTotal = primeiroVolume + segundoVolume;
    const concentracaoH = (
        (10 ** -primeiraAmostra.ph * primeiroVolume) +
        (10 ** -segundaAmostra.ph * segundoVolume)
    ) / volumeTotal;
    const concentracaoOH = (
        (10 ** (primeiraAmostra.ph - 14) * primeiroVolume) +
        (10 ** (segundaAmostra.ph - 14) * segundoVolume)
    ) / volumeTotal;
    const excessoIons = concentracaoH - concentracaoOH;
    const escalaConcentracao = Math.max(concentracaoH, concentracaoOH);
    const excessoDesprezivel = Math.abs(excessoIons) <= escalaConcentracao * 1e-12;
    const phFinal = excessoDesprezivel
        ? 7
        : excessoIons > 0
            ? -Math.log10(excessoIons)
            : 14 + Math.log10(-excessoIons);
    const classificacao = obterTipoPh(phFinal);

    phMistura.textContent = phFinal.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
    tipoMistura.textContent = classificacao.texto;
    tipoMistura.className = `etiqueta-ph ${classificacao.classe}`;
    ponteiroMistura.style.display = "";
    ponteiroMistura.style.left = `${(phFinal / 14) * 100}%`;
    ponteiroMistura.setAttribute("aria-label", `pH estimado ${phFinal.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}`);
    resumoMistura.textContent = `${formatarVolume(primeiroVolume)} mL de ${primeiraAmostra.nome} + ${formatarVolume(segundoVolume)} mL de ${segundaAmostra.nome} = ${formatarVolume(volumeTotal)} mL de mistura.`;
    explicacaoMistura.textContent = obterExplicacaoMistura(
        primeiraAmostra,
        segundaAmostra,
        primeiroVolume,
        segundoVolume,
        phFinal,
        classificacao
    );
    liquidoMisturaVisual.style.backgroundColor = misturarCores(
        primeiraAmostra.cor,
        segundaAmostra.cor,
        primeiroVolume / volumeTotal
    );
    liquidoMisturaVisual.style.height = `${Math.min(82, 28 + (volumeTotal / 2000) * 54)}%`;
    volumeTotalMistura.textContent = `${formatarVolume(volumeTotal)} mL`;
    copoMistura.setAttribute("aria-label", `Copo com ${formatarVolume(volumeTotal)} mL da mistura de ${primeiraAmostra.nome} e ${segundaAmostra.nome}`);
}

function atualizar() {
    const amostra = amostras[liquidoSelect.value];
    if (!amostra) {
        throw new Error(`Não há dados cadastrados para o líquido "${liquidoSelect.value}".`);
    }

    const temperatura = Number(temperaturaInput.value);

    atualizarPh(amostra);
    atualizarVolume(amostra, temperatura);
    atualizarMistura();
}

liquidoSelect.addEventListener("change", atualizar);
modoSelect.addEventListener("change", atualizar);
temperaturaInput.addEventListener("input", atualizar);
preencherOpcoesMistura(liquidoMistura1);
preencherOpcoesMistura(liquidoMistura2);
liquidoMistura1.value = "cola";
liquidoMistura2.value = "agua";
liquidoMistura1.addEventListener("change", atualizarMistura);
liquidoMistura2.addEventListener("change", atualizarMistura);
volumeMistura1.addEventListener("input", atualizarMistura);
volumeMistura2.addEventListener("input", atualizarMistura);
reiniciar.addEventListener("click", () => {
    liquidoSelect.value = "cola";
    modoSelect.value = "movel";
    temperaturaInput.value = String(temperaturaInicial);
    liquidoMistura1.value = "cola";
    liquidoMistura2.value = "agua";
    volumeMistura1.value = "100";
    volumeMistura2.value = "100";
    volumeMistura1.setAttribute("aria-invalid", "false");
    volumeMistura2.setAttribute("aria-invalid", "false");
    atualizar();
});

atualizar();
