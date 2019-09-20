(function () {
    // const audioHint = document.querySelector('#audioHint');
    // const audioEnding = document.querySelector('#audioEnding');
    const messages = document.querySelector('#messages');
    const array = [];


    (function () {
        var socket = io();

        socket.on('chat message', function (msg) {
            if (msg === 'ENDING') {
                messages.textContent = '';
                // audioEnding.play();
            } else if (msg === 'REMINDER') {
                // audioHint.play();
            } else if (msg === 'RESET') {
                messages.textContent = 'Witajcie!';
            } else {
                messages.textContent = msg;
                // audioHint.play();
            }
        });
    })();

    fetch('text/hints.json')
        .then(response => response.json())
        .then(parsed => {
            for (let key in parsed) {
                parsed[key].forEach((el, i) => {
                    array.push(el)
                })
            }
        });

})();