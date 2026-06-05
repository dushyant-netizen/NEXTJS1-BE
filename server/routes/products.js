const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductById,
} = require("../controllers/products");

// Import your new recommendations controller
const { getRecommendations } = require("../controllers/recommendations");

router.route("/").get(getAllProducts).post(createProduct);

// Place specific routes BEFORE dynamic routes like /:id
// Route: /api/products/:productId/recommendations
router.get("/:productId/recommendations", getRecommendations);

router
  .route("/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;