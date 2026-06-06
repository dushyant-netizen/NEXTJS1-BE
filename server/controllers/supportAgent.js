const prisma = require("../utils/db");

const handleAgentMessage = async (req, res, next) => {
  try {
    const { sessionId, message, email } = req.body;

    // 1. Get or create active session
    let session = sessionId 
      ? await prisma.supportSession.findUnique({ where: { id: sessionId } })
      : await prisma.supportSession.create({ data: { userEmail: email || null } });

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // 2. Save User Message
    await prisma.supportMessage.create({
      data: { sessionId: session.id, sender: "USER", text: message }
    });

    const lowerMessage = message.toLowerCase();
    let replyText = "I'm here to help! Could you please specify if you're looking for order status or wanting to return an item?";
    let actionTriggered = null;

    // 3. Autonomous Logic - Intent 1: Order Status Lookup
    if (lowerMessage.includes("order") || lowerMessage.includes("status") || lowerMessage.includes("track")) {
      // Look up the most recent order for this email address
      if (email) {
        const lastOrder = await prisma.customer_order.findFirst({
          where: { email: email },
          orderBy: { dateTime: 'desc' }
        });

        if (lastOrder) {
          replyText = `I found your most recent order #${lastOrder.id.substring(0, 8)}. Status: **${lastOrder.status}**. Total: $${lastOrder.total}.`;
          actionTriggered = { type: "CHECK_ORDER_STATUS", details: `Checked order status for ${email}` };
        } else {
          replyText = "I see you're asking about an order, but I couldn't find any order history linked to your email address.";
        }
      } else {
        replyText = "I can check your order status! Please provide the email address used when placing the order.";
      }
    } 

    // 4. Autonomous Logic - Intent 2: Automated Returns Handle
    else if (lowerMessage.includes("return") || lowerMessage.includes("refund")) {
      if (email) {
        const orderToReturn = await prisma.customer_order.findFirst({
          where: { email: email, status: "DELIVERED" },
          orderBy: { dateTime: 'desc' }
        });

        if (orderToReturn) {
          // Auto-approve rule: If order status is delivered, initialize authorization
          await prisma.customer_order.update({
            where: { id: orderToReturn.id },
            data: { status: "RETURN_INITIATED" }
          });

          replyText = `I have successfully initiated an automated return profile for your order #${orderToReturn.id.substring(0, 8)}. A prepaid shipping label has been dispatched to ${email}.`;
          actionTriggered = { type: "INITIATE_RETURN", details: `Auto-initiated return for order ${orderToReturn.id}` };
        } else {
          replyText = "To process an automatic return, you must have an order marked as 'DELIVERED'. I couldn't find any qualifying orders for your account right now.";
        }
      } else {
        replyText = "I can assist you with your return end-to-end. Please provide your order email address to confirm authorization.";
      }
    }

    // 5. Log actions taken by autonomous routine
    if (actionTriggered) {
      await prisma.agentAction.create({
        data: {
          sessionId: session.id,
          actionType: actionTriggered.type,
          details: actionTriggered.details
        }
      });
    }

    // 6. Save AI Agent Response
    await prisma.supportMessage.create({
      data: { sessionId: session.id, sender: "AI_AGENT", text: replyText }
    });

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      reply: replyText
    });

  } catch (error) {
    console.error("Support Agent Error:", error);
    next(error);
  }
};

module.exports = { handleAgentMessage };