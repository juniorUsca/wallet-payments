const express = require("express");
const passport = require("passport");
const PaymentService = require("../../services/payments");
const validation = require("../../utils/middlewares/validationHandler");

const {
  paymentIdSchema,
  paymentTagSchema,
  createPaymentSchema,
  updatePaymentSchema
} = require("../../schemas/payments");

// JWT strategy
require("../../utils/auth/strategies/jwt");

const cacheResponse = require("../../utils/cacheResponse");
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require(
  "../../utils/time"
);

function paymentsApi(app) {
  const router = express.Router();
  app.use("/api/payments", router);

  const paymentService = new PaymentService();

  router.get("/", async function(req, res, next) {
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
    const { tags } = req.query;

    try {
      const data = await paymentService.getPayments({ tags });

      res.status(200).json({
        data: data,
        message: "payments listed"
      });
    } catch (err) {
      next(err);
    }
  });

  router.get("/:paymentId", async function(req, res, next) {
    cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
    const { paymentId } = req.params;

    try {
      const data = await paymentService.getPayment({ paymentId });

      res.status(200).json({
        data: data,
        message: "payment retrieved"
      });
    } catch (err) {
      next(err);
    }
  });

  router.post("/", validation(createPaymentSchema), async function(
    req,
    res,
    next
  ) {
    const { body: payment } = req;

    try {
      const data = await paymentService.createPayment({ payment });

      res.status(201).json({
        data: data,
        message: "payment created"
      });
    } catch (err) {
      next(err);
    }
  });

  router.put(
    "/:paymentId",
    passport.authenticate("jwt", { session: false }),
    validation({ paymentId: paymentIdSchema }, "params"),
    validation(updatePaymentSchema),
    async function(req, res, next) {
      const { paymentId } = req.params;
      const { body: payment } = req;

      try {
        const data = await paymentService.updatePayment({
          paymentId,
          payment
        });
        res.status(200).json({
          data: data,
          message: "payment updated"
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    "/:paymentId",
    passport.authenticate("jwt", { session: false }),
    async function(req, res, next) {
      const { paymentId } = req.params;

      try {
        const data = await paymentService.deletePayment({
          paymentId
        });

        res.status(200).json({
          data: data,
          message: "payment deleted"
        });
      } catch (err) {
        next(err);
      }
    }
  );
}

module.exports = paymentsApi;
