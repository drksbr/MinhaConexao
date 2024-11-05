#!/bin/sh

# Caminho do arquivo que contém a tag da build
BUILDTAG_FILE="buildtag"

# Caminho do arquivo no qual a variável deve ser atualizada
TARGET_FILE="frontend/src/components/general/navbar.tsx"

# Lê o valor atual da buildtag
if [ -f "$BUILDTAG_FILE" ]; then
  CURRENT_BUILDTAG=$(cat "$BUILDTAG_FILE")
else
  echo "Arquivo buildtag não encontrado!"
  exit 1
fi

# Debug: Verificar valor da buildtag atual
echo "#################################"
echo "Valor atual da buildtag: $CURRENT_BUILDTAG"

# Extrai a parte numérica da buildtag e incrementa
VERSION_PREFIX=$(echo "$CURRENT_BUILDTAG" | sed 's/\(.*-\)[0-9]*$/\1/')
VERSION_NUMBER=$(echo "$CURRENT_BUILDTAG" | grep -o '[0-9]*$')
NEW_VERSION_NUMBER=$((VERSION_NUMBER + 1))
NEW_BUILDTAG="${VERSION_PREFIX}${NEW_VERSION_NUMBER}"

# Debug: Verificar nova buildtag gerada
echo "Nova buildtag gerada: $NEW_BUILDTAG"
echo ""


# Verifica se o arquivo de destino existe
if [ ! -f "$TARGET_FILE" ]; then
  echo "Arquivo de destino $TARGET_FILE não encontrado!"
  exit 1
fi

# Substitui a linha que contém `const BUILDTAG` pela nova linha completa usando o comando `s///`
# Ajustamos a expressão regular para permitir espaços ou tabulações antes de `const BUILDTAG`
sed -i '' "s/^[[:space:]]*const BUILDTAG = .*$/const BUILDTAG = \"$NEW_BUILDTAG\";/" "$TARGET_FILE"

# Debug: Exibir conteúdo atualizado do arquivo
echo "#################################"
echo "Conteúdo atualizado do arquivo $TARGET_FILE:"
echo ""

# Verifica se a substituição foi bem-sucedida
if grep -q "const BUILDTAG = \"$NEW_BUILDTAG\";" "$TARGET_FILE"; then
  echo "Buildtag atualizado para: $NEW_BUILDTAG no arquivo $TARGET_FILE"
else
  echo "Erro ao atualizar o valor no arquivo $TARGET_FILE"
  exit 1
fi

# Build the frontend
echo "#################################"
echo "Compilando o frontend..."
echo ""

cd frontend/ || { echo "Falha ao acessar o diretório frontend/"; exit 1; }
bun install
bun run build
cd .. || { echo "Falha ao voltar para o diretório raiz"; exit 1; }

# Build the backend
echo "#################################"
echo "Compilando o backend..."
echo ""

cd backend/ || { echo "Falha ao acessar o diretório backend/"; exit 1; }
GO_ENABLED=0 GOOS=linux go build -ldflags="-s -w"
cd .. || { echo "Falha ao voltar para o diretório raiz"; exit 1; }

# Build the docker image
echo "#################################"
echo "Compilando imagem docker..."
echo ""
docker build -t drks/minhaconexao:latest .

# Push the docker image
echo "#################################"
echo "Enviando a imagem docker..."
echo ""

docker push drks/minhaconexao:latest

# Atualiza o arquivo de buildtag
echo "#################################"
echo "Atualizando arquivo de buildtag..."
echo ""

echo "$NEW_BUILDTAG" > "$BUILDTAG_FILE"

# Bye bye
echo "Done!"
