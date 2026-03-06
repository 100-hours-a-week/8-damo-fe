import { useQuery } from "@tanstack/react-query";
import { getLightningRecommendation } from "@/src/lib/api/client/lightning";

interface Coords {
  latitude: number;
  longitude: number;
}

function normalizeCoord(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function useLightningRecommendation(coords: Coords | null) {
  const normalizedLat = coords ? normalizeCoord(coords.latitude) : null;
  const normalizedLng = coords ? normalizeCoord(coords.longitude) : null;

  return useQuery({
    queryKey: ["lightning-recommended-restaurants", { lat: normalizedLat, lng: normalizedLng }],
    queryFn: ({ signal }) =>
      getLightningRecommendation(
        String(coords!.longitude),
        String(coords!.latitude),
        { signal }
      ),
    enabled: !!coords,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: false,
  });
}