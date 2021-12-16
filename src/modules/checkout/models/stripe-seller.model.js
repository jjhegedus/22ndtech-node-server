"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var stripeSellerSchema = new Schema({
    access_token: { type: String, required: true },
    livemode: { type: Boolean, required: true },
    refresh_token: { type: String, required: true },
    token_type: { type: String, required: true },
    stripe_publishable_key: { type: String, required: true },
    stripe_user_id: { type: String, required: true },
    scope: { type: String, required: true }
});
stripeSellerSchema.set('timestamps', true); // include timestamps in docs
exports.StripeSellerModel = mongoose.model('StripeSeller', stripeSellerSchema);
//# sourceMappingURL=stripe-seller.model.js.map