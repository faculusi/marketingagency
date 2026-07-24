import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;

    if (!pixelId || !accessToken) {
      return NextResponse.json({ error: 'Faltan credenciales' }, { status: 500 });
    }

    // Datos del evento enviados desde el navegador
    const { eventName, sourceUrl, clientIp, userAgent } = body;

    const eventData = {
      data: [
        {
          event_name: eventName || 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: sourceUrl || 'https://tu-landing.vercel.app',
          user_data: {
            client_ip_address: clientIp || null,
            client_user_agent: userAgent || null,
          },
        },
      ],
    };

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      }
    );

    const result = await response.json();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
