package httpserver

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
)

type ConnectionInfo struct {
	XRealIP              string
	XForwardedSourcePort string
}

func NewConnectionInfoData() *ConnectionInfo {
	return &ConnectionInfo{}
}

func ConnectionInfoHandler(c *fiber.Ctx) error {
	// Renderiza o template "connectioninfo" localizado em ./pkg/httpserver/views/connectioninfo.html
	// Passa dados opcionais para o template através de um mapa

	// Pega os valores no header da requisicao,
	// x-real-ip é o IP do cliente
	// x-forwarded-source-port é a porta de origem da requisicao

	data := NewConnectionInfoData()
	data.XRealIP = c.Get("x-real-ip")
	if data.XRealIP == "" {
		data.XRealIP = c.IP()
	}
	data.XForwardedSourcePort = c.Get("x-forwarded-source-port")
	if data.XForwardedSourcePort == "" {
		data.XForwardedSourcePort = c.Port()
	}

	fmt.Printf("X-Real-IP: %s\n", data.XRealIP)
	fmt.Printf("X-Forwarded-Source-Port: %s\n", data.XForwardedSourcePort)
	fmt.Printf("Timestamp: %s\n", time.Now().Format(time.RFC3339))

	return c.Render("connectioninfo", fiber.Map{
		"clientIp":   data.XRealIP,
		"sourcePort": data.XForwardedSourcePort,
		"timestamp":  time.Now().Format(time.RFC3339),
	})
}
