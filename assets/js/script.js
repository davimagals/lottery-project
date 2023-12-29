
// Modal: player.
let modalPlayer = null

// Mostrar bilhetes.
function showTickets(players) {
    let tbodyTickets = document.querySelector('#tickets')
    tbodyTickets.innerHTML = ''

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



// Mostrar sorteios.
function showDraws(draws) {
    let tbodyDraws = document.querySelector('#draws')
    tbodyDraws.innerHTML = ''

    draws.forEach((draw, i) => {
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

    const textCount = document.createTextNode(draws.length)
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
function calculateScoredNumbers(data) {
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

    // Nome.
    const inputName = document.querySelector('#inputName')
    inputName.value = player.name

    // Números.

    modalPlayer = new bootstrap.Modal('#modalPlayer')
    modalPlayer.show()
}

// DAVI: Montar ticket do modal apostador.
function buildTicket() {
    const tableTicket = document.querySelector('#tableTicket')

    
}



// Principal.
function main(data) {
    // Mostrar sorteios.
    showDraws(data.draws)

    // Mostrar cartelas.
    showTickets(data.players)

    // Calcular os números marcados.
    calculateScoredNumbers(data)
}
main(data)