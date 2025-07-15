
import { Product } from '@/types/auction';
import dayjs from 'dayjs';

export const mockProducts: Product[] = [

  {
    id: '2',
    name: 'Rolex Submariner Date',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&h=400&fit=crop',
    currentBid: 12500,
    totalBids: 45,
    timeLeft: dayjs().add(1, 'day').add(3, 'hours').toISOString(),
    location: 'Los Angeles, CA',
    category: 'Watches',
    seller: 'LuxuryTimepieces',
    startingBid: 8000,
    condition: 'Like New'
  },
  {
    id: '3',
    name: 'Supreme Box Logo Hoodie FW21',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    currentBid: 650,
    totalBids: 18,
    timeLeft: dayjs().add(45, 'minutes').toISOString(),
    location: 'Chicago, IL',
    category: 'Streetwear',
    seller: 'SupremeCollector',
    startingBid: 300,
    buyNowPrice: 800,
    condition: 'New'
  },
  {
    id: '4',
    name: 'MacBook Pro 16" M3 Max',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    currentBid: 3200,
    totalBids: 32,
    timeLeft: dayjs().add(6, 'hours').add(30, 'minutes').toISOString(),
    location: 'San Francisco, CA',
    category: 'Electronics',
    seller: 'TechGuru2024',
    startingBid: 2500,
    condition: 'Like New'
  },
  {
    id: '5',
    name: 'Pokemon Base Set Charizard PSA 10',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    currentBid: 15000,
    totalBids: 67,
    timeLeft: dayjs().add(3, 'days').add(12, 'hours').toISOString(),
    location: 'Miami, FL',
    category: 'Collectibles',
    seller: 'PokemonMaster',
    startingBid: 10000,
    condition: 'New'
  },
  {
    id: '6',
    name: 'Louis Vuitton Neverfull MM',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
    currentBid: 1850,
    totalBids: 29,
    timeLeft: dayjs().add(8, 'hours').toISOString(),
    location: 'Beverly Hills, CA',
    category: 'Handbags',
    seller: 'LuxuryBags',
    startingBid: 1200,
    buyNowPrice: 2200,
    condition: 'Good'
  },
  {
    id: '7',
    name: 'Yeezy Boost 350 V2 "Zebra"',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop',
    currentBid: 420,
    totalBids: 16,
    timeLeft: dayjs().add(4, 'hours').add(22, 'minutes').toISOString(),
    location: 'Atlanta, GA',
    category: 'Sneakers',
    seller: 'YeezyKing',
    startingBid: 250,
    buyNowPrice: 500,
    condition: 'Like New'
  },
  {
    id: '8',
    name: 'Off-White x Nike Air Force 1',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
    currentBid: 2100,
    totalBids: 41,
    timeLeft: dayjs().add(12, 'hours').add(45, 'minutes').toISOString(),
    location: 'Portland, OR',
    category: 'Sneakers',
    seller: 'OffWhiteCollector',
    startingBid: 1500,
    condition: 'New'
  }
];

export const categories = ['Sneakers', 'Watches', 'Streetwear', 'Electronics', 'Collectibles', 'Handbags'];
export const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'San Francisco, CA', 'Miami, FL', 'Beverly Hills, CA', 'Atlanta, GA', 'Portland, OR'];
export const conditions = ['New', 'Like New', 'Good', 'Fair'];
