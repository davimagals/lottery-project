
// Modal: player.
let modalPlayer = null

// Modal: sorteio.
let modalDraw = null



// Mostrar bilhetes.
function showTickets() {
    let tbodyTickets = document.querySelector('#tickets')
    tbodyTickets.innerHTML = ''

    // Ordenar por pontos.
    const players = sortByPoints(data.players)

    players.forEach((player, i) => {
        // Linha.
        let tr = document.createElement('tr')
        tr.classList.add('cursor-pointer')
        tr.dataset.id = i

        // ID.
        const id = i + 1
        const tdId = buildCell((id < 10 ? '0' : '') + id, ['text-center'])
        tr.appendChild(tdId)

        // Nome.
        const tdName = buildCell(player.name)
        tr.appendChild(tdName)

        // Números do bilhete.
        for(let num of player.ticket) {
            let numShow = (num < 10 ? '0' : '') + num.toString()
            const tdNum = buildCell(numShow, ['text-center'])
            tdNum.dataset.value = num
            tr.appendChild(tdNum)
        }

        // Pontos.
        const tdScore = buildCell('', ['bg-dark-blue', 'text-center'])
        tr.appendChild(tdScore)

        // Evento: clique.
        tr.addEventListener('click', showModalPlayer)

        tbodyTickets.appendChild(tr)
    })
}

// Ordenar bilhetes ascendente por pontos.
function sortByPoints(players) {
    let allSelectedNumbers = []

    // Concatenar os números sorteados e remover os repetidos em diferentes sorteios.
    for (let draw of data.draws) {
        allSelectedNumbers = allSelectedNumbers.concat(draw.numbers)
    }
    allSelectedNumbers = [...new Set(allSelectedNumbers)]

    // Ordenar.
    players.sort(function(a, b) {
        const countA = a.ticket.filter(x => allSelectedNumbers.includes(x))
        const countB = b.ticket.filter(x => allSelectedNumbers.includes(x))
        return countB.length - countA.length
    })

    return players
}



// Mostrar sorteios.
function showDraws() {
    let tbodyDraws = document.querySelector('#draws')
    tbodyDraws.innerHTML = ''

    data.draws.forEach((draw, i) => {
        // Linha.
        let tr = document.createElement('tr')
        tr.classList.add('cursor-pointer')
        tr.dataset.id = i

        // Data.
        const tdDate = buildCell(moment(draw.date).format('DD/MM/YYYY'))
        tr.appendChild(tdDate)

        // Concurso (ID).
        const tdId = buildCell(draw.id)
        tr.appendChild(tdId)

        // Números do sorteio.
        for(let num of draw.numbers) {
            let numShow = (num < 10 ? '0' : '') + num.toString()
            const tdNum = buildCell(numShow, ['text-center'])
            tr.appendChild(tdNum)
        }

        // Evento: clique.
        tr.addEventListener('click', showModalDraw)

        tbodyDraws.appendChild(tr)
    })
}



// Construir célula de tabela.
function buildCell(text = '', classList = []) {
    let td = document.createElement('td')
    td.classList.add(...classList)

    let textNode = document.createTextNode(text)
    td.appendChild(textNode)
    
    return td
}



// Calcular os números marcados.
function calculateScoredNumbers() {
    let allSelectedNumbers = []

    // Concatenar os números sorteados e remover os repetidos em diferentes sorteios.
    for (let draw of data.draws) {
        allSelectedNumbers = allSelectedNumbers.concat(draw.numbers)
    }
    allSelectedNumbers = [...new Set(allSelectedNumbers)]

    // Marcar nas cartelas.
    let tbodyTickets = document.querySelector('#tickets')

    for (let num of allSelectedNumbers) {
        let tdNumbers = tbodyTickets.querySelectorAll(`td[data-value='${num}']`)

        for (let tdNum of tdNumbers) {
            tdNum.classList.add('selected-number')
        }
    }

    // Contar os pontos.
    let trPlayers = tbodyTickets.querySelectorAll('tr')

    for(let trPlayer of trPlayers) {
        let tdSelecteds = trPlayer.querySelectorAll('.selected-number')
        let tdScore = trPlayer.querySelector('.bg-dark-blue')

        const score = tdSelecteds.length
        let textCount = document.createTextNode(score)
        tdScore.appendChild(textCount)
        trPlayer.dataset.score = score
    }
}



// Mostrar modal apostador.
function showModalPlayer(event) {
    const idPlayer = event.target.parentElement.dataset.id

    let player = null
    if (idPlayer) {
        player = data.players[idPlayer]
    } else {
        player = {
            name: '',
            ticket: []
        }
    }

    // ID.
    const inputId = document.querySelector('#inputPlayerId')
    inputId.value = idPlayer

    // Nome.
    const inputName = document.querySelector('#inputName')
    inputName.value = player.name

    // Números.
    buildTicket('#tbodyPlayerTicket')
    const tbodyTicket = document.querySelector('#tbodyPlayerTicket')
    for (let num of player.ticket) {
        const td = tbodyTicket.querySelector(`td[data-value='${num}']`)
        td.classList.add('bg-dark-blue')
    }

    // Botão 'Apagar'.
    const btnDelete = document.querySelector('#btnPlayerDelete')
    btnDelete.classList.remove(idPlayer ? 'd-none' : 'd-block')
    btnDelete.classList.add(idPlayer ? 'd-block' : 'd-none')

    // Mostrar modal.
    modalPlayer = new bootstrap.Modal('#modalPlayer')
    modalPlayer.show()
}

// Montar ticket do modal.
function buildTicket(ticketSelector) {
    const tbodyTicket = document.querySelector(ticketSelector)
    tbodyTicket.innerHTML = ''

    for (let i = 0; i < 80; i++) {
        // Novo TR.
        const isNewTr = ((i % 10 == 0) ? true : false)
        if(isNewTr) {
            let newTr = document.createElement('tr')
            tbodyTicket.appendChild(newTr)
        }

        // Adicionando TD.
        const tr = tbodyTicket.querySelector('tr:last-child')
        const num = i + 1

        const newTd = buildCell((num < 10 ? '0'+ num : num), ['p-1', 'text-center'])
        newTd.dataset.value = num
        newTd.addEventListener('click', selectTicketNum)

        tr.appendChild(newTd)
    }
}

// Selecionar número no ticket do modal apostador.
function selectTicketNum(event) {
    const td = event.target
    td.classList.toggle('bg-dark-blue')
}



// Salvar um apostador.
function savePlayer() {
    const player = {
        name: '',
        ticket: []
    }

    // ID.
    const inputId = document.querySelector('#inputId')
    const idPlayer = inputId.value

    // Nome.
    const inputName = document.querySelector('#inputName')
    player.name = inputName.value

    // Números.
    const tbodyTicket = document.querySelector('#tbodyTicket')
    const tdSelecteds = tbodyTicket.querySelectorAll('.bg-dark-blue')
    for (let tdSelected of tdSelecteds) {
        player.ticket.push(parseInt(tdSelected.dataset.value))
    }

    // Verificar.
    if (player.name.trim() == '' || player.ticket.length != 20) {
        alert('Preencha um nome e 20 números!')
        return
    }

    // Salvar.
    if (idPlayer) {
        data.players[idPlayer] = player
    } else {
        data.players.push(player)
    }

    modalPlayer.hide()
    main()
}



// Apagar apostador.
function deletePlayer() {
    const inputId = document.querySelector('#inputPlayerId')
    const idPlayer = inputId.value
    
    data.players.splice(idPlayer, 1)
    main()
}

// Apagar todos os apostadores.
function deleteAllPlayers() {
    data.players = []
    main()
}



// Mostrar modal sorteio.
function showModalDraw(event) {
    const idDraw = event.target.parentElement.dataset.id

    if (idDraw) {
        showModalDrawData(idDraw, data.draws[idDraw])
    } else {
        const xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                // GET respondido.
                draw = {
                    id: '',
                    date: '',
                    numbers: []
                }

                // Sucesso.
                if (this.status == 200) {
                    const dados = JSON.parse(this.responseText)
                    draw = {
                        id: dados.concurso,
                        date: moment(dados.data, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        numbers: dados.dezenas
                    }
                }

                showModalDrawData(idDraw, draw)
            }
        }
        xhttp.open('GET', 'https://loteriascaixa-api.herokuapp.com/api/quina/latest')
        xhttp.send()
    }
}

// Mostrar modal sorteio: continuação.
function showModalDrawData(idDraw, draw) {
    // ID.
    const inputDrawId = document.querySelector('#inputDrawId')
    inputDrawId.value = idDraw

    // Data.
    const inputDate = document.querySelector('#inputDate')
    inputDate.value = draw.date ? moment(draw.date).format('DD/MM/YYYY') : ''

    // Concurso.
    const inputId = document.querySelector('#inputId')
    inputId.value = draw.id

    // Números.
    buildTicket('#tbodyDrawTicket')
    const tbodyTicket = document.querySelector('#tbodyDrawTicket')
    for (let num of draw.numbers) {
        const td = tbodyTicket.querySelector(`td[data-value='${num}']`)
        td.classList.add('bg-dark-blue')
    }

    // Botão 'Apagar'.
    const btnDelete = document.querySelector('#btnDrawDelete')
    btnDelete.classList.remove(idDraw ? 'd-none' : 'd-block')
    btnDelete.classList.add(idDraw ? 'd-block' : 'd-none')

    // Mostrar modal.
    modalDraw = new bootstrap.Modal('#modalDraw')
    modalDraw.show()
}

// Salvar um sorteio.
function saveDraw() {
    const draw = {
        id: '',
        date: '',
        numbers: []
    }

    // ID.
    const inputDrawId = document.querySelector('#inputDrawId')
    const idDraw = inputDrawId.value

    // Data.
    const inputDate = document.querySelector('#inputDate')
    draw.date = inputDate.value

    // Concurso.
    const inputId = document.querySelector('#inputId')
    draw.id = inputId.value

    // Números.
    const tbodyTicket = document.querySelector('#tbodyDrawTicket')
    const tdSelecteds = tbodyTicket.querySelectorAll('.bg-dark-blue')
    for (let tdSelected of tdSelecteds) {
        draw.numbers.push(parseInt(tdSelected.dataset.value))
    }

    // Verificar.
    if (draw.date.trim() == '' || draw.id.trim() == '' || draw.numbers.length != 5) {
        alert('Preencha uma data, um concurso e 5 números!')
        return
    }

    // Ajustar data.
    draw.date = moment(draw.date, 'DD/MM/YYYY').format('YYYY-MM-DD')

    // Salvar.
    if (idDraw) {
        data.draws[idDraw] = draw
    } else {
        data.draws.push(draw)
    }

    modalDraw.hide()
    main()
}



// Apagar sorteio.
function deleteDraw() {
    const inputId = document.querySelector('#inputDrawId')
    const idDraw = inputId.value
    
    data.draws.splice(idDraw, 1)
    main()
}

// Apagar todos os sorteios.
function deleteAllDraws() {
    data.draws = []
    main()
}



// Principal.
function main() {
    // Mostrar sorteios.
    showDraws()

    // Mostrar cartelas.
    showTickets()

    // Calcular os números marcados.
    calculateScoredNumbers()
}
main()