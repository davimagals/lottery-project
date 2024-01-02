
// Modal: player.
let modalPlayer = null

// Mostrar bilhetes.
function showTickets() {
    let tbodyTickets = document.querySelector('#tickets')
    tbodyTickets.innerHTML = ''

    data.players.forEach((player, i) => {
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



// Mostrar sorteios.
function showDraws() {
    let tbodyDraws = document.querySelector('#draws')
    tbodyDraws.innerHTML = ''

    data.draws.forEach((draw, i) => {
        // Linha.
        let tr = document.createElement('tr')
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

        tbodyDraws.appendChild(tr)
    })

    // Contador de sorteios.
    let drawsCount = document.querySelector('#drawsCount')
    drawsCount.innerHTML = ''

    const textCount = document.createTextNode(data.draws.length)
    drawsCount.appendChild(textCount)
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
    const inputId = document.querySelector('#inputId')
    inputId.value = idPlayer

    // Nome.
    const inputName = document.querySelector('#inputName')
    inputName.value = player.name

    // Números.
    buildTicket()
    const tbodyTicket = document.querySelector('#tbodyTicket')
    for (let num of player.ticket) {
        const td = tbodyTicket.querySelector(`td[data-value='${num}']`)
        td.classList.add('bg-dark-blue')
    }

    // Botão 'Apagar'.
    const btnDelete = document.querySelector('#btnDelete')
    btnDelete.classList.remove(idPlayer ? 'd-none' : 'd-block')
    btnDelete.classList.add(idPlayer ? 'd-block' : 'd-none')

    // Mostrar modal.
    modalPlayer = new bootstrap.Modal('#modalPlayer')
    modalPlayer.show()
}

// Montar ticket do modal apostador.
function buildTicket() {
    const tbodyTicket = document.querySelector('#tbodyTicket')
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

        // DAVI: usar buildCell
        const newTd = document.createElement('td')
        newTd.classList.add(...['p-1', 'text-center'])
        newTd.dataset.value = num
        newTd.addEventListener('click', selectTicketNum)

        const newTdText = document.createTextNode(num < 10 ? '0'+ num : num)
        newTd.appendChild(newTdText)
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



// Apagar player.
function deletePlayer() {
    const inputId = document.querySelector('#inputId')
    const idPlayer = inputId.value
    
    data.players.splice(idPlayer, 1)

    modalPlayer.hide()
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

// DAVI: classificação geral; pdf...