const { getSimilarProducts } = require('../services/recommendationService');

router.get('/:id/recommendations', async (req, res) => {
  try {
    const products = await getSimilarProducts(req.params.id);
    res.json(products);
  } catch (error) {
    next(error); // Uses your global error handler
  }
});