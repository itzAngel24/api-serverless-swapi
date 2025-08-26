import { forEach } from "lodash";
import { QuoteAPIQuote, QuoteAPIResponse } from "./types/quoteapi.types";
import { SWAPIPerson, SWAPIResponse } from "./types/swapi.types";
import { Fusion } from "@/models/Fusion";
import { CreateFusionData } from "./types/fusion.types";

export class FusionAdapter {

    public adapt(peopleData: SWAPIResponse<SWAPIPerson>, quotesData: QuoteAPIResponse<QuoteAPIQuote>): Fusion[] {
        const fusions: Fusion[] = [];
        try {
            // Validar que existan los datos necesarios
            if (!peopleData?.results.results || !Array.isArray(peopleData.results.results)) {
                return [];
            }
            if (!quotesData?.results || !Array.isArray(quotesData.results)) {
                return [];
            }
            // Obtener la longitud mínima para evitar índices undefined
            const peopleCount = peopleData.results.results.length;
            const quotesCount = quotesData.results.length;
            const maxItems = Math.max(peopleCount, quotesCount);
            // Iterar sobre el array más largo para no perder datos
            for (let index = 0; index < maxItems; index++) {
                const person = peopleData.results.results[index];
                const quote = quotesData.results[index];
                // Si no hay persona en este índice, continuar
                if (!person) {
                    continue;
                }
                const fusion: Fusion = new Fusion(
                    (index + 1).toString(), // ID basado en posición (1-indexed)
                    person.name || 'Unknown Character',
                    person.height || 'unknown',
                    person.mass || 'unknown',
                    person.gender || 'unknown',
                    person.homeworld || 'unknown',
                    quote?.quote || 'No quote available'
                );
                fusions.push(fusion);
            }
            return fusions;
            
        } catch (error) {
            console.error("Error adapting data:", error);
            return [];
        }
    }

    public fusionToCreateFusionData(fusion: Fusion): CreateFusionData {
        return {
            name: fusion.name,
            height: fusion.height,
            mass: fusion.mass,
            gender: fusion.gender,
            homeworld: fusion.homeworld,
            favoritequote: fusion.favoritequote
        };
    }

    public fusionToCreateFusionDataList(fusion: Fusion[]): CreateFusionData[] {
        const fusionDataList: CreateFusionData[] = [];
        forEach(fusion, (item) => {
            fusionDataList.push(this.fusionToCreateFusionData(item));
        });
        return fusionDataList;
    }
}