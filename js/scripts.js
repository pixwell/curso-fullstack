const form = document.getElementById('form-add-items');
const item_field = document.getElementById('add-item');
const list_container = document.getElementById('items-list');
const alertError_container = document.getElementById('alert-error');
const alertSuccess_container = document.getElementById('alert-success');

//Captando o item do campo e adicionando na lista
form.addEventListener('submit', function(event){
    event.preventDefault();
    let fieldContent = sanitize(item_field.value);
    addItem(fieldContent);
    showAlert(alertSuccess_container);

    //limpa o campo com o item
    this.reset();
});

//Riscando ou deletando o item
list_container.addEventListener('click', function(event){
    let element = event.target;

    //Se for o checkbox
    if(element.type == 'checkbox'){
        //Riscar o item        
        element.parentElement.querySelector('.item-name').classList.toggle('item-checked');
    } else if(element.classList.contains('remove-item')){
        //Deletar
        element.parentElement.classList.add('bg-danger', 'bg-opacity-50');
        element.parentElement.classList.add('fade-out');
        showAlert(alertError_container);

        setTimeout(function(){
            element.parentElement.remove();
        }, 1000);
    }
})

//Mostra o Alerta de Status
function showAlert(containerObj){
    containerObj.classList.remove('d-none', 'fade-in', 'fade-out');
    containerObj.classList.add('fade-in');

    setTimeout(() => {
        containerObj.classList.remove('d-none', 'fade-in', 'fade-out');
        containerObj.classList.add('fade-out');
    }, 1500);
}

//Adiciona um item na lista
function addItem(fieldText){
    /* Marcacao HTML
    <li class="item">
        <input type="checkbox"> <span class="item-name">Item name</span> 
        <button type="button" class="remove-item"></button>
    </li>
    */

    let li = document.createElement('li');
    li.classList.add('item');

    let checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');

    let span = document.createElement('span');
    span.classList.add('item-name');
    span.innerHTML = fieldText;

    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('remove-item');

    li.append(checkbox);
    li.append(span);
    li.append(button);

    list_container.appendChild(li)
}

//Sanitiza o conteúdo de texto da tarefa
function sanitize(string){
    let replace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
        "(": '&#40;',
        ")": '&#41;',
    };
    let replaceKeys = Object.keys(replace);
    let pattern =  new RegExp(`[${replaceKeys.join('')}]`, 'g');

    return string.replace(pattern, (match)=>(replace[match]));
}