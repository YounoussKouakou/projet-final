import { useEffect } from 'react'

function PayPalButton({ amount, onSuccess, onError }) {
  useEffect(() => {
    // Charger le script PayPal
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=XOF`
    script.async = true
    script.onload = () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount.toString(),
                    currency_code: 'XOF'
                  }
                }
              ]
            })
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture()
            onSuccess(order)
          },
          onError: (err) => {
            onError(err)
          }
        }).render('#paypal-button-container')
      }
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [amount, onSuccess, onError])

  return (
    <div id="paypal-button-container" className="w-full"></div>
  )
}

export default PayPalButton 