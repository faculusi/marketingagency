// api/meta-conversion.js (Para proyectos de HTML estático en Vercel)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { eventName, eventSourceUrl } = req.body || {};

    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;

    if (!pixelId || !accessToken) {
      return res.status(500).json({ error: 'Variables de entorno no configuradas en Vercel' });
    }

    // Marca de tiempo en segundos
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Obtener IP y User-Agent del cliente desde las cabeceras de Vercel
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    const payload = {
      data: [
        {
          event_name: eventName || 'Lead',
          event_time: currentTimestamp,
          action_source: 'website',
          event_source_url: eventSourceUrl,
          user_data: {
            client_ip_address: clientIp,
            client_user_agent: userAgent,
          },
        },
      ],
    };

    // Envío del evento a Meta
    const fbResponse = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await fbResponse.json();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Error interno en la API' });
  }
}
