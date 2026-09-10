// ============================================================================
// PHOTOS
// ============================================================================
// This site is built around exactly 15 real photos of Archuu — pulled from
// the Google Drive folder and dropped into public/images/ as photo-01.jpg
// through photo-15.jpg. That's a fixed set on purpose: no extra fake/empty
// slots, and nothing in the app ever looks for a photo-16 or beyond.
//
// Want to swap one out? Just replace the file in public/images/ (keep the
// same filename) and/or edit its caption below — everything else keeps
// working.
//
// The site never crashes on a missing file: if a photo is ever removed, that
// spot quietly shows a soft placeholder instead of breaking the layout.
// ============================================================================

export const photos = [
  {
    src: '/images/photo-01.jpg',
    caption: 'You, mid-glance at your own reflection — completely unaware of how much I noticed.',
  },
  {
    src: '/images/photo-02.jpg',
    caption: 'That quiet window-seat kind of day. Some of my favorite memories of you are the calm ones.',
  },
  {
    src: '/images/photo-03.jpg',
    caption: 'Cake, a headband, and that exact smile you do when you know you look cute.',
  },
  {
    src: '/images/photo-04.jpg',
    caption: 'You and the little one — proof that your softest side isn’t only reserved for me.',
  },
  {
    src: '/images/photo-05.jpg',
    caption: 'The version of you that looks like she stepped out of a film. Twenty suits you.',
  },
  {
    src: '/images/photo-06.jpg',
    caption: '"Buke fever," you called it. I just call it one of my favorite photos of you.',
  },
  {
    src: '/images/photo-07.jpg',
    caption: 'That face you make right before you take the first bite. Never gets old.',
  },
  {
    src: '/images/photo-08.jpg',
    caption: 'A café, a cupcake, and you completely in your own world for a second.',
  },
  {
    src: '/images/photo-09.jpg',
    caption: 'All dressed up under those lights — one of those nights you probably didn’t realize how good you looked.',
  },
  {
    src: '/images/photo-10.jpg',
    caption: 'That night under the string lights and the bamboo — you in your element.',
  },
  {
    src: '/images/photo-11.jpg',
    caption: 'Same night, different mirror. I don’t think you’ve ever taken a bad photo in that outfit.',
  },
  {
    src: '/images/photo-12.jpg',
    caption: 'Little Archuu. I can’t get over how much of "you" was already there back then.',
  },
  {
    src: '/images/photo-13.jpg',
    caption: 'Ahmedabad city, apparently. Just you, being effortlessly you on camera.',
  },
  {
    src: '/images/photo-14.jpg',
    caption: 'This one’s just unfair, honestly. You know exactly what you’re doing here.',
  },
  {
    src: '/images/photo-15.jpg',
    caption: '"Ye me hu" — yeah, it is. Small Archuu, already stealing scenes.',
  },
]

// The single photo used at the very end of the site. Reuses one of the 15
// real photos above (no separate file needed) — pick whichever number feels
// like the strongest "this is her" shot by changing the index below.
export const finalPhoto = photos[13]
