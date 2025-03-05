import { Router } from "@bolt/api";

export default Router.post("/api/create-shift", async (req, res) => {
  try {
    const shiftData = req.body;
    
    // Log the received data
    console.log("Creating shift with data:", shiftData);

    // Here we would normally save to a database
    // For now, we'll just simulate a successful creation
    
    // Add an artificial delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return success response
    res.json({
      success: true,
      message: "Shift created successfully",
      data: {
        id: `shift-${Date.now()}`,
        ...shiftData,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Error in create-shift endpoint:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create shift",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
});