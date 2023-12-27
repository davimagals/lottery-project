
// Dados.
let data = {
    players: [
        {
            name: 'Pedrinho Marruás',
            ticket: [1, 2, 3, 4, 5, 7, 9, 21, 22, 37, 41, 54, 65, 66, 68, 73, 74, 76, 77, 78]
        },
        {
            name: 'Wendel',
            ticket: [4, 5, 7, 8, 9, 13, 19, 20, 23, 27, 36, 37, 39, 46, 56, 64, 73, 76, 77, 80]
        }
    ],
    draws: [
        {
            id: 5313,
            date: '2020-07-14',
            numbers: [4, 37, 56, 66, 73]
        },
        {
            id: 5314,
            date: '2020-07-15',
            numbers: [4, 7, 34, 45, 74]
        },
        {
            id: 5315,
            date: '2020-07-16',
            numbers: [1, 2, 3, 5, 9]
        }
    ]
}



// Mostrar bilhetes.
function showTickets(players) {
    let tbodyTickets = document.querySelector('#tickets')
    tbodyTickets.innerHTML = ''

    players.forEach((player, i) => {
        // Linha.
        let tr = document.createElement('tr')
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



// DAVI: Calcular os números marcados.
function calculateScoredNumbers(data) {
    // Mostrar sorteios.
    showDraws(data.draws)

    // Mostrar cartelas.
    showTickets(data.players)

    // Calcular os números marcados.
}
calculateScoredNumbers(data)