console.log("Popup carregado!");

// Solicita as URLs dos vídeos ao background script
chrome.runtime.sendMessage({ type: "get_videos" }, (response) => {
    if (chrome.runtime.lastError) {
        console.error("Erro ao receber vídeos:", chrome.runtime.lastError.message);
        return;
    }

    console.log("Resposta recebida do background:", response);

    const list = document.getElementById('video-list');
    list.innerHTML = ""; // Limpa a lista antes de atualizar

    if (response && response.videos && response.videos.length > 0) {
        console.log("Vídeos disponíveis para exibição:", response.videos);

        response.videos.forEach((video, index) => {
            // Cria o item da lista
            const listItem = document.createElement('li');

            // Cria o link de download
            const link = document.createElement('a');
            link.href = video.url;
            link.textContent = `Baixar: ${video.title}`;
            link.target = "_blank";

            // Adiciona um evento de clique ao link
            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Solicitando download para o vídeo ${index}:`, video.url);

                chrome.runtime.sendMessage({ type: "download_video", url: video.url }, (downloadResponse) => {
                    if (chrome.runtime.lastError) {
                        console.error("Erro ao enviar mensagem para download:", chrome.runtime.lastError.message);
                    } else {
                        console.log("Resposta do background para download:", downloadResponse);
                    }
                });
            });

            // Adiciona o link ao item da lista
            listItem.appendChild(link);

            // Adiciona o item da lista à interface
            list.appendChild(listItem);
        });
    } else {
        console.log("Nenhum vídeo encontrado.");
        list.textContent = "Nenhum vídeo encontrado.";
    }
});
