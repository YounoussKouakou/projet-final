import { useEffect } from 'react'

function PayPalButton({ amount, onSuccess, onError }) {
  useEffect(() => {
    // Charger le script PayPal
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=AeqEdDXPxrgDlHtNqk4U31IV43VEFXyWsGsTHSYxooTM7sCIYs4MdiT7YZx0vxsUoaq55llm-EF2pWq6&currency=USD`
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
                    currency_code: 'USD'
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