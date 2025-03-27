const stripe = require('stripe')('sk_test_51R7D6gCZA9KIcchBNb0stGACQ7cg41csLsEROsMWQk8sunafXYW5tbhg11eOhZBmAH7I3qIqos1QRDLz32rYnDql00AFMDdMyC');

// Créer une offre
exports.createPayement = async (req, res) => {
    console.log("stripeeeee");
    const { amount, currency } = req.body;
    try {
        console.log("stripeeeee");
        const paymentIntent = await stripe.paymentIntents.create({
        amount,      // montant en centimes (ex: 1099 pour 10,99€)
        currency,    // exemple: 'eur' ou 'usd'
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.createSubscription = async (req, res) => {
    try {
      // Pour cet exemple, on suppose que l'email du client est envoyé dans le body.
      // Dans un cas réel, vous pouvez récupérer l'utilisateur connecté et son stripeCustomerId s'il existe.
      const { email } = req.body;
  
      // Créer un client Stripe (ou récupérer le client existant)
      const customer = await stripe.customers.create({
        email: email || 'client@example.com',
      });
  
      // Créer la souscription avec un prix récurrent.
      // Remplacez 'price_12345' par l'ID de votre prix créé sur le dashboard Stripe.
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: 'price_1R7ECnCZA9KIcchBC9Eexk2Y',
          },
        ],
        // Créer la souscription en mode "incomplet" afin que l'utilisateur puisse confirmer le paiement.
        payment_behavior: 'default_incomplete',
        // On étend l'objet pour récupérer le PaymentIntent lié à la première facture.
        expand: ['latest_invoice.payment_intent'],
        payment_settings: {
          payment_method_types: ['card'], // Pas de "link"
        },
      });
  
      // Récupérer le PaymentIntent et son client_secret
      const paymentIntent = subscription.latest_invoice.payment_intent;
      const clientSecret = paymentIntent.client_secret;
  
      res.send({ subscriptionId: subscription.id, clientSecret });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };