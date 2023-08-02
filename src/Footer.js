// Footer.js
import React , {useEffect,useState} from 'react';
import styled from 'styled-components';
import { API_BASE_URL } from './config';



// Create a styled Patreon button using the styled() function
const PatreonButton = styled.button`
  padding: 12px 24px;
  margin:12px;
  font-size: 16px;
  color: #fff;
  background-color: #ff424d;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-decoration: none;

  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff5f6d;
  }
`;
const FooterContainer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  background-color: linear-gradient(to bottom right, #ff8a00, #e52e71);
`;
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-align: center;

  h2 {
    font-size: 24px;
    margin-bottom: 16px;
    color: #333;
  }

  p {
    font-size: 16px;
    margin-bottom: 16px;
    color: #777;
  }

  input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.3s ease;
  }

  input:focus {
    border-color: #3399cc;
  }

  button {
    padding: 12px 24px;
    font-size: 16px;
    color: #fff;
    background-color: #3399cc;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s ease;
    margin-right: 8px;
  }

  button:hover {
    background-color: #4ea6d2;
  }

  button.cancel {
    background-color: #999;
  }

  button.cancel:hover {
    background-color: #bbb;
  }
`;


const loadRazorPay = (script) => {
  return new Promise((resolve) => {
    const existingScript = document.getElementById('razorpay-sdk');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'razorpay-sdk';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    } else {
      resolve(true);
    }
  });
};

const Footer = () => {

  const [showModal, setShowModal] = useState(false);
  const [amountInput, setAmountInput] = useState('');


  useEffect(() => {
    loadRazorPay();
  }, []);

  const handleSubmit = () => {
    displayRazorPay();
    setShowModal(false);
  };
  
  const handleAmountInputChange = (event) => {
    setAmountInput(event.target.value);
  };

  const displayRazorPay = async () => {
    const res = await loadRazorPay();
    if (!res) {
      alert('RazorPay SDK Failed');
      return;
    }

    const data = await fetch(`${API_BASE_URL}razorpay`, { 
      method: 'POST' ,
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
amount: amountInput,

      })
    })
    .then((response) => response.json())
    .catch((error) => console.error("Error fetching data:", error));
  
  
      const options = {
        "key": "rzp_test_r3o2qLZPBVSn8M", // Enter the Key ID generated from the Dashboard
        "amount": `${amountInput*100}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": data.currency,
        "name": "Patreon", // your business name
        "description": "Thank you",
        "image": "https://example.com/your_logo",
        "order_id": data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature)
      },
        "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
            "name": "Gaurav Kumar", //your customer's name
            "email": "gaurav.kumar@example.com",
            "contact": "9000090000" //Provide the customer's phone number for better conversion rates 
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
  
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <FooterContainer>
        If u like my website and want to support us !!  
      <PatreonButton
        id="rzp-button1"
        onClick={()=>setShowModal(true)}
      >
        Become a Patreon
      </PatreonButton>
    {showModal && (
      <Modal>
        <ModalContent>
          <h2>Thank You for Your Support!</h2>
          <p>Please enter the amount you would like to donate:</p>
          <input
            type="number"
            value={amountInput}
            onChange={handleAmountInputChange}
            placeholder="Enter amount"
          />
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </ModalContent>
      </Modal>
    )}      
    </FooterContainer>
  );
};

// Create a styled footer container using the styled() function


export default Footer;
