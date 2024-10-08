package httpserver

import (
	"embed"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

//go:embed react/dist/*
var web embed.FS

func InitHTTPServer() {
	app := fiber.New(fiber.Config{})

	// Middlewares
	app.Use(logger.New())
	app.Use(recover.New())

	// Adiciona o middleware de CORS para permitir requisições de qualquer origem
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",                            // Permite qualquer domínio
		AllowHeaders: "Origin, Content-Type, Accept", // Define quais cabeçalhos são permitidos
	}))

	// Servir arquivos estáticos
	// app.Static("/", "./pkg/httpserver/react/dist/")

	app.Use("/", filesystem.New(filesystem.Config{
		Root:       http.FS(web),
		PathPrefix: "react/dist",
		Browse:     true,
	}))

	// Exite no console a lista de todos os arquivos no diretório estático do servidor
	files, err := web.ReadDir("react/dist")
	if err != nil {
		log.Fatalf("Erro ao listar arquivos estáticos: %v", err)
	}

	for _, file := range files {
		log.Printf("Arquivo estático: %s\n", file.Name())
	}

	// Registra os endpoints
	RegisterEndpoints(app)

	// Iniciar o servidor HTTP
	log.Println("Servidor HTTP rodando na porta 8080")
	if err := app.Listen(":8080"); err != nil {
		log.Fatalf("Erro ao iniciar o servidor HTTP: %v", err)
	}
}

func RegisterEndpoints(app *fiber.App) {
	app.Get("/homeinfo", HomeHandler)
	app.Get("/ping", LatencyHandler)
	app.Get("/requestinfo", RequestInfoHandler)
}
