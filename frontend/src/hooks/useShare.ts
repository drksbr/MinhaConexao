import { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';

type UseShareResult = {
    ref: React.RefObject<HTMLDivElement>;
    share: () => void;
};

const useShare = (): UseShareResult => {
    const ref = useRef<HTMLDivElement | null>(null);

    const share = useCallback(async () => {
        if (ref.current) {
            try {
                // Captura a imagem do card usando html2canvas
                const canvas = await html2canvas(ref.current);
                canvas.toBlob(async (blob) => {
                    if (blob) {
                        const file = new File([blob], 'card.png', { type: 'image/png' });

                        // Verifica se o navegador suporta a API de compartilhamento
                        if (navigator.canShare && navigator.canShare({ files: [file] })) {
                            try {
                                await navigator.share({
                                    files: [file],
                                    title: 'Compartilhar Card',
                                    text: 'Confira este card!',
                                });
                            } catch (error) {
                                console.error('Erro ao compartilhar:', error);
                            }
                        } else {
                            alert('A API de compartilhamento não é suportada no seu navegador.');
                        }
                    }
                });
            } catch (error) {
                console.error('Erro ao capturar o card:', error);
            }
        }
    }, []);

    return { ref, share };
};

export default useShare;
