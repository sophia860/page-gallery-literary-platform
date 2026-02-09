/**
 * The Page Gallery - Stripe Payment Integration
 * Handles all payment processing through Stripe
 */

class StripePaymentHandler {
  constructor(config) {
    this.config = config;
    this.stripe = null;
    this.elements = null;
  }

  /**
   * Initialize Stripe
   */
  async initialize() {
    if (!window.Stripe) {
      throw new Error('Stripe.js not loaded');
    }
    this.stripe = Stripe(this.config.stripe.publishableKey);
    return this.stripe;
  }

  /**
   * Create a subscription checkout session
   */
  async createSubscriptionCheckout(priceId, customerId = null) {
    try {
      const response = await fetch('/api/create-subscription-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          priceId: priceId,
          customerId: customerId,
          successUrl: `${window.location.origin}/subscription-success`,
          cancelUrl: `${window.location.origin}/pricing`
        })
      });

      const session = await response.json();
      
      // Redirect to Stripe Checkout
      const result = await this.stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Subscription checkout error:', error);
      throw error;
    }
  }

  /**
   * Create one-time payment session
   */
  async createOneTimePayment(productId, amount, description) {
    try {
      const response = await fetch('/api/create-payment-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          productId: productId,
          amount: Math.round(amount * 100), // Convert to cents
          description: description,
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/shop`
        })
      });

      const session = await response.json();
      
      const result = await this.stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  }

  /**
   * Process tip payment
   */
  async processTip(writerId, amount, message = '') {
    try {
      const response = await fetch('/api/process-tip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          writerId: writerId,
          amount: Math.round(amount * 100),
          message: message
        })
      });

      const result = await response.json();
      
      if (result.requiresAction) {
        // Handle 3D Secure or other authentication
        const { error, paymentIntent } = await this.stripe.confirmCardPayment(
          result.clientSecret
        );

        if (error) {
          throw error;
        }
        return paymentIntent;
      }

      return result;
    } catch (error) {
      console.error('Tip processing error:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          subscriptionId: subscriptionId
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Subscription cancellation error:', error);
      throw error;
    }
  }

  /**
   * Update payment method
   */
  async updatePaymentMethod(subscriptionId, paymentMethodId) {
    try {
      const response = await fetch('/api/update-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          subscriptionId: subscriptionId,
          paymentMethodId: paymentMethodId
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Payment method update error:', error);
      throw error;
    }
  }

  /**
   * Get subscription status
   */
  async getSubscriptionStatus() {
    try {
      const response = await fetch('/api/subscription-status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      throw error;
    }
  }

  /**
   * Get earnings dashboard data (for writers)
   */
  async getEarnings(startDate, endDate) {
    try {
      const response = await fetch(
        `/api/earnings?start=${startDate}&end=${endDate}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.getAuthToken()}`
          }
        }
      );

      return await response.json();
    } catch (error) {
      console.error('Error fetching earnings:', error);
      throw error;
    }
  }

  /**
   * Request payout
   */
  async requestPayout(amount) {
    try {
      const response = await fetch('/api/request-payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100)
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Payout request error:', error);
      throw error;
    }
  }

  /**
   * Helper: Get auth token from localStorage
   */
  getAuthToken() {
    return localStorage.getItem('authToken') || '';
  }
}

// Initialize on page load
let stripeHandler = null;

if (typeof MONETIZATION_CONFIG !== 'undefined') {
  stripeHandler = new StripePaymentHandler(MONETIZATION_CONFIG);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = StripePaymentHandler;
}
