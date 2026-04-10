/**
 * The Page Gallery - Monetization Configuration
 * Complete monetization system with Stripe integration
 */

const MONETIZATION_CONFIG = {
  // Stripe Configuration
  stripe: {
    publishableKey: 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY', // Replace with your actual key
    apiVersion: '2023-10-16'
  },

  // Subscription Tiers
  subscriptionTiers: {
    free: {
      id: 'free',
      name: 'Reader',
      price: 0,
      interval: null,
      stripePriceId: null,
      features: [
        'Read published works',
        'Basic profile',
        'Comment on published pieces',
        'Follow favorite writers',
        'Save bookmarks (up to 10)'
      ],
      limits: {
        submissions: 0,
        bookmarks: 10,
        followedWriters: 50
      }
    },
    writer: {
      id: 'writer',
      name: 'Writer',
      price: 9.99,
      interval: 'month',
      stripePriceId: 'price_WRITER_MONTHLY', // Replace with actual Stripe price ID
      features: [
        'Submit up to 5 pieces per month',
        'Writer profile page',
        'Email notifications on submission status',
        'Access to submission guidelines',
        'Priority email support',
        'Unlimited bookmarks',
        'Analytics on reader engagement'
      ],
      limits: {
        submissions: 5,
        bookmarks: -1, // unlimited
        followedWriters: -1
      }
    },
    premium: {
      id: 'premium',
      name: 'Premium Writer',
      price: 19.99,
      interval: 'month',
      stripePriceId: 'price_PREMIUM_MONTHLY',
      features: [
        'Unlimited submissions',
        'Featured writer badge',
        'Priority review queue',
        'Detailed analytics dashboard',
        'Early access to new features',
        'Personalized feedback on rejections',
        'Portfolio export tools',
        'Premium writer community access',
        'Revenue share from reader tips'
      ],
      limits: {
        submissions: -1,
        bookmarks: -1,
        followedWriters: -1
      },
      revenueShare: 0.7 // 70% to writer, 30% to platform
    },
    annual: {
      id: 'annual',
      name: 'Annual Premium',
      price: 199.99,
      interval: 'year',
      stripePriceId: 'price_ANNUAL',
      discount: 16.67, // ~2 months free
      features: [
        'All Premium Writer features',
        'Save 2 months compared to monthly',
        'Exclusive annual member events',
        'Special contributor status'
      ],
      limits: {
        submissions: -1,
        bookmarks: -1,
        followedWriters: -1
      },
      revenueShare: 0.7
    }
  },

  // One-time purchases
  oneTimePurchases: {
    singleSubmission: {
      id: 'single_submission',
      name: 'Single Submission Credit',
      price: 4.99,
      stripePriceId: 'price_SINGLE_SUBMISSION',
      description: 'Submit one piece without a subscription',
      credits: 1
    },
    submissionPack: {
      id: 'submission_pack',
      name: '5 Submission Pack',
      price: 19.99,
      stripePriceId: 'price_SUBMISSION_PACK',
      description: 'Five submission credits (save 20%)',
      credits: 5
    },
    featuredPlacement: {
      id: 'featured_placement',
      name: 'Featured Placement',
      price: 49.99,
      stripePriceId: 'price_FEATURED_PLACEMENT',
      description: 'Feature your published work on homepage for 7 days',
      duration: 7 // days
    }
  },

  // Reader tipping system
  tipping: {
    enabled: true,
    suggestedAmounts: [2, 5, 10, 20],
    customAmountMin: 1,
    customAmountMax: 500,
    platformFee: 0.15, // 15% platform fee
    stripeFee: 0.029, // 2.9% + $0.30 per transaction
    stripeFeeFixed: 0.30
  },

  // Revenue sharing for premium members
  revenueSharing: {
    enabled: true,
    minimumPayout: 25, // Minimum balance to withdraw
    payoutSchedule: 'monthly', // monthly, weekly, or instant
    writerShare: 0.7, // 70% for premium writers
    platformShare: 0.3 // 30% for platform
  },

  // Advertising (optional revenue stream)
  advertising: {
    enabled: false, // Set to true to enable
    adFreeSubscribers: true, // Hide ads for paid subscribers
    adProviders: ['google-adsense'],
    revenueShare: 0.5 // 50% to writers whose pages show ads
  },

  // Submission fees (alternative model)
  submissionFees: {
    enabled: false, // Currently using subscription model
    standardFee: 3.00,
    priorityFee: 10.00
  }

    // Founding Member program (one-time investment/pledge)
  foundingMembers: {
    enabled: true,
    tiers: {
      seed: {
        id: 'seed',
        name: 'Seed',
        minPledge: 25,
        description: 'Help plant the first seeds of The Page Gallery',
        perks: [
          'Founders\' garden listing',
          'Launch updates newsletter',
          '1 month free Premium Writer subscription'
        ]
      },
      sprout: {
        id: 'sprout',
        name: 'Sprout',
        minPledge: 75,
        description: 'Nurture our platform as it grows',
        perks: [
          'All Seed perks',
          '3 months free Premium Writer subscription',
          '5 submission credits',
          'Featured in Sprout supporters section'
        ]
      },
      bloom: {
        id: 'bloom',
        name: 'Bloom',
        minPledge: 150,
        description: 'Watch The Page Gallery blossom with lifetime access',
        perks: [
          'All Sprout perks',
          '6 months free Premium Writer subscription',
          'Beta access to new features',
          'Founding member badge',
          'Priority support'
        ]
      },
      patron: {
        id: 'patron',
        name: 'Patron',
        minPledge: 500,
        description: 'Become a cornerstone patron with lifetime premium',
        perks: [
          'All Bloom perks',
          'Lifetime Premium Writer subscription',
          'Quarterly virtual roundtable with founder',
          'Input on editorial features roadmap',
          'Patron\'s Circle listing with custom bio'
        ]
      }
    },
    paymentProcessing: 'deferred', // Collect pledges first, process later
    displayFoundersGarden: true // Public page showing founding members
  },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MONETIZATION_CONFIG;
}
