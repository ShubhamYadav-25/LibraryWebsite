import { useState } from "react";
import { toast } from "react-toastify";
import { Smartphone, Wallet, X } from "lucide-react";
import axios from "axios";

/**
 * Razorpay-style simulated payment modal for UPI / Cash
 */
// const PaymentHandler = ({ amount, days, payment_id, onPaid, onCancel }) => {
//   const [method, setMethod] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [processing, setProcessing] = useState(false);

//   const handlePayment = () => {
//     if (!method) return toast.warn("Select a payment method first!");

//     if (method === "cash") {
//       processPayment("cash");
//     } else {
//       setShowModal(true);
//     }
//   };

//   const processPayment = async (method, txnId = null) => {
//     try {
//       setProcessing(true);

//       const userid = localStorage.getItem("ID");
//       if (!userid) {
//         toast.error("User not logged in!");
//         return;
//       }

//       const res = await axios.put(
//         `http://localhost:5000/user/${userid}/fine`,
//         {
//           payment_id,
//           pay_method: method,
//           transaction_id: txnId,
//           amount,
//         },
//         { withCredentials: true }
//       );

//       if (res.status === 200) {
//         toast.success("Payment successful!");
//         onPaid?.();
//         setShowModal(false);
//       } else {
//         toast.error("Payment could not be completed!");
//       }
//     } catch (err) {
//       console.error("Payment error:", err);
//       toast.error("Fine payment failed!");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // Simulated UPI transaction handler
//   const simulateUPIPayment = () => {
//     if (processing) return;

//     setProcessing(true);
//     setTimeout(() => {
//       const txnId = "TXN" + Math.floor(Math.random() * 1e7);
//       processPayment("upi", txnId);
//     }, 2000);
//   };

//   return (
//     <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
//       <div className="flex items-center space-x-3 mb-3">
//         <Wallet className="w-5 h-5 text-yellow-600" />
//         <div>
//           <p className="font-semibold text-red-800">Book is overdue</p>
//           <p className="text-sm text-red-700">
//             Late fee: ₹{amount} ({days} {days === 1 ? "day" : "days"} overdue)
//           </p>
//           <p className="text-sm text-yellow-700">
//             Choose your payment method to clear dues.
//           </p>
//         </div>
//       </div>

//       <div className="flex space-x-4 mb-4">
//         <label className="flex items-center space-x-2 cursor-pointer">
//           <input
//             type="radio"
//             name="method"
//             checked={method === "cash"}
//             onChange={() => setMethod("cash")}
//           />
//           <span>Cash</span>
//         </label>

//         <label className="flex items-center space-x-2 cursor-pointer">
//           <input
//             type="radio"
//             name="method"
//             checked={method === "upi"}
//             onChange={() => setMethod("upi")}
//           />
//           <span>UPI</span>
//         </label>
//       </div>

//       <button
//         onClick={handlePayment}
//         disabled={processing}
//         className={`w-full ${
//           processing
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-green-500 hover:bg-green-600"
//         } text-white py-2 rounded-lg font-semibold`}
//       >
//         {processing ? "Processing..." : "Pay Now"}
//       </button>

//       {onCancel && (
//         <button
//           onClick={onCancel}
//           className="w-full mt-2 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
//         >
//           Cancel Payment
//         </button>
//       )}

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
//             <h3 className="text-lg font-semibold mb-2">Pay with UPI</h3>
//             <p className="text-sm text-gray-600 mb-4">
//               Scan QR or use UPI ID
//             </p>

//             <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-40 mb-4">
//               <Smartphone className="w-12 h-12 text-purple-500" />
//             </div>

//             <p className="text-center text-sm mb-4">
//               UPI ID: <span className="font-medium">library@upi</span>
//             </p>

//             <button
//               onClick={simulateUPIPayment}
//               disabled={processing}
//               className={`w-full py-2 rounded-lg text-white ${
//                 processing
//                   ? "bg-gray-400"
//                   : "bg-purple-500 hover:bg-purple-600"
//               }`}
//             >
//               {processing ? "Processing..." : "Simulate Payment Success"}
//             </button>

//             <button
//               onClick={() => setShowModal(false)}
//               disabled={processing}
//               className="w-full mt-3 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

const PaymentHandler = ({ amount, days, payment_id, onPaid, onCancel }) => {
  const [method, setMethod] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    if (!method) return toast.warn("Select a payment method first!");

    if (method === "cash") {
      processPayment("cash");
    } else {
      setShowModal(true);
    }
  };

  const processPayment = async (method, txnId = null) => {
    try {
      setProcessing(true);

      const userid = localStorage.getItem("ID");
      if (!userid) {
        toast.error("User not logged in!");
        return;
      }

      const res = await axios.put(
        `http://localhost:5000/user/${userid}/fine`,
        {
          payment_id,
          pay_method: method,
          transaction_id: txnId,
          amount,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Payment successful!");
        onPaid?.();
        setShowModal(false);
      } else {
        toast.error("Payment could not be completed!");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Fine payment failed!");
    } finally {
      setProcessing(false);
    }
  };

  const simulateUPIPayment = () => {
    if (processing) return;

    setProcessing(true);
    setTimeout(() => {
      const txnId = "TXN" + Math.floor(Math.random() * 1e7);
      processPayment("upi", txnId);
    }, 2000);
  };

  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-4 animate-fade-in relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pr-8">Pay Fine</h3>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
        <div className="flex items-center space-x-3 mb-3">
          <Wallet className="w-5 h-5 text-yellow-600" />
          <div>
            <p className="font-semibold text-red-800">Book is overdue</p>
            <p className="text-sm text-red-700">
              Late fee: ₹{amount} ({days} {days === 1 ? "day" : "days"} overdue)
            </p>
            <p className="text-sm text-yellow-700">
              Choose your payment method to clear dues.
            </p>
          </div>
        </div>

        <div className="flex space-x-4 mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="method"
              checked={method === "cash"}
              onChange={() => setMethod("cash")}
            />
            <span>Cash</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="method"
              checked={method === "upi"}
              onChange={() => setMethod("upi")}
            />
            <span>UPI</span>
          </label>
        </div>

        <button
          onClick={handlePayment}
          disabled={processing}
          className={`w-full ${
            processing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } text-white py-2 rounded-lg font-semibold`}
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>

        {onCancel && (
          <button
            onClick={onCancel}
            className="w-full mt-2 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
          >
            Cancel Payment
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80 relative">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold mb-2">Pay with UPI</h3>
            <p className="text-sm text-gray-600 mb-4">
              Scan QR or use UPI ID
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-40 mb-4">
              <Smartphone className="w-12 h-12 text-purple-500" />
            </div>

            <p className="text-center text-sm mb-4">
              UPI ID: <span className="font-medium">library@upi</span>
            </p>

            <button
              onClick={simulateUPIPayment}
              disabled={processing}
              className={`w-full py-2 rounded-lg text-white ${
                processing
                  ? "bg-gray-400"
                  : "bg-purple-500 hover:bg-purple-600"
              }`}
            >
              {processing ? "Processing..." : "Simulate Payment Success"}
            </button>

            <button
              onClick={() => setShowModal(false)}
              disabled={processing}
              className="w-full mt-3 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      </div>
      </div>
    </>
  );
};

export default PaymentHandler;


// Payment Modal Component
export const PaymentModal = ({ isOpen, onClose, fines, totalAmount }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  if (!isOpen) return null;

  const handlePayment = () => {
    console.log('Processing payment:', { paymentMethod, totalAmount });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Payment Summary */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white mb-6">
            <p className="text-sm opacity-90 mb-2">Total Amount Due</p>
            <h3 className="text-4xl font-bold mb-4">${totalAmount.toFixed(2)}</h3>
            <div className="flex items-center space-x-2 text-sm opacity-90">
              <Receipt className="w-4 h-4" />
              <span>{Array.isArray(fines) ? fines.length : 1} fine(s) to pay</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
            <div className="grid grid-cols-3 gap-4">
              <PaymentMethodCard
                method="Card"
                icon={CreditCard}
                isSelected={paymentMethod === 'card'}
                onClick={() => setPaymentMethod('card')}
              />
              <PaymentMethodCard
                method="Wallet"
                icon={Wallet}
                isSelected={paymentMethod === 'wallet'}
                onClick={() => setPaymentMethod('wallet')}
              />
              <PaymentMethodCard
                method="Bank"
                icon={DollarSign}
                isSelected={paymentMethod === 'bank'}
                onClick={() => setPaymentMethod('bank')}
              />
            </div>
          </div>

          {/* Card Payment Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    maxLength="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    maxLength="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'wallet' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                You will be redirected to your digital wallet to complete the payment.
              </p>
            </div>
          )}

          {paymentMethod === 'bank' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                Bank transfer details will be provided after confirmation.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handlePayment}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Pay ${totalAmount.toFixed(2)}</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 hover:bg-gray-50 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};