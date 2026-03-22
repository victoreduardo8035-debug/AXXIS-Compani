import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateSalesPitch(niche: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere um pequeno parágrafo persuasivo em Português (Brasil) para uma assessoria 360 que trabalha com: ${niche}. O tom deve ser sofisticado, inovador e focado em resultados, combinando com a marca 'AXXIS COMPANI'. Fale sobre Branding, Marketing e Sales Enablement. Máximo 3 frases.`,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar pitch:", error);
    return "Eleve sua marca de moda ao próximo nível com a AXXIS COMPANI. Nossa assessoria 360 une branding, marketing e mentoria de vendas para transformar sua loja em um ícone de mercado.";
  }
}

export function createConsultancyChat() {
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `Você é o Consultor Estratégico Sênior da AXXIS COMPANI, uma assessoria 360 premium para o nicho de moda. 
      Seu objetivo é realizar um diagnóstico rápido e sofisticado do negócio do cliente.
      
      Siga RIGOROSAMENTE este fluxo:
      1. BOAS-VINDAS: Cumprimente com elegância. Pergunte o nome da marca e há quanto tempo estão no mercado.
      2. DESAFIO: Pergunte qual a maior barreira que impede o crescimento deles hoje (ex: branding fraco, marketing ineficiente, vendas estagnadas).
      3. VISÃO: Pergunte onde eles querem estar daqui a 1 ano.
      4. DIAGNÓSTICO & AVALIAÇÃO: Com base nas respostas, forneça uma "AVALIAÇÃO ESTRATÉGICA AXXIS". 
         - Explique como o Branding, Marketing e Sales Enablement da AXXIS resolveriam os problemas citados.
         - Seja específico e mostre autoridade.
         - Finalize dizendo que um consultor humano pode detalhar esse plano no WhatsApp.
      
      REGRAS DE OURO:
      - Tom: Profissional, sofisticado, autoritário mas acolhedor.
      - Idioma: Português (Brasil).
      - Interação: Uma pergunta por vez. Não sobrecarregue o cliente.
      - Estilo: Use formatação markdown (negrito) para destacar pontos importantes.`,
    },
  });
}
