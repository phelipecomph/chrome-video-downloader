FROM mcr.microsoft.com/devcontainers/javascript-node:0-18

# Atualiza o sistema e instala pacotes necessários
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    git && \
    curl -fsSL https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && apt-get install -y google-chrome-stable && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -ms /bin/bash vscode
USER vscode

# Defina o comando padrão para iniciar o bash
CMD ["bash"]
