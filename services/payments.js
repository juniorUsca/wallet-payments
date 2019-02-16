// const productsMocks = require("../utils/mocks/products");
const MongoLib = require("../lib/mongo");

class PaymentService {
  constructor() {
    this.collection = "payments";
    this.mongoDB = new MongoLib();
  }

  async getPayments({ tags }) {
    const query = tags && { tags: { $in: tags } };
    const payments = await this.mongoDB.getAll(this.collection, query);

    return payments || [];
  }

  async getPayment({ paymentId }) {
    const payment = await this.mongoDB.get(this.collection, paymentId);
    return payment || {};
  }

  async createPayment({ payment }) {
    const createPaymentId = await this.mongoDB.create(this.collection, payment);

    return createPaymentId;
  }

  async updatePayment({ paymentId, payment }) {
    const updatePaymentId = await this.mongoDB.update(
      this.collection,
      paymentId,
      payment
    );

    return updatePaymentId;
  }

  async deletePayment({ paymentId }) {
    const deletedPaymentId = await this.mongoDB.delete(
      this.collection,
      paymentId
    );

    return deletedPaymentId;
  }
}

module.exports = PaymentService;
