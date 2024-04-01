chat = {};

chat.add = function() {
    let div = document.createElement('div');

    div.innerHTML = 'abcd <br/>';

    document.getElementById('chat').appendChild(div);
}