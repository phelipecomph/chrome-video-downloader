console.log("Solicitando vídeos ao background...");
chrome.runtime.sendMessage({ type: "get_videos" }, (response) => {
    console.log("Resposta recebida do background:", response);

    const list = document.getElementById('video-list');
    list.innerHTML = ""; // Limpa a lista antes de atualizar

    if (response && response.videos && response.videos.length > 0) {
        response.videos.forEach((video) => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = video.url;
            link.textContent = `Baixar: ${video.title}`;
            link.target = "_blank";

            listItem.appendChild(link);
            list.appendChild(listItem);
        });
    } else {
        list.textContent = "Nenhum vídeo encontrado.";
    }
});
