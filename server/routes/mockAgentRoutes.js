import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({
      message: "Input is required",
    });
  }

  await new Promise((resolve) =>
    setTimeout(resolve, 800)
  );

  return res.status(200).json({
    response: `Mock AI response for: ${input}`,
  });
});

export default router;