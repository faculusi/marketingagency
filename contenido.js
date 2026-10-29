/*
  CONTENIDO DE LA LANDING — este es el único archivo que hace falta tocar
  para cambiar textos o anuncios.

  Cómo editar (desde GitHub): lápiz ✏️ → cambiar el texto → "Commit changes".

  Reglas para no romper nada:
  - Cambiá solo lo que está ENTRE comillas '...'.
  - Respetá las comillas, las comas del final de cada línea y las llaves { }.
  - Si un texto lleva apóstrofo, escribilo así: \'
  - Si algo queda mal escrito, la página igual funciona con los textos de
    siempre (el botón y el seguimiento de Meta no dependen de este archivo).

  Anuncios (lo que va arriba de todo, según el link del anuncio ?v=...):
  - El nombre de cada anuncio (zeus, bufon, ...) va en minúsculas y sin
    espacios. Es lo que se pone en el link: ...vercel.app/?v=zeus
  - tipo: 'imagen' (foto con título abajo), 'arte' (la imagen ya trae su
    propio título: solo se muestra el subtítulo) o 'video'.
  - ancho / alto: medidas de la imagen en píxeles. Son opcionales: si no
    se ponen, se usa 780 × 660 y la imagen se recorta un poco.
  - Para agregar un anuncio: subí la imagen (y el video, si hay) a la
    carpeta creativos/ y copiá una línea de abajo cambiándole los datos.
  - Si el link no trae ?v= o trae uno que no existe, se muestra el
    anuncio de anuncioPorDefecto.
*/
window.CONTENIDO = {
  bono: '+40%',
  bonoTexto: 'Bono de bienvenida',
  bonoDetalle: 'en tu primera carga',
  boton: 'Quiero mi usuario',
  atencion: 'Te atiende una persona real · las 24 hs',
  pasosTitulo: 'Cómo funciona',
  pasos: [
    { titulo: 'Tocá el botón', texto: 'Se abre WhatsApp con el mensaje listo.' },
    { titulo: 'Te creamos el usuario', texto: 'Una persona te atiende en el momento.' },
    { titulo: 'Cargás y recibís el +40%', texto: 'Billetera virtual o transferencia.' }
  ],
  beneficios: ['Activos 24 hs', 'Carga rápida', 'Retiros por WhatsApp'],
  legal: 'Solo mayores de 18 · Jugá con responsabilidad',
  condiciones: 'Bono del 40% en tu primera carga, sin tope de monto.',
  mensajeWhatsapp: 'Hola! Quiero mi usuario con el 40% de bienvenida.',

  anuncioPorDefecto: 'zeus',
  anuncios: {
    zeus:       { tipo: 'imagen', imagen: 'creativos/zeus.webp',       ancho: 780, alto: 579, titulo: 'Recibí tu gran bono',          subtitulo: 'Arrancá hoy' },
    bufon:      { tipo: 'imagen', imagen: 'creativos/bufon.webp',      ancho: 780, alto: 680, titulo: 'Confianza asegurada',          subtitulo: 'Te atiende una persona real' },
    toros:      { tipo: 'imagen', imagen: 'creativos/toros.webp',      ancho: 780, alto: 533, titulo: 'No te quedes afuera',          subtitulo: 'Activos las 24 hs' },
    mansion:    { tipo: 'arte',   imagen: 'creativos/mansion.webp',    ancho: 780, alto: 613, titulo: 'Entrá a la mansión encantada', subtitulo: 'Pedí tu usuario con tu beneficio' },
    princesa:   { tipo: 'arte',   imagen: 'creativos/princesa.webp',   ancho: 780, alto: 731, titulo: 'Desbloqueá tu suerte',         subtitulo: 'Te atiende una persona real' },
    perro:      { tipo: 'video',  imagen: 'creativos/perro.webp',      video: 'creativos/perro.mp4',      ancho: 780, alto: 660, titulo: 'Cargá desde el celu',          subtitulo: 'Activos las 24 hs' },
    panda:      { tipo: 'video',  imagen: 'creativos/panda.webp',      video: 'creativos/panda.mp4',      ancho: 780, alto: 660, titulo: 'Relajate, nosotros cargamos',  subtitulo: 'Te atiende una persona real' },
    perroverde: { tipo: 'video',  imagen: 'creativos/perroverde.webp', video: 'creativos/perroverde.mp4', ancho: 780, alto: 660, titulo: 'Cargá desde el celu',          subtitulo: 'Activos las 24 hs' }
  }
};
