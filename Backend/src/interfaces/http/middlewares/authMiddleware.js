import { createClerkClient } from '@clerk/clerk-sdk-node';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the session token
    const { sub: userId } = await clerkClient.verifyToken(token);
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Attach user ID to the request
    req.auth = { userId };
    
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ error: 'Unauthorized: Authentication failed' });
  }
};
