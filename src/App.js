/* global Mollie */
import { useEffect, useMemo } from 'react';

import Config from './config.json';
import { Card } from 'react-bootstrap';

function App() {
  console.log('RENDER APP');
  const mollie = useMemo(
    () => {
      try {
        console.log('Init mollie');
        return Mollie
          ? Mollie(Config.mollie.profileId, {
            locale: 'nl_NL',
            testmode: true,
          })
          : undefined;
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  useEffect(() => {
    console.log('Format mollie');
    const options = {
      styles: {
        base: {
          display: "block",
          width: "100%",
          height: "calc(1.5em + 0.75rem + 2px)",
          padding: "0.375rem 0.75rem",
          fontSize: "1rem",
          fontWeight: 400,
          lineHeight: 1.5,
          color: "#495057",
          backgroundColor: "#ff0000",
          backgroundClip: "padding-box",
          border: "1px solid #ced4da",
          borderRadius: "0.25rem",
          transition: "border-color .15s",
        },
      },
    };
    const cardNumber = mollie.createComponent("cardNumber", options);
    cardNumber.mount("#card-number");

    const cardNumberError = document.querySelector("#card-number-error");
    cardNumberError &&
      cardNumber.addEventListener("change", (event) => {
        if (event.error && event.touched) {
          cardNumberError.textContent = event.error;
        } else {
          cardNumberError.textContent = "";
        }
      });

    const cardHolder = mollie.createComponent("cardHolder", options);
    cardHolder.mount("#card-holder");

    const cardHolderError = document.querySelector("#card-holder-error");
    cardHolderError &&
      cardHolder.addEventListener("change", (event) => {
        if (event.error && event.touched) {
          cardHolderError.textContent = event.error;
        } else {
          cardHolderError.textContent = "";
        }
      });

    const expiryDate = mollie.createComponent("expiryDate", options);
    expiryDate.mount("#expiry-date");

    const expiryDateError = document.querySelector("#expiry-date-error");
    expiryDateError &&
      expiryDate.addEventListener("change", (event) => {
        if (event.error && event.touched) {
          expiryDateError.textContent = event.error;
        } else {
          expiryDateError.textContent = "";
        }
      });

    const verificationCode = mollie.createComponent(
      "verificationCode",
      options
    );
    verificationCode.mount("#verification-code");

    const verificationCodeError = document.querySelector(
      "#verification-code-error"
    );
    verificationCodeError &&
      verificationCode.addEventListener("change", (event) => {
        if (event.error && event.touched) {
          verificationCodeError.textContent = event.error;
        } else {
          verificationCodeError.textContent = "";
        }
      });

    var form = document.getElementById("form");
    form.addEventListener('submit', async e => {
        e.preventDefault();
      
        const { token, error } = await mollie.createToken();
      
        if (error) {
          // Something wrong happened while creating the token. Handle this situation gracefully.
          return;
        }
      
        // Add token to the form
        const tokenInput = document.createElement('input');
        tokenInput.setAttribute('type', 'hidden');
        tokenInput.setAttribute('name', 'cardToken');
        tokenInput.setAttribute('value', token);
      
        form.appendChild(tokenInput);
      
        // Submit form to the server
        form.submit();
      });
  }, [mollie]);

  const renderPaymentCreditCard = () => {
    return (
      <Card>
        <Card.Body>
          <form id="form">
            <div id="card-number"></div>
            <div id="card-number-error"></div>

            <div id="card-holder"></div>
            <div id="card-holder-error"></div>

            <div id="expiry-date"></div>
            <div id="expiry-date-error"></div>

            <div id="verification-code"></div>
            <div id="verification-code-error"></div>
          </form>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div>
      <h2>Creditcard</h2>
      {renderPaymentCreditCard()}
    </div>
  );
}

export default App;
