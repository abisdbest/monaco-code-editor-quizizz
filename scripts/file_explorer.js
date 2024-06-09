let username = localStorage.getItem('github_username');
let token = localStorage.getItem('github_token');

// If not stored, prompt for username and API token
if (!username || !token) {
    username = prompt("Enter your GitHub username:");
    token = prompt("Enter your GitHub API token:");

    // Save username and token in local storage
    localStorage.setItem('github_username', username);
    localStorage.setItem('github_token', token);
}

async function fetchRepositoryFiles(username, repo) {
    try {
        const branchResponse = await fetch(`https://api.github.com/repos/${username}/${repo}/branches#classroom.google.com`);
        const branchData = await branchResponse.json();
        const branchName = branchData[0].name; // Assuming you want to work with the first branch

        const filesResponse = await fetch(`https://api.github.com/repos/${username}/${repo}/git/trees/${branchName}?recursive=1#classroom.google.com`);
        const files = await filesResponse.json();

        return files.tree;
    } catch (error) {
        console.error('Error fetching repository files:', error);
        return [];
    }
}

async function displayRepositoryFiles(username, repo, path = '') {
    const filesContainer = document.getElementById('files');
    filesContainer.innerHTML = ''; // Clear previous data

    const files = await fetchRepositoryFiles(username, repo);

    const fileStructure = {};

    files.forEach(file => {
        let parts = file.path.split("/");
        let currentDir = fileStructure;
        parts.forEach((part, index) => {
            if (!currentDir[part]) {
                currentDir[part] = {};
            }
            if (index === parts.length - 1) {
                currentDir[part] = file;
            } else {
                currentDir = currentDir[part];
            }
        });
    });

    function displayDir(parentEl, dir) {
        const list = document.createElement('ul');
        parentEl.appendChild(list);
        for (const [name, contents] of Object.entries(dir)) {
            if (contents.type === 'blob') {
                const itemElement = document.createElement('li');
                itemElement.className = contents.path.split('.').pop();
                itemElement.innerHTML = `<a onclick="openfile('${contents.path}');">${name}</a>`;
                list.appendChild(itemElement);
            } else if (contents.type === 'tree') {
                const folderElement = document.createElement('li');
                folderElement.textContent = name;
                list.appendChild(folderElement);
                displayDir(folderElement, contents); // Recursively display the contents of the folder
            }
        }
    }

    displayDir(filesContainer, fileStructure);
    run_jquery()
}

function getParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const repo = urlParams.get('repo');
    const username = urlParams.get('username');
    return { username, repo };
}

function init() {
    const { username, repo } = getParams();
    if (username && repo) {
        displayRepositoryFiles(username, repo);
    } else {
        alert("Invalid parameters. Please provide both username and repository name.");
    }
}

init();

function openfile(filepath) {
    const urlParams = new URLSearchParams(window.location.search);
    localStorage.setItem('current_file', filepath);
    localStorage.setItem('current_repo', urlParams.get('repo'));
    document.getElementById("editorframe").src = "../edit";
}