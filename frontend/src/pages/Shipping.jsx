import React from 'react';

const Shipping = () => {
  return (
    <div className="bg-midnight text-urban">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-bebas text-5xl text-white mb-8">Shipping Policy</h1>
        
        <div className="prose prose-invert prose-lg max-w-none font-montserrat">
          <p>Last updated: March 11, 2026</p>

          <h2>Order Processing Time</h2>
          <p>
            All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.
          </p>
          <p>
            If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in shipment of your order, we will contact you via email or telephone.
          </p>

          <h2>Shipping Rates & Delivery Estimates</h2>
          <p>
            Shipping charges for your order will be calculated and displayed at checkout.
          </p>
          <p>
            Delivery estimates will be provided once your order is placed. Delivery delays can occasionally occur.
          </p>

          <h2>Shipment Confirmation & Order Tracking</h2>
          <p>
            You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
          </p>

          <h2>Customs, Duties and Taxes</h2>
          <p>
            Biiggg X is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).
          </p>

          <h2>Damages</h2>
          <p>
            Biiggg X is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim.
          </p>
          <p>
            Please save all packaging materials and damaged goods before filing a claim.
          </p>

          <h2>Contact Us</h2>
          <p>If you have any questions about this Shipping Policy, please contact us:</p>
          <ul>
            <li>By email: support@biigggx.com</li>
            <li>By visiting this page on our website: https://www.biigggx.com/contact</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
