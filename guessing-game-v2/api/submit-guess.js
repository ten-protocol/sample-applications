const axios = require('axios');

module.exports = async (req, res) => {
    const allowedOrigin = process.env.CORS_ORIGIN;
    const GGC_JWT = process.env.GGC_JWT;
    const GGC_API = process.env.GGC_API;

    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
  
    const data = req.body;
  
    try {
        const response = await axios.post(
          GGC_API,
          { data },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${GGC_JWT}`,
            },
          }
        );
    
        console.log('Success', response.data);
        res.status(200).json({ message: 'Data received successfully' });
      } catch (error) {
        console.error('Error sending encrypted data to backend:', error);
        res.status(200).json({ message: 'Fail' });
      }
  };
  