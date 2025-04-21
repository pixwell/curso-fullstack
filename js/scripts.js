const form = document.getElementById('form-sorteio');
const numQtd = document.getElementById('num-qtd');
const numFrom = document.getElementById('num-de');
const numTo = document.getElementById('num-ate');
const numRepetir = document.getElementById('num-repetir');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  let lista = numerosSorteados();

  console.log(lista);
});

/**
 * Lista de numeros sorteados
 * @returns array
 */
function numerosSorteados(){
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