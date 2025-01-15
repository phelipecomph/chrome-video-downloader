console.log("Content script carregado!");

const processVideos = () => {
    const videos = document.querySelectorAll('video');
    console.log(`Encontrados ${videos.length} elementos <video> na página.`);

    const videoData = Array.from(videos).map(video => ({
        url: video.src || video.currentSrc || null, // Inclui fallback para currentSrc
        title: document.title || "Vídeo sem título"
    })).filter(video => video.url); // Exclui vídeos sem URL

    if (videoData.length > 0) {
        chrome.runtime.sendMessage({ type: "video_found", videos: videoData }, () => {
            if (chrome.runtime.lastError) {
                console.error("Erro ao enviar mensagem para o background:", chrome.runtime.lastError.message);
            } else {
                console.log("Vídeos enviados para o background:", videoData);
            }
        });
    } else {
        console.log("Nenhum vídeo com URL válido encontrado.");
    }
};

processVideos();
