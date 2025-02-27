const GITHUB_USERNAME = "LidiClementino";  // Substitua pelo seu nome de usuário no GitHub
const REPO_NAME = "rockstar-picker";  // Substitua pelo nome do repositório
const FILE_PATH = "rockstars.json";  // Caminho do arquivo JSON no repositório
const GITHUB_TOKEN = "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";  // Substitua pelo token gerado no GitHub

async function fetchRockstars() {
    const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/${FILE_PATH}`);
    return await response.json();
}

async function updateRockstars(userName, selectedRockstar) {
    const rockstars = await fetchRockstars();
    
    // Verifica se o rockstar já foi escolhido
    if (!rockstars.includes(selectedRockstar)) {
        alert("Esse rockstar já foi escolhido! Escolha outro.");
        return;
    }

    // Remove o escolhido da lista
    const updatedRockstars = rockstars.filter(name => name !== selectedRockstar);

    // Busca a versão atual do arquivo para obter o SHA
    const fileResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    const fileData = await fileResponse.json();
    const sha = fileData.sha;

    // Enviar atualização para o GitHub
    const updateResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`, {
        method: "PUT",
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: `Update: ${selectedRockstar} escolhido por ${userName}`,
            content: btoa(JSON.stringify(updatedRockstars, null, 2)), // Converte para base64
            sha: sha
        })
    });

    if (updateResponse.ok) {
        alert(`${userName} escolheu ${selectedRockstar}! Atualizado no GitHub.`);
    } else {
        alert("Erro ao atualizar o JSON no GitHub.");
    }
}

// Exemplo de uso: updateRockstars("João", "Elvis Presley");
