import type {Restaurant } from "@/src/types/lightning";

export const MOCK_RECOMMENDED_RESTAURANTS: Restaurant[] = [
  {
    id: "101",
    name: "연남 온기식당",
    description: "한식",
    phoneNumber: "12-345-678",
    location:{
      lat: 37.5599,
      lng: 126.9236,
    }
  }
];