chrome.runtime.onInstalled.addListener(() => {
    console.log("Extensão instalada!");
});

let videoUrls = []; // Armazena as URLs dos vídeos encontrados

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case "video_found":
            videoUrls = message.videos || [];
            console.log("Vídeos atualizados:", videoUrls);
            break;

        case "get_videos":
            console.log("Respondendo com os vídeos armazenados:", videoUrls);
            sendResponse({ videos: videoUrls });
            break;

        case "download_video":
            if (message.url) {
                console.log("Iniciando download para URL:", message.url);
                chrome.downloads.download({
                    url: message.url,
                    filename: "video.mp4"
                }, (downloadId) => {
                    if (chrome.runtime.lastError) {
                        console.error("Erro ao iniciar o download:", chrome.runtime.lastError.message);
                        sendResponse({ status: "ERROR", message: chrome.runtime.lastError.message });
                    } else {
                        console.log("Download iniciado com ID:", downloadId);
                        sendResponse({ status: "OK", downloadId });
                    }
                });
                return true; // Indica que a resposta será assíncrona
            } else {
                console.warn("Mensagem 'download_video' recebida sem URL:", message);
                sendResponse({ status: "ERROR", message: "URL não fornecida." });
            }
            break;

        default:
            console.warn("Tipo de mensagem desconhecido:", message.type);
            sendResponse({ status: "ERROR", message: "Tipo de mensagem desconhecido." });
    }
});
