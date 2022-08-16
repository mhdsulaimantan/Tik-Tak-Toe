let boardArray = [['', '', ''], ['', '', ''], ['', '', '']]

const board = (() => {

    let addMove = function (pos, mark) {
        boardArray[pos[0]][pos[1]] = mark;
    }

    let display = function () {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                pageElements.gameBox.rows[row].cells[col].textContent = boardArray[row][col];
            }
        }
    }
    return { addMove, display };
})();

const pageElements = (() => {
    const gameBox = document.querySelector('table');
    const pickPlayerBtns = document.querySelectorAll('button');
    const container = document.querySelector('.container');
    const confirmBtn = document.querySelector('#confirm-btn');
    const playIcon = document.querySelector('#start-icon');
    const restartIcon = document.querySelector('#restart-icon');
    const namesContainer = document.querySelector('.names');
    const cancelBtn = document.querySelector('#cancel-btn');
    const playerTurn = document.querySelector('#player-turn');
    const roundBox = document.querySelector('#round');
    const gameStatus = document.querySelector('.game-status');

    return {
        gameBox,
        pickPlayerBtns, 
        container, 
        confirmBtn, 
        playIcon, 
        restartIcon, 
        namesContainer, 
        cancelBtn, 
        playerTurn, 
        roundBox, 
        gameStatus
    }

})();

const game = (function () {

    const start = elementsListener()

    const play = function (names, opponent) {
        // at the beginning of the game
        pageElements.roundBox.textContent = "Round 1";
        pageElements.playerTurn.textContent = names[0] + " turn";
        const marks = ['X', 'O'];
        let round = 1;

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                // add listener for every cell in the gameBox
                pageElements.gameBox.rows[row].cells[col].addEventListener('click', (event) => {

                    playerName = names[(round - 1) % 2];

                    playerChoose(event, marks[(round - 1) % 2]);

                    // check game status
                    if (checkWin(playerName)) return;

                    // the table full after 10 rounds
                    if (round === 9) {
                        pageElements.gameStatus.removeAttribute('hidden');
                        pageElements.gameStatus.textContent = "It is a Draw!!! Replay the game."
                        return;
                    }

                    round++;

                    // the opponent is bot
                    if (opponent === 'bot') {
                        randomPick();
                        // check game status
                        if (checkWin('Bot')) return;
                        pageElements.playerTurn.textContent = names[0] + " turn";
                        pageElements.roundBox.textContent = "Round " + (round + 1);
                        round++;
                    }

                    else {
                        pageElements.playerTurn.textContent = names[(round - 1) % 2] + " turn";
                        pageElements.roundBox.textContent = "Round " + (round);
                    }
                });
            }
        }
    }

    const checkWin = function (name) {
        let win = false;
        for (let r = 0; r < 3; r++) {
            // check if the row have the same elements
            if (boardArray[r].every((val) => val !== '' && val === boardArray[r][0])) win = true;

            else {
                for (let c = 0; c < 3; c++) {
                    if (r === 0 && ((boardArray[r][c] !== '') && (boardArray[r][c] === boardArray[r + 1][c]) && (boardArray[r + 1][c] === boardArray[r + 2][c])) ||
                        (boardArray[0][0] !== '' && (boardArray[0][0] === boardArray[1][1]) && (boardArray[1][1] === boardArray[2][2])) ||
                        (boardArray[0][2] !== '' && (boardArray[0][2] === boardArray[1][1]) && (boardArray[1][1] == boardArray[2][0])))
                        win = true;
                }
            }
        }

        if (win) {
            pageElements.gameStatus.removeAttribute('hidden');
            pageElements.gameStatus.textContent = name + " has won!!! Replay the game."
            pageElements.gameBox.style.pointerEvents = 'none';
            return true;
        }

        return false;
    }

    const randomPick = function () {
        // pick random number between 0 - 2
        let r = Math.floor(Math.random() * 3);
        let c = Math.floor(Math.random() * 3);
        // if the cell is empty
        if (boardArray[r][c] === '') {
            pageElements.gameBox.rows[r].cells[c].style.pointerEvents = 'none';
            board.addMove([r, c], 'O');
            board.display();
        }
        // retry
        else {
            return randomPick();
        }
    }

    const playerChoose = function (event, mark) {
        let row, col;
        if (event.target.textContent === '') {

            row = parseInt(event.target.parentNode.id);
            col = parseInt(event.target.id);
            event.target.style.pointerEvents = 'none';
            board.addMove([row, col], mark);
            board.display();
        }
    }

    return { start, play }
})();

function elementsListener() {
    let opponent;

    // pick player
    pageElements.pickPlayerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            opponent = btn.value;

            pageElements.container.classList.add('disabled');
            // make the names div visible
            pageElements.namesContainer.style = "visibility: visible;";
            // focus on the first name
            document.querySelector('#player1').focus();

            if (opponent === 'player') document.querySelector('.name-p2').removeAttribute('hidden');
            else document.querySelector('.name-p2').setAttribute('hidden', true);

            btn.classList.add('selected');
            // deactivate all the player
            pageElements.pickPlayerBtns.forEach(btn => {
                // focus on picked player
                btn.disabled = true;
                btn.style.pointerEvents = 'none';
            });
        });
    });

    // confirm names
    pageElements.confirmBtn.addEventListener('click', () => {
        const nameP1 = document.querySelector('#player1');

        if (opponent === 'player') {
            const nameP2 = document.querySelector('#player2');
            if (nameP1.value === '' || nameP2.value === '') {
                alert("Please, Enter all required names!!!");
                return;
            }
            else names = [nameP1.value, nameP2.value]
        }

        else {

            if (nameP1.value === '') {
                alert("Please, Enter all required names!!!");
                return;
            }

            else names = [nameP1.value, 'Bot'];
        }
        // enable container
        pageElements.container.classList.remove('disabled');
        // make the names div visible
        document.querySelector('.names').style = "visibility: hidden;";
        // make play icon enable
        pageElements.playIcon.classList.remove('disabled');
    });

    // play icon listener 
    pageElements.playIcon.addEventListener('click', () => {
        pageElements.gameBox.style.pointerEvents = 'all';
        pageElements.playIcon.classList.add('selected');

        // start the game
        game.play(names, opponent);
    });

    // if user press cancel reverse the process   
    pageElements.cancelBtn.addEventListener('click', () => {
        opponent = undefined;
        pageElements.container.classList.remove('disabled');
        // make the names div visible
        document.querySelector('.names').style = "visibility: hidden;";

        // activate all the player
        pageElements.pickPlayerBtns.forEach(btn => {
            // unfocus on picked player
            btn.classList.remove('selected');
            btn.disabled = false;
            btn.style.pointerEvents = 'all';
        });
    });

    // reupload page always active
    pageElements.restartIcon.addEventListener('click', () => window.location.reload());

}

game.start;