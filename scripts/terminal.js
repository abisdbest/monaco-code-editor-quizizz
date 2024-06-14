document.addEventListener('DOMContentLoaded', function () {
    const resizer = document.getElementById('resizer');
    const terminal = document.getElementById('terminal');
    const history = document.getElementById('history');
    const input = document.getElementById('input');
    const cursor = document.getElementById('cursor');

    if (resizer && terminal) {
        resizer.addEventListener('mousedown', function (e) {
            e.preventDefault();
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
        });
        function focusAndMoveCursorToTheEnd(e) {
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
            const line = document.createElement('DIV');

            line.textContent = `C:\\WIKIPEDIA > ${command}`;

            history.appendChild(line);
        }

        // Every time the selection changes, add or remove the .noCursor
        // class to show or hide, respectively, the bug square cursor.
        // Note this function could also be used to enforce showing always
        // a big square cursor by always selecting 1 chracter from the current
        // cursor position, unless it's already at the end, in which case the
        // #cursor element should be displayed instead.
        document.addEventListener('selectionchange', () => {
            if (document.activeElement.id !== 'input') return;

            if (document.activeElement.id == 'terminal') {
                const range = window.getSelection().getRangeAt(0);
                const start = range.startOffset;
                const end = range.endOffset;
                const length = input.textContent.length;

                if (end < length) {
                    input.classList.add('noCaret');
                } else {
                    input.classList.remove('noCaret');
                }
            }
        });

        input.addEventListener('input', () => {
            // If we paste HTML, format it as plain text and break it up
            // input individual lines/commands:
            if (input.childElementCount > 0) {
                const lines = input.innerText.replace(/\n$/, '').split('\n');
                const lastLine = lines[lines.length - 1];

                for (let i = 0; i <= lines.length - 2; ++i) {
                    handleCommand(lines[i]);
                }

                input.textContent = lastLine;

                focusAndMoveCursorToTheEnd();
            }

            // If we delete everything, display the square caret again:
            if (input.innerText.length === 0) {
                input.classList.remove('noCaret');
            }
        });

        document.addEventListener('keydown', (e) => {
            // If some key is pressed outside the input, focus it and move the cursor
            // to the end:
            if (e.target !== input) focusAndMoveCursorToTheEnd();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();

                handleCommand(input.textContent);
                input.textContent = '';
                focusAndMoveCursorToTheEnd();
            }
        });

        // Set the focus to the input so that you can start typing straigh away:

    } else {
        console.error('Could not find resizer or terminal element.');
    }
});

function resize(e) {
    const height = window.innerHeight - e.clientY;
    terminal.style.height = `${height - 50}px`;
}

function stopResize() {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}

function toggleTerminal() {
    const terminal = document.getElementById('terminal');
    if (terminal.clientHeight == 9) {
        terminal.style.height = '200px';
    } else {
        terminal.style.height = '9px';
    }
}
