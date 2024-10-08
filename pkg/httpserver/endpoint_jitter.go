package httpserver

import (
	"encoding/json"
	"net/http"

	"github.com/drksbr/minhaconexao/pkg/modules"
)

func JitterHandler(w http.ResponseWriter, r *http.Request) {
	var delays []float64

	err := json.NewDecoder(r.Body).Decode(&delays)
	if err != nil {
		http.Error(w, "Formato inválido", http.StatusBadRequest)
		return
	}

	jitterResult := modules.CalculateJitter(delays)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(jitterResult)
}
