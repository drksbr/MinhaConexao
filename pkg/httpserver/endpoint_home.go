package httpserver

import (
	"github.com/gofiber/fiber/v2"
)

type Home struct {
	Title        string
	Logo         string
	DefaultTheme string
	Version      string
}

func NewHomeData() *Home {
	return &Home{}
}

// HomeHandler é um handler que renderiza a página inicial
func HomeHandler(c *fiber.Ctx) error {

	// Informações da página inicial
	data := NewHomeData()
	data.Title = "Página Inicial"
	data.Logo = "https://logos.mw-solucoes.com/MW-01.png"
	data.DefaultTheme = "dark"
	data.Version = "v1.0.0"

	// Retorna data em JSON
	return c.JSON(data)
}
