const videosPerTab = {}; // Armazena vídeos por aba

const messageHandlers = {
    video_found: (message, sender) => {
        const tabId = sender.tab?.id || -1;
        if (tabId !== -1) {
            videosPerTab[tabId] = message.videos || [];
            console.log(`Vídeos atualizados para a aba ${tabId}:`, videosPerTab[tabId]);
        } else {
            console.warn("Mensagem 'video_found' recebida sem tabId:", message);
        }
    },

    get_videos: (message, sender, sendResponse) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTabId = tabs[0]?.id || -1; // Obtém o ID da aba ativa
            if (activeTabId !== -1) {
                const videos = videosPerTab[activeTabId] || [];
                console.log(`Vídeos retornados para a aba ${activeTabId}:`, videos);
                sendResponse({ videos });
            } else {
                console.warn("Nenhuma aba ativa encontrada.");
                sendResponse({ videos: [] });
            }
        });

        return true; // Necessário para respostas assíncronas
    },

    download_video: (message, sender, sendResponse) => {
        if (message.url) {
            console.log("Iniciando download para URL:", message.url);
            chrome.downloads.download(
                {
                    url: message.url,
                    filename: "video.mp4",
                },
                (downloadId) => {
                    if (chrome.runtime.lastError) {
                        console.error("Erro ao iniciar o download:", chrome.runtime.lastError.message);
                        sendResponse({ status: "ERROR", message: chrome.runtime.lastError.message });
                    } else {
                        console.log("Download iniciado com ID:", downloadId);
                        sendResponse({ status: "OK", downloadId });
                    }
                }
            );
            return true; // Necessário para respostas assíncronas
        } else {
            console.warn("Mensagem 'download_video' recebida sem URL:", message);
            sendResponse({ status: "ERROR", message: "URL não fornecida." });
        }
    },
};

// Listener principal para mensagens
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const handler = messageHandlers[message.type];
    if (handler) {
        return handler(message, sender, sendResponse);
    } else {
        console.warn("Tipo de mensagem desconhecido:", message.type);
        sendResponse({ status: "ERROR", message: "Tipo de mensagem desconhecido." });
    }
});

// Limpa dados de abas fechadas
chrome.tabs.onRemoved.addListener((tabId) => {
    if (videosPerTab[tabId]) {
        delete videosPerTab[tabId];
        console.log(`Dados da aba ${tabId} foram removidos.`);
    }
});

// Limpa vídeos ao atualizar ou mudar de página
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "loading" && videosPerTab[tabId]) {
        videosPerTab[tabId] = [];
        console.log(`Vídeos limpos para a aba ${tabId}.`);
    }
});
