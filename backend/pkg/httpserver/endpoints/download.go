// endpoints/download.go
package endpoints

import (
	"crypto/rand"
	"fmt"
	"io"
	"log"
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type DownloadFile struct {
	size   float32
	path   string
	buffer []byte // Buffer para armazenar o arquivo na memória
}

// NewDownloadFile cria um novo arquivo de download de 100 MB em /tmp
func NewDownloadFile() *DownloadFile {

	size := 100.0 // 100 MB
	path := fmt.Sprintf("/tmp/%.1fmb.dat", size)

	return &DownloadFile{
		size:   float32(size * 1024 * 1024), // Convertendo para bytes
		path:   path,
		buffer: nil, // Inicialmente vazio, será preenchido na inicialização
	}
}

var DownloadFileData = NewDownloadFile()

// InitializeDownloadFile verifica se o arquivo /tmp/100mb.dat existe.
// Se não existir, cria o arquivo com 100 MB de dados aleatórios.
// O arquivo é carregado na memória RAM após a criação ou verificação.
func InitializeDownloadFile() error {
	filePath := DownloadFileData.path

	// Verifica se o arquivo já existe
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		log.Println("Arquivo não encontrado. Criando novo arquivo:", filePath)
		// Cria o arquivo
		file, err := os.Create(filePath)
		if err != nil {
			return fmt.Errorf("erro ao criar o arquivo %s: %v", filePath, err)
		}
		defer file.Close()

		// Define o tamanho do arquivo
		size := int64(DownloadFileData.size)

		// Copia dados aleatórios para o arquivo usando io.CopyN
		written, err := io.CopyN(file, rand.Reader, size)
		if err != nil {
			return fmt.Errorf("erro ao escrever dados aleatórios no arquivo: %v", err)
		}

		if written != size {
			return fmt.Errorf("escrita incompleta: esperado %d bytes, escreveu %d bytes", size, written)
		}

		log.Printf("Arquivo %s criado com sucesso (%d bytes).\n", filePath, written)
	} else if err != nil {
		// Outro erro ao verificar o arquivo
		return fmt.Errorf("erro ao verificar o arquivo %s: %v", filePath, err)
	} else {
		log.Println("Arquivo já existe. Nenhuma ação necessária:", filePath)
	}

	// Carregar o arquivo na memória
	return loadFileToMemory()
}

// loadFileToMemory lê o arquivo e armazena seu conteúdo na RAM
func loadFileToMemory() error {
	filePath := DownloadFileData.path

	// Abre o arquivo
	file, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("erro ao abrir o arquivo %s: %v", filePath, err)
	}
	defer file.Close()

	// Obtém o tamanho do arquivo
	fileInfo, err := file.Stat()
	if err != nil {
		return fmt.Errorf("erro ao obter informações do arquivo %s: %v", filePath, err)
	}

	// Cria um buffer na memória para armazenar o conteúdo do arquivo
	buffer := make([]byte, fileInfo.Size())

	// Lê o conteúdo do arquivo para o buffer
	_, err = io.ReadFull(file, buffer)
	if err != nil {
		return fmt.Errorf("erro ao ler o arquivo para a memória: %v", err)
	}

	// Armazena o buffer na estrutura DownloadFileData
	DownloadFileData.buffer = buffer

	log.Printf("Arquivo %s carregado na memória (%d bytes).\n", filePath, len(buffer))
	return nil
}

// Handler para o endpoint /download
func DownloadHandler(c *fiber.Ctx) error {
	sizeParam := c.Query("size")
	size, err := strconv.Atoi(sizeParam)
	if err != nil || size <= 0 {
		size = 1024 * 1024 // Tamanho padrão de 1 MB
	}

	c.Set("Content-Length", strconv.Itoa(size))
	c.Set("Content-Type", "application/octet-stream")
	c.Set("Cache-Control", "no-store")

	buf := make([]byte, 32*1024) // Buffer de 32 KB
	totalSent := 0

	for totalSent < size {
		n := size - totalSent
		if n > len(buf) {
			n = len(buf)
		}
		_, err := rand.Read(buf[:n])
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Erro ao gerar dados")
		}
		if _, err := c.Write(buf[:n]); err != nil {
			return err
		}
		totalSent += n
	}

	return c.SendStatus(fiber.StatusOK)
}

// // DownloadHandler fornece o arquivo de teste diretamente da memória
// func DownloadHandler(c *fiber.Ctx) error {
// 	// Verifica se o arquivo foi carregado na memória
// 	if DownloadFileData.buffer == nil {
// 		log.Println("Arquivo não carregado na memória")
// 		return c.Status(fiber.StatusInternalServerError).SendString("Arquivo de download não carregado na memória")
// 	}

// 	// Define os cabeçalhos de resposta
// 	c.Set("Content-Type", "application/octet-stream")
// 	c.Set("Cache-Control", "no-cache, no-store, must-revalidate")
// 	c.Set("Pragma", "no-cache")
// 	c.Set("Expires", "0")

// 	// Serve o arquivo diretamente da memória
// 	return c.Status(fiber.StatusOK).SendStream(io.NopCloser(bytes.NewReader(DownloadFileData.buffer)))
// }
