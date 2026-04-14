import { useState } from "react";
import { Product } from "../types/types";

const ProductInfo = ({ product,  }: { 
  product: Product; 
}) => {
  const [activeTab, setActiveTab] = useState('description');


  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'details', label: 'Product Details' },
    { id: 'shipping', label: 'Shipping & Returns' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
            data-testid={`tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-4 font-semibold text-base transition-all relative ${
                activeTab === tab.id
                  ? 'text-black border-b-4 border-black bg-white'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div data-testid="tab-content" className="p-8">
        {activeTab === 'description' && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        )}

        {activeTab === 'details' && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Product Details</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-600">Category</dt>
                <dd className="font-medium capitalize">{product.category?.name || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Product ID</dt>
                <dd className="font-medium text-gray-500">#{product.id}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Price</dt>
                <dd className="font-medium text-green-600">${product.price}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Created</dt>
                <dd className="font-medium text-gray-500">
                  {new Date(product.creationAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div>
            <h3 className="text-2xl font-bold mb-6">Shipping & Returns</h3>
            <div className="space-y-6 text-gray-700">
              <div>
                <h4 className="font-semibold text-lg mb-3 text-black">Shipping Information</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>Free standard shipping on orders over $50</li>
                  <li>Express shipping available for $15</li>
                  <li>International shipping calculated at checkout</li>
                  <li>Orders typically processed within 1-2 business days</li>
                  <li>Tracking information provided via email</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-3 text-black">Return Policy</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>30-day return window from delivery date</li>
                  <li>Items must be unworn with original tags attached</li>
                  <li>Original packaging preferred but not required</li>
                  <li>Refunds processed within 5-7 business days</li>
                  <li>Free return shipping for defective items</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default ProductInfo