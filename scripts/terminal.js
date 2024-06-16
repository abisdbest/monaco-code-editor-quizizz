document.addEventListener('DOMContentLoaded', function () {
    const resizer = document.getElementById('resizer');
    const terminal = document.getElementById('terminal');
    const history = document.getElementById('history');
    const input = document.getElementById('input');
    const cursor = document.getElementById('cursor');

    if (resizer && terminal) {
        resizer.addEventListener('mousedown', initResize);
        resizer.addEventListener('touchstart', initResizeTouch);

        function initResize(e) {
            e.preventDefault();
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
        }

        function initResizeTouch(e) {
            e.preventDefault();
            document.addEventListener('touchmove', resizeTouch);
            document.addEventListener('touchend', stopResizeTouch);
        }

        function focusAndMoveCursorToTheEnd() {
            input.focus();

            const range = document.createRange();
            const selection = window.getSelection();
            const { childNodes } = input;
            const lastChildNode = childNodes && childNodes.length - 1;

            range.selectNodeContents(lastChildNode === -1 ? input : childNodes[lastChildNode]);
            range.collapse(false);

            selection.removeAllRanges();
            selection.addRange(range);
        }

        function handleCommand(command) {
            if (command == "help") {
                const line = document.createElement('DIV');
                line.innerHTML = `<span style="color: lightgreen;">@user </span><span style="color: lightblue;">/</span> $ ${command}`;
                line.innerHTML += "<br>Available commands: <br><br>help<br>&emsp;&emsp;Lists all available commands to the user. <br>&emsp;&emsp;There are no parameters to this command.<br><br>There are currently no other commands available yet."
                history.appendChild(line);
            } else {
                const line = document.createElement('DIV');
                line.innerHTML = `<span style="color: lightgreen;">@user </span><span style="color: lightblue;">/</span> $ ${command}`;
                line.innerHTML += "<br>bash: '" + command + "': not found<br>type help for a lit of available commands"
                history.appendChild(line);
            }
        }

        document.addEventListener('selectionchange', () => {
            if (document.activeElement.id !== 'input') return;

            const range = window.getSelection().getRangeAt(0);
            const end = range.endOffset;
            const length = input.textContent.length;

            if (end < length) {
                input.classList.add('noCaret');
            } else {
                input.classList.remove('noCaret');
            }
        });

        input.addEventListener('input', () => {
            if (input.childElementCount > 0) {
                const lines = input.innerText.replace(/\n$/, '').split('\n');
                const lastLine = lines[lines.length - 1];

                for (let i = 0; i <= lines.length - 2; ++i) {
                    handleCommand(lines[i]);
                }

                input.textContent = lastLine;
                focusAndMoveCursorToTheEnd();
            }

            if (input.innerText.length === 0) {
                input.classList.remove('noCaret');
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleCommand(input.textContent);
                input.textContent = '';
                focusAndMoveCursorToTheEnd();
            }
        });

        terminal.addEventListener('click', (e) => {
            if (e.target === terminal || e.target === input) {
                focusAndMoveCursorToTheEnd();
            }
        });

    } else {
        console.error('Could not find resizer or terminal element.');
    }

    function resize(e) {
        const height = window.innerHeight - e.clientY;
        terminal.style.height = `${height - 50}px`;
    }

    function resizeTouch(e) {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const height = window.innerHeight - touch.clientY;
            terminal.style.height = `${height - 50}px`;
        }
    }

    function stopResize() {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }

    function stopResizeTouch() {
        document.removeEventListener('touchmove', resizeTouch);
        document.removeEventListener('touchend', stopResizeTouch);
    }

    window.toggleTerminal = function() {
        if (terminal.clientHeight == 49) {
            terminal.style.height = '200px';
        } else {
            terminal.style.height = '9px';
        }
    }
});
