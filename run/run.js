var html = '';
async function fetchText(filename) {
    try {
        const url = `https://quizizzfilehost.blaub002-302.workers.dev/${filename}?nocache=${new Date().getTime()}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const text = await response.text();
        return text;
    } catch (error) {
        console.error(`Fetch error: ${error.message}`);
        return null;
    }
}

// Function to fetch and write HTML
async function init_index() {
    html = await fetchText("index.html");
    html = html.replace('src="script.js"', 'src="https://quizizzfilehost.blaub002-302.workers.dev/script.js"');
    html = html.replace('href="style.css"', 'href="https://quizizzfilehost.blaub002-302.workers.dev/style.css"');
    html = html.replace('src="image.png"', 'src="https://quizizzfilehost.blaub002-302.workers.dev/image.png"');
    html = html.replace('src="folder/script.js"', 'src="https://quizizzfilehost.blaub002-302.workers.dev/folder/script.js"');
    html = html.replace('href="folder/style.css"', 'href="https://quizizzfilehost.blaub002-302.workers.dev/folder/style.css"');
    document.write(html);
}

init_index();