console.log("Content script carregado!");

const processVideos = () => {
    const videos = document.querySelectorAll('video');
    console.log(`Encontrados ${videos.length} elementos <video> na página.`);

    const videoData = Array.from(videos).map(video => ({
        url: video.src || video.currentSrc || null,
        title: document.title || "Vídeo sem título"
    })).filter(video => video.url);

    if (videoData.length > 0) {
        chrome.runtime.sendMessage({ type: "video_found", videos: videoData });
        console.log("Vídeos encontrados e enviados:", videoData);
    } else {
        console.log("Nenhum vídeo com URL válido encontrado.");
    }
};

// Executa após o carregamento da página
window.addEventListener("load", () => {
    console.log("Página totalmente carregada. Buscando vídeos...");
    processVideos();
});

// Observa alterações no DOM
const observeDOM = () => {
    const observer = new MutationObserver(() => {
        console.log("Alteração detectada no DOM. Reprocessando vídeos...");
        processVideos();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    console.log("Observador de DOM iniciado.");
};

// Inicie a observação do DOM
observeDOM();
