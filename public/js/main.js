class App {
    constructor() {
        this.messages = document.querySelector('#messages');
        this.buttons = document.querySelectorAll('.btn');
        this.input = document.querySelector('#m');
        this.nextBtn = document.querySelector('.btn--next');
        this.hintBtn = document.querySelectorAll('.btn--hint');
        this.array = [];
        this.msgNr = 0;
        this.nextPage = false;
        this.textShortened = false;
        this.fetchMessages();
        this.handleMessages();
        this.initListeners();
    }

    fetchMessages = () => {
        const array = this.array;
        fetch('text/hints.json')
            .then(response => response.json())
            .then(parsed => {
                for (let key in parsed) {
                    parsed[key].forEach((el, i) => {
                        const choosenDiv = document.querySelector(`div[data-index="${i}"]`);
                        if (choosenDiv) {
                            choosenDiv.textContent = el;
                            array.push(el)
                        }
                    })
                }
                // console.log(array);
            });
    }

    handleMessages = () => {
        const input = this.input;
        let msgNr = this.msgNr;
        const messages = this.messages;
        var socket = io();

        document.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            if (input.value === '') return;
            socket.emit('chat message', input.value);
            input.value = '';
            return false;
        })

        socket.on('chat message', function (msg) {
            const today = new Date();
            const time =
                `${today.getHours() < 10 ? '0' + today.getHours() : today.getHours()}:${today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()}`;

            if (msg === 'RESET') {
                messages.innerHTML = '';
                msgNr = 0;
            } else if (msgNr < 10) {
                const li = document.createElement('li');
                li.appendChild(document.createTextNode(`${time} ${msg}`));
                li.className = `nr${msgNr}`;
                msgNr++;
                messages.appendChild(li);
            } else {
                const lis = document.querySelectorAll('ul li');
                lis.forEach((el, i) => {
                    if (i + 1 === lis.length) {
                        el.textContent = `${time}: ${msg}`
                    } else {
                        el.textContent = document.querySelector(`.nr${i + 1}`).textContent;
                    }
                })

            }
            input.blur();
        });
    }

    insertMessage = (e) => {
        const input = this.input;
        input.value = e.target.textContent;
        input.focus();
    }

    editHint = (e) => {
        e.preventDefault();
        if (e.target.contentEditable === true) {
            e.target.contentEditable = false;
        } else {
            e.target.contentEditable = true;
            e.target.focus();
        }
    }

    nextHints = (e) => {
        const array = this.array;
        if (!this.nextPage) {
            fetch('text/hints.json')
                .then(response => response.json())
                .then(parsed => {
                    for (let key in parsed) {
                        parsed[key].forEach((el, i) => {
                            if (i > 11) {
                                const choosenDiv = document.querySelector(`div[data-index="${i - 12}"]`);
                                if (choosenDiv) {
                                    choosenDiv.textContent = el;
                                    // array.push(el)
                                }
                            }
                        })
                    }
                    this.nextPage = !this.nextPage;
                });
        } else if (this.nextPage) {

            fetch('text/hints.json')
                .then(response => response.json())
                .then(parsed => {
                    for (let key in parsed) {
                        parsed[key].forEach((el, i) => {
                            const choosenDiv = document.querySelector(`div[data-index="${i}"]`);
                            if (choosenDiv) {
                                choosenDiv.textContent = el;
                                array.push(el)
                            }
                        })
                    }
                    this.nextPage = !this.nextPage;
                });
        }
    }

    initListeners = (e) => {
        this.buttons.forEach(el => el.addEventListener('click', this.insertMessage));
        this.nextBtn.addEventListener('click', this.nextHints)
        window.addEventListener('resize', this.shortenText)
    }

}



const Application = new App();