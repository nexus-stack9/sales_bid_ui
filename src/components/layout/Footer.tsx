import { Link } from "react-router-dom";
import { FaSearch, FaStar, FaRegStar, FaRegHeart, FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { RiAuctionFill } from 'react-icons/ri';
import { MdVerified, MdLocationOn } from 'react-icons/md';

const Footer = () => {
  return (
     <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <RiAuctionFill className="text-2xl" />
                <h3 className="text-xl font-bold">Sales Bid</h3>
              </div>
              <p className="text-gray-400">
                The world's premier online auction platform connecting buyers and sellers of unique items.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Buyers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">How to Buy</a></li>
                <li><a href="#" className="hover:text-white transition">Buyer Protection</a></li>
                <li><a href="#" className="hover:text-white transition">Bidding Tips</a></li>
                <li><a href="#" className="hover:text-white transition">Payment Options</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Sellers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">How to Sell</a></li>
                <li><a href="#" className="hover:text-white transition">Seller Fees</a></li>
                <li><a href="#" className="hover:text-white transition">Seller Tools</a></li>
                <li><a href="#" className="hover:text-white transition">Seller Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Press Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
            <p>© 2023 Sales Bid. All rights reserved.</p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
