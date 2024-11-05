// register.go
package httpserver

import (
	"time"

	"github.com/drksbr/minhaconexao/pkg/httpserver/endpoints"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/websocket/v2"
)

// RegisterEndpoints registra todos os endpoints no aplicativo Fiber
func RegisterEndpoints(app *fiber.App) {
	app.Get("/version", endpoints.VersionHandler)
	app.Get("/requestinfo", endpoints.RequestInfoHandler)

	// Limitação de taxa específica para /download
	app.Get("/download", limiter.New(limiter.Config{
		Max:        1000,            // Número máximo de requisições
		Expiration: 1 * time.Second, // Período para resetar o contador
	}), endpoints.DownloadHandler)

	// Limitação de taxa específica para /upload
	app.Post("/upload", limiter.New(limiter.Config{
		Max:        1000,            // Número máximo de requisições
		Expiration: 1 * time.Second, // Período para resetar o contador
	}), endpoints.UploadHandler)

	app.Get("/wsping", websocket.New(endpoints.PingHandler))

	app.Head("/ping", endpoints.PingHeadHandler)
}
