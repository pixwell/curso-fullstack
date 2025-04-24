//Criando a tela inicial com o formulario para o sorteio
const sorteioContainer = document.getElementById('sorteio-container');
sorteioContainer.append(clonaTemplate('sorteio-starter'));

//Segue o baile ...
const form = document.getElementById('form-sorteio');
const numQtd = document.getElementById('num-qtd');
const numFrom = document.getElementById('num-de');
const numTo = document.getElementById('num-ate');
const numRepetir = document.getElementById('num-repetir');

if (form) {
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        //Carrega a secao que vai conter os numeros
        carregaContainerSorteio();

        //Carrega a lista de numeros sorteados
        await montaListaSorteada();
    });
}

/**
 * Clona template HTML
 * @param {String} id 'ID do container HTML'
 */
function clonaTemplate(id){
    return document.getElementById(id).content.cloneNode(true);
}

/**
 * Mosta a lista de numeros sorteados
 */
async function montaListaSorteada(){    
    //Espera carregar o container principal
    await esperarEvento('containerSorteio_carregado');

    //Carrega a lista sorteada
    const lista = arrNumerosSorteados();

    //Adiciona os numeros
    for (const item of lista) {
        //adiciona o numero
        addNumerosNaLista(item);
        //Espera ele avisar que o ciclo de animacao acabou (evento)
        await esperarEvento('addNumero_carregado');
    }

    //Adiciona o botao sortear novamente
    let btnSortearNovamente = document.createElement('button');
    btnSortearNovamente.setAttribute('type', 'submit');
    btnSortearNovamente.classList.add('btn-rainbow');
    btnSortearNovamente.innerHTML = `Sortear Novamente
    <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 300 300" class="ms-1">
        <g id="cicle">
            <path d="M151.5 45.7C93.8 45.4 46.9 91.9 46.7 149.5S93 254 150.6 254.3 255.1 208 255.4 150.4c0-4.7 3.8-8.5 8.5-8.4 4.7 0 8.4 3.8 8.4 8.5-.3 66.9-54.8 121-121.8 120.7s-121-54.8-120.7-121.8c.3-66.9 54.8-121 121.8-120.7 31.5.1 60.2 12.3 81.7 32l.1-17.6c0-4.7 3.8-8.5 8.5-8.4 4.7 0 8.5 3.8 8.4 8.5l-.2 39.4c0 4.7-3.8 8.5-8.5 8.4h-39.5c-4.7 0-8.5-3.8-8.4-8.5 0-4.7 3.8-8.5 8.5-8.4l20.6.1c-18.7-17.6-43.8-28.4-71.3-28.5z"/>
        </g>
        <g id="play">
            <path d="M133.8 198c-1.9 0-3.8-.2-5.6-.7-4.4-1.1-8.5-3.4-11.8-6.5-8.2-7.7-8.2-18.9-8.2-41.2 0-22.3 0-33.6 8.2-41.2 3.3-3.1 7.4-5.3 11.8-6.5 10.6-2.8 20.8 2.6 41.2 13.4 21.2 11.2 31.8 16.8 34.8 27.5 1.2 4.5 1.2 9.1 0 13.6-3 10.7-13.6 16.2-34.8 27.5-16.8 8.9-26.7 14.1-35.6 14.1zm.1-79.8c-.5 0-.9.1-1.2.2-1.7.4-3.2 1.3-4.4 2.4-2.8 2.6-2.8 13.6-2.8 28.7 0 15.2 0 26.1 2.8 28.7 1.2 1.1 2.8 2 4.4 2.5 4.2 1.1 14-4.1 28.8-11.9 14.1-7.5 25.3-13.4 26.4-17.1.4-1.4.4-2.9 0-4.3-1.1-3.6-12.2-9.6-26.4-17.1-13.6-7.1-22.9-12.1-27.6-12.1z"/>
        </g>
    </svg>`;
    btnSortearNovamente.classList.add('fade-in-up');
    sorteioContainer.appendChild(btnSortearNovamente);

    btnSortearNovamente.addEventListener('click', () => carregaContainerStarter());
}

/**
 * Transforma eventos em Promises
 * @param {string} nomeEvento 
 * @returns Object
 */
function esperarEvento(nomeEvento) {
    return new Promise(resolve => {
        const handler = () => {
            document.removeEventListener(nomeEvento, handler);
            resolve();
        };
        document.addEventListener(nomeEvento, handler);
    });
}

/**
 * Ciclo de animacoes para adicionar o numero
 * @param {Number} num 
 */
function addNumerosNaLista(num){
    //Animacao
    let apresentacao = document.getElementById('apresentacao');

    apresentacao.textContent = num;
    apresentacao.classList.add('zoomInDown');
    apresentacao.classList.remove('d-none');

    setTimeout(() => {
        apresentacao.classList.add('fade-out-up');
        apresentacao.classList.remove('zoomInDown');
    }, 2000);

    //Lista de numeros
    let ul = document.getElementById('resultado-sorteio');

    let li = document.createElement('li');
    li.textContent = num;
    
    setTimeout(() => {
        li.classList.add('fade-in');
        ul.appendChild(li);
    }, 2200);

    setTimeout(() => {
        //Reseta as classes CSS
        apresentacao.classList.remove('fade-out-up');
        apresentacao.classList.add('d-none');
        li.classList.remove('fade-in');

        // === Dispara evento quando o numero carregar ===
        let eventoTerminado = new CustomEvent('addNumero_carregado');
        document.dispatchEvent(eventoTerminado);
    }, 3000);
}

function carregaContainerStarter(){
    //Limpa o container
    sorteioContainer.classList.add('fade-out');
    
    //Da o tempo para a animacao terminar
    setTimeout(() => sorteioContainer.innerHTML = '', 900);

    //inclui o template;
    setTimeout(() => {
        sorteioContainer.append(clonaTemplate('sorteio-starter'));    
        sorteioContainer.classList.remove('fade-out');
        sorteioContainer.classList.add('fade-in');
    }, 950);
}

/**
 * Carrega a estrutura inicial para carregar os numeros sorteados
 */
function carregaContainerSorteio(){
    //Limpa o container
    sorteioContainer.classList.add('fade-out');
    //Da o tempo para a animacao terminar
    setTimeout(() => sorteioContainer.innerHTML = '', 800);

    //<h3 class="label-large mb-0 text-center">Resultado do sorteio</h3>
    let titulo = document.createElement('h3');
    titulo.classList.add('label-large','mb-0', 'text-center');
    titulo.textContent = 'Resultado do sorteio';

    //<h4 class="title-overline text-center" id="subtitulo"><span class="gradient-gray-text"><span>1</span>° resultado</span></h4>
    let subTitulo = document.createElement('h4');
    subTitulo.classList.add('title-overline', 'text-center');    
    subTitulo.setAttribute('id','subtitulo');
    subTitulo.innerHTML = '<span class="gradient-gray-text"><span>1</span>° resultado</span>';

    //<ul id="resultado-sorteio" class="resultado-sorteio">
    let ul = document.createElement('ul');
    ul.classList.add('resultado-sorteio');    
    ul.setAttribute('id','resultado-sorteio');

    //<div id="apresentacao" class="apresentacao d-none"></div>
    let apresentacao = document.createElement('div');
    apresentacao.classList.add('apresentacao', 'd-none');
    apresentacao.setAttribute('id','apresentacao');

    // === Carrega os containers na tela
    setTimeout(() => {
        sorteioContainer.appendChild(titulo);
        sorteioContainer.appendChild(subTitulo);
        sorteioContainer.appendChild(ul);
        sorteioContainer.appendChild(apresentacao);
        sorteioContainer.classList.remove('fade-out','fade-in');
        sorteioContainer.classList.add('fade-in');
    }, 900);

    // === Dispara evento quando container carregar ===
    setTimeout(() => {
        let eventoTerminado = new CustomEvent('containerSorteio_carregado');
        document.dispatchEvent(eventoTerminado);
    }, 950);
}

/**
 * Lista de numeros sorteados
 * @returns array
 */
function arrNumerosSorteados(){
    let ArrayRandomNumber = [];
  
    //Sortear a quantidade de número dentro do range
    for (let i = 0; i < numQtd.value; i++) {
        let randomNumber = numeroRandomico(numFrom.value, numTo.value);

        if(numRepetir.checked){
            while (ArrayRandomNumber.includes(randomNumber)) { 
                randomNumber = numeroRandomico(numFrom.value, numTo.value);
            }
        }

        ArrayRandomNumber.push(randomNumber);
    }

    /*
        PARA DECORAR
        // Ordem crescente:
        array.sort((a, b) => a - b);
        // Ordem decrescente:
        array.sort((a, b) => b - a);
    */

    //Retorna um array em ordem crescente
    return ArrayRandomNumber.sort((a, b) => (a - b));
}

/**
 * Sorteia um numero dentro do range
 * @param {Number} min 
 * @param {Number} max 
 * @returns Number
 */
function numeroRandomico(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}