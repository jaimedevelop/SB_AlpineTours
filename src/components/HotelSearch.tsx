import React, { useState, useEffect } from 'react';
import { searchHotels, Hotel } from '../services/amadeusService';

interface HotelSearchProps {
	resortLatitude: number;
	resortLongitude: number;
}

const HotelSearch: React.FC<HotelSearchProps> = ({ resortLatitude, resortLongitude }) => {
	const [hotels, setHotels] = useState<Hotel[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchHotels = async () => {
			setLoading(true);
			try {
				const hotelData = await searchHotels({
					latitude: resortLatitude,
					longitude: resortLongitude,
					radius: 10,
					radiusUnit: 'KM',
				});
				setHotels(hotelData);
			} catch (err) {
				setError('Failed to fetch hotels. Please try again later.');
			} finally {
				setLoading(false);
			}
		};

		fetchHotels();
	}, [resortLatitude, resortLongitude]);

	if (loading) return <div>Loading hotels...</div>;
	if (error) return <div className="error">{error}</div>;

	return (
		<div className="hotels-container">
			<h2>Nearby Hotels</h2>
			<div className="hotels-grid">
				{hotels.map((hotel) => (
					<div key={hotel.hotelId} className="hotel-card">
						<h3>{hotel.name}</h3>
						<p>Rating: {hotel.rating}</p>
						<p>{hotel.description}</p>
						<p>
							Location: {hotel.address.cityName}, {hotel.address.countryCode}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};