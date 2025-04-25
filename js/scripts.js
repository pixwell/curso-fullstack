//Criando a tela inicial com o formulario para o sorteio
const sorteioContainer = document.getElementById('sorteio-container');
sorteioContainer.append(clonaTemplate('sorteio-starter'));
ativarListenersIniciais();

//Segue o baile ...
const numQtd = document.getElementById('num-qtd');
const numFrom = document.getElementById('num-de');
const numTo = document.getElementById('num-ate');
const numRepetir = document.getElementById('num-repetir');

/**
 * Ativa o Listener no formulario Starter
*/
function ativarListenersIniciais(){
    const form = document.getElementById('form-sorteio');

    //(?.) Optional chaining - Can I Use suporte de 95.23%
    form?.addEventListener('submit', async function(event) {
        event.preventDefault();

        //Carrega a secao que vai conter os numeros
        await carregaContainerSorteio();

        //Carrega a lista de numeros sorteados
        await montaListaSorteada();
    }, { once: true });
}

/**
 * Carrega a tela inicial
 */
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
        ativarListenersIniciais();
    }, 950);
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
    btnSortearNovamente.setAttribute('id', 'sortear-novamente');
    btnSortearNovamente.setAttribute('type', 'button');
    btnSortearNovamente.classList.add('btn-rainbow');
    btnSortearNovamente.classList.add('fade-in-up');
    btnSortearNovamente.textContent = 'Sortear Novamente';
    btnSortearNovamente.append(clonaTemplate('svg-cicle'));

    sorteioContainer.appendChild(btnSortearNovamente);

    btnSortearNovamente.addEventListener('click', () => carregaContainerStarter(), {once: true});
}

/**
 * Transforma eventos em Promises
 * @param {string} nomeEvento 
 * @returns Object
 */
function esperarEvento(nomeEvento) {
    return new Promise((resolve, reject) => {
        const handler = (event) => {
            document.removeEventListener(nomeEvento, handler);
            
            try {                
                resolve(event); // Tenta resolver
            } catch (error) {
                reject(error); // Se falhar, rejeita
            }
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