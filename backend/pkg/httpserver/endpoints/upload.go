// endpoints/upload.go
package endpoints

import (
	"bytes"
	"io"

	"github.com/gofiber/fiber/v2"
)

// Handler para o endpoint /upload
func UploadHandler(c *fiber.Ctx) error {
	c.Set("Cache-Control", "no-store")
	c.Set("Content-Type", "text/plain")

	// Use bytes.NewReader para obter um io.Reader do corpo da requisição
	_, err := io.Copy(io.Discard, bytes.NewReader(c.Body()))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Erro ao ler dados")
	}
	return c.SendString("Upload concluído")
}

// // UploadHandler recebe um arquivo para teste de upload
// func UploadHandler(c *fiber.Ctx) error {
// 	// Recebe o arquivo com o nome correto conforme o frontend
// 	file, err := c.FormFile("file")
// 	if err != nil {
// 		log.Println("Erro ao receber o arquivo:", err)
// 		return c.Status(fiber.StatusBadRequest).SendString("Erro ao receber o arquivo")
// 	}

// 	// Abre o arquivo
// 	openedFile, err := file.Open()
// 	if err != nil {
// 		log.Println("Erro ao abrir o arquivo:", err)
// 		return c.Status(fiber.StatusInternalServerError).SendString("Erro ao abrir o arquivo")
// 	}
// 	defer openedFile.Close()

// 	// Descarte eficiente dos dados usando io.Copy e io.Discard
// 	if _, err := io.Copy(io.Discard, openedFile); err != nil {
// 		log.Println("Erro ao ler o arquivo:", err)
// 		return c.Status(fiber.StatusInternalServerError).SendString("Erro ao ler o arquivo")
// 	}

// 	// Resposta de sucesso
// 	return c.SendStatus(fiber.StatusOK)
// }
