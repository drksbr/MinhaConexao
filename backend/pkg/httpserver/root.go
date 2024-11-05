package httpserver

import (
	"embed"
	"log"
	"net/http"
	"regexp"

	"github.com/drksbr/minhaconexao/pkg/httpserver/endpoints"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

//go:embed dist/*
var web embed.FS

func InitHTTPServer() {
	app := fiber.New(fiber.Config{
		BodyLimit: 100 * 1024 * 1024, // Limite de 10 MB para uploads
	})

	// Iniciando o arquivo 10mb.bin do endpoint download
	if err := endpoints.InitializeDownloadFile(); err != nil {
		log.Fatalf("Falha ao inicializar o arquivo de download: %v", err)
	}

	// Middlewares
	app.Use(logger.New())
	app.Use(recover.New())

	// Custom CORS Middleware para permitir apenas subdomínios de provedorveloz.com.br e incluir Cache-Control
	app.Use(func(c *fiber.Ctx) error {
		origin := c.Get("Origin")

		// Define o padrão para *.provedorveloz.com.br
		pattern := `^https?://([a-zA-Z0-9-]+\.)?provedorveloz\.com\.br$`
		matched, err := regexp.MatchString(pattern, origin)
		if err != nil {
			log.Println("Erro ao compilar regex:", err)
			return c.Next()
		}

		if matched {
			c.Set("Access-Control-Allow-Origin", origin)
			c.Set("Vary", "Origin")
			c.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD")
			c.Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Cache-Control")
			c.Set("Access-Control-Allow-Credentials", "true")
		}

		// Se for uma requisição preflight, responder imediatamente
		if c.Method() == http.MethodOptions {
			return c.SendStatus(http.StatusNoContent)
		}

		return c.Next()
	})

	// Middleware para servir arquivos estáticos
	app.Use("/", filesystem.New(filesystem.Config{
		Root:       http.FS(web),
		PathPrefix: "dist",
		Browse:     true,
	}))

	// Registra os endpoints
	RegisterEndpoints(app)

	// Iniciar o servidor HTTP
	log.Println("Servidor HTTP rodando na porta 8080")
	if err := app.Listen(":8080"); err != nil {
		log.Fatalf("Erro ao iniciar o servidor HTTP: %v", err)
	}
}
