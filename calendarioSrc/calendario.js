todoMain();



function todoMain() {

    //Constantes
    const DEFAULT_OPTION = "Todos Eventos";

    //========== FIM CONSTANTES ==========

    //Variaveis
    let inputElem,
        inputElem2,
        dateInput,
        timeInput,
        timeFinalInput,
        addButton,
        sortButton,
        selectElem,
        todoList = [],
        calendar,
        shortlistBtn,
        changeBtn,
        todoTable,
        draggingElement;

    //========== FIM VARIAVEIS ==========

    //Chamando as funções
    getElements();
    addListeners();
    initCalendar();
    load();
    renderRows(todoList);
    updateSelectOptions();

    //========== FIM CHAMADA DAS FUNÇÕES ==========

    //Função para pegar os elementos do HTML
    function getElements() {
        inputElem = document.getElementsByTagName("input")[0];
        inputElem2 = document.getElementsByTagName("input")[1];
        dateInput = document.getElementById("dateInput");
        timeInput = document.getElementById("timeInput");
        timeFinalInput = document.getElementById("timeFinalInput");
        addButton = document.getElementById("addBtn");
        sortButton = document.getElementById("sortBtn");
        selectElem = document.getElementById("categoryFilter");
        shortlistBtn = document.getElementById("shortlistBtn");
        changeBtn = document.getElementById("changeBtn");
        todoTable = document.getElementById("todoTable");
    }

    //Função para chamar os eventos
    function addListeners() {
        addButton.addEventListener("click", addEntry, false);
        sortButton.addEventListener("click", sortEntry, false);
        selectElem.addEventListener("change", multipleFilter, false);
        shortlistBtn.addEventListener("change", multipleFilter, false);


        document.getElementById("todo-modal-close-btn").addEventListener("click", closeEditModalBox, false);

        changeBtn.addEventListener("click", comitEdit, false);

        todoTable.addEventListener("dragstart", onDragstart, false);
        todoTable.addEventListener("drop", onDrop, false);
        todoTable.addEventListener("dragover", onDragover, false)
    }


    function addEntry(event) {

        let inputValue = inputElem.value;
        inputElem.value = "";

        let inputValue2 = inputElem2.value;
        inputElem2.value = "";

        let dateValue = dateInput.value;
        dateInput.value = "";

        let timeValue = timeInput.value;
        timeInput.value = "";

        let timeFinalValue = timeFinalInput.value;
        timeFinalInput.value = "";

        let obj = {
            id: _uuid(),
            todo: inputValue,
            category: inputValue2,
            date: dateValue,
            time: timeValue,
            timeFinal: timeFinalValue,
            done: false,
        };

        renderRow(obj);
        todoList.push(obj);
        save();
        updateSelectOptions();

    }

    //Funçao para selecionar a categoria
    function updateSelectOptions() {
        let options = [];

        todoList.forEach((obj) => {
            options.push(obj.category);
        });


        let optionsSet = new Set(options);


        // limpar o select
        selectElem.innerHTML = "";

        let newOptionElem = document.createElement('option');
        newOptionElem.value = DEFAULT_OPTION;
        newOptionElem.innerText = DEFAULT_OPTION;
        selectElem.appendChild(newOptionElem);


        for (let option of optionsSet) {
            let newOptionElem = document.createElement('option');
            newOptionElem.value = option;
            newOptionElem.innerText = option;
            selectElem.appendChild(newOptionElem);
        }


    }

    //salvar no armazenamento
    function save() {
        let stringified = JSON.stringify(todoList);
        localStorage.setItem("todoList", stringified);
    }

    //carregar para o armazenamento local
    function load() {
        let retrieved = localStorage.getItem("todoList");
        todoList = JSON.parse(retrieved)
        if (todoList == null)
            todoList = [];
    }

    //carregar as fileiras
    function renderRows(arr) {
        arr.forEach(todoObj => {
            renderRow(todoObj);
        })
    }

    //Função para dar render nas fileiras
    function renderRow({
        todo: inputValue,
        category: inputValue2,
        id,
        date,
        time,
        timeFinal,
        done
    }) {

        //Adicionar fileira
        let table = document.getElementById("todoTable");

        let trElem = document.createElement("tr");
        table.appendChild(trElem);
        trElem.draggable = "true";
        trElem.dataset.id = id;

        //Checkbox
        let checkboxElem = document.createElement("input");
        checkboxElem.type = "checkbox";
        checkboxElem.addEventListener("click", checkboxClickCallback, false);
        checkboxElem.dataset.id = id;
        let tdElem1 = document.createElement("td");
        tdElem1.appendChild(checkboxElem);
        trElem.appendChild(tdElem1);

        //Data
        let dateElem = document.createElement("td");
        dateElem.innerText = formatDate(date);;
        trElem.appendChild(dateElem);

        //Horario de Inicio
        let timeElem = document.createElement("td");
        timeElem.innerText = time;
        trElem.appendChild(timeElem);

        //Horario Final
        let timeFinalElem = document.createElement("td");
        timeFinalElem.innerText = timeFinal;
        trElem.appendChild(timeFinalElem);

        //Evento
        let tdElem2 = document.createElement("td");
        tdElem2.innerText = inputValue;
        trElem.appendChild(tdElem2);

        //Categoria
        let tdElem3 = document.createElement("td");
        tdElem3.innerText = inputValue2;
        tdElem3.className = "categoryCell";
        trElem.appendChild(tdElem3);

        //Editar
        let editSpan = document.createElement("span");
        editSpan.innerText = "edit";
        editSpan.className = "material-icons";
        editSpan.addEventListener("click", toEditItem, false);
        editSpan.dataset.id = id;
        let editTd = document.createElement("td");
        editTd.appendChild(editSpan);
        trElem.appendChild(editTd);

        //Deletar atividade
        let spanElem = document.createElement("span");
        spanElem.innerText = "delete";
        spanElem.className = "material-icons";
        spanElem.addEventListener("click", deleteItem, false);
        spanElem.dataset.id = id;
        let tdElem4 = document.createElement("td");
        tdElem4.appendChild(spanElem);
        trElem.appendChild(tdElem4);


        //Done button
        checkboxElem.type = "checkbox";
        checkboxElem.checked = done;
        if (done) {
            trElem.classList.add("strike");
        } else {
            trElem.classList.remove("strike");
        }

        addEvent({
            id: id,
            title: inputValue,
            start: date,
        });

        //dateElem.dataset.value = date;
        dateElem.dataset.type = "date";
        timeElem.dataset.type = "time";
        timeFinalElem.dataset.type = "timeFinal";
        tdElem2.dataset.type = "todo";
        tdElem3.dataset.type = "category";

        dateElem.dataset.id = id;
        timeElem.dataset.id = id;
        timeFinalElem.dataset.id = id;
        tdElem2.dataset.id = id;
        tdElem3.dataset.id = id;


        //Função delete Item
        function deleteItem() {
            trElem.remove();
            updateSelectOptions();

            for (let i = 0; i < todoList.length; i++) {
                if (todoList[i].id == this.dataset.id)
                    todoList.splice(i, 1);
            }
            save();

            // Remover do calendario
            calendar.getEventById(this.dataset.id).remove();

        }

        //Função Marcar ação pronta
        function checkboxClickCallback() {
            trElem.classList.toggle("strike");
            for (let i = 0; i < todoList.length; i++) {
                if (todoList[i].id == this.dataset.id) {
                    todoList[i]["done"] = this.checked;
                }
            }
            save();

        }
    }

    //Função para conseguir criar um ID unico para cada evento.
    function _uuid() {
        var d = Date.now();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    //Função de organizar por data
    function sortEntry() {
        todoList.sort((a, b) => {
            let aDate = Date.parse(a.date);
            let bDate = Date.parse(b.date);
            return aDate - bDate;
        });

        save();
        clearTable();
        renderRows(todoList);
    }

    //Função iniciar calendario
    function initCalendar() {
        var calendarEl = document.getElementById('calendar');

        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'pt-BR',
            initialDate: new Date(),
            headerToolbar: {
                left: 'today',
                center: 'title',
                right: 'prev,next',
            },
            events: [],
            eventClick: function (info) {
                toEditItem(info.event);
            },
            eventBackgroundColor: "#3a7c92",
            eventBorderColor: "#b1d4e0",
            editable: true,
            eventDrop: function (info) {
                calendarEventDragged(info.event);
            }
        });

        calendar.render();
    }

    //Função adicionar evento no calendario
    function addEvent(event) {
        calendar.addEvent(event)

    }

    //Função para limpar a tabela - Assim quando for atualizar não vai repetir os eventos na tabela e no calendario.
    function clearTable() {
        let trElems = document.getElementsByTagName("tr");
        for (let i = trElems.length - 1; i > 0; i--) {
            trElems[i].remove();
        }

        calendar.getEvents().forEach(event => event.remove());
    }

    //Função para conseguir filtrar os 2 filtros(categoria e feito) ao mesmo tempo
    function multipleFilter() {
        clearTable();


        let selection = selectElem.value;

        if (selection == DEFAULT_OPTION) {
            if (shortlistBtn.checked) {
                let filteredIncompleteArray = todoList.filter(obj => obj.done == false);
                renderRows(filteredIncompleteArray);

                filteredDoneArray = todoList.filter(obj => obj.done == true);
                renderRows(filteredDoneArray);

            } else {
                renderRows(todoList);
            }

        } else {
            let filteredCategoryArray = todoList.filter(obj => obj.category == selection);

            if (shortlistBtn.checked) {
                let filteredIncompleteArray = filteredCategoryArray.filter(obj => obj.done == false);
                renderRows(filteredIncompleteArray);

                filteredDoneArray = filteredCategoryArray.filter(obj => obj.done == true);
                renderRows(filteredDoneArray);

            } else {
                renderRows(filteredCategoryArray);
            }
        }
    }

    //Função para pegar o click na tabela
    

    //Função para tranformar a data para pt-BR
    function formatDate(date) {
        let dateObj = new Date(date);
        let formattedDate = dateObj.toLocaleString("pt-BR", {
            timeZone: 'UTC',
            month: "long",
            day: "numeric",
            year: "numeric"
        });
        return formattedDate;
    }

    //Funçao que fecha a janela de editar
    function showEditModalBox(event) {
        document.getElementById("todo-overlay").classList.add("slideIntoView");
    }

    //Funçao que fecha a janela de editar
    function closeEditModalBox(event) {
        document.getElementById("todo-overlay").classList.remove("slideIntoView");
    }

    //Função para exec a ediçao do evento
    function comitEdit(event) {
        closeEditModalBox();

        let id = event.target.dataset.id;
        let todo = document.getElementById("todo-edit-todo").value;
        let category = document.getElementById("todo-edit-category").value;
        let date = document.getElementById("todo-edit-date").value;
        let time = document.getElementById("todo-edit-time").value;
        let timeFinal = document.getElementById("todo-edit-final-time").value;


        calendar.getEventById(id).remove();


        //Pegar a mudança que o usuario fez na tabela
        for (let i = 0; i < todoList.length; i++) {
            if (todoList[i].id == id) {
                todoList[i] = {
                    id: id,
                    todo: todo,
                    category: category,
                    date: date,
                    time: time,
                    timeFinal: timeFinal,
                    done: false,
                };

                addEvent({
                    id: id,
                    title: todoList[i].todo,
                    start: todoList[i].date,
                });
            }
        }

        save();

        // Dar uptade na tabela
        let tdNodeList = todoTable.querySelectorAll(`td[data-id='${id}']`);
        for (let i = 0; i < tdNodeList.length; i++) {
            let type = tdNodeList[i].dataset.type;
            switch (type) {
                case "date":
                    tdNodeList[i].innerText = formatDate(date);
                    break;
                case "time":
                    tdNodeList[i].innerText = time;
                    break;
                case "timeFinal":
                    tdNodeList[i].innerText = timeFinal;
                    break;
                case "todo":
                    tdNodeList[i].innerText = todo;
                    break;
                case "category":
                    tdNodeList[i].innerText = category;
                    break;
            }

        }

        save();
    }

    // Função para pegar o click na tabela ou no calendario(exec edit)
    function toEditItem(event) {
        showEditModalBox();

        let id;

        if (event.target) { //mouse click evento
            id = event.target.dataset.id;
        } else { //calendario evento
            id = event.id;
        }
        preFillEditForm(id);
    }

    // Para ja preencher a janela de edição de acordo com o que o usuario colocar
    function preFillEditForm(id) {
        let result = todoList.find(todoObj => todoObj.id == id);
        let {
            todo,
            category,
            date,
            time,
            timeFinal,
        } = result;

        document.getElementById("todo-edit-todo").value = todo;
        document.getElementById("todo-edit-category").value = category;
        document.getElementById("todo-edit-date").value = date;
        document.getElementById("todo-edit-time").value = time;
        document.getElementById("todo-edit-final-time").value = timeFinal;

        changeBtn.dataset.id = id;
    }

    //Função para Conseguir arrastar o evento
    function onDragstart(event) {
        draggingElement = event.target;
    }

    //Função de quando o usuario soltar o evento na tabela
    function onDrop(event) {

        // Evitar quando o alvo for uma table
        if (event.target.matches("table")) {
            return;
        }
        let beforeTarget = event.target;

        //Olhar dentro dos parentes até achar uma tr
        while (!beforeTarget.matches("tr")) {
            beforeTarget = beforeTarget.parentNode;

        }

        //Evitar que o usuario troque com a primeira tr
        if (beforeTarget.matches(":first-child")) {
            return;
        }

        //Vizualizar o arrastar e o soltar
        todoTable.insertBefore(draggingElement, beforeTarget);



        let tempIndex;


        //Achar o elemento que é para executar
        todoList.forEach((todoObj, index) => {
            if (todoObj.id == draggingElement.dataset.id) {
                tempIndex = index;
            }
        });
        //Tirar o elemento
        let [toInsertObj] = todoList.splice(tempIndex, 1);

        //Achar o index que é para ser inserido
        todoList.forEach((todoObj, index) => {
            if (todoObj.id == beforeTarget.dataset.id) {
                tempIndex = index;
            }
        });


        //Inserir temp
        todoList.splice(tempIndex, 0, toInsertObj)

        //Salvar as ediçoes
        save();

    }

    function onDragover(event) {
        event.preventDefault();
    }

    // Função para conseguir arrastar no calendario
    function calendarEventDragged(event) {
        let id = event.id;

        console.log(event.start);
        let dateObj = new Date(event.start);

        let year = (dateObj.getFullYear());
        let month = (dateObj.getMonth() + 1);
        let date = (dateObj.getDate());

        let paddedMonth = month.toString();
        if (paddedMonth.length < 2) {
            paddedMonth = "0" + paddedMonth;
        }

        let paddedDate = date.toString();
        if (paddedDate.length < 2) {
            paddedDate = "0" + paddedDate;
        }

        let toStoreDate = `${year}-${paddedMonth}-${paddedDate}`;
        //console.log(toStoreDate);

        todoList.forEach(todoObj => {
            if (todoObj.id == id) {
                todoObj.date = toStoreDate;
            }
        });

        save();

        multipleFilter();
    }
}