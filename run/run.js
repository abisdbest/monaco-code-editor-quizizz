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

// Function to fetch and replace head content
async function replaceHead() {
    var head = await fetchText("head.html");
    if (head !== null) { // Check if head is not null before replacing
        document.head.innerHTML = head;
    } else {
        console.error("Failed to fetch head content");
    }
}

// Function to fetch and replace body content
async function replaceBody() {
    var body = await fetchText("body.html");
    if (body !== null) { // Check if body is not null before replacing
        body = body.replace('src="script.js"', 'src="https://quizizzfilehost.blaub002-302.workers.dev/script.js"');
        body = body.replace('href="style.css"', 'href="https://quizizzfilehost.blaub002-302.workers.dev/style.css"');
        body = body.replace('src="image.png"', 'src="https://quizizzfilehost.blaub002-302.workers.dev/image.png"');
        body = body.replace('src="folder/script.js"', 'src="https://quizizzfilehost.blaub002-302.workers.dev/folder/script.js"');
        body = body.replace('href="folder/style.css"', 'href="https://quizizzfilehost.blaub002-302.workers.dev/folder/style.css"');
        document.body.innerHTML = body;
    } else {
        console.error("Failed to fetch body content");
    }
}

// Call the functions to replace head and body content
replaceHead();
replaceBody();