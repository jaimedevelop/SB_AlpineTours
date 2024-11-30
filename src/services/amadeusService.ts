import Amadeus from 'amadeus';

const amadeus = new Amadeus({
	clientId: import.meta.env.VITE_AMADEUS_CLIENT_ID,
	clientSecret: import.meta.env.VITE_AMADEUS_CLIENT_SECRET
});

export interface HotelSearchParams {
	latitude: number;
	longitude: number;
	radius: number;
	radiusUnit: 'KM' | 'MILE';
	ratings?: string[];
	priceRange?: string;
}

export interface Hotel {
	hotelId: string;
	name: string;
	rating: string;
	description: string;
	address: {
		cityName: string;
		countryCode: string;
	};
	location: {
		latitude: number;
		longitude: number;
	};
}

export const searchHotels = async ({
	latitude,
	longitude,
	radius,
	radiusUnit = 'KM',
	ratings,
	priceRange
}: HotelSearchParams): Promise<Hotel[]> => {
	try {
		const response = await amadeus.shopping.hotelOffers.get({
			latitude,
			longitude,
			radius,
			radiusUnit,
			ratings: ratings?.join(','),
			priceRange
		});

		return response.data.map((hotel: any) => ({
			hotelId: hotel.hotel.hotelId,
			name: hotel.hotel.name,
			rating: hotel.hotel.rating,
			description: hotel.hotel.description?.text || '',
			address: {
				cityName: hotel.hotel.address.cityName,
				countryCode: hotel.hotel.address.countryCode,
			},
			location: {
				latitude: hotel.hotel.latitude,
				longitude: hotel.hotel.longitude,
			}
		}));
	} catch (error) {
		console.error('Error fetching hotels:', error);
		throw error;
	}
};