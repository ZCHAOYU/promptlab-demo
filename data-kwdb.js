// PromptLab — 关键词数据库 KW_DB（从 app.js 拆出，纯数据）
const KW_DB = {
  style: {
    name: '风格',
    categories: {
      '东方奇幻': {
        core: 'eastern fantasy style, xianxia aesthetic',
        detail: 'ancient chinese fantasy, cultivation world, flowing silk robes, jade and gold ornaments, mist-shrouded mountains, traditional pagoda architecture, floating islands, spiritual energy particles',
        mood: 'mystical, serene yet powerful, spiritual transcendence, ancient wisdom',
        color: 'muted jade green, warm gold, vermillion red accents, misty white, ink black, celadon blue',
        tech: 'sharp focus on subject, soft ethereal background, volumetric fog, cinematic color grading, anamorphic lens flare',
        ref: 'inspired by Zhang Yimou wuxia cinematography, chinese ink painting aesthetics',
        negative: 'western architecture, modern elements, neon lights, cyberpunk, sci-fi, urban, contemporary clothing'
      },
      '赛博朋克': {
        core: 'cyberpunk style, neon-noir aesthetic',
        detail: 'dystopian megacity, holographic advertisements, rain-slicked streets, chrome implants, LED displays, towering skyscrapers, flying vehicles, crowded narrow alleys, augmented reality overlays',
        mood: 'gritty, rebellious, melancholic, high-tech alienation, underground resistance',
        color: 'neon cyan, magenta, electric purple, acid yellow, deep black, chrome silver, burnt orange pollution haze',
        tech: 'high contrast, bloom effects, lens flare, chromatic aberration, volumetric neon, wet surface reflections',
        ref: 'inspired by Blade Runner 2049, Ghost in the Shell, Akira',
        negative: 'natural landscape, ancient architecture, medieval, fantasy, rural, daylight, warm cozy'
      },
      '写实摄影': {
        core: 'photorealistic photography, hyper-realistic',
        detail: 'lifelike textures, natural skin pores, fabric weave visible, subtle imperfections, realistic environmental lighting, true-to-life proportions',
        mood: 'authentic, grounded, documentary, observational',
        color: 'natural color balance, true-to-life saturation, calibrated white balance',
        tech: '35mm full-frame sensor, 85mm f/1.4 portrait lens, shallow depth of field, natural bokeh, minimal post-processing',
        ref: 'inspired by National Geographic photography, Annie Leibovitz portraits',
        negative: 'cartoon, anime, illustration, painting, CGI, 3D render, stylized, exaggerated'
      },
      '概念艺术': {
        core: 'concept art, keyframe design, visual development',
        detail: 'dynamic composition, bold brushstrokes, atmospheric perspective, silhouette-driven design, production-ready concept, mood exploration',
        mood: 'epic, cinematic, imaginative, world-building',
        color: 'atmospheric color keys, limited palette, strong value contrast, ambient occlusion',
        tech: 'digital painting, photobashing, texture overlay, custom brushwork, speed painting energy',
        ref: 'inspired by Feng Zhu design, Blizzard concept art, Sparth sci-fi landscapes',
        negative: 'photorealistic, overly clean, sterile, minimal detail, flat lighting'
      },
      '水墨国风': {
        core: 'traditional chinese ink wash painting, sumi-e style',
        detail: 'ink bleed effects, dry brush texture, rice paper grain, spontaneous brushwork, negative space composition, seal stamp, calligraphy elements',
        mood: 'contemplative, zen, poetic, harmonious, wabi-sabi',
        color: 'monochrome ink black, subtle grey wash, vermillion seal red, aged paper cream, pale celadon',
        tech: 'ink diffusion simulation, paper texture overlay, brush stroke pressure variation, splatter effects',
        ref: 'inspired by Qi Baishi, Xu Beihong, traditional guohua masters',
        negative: 'photorealistic, 3D, digital, neon, western painting, oil, thick impasto'
      },
      '二次元': {
        core: 'anime style, manga illustration, cel-shaded',
        detail: 'clean lineart, flat color fills, cel shading with 2-tone shadows, expressive eyes, hair highlights, speed lines, chibi proportions, sparkle effects',
        mood: 'vibrant, emotional, youthful, energetic, whimsical',
        color: 'bright saturated primaries, pastel accents, warm skin tones, dramatic shadow colors, rim light highlights',
        tech: 'vector-style clean edges, halftone dots, screen tones, chromatic aberration for impact frames',
        ref: 'inspired by Makoto Shinkai films, Ghibli backgrounds, Kyoto Animation character design',
        negative: 'photorealistic, 3D, oil painting, rough texture, dark gritty, realistic proportions'
      },
      '油画质感': {
        core: 'oil painting style, impasto texture',
        detail: 'thick brushstrokes, visible palette knife marks, canvas texture, layered glazes, rich pigment, chiaroscuro, old master techniques',
        mood: 'classical, timeless, dramatic, romantic, baroque',
        color: 'earth tones, ultramarine blue, burnt sienna, cadmium yellow, titanium white, deep umber, alizarin crimson',
        tech: 'impasto texture, crackle varnish, canvas weave, directional brushwork, sfumato blending',
        ref: 'inspired by Rembrandt, Caravaggio, John Singer Sargent',
        negative: 'digital, flat, vector, anime, CGI, pixel art, minimal, clean'
      },
      '3D渲染': {
        core: '3D render, CGI, high fidelity',
        detail: 'subsurface scattering, ray tracing, global illumination, physically based rendering, displacement maps, ambient occlusion, realistic material shaders',
        mood: 'premium, polished, technical, immersive',
        color: 'accurate PBR color space, HDR environment lighting, filmic tone mapping',
        tech: 'Octane render, Unreal Engine 5, Nanite geometry, Lumen lighting, 200mm lens, f/2.8, 1/1000s',
        ref: 'inspired by ILM, Weta Digital, Blizzard cinematics',
        negative: '2D, flat, hand-drawn, sketch, painting, low-poly, pixel art'
      },
      '哥特暗黑': {
        core: 'gothic dark fantasy, grimdark aesthetic',
        detail: 'crumbling cathedrals, wrought iron details, gargoyles, thorny vines, tattered robes, skull motifs, gothic arches, stained glass windows, candlelit crypts',
        mood: 'ominous, tragic, haunting, sublime terror, romantic decay',
        color: 'deep burgundy, midnight black, blood crimson, tarnished gold, storm grey, bone white, bruised purple',
        tech: 'low-key lighting, heavy shadows, film grain, desaturated tones, vignette, thunderstorm ambient',
        ref: 'inspired by Bloodborne, Castlevania, Dark Souls architecture, Brom artwork',
        negative: 'bright, cheerful, modern, neon, pastel, minimal, clean, cute'
      },
      '蒸汽朋克': {
        core: 'steampunk, victorian industrial retro-futurism',
        detail: 'brass gears, copper pipes, leather straps, rivets, steam vents, clockwork mechanisms, goggles, corsets, airships, victorian fashion, analog gauges',
        mood: 'adventurous, inventive, nostalgic, industrial romance',
        color: 'polished brass, aged copper, mahogany brown, burgundy leather, steam white, charcoal iron, sepia tone',
        tech: 'warm sepia lighting, gear bokeh, steam particle effects, metallic reflections, lens vignette',
        ref: 'inspired by Howl\'s Moving Castle, Bioshock Infinite, Jules Verne illustrations',
        negative: 'digital, neon, modern, plastic, minimalist, futuristic, cyber'
      },
      '水彩淡彩': {
        core: 'watercolor painting, soft gouache wash',
        detail: 'transparent washes, wet-on-wet blooms, granulation texture, soft edge bleeding, splatter drops, cold press paper texture, masking fluid highlights',
        mood: 'delicate, romantic, ethereal, gentle, dreamy',
        color: 'pastel pink, sky blue, lavender, sage green, soft peach, translucent washes, luminous white',
        tech: 'paper grain texture, water bloom edges, pigment granulation, soft diffusion, wash gradient',
        ref: 'inspired by Beatrix Potter, contemporary botanical watercolor',
        negative: 'dark, heavy, impasto, digital, sharp lines, saturated, 3D, metallic'
      },
      '极简留白': {
        core: 'minimalist, zen aesthetic, negative space mastery',
        detail: 'clean geometric forms, intentional emptiness, single focal point, precise alignment, subtle gradients, material textures',
        mood: 'calm, contemplative, sophisticated, meditative, pure',
        color: 'monochrome with single accent, off-white, warm grey, matte black, natural wood, concrete',
        tech: 'precise geometry, subtle shadow depth, smooth gradients, matte finish, architectural lighting',
        ref: 'inspired by Japanese zen gardens, Dieter Rams design, MUJI aesthetics',
        negative: 'cluttered, busy, ornate, baroque, colorful, chaotic, maximalist'
      },
      '像素艺术': {
        core: 'pixel art, 8-bit 16-bit retro game aesthetic',
        detail: 'visible pixel grid, limited color palette, dithering, sprite-based, isometric perspective, chunky pixels, scanlines',
        mood: 'nostalgic, playful, retro, game-like',
        color: 'restricted palette 16-64 colors, vibrant primaries, CRT phosphor glow, retro dithering patterns',
        tech: 'nearest-neighbor scaling, pixel-perfect, CRT scanline overlay, dithering patterns, sprite sheet aesthetic',
        ref: 'inspired by SNES RPGs, LucasArts adventure games, Hyper Light Drifter',
        negative: 'smooth, anti-aliased, photorealistic, 3D, gradients, blur, HDR'
      },
      '波普艺术': {
        core: 'pop art, bold graphic, comic book style',
        detail: 'Ben-Day dots, thick black outlines, halftone patterns, speech bubbles, collage elements, repeated imagery, bold flat colors',
        mood: 'energetic, ironic, playful, rebellious, loud',
        color: 'primary red, yellow, cyan, magenta, black, white, halftone dots',
        tech: 'halftone screen overlay, bold outlines, flat color blocks, comic panel layout, pop art grain',
        ref: 'inspired by Roy Lichtenstein, Andy Warhol, vintage comic books',
        negative: 'photorealistic, soft, subtle, muted, atmospheric, painterly, 3D'
      },
      '扁平矢量': {
        core: 'flat vector illustration, modern minimalist',
        detail: 'clean geometric shapes, no gradients, solid colors, thin consistent strokes, simplified forms, isometric design, icon-style',
        mood: 'friendly, modern, professional, accessible, clear',
        color: 'flat primaries, pastel palette, corporate blue, duotone, bold contrast',
        tech: 'vector clean, sharp edges, uniform stroke width, geometric precision, SVG aesthetic',
        ref: 'inspired by Google Material Design, Kurzgesagt, corporate illustration',
        negative: 'textured, painterly, 3D, photorealistic, gradient-heavy, messy, sketchy'
      },
      '印象派': {
        core: 'impressionist painting style, atmospheric',
        detail: 'visible loose brushstrokes, dappled light, broken color, optical mixing, en plein air feel, unblended pigments side by side',
        mood: 'nostalgic, luminous, fleeting, sensory, poetic',
        color: 'broken color technique, violet shadows, warm sunlight, cerulean sky, complementary contrasts',
        tech: 'visible brushwork, canvas texture, optical color mixing, dappled light patterns, atmospheric haze',
        ref: 'inspired by Monet, Renoir, Degas, Pissarro',
        negative: 'sharp, precise, photorealistic, digital, flat, vector, dark, heavy'
      },
      '浮世绘': {
        core: 'ukiyo-e japanese woodblock print flat color',
        detail: 'flowing lines, bold outlines, flat color blocks, decorative patterns, natural landscapes, kabuki actors, bijin portraits, seasonal motifs, stylized waves, cherry blossoms, mount fuji, traditional architecture, textile patterns, dramatic composition, negative space, handcrafted texture, ink wash gradients, nature reverence',
        mood: 'serene, nostalgic, elegant, poetic, melancholic, refined, dramatic, contemplative, graceful, tranquil',
        color: 'indigo blue, vermilion red, ochre yellow, pine green, sumi black, pale pink, muted teal, warm beige, burnt orange, deep violet',
        tech: 'flat shading, bold lineart, cel shading, woodblock texture, limited palette, decorative borders, calligraphic strokes, layered stencils, gradient skies, raster engraving',
        ref: 'inspired by Hokusai, Hiroshige, Utamaro, Kuniyoshi, Sharaku, Hasui Kawase, Yoshitoshi, Tsuchiya Koitsu, traditional mokuhanga',
        negative: 'photorealism, 3D rendering, western perspective, heavy shadows, gradients, soft blur, modern typography, neon colors, glossy surfaces'
      },
      '低多边形': {
        core: 'low poly geometric faceted 3D stylized minimal',
        detail: 'triangular facets, angular geometry, flat shaded surfaces, simplified forms, clean silhouettes, isometric perspective, stylized proportions, faceted terrain, minimal detail, polygonal trees, geometric mountains, angular water ripples, crystalline structures, blocky characters, grid aligned compositions, warm ambient lighting, matte textures',
        mood: 'playful, serene, nostalgic, cozy, dreamy, whimsical, peaceful, charming, futuristic, minimalist',
        color: 'pastel gradients, vibrant teal, warm orange, soft lavender, mint green, coral pink, sky blue, golden yellow, muted earth tones, clean white',
        tech: 'flat shading, ambient occlusion, low triangle count, baked lighting, gradient background, soft shadows, wireframe edges, matte materials, isometric camera, minimal anti-aliasing',
        ref: 'inspired by Timothy Reynolds, polygon art, Monument Valley, Lara Croft Go, Crossy Road, low poly game art, 3D voxel art, minimalist game design',
        negative: 'photorealism, smooth surfaces, high poly count, complex textures, realistic anatomy, detailed faces, heavy shadows, PBR materials, motion blur, lens flare'
      },
      '超现实主义': {
        core: 'surrealism dreamlike impossible juxtaposition subconscious bizarre',
        detail: 'melting objects, floating islands, distorted proportions, impossible architecture, dreamlike landscapes, metamorphic creatures, levitating elements, paradoxical spaces, symbolic imagery, biological fusion, clock melting, endless staircases, cloud formations, mirror reflections, eye motifs, organic mechanical hybrids, subconscious imagery, scale manipulation',
        mood: 'dreamlike, uncanny, mysterious, unsettling, introspective, hallucinatory, poetic, metaphysical, absurd, haunting',
        color: 'deep blue, crimson red, golden yellow, stark white, shadow black, muted sepia, twilight purple, faded teal, desert orange, storm gray',
        tech: 'photorealistic rendering, photobashing, double exposure, scale distortion, seamless compositing, atmospheric perspective, soft chiaroscuro, long shadows, texture blending, surreal juxtaposition',
        ref: 'inspired by Salvador Dali, Rene Magritte, Max Ernst, Giorgio de Chirico, Yves Tanguy, Zdzislaw Beksinski, Jacek Yerka, Rob Gonsalves',
        negative: 'ordinary realism, mundane scenes, logical composition, everyday objects, normal proportions, predictable layouts, standard lighting, conventional perspective'
      },
      '故障艺术': {
        core: 'glitch art digital distortion corrupted data chromatic',
        detail: 'chromatic aberration, pixel sorting, digital noise, scan lines, screen tearing, corrupted data, RGB shift, signal interference, data moshing, broken pixels, VHS artifacts, vertical stripes, fragmented composition, circuit bent, analog distortion, compression artifacts, bit crushed, psychedelic fragmentation',
        mood: 'dystopian, chaotic, cybernetic, rebellious, hypnotic, disorienting, futuristic, edgy, experimental, aggressive',
        color: 'cyan red split, toxic green, magenta fuchsia, electric blue, neon purple, acid yellow, static white, void black, phosphor orange, digital gray',
        tech: 'chromatic displacement, pixel sorting, data bending, channel separation, displacement maps, noise generation, scanline overlay, VHS emulation, waveform distortion, signal degradation',
        ref: 'inspired by Rosa Menkman, Sabato Visconti, datamoshing, circuit bending, VHS culture, vaporwave aesthetics, cyberpunk media, generative error art',
        negative: 'clean lines, perfect symmetry, smooth gradients, natural colors, realistic rendering, balanced composition, soft lighting, polished surfaces, organic textures'
      },
      '复古胶片': {
        core: 'vintage film photography analog grain nostalgic warmth',
        detail: 'film grain, light leaks, warm color cast, soft focus, vignette edges, dust specks, retro color palette, overexposed highlights, faded shadows, lens flare artifacts, analog texture, cross processed, sun kissed glow, expired film look, silver halide crystals, chemical stains, darkroom imperfections, nostalgic atmosphere',
        mood: 'nostalgic, romantic, melancholic, intimate, timeless, wistful, sentimental, dreamy, warm, cinematic',
        color: 'warm amber, faded yellow, dusty rose, olive green, sepia brown, cream white, muted teal, rust orange, faded denim, soft gold',
        tech: 'film grain overlay, color grading LUT, vignette effect, light leak simulation, dust texture mapping, soft focus filter, halation bloom, contrast curve fade, split toning, analog chromatic shift',
        ref: 'inspired by Kodak Portra, Fuji Superia, Cinestill 800T, Lomography, William Eggleston, Saul Leiter, Vivian Maier, Henri Cartier-Bresson, expired film aesthetics',
        negative: 'digital sharpness, clean edges, perfect exposure, pure white, deep black, HDR rendering, CGI smoothness, neon colors, ultra HD, clinical precision'
      },
      '剪纸艺术': {
        core: 'paper cut art layered silhouette craft tactile',
        detail: 'layered paper, cutout silhouette, overlapping shapes, depth through layers, tactile texture, craft aesthetic, intricate cutwork, shadow box depth, paper fiber texture, folded edges, delicate patterns, flat geometric shapes, negative space cutouts, paper shadow, stacked composition, handmade feel, symmetrical designs, folk art motifs',
        mood: 'whimsical, artisanal, delicate, nostalgic, charming, playful, handcrafted, poetic, elegant, magical',
        color: 'cream white, kraft brown, pastel pink, mustard yellow, forest green, sky blue, coral orange, burgundy red, charcoal gray, soft lavender',
        tech: 'layered depth, drop shadow, paper texture overlay, flat fill, cardboard material, multi-plane composition, vector cutout, bevel edge, crease line, fiber texture map',
        ref: 'inspired by Hari and Deepti, Elsa Mora, Yulia Brodskaya, papercut illustration, shadow box art, Chinese paper cutting, scherenschnitte, Eric Carle, Su Blackwell',
        negative: 'photorealism, smooth gradients, translucent effects, liquid textures, 3D rendering, metallic surfaces, glass reflections, digital glow, soft blur, realistic shadows'
      },
      '新艺术运动': {
        core: 'art nouveau organic flowing curves decorative elegance',
        detail: 'whiplash curves, flowing lines, organic plant forms, floral motifs, decorative borders, elegant women, stained glass, peacock feathers, vine tendrils, lily pads, dragonfly wings, ornamental typography, arched windows, geometric floral patterns, sinuous hair, elaborate frames, nature inspired, golden accents',
        mood: 'elegant, sensual, romantic, ethereal, mystical, graceful, ornate, dreamy, luxurious, organic',
        color: 'gold leaf, olive green, dusty rose, peacock blue, ivory cream, burnt orange, amethyst purple, sage green, warm amber, deep burgundy',
        tech: 'vector line art, gradient fills, ornamental borders, stained glass effect, gold foil texture, delicate linework, typographic integration, decorative frames, soft shading, sinuous curves',
        ref: 'inspired by Alphonse Mucha, Gustav Klimt, Aubrey Beardsley, Hector Guimard, Louis Comfort Tiffany, Antoni Gaudi, Charles Rennie Mackintosh, Eugene Grasset',
        negative: 'minimalism, straight lines, cold colors, modern sans-serif, geometric rigidity, brutalist forms, digital aesthetic, minimalist composition, dark themes, industrial materials'
      },
      '装饰艺术': {
        core: 'art deco geometric symmetry luxury glamour bold',
        detail: 'geometric patterns, symmetrical composition, stepped forms, sunburst motifs, metallic accents, sleek lines, bold typography, chevron patterns, fan shapes, polished surfaces, luxurious materials, streamlined silhouettes, towering skyscrapers, fountain motifs, ziggurat steps, inlaid patterns, speed lines, angular elegance',
        mood: 'glamorous, luxurious, sophisticated, powerful, confident, opulent, futuristic, bold, refined, celebratory',
        color: 'gold metallic, chrome silver, jet black, emerald green, ruby red, sapphire blue, ivory cream, champagne gold, deep plum, platinum white',
        tech: 'metallic gradients, geometric vector, symmetrical layout, high contrast, beveled edges, stepped forms, radiant lines, reflective surfaces, bold outlines, theatrical lighting',
        ref: 'inspired by Tamara de Lempicka, Erte, Paul Colin, Cassandre, Chrysler Building, Great Gatsby era, 1920s Paris, jazz age design, ocean liner aesthetics',
        negative: 'rough textures, organic shapes, asymmetry, muted colors, casual composition, distressed surfaces, clutter, rustic elements, hand drawn, natural imperfections'
      },
      '巴洛克': {
        core: 'baroque dramatic chiaroscuro ornate grandeur theatrical',
        detail: 'dramatic lighting, tenebrism, rich drapery, elaborate ornamentation, dynamic movement, spiraling composition, gilded details, marble textures, dramatic gestures, celestial rays, heavy curtains, sculptural forms, opulent fabrics, theatrical staging, dramatic sky, overflowing abundance, emotional intensity, chiaroscuro contrast',
        mood: 'dramatic, majestic, opulent, passionate, intense, grandiose, theatrical, triumphant, divine, emotional',
        color: 'deep burgundy, gold gilt, rich brown, ivory cream, midnight blue, crimson red, emerald green, royal purple, warm ochre, shadow black',
        tech: 'chiaroscuro lighting, volumetric light rays, rich texture mapping, dramatic composition, deep shadow, ornate frame, oil paint texture, golden ratio, atmospheric depth, high contrast',
        ref: 'inspired by Caravaggio, Peter Paul Rubens, Rembrandt, Bernini, Artemisia Gentileschi, Diego Velazquez, Jan Brueghel, Ludovico Carracci, Versailles palace',
        negative: 'minimalism, flat colors, clean lines, simple composition, modern materials, casual poses, plain backgrounds, digital aesthetics, matte finishes, sparse decoration'
      },
      '极繁主义': {
        core: 'maximalism abundance excess pattern clashing eclectic dense',
        detail: 'pattern overload, dense composition, color abundance, mixed textures, eclectic objects, layered patterns, wall to wall detail, botanical abundance, clashing prints, ornate borders, collector aesthetic, treasure trove, visual abundance, decorative excess, tapestry density, maximalist interior, rich ornamentation, sensory overload',
        mood: 'exuberant, vibrant, indulgent, chaotic, joyful, opulent, passionate, whimsical, energetic, extravagant',
        color: 'vibrant magenta, electric blue, rich gold, emerald green, hot pink, royal purple, tangerine orange, ruby red, turquoise, sunflower yellow',
        tech: 'pattern overlay, dense composition, texture clashing, rich color palette, gold accents, detailed textures, pattern mixing, ornate borders, maximal fill, busy backgrounds',
        ref: 'inspired by Iris Apfel, Gucci maximalism, Anna Sui, Dorothy Draper, Tony Duquette, Wesley Taylor, Kit Kemp, maximalist interior design',
        negative: 'minimalism, white space, single color, clean lines, sparse composition, monochrome, empty spaces, plain backgrounds, simple forms, neutral palette'
      },
      '赛博禅意': {
        core: 'cyberpunk zen fusion neon temple tranquil technology',
        detail: 'neon lit temples, digital lotus, holographic incense, zen garden with data streams, robot monks, circuit board mandalas, rain soaked pagoda, glowing cherry blossoms, cybernetic bamboo, meditation amidst holograms, neon calligraphy, floating data petals, calm amidst chaos, tech infused nature, futuristic shrine, electric koi pond, binary sutras, silicon garden',
        mood: 'serene, futuristic, contemplative, mystical, paradoxical, transcendent, tranquil, cybernetic, harmonious, ethereal',
        color: 'neon cyan, zen white, electric pink, jade green, deep indigo, soft amber, holographic blue, dark charcoal, sakura pink, golden light',
        tech: 'neon glow, holographic overlay, volumetric fog, rain reflection, particle effects, emissive shaders, wireframe elements, light bloom, chromatic aberration, depth of field',
        ref: 'inspired by Blade Runner 2049, Ghost in the Shell, Sey Min, Simon Stalenhag, Japanese zen gardens, neon noir, tech noir, Syd Mead, cyberpunk urbanism',
        negative: 'pure nature, historical accuracy, gritty dystopia, steampunk, western architecture, violent imagery, chaotic noise, horror elements, total darkness, aggressive lighting'
      },
      '幻想生物': {
        core: 'fantasy creature concept design mythical beast majestic',
        detail: 'mythical creatures, hybrid anatomy, dragon scales, feathered wings, glowing eyes, magical markings, elemental aura, intricate horns, crystalline formations, bioluminescent patterns, fantasy anatomy, majestic stance, legendary beast, mystical energy, enchanted forest setting, ornate armor, natural habitat, heroic pose',
        mood: 'majestic, mysterious, awe inspiring, magical, powerful, ancient, mythical, primal, enchanting, epic',
        color: 'emerald scales, amethyst crystal, obsidian black, pearl white, fiery orange, deep ocean blue, golden highlight, charcoal gray, ethereal cyan, ruby crimson',
        tech: 'concept art rendering, anatomical studies, dynamic posing, rim lighting, texture detailing, scale mapping, feather rendering, fur texturing, atmospheric perspective, reference sheet composition',
        ref: 'inspired by CreatureBox, Aaron Blaise, Neville Page, Terryl Whitlatch, Allen Williams, Monster Hunter, Dungeons and Dragons, Guillermo del Toro, Jim Henson creature shop',
        negative: 'cartoon style, cute chibi, modern clothing, urban setting, simple anatomy, flat colors, human proportions, photorealistic animals, mundane creatures, static poses'
      },
      '霓虹夜景': {
        core: 'neon night cityscape rain reflection cyberpunk nocturnal',
        detail: 'neon signs, wet pavement, reflective puddles, glowing storefronts, rain soaked streets, foggy atmosphere, urban nightlife, lit windows, steam vents, crossing pedestrians, traffic light trails, towering billboards, back alley glow, midnight city, electric horizon, street lamp halos, misty sidewalks, luminous skyscrapers',
        mood: 'atmospheric, melancholic, mysterious, vibrant, lonely, cinematic, intoxicating, electric, nocturnal, romantic',
        color: 'neon magenta, cyan blue, electric yellow, deep purple, midnight black, warm amber, crimson red, teal glow, soft pink, chrome reflection',
        tech: 'wet surface reflection, neon emission, volumetric fog, bloom lighting, light trail, rain overlay, god rays, depth of field, color grading, lens flare',
        ref: 'inspired by Liam Wong, Masashi Wakui, Blade Runner, cyberpunk 2077, Tokyo night photography, neon noir, Wong Kar Wai, Masaki Okuda, Gregory Crewdson',
        negative: 'daylight, bright sunlight, natural landscapes, rural scenes, warm daylight, pastel colors, blue sky, clean streets, minimal lighting, empty streets'
      },
      '波普拼贴': {
        core: 'pop art collage mixed media bold graphic retro',
        detail: 'comic book halftone, cutout photos, bold speech bubbles, retro advertisements, magazine clippings, Ben-Day dots, screen print texture, urban detritus, juxtaposed imagery, vintage typography, pop culture references, found objects, torn paper edges, photo montage, bold outlines, consumer products, celebrity portraits, graphic patterns',
        mood: 'bold, irreverent, playful, ironic, vibrant, energetic, rebellious, satirical, celebratory, retro',
        color: 'primary red, cyan blue, bright yellow, halftone black, magenta pink, lime green, crisp white, electric orange, royal purple, metallic silver',
        tech: 'halftone pattern, comic dot overlay, screen print texture, cutout edge, mixed media composite, bold lineart, offset printing, paper texture, collage layering, silkscreen effect',
        ref: 'inspired by Andy Warhol, Roy Lichtenstein, Richard Hamilton, Robert Rauschenberg, Eduardo Paolozzi, Jamie Reid, Peter Blake, David Hockney, Barbara Kruger',
        negative: 'subtle gradients, realism, minimalism, monochrome, fine art oil painting, soft blur, natural light, elegant composition, muted tones, classical aesthetics'
      },
      '魔法奇幻': {
        core: 'magical fantasy arcane spellcasting enchanted realm',
        detail: 'glowing runes and sigils floating in air, arcane energy swirling in spirals, enchanted crystals pulsing with light, magical circles etched on ground, spellbooks with luminous pages, wizard towers reaching skyward, elemental wisps dancing, potion bottles bubbling with colorful vapor, astral projections of magical symbols, ethereal mana streams, enchanted forest with glowing flora, ancient tomes bound in mystical leather, starlight magic weaving through scenes, ley lines visible beneath the earth, summoned creatures made of pure energy, arcane portals opening to other dimensions, wand trails leaving sparkles, magical auras enveloping objects, dimensional rifts crackling with power, fairy dust motes in gentle breeze',
        mood: 'enchanting, mystical, wondrous, arcane, powerful, mysterious, awe-inspiring, magical, transcendent, ethereal',
        color: 'arcane purple, ethereal blue, glowing gold, mystic teal, star white, deep indigo, phoenix orange, emerald green, rose pink, silver shimmer',
        tech: 'glow emission, particle effects, lens flare, volumetric lighting, magical aura, rune overlay, energy trails, bloom post-processing, chromatic aberration, ethereal fog',
        ref: 'inspired by World of Warcraft magic, League of Legends arcane, Harry Potter, Doctor Strange, Final Fantasy spells, D&D arcane traditions, WoW mage class, Elder Scrolls magic, MTG blue mana, Overwatch Moira, Little Witch Academia, The Owl House, Mahou Shoujo genre, Black Clover grimoires, Magi labyrinth',
        negative: 'modern technology, mundane reality, sci-fi elements, urban contemporary, realistic military, office settings, plain clothing, everyday objects, dull lighting, minimalist design'
      },
      '火焰地狱': {
        core: 'infernal fire realm brimstone hellscape burning cataclysm',
        detail: 'rivers of molten lava snaking through cracked earth, towering pillars of flame reaching skyward, ember storms swirling in superheated air, charred skeletal remains of structures, volcanic vents erupting periodically, heat haze distorting distant formations, obsidian rock formations, magma waterfalls cascading, ash clouds blotting out sun, fire elementals roaming freely, hellfire burning in unnatural colors, scorched battlefield aftermath, sulfur vents spewing toxic gas, burning chains and restraints, infernal forge with eternal flames, demonic sigils glowing on ground, fire tornadoes touching down, cinder rain falling, blackened earth steaming, lava bubbles bursting with toxic gas',
        mood: 'furious, apocalyptic, intense, destructive, hellish, scorching, terrifying, overwhelming, primal, cataclysmic',
        color: 'inferno red, magma orange, brimstone yellow, obsidian black, ash gray, hellfire green, molten gold, charcoal smoke, blood crimson, volcanic violet',
        tech: 'volumetric fire, heat distortion, particle ember system, glow emissive, smoke simulation, lava fluid dynamics, bloom overexposure, thermal color grading, light flicker, ash particle overlay',
        ref: 'inspired by Doom Eternal hellscapes, Diablo burning hells, Dark Souls Lost Izalith, Berserk eclipse, Dante Inferno, Mordor Mount Doom, Warhammer chaos realm, God of War Muspelheim, Hades underworld, MTG red mana, D&D Nine Hells, Pathfinder Abyss, Balrog of Moria, Surtur realm, Diablo 4 hell',
        negative: 'cold environments, snow and ice, water scenes, peaceful nature, blue skies, green meadows, gentle lighting, serene atmosphere, clean spaces, pastel colors'
      },
      '冰霜世界': {
        core: 'frozen realm ice kingdom arctic fantasy crystalline frost',
        detail: 'massive glaciers with deep blue crevasses, ice crystal formations growing like trees, frozen waterfalls suspended mid-flow, snow-covered mountains under aurora sky, frost patterns on every surface, ice palaces with translucent walls, frozen lakes reflecting moonlight, blizzard winds carrying snow, icicles hanging like chandeliers, permafrost ground cracking, frozen statues in eternal pose, ice bridges spanning chasms, snowdrifts sculpted by wind, diamond dust floating in air, frozen ships trapped in ice sea, yeti tracks in deep snow, frost giant remains, ice caves with blue glow, northern lights dancing overhead, glacial fissures revealing ancient depths',
        mood: 'frozen, serene, majestic, isolated, pristine, harsh, crystalline, ethereal, melancholic, timeless',
        color: 'glacial blue, frost white, deep navy, ice cyan, aurora green, silver gray, midnight purple, snow pearl, frozen teal, crystal clear',
        tech: 'subsurface scattering ice, frost particle system, snow accumulation, ice refraction, volumetric aurora, crystalline caustics, frozen mist, blue color grading, reflection ice surface, snowflake overlay',
        ref: 'inspired by Frozen Disney, Icecrown Citadel WoW, Frostpunk, Subnautica Below Zero, Dark Souls painted world, Norse mythology Niflheim, Game of Thrones beyond the Wall, The Thing 1982, MTG ice age, D&D frostfell, Pathfinder Irrisen, Skyrim winterhold, Rise of the Guardians, Frozen planet documentary, Norse Jotunheim',
        negative: 'hot environments, fire and lava, deserts, tropical scenes, summer themes, bright warm sunlight, volcanic heat, steam, jungle, arid landscapes'
      },
      '雷电之力': {
        core: 'lightning storm electric power thunder god tempest fury',
        detail: 'jagged lightning bolts splitting dark sky, electric arcs dancing between clouds, storm vortex spinning with purple energy, plasma tendrils reaching ground, thunderhead clouds towering miles high, electrostatic discharge crackling, ionized air glowing blue, lightning striking repeatedly in same spot, electric fields visible as shimmer, charged particles creating aurora effects, storm cell rotating ominously, ball lightning floating mysteriously, lightning cage trapping energy, tesla coils arcing wildly, electric wings made of lightning, thunder god descending from clouds, storm giant wielding lightning, plasma blades crackling, electric runes pulsing, magnetic storm disrupting reality',
        mood: 'powerful, electrifying, furious, divine, intense, crackling, overwhelming, charged, awe-inspiring, tempestuous',
        color: 'electric blue, plasma purple, storm gray, lightning white, thunder gold, ion cyan, static pink, volt yellow, midnight black, arc silver',
        tech: 'electric arc rendering, lightning bolt generation, plasma glow, particle discharge, electromagnetic field visualization, storm cloud volumetrics, flash illumination, energy trail, screen shake effect, bloom overexposure',
        ref: 'inspired by Thor Ragnarok, Zeus mythology, Raiden Mortal Kombat, Storm X-Men, Infamous Cole, Final Fantasy Ramuh, Pokemon Zapdos, MTG red-blue, Avatar lightning bending, Dark Souls sunlight spear, Warhammer stormcast, D&D tempest domain, One Piece Enel, Naruto Chidori, League of Legends Volibear',
        negative: 'calm clear skies, peaceful nature, gentle breeze, static scenes, still water, slow motion, quiet atmosphere, minimal energy, dormant state, silence'
      },
      '暗影深渊': {
        core: 'shadow abyss void darkness eldritch nightmare dimension',
        detail: 'impenetrable darkness swallowing all light, shadow tendrils creeping from corners, void tears in reality, formless shapes lurking in darkness, eyes glowing in the abyss, darkness given physical form, shadows moving independently, black fog consuming matter, dimensional rifts to void, shadow creatures emerging, light being devoured by darkness, whispering darkness, nightmarish geometry, impossible shadows, void energy corrupting, pitch black depth with no bottom, shadow realm bleeding into reality, dark matter coalescing, umbral whispers, eternal darkness stretching infinitely',
        mood: 'ominous, terrifying, mysterious, consuming, oppressive, dread-inducing, claustrophobic, corrupting, eldritch, hopeless',
        color: 'void black, shadow purple, abyss blue, dark crimson, nightmare gray, umbral violet, pitch black, phantom white, corrupt green, deep obsidian',
        tech: 'volumetric darkness, shadow particle system, fog of war, light absorption, darkness vignette, negative space, depth obscuring, shadow creature silhouette, light fading gradient, darkness bloom',
        ref: 'inspired by Dark Souls Abyss, Kingdom Hearts heartless, Berserk eclipse void, H.P. Lovecraft, Destiny taken, WoW void lords, Hollow Knight abyss, MTG black mana, D&D shadowfell, Alan Wake dark presence, Stranger Things upside down, Silent Hill otherworld, Demon Slayer infinity castle, The Darkness comics, Dishonored void',
        negative: 'bright daylight, sunny scenes, cheerful atmosphere, open spaces, colorful environments, clean minimalism, transparent objects, light pastels, white backgrounds, joyful expressions'
      },
      '自然之力': {
        core: 'nature elemental force druidic primal earth mother wild',
        detail: 'ancient forests with trees reaching sky, roots and vines intertwining with everything, moss covering ancient stones, flowers blooming in accelerated time, animals gathering in harmony, seasonal changes happening simultaneously, earth magic making plants grow, druidic circles of standing stones, waterfalls nourishing lush valleys, natural energy flowing like rivers, giant trees serving as homes, animal spirits manifesting, earth elementals rising, sunlight filtering through dense canopy, sacred groves untouched by time, wildflowers carpeting meadows, bioluminescent forest at night, nature reclaiming ruins, elemental spirits dancing, primal energy pulsing through earth',
        mood: 'primal, harmonious, vibrant, wild, ancient, nurturing, powerful, serene, lively, sacred',
        color: 'forest green, earth brown, sky blue, flower pink, sun gold, moss emerald, autumn orange, river cyan, berry purple, bark bronze',
        tech: 'volumetric foliage, god rays through canopy, wind animation, growth particle effects, seasonal color grading, natural light bounce, insect particle swarm, water reflection, moss subsurface, petal scatter',
        ref: 'inspired by Princess Mononoke, Avatar Pandora, Druid WoW, MTG green mana, D&D druid circles, Ferngully, Ori and the Blind Forest, Moana Te Fiti, Annihilation shimmer, LOTR Fangorn, Nausicaa valley, The Last of Us overgrown, Horizon Zero Dawn nature, Swamp Thing, Shadow of the Colossus nature',
        negative: 'industrial urban, technology, pollution, concrete, machinery, sterile environments, plastic, metal domination, deforestation, artificial lighting'
      },
      '神圣光辉': {
        core: 'holy radiance divine light celestial heaven angelic realm',
        detail: 'golden light beams descending from heavens, angelic wings of pure light, divine halos illuminating sacred spaces, pearlescent gates opening to paradise, clouds serving as heavenly floor, celestial architecture of impossible beauty, divine light healing all it touches, cherubs floating among rays, holy symbols glowing with power, ethereal choir visualized as light, golden feathers drifting down, cathedral of light rising infinitely, divine judgment manifesting as light, sacred geometry in architecture, heavenly garden in eternal bloom, pillars of light connecting heaven and earth, divine radiance banishing darkness, holy fire burning pure white, celestial beings of pure energy, sanctified ground glowing',
        mood: 'divine, blessed, pure, transcendent, sacred, peaceful, reverent, glorious, protective, eternal',
        color: 'divine gold, heavenly white, sacred blue, angel ivory, holy amber, paradise pink, blessed silver, celestial cyan, radiant pearl, pure light',
        tech: 'god rays volumetric, bloom radiance, lens flare holy, golden hour lighting, light beam effect, halo rendering, particle light motes, divine glow post, soft focus, ethereal fog layer',
        ref: 'inspired by Diablo 3 high heavens, Bayonetta Paradiso, MTG white mana, D&D celestial planes, Michelangelo Sistine, Angels in America, Evangelion angels, Kid Icarus Uprising, God of War light of Alfheim, LOTR Valinor, WoW naaru, Dante Paradiso, Dark Souls Anor Londo, Journey game, Disciples sacred empire',
        negative: 'darkness, shadow, corruption, demonic imagery, blood, horror, decay, filth, suffering, profane symbols'
      },
      '废土求生': {
        core: 'wasteland survival post-apocalyptic desert scavenger fallout',
        detail: 'shattered highways stretching across barren desert, rusted vehicle husks half-buried in sand, crumbling skyscrapers as skeletal remains, makeshift shelters cobbled from debris, dust storms reducing visibility, scavenger camps with flickering fires, broken neon signs still glowing, radiation zones marked with warnings, abandoned military equipment, overgrown ruins of civilization, dried riverbeds cracked and barren, lone wanderer tracks in sand, warning signs at contaminated zones, barbed wire and barricades, oil drums burning for warmth, weathered billboards from past, collapsed bridges over dry gorges, sand-blasted surfaces, survival caches hidden, mutant creatures in shadows',
        mood: 'desolate, desperate, resilient, bleak, harsh, lonely, gritty, survivalist, weathered, haunting',
        color: 'sand brown, rust orange, dust gray, nuclear yellow, ash black, faded green, military olive, blood rust, sky bleached, charcoal smoke',
        tech: 'dust particle system, heat haze distortion, desaturated color grading, film grain, vignette, sand accumulation, rust texture, weather damage, lens dirt, atmospheric haze',
        ref: 'inspired by Mad Max Fury Road, Fallout series, The Last of Us, Book of Eli, Waterworld, The Road, Borderlands, Wasteland game, Tank Girl, Dune Arrakis, Nausicaa toxic jungle, Metro 2033, Stalker, Terminator future, I Am Legend, 12 Monkeys, Horizon Zero Dawn ruins, Mortal Engines, The Postman, Death Stranding',
        negative: 'pristine clean, lush gardens, luxury items, modern technology, happy crowds, bright colors, new construction, organized society, abundance, cleanliness'
      },
      '异星科幻': {
        core: 'alien world extraterrestrial planet sci-fi xeno biology',
        detail: 'twin suns setting over alien horizon, bioluminescent flora in strange colors, crystalline formations unlike Earth geology, floating islands in purple sky, alien creatures with exotic anatomies, gravity-defying landscapes, organic architecture grown not built, strange atmospheres with colored gases, multiple moons hanging in sky, silicon-based life forms, alien ruins of unknown civilization, exotic liquid oceans not water, ringed planet filling half sky, magnetic anomalies creating auroras, pulsar stars pulsing rhythmically, nebula clouds visible from surface, alien jungle with chitinous trees, gas giant looming in sky, thermal vents creating alien oasis, hexagonal storm patterns on planet surface',
        mood: 'awe-inspiring, alien, wondrous, exotic, mysterious, otherworldly, exploratory, strange, cosmic, sublime',
        color: 'alien purple, bioluminescent cyan, exotic orange, deep space black, nebula pink, alien green, cosmic blue, strange yellow, xenon white, ultraviolet',
        tech: 'multi-sun lighting, atmospheric scattering, bioluminescence emission, alien terrain generation, volumetric nebula, exotic material shaders, gravitational lensing, non-Earth physics, procedural organisms, alien skybox',
        ref: 'inspired by No Man Sky, Subnautica alien planet, Avatar Pandora, Mass Effect worlds, Star Wars alien planets, Arrival alien, Alien LV-426, Prometheus, Interstellar planets, Rick and Morty dimensions, Halo rings, Destiny planets, Dune Arrakis, The Expanse, Star Trek strange new worlds, Annihilation shimmer, Scavengers Reign, Stellaris, Elite Dangerous, Outer Wilds',
        negative: 'Earth-like environments, familiar cities, human architecture, normal animals, blue sky, green grass, recognizable landmarks, mundane reality, house interiors, office spaces'
      },
      '克苏鲁': {
        core: 'cosmic horror lovecraftian eldritch cthulhu mythos madness',
        detail: 'impossible geometry defying Euclidean logic, tentacled horrors emerging from rifts, cyclopean architecture of non-human origin, green decay and slime covering surfaces, ancient tomes bound in unidentifiable leather, cult symbols drawn in unknown substances, deep ones rising from dark waters, madness-inducing vistas, eyes that should not exist watching, non-Euclidean corridors stretching infinitely, elder signs barely containing horrors, sunken city of Rlyeh architecture, shoggoths forming from black ooze, color out of space corrupting land, Mi-Go brain cylinders, star-spawn of Cthulhu, ancient ones sleeping beneath earth, forbidden knowledge written in blood, sanity-blasting revelations, cosmic indifference to human existence',
        mood: 'maddening, incomprehensible, cosmic, terrifying, ancient, corrupting, nihilistic, overwhelming, dread, insanity',
        color: 'eldritch green, void black, decay yellow, deep one gray, madness purple, rotting brown, Cthulhu teal, cosmic magenta, slime chartreuse, ancient blood red',
        tech: 'non-Euclidean geometry, tentacle rigging, organic horror texturing, volumetric fog, corruption particle, slime shader, chromatic horror, darkness vignette, sanity distortion, depth of field horror',
        ref: 'inspired by H.P. Lovecraft, Bloodborne, Call of Cthulhu RPG, Darkest Dungeon, The Sinking City, Dagon, The Thing, Event Horizon, In the Mouth of Madness, The Void, Amnesia Dark Descent, Sunless Sea, Eternal Darkness, Junji Ito, The Mist, Hellboy, The Lighthouse, Annihilation, Dead Space, The Call of Cthulhu game',
        negative: 'cute aesthetics, bright cheerful, clean modern, minimal design, happy themes, pastel colors, family friendly, simple shapes, orderly patterns, comfort'
      },
      '文艺复兴': {
        core: 'renaissance classical art humanism perspective sfumato',
        detail: 'balanced classical composition, idealized human figures with anatomical accuracy, linear perspective creating depth, soft sfumato transitions, chiaroscuro modeling, classical architecture and drapery, religious and mythological scenes, harmonious proportion, naturalistic portraiture, golden ratio composition, fresco and oil painting techniques, renaissance color palette, scholarly atmosphere, rebirth of classical learning, detailed facial expressions',
        mood: 'harmonious, dignified, scholarly, serene, classical, noble, balanced, contemplative, refined, timeless',
        color: 'warm earth tones, deep reds, rich blues, gold accents, ivory, olive green, terracotta, sienna, umber, lapis blue',
        tech: 'linear perspective, sfumato blending, chiaroscuro, glazing layers, tempera texture, classical proportion, fresco technique, oil layering, atmospheric perspective, anatomical study',
        ref: 'inspired by Leonardo da Vinci, Michelangelo, Raphael, Botticelli, Titian, The Birth of Venus, Mona Lisa, Sistine Chapel, The School of Athens, Donatello, Masaccio, Giotto, Fra Angelico, Verrocchio, Perugino',
        negative: 'modern abstract, cartoon, anime, pixel art, flat design, neon colors, digital glitch, pop art, minimal geometric, low poly'
      },
      '洛可可': {
        core: 'rococo ornate decorative pastel elegance aristocratic',
        detail: 'ornate curved forms and scrollwork, pastel color palette, gilded gold accents, playful romantic scenes, aristocratic leisure, delicate porcelain details, floral garlands, cherubs and cupids, asymmetrical compositions, luxurious fabrics and silk, chinoiserie motifs, intimate boudoir settings, elaborate ornamentation, soft dreamy atmosphere, decorative paneling',
        mood: 'playful, elegant, whimsical, romantic, luxurious, delicate, charming, lighthearted, refined, ornate',
        color: 'pastel pink, powder blue, cream, gold, mint green, lavender, ivory, rose, soft peach, pearl white',
        tech: 'gilded ornamentation, delicate brushwork, soft pastel rendering, ornate scrollwork, decorative detail, porcelain texture, silk fabric rendering, asymmetrical balance, rocaille motifs, light airy lighting',
        ref: 'inspired by Francois Boucher, Jean-Honore Fragonard, The Swing, Antoine Watteau, Marie Antoinette era, Versailles, Elisabeth Vigee Le Brun, Rococo architecture, Jean-Baptiste Greuze, Nicolas Lancret',
        negative: 'dark gothic, brutalist, minimal, industrial, neon, cyberpunk, harsh shadows, modern abstract, grunge, heavy metal'
      },
      '新古典主义': {
        core: 'neoclassicism classical revival noble simplicity grandeur',
        detail: 'classical Greek and Roman themes, noble simplicity and calm grandeur, clean lines and symmetry, heroic figures in classical poses, marble sculpture aesthetic, columns and classical architecture, historical and mythological subjects, restrained color palette, crisp drapery, moral and patriotic themes, archaeological accuracy, idealized beauty, dramatic but controlled composition, bas-relief influence, austere elegance',
        mood: 'noble, dignified, heroic, austere, calm, classical, moral, grand, restrained, timeless',
        color: 'marble white, classical beige, muted gold, terracotta, olive, deep red, slate gray, bronze, ivory, ochre',
        tech: 'classical proportion, crisp contour lines, marble rendering, symmetrical composition, drapery study, bas-relief technique, archaeological detail, restrained palette, heroic scale, academic technique',
        ref: 'inspired by Jacques-Louis David, Oath of the Horatii, Jean-Auguste-Dominique Ingres, Antonio Canova, The Death of Socrates, Greek sculpture, Roman architecture, Angelica Kauffman, Pompeii frescoes, neoclassical painting',
        negative: 'baroque excess, rococo ornament, impressionist blur, abstract, neon, cartoon, anime, grunge, surreal, chaotic'
      },
      '浪漫主义': {
        core: 'romanticism sublime emotion dramatic nature individualism',
        detail: 'dramatic emotional scenes, sublime and awe-inspiring nature, turbulent skies and storms, heroic individual struggles, exotic and historical subjects, intense color and light contrast, wild landscapes, emotional intensity, gothic elements, shipwrecks and ruins, dramatic chiaroscuro, passionate expression, freedom and imagination, medieval and oriental themes, sweeping vistas',
        mood: 'dramatic, passionate, sublime, melancholic, heroic, intense, awe-inspiring, turbulent, nostalgic, emotional',
        color: 'stormy grays, fiery orange, deep blue, dramatic red, golden sunset, dark brown, midnight blue, crimson, ash gray, amber',
        tech: 'dramatic chiaroscuro, turbulent brushwork, expressive color, sublime scale, dramatic sky rendering, emotional composition, impasto texture, storm lighting, romantic color contrast, wild landscape',
        ref: 'inspired by Caspar David Friedrich, Wanderer above the Sea of Fog, Eugene Delacroix, Liberty Leading the People, J.M.W. Turner, Theodore Gericault, Raft of the Medusa, William Blake, Francisco Goya, John Constable',
        negative: 'flat lighting, minimal, corporate, sterile, cartoon, anime, digital clean, geometric, pop art, pastel soft'
      },
      '现实主义': {
        core: 'realism everyday life honest depiction social observation',
        detail: 'honest depiction of everyday life, working class subjects, unidealized portrayal, social observation, natural light, ordinary scenes, precise detail, rural and urban labor, domestic interiors, authentic textures, muted natural palette, documentary quality, contemporary life, unglamorous truth, human dignity in common scenes',
        mood: 'honest, grounded, contemplative, earnest, plain, authentic, quiet, observational, dignified, sober',
        color: 'earthy browns, muted grays, natural ochre, dusty green, faded blue, warm tan, slate, clay, olive, sepia',
        tech: 'natural lighting, precise detail, plein air observation, muted palette, documentary realism, authentic texture, social realism, unidealized rendering, everyday subject, honest portrayal',
        ref: 'inspired by Gustave Courbet, The Stone Breakers, Jean-Francois Millet, The Gleaners, Honore Daumier, Ilya Repin, Thomas Eakins, Winslow Homer, Edward Hopper, Andre Kertesz photography',
        negative: 'fantasy, surreal, abstract, idealized, glamorous, cartoon, anime, neon, gothic, exaggerated'
      },
      '表现主义': {
        core: 'expressionism emotional distortion subjective intense color',
        detail: 'emotional distortion of reality, exaggerated forms and colors, subjective inner experience, bold brushstrokes, anguished figures, distorted perspectives, intense emotional color, psychological intensity, urban anxiety, raw expressive energy, simplified shapes, dramatic exaggeration, inner turmoil, nightmarish scenes, visceral emotion',
        mood: 'anguished, intense, anxious, raw, emotional, disturbed, powerful, unsettling, passionate, tormented',
        color: 'harsh red, acid yellow, deep black, sickly green, livid purple, blood orange, bone white, midnight blue, rust, ochre',
        tech: 'distorted perspective, expressive brushwork, exaggerated color, emotional distortion, raw texture, angular forms, psychological intensity, bold outlines, subjective color, visceral energy',
        ref: 'inspired by Edvard Munch, The Scream, Ernst Ludwig Kirchner, Egon Schiele, Wassily Kandinsky, Franz Marc, Emil Nolde, Die Brucke, Der Blaue Reiter, Oskar Kokoschka',
        negative: 'realistic, calm, serene, pastel, cute, idealized, photographic, minimal, corporate, harmonious'
      },
      '立体主义': {
        core: 'cubism geometric fragmentation multiple perspectives abstract',
        detail: 'fragmented forms broken into geometric shapes, multiple perspectives simultaneously, angular planes, abstracted still life and figures, collage elements, muted earthy palette with accents, interlocking facets, flattened space, analytical structure, synthetic cubism, musical instruments and faces, newspaper and texture collage, geometric abstraction, deconstructed reality, intellectual composition',
        mood: 'analytical, intellectual, fragmented, abstract, bold, structured, avant-garde, geometric, cerebral, dynamic',
        color: 'muted browns, gray, ochre, olive, black, white, muted blue, tan, rust, charcoal',
        tech: 'geometric fragmentation, multiple perspective, planar analysis, collage technique, flattened space, angular facets, synthetic cubism, interlocking shapes, deconstructed form, abstract geometry',
        ref: 'inspired by Pablo Picasso, Les Demoiselles dAvignon, Georges Braque, Juan Gris, Fernand Leger, Analytical Cubism, Synthetic Cubism, Robert Delaunay, Albert Gleizes, Jean Metzinger',
        negative: 'realistic, romantic, soft, pastel, cute, photographic, smooth, organic curves, traditional, sentimental'
      },
      '未来主义': {
        core: 'futurism motion speed technology dynamic energy',
        detail: 'dynamic motion and speed, technological optimism, fragmented moving forms, mechanical energy, urban dynamism, racing cars and machines, multiple exposure motion, angular dynamic lines, industrial power, energetic composition, modern city energy, abstraction of movement, light trails, mechanical forms, revolutionary dynamism',
        mood: 'dynamic, energetic, aggressive, optimistic, powerful, futuristic, fast, revolutionary, mechanical, bold',
        color: 'steel gray, electric blue, fiery red, metallic silver, black, chrome, industrial yellow, white, gunmetal, orange',
        tech: 'motion blur, dynamic lines, fragmented motion, mechanical forms, speed lines, multiple exposure, angular energy, industrial texture, light trails, dynamic composition',
        ref: 'inspired by Umberto Boccioni, Unique Forms of Continuity in Space, Giacomo Balla, Dynamism of a Dog on a Leash, Gino Severini, Carlo Carra, Filippo Marinetti, Futurist Manifesto, Luigi Russolo, Fortunato Depero',
        negative: 'static, calm, pastoral, traditional, organic, soft, romantic, classical, serene, still life'
      },
      '达达主义': {
        core: 'dadaism absurd anti-art collage irrational satire',
        detail: 'absurd and irrational juxtapositions, anti-art sentiment, photomontage and collage, found objects, nonsensical compositions, satirical political commentary, random chance elements, deconstructed language, provocative imagery, mechanical reproduction, dadaist nonsense, chaotic arrangement, ironic humor, subversive art, deliberate disorder',
        mood: 'absurd, ironic, chaotic, provocative, satirical, nonsensical, subversive, playful, anarchic, irreverent',
        color: 'monochrome, stark black and white, collage mixed, newspaper gray, primary red, harsh yellow, blue, cream, sepia, high contrast',
        tech: 'photomontage, collage technique, found object, chance composition, mechanical reproduction, absurd juxtaposition, deconstructed typography, ironic assembly, chaotic layout, anti-art aesthetic',
        ref: 'inspired by Marcel Duchamp, Fountain, Hannah Hoch, Kurt Schwitters, Man Ray, Tristan Tzara, Raoul Hausmann, Dada Manifesto, Francis Picabia, Max Ernst',
        negative: 'harmonious, beautiful, logical, coherent, traditional, sentimental, elegant, refined, orderly, realistic'
      },
      '抽象表现主义': {
        core: 'abstract expressionism gestural action painting emotional color field',
        detail: 'large-scale gestural brushstrokes, spontaneous action painting, emotional color fields, drips and splatters, raw canvas texture, expressive mark-making, subconscious expression, monumental scale, layered paint, dynamic gestures, color field abstraction, improvisational composition, physical painting process, energetic strokes, non-representational emotion',
        mood: 'expressive, raw, emotional, spontaneous, powerful, energetic, intense, free, visceral, monumental',
        color: 'bold primaries, black, white, cadmium red, ultramarine, yellow ochre, raw umber, titanium white, crimson, cobalt',
        tech: 'gestural brushwork, action painting, paint dripping, color field, impasto layering, spontaneous mark-making, raw canvas, large scale, expressive gesture, subconscious flow',
        ref: 'inspired by Jackson Pollock, Willem de Kooning, Mark Rothko, Franz Kline, Barnett Newman, Clyfford Still, Helen Frankenthaler, Joan Mitchell, Lee Krasner, Robert Motherwell',
        negative: 'representational, realistic, figurative, neat, orderly, minimal, decorative, cute, photographic, precise'
      },
      '野兽派': {
        core: 'fauvism wild color bold expression vivid non-naturalistic',
        detail: 'wild expressive color, bold non-naturalistic palette, simplified forms, vivid complementary contrasts, energetic brushwork, flat color areas, emotional color use, fauvist landscapes and portraits, pure intense hues, spontaneous composition, decorative patterns, raw color energy, simplified drawing, joyful color explosion, liberated color',
        mood: 'bold, joyful, vibrant, expressive, wild, energetic, passionate, spontaneous, intense, liberated',
        color: 'vivid red, electric blue, bright yellow, emerald green, hot pink, orange, violet, turquoise, magenta, lime',
        tech: 'non-naturalistic color, bold color blocking, expressive brushwork, simplified form, complementary contrast, flat color areas, pure pigment, energetic stroke, fauvist palette, spontaneous composition',
        ref: 'inspired by Henri Matisse, Andre Derain, Maurice de Vlaminck, Raoul Dufy, Kees van Dongen, Georges Rouault, Fauvism movement, Albert Marquet, Henri Manguin, Jean Puy',
        negative: 'muted, realistic, monochrome, pastel, subtle, photographic, naturalistic, restrained, gray, dull'
      },
      '点彩派': {
        core: 'pointillism dots color theory optical mixing neo-impressionism',
        detail: 'small distinct dots of pure color, optical color mixing, scientific color theory, luminous landscapes, dots forming cohesive image, complementary color dots, neo-impressionist technique, shimmering light effects, meticulous dot application, color harmony, serene scenes, optical blending, dotted texture, bright luminous atmosphere, precise point placement',
        mood: 'serene, luminous, meticulous, harmonious, calm, bright, scientific, dreamy, precise, radiant',
        color: 'bright blue, yellow, red, green, violet, orange, turquoise, pink, teal, white',
        tech: 'pointillism dots, optical mixing, complementary dots, color theory, stippling, luminous texture, neo-impressionism, precise dotwork, optical blending, shimmering light',
        ref: 'inspired by Georges Seurat, A Sunday Afternoon on the Island of La Grande Jatte, Paul Signac, Camille Pissarro, Henri-Edmond Cross, Maximilien Luce, Theo van Rysselberghe, Neo-Impressionism, divisionism, Charles Angrand',
        negative: 'broad strokes, blurred, muddy colors, dark, realistic photography, expressionist, abstract, minimal, monochrome, heavy texture'
      },
      '拉斐尔前派': {
        core: 'pre-raphaelite medieval romantic detailed vivid nature symbolism',
        detail: 'vivid jewel-toned colors, medieval romantic themes, meticulous botanical detail, literary and mythological subjects, luminous glowing light, ornate patterns, tragic heroines, detailed naturalism, Arthurian legends, symbolic imagery, rich fabrics, intricate detail, dreamy atmosphere, poetic melancholy, bright clear colors',
        mood: 'romantic, poetic, melancholic, dreamy, medieval, symbolic, luminous, ornate, passionate, ethereal',
        color: 'jewel tones, deep red, emerald green, sapphire blue, gold, crimson, violet, rose, teal, amber',
        tech: 'meticulous detail, luminous glow, jewel-toned palette, botanical precision, medieval ornament, symbolic composition, rich fabric rendering, clear bright light, ornate pattern, poetic naturalism',
        ref: 'inspired by Dante Gabriel Rossetti, John Everett Millais, Ophelia, William Holman Hunt, The Light of the World, Edward Burne-Jones, John William Waterhouse, The Lady of Shalott, Ford Madox Brown, Evelyn De Morgan',
        negative: 'modern abstract, impressionist blur, minimal, cartoon, anime, neon, digital, grunge, photographic realism, flat design'
      },
      '象征主义': {
        core: 'symbolism dreamlike mystical metaphor esoteric allegory',
        detail: 'dreamlike mystical scenes, symbolic metaphors, esoteric and occult imagery, mythological allegory, ethereal figures, mysterious atmosphere, spiritual themes, death and desire symbolism, exotic and decadent imagery, veiled meanings, fantastical creatures, twilight moods, ornate decorative borders, inner visions, enigmatic narratives',
        mood: 'mystical, dreamlike, enigmatic, ethereal, melancholic, spiritual, mysterious, decadent, otherworldly, introspective',
        color: 'deep purple, midnight blue, gold, emerald, crimson, silver, ivory, teal, violet, black',
        tech: 'dreamlike atmosphere, symbolic composition, ethereal glow, mystical lighting, allegorical imagery, ornate decoration, twilight palette, veiled meaning, spiritual aura, fantastical detail',
        ref: 'inspired by Gustave Moreau, Odilon Redon, Gustav Klimt, The Kiss, Arnold Bocklin, Island of the Dead, Edvard Munch, Fernand Khnopff, Jean Delville, Franz von Stuck',
        negative: 'realistic, mundane, everyday, literal, modern, minimal, cartoon, bright cheerful, scientific, documentary'
      },
      '拜占庭': {
        core: 'byzantine mosaic gold iconography religious splendor',
        detail: 'glittering gold mosaics, religious iconography, flat frontal figures, haloed saints, rich jewel tones, intricate geometric patterns, sacred splendor, stylized elongated figures, gold leaf backgrounds, imperial grandeur, mosaic tesserae texture, orthodox christian themes, ornate halos, divine light symbolism, luxurious decoration',
        mood: 'sacred, majestic, divine, ornate, solemn, imperial, spiritual, resplendent, ceremonial, timeless',
        color: 'gold leaf, deep blue, rich red, emerald, purple, ivory, lapis lazuli, crimson, teal, bronze',
        tech: 'gold leaf mosaic, tesserae texture, flat frontal composition, halo rendering, jewel-tone palette, geometric ornament, sacred iconography, imperial splendor, divine glow, ornate decoration',
        ref: 'inspired by Hagia Sophia mosaics, Ravenna mosaics, Byzantine icons, San Vitale, Christ Pantocrator, Orthodox iconography, Justinian, Theodora, Byzantine art, Mount Athos frescoes',
        negative: 'modern abstract, realistic perspective, cartoon, minimal, impressionist, naturalistic, casual, secular, contemporary, grunge'
      },
      '埃及': {
        core: 'egyptian hieroglyph pharaoh pyramid ancient civilization',
        detail: 'hieroglyphic inscriptions, pharaoh portraits, pyramid and temple scenes, profile figures with frontal eyes, gold and lapis colors, papyrus texture, gods and goddesses, ankh and scarab symbols, monumental symmetry, desert setting, ceremonial scenes, wall painting style, canopic imagery, sphinx and obelisk, ancient ritual detail',
        mood: 'ancient, majestic, ceremonial, mysterious, monumental, divine, regal, timeless, sacred, powerful',
        color: 'gold, lapis blue, turquoise, terracotta, black, ivory, ochre, red, green, sand',
        tech: 'hieroglyph rendering, profile composition, gold leaf, papyrus texture, monumental symmetry, wall painting, ceremonial detail, ancient ornament, flat relief, symbolic iconography',
        ref: 'inspired by Egyptian tomb paintings, Tutankhamun, Book of the Dead, Karnak temple, Luxor, Abu Simbel, Nefertiti bust, Cleopatra, Egyptian hieroglyphs, Valley of the Kings',
        negative: 'modern, abstract, cartoon, anime, impressionist, minimal, futuristic, casual, realistic perspective, contemporary'
      },
      '希腊古典': {
        core: 'greek classical marble sculpture amphora mythology',
        detail: 'marble sculpture aesthetic, classical Greek mythology, amphora vase painting, idealized athletic figures, temple columns, laurel wreaths, gods and heroes, draped chitons, red-figure pottery, olympic themes, classical symmetry, mediterranean setting, heroic nudity, marble texture, ancient agora scenes',
        mood: 'classical, heroic, noble, serene, athletic, timeless, divine, balanced, dignified, ancient',
        color: 'marble white, terracotta, black, gold, olive, bronze, sky blue, ivory, sand, deep red',
        tech: 'marble rendering, classical proportion, vase painting, red-figure technique, column architecture, drapery study, heroic pose, mediterranean light, symmetry, idealized form',
        ref: 'inspired by Greek vase painting, Parthenon, Discobolus, Venus de Milo, Zeus of Olympia, Greek sculpture, Homeric myths, Acropolis, red-figure pottery, classical Greek art',
        negative: 'modern, abstract, cartoon, gothic, baroque excess, neon, futuristic, minimal, impressionist, grunge'
      },
      '北欧神话': {
        core: 'norse mythology viking runes asgard frost giants',
        detail: 'viking mythology scenes, runic inscriptions, Asgard and Valhalla, frost giants and dragons, norse gods and warriors, longship battles, aurora skies, runestone texture, yggdrasil world tree, ravens and wolves, valkyrie warriors, ice and fire realms, norse runes, epic battle scenes, mythological beasts',
        mood: 'epic, fierce, mythic, cold, powerful, heroic, ancient, rugged, dramatic, legendary',
        color: 'ice blue, steel gray, aurora green, deep red, black, silver, white, frost, bronze, dark teal',
        tech: 'runic inscription, aurora rendering, ice texture, epic battle composition, norse ornament, runestone carving, cold palette, mythic scale, viking detail, dramatic lighting',
        ref: 'inspired by Norse mythology, Vikings, Valhalla, Thor and Odin, Ragnarok, Jormungandr, Yggdrasil, runestones, Beowulf, Wagner Ring Cycle, God of War, Skyrim',
        negative: 'modern, cute, cheerful, pastel, anime, minimal, futuristic, tropical, warm, peaceful'
      },
      '凯尔特': {
        core: 'celtic knotwork interlace spiral ancient britain',
        detail: 'intricate celtic knotwork, interlacing patterns, spiral motifs, ancient british landscapes, druid and stone circle themes, illuminated manuscript style, celtic crosses, triskelion symbols, forest and mist settings, mythological celtic figures, bronze age metalwork, knotwork borders, sacred groves, celtic animal motifs, misty highlands',
        mood: 'ancient, mystical, intricate, earthy, spiritual, rugged, timeless, mysterious, organic, reverent',
        color: 'forest green, bronze, earth brown, misty gray, gold, deep red, blue, ivory, moss, copper',
        tech: 'knotwork pattern, interlace design, spiral motif, illuminated manuscript, celtic cross, metalwork texture, misty atmosphere, organic ornament, stone carving, sacred geometry',
        ref: 'inspired by Book of Kells, Celtic knotwork, Irish mythology, Stonehenge, Celtic crosses, druids, Lindisfarne Gospels, Celtic metalwork, Tain Bo Cuailnge, Arthurian celtic legend',
        negative: 'modern, futuristic, neon, minimal, cartoon, anime, industrial, tropical, bright, digital'
      },
      '波斯细密画': {
        core: 'persian miniature intricate ornate garden poetry',
        detail: 'intricate persian miniature painting, ornate floral patterns, garden paradise scenes, persian poetry illustration, rich jewel colors, detailed arabesque, courtly scenes, mythical creatures, persian architecture, carpet patterns, calligraphic borders, layered perspective, gold illumination, shahnameh themes, intricate detail',
        mood: 'ornate, poetic, mystical, luxurious, intricate, serene, exotic, refined, decorative, romantic',
        color: 'turquoise, lapis blue, gold, crimson, emerald, saffron, ivory, rose, teal, deep purple',
        tech: 'miniature detail, arabesque pattern, gold illumination, layered perspective, carpet texture, calligraphic border, jewel-tone palette, ornate composition, persian ornament, intricate brushwork',
        ref: 'inspired by Persian miniatures, Shahnameh, Ferdowsi, Isfahan art, Persian carpets, Hafez poetry, Rumi, Safavid art, Tabriz school, Persian illuminated manuscripts',
        negative: 'modern, minimal, abstract, cartoon, anime, grunge, photographic, futuristic, casual, western realism'
      },
      '印度莫卧儿': {
        core: 'mughal india taj mahal ornate palace miniature',
        detail: 'mughal architecture, taj mahal domes and minarets, ornate palace interiors, indian miniature painting, rich jewel tones, floral and geometric patterns, peacock motifs, courtly scenes, marble inlay work, gardens with fountains, elephant processions, intricate textiles, mughal emperors, ornate arches, decorative symmetry',
        mood: 'opulent, regal, ornate, majestic, exotic, luxurious, serene, ceremonial, romantic, intricate',
        color: 'marble white, jewel red, emerald, gold, turquoise, saffron, deep blue, rose, ivory, peacock green',
        tech: 'marble inlay, ornate arch, miniature detail, floral pattern, geometric ornament, peacock motif, rich textile, symmetric composition, jewel-tone palette, ceremonial grandeur',
        ref: 'inspired by Taj Mahal, Mughal architecture, Akbar, Shah Jahan, Mughal miniatures, Red Fort, Fatehpur Sikri, Indian court painting, Jahangir, Mughal gardens',
        negative: 'modern, minimal, abstract, cartoon, anime, grunge, western realism, futuristic, casual, industrial'
      },
      '阿拉伯': {
        core: 'arabic geometric islamic pattern arabesque desert',
        detail: 'intricate islamic geometric patterns, arabesque ornamentation, arabic calligraphy, desert palace scenes, minarets and domes, ornate arches, geometric star patterns, lanterns and mosaics, oasis gardens, arabian nights themes, carpet patterns, intricate tilework, calligraphic art, desert dunes, ornate architecture',
        mood: 'mystical, ornate, exotic, serene, majestic, spiritual, intricate, warm, luxurious, ancient',
        color: 'desert gold, deep blue, turquoise, emerald, terracotta, ivory, sand, crimson, teal, bronze',
        tech: 'geometric pattern, arabesque design, calligraphic rendering, tilework texture, ornate arch, lantern glow, desert palette, star pattern, mosaic detail, islamic ornament',
        ref: 'inspired by Islamic art, Arabian Nights, Alhambra, arabic calligraphy, geometric islamic patterns, desert architecture, Sheikh Zayed Mosque, Moorish art, One Thousand and One Nights, Islamic tilework',
        negative: 'modern, minimal, cartoon, anime, western realism, futuristic, grunge, casual, abstract, industrial'
      },
      '蒸汽波': {
        core: 'vaporwave retro synthwave glitch neon nostalgia',
        detail: 'retro 80s aesthetic, synthwave sun grids, glitch effects, neon pastel palette, classical statue with sunglasses, retro computer graphics, VHS distortion, palm trees and grid floors, nostalgic mall aesthetic, roman busts, chrome text, pixel nostalgia, dreamy haze, retro-futuristic, lo-fi atmosphere',
        mood: 'nostalgic, dreamy, retro, surreal, melancholic, cool, hazy, ironic, synthetic, futuristic-retro',
        color: 'neon pink, cyan, purple, magenta, teal, pastel blue, hot pink, aqua, lavender, chrome',
        tech: 'glitch effect, VHS distortion, synthwave grid, neon glow, retro computer graphic, chrome rendering, pixel nostalgia, scanline texture, dreamy haze, retro-futuristic',
        ref: 'inspired by Vaporwave aesthetic, Synthwave, Outrun, Macintosh Plus, retro 80s, Miami Vice, Akira, Neon Genesis Evangelion, vaporwave art, retro-futurism',
        negative: 'realistic, natural, organic, rustic, traditional, warm earthy, vintage analog, documentary, plain, minimal'
      },
      '赛博西部': {
        core: 'cyber western futuristic cowboy neon desert',
        detail: 'futuristic cowboy aesthetic, neon-lit desert towns, cybernetic outlaws, holographic saloons, robotic horses, desert dunes with neon signs, cybernetic revolvers, futuristic duster coats, neon cactus, dusty roads with hovercraft, android sheriffs, techno-western fusion, desert tech, cyberpunk frontier, neon tumbleweeds',
        mood: 'gritty, adventurous, futuristic, rugged, lonely, edgy, cinematic, bold, nostalgic-western, neon',
        color: 'neon orange, desert sand, cyber blue, magenta, dusty brown, teal, purple, gold, black, crimson',
        tech: 'neon lighting, desert haze, cybernetic detail, holographic effect, futuristic western, dust particle, chrome metal, neon sign glow, cinematic contrast, techno-western fusion',
        ref: 'inspired by Westworld, The Mandalorian, Firefly, Cowboy Bebop, cyberpunk westerns, Trigun, Wild Wild West, Red Dead Redemption, Fallout New Vegas, Jonah Hex',
        negative: 'pure historical, traditional, pastoral, cute, anime, minimal, clean, peaceful, organic, rural idyll'
      },
      '柴油朋克': {
        core: 'dieselpunk retro-futuristic industrial brass aviation',
        detail: 'retro-futuristic 1930s-50s aesthetic, diesel machinery, brass and chrome, zeppelin airships, industrial aviation, art deco technology, riveted metal, smoky factories, retro rockets, leather aviators, mechanical gears, war-era technology, diesel engines, retro-futuristic cities, chrome and steel',
        mood: 'industrial, adventurous, gritty, retro-futuristic, bold, mechanical, nostalgic, powerful, rugged, cinematic',
        color: 'brass, chrome, steel gray, olive, leather brown, copper, black, amber, rust, khaki',
        tech: 'brass rendering, riveted metal, zeppelin detail, art deco tech, diesel machinery, industrial texture, retro rocket, smoky atmosphere, mechanical gear, chrome reflection',
        ref: 'inspired by Sky Captain, The Rocketeer, Crimson Skies, Castle in the Sky, Bioshock Infinite, dieselpunk aesthetic, 1930s sci-fi, Metropolis, Indiana Jones, retro aviation',
        negative: 'clean futuristic, neon cyberpunk, organic, pastoral, cute, minimal, digital, sleek, modern, bright'
      },
      '生物朋克': {
        core: 'biopunk organic biotechnology genetic mutation',
        detail: 'organic biotechnology, genetically engineered creatures, living architecture, bioluminescent organs, flesh and plant fusion, organic machinery, DNA manipulation themes, mutated organisms, living cities, organic technology, biomechanical hybrids, glowing biological circuits, organic armor, bioengineered landscapes, pulsating organic forms',
        mood: 'organic, unsettling, futuristic, visceral, strange, alive, dark, innovative, grotesque, bioluminescent',
        color: 'organic green, bioluminescent cyan, flesh pink, deep purple, blood red, moss, teal, bone white, amber, dark green',
        tech: 'organic texture, bioluminescence, living architecture, biomechanical fusion, genetic detail, organic machinery, pulsating glow, flesh rendering, biological circuit, mutated form',
        ref: 'inspired by Annihilation, The Last of Us, Resident Evil, Blade Runner genetic themes, GATTACA, Splice, The Thing, bio-art, H.R. Giger, The Expanse protomolecule',
        negative: 'clean mechanical, sterile, digital, neon cyberpunk, cute, minimal, pastoral, traditional, industrial, sleek'
      },
      '太阳朋克': {
        core: 'solarpunk optimistic sustainable green future',
        detail: 'optimistic sustainable future, solar panels and greenery, eco-friendly architecture, vertical gardens, renewable energy, lush green cities, community gardens, solar glass, wind turbines, harmonious nature-tech, bright hopeful atmosphere, sustainable living, green rooftops, clean energy, thriving ecosystems, utopian eco-cities',
        mood: 'optimistic, hopeful, bright, harmonious, sustainable, peaceful, green, utopian, warm, uplifting',
        color: 'bright green, solar yellow, sky blue, white, teal, fresh orange, lime, aqua, warm beige, leaf green',
        tech: 'solar panel detail, vertical garden, eco-architecture, renewable energy, lush greenery, glass and green, bright daylight, sustainable design, harmonious nature-tech, clean utopia',
        ref: 'inspired by Solarpunk movement, eco-futurism, sustainable architecture, The 100 solarpunk, utopian green cities, vertical forests, solar energy, eco-dystopia, Studio Ghibli eco themes, green architecture',
        negative: 'dark, dystopian, polluted, industrial, grimy, neon cyberpunk, bleak, toxic, crowded, oppressive'
      },
      '太空歌剧': {
        core: 'space opera epic starship galactic adventure',
        detail: 'epic galactic adventure, massive starships, alien civilizations, space battles, interstellar empires, dramatic nebulae, heroic crews, exotic planets, futuristic fleets, cosmic scale, alien diplomacy, space stations, laser battles, galactic politics, epic space vistas',
        mood: 'epic, adventurous, grand, heroic, cosmic, dramatic, vast, majestic, thrilling, awe-inspiring',
        color: 'deep space black, nebula purple, cosmic blue, star gold, crimson, teal, silver, magenta, white, orange',
        tech: 'starship detail, nebula rendering, space battle, cosmic scale, futuristic fleet, laser effect, interstellar vista, dramatic space lighting, exotic planet, epic composition',
        ref: 'inspired by Star Wars, Star Trek, Dune, Mass Effect, Foundation, Battlestar Galactica, The Expanse, Guardians of the Galaxy, Babylon 5, Warhammer 40k',
        negative: 'grounded, mundane, realistic, pastoral, small-scale, domestic, modern, contemporary, minimal, everyday'
      },
      '田园牧歌': {
        core: 'pastoral idyll countryside rustic serene nature',
        detail: 'serene countryside scenes, rolling green hills, rustic farmhouses, grazing livestock, wildflower meadows, golden wheat fields, gentle streams, peaceful villages, haystacks and barns, birds and butterflies, soft morning light, idyllic rural life, orchards and gardens, cozy cottages, tranquil pastoral landscape',
        mood: 'serene, peaceful, idyllic, nostalgic, warm, gentle, rustic, content, tranquil, wholesome',
        color: 'soft green, golden wheat, sky blue, warm brown, cream, wildflower pink, butter yellow, sage, terracotta, ivory',
        tech: 'soft daylight, rolling landscape, rustic texture, wildflower detail, golden hour, pastoral composition, gentle atmosphere, countryside rendering, idyllic scene, warm palette',
        ref: 'inspired by pastoral painting, Thomas Kinkade, English countryside, Constable landscapes, rural idyll, cottagecore, Beatrix Potter, Wind in the Willows, Little House on the Prairie, bucolic scenes',
        negative: 'urban, industrial, futuristic, neon, cyberpunk, dark, dystopian, chaotic, modern, grimy'
      },
      '都市写实': {
        core: 'urban realism city street contemporary life',
        detail: 'contemporary city streets, urban architecture, everyday city life, street scenes, commuters and pedestrians, city lights, realistic urban detail, apartment buildings, traffic and sidewalks, urban atmosphere, contemporary fashion, city parks, realistic perspective, street vendors, modern cityscape',
        mood: 'realistic, contemporary, urban, observant, grounded, everyday, bustling, quiet, authentic, modern',
        color: 'concrete gray, steel blue, muted brick, asphalt, glass blue, warm streetlight, urban brown, slate, off-white, charcoal',
        tech: 'realistic perspective, urban detail, street lighting, contemporary rendering, city atmosphere, architectural detail, natural observation, urban palette, documentary realism, modern cityscape',
        ref: 'inspired by Edward Hopper, urban photography, street photography, modern city life, Hopper paintings, city realism, contemporary urban art, NYC streets, Tokyo streets, everyday urban scenes',
        negative: 'fantasy, surreal, futuristic, historical, pastoral, cartoon, anime, neon, gothic, idealized'
      },
      '铅笔画': {
        core: 'pencil drawing graphite sketch hand-drawn',
        detail: 'graphite pencil drawing, hand-drawn sketch, fine line work, shading and hatching, grayscale rendering, textured paper, detailed pencil strokes, cross-hatching, soft graphite gradients, sketchbook aesthetic, precise line art, tonal shading, hand-rendered texture, monochrome drawing, artistic pencil marks',
        mood: 'artistic, precise, handcrafted, monochrome, delicate, observational, sketchy, classic, textured, intimate',
        color: 'graphite gray, charcoal black, paper white, soft gray, mid-tone gray, silver, off-white, deep gray, light gray, warm paper',
        tech: 'graphite shading, hatching, cross-hatching, line work, tonal gradient, paper texture, sketch rendering, hand-drawn marks, monochrome, precise strokes',
        ref: 'inspired by classical pencil drawings, Leonardo sketches, Albrecht Durer, sketchbook art, graphite portraiture, architectural sketches, hand-drawn illustration, pencil realism, figure drawing, fine art drawing',
        negative: 'colorful, digital, neon, 3D render, photographic, painterly, abstract, cartoon, anime, glossy'
      },
      '炭笔画': {
        core: 'charcoal drawing dramatic smudge expressive dark',
        detail: 'dramatic charcoal drawing, expressive smudging, deep black tones, soft gray gradients, textured paper, bold strokes, atmospheric shading, chiaroscuro charcoal, smudged edges, dramatic contrast, expressive marks, dark moody rendering, hand-drawn texture, tonal depth, gritty charcoal texture',
        mood: 'dramatic, moody, expressive, dark, atmospheric, raw, intense, artistic, gritty, emotional',
        color: 'charcoal black, deep gray, ash gray, white, silver, smoke, graphite, dark slate, soft gray, paper white',
        tech: 'charcoal smudge, dramatic contrast, expressive stroke, tonal depth, atmospheric shading, textured rendering, chiaroscuro, gritty texture, bold marks, dark mood',
        ref: 'inspired by charcoal portraiture, dramatic charcoal art, Kathe Kollwitz, charcoal figure drawing, expressive charcoal, chiaroscuro drawing, dark sketch art, charcoal realism, atmospheric drawing, fine art charcoal',
        negative: 'colorful, bright, digital, neon, clean, cartoon, anime, glossy, photographic, pastel'
      },
      '版画': {
        core: 'printmaking woodcut linocut etching relief',
        detail: 'woodcut printmaking, linocut relief, etching lines, bold carved lines, ink texture, printmaking grain, high contrast, hand-pressed texture, relief printing, carved wood grain, ink roller texture, traditional print, bold graphic lines, paper grain, print edition aesthetic',
        mood: 'graphic, bold, traditional, handcrafted, textured, vintage, artistic, striking, classic, raw',
        color: 'ink black, paper white, print red, ochre, deep blue, sepia, cream, rust, forest green, brown',
        tech: 'woodcut carving, relief printing, bold line, ink texture, high contrast, print grain, etching detail, hand-pressed, graphic composition, traditional printmaking',
        ref: 'inspired by Hokusai woodcuts, Albrecht Durer prints, ukiyo-e prints, linocut art, etching, relief printmaking, German expressionist woodcut, Kathe Kollwitz prints, traditional print, vintage posters',
        negative: 'photographic, digital, smooth, glossy, 3D render, neon, colorful gradient, painterly, anime, cartoon'
      },
      '海报艺术': {
        core: 'poster art graphic bold typography advertising',
        detail: 'bold graphic poster design, striking typography, advertising composition, bold color blocks, vintage poster style, graphic shapes, strong visual hierarchy, poster illustration, retro advertising, bold lettering, dramatic composition, print advertising, graphic design, poster layout, bold silhouettes',
        mood: 'bold, graphic, striking, retro, dynamic, confident, eye-catching, stylish, vintage, energetic',
        color: 'bold red, cream, navy, mustard, teal, black, white, orange, retro green, gold',
        tech: 'bold typography, graphic composition, color blocking, poster layout, vintage print, strong hierarchy, bold silhouette, retro advertising, graphic shapes, print texture',
        ref: 'inspired by vintage posters, Art Nouveau posters, Toulouse-Lautrec, Swiss design, retro advertising, propaganda posters, Saul Bass, movie posters, graphic design, mid-century posters',
        negative: 'photographic, realistic, subtle, muted, minimal, digital 3D, anime, painterly, soft, naturalistic'
      },
      '涂鸦艺术': {
        core: 'graffiti street tags spray paint urban art',
        detail: 'graffiti lettering, spray paint texture, urban tags, bold wildstyle letters, spray can effects, vibrant colors, street art bombing, drips and overspray, urban walls, graffiti characters, layered paint, bold outlines, hip-hop culture, subway art, spray paint gradients',
        mood: 'urban, rebellious, bold, vibrant, edgy, energetic, raw, expressive, streetwise, dynamic',
        color: 'spray pink, electric blue, neon green, orange, purple, black, white, yellow, red, silver',
        tech: 'spray paint texture, wildstyle lettering, drip effect, overspray, bold outline, urban wall, layered paint, graffiti character, vibrant color, street art',
        ref: 'inspired by graffiti art, street art, Banksy, Jean-Michel Basquiat, Keith Haring, wildstyle graffiti, hip-hop culture, NYC subway art, urban tagging, spray can art',
        negative: 'clean, corporate, minimal, refined, elegant, pastoral, traditional, realistic, neat, formal'
      },
      '街头艺术': {
        core: 'street art mural urban public art stencil',
        detail: 'large-scale murals, stencil art, urban public art, wheatpaste posters, street installations, social commentary, urban walls, paste-ups, chalk art, street murals, public spaces, urban creativity, stencil cutouts, spray and brush mix, community art',
        mood: 'urban, creative, expressive, social, bold, vibrant, accessible, edgy, thoughtful, dynamic',
        color: 'mural bright, urban gray, stencil black, white, vibrant red, blue, yellow, teal, orange, concrete',
        tech: 'mural scale, stencil technique, wheatpaste texture, urban wall, public art, bold composition, social imagery, street texture, mixed media, accessible art',
        ref: 'inspired by Banksy, street art movement, muralism, Diego Rivera murals, Shepard Fairey, stencil art, urban public art, Obey, street murals, community murals',
        negative: 'private, corporate, clean, minimal, refined, pastoral, traditional, formal, neat, gallery-only'
      },
      '波西米亚': {
        core: 'bohemian boho eclectic free-spirited artistic',
        detail: 'eclectic bohemian style, free-spirited artistic atmosphere, layered textiles, macrame and tassels, earthy tones with pops of color, vintage furniture, plants and candles, artistic clutter, ethnic patterns, dreamcatchers, cozy artistic interiors, flowing fabrics, artisan crafts, boho chic, warm inviting spaces',
        mood: 'free-spirited, eclectic, cozy, artistic, warm, relaxed, bohemian, creative, inviting, earthy',
        color: 'earthy terracotta, mustard, teal, rust, cream, sage, burnt orange, plum, olive, warm brown',
        tech: 'layered texture, ethnic pattern, macrame detail, warm lighting, eclectic composition, artisan craft, boho palette, cozy atmosphere, vintage texture, free-spirited design',
        ref: 'inspired by bohemian style, boho chic, free-spirited art, artistic interiors, hippie aesthetic, ethnic textiles, artisan lifestyle, vintage eclectic, cozy boho, creative studio',
        negative: 'minimal, corporate, sterile, modern sleek, industrial, formal, neat, cold, futuristic, rigid'
      },
      '复古未来主义': {
        core: 'retro-futurism vintage future atomic age optimism',
        detail: 'vintage vision of the future, atomic age optimism, retro space age, chrome and pastel, flying cars, retro robots, 1950s-60s futurism, space exploration dreams, retro gadgets, optimistic tomorrow, vintage sci-fi, streamlined design, pastel future cities, retro rockets, atomic motifs',
        mood: 'nostalgic, optimistic, retro, whimsical, futuristic, playful, vintage, dreamy, hopeful, charming',
        color: 'chrome, pastel pink, mint green, baby blue, cream, retro orange, teal, gold, silver, atomic red',
        tech: 'retro space age, chrome rendering, atomic motif, pastel future, vintage sci-fi, streamlined design, retro robot, flying car, optimistic future, retro gadget',
        ref: 'inspired by 1950s-60s futurism, The Jetsons, retro sci-fi, atomic age, Tomorrowland, Fallout retro-future, vintage space, Googie architecture, 2001 retro, Disney future',
        negative: 'dark, gritty, cyberpunk, dystopian, realistic, modern, industrial, grimy, bleak, contemporary'
      },
      '极简几何': {
        core: 'minimal geometric abstract shapes clean',
        detail: 'minimal geometric composition, clean abstract shapes, basic geometric forms, balanced negative space, simple color blocks, precise lines, abstract minimalism, geometric patterns, clean design, reductive composition, bold simple shapes, monochrome or limited palette, orderly arrangement, modern minimal, pure geometry',
        mood: 'minimal, clean, calm, modern, orderly, precise, serene, abstract, balanced, sophisticated',
        color: 'white, black, primary red, blue, yellow, gray, beige, muted tones, monochrome, pastel accent',
        tech: 'geometric shape, negative space, clean line, color blocking, minimal composition, precise geometry, reductive design, balanced layout, abstract form, modern minimal',
        ref: 'inspired by Bauhaus, De Stijl, Piet Mondrian, minimalism, geometric abstraction, Kazimir Malevich, Swiss design, abstract geometry, Donald Judd, clean modern art',
        negative: 'ornate, detailed, realistic, organic, cluttered, baroque, rococo, painterly, textured, chaotic'
      },
      '手绘插画': {
        core: 'hand-drawn illustration sketch ink watercolor charming',
        detail: 'hand-drawn illustration, charming sketch style, ink line work, watercolor washes, whimsical characters, storybook illustration, textured paper, loose expressive lines, soft watercolor, handcrafted charm, childrens book style, organic line art, warm illustration, playful detail, artistic hand-rendering',
        mood: 'charming, whimsical, warm, playful, artistic, cozy, handcrafted, expressive, delightful, storybook',
        color: 'watercolor pastel, warm ink, soft green, peach, sky blue, cream, coral, lavender, soft yellow, brown',
        tech: 'ink line work, watercolor wash, hand-rendered texture, loose stroke, storybook style, organic line, paper texture, charming illustration, expressive sketch, handcrafted detail',
        ref: 'inspired by storybook illustration, childrens book art, watercolor illustration, hand-drawn art, Beatrix Potter, Quentin Blake, ink illustration, charming sketches, editorial illustration, picture book art',
        negative: 'photographic, 3D render, digital clean, neon, realistic, corporate, minimal geometric, glossy, anime, abstract'
      },
      '赛博水墨': {
        core: 'cyber ink wash style, futuristic chinese ink painting fusion',
        detail: 'neon-tinted ink brushstrokes, digital calligraphy, holographic mist, cybernetic mountains, glowing data streams as ink rivers, circuit-board bamboo, LED pagodas, pixelated ink splashes, electric vermillion seals, futuristic zen',
        mood: 'tranquil yet futuristic, paradoxical, meditative, neon serenity',
        color: 'ink black, neon cyan, electric magenta, jade green, glowing white, deep indigo, holographic silver',
        tech: 'ink diffusion with neon glow, emissive brushstrokes, holographic overlay, volumetric digital fog, chromatic accent, paper grain with circuit texture',
        ref: 'inspired by cyberpunk aesthetics, chinese ink painting, digital zen art, Ghost in the Shell',
        negative: 'pure traditional, historical accuracy, rustic, organic, western painting, photorealistic, plain'
      },
      '敦煌飞天': {
        core: 'dunhuang mural style, flying apsaras, buddhist celestial art',
        detail: 'flowing ribbons, flying celestial maidens, lotus motifs, buddhist iconography, cave mural texture, haloed deities, musical instruments, swirling clouds, earthy mineral pigments, silk scarves in motion, ancient fresco patina',
        mood: 'sacred, ethereal, graceful, ancient, spiritual, serene',
        color: 'earthy ochre, mineral green, cinnabar red, lapis blue, gold, cream, umber, teal',
        tech: 'fresco texture, pigment layering, flat decorative composition, gold leaf accents, aged patina, mural crackle',
        ref: 'inspired by Dunhuang Mogao Caves, Silk Road murals, Buddhist art, flying apsaras',
        negative: 'modern, photorealistic, neon, cyberpunk, minimal, abstract, western realism'
      },
      '洛可可宫廷': {
        core: 'rococo court style, ornate aristocratic elegance',
        detail: 'gilded ballrooms, powdered wigs, silk gowns, pastel interiors, cherubs, ornate mirrors, chandeliers, courtly dances, porcelain, decorative scrollwork, aristocratic leisure',
        mood: 'elegant, playful, luxurious, whimsical, refined',
        color: 'powder pink, powder blue, cream, gold, mint, lavender, ivory, rose',
        tech: 'gilded ornament, delicate brushwork, pastel rendering, ornate scrollwork, silk texture, soft airy light',
        ref: 'inspired by Fragonard, Boucher, Versailles court, Marie Antoinette',
        negative: 'dark gothic, brutalist, minimal, industrial, neon, modern abstract, grunge'
      },
      '浮世绘武士': {
        core: 'ukiyo-e samurai woodblock style, japanese warrior print',
        detail: 'bold outlines, flat color, samurai in battle, kabuki drama, dramatic poses, wave motifs, cherry blossoms, woodblock texture, stylized armor, dramatic composition, calligraphic lines',
        mood: 'dramatic, heroic, dynamic, elegant, intense',
        color: 'indigo, vermillion, ochre, sumi black, pine green, pale pink, beige',
        tech: 'woodblock texture, flat shading, bold lineart, limited palette, decorative borders, calligraphic strokes',
        ref: 'inspired by Kuniyoshi, Yoshitoshi, Hokusai, ukiyo-e warrior prints',
        negative: 'photorealism, 3D, western perspective, heavy shadows, gradients, neon, glossy'
      },
      '剪纸拼贴': {
        core: 'paper cut collage style, layered craft aesthetic',
        detail: 'layered paper, cutout shapes, overlapping silhouettes, torn edges, collage composition, textured paper, depth through layers, handmade craft, mixed paper, shadow depth',
        mood: 'whimsical, artisanal, playful, handcrafted, charming',
        color: 'kraft brown, cream, pastel, mustard, forest green, coral, burgundy, charcoal',
        tech: 'layered depth, drop shadow, paper texture, flat fill, collage layering, torn edges, bevel edge',
        ref: 'inspired by papercut art, collage illustration, Eric Carle, shadow box art',
        negative: 'photorealism, smooth gradients, 3D, metallic, glass, digital glow, soft blur'
      },
      '水彩晕染': {
        core: 'watercolor bloom style, soft bleeding washes',
        detail: 'wet-on-wet blooms, pigment bleeding, soft edges, translucent washes, granulation, splatter, cold press texture, dreamy diffusion, layered glazes',
        mood: 'delicate, dreamy, ethereal, gentle, romantic',
        color: 'pastel pink, sky blue, lavender, sage, soft peach, translucent, luminous white',
        tech: 'water bloom edges, granulation, paper grain, soft diffusion, wash gradient, splatter',
        ref: 'inspired by botanical watercolor, contemporary watercolor, Beatrix Potter',
        negative: 'dark, heavy, impasto, digital, sharp lines, saturated, 3D, metallic'
      },
      '蜡笔涂鸦': {
        core: 'crayon doodle style, childlike colorful scribble',
        detail: 'waxy crayon texture, bold scribbles, hand-drawn doodles, rough edges, layered strokes, bright colors, playful marks, paper texture, naive art, spontaneous drawing',
        mood: 'playful, joyful, innocent, whimsical, nostalgic',
        color: 'bright primaries, crayon red, yellow, blue, green, orange, purple, cream paper',
        tech: 'waxy texture, rough stroke, layered crayon, paper grain, naive composition, hand-drawn marks',
        ref: 'inspired by childrens art, naive painting, crayon illustration, doodle art',
        negative: 'photorealistic, digital clean, 3D, neon, glossy, corporate, minimal'
      },
      '素描速写': {
        core: 'sketch style, quick hand-drawn line drawing',
        detail: 'loose pencil lines, gestural strokes, quick sketches, minimal shading, contour drawing, sketchbook feel, unfinished edges, expressive marks, hatching',
        mood: 'spontaneous, artistic, observational, energetic, raw',
        color: 'graphite gray, charcoal, paper white, soft gray, sepia',
        tech: 'loose line work, gestural strokes, hatching, sketch rendering, paper texture, hand-drawn',
        ref: 'inspired by figure sketching, architectural sketches, Leonardo studies, sketchbook art',
        negative: 'colorful, digital, neon, 3D, photorealistic, painterly, glossy, cartoon'
      },
      '版画拓印': {
        core: 'print rubbing style, relief texture transfer',
        detail: 'rubbing texture, embossed relief, ink transfer, textured surface, paper grain, raised patterns, monochrome, hand-pressed, tactile surface, stone or wood texture',
        mood: 'textured, traditional, handcrafted, graphic, vintage',
        color: 'ink black, paper white, charcoal, sepia, ochre, deep blue',
        tech: 'rubbing texture, relief embossing, ink transfer, paper grain, high contrast, hand-pressed',
        ref: 'inspired by frottage, stone rubbing, relief printing, traditional rubbing art',
        negative: 'photographic, digital, smooth, glossy, 3D, neon, colorful gradient, painterly'
      },
      '玻璃彩绘': {
        core: 'stained glass style, colorful leaded glass panels',
        detail: 'colored glass segments, lead lines, light transmission, jewel tones, geometric panels, gothic windows, glowing colors, mosaic glass, intricate frames, backlit radiance',
        mood: 'sacred, luminous, majestic, colorful, spiritual',
        color: 'jewel tones, ruby red, sapphire blue, emerald, amber, violet, gold, deep blue',
        tech: 'lead line rendering, glass segmentation, light glow, backlit effect, jewel-tone palette, geometric panels',
        ref: 'inspired by gothic cathedrals, Tiffany stained glass, Chartres windows',
        negative: 'photorealistic, soft, muted, minimal, digital, painterly, 3D, flat'
      },
      '马赛克镶嵌': {
        core: 'mosaic style, tessellated tile art',
        detail: 'small tesserae tiles, geometric patterns, tile grout, fragmented color, byzantine mosaic, decorative patterns, textured surface, tile arrangement, shimmering pieces',
        mood: 'decorative, ancient, intricate, ornate, majestic',
        color: 'gold, deep blue, red, emerald, turquoise, ivory, bronze, lapis',
        tech: 'tile segmentation, grout lines, tesserae texture, geometric pattern, mosaic rendering, shimmer',
        ref: 'inspired by roman and byzantine mosaics, Ravenna, tile art',
        negative: 'photorealistic, smooth, minimal, digital, painterly, soft, neon, abstract'
      },
      '像素复古': {
        core: 'retro pixel style, classic 8-bit game aesthetic',
        detail: 'chunky pixels, limited palette, dithering, sprite art, scanlines, retro game graphics, blocky shapes, CRT glow, nostalgic game scenes',
        mood: 'nostalgic, playful, retro, game-like, charming',
        color: 'CRT palette, vibrant primaries, phosphor glow, retro dithering, limited 16-64 colors',
        tech: 'nearest-neighbor, pixel-perfect, scanline overlay, dithering, sprite sheet, CRT effect',
        ref: 'inspired by NES games, arcade classics, retro gaming, pixel art',
        negative: 'smooth, anti-aliased, photorealistic, 3D, gradients, blur, HDR'
      },
      '超现实梦境': {
        core: 'surreal dream style, dreamlike impossible imagery',
        detail: 'melting forms, floating objects, impossible spaces, dream logic, distorted scale, levitating elements, metamorphic imagery, subconscious scenes, paradoxical landscapes',
        mood: 'dreamlike, uncanny, mysterious, introspective, haunting',
        color: 'deep blue, crimson, gold, stark white, shadow black, muted sepia, twilight purple',
        tech: 'scale distortion, seamless compositing, double exposure, atmospheric perspective, surreal juxtaposition',
        ref: 'inspired by Dali, Magritte, dream imagery, surrealist art',
        negative: 'ordinary realism, mundane scenes, logical composition, normal proportions, conventional perspective'
      },
      '波普漫画': {
        core: 'pop comic style, bold comic book graphics',
        detail: 'halftone dots, thick outlines, comic panels, speech bubbles, bold flat colors, action lines, dramatic shading, comic lettering, dynamic composition',
        mood: 'bold, energetic, playful, dramatic, vibrant',
        color: 'primary red, yellow, cyan, magenta, black, white, halftone dots',
        tech: 'halftone overlay, bold outlines, flat color blocks, comic panel layout, action lines, screen tones',
        ref: 'inspired by comic books, Lichtenstein, superhero comics, manga',
        negative: 'photorealistic, soft, subtle, muted, painterly, 3D, atmospheric'
      },
      '国画工笔': {
        core: 'gongbi style, meticulous chinese fine brush painting',
        detail: 'fine precise lines, detailed brushwork, intricate patterns, delicate colors, traditional subjects, birds and flowers, silk texture, layered painting, refined detail',
        mood: 'refined, elegant, meticulous, classical, serene',
        color: 'vermillion, jade green, gold, ink black, celadon, ivory, imperial yellow',
        tech: 'fine linework, layered washes, silk texture, precise detail, traditional palette, delicate brush',
        ref: 'inspired by Song dynasty gongbi, traditional chinese fine painting',
        negative: 'photorealistic, 3D, digital, neon, western, oil, abstract, rough'
      },
      '白描': {
        core: 'baimiao style, pure chinese ink line drawing',
        detail: 'pure outline drawing, no shading, flowing ink lines, elegant contours, traditional subjects, calligraphic strokes, negative space, ink linework',
        mood: 'elegant, minimal, classical, refined, poetic',
        color: 'ink black, paper white, subtle grey, vermillion seal',
        tech: 'pure linework, calligraphic strokes, contour drawing, negative space, ink rendering',
        ref: 'inspired by traditional chinese baimiao, line drawing masters',
        negative: 'colorful, photorealistic, 3D, digital, heavy shading, neon, abstract'
      },
      '青花瓷': {
        core: 'blue and white porcelain style, chinese ceramic art',
        detail: 'cobalt blue on white, porcelain glaze, floral patterns, traditional motifs, dragon and phoenix, blue wash gradients, ceramic texture, elegant patterns, chinese ornament',
        mood: 'elegant, classical, refined, timeless, serene',
        color: 'cobalt blue, porcelain white, deep blue wash, celadon accent, ink blue',
        tech: 'cobalt rendering, porcelain glaze, blue wash gradient, ceramic texture, traditional pattern',
        ref: 'inspired by Ming and Qing blue-white porcelain, chinese ceramics',
        negative: 'photorealistic, neon, digital, modern, western, abstract, grunge'
      },
      '唐三彩': {
        core: 'tang sancai style, three-color glazed pottery',
        detail: 'glazed ceramic, green amber and white glazes, tang dynasty figures, horses and camels, flowing glaze drips, earthy pottery, traditional motifs, ceramic texture',
        mood: 'ancient, earthy, ceremonial, majestic, traditional',
        color: 'glaze green, amber yellow, cream white, terracotta, brown, ochre',
        tech: 'glaze rendering, flowing glaze drips, ceramic texture, earthy palette, traditional figure',
        ref: 'inspired by Tang dynasty sancai pottery, chinese ceramics',
        negative: 'modern, neon, digital, photorealistic, minimal, abstract, western'
      },
      '漆器': {
        core: 'lacquerware style, glossy oriental lacquer art',
        detail: 'glossy lacquer surface, deep red and black, inlaid mother-of-pearl, gold leaf, intricate patterns, polished shine, traditional craft, layered lacquer, elegant ornament',
        mood: 'luxurious, elegant, glossy, refined, traditional',
        color: 'lacquer red, deep black, gold, mother-of-pearl, vermillion, dark brown',
        tech: 'glossy lacquer, inlay rendering, gold leaf, polished shine, intricate pattern, high gloss',
        ref: 'inspired by chinese and japanese lacquerware, oriental craft',
        negative: 'matte, rough, digital, neon, minimal, photorealistic, modern, abstract'
      },
      '景泰蓝': {
        core: 'cloisonne style, enamel inlay metalwork',
        detail: 'enamel inlay, metal wire outlines, jewel colors, intricate patterns, polished surface, traditional craft, gold filigree, decorative panels, ornate design',
        mood: 'ornate, luxurious, intricate, traditional, majestic',
        color: 'enamel blue, turquoise, red, gold, green, white, deep purple',
        tech: 'enamel rendering, metal wire lines, gold filigree, polished surface, intricate pattern',
        ref: 'inspired by cloisonne enamel, chinese metalwork craft',
        negative: 'matte, minimal, digital, neon, photorealistic, modern, abstract, rough'
      },
      '苗族银饰': {
        core: 'miao silver jewelry style, intricate silver ornament',
        detail: 'intricate silver jewelry, silver headdresses, layered necklaces, traditional patterns, hammered silver, ethnic ornament, silver filigree, ceremonial adornment',
        mood: 'ceremonial, ornate, ethnic, radiant, traditional',
        color: 'polished silver, white metal, dark cloth, red accent, indigo, gold accent',
        tech: 'silver rendering, filigree detail, hammered texture, layered jewelry, high polish',
        ref: 'inspired by Miao ethnic silverwork, chinese minority craft',
        negative: 'modern, minimal, digital, neon, photorealistic, western, abstract'
      },
      '藏族唐卡': {
        core: 'tibetan thangka style, sacred buddhist scroll painting',
        detail: 'intricate buddhist iconography, mandalas, gold linework, deity figures, rich mineral colors, silk scroll, sacred geometry, detailed ornament, haloed figures',
        mood: 'sacred, spiritual, intricate, majestic, reverent',
        color: 'gold, deep blue, cinnabar red, turquoise, mineral green, ivory, lapis',
        tech: 'gold linework, mineral pigment, mandala geometry, intricate detail, sacred composition',
        ref: 'inspired by tibetan thangka, buddhist art, mandala painting',
        negative: 'modern, minimal, photorealistic, neon, western, abstract, grunge'
      },
      '和服纹样': {
        core: 'japanese kimono pattern style, traditional textile motifs',
        detail: 'traditional japanese patterns, kimono fabric, floral motifs, wave patterns, geometric designs, silk texture, seasonal motifs, elegant ornament, textile repeat',
        mood: 'elegant, refined, traditional, serene, graceful',
        color: 'indigo, vermillion, gold, cream, sakura pink, pine green, black',
        tech: 'textile pattern, silk texture, motif repeat, flat decorative, traditional palette',
        ref: 'inspired by japanese kimono, yuzen dyeing, traditional textile',
        negative: 'photorealistic, 3D, neon, western, modern, minimal, abstract'
      },
      '伊斯兰几何': {
        core: 'islamic geometric style, intricate geometric ornament',
        detail: 'intricate geometric patterns, star motifs, tessellation, arabesque, repeating patterns, symmetrical design, tilework, mathematical precision, ornate borders',
        mood: 'intricate, spiritual, ornate, serene, majestic',
        color: 'deep blue, turquoise, gold, emerald, white, terracotta, teal',
        tech: 'geometric tessellation, star pattern, arabesque, tilework, symmetrical rendering, precision',
        ref: 'inspired by islamic geometric art, Alhambra, mosque tilework',
        negative: 'modern, minimal, photorealistic, neon, western, abstract, casual'
      },
      '非洲部落': {
        core: 'african tribal style, bold ethnic patterns',
        detail: 'bold tribal patterns, geometric motifs, earth pigments, masks and figures, mudcloth texture, beadwork, ceremonial art, animal motifs, vibrant patterns',
        mood: 'bold, earthy, ceremonial, vibrant, primal',
        color: 'earth red, ochre, black, white, terracotta, mud brown, warm yellow',
        tech: 'tribal pattern, mudcloth texture, geometric motif, earth pigment, bold composition',
        ref: 'inspired by african tribal art, mudcloth, traditional masks',
        negative: 'modern, minimal, digital, neon, photorealistic, western, pastel'
      },
      '玛雅文明': {
        core: 'maya civilization style, ancient mesoamerican art',
        detail: 'maya glyphs, step pyramids, jade ornaments, ceremonial art, stone carvings, calendar motifs, feathered serpents, temple architecture, ancient relief',
        mood: 'ancient, majestic, mysterious, ceremonial, powerful',
        color: 'jade green, terracotta, stone gray, gold, blood red, obsidian black, cream',
        tech: 'glyph rendering, stone carving, relief texture, step pyramid, ceremonial detail',
        ref: 'inspired by maya civilization, Chichen Itza, mesoamerican art',
        negative: 'modern, minimal, neon, digital, photorealistic, western, abstract'
      },
      '印加黄金': {
        core: 'inca gold style, ancient andean golden art',
        detail: 'gold ornaments, inca patterns, sun motifs, ceremonial gold, stone masonry, andean textiles, llama motifs, temple ruins, geometric goldwork',
        mood: 'ancient, majestic, golden, ceremonial, powerful',
        color: 'gold, bronze, terracotta, stone gray, deep red, ochre, cream',
        tech: 'gold rendering, inca pattern, sun motif, stone masonry, ceremonial detail',
        ref: 'inspired by inca empire, Machu Picchu, andean goldwork',
        negative: 'modern, minimal, neon, digital, photorealistic, western, abstract'
      },
      '埃及壁画': {
        core: 'egyptian mural style, ancient tomb wall painting',
        detail: 'profile figures, hieroglyphs, flat composition, ceremonial scenes, wall painting, gods and pharaohs, papyrus texture, symbolic imagery, ancient palette',
        mood: 'ancient, ceremonial, majestic, mysterious, sacred',
        color: 'gold, lapis blue, turquoise, terracotta, black, ivory, ochre, red',
        tech: 'wall painting, profile composition, hieroglyph, flat relief, papyrus texture, symbolic iconography',
        ref: 'inspired by egyptian tomb paintings, Book of the Dead, temple murals',
        negative: 'modern, abstract, cartoon, anime, impressionist, minimal, futuristic'
      },
      '希腊陶瓶': {
        core: 'greek pottery style, black-figure vase painting',
        detail: 'black-figure pottery, red-figure technique, greek vase painting, mythological scenes, amphora shape, terracotta, decorative bands, heroic figures, greek ornament',
        mood: 'classical, heroic, ancient, elegant, dignified',
        color: 'terracotta, black, deep red, ivory, gold, olive',
        tech: 'black-figure rendering, red-figure technique, vase painting, terracotta texture, decorative band',
        ref: 'inspired by greek vase painting, black-figure pottery, amphora art',
        negative: 'modern, abstract, cartoon, gothic, neon, futuristic, minimal, impressionist'
      },
      '罗马马赛克': {
        core: 'roman mosaic style, ancient roman tile art',
        detail: 'small tesserae, geometric patterns, roman scenes, floor mosaics, intricate borders, mythological imagery, tile texture, decorative panels, ancient craft',
        mood: 'ancient, ornate, majestic, decorative, classical',
        color: 'terracotta, black, white, gold, deep red, olive, stone gray',
        tech: 'tile segmentation, grout lines, geometric pattern, roman scene, tesserae texture',
        ref: 'inspired by roman mosaics, Pompeii, ancient tile art',
        negative: 'modern, minimal, neon, digital, photorealistic, abstract, pastel'
      },
      '哥特彩窗': {
        core: 'gothic stained glass style, medieval cathedral windows',
        detail: 'tall arched windows, jewel-toned glass, biblical scenes, lead lines, rose windows, gothic tracery, glowing color, medieval art, intricate frames',
        mood: 'sacred, majestic, luminous, medieval, spiritual',
        color: 'ruby red, sapphire blue, emerald, gold, violet, deep blue, amber',
        tech: 'lead line, rose window, gothic tracery, glass glow, jewel-tone palette, arched composition',
        ref: 'inspired by gothic cathedrals, Notre Dame, medieval stained glass',
        negative: 'photorealistic, soft, muted, minimal, digital, painterly, 3D'
      },
      '巴洛克穹顶': {
        core: 'baroque dome style, grand painted ceiling',
        detail: 'grand painted domes, dramatic ceiling frescoes, celestial scenes, gilded frames, architectural illusion, dramatic perspective, ornate decoration, divine imagery',
        mood: 'grandiose, dramatic, divine, opulent, majestic',
        color: 'gold, deep blue, ivory, crimson, emerald, warm ochre, shadow',
        tech: 'ceiling fresco, architectural illusion, dramatic perspective, gilded frame, ornate decoration',
        ref: 'inspired by baroque ceilings, Sistine Chapel, Italian baroque',
        negative: 'minimalism, flat colors, clean lines, modern, simple composition, matte'
      },
      '洛可可贝壳': {
        core: 'rococo shell style, shell-shaped ornament',
        detail: 'shell motifs, rocaille ornament, scrollwork, gilded decoration, asymmetric curves, pastel palette, delicate carving, ornate frames, decorative flourish',
        mood: 'ornate, delicate, playful, elegant, whimsical',
        color: 'pastel pink, cream, gold, powder blue, mint, ivory, rose',
        tech: 'rocaille motif, shell carving, gilded ornament, scrollwork, asymmetric composition',
        ref: 'inspired by rococo ornament, rocaille, french decorative art',
        negative: 'dark gothic, brutalist, minimal, industrial, neon, modern abstract'
      },
      '维多利亚蕾丝': {
        core: 'victorian lace style, delicate lacework ornament',
        detail: 'intricate lace patterns, doilies, victorian fashion, delicate fabric, floral lace, ornate borders, crochet texture, vintage elegance, patterned textiles',
        mood: 'delicate, elegant, vintage, refined, romantic',
        color: 'cream, ivory, white, soft rose, dusty blue, muted gold',
        tech: 'lace pattern, crochet texture, delicate linework, ornate border, vintage rendering',
        ref: 'inspired by victorian lace, doilies, vintage textiles',
        negative: 'modern, minimal, neon, digital, photorealistic, grunge, abstract'
      },
      '孟菲斯': {
        core: 'memphis style, bold 80s postmodern design',
        detail: 'bold geometric shapes, squiggles, bright colors, playful patterns, 80s design, kitsch, abstract shapes, bold borders, postmodern, funky patterns',
        mood: 'playful, bold, retro, vibrant, whimsical',
        color: 'bright primaries, pastel, black, bold red, blue, yellow, pink, teal',
        tech: 'geometric shapes, squiggle motif, bold pattern, flat color, retro design, kitsch',
        ref: 'inspired by Memphis Group, Ettore Sottsass, 80s design',
        negative: 'minimal, muted, photorealistic, elegant, corporate, subtle, classical'
      },
      '欧普艺术': {
        core: 'op art style, optical illusion geometric',
        detail: 'optical illusions, repeating patterns, black and white contrast, moire effects, vibrating lines, geometric abstraction, perceptual art, kinetic illusion',
        mood: 'mesmerizing, dynamic, hypnotic, bold, modern',
        color: 'black, white, bold primaries, high contrast, red, blue, yellow',
        tech: 'optical illusion, repeating pattern, moire effect, high contrast, geometric precision, vibration',
        ref: 'inspired by Bridget Riley, Victor Vasarely, op art movement',
        negative: 'photorealistic, soft, muted, organic, painterly, pastel, realistic'
      },
      '色域绘画': {
        core: 'color field style, large abstract color areas',
        detail: 'large flat color fields, expansive color, minimal composition, subtle gradients, meditative color, abstract emotion, edge-to-edge color, atmospheric',
        mood: 'meditative, serene, emotional, expansive, contemplative',
        color: 'deep saturated fields, single dominant color, layered tones, subtle hue shifts',
        tech: 'flat color field, large scale, subtle gradient, edge-to-edge, minimal composition',
        ref: 'inspired by Mark Rothko, Barnett Newman, color field painting',
        negative: 'representational, figurative, detailed, cluttered, realistic, decorative'
      },
      '硬边绘画': {
        core: 'hard edge painting style, crisp geometric abstraction',
        detail: 'crisp clean edges, geometric shapes, flat color, sharp boundaries, abstract composition, bold color blocks, precise lines, modernist abstraction',
        mood: 'clean, bold, modern, precise, confident',
        color: 'bold primaries, flat colors, high contrast, geometric palette, clean tones',
        tech: 'crisp edges, geometric shape, flat color, precise line, abstract composition',
        ref: 'inspired by hard edge painting, Ellsworth Kelly, geometric abstraction',
        negative: 'soft, painterly, organic, textured, realistic, gradient-heavy, messy'
      },
      '照相写实': {
        core: 'photorealism style, hyper-detailed painting from photo',
        detail: 'extreme detail, photographic accuracy, glossy reflections, precise rendering, realistic textures, sharp focus, meticulous brushwork, lifelike reproduction',
        mood: 'precise, impressive, realistic, meticulous, awe-inspiring',
        color: 'accurate natural color, photographic palette, realistic tones, true-to-life',
        tech: 'photographic detail, precise rendering, glossy reflection, sharp focus, meticulous brushwork',
        ref: 'inspired by Chuck Close, photorealism movement, hyperrealist painting',
        negative: 'stylized, cartoon, abstract, painterly loose, impressionist, minimal'
      },
      '古典写实': {
        core: 'classical realism style, academic realistic painting',
        detail: 'academic realism, classical technique, refined brushwork, naturalistic figures, chiaroscuro, traditional subjects, studio painting, polished finish',
        mood: 'classical, refined, dignified, timeless, serene',
        color: 'warm earth tones, deep reds, rich browns, ivory, muted gold, olive',
        tech: 'academic technique, refined brushwork, chiaroscuro, glazing, naturalistic rendering',
        ref: 'inspired by classical realism, academic painting, old masters',
        negative: 'modern abstract, cartoon, anime, pixel, flat design, neon, digital glitch'
      },
      '后印象派': {
        core: 'post-impressionism style, expressive color and form',
        detail: 'expressive brushwork, bold color, distorted form, emotional composition, thick paint, symbolic color, dramatic scenes, personal expression',
        mood: 'expressive, emotional, bold, passionate, intense',
        color: 'bold vivid colors, expressive palette, complementary contrast, deep tones',
        tech: 'expressive brushwork, thick paint, bold color, distorted form, emotional rendering',
        ref: 'inspired by Van Gogh, Cezanne, Gauguin, post-impressionism',
        negative: 'photorealistic, flat, minimal, digital, precise, muted, realistic'
      },
      '构成主义': {
        core: 'constructivism style, russian avant-garde geometric',
        detail: 'geometric abstraction, bold shapes, dynamic composition, industrial materials, political art, diagonal lines, bold typography, abstract forms, red and black',
        mood: 'bold, dynamic, revolutionary, modern, powerful',
        color: 'red, black, white, bold primaries, steel gray, industrial tones',
        tech: 'geometric shape, dynamic diagonal, bold typography, abstract composition, industrial texture',
        ref: 'inspired by Russian constructivism, El Lissitzky, Rodchenko',
        negative: 'realistic, organic, soft, decorative, classical, sentimental, ornate'
      },
      '至上主义': {
        core: 'suprematism style, pure geometric abstraction',
        detail: 'pure geometric forms, basic shapes, floating squares, minimal composition, abstract color, suprematist art, simple geometry, spiritual abstraction',
        mood: 'minimal, abstract, spiritual, pure, modern',
        color: 'black, white, red, bold primaries, simple palette, geometric tones',
        tech: 'pure geometry, floating shapes, minimal composition, abstract form, simple palette',
        ref: 'inspired by Malevich, suprematism, geometric abstraction',
        negative: 'realistic, figurative, detailed, organic, decorative, classical'
      },
      '风格派': {
        core: 'de stijl style, neoplasticism geometric abstraction',
        detail: 'primary colors, black and white, straight lines, rectangular composition, neoplasticism, grid layout, minimal abstraction, balance and order',
        mood: 'minimal, orderly, balanced, modern, pure',
        color: 'primary red, blue, yellow, black, white, grey',
        tech: 'rectangular composition, straight lines, primary palette, grid layout, neoplasticism',
        ref: 'inspired by Mondrian, De Stijl, neoplasticism',
        negative: 'realistic, organic, curved, decorative, ornate, classical, textured'
      },
      '贫穷艺术': {
        core: 'arte povera style, raw materials conceptual art',
        detail: 'raw materials, everyday objects, organic elements, industrial materials, conceptual arrangement, earth and stone, found objects, installation, anti-commercial',
        mood: 'raw, conceptual, earthy, unconventional, thought-provoking',
        color: 'natural earth tones, raw material colors, muted, organic, industrial',
        tech: 'raw material, found object, conceptual arrangement, organic texture, installation',
        ref: 'inspired by arte povera, Italian conceptual art, raw material art',
        negative: 'polished, commercial, decorative, glossy, photorealistic, refined'
      },
      '观念艺术': {
        core: 'conceptual art style, idea-driven artwork',
        detail: 'idea-driven, text-based art, conceptual pieces, minimalist presentation, documentation, philosophical themes, provocative concepts, intellectual art',
        mood: 'intellectual, provocative, minimal, conceptual, thought-provoking',
        color: 'minimal palette, monochrome, text black and white, muted tones',
        tech: 'text-based, minimalist presentation, conceptual arrangement, documentation, intellectual',
        ref: 'inspired by conceptual art, Joseph Kosuth, idea art',
        negative: 'decorative, ornamental, traditional, realistic, sentimental, craft'
      },
      '大地艺术': {
        core: 'land art style, earthworks in nature',
        detail: 'earthworks, natural landscapes, spiral forms, stone arrangements, environmental art, large scale, natural materials, site-specific, landscape integration',
        mood: 'monumental, natural, contemplative, vast, serene',
        color: 'earth tones, natural landscape, stone gray, sand, vegetation green, sky',
        tech: 'earthwork, natural material, large scale, landscape integration, site-specific',
        ref: 'inspired by Robert Smithson, land art, earthworks',
        negative: 'urban, digital, indoor, commercial, photorealistic, decorative, glossy'
      },
      '装置艺术': {
        core: 'installation art style, immersive spatial artwork',
        detail: 'immersive installations, spatial arrangement, mixed media, interactive elements, large scale, gallery space, sculptural environment, experiential art',
        mood: 'immersive, experiential, contemporary, thought-provoking, spatial',
        color: 'mixed palette, gallery lighting, varied materials, contemporary tones',
        tech: 'spatial arrangement, mixed media, immersive environment, large scale, gallery presentation',
        ref: 'inspired by installation art, immersive art, contemporary installation',
        negative: 'traditional, flat, decorative, realistic, classical, ornamental'
      },
      '行为艺术': {
        core: 'performance art style, live artistic action',
        detail: 'live performance, artistic action, body art, documentation, staged scenes, conceptual action, theatrical presentation, audience engagement',
        mood: 'provocative, theatrical, expressive, conceptual, engaging',
        color: 'stage lighting, dramatic contrast, documentary tones, muted',
        tech: 'performance documentation, staged scene, theatrical presentation, body art, conceptual action',
        ref: 'inspired by performance art, Marina Abramovic, live art',
        negative: 'traditional, static, decorative, realistic, classical, ornamental'
      },
      '新表现主义': {
        core: 'neo-expressionism style, raw emotional painting',
        detail: 'raw brushwork, intense emotion, bold color, distorted figures, gestural marks, expressive canvas, urban themes, aggressive strokes, neo-expressionist energy',
        mood: 'raw, intense, emotional, aggressive, expressive',
        color: 'bold vivid colors, raw palette, high contrast, intense tones',
        tech: 'raw brushwork, gestural marks, distorted figure, bold color, expressive canvas',
        ref: 'inspired by neo-expressionism, Basquiat, Julian Schnabel',
        negative: 'refined, polished, realistic, minimal, classical, decorative, calm'
      },
      '厚涂油画': {
        core: 'impasto oil style, thick textured paint',
        detail: 'thick paint, palette knife marks, heavy texture, raised brushstrokes, dimensional paint, rich pigment, textured surface, tactile painting',
        mood: 'textured, expressive, rich, bold, tactile',
        color: 'rich pigment, deep tones, vibrant color, oil palette, warm earth',
        tech: 'impasto texture, palette knife, thick paint, raised stroke, dimensional rendering',
        ref: 'inspired by impasto painting, Van Gogh, thick oil technique',
        negative: 'flat, digital, smooth, thin, minimal, vector, clean'
      },
      '湿壁画': {
        core: 'fresco style, painted on wet plaster',
        detail: 'fresco technique, matte plaster surface, muted pigments, wall painting, classical scenes, renaissance fresco, earthy tones, plaster texture, mural',
        mood: 'classical, ancient, serene, dignified, timeless',
        color: 'muted earth tones, fresco pigment, terracotta, ochre, blue, green, cream',
        tech: 'fresco rendering, plaster texture, matte surface, wall painting, muted pigment',
        ref: 'inspired by renaissance frescoes, Michelangelo, ancient fresco',
        negative: 'glossy, digital, neon, photorealistic, modern, abstract, grunge'
      },
      '蛋彩画': {
        core: 'tempera style, egg tempera painting',
        detail: 'tempera technique, fine detail, luminous color, matte finish, medieval art, precise brushwork, egg tempera, icon painting, layered glazes',
        mood: 'precise, luminous, medieval, refined, sacred',
        color: 'luminous color, jewel tones, matte palette, gold, deep blue, red, green',
        tech: 'tempera technique, fine detail, matte finish, layered glaze, precise brushwork',
        ref: 'inspired by egg tempera, medieval painting, icon art',
        negative: 'glossy, digital, neon, photorealistic, modern, abstract, rough'
      },
      '蚀刻版画': {
        core: 'etching style, intaglio printmaking',
        detail: 'fine etched lines, intaglio printing, cross-hatching, ink texture, tonal etching, detailed linework, printmaking, dark tones, paper grain',
        mood: 'detailed, graphic, traditional, refined, atmospheric',
        color: 'ink black, paper white, sepia, deep blue, grey, ochre',
        tech: 'etched line, cross-hatching, intaglio, ink texture, tonal rendering, printmaking',
        ref: 'inspired by Rembrandt etchings, Goya, intaglio printmaking',
        negative: 'photographic, digital, smooth, glossy, 3D, neon, colorful gradient'
      },
      '石版画': {
        core: 'lithograph style, stone printmaking',
        detail: 'lithographic print, smooth tonal gradients, crayon texture, printmaking, flat ink, vintage print, tonal lithography, paper texture',
        mood: 'vintage, graphic, traditional, refined, artistic',
        color: 'ink black, sepia, ochre, deep blue, cream, red',
        tech: 'lithographic rendering, tonal gradient, crayon texture, print grain, flat ink',
        ref: 'inspired by lithography, Toulouse-Lautrec, vintage prints',
        negative: 'photographic, digital, smooth, glossy, 3D, neon, painterly'
      },
      '丝网印刷': {
        core: 'silkscreen style, screen printing bold color',
        detail: 'screen printing, bold flat color, halftone, layered ink, graphic print, pop art, limited palette, print texture, bold graphics',
        mood: 'bold, graphic, vibrant, retro, artistic',
        color: 'bold flat colors, limited palette, primary tones, high contrast',
        tech: 'screen print, flat color, halftone, layered ink, print texture, bold graphics',
        ref: 'inspired by screen printing, Warhol, graphic printmaking',
        negative: 'photorealistic, soft, subtle, painterly, 3D, gradient-heavy, muted'
      },
      '蜡染': {
        core: 'batik style, wax-resist textile art',
        detail: 'wax-resist patterns, batik textile, crackle lines, intricate patterns, dyed fabric, traditional motifs, layered dye, textile art, organic patterns',
        mood: 'traditional, intricate, earthy, artistic, vibrant',
        color: 'indigo, brown, terracotta, cream, deep red, natural dye tones',
        tech: 'wax-resist, crackle line, batik pattern, dyed fabric, layered dye, textile texture',
        ref: 'inspired by batik, indonesian textile art, wax-resist dyeing',
        negative: 'photorealistic, digital, neon, modern, minimal, glossy'
      },
      '扎染': {
        core: 'tie dye style, psychedelic dyed fabric',
        detail: 'tie dye patterns, spiral motifs, psychedelic colors, dyed fabric, colorful swirls, 60s aesthetic, vibrant patterns, fabric texture, bold color',
        mood: 'psychedelic, vibrant, retro, playful, groovy',
        color: 'psychedelic colors, bright rainbow, neon tones, bold swirls',
        tech: 'tie dye pattern, spiral motif, dyed fabric, vibrant swirl, psychedelic rendering',
        ref: 'inspired by tie dye, 60s psychedelia, hippie aesthetic',
        negative: 'minimal, muted, photorealistic, elegant, corporate, subtle'
      },
      '刺绣': {
        core: 'embroidery style, stitched textile art',
        detail: 'stitched patterns, embroidery thread, floral motifs, textile texture, handcrafted, intricate stitching, colorful threads, traditional craft, decorative fabric',
        mood: 'handcrafted, intricate, delicate, traditional, warm',
        color: 'thread colors, vibrant embroidery, floral tones, gold, red, green, blue',
        tech: 'stitch rendering, thread texture, embroidery pattern, floral motif, textile craft',
        ref: 'inspired by embroidery, cross-stitch, traditional textile craft',
        negative: 'photorealistic, digital, neon, modern, minimal, glossy'
      },
      '编织艺术': {
        core: 'weaving style, woven textile art',
        detail: 'woven texture, interlaced threads, tapestry, textile pattern, warp and weft, handwoven, geometric weave, fiber art, layered fabric',
        mood: 'handcrafted, textured, warm, traditional, artistic',
        color: 'natural fiber tones, earth colors, woven palette, warm tones, accent colors',
        tech: 'weave texture, interlaced thread, tapestry rendering, warp and weft, fiber art',
        ref: 'inspired by weaving, tapestry, fiber art, traditional textiles',
        negative: 'photorealistic, digital, neon, modern, minimal, glossy'
      },
      '陶艺': {
        core: 'pottery style, handcrafted ceramic art',
        detail: 'handcrafted pottery, ceramic texture, clay forms, glazed surface, wheel-thrown, earthy tones, traditional craft, organic shapes, pottery texture',
        mood: 'handcrafted, earthy, warm, organic, traditional',
        color: 'clay tones, terracotta, glaze colors, earth brown, cream, ochre',
        tech: 'clay texture, glazed surface, wheel-thrown form, ceramic rendering, organic shape',
        ref: 'inspired by pottery, ceramics, traditional craft',
        negative: 'photorealistic, digital, neon, modern, minimal, glossy'
      },
      '珐琅': {
        core: 'enamel style, glossy colored enamel art',
        detail: 'glossy enamel, jewel colors, polished surface, metal base, intricate patterns, decorative art, vibrant color, reflective shine',
        mood: 'glossy, vibrant, decorative, refined, luxurious',
        color: 'jewel colors, glossy enamel, deep blue, red, green, gold, turquoise',
        tech: 'glossy enamel, polished surface, jewel color, reflective shine, decorative pattern',
        ref: 'inspired by enamel art, cloisonne, decorative enamel',
        negative: 'matte, rough, minimal, digital, photorealistic, modern, abstract'
      },
      '木雕': {
        core: 'woodcarving style, carved wooden art',
        detail: 'carved wood, wood grain, relief carving, sculptural form, traditional craft, intricate carving, wood texture, handcrafted, organic detail',
        mood: 'handcrafted, warm, traditional, organic, artistic',
        color: 'wood tones, walnut, oak, mahogany, natural grain, warm brown',
        tech: 'wood grain, relief carving, sculptural form, carved detail, wood texture',
        ref: 'inspired by woodcarving, relief sculpture, traditional craft',
        negative: 'photorealistic, digital, neon, modern, minimal, glossy'
      },
      '石雕': {
        core: 'stone sculpture style, carved stone art',
        detail: 'carved stone, marble texture, sculptural form, classical sculpture, stone grain, relief carving, monumental, traditional craft, stone texture',
        mood: 'monumental, classical, timeless, dignified, serene',
        color: 'marble white, stone gray, granite, limestone, warm beige, bronze patina',
        tech: 'stone texture, carved form, sculptural rendering, marble grain, relief carving',
        ref: 'inspired by classical sculpture, marble carving, stone art',
        negative: 'photorealistic, digital, neon, modern, minimal, glossy'
      },
      '金属工艺': {
        core: 'metalwork style, crafted metal art',
        detail: 'hammered metal, metal texture, engraved patterns, forged metal, metallic sheen, traditional craft, decorative metal, intricate detail',
        mood: 'crafted, refined, traditional, metallic, ornate',
        color: 'metal tones, bronze, copper, silver, gold, iron, patina green',
        tech: 'metal texture, hammered surface, engraved pattern, metallic sheen, forged detail',
        ref: 'inspired by metalwork, silversmithing, traditional craft',
        negative: 'photorealistic, digital, neon, modern, minimal, glossy'
      },
      '折纸': {
        core: 'origami style, folded paper art',
        detail: 'folded paper, geometric folds, origami forms, crisp creases, paper texture, sculptural paper, clean lines, folded shapes, minimalist craft',
        mood: 'minimal, precise, playful, artistic, clean',
        color: 'paper colors, origami palette, white, pastel, bold accent, kraft',
        tech: 'fold rendering, crisp crease, geometric form, paper texture, sculptural shape',
        ref: 'inspired by origami, paper folding, geometric paper art',
        negative: 'photorealistic, digital, neon, modern, glossy, organic, soft'
      },
      '纸雕': {
        core: 'paper sculpture style, dimensional paper art',
        detail: 'dimensional paper, layered paper, sculptural form, paper texture, intricate cutwork, paper relief, handcrafted, shadow depth, delicate detail',
        mood: 'handcrafted, delicate, artistic, dimensional, intricate',
        color: 'paper tones, cream, white, pastel, kraft, muted accent',
        tech: 'layered paper, sculptural form, paper relief, cutwork, shadow depth, paper texture',
        ref: 'inspired by paper sculpture, paper art, dimensional craft',
        negative: 'photorealistic, digital, neon, modern, glossy, heavy'
      },
      '拼布': {
        core: 'patchwork style, quilted fabric art',
        detail: 'patchwork quilt, fabric pieces, quilted texture, colorful patches, geometric patterns, sewn fabric, traditional craft, stitched detail, cozy textile',
        mood: 'cozy, handcrafted, warm, traditional, colorful',
        color: 'fabric colors, patchwork palette, warm tones, floral prints, bold patches',
        tech: 'patchwork, quilted texture, fabric piece, stitched detail, geometric pattern',
        ref: 'inspired by patchwork quilts, quilting, traditional textile',
        negative: 'photorealistic, digital, neon, modern, minimal, glossy'
      },
      '珠绣': {
        core: 'beadwork style, beaded decorative art',
        detail: 'beaded patterns, seed beads, intricate beading, shimmering surface, decorative art, traditional craft, colorful beads, patterned detail',
        mood: 'shimmering, decorative, intricate, traditional, ornate',
        color: 'bead colors, vibrant palette, shimmering tones, gold, red, blue, green',
        tech: 'bead rendering, seed bead texture, intricate pattern, shimmering surface, decorative detail',
        ref: 'inspired by beadwork, native american beadwork, traditional craft',
        negative: 'photorealistic, digital, neon, modern, minimal, matte'
      },
      '羽毛画': {
        core: 'feather art style, feather-based artwork',
        detail: 'feather texture, layered feathers, natural colors, bird motifs, delicate detail, organic texture, handcrafted, feather patterns, natural art',
        mood: 'delicate, natural, artistic, organic, graceful',
        color: 'feather colors, natural tones, iridescent, warm browns, blues, greens',
        tech: 'feather rendering, layered texture, organic detail, natural color, delicate craft',
        ref: 'inspired by feather art, feather craft, natural artwork',
        negative: 'photorealistic, digital, neon, modern, minimal, glossy'
      },
      '沙画': {
        core: 'sand art style, sand painting',
        detail: 'sand texture, layered sand, desert colors, sand painting, natural pigment, textured surface, handcrafted, granular detail, warm tones',
        mood: 'earthy, natural, textured, artistic, warm',
        color: 'sand tones, desert colors, warm brown, ochre, terracotta, gold',
        tech: 'sand texture, layered sand, granular detail, natural pigment, textured rendering',
        ref: 'inspired by sand painting, sand art, natural craft',
        negative: 'photorealistic, digital, neon, modern, minimal, glossy'
      },
      '冰雕': {
        core: 'ice sculpture style, carved ice art',
        detail: 'carved ice, translucent ice, crystal texture, frozen forms, icy detail, sculptural ice, cold tones, refractive light, intricate carving',
        mood: 'cold, crystalline, majestic, delicate, ethereal',
        color: 'ice blue, translucent white, crystal tones, pale cyan, silver',
        tech: 'ice rendering, translucent texture, carved form, refractive light, crystalline detail',
        ref: 'inspired by ice sculpture, ice carving, frozen art',
        negative: 'photorealistic, digital, neon, modern, warm, glossy'
      },
      '糖画': {
        core: 'sugar art style, sugar painting craft',
        detail: 'sugar painting, golden sugar, flowing sugar lines, traditional craft, edible art, intricate sugarwork, warm amber, delicate detail',
        mood: 'warm, handcrafted, traditional, delicate, playful',
        color: 'amber, golden sugar, warm brown, caramel, honey',
        tech: 'sugar rendering, flowing line, amber glow, intricate detail, traditional craft',
        ref: 'inspired by sugar painting, chinese folk craft, sugar art',
        negative: 'photorealistic, digital, neon, modern, minimal, glossy'
      },
      '泥塑': {
        core: 'clay sculpture style, hand-molded clay art',
        detail: 'molded clay, clay texture, sculptural form, handcrafted, earthy tones, figurative sculpture, clay detail, organic shape, traditional craft',
        mood: 'handcrafted, earthy, organic, warm, artistic',
        color: 'clay tones, terracotta, earth brown, ochre, cream, muted',
        tech: 'clay texture, molded form, sculptural rendering, handcrafted detail, organic shape',
        ref: 'inspired by clay sculpture, pottery, hand-molded art',
        negative: 'photorealistic, digital, neon, modern, minimal, glossy'
      },
      '皮影': {
        core: 'shadow puppet style, traditional shadow play',
        detail: 'shadow puppets, cutout figures, backlit shadow, traditional craft, intricate cutwork, translucent screen, dramatic silhouette, folk art, colorful puppets',
        mood: 'traditional, dramatic, folk, artistic, nostalgic',
        color: 'warm backlight, shadow tones, puppet colors, red, gold, amber, dark',
        tech: 'cutout figure, backlit shadow, translucent screen, intricate cutwork, silhouette rendering',
        ref: 'inspired by shadow puppetry, chinese folk art, shadow play',
        negative: 'photorealistic, digital, neon, modern, minimal, glossy'
      },
      '年画': {
        core: 'new year print style, chinese folk woodblock print',
        detail: 'chinese folk print, bold colors, auspicious motifs, new year imagery, woodblock print, folk art, festive patterns, traditional figures, bright palette',
        mood: 'festive, folk, vibrant, traditional, joyful',
        color: 'bright red, gold, green, blue, yellow, black, festive palette',
        tech: 'woodblock print, bold color, folk motif, festive pattern, traditional rendering',
        ref: 'inspired by chinese new year prints, folk woodblock art',
        negative: 'photorealistic, digital, neon, modern, minimal, muted'
      },
      '壁画': {
        core: 'mural style, large-scale wall painting',
        detail: 'large-scale mural, wall painting, public art, bold composition, urban wall, painted scenes, large brushwork, community art, expansive imagery',
        mood: 'bold, expansive, public, artistic, dynamic',
        color: 'mural palette, bold colors, urban tones, vibrant, varied',
        tech: 'large scale, wall painting, bold composition, urban rendering, expansive imagery',
        ref: 'inspired by murals, muralism, public wall art',
        negative: 'photorealistic, digital, minimal, private, refined, classical'
      },
      '岩画': {
        core: 'rock art style, ancient cave painting',
        detail: 'cave painting, rock surface, ancient art, ochre pigments, primitive figures, animal motifs, textured rock, prehistoric art, natural pigment',
        mood: 'ancient, primal, mysterious, raw, timeless',
        color: 'ochre, red earth, charcoal black, natural rock, brown, cream',
        tech: 'rock texture, cave painting, ochre pigment, primitive figure, natural rendering',
        ref: 'inspired by cave paintings, prehistoric rock art, Lascaux',
        negative: 'photorealistic, digital, neon, modern, minimal, glossy'
      },
      '水拓画': {
        core: 'marbling style, water marbling art',
        detail: 'marbling patterns, swirling ink, water surface, floating color, marbled texture, fluid art, intricate swirls, paper marbling, flowing patterns',
        mood: 'fluid, artistic, intricate, elegant, mesmerizing',
        color: 'marbled colors, swirling palette, jewel tones, ink colors, vibrant',
        tech: 'marbling pattern, swirling ink, fluid rendering, marbled texture, flowing detail',
        ref: 'inspired by ebru marbling, paper marbling, fluid art',
        negative: 'photorealistic, digital, neon, modern, minimal, flat'
      },
      '波斯地毯': {
        core: 'persian carpet style, intricate oriental rug',
        detail: 'intricate carpet patterns, persian rug, floral motifs, geometric borders, rich colors, woven texture, central medallion, ornate design, traditional craft',
        mood: 'ornate, luxurious, traditional, intricate, elegant',
        color: 'deep red, navy, gold, ivory, turquoise, jewel tones, rich palette',
        tech: 'carpet pattern, woven texture, floral motif, geometric border, central medallion',
        ref: 'inspired by persian carpets, oriental rugs, traditional weaving',
        negative: 'photorealistic, digital, neon, modern, minimal, glossy'
      },
      '岭南画派': {
        core: 'lingnan school painting, southern chinese watercolor',
        detail: 'lingnan school, southern chinese painting, wet wash, bold color, western perspective blend, birds and flowers, bright pigments, expressive brushwork, cantonese art tradition',
        mood: 'lively, expressive, bright, modern-traditional, dynamic',
        color: 'bright pigments, vivid green, warm red, cobalt blue, ink wash, luminous',
        tech: 'wet wash, bold color, western perspective, expressive brushwork, bright pigment',
        ref: 'inspired by Gao Jianfu, Chen Shuren, lingnan school of painting',
        negative: 'photorealistic, digital, neon, minimal, muted, gloomy'
      },
      '吴门画派': {
        core: 'wumen school painting, refined literati style',
        detail: 'wumen school, ming dynasty literati painting, elegant landscapes, scholarly refinement, subtle ink, gentle wash, classical composition, refined brushwork, cultivated taste',
        mood: 'refined, scholarly, elegant, serene, cultivated',
        color: 'soft ink, pale wash, muted earth tones, subtle green, restrained palette',
        tech: 'literati brushwork, subtle ink wash, classical composition, refined detail, gentle gradation',
        ref: 'inspired by Shen Zhou, Wen Zhengming, wumen school',
        negative: 'photorealistic, digital, neon, bold, vulgar, modern'
      },
      '浙派山水': {
        core: 'zhe school landscape, bold southern ink painting',
        detail: 'zhe school, southern chinese landscape, bold brushwork, dramatic mountains, wet ink, vigorous strokes, misty valleys, powerful composition, ming dynasty style',
        mood: 'bold, dramatic, vigorous, powerful, atmospheric',
        color: 'ink black, wet wash, misty gray, pale blue, natural stone tones',
        tech: 'bold brushwork, wet ink, dramatic composition, vigorous strokes, atmospheric depth',
        ref: 'inspired by Dai Jin, zhe school landscape painting',
        negative: 'photorealistic, digital, neon, delicate, minimal, flat'
      },
      '金陵画派': {
        core: 'jinling school painting, nanjing literati art',
        detail: 'jinling school, nanjing painting tradition, refined landscapes, scholarly figures, gentle ink, classical elegance, subtle color, cultured brushwork, ming-qing literati',
        mood: 'refined, cultured, elegant, gentle, scholarly',
        color: 'soft ink, pale wash, muted tones, subtle ochre, restrained palette',
        tech: 'literati brushwork, gentle ink, refined composition, cultured detail, subtle gradation',
        ref: 'inspired by Gong Xian, jinling school of painting',
        negative: 'photorealistic, digital, neon, bold, vulgar, modern'
      },
      '扬州画派': {
        core: 'yangzhou school painting, eccentric literati style',
        detail: 'yangzhou school, eccentric literati painting, bold ink, playful subjects, flowers and rocks, expressive brushwork, unconventional composition, qing dynasty, eight eccentrics',
        mood: 'playful, expressive, unconventional, bold, lively',
        color: 'bold ink, vibrant accents, warm tones, earthy palette, expressive color',
        tech: 'expressive brushwork, bold ink, playful composition, unconventional style, lively detail',
        ref: 'inspired by Zheng Xie, the eight eccentrics of yangzhou',
        negative: 'photorealistic, digital, neon, rigid, formal, minimal'
      },
      '海上画派': {
        core: 'shanghai school painting, modern chinese urban art',
        detail: 'shanghai school, modern chinese painting, commercial vitality, birds and flowers, bold color, western influence, urban energy, expressive brushwork, late qing-early republic',
        mood: 'vibrant, modern, expressive, energetic, cosmopolitan',
        color: 'bold color, vivid accents, rich palette, western pigments, lively tones',
        tech: 'bold color, expressive brushwork, western influence, urban energy, lively detail',
        ref: 'inspired by Ren Bonian, Wu Changshuo, shanghai school',
        negative: 'photorealistic, digital, neon, muted, traditional, minimal'
      },
      '长安画派': {
        core: 'changan school painting, northwest chinese landscape',
        detail: 'changan school, northwest chinese landscape, rugged mountains, loess plateau, bold ink, earthy tones, dramatic terrain, modern realism, socialist realism blend',
        mood: 'rugged, bold, earthy, dramatic, grounded',
        color: 'earthy tones, loess yellow, ink black, ochre, muted brown, stone gray',
        tech: 'bold ink, rugged terrain, earthy palette, dramatic composition, modern realism',
        ref: 'inspired by Shi Lu, Zhao Wangyun, changan school',
        negative: 'photorealistic, digital, neon, delicate, refined, minimal'
      },
      '京津画派': {
        core: 'beijing-tianjin school painting, northern chinese art',
        detail: 'beijing-tianjin school, northern chinese painting, classical tradition, birds and flowers, refined brushwork, courtly elegance, landscape and figure, modern academy style',
        mood: 'refined, classical, elegant, dignified, traditional',
        color: 'classical palette, ink wash, muted color, subtle red, restrained tones',
        tech: 'refined brushwork, classical composition, academy style, elegant detail, traditional rendering',
        ref: 'inspired by Qi Baishi, Xu Beihong, beijing-tianjin school',
        negative: 'photorealistic, digital, neon, bold, vulgar, modern'
      },
      '娄东画派': {
        core: 'loudong school painting, orthodox qing landscape',
        detail: 'loudong school, orthodox qing landscape, gentle mountains, scholarly refinement, subtle ink, classical composition, restrained brushwork, four wang tradition, elegant calm',
        mood: 'calm, refined, scholarly, classical, serene',
        color: 'subtle ink, pale wash, muted tones, soft green, restrained palette',
        tech: 'orthodox brushwork, subtle ink, classical composition, refined detail, gentle gradation',
        ref: 'inspired by Wang Shimin, Wang Yuanqi, loudong school',
        negative: 'photorealistic, digital, neon, bold, dramatic, modern'
      },
      '虞山画派': {
        core: 'yushan school painting, refined jiangnan landscape',
        detail: 'yushan school, jiangnan landscape, gentle hills, misty water, subtle ink, refined brushwork, classical elegance, scholarly calm, qing dynasty tradition',
        mood: 'calm, refined, elegant, misty, scholarly',
        color: 'subtle ink, misty gray, pale wash, soft blue, muted tones',
        tech: 'refined brushwork, misty atmosphere, subtle ink, classical composition, gentle gradation',
        ref: 'inspired by Wang Hui, yushan school of painting',
        negative: 'photorealistic, digital, neon, bold, dramatic, modern'
      },
      '黄山画派': {
        core: 'huangshan school painting, dramatic mountain landscape',
        detail: 'huangshan school, huangshan mountains, jagged peaks, pine trees, sea of clouds, bold ink, dramatic rocks, misty atmosphere, expressive brushwork, chinese landscape',
        mood: 'dramatic, majestic, atmospheric, bold, awe-inspiring',
        color: 'ink black, misty white, pine green, stone gray, pale blue',
        tech: 'bold ink, dramatic peaks, sea of clouds, expressive brushwork, atmospheric depth',
        ref: 'inspired by Shi Tao, huangshan school landscape painting',
        negative: 'photorealistic, digital, neon, flat, minimal, delicate'
      },
      '新安画派': {
        core: 'xinan school painting, anhui landscape tradition',
        detail: 'xinan school, anhui landscape, dry brush, sparse composition, austere mountains, subtle ink, scholarly restraint, clean lines, qing dynasty literati',
        mood: 'austere, refined, sparse, scholarly, calm',
        color: 'dry ink, pale wash, muted gray, restrained tones, subtle green',
        tech: 'dry brush, sparse composition, subtle ink, clean lines, refined restraint',
        ref: 'inspired by Hong Ren, xinan school of painting',
        negative: 'photorealistic, digital, neon, bold, lush, modern'
      },
      '米家山水': {
        core: 'mi family landscape, misty ink dot painting',
        detail: 'mi family landscape, misty mountains, ink dot technique, wet wash, blurred forms, atmospheric haze, gentle hills, song dynasty, mi fu style',
        mood: 'misty, dreamy, atmospheric, gentle, poetic',
        color: 'soft ink, misty gray, pale wash, hazy blue, muted tones',
        tech: 'ink dot technique, wet wash, atmospheric haze, blurred forms, misty depth',
        ref: 'inspired by Mi Fu, Mi Youren, mi family landscape',
        negative: 'photorealistic, digital, neon, sharp, bold, modern'
      },
      '青绿山水': {
        core: 'blue-green landscape, mineral pigment painting',
        detail: 'blue-green landscape, mineral pigments, azurite and malachite, vivid blue and green, gold accents, grand mountains, tang-song dynasty, decorative grandeur',
        mood: 'grand, majestic, vivid, decorative, opulent',
        color: 'azurite blue, malachite green, gold accents, mineral pigments, rich tones',
        tech: 'mineral pigment, blue-green palette, gold accents, grand composition, decorative detail',
        ref: 'inspired by Li Sixun, zhan ziqian, blue-green landscape',
        negative: 'photorealistic, digital, neon, muted, minimal, modern'
      },
      '金碧山水': {
        core: 'gold and blue landscape, imperial chinese painting',
        detail: 'gold and blue landscape, imperial grandeur, gold outlines, mineral blue, lavish decoration, palace scenes, tang dynasty, opulent mountains, luxurious detail',
        mood: 'opulent, grand, imperial, lavish, majestic',
        color: 'gold, azurite blue, malachite green, imperial red, rich mineral tones',
        tech: 'gold outline, mineral pigment, lavish decoration, imperial composition, opulent detail',
        ref: 'inspired by tang dynasty imperial landscape painting',
        negative: 'photorealistic, digital, neon, muted, minimal, plain'
      },
      '浅绛山水': {
        core: 'light crimson landscape, subtle warm ink painting',
        detail: 'light crimson landscape, warm ink wash, subtle red-brown tint, gentle mountains, refined brushwork, soft atmosphere, yuan dynasty literati, understated color',
        mood: 'gentle, warm, refined, understated, serene',
        color: 'light crimson, warm brown, soft ink, pale wash, muted earth tones',
        tech: 'warm ink wash, subtle crimson tint, refined brushwork, gentle composition, understated color',
        ref: 'inspired by Huang Gongwang, light crimson landscape painting',
        negative: 'photorealistic, digital, neon, bold, saturated, modern'
      },
      '没骨画': {
        core: 'boneless painting, color wash without outline',
        detail: 'boneless painting, color wash technique, no ink outline, soft edges, flowers and birds, wet pigment, delicate gradation, song dynasty, natural forms',
        mood: 'soft, delicate, natural, fluid, elegant',
        color: 'soft pigment, wet wash, delicate tones, natural colors, gentle gradation',
        tech: 'color wash, no outline, soft edges, wet pigment, delicate gradation',
        ref: 'inspired by Xu Xi, boneless flower painting',
        negative: 'photorealistic, digital, neon, hard outline, bold, modern'
      },
      '工笔重彩': {
        core: 'gongbi heavy color, meticulous chinese painting',
        detail: 'gongbi painting, meticulous brushwork, heavy mineral color, fine detail, courtly elegance, flowers and figures, precise lines, rich pigment, traditional refinement',
        mood: 'meticulous, refined, elegant, precise, opulent',
        color: 'heavy mineral color, rich pigment, gold accents, vibrant tones, fine detail',
        tech: 'meticulous brushwork, fine line, heavy color, precise detail, traditional rendering',
        ref: 'inspired by gongbi painting, court painters, traditional chinese fine art',
        negative: 'photorealistic, digital, neon, loose, abstract, minimal'
      },
      '写意花鸟': {
        core: 'freehand flower-bird painting, expressive chinese ink',
        detail: 'freehand flower-bird painting, expressive brushwork, bold ink, birds and flowers, spontaneous strokes, lively energy, chinese literati, dynamic composition',
        mood: 'expressive, lively, spontaneous, bold, energetic',
        color: 'bold ink, vibrant accents, warm tones, earthy palette, expressive color',
        tech: 'expressive brushwork, bold ink, spontaneous strokes, lively energy, dynamic composition',
        ref: 'inspired by Xu Wei, Bada Shanren, freehand flower-bird painting',
        negative: 'photorealistic, digital, neon, rigid, meticulous, minimal'
      },
      '泼墨山水': {
        core: 'splashed ink landscape, bold chinese abstract',
        detail: 'splashed ink landscape, bold ink splash, dramatic wash, abstract mountains, expressive freedom, wet pigment, powerful strokes, chinese ink tradition',
        mood: 'bold, dramatic, expressive, free, powerful',
        color: 'ink black, wet wash, dramatic gray, pale mist, natural tones',
        tech: 'ink splash, dramatic wash, expressive freedom, wet pigment, powerful strokes',
        ref: 'inspired by Zhang Daqian, splashed ink landscape painting',
        negative: 'photorealistic, digital, neon, delicate, controlled, minimal'
      },
      '焦墨山水': {
        core: 'dry ink landscape, textured chinese painting',
        detail: 'dry ink landscape, dry brush texture, cracked ink, rugged mountains, minimal wash, textured strokes, austere beauty, chinese ink tradition',
        mood: 'austere, textured, rugged, dry, powerful',
        color: 'dry ink, charcoal black, muted gray, earthy tones, sparse color',
        tech: 'dry brush, cracked ink texture, rugged strokes, minimal wash, textured detail',
        ref: 'inspired by Huang Binhong, dry ink landscape painting',
        negative: 'photorealistic, digital, neon, wet, smooth, modern'
      },
      '界画': {
        core: 'jiehua ruled painting, architectural precision',
        detail: 'jiehua painting, ruled line technique, architectural precision, palaces and pavilions, straight edges, fine detail, song dynasty, meticulous structures',
        mood: 'precise, meticulous, architectural, refined, grand',
        color: 'ink line, subtle wash, muted tones, restrained palette, fine detail',
        tech: 'ruled line, architectural precision, straight edge, fine detail, meticulous rendering',
        ref: 'inspired by Guo Zhongshu, jiehua architectural painting',
        negative: 'photorealistic, digital, neon, loose, abstract, minimal'
      },
      '指墨画': {
        core: 'finger painting, chinese ink finger art',
        detail: 'finger painting, ink applied by fingers, textured strokes, expressive marks, spontaneous forms, bold gesture, chinese ink tradition, unconventional tool',
        mood: 'expressive, spontaneous, bold, textured, free',
        color: 'ink black, textured gray, warm accents, earthy tones, expressive palette',
        tech: 'finger painting, textured strokes, expressive marks, bold gesture, spontaneous form',
        ref: 'inspired by Gao Qipei, chinese finger painting',
        negative: 'photorealistic, digital, neon, precise, smooth, minimal'
      },
      '漆画': {
        core: 'lacquer painting, glossy chinese lacquer art',
        detail: 'lacquer painting, glossy lacquer surface, layered color, inlaid detail, deep black base, luminous finish, traditional craft, rich texture',
        mood: 'glossy, rich, elegant, deep, luxurious',
        color: 'deep black, lacquer red, gold, jade green, luminous tones',
        tech: 'lacquer surface, layered color, glossy finish, inlaid detail, rich texture',
        ref: 'inspired by chinese lacquer art, lacquer painting tradition',
        negative: 'photorealistic, digital, neon, matte, minimal, plain'
      },
      '烙画': {
        core: 'pyrography, wood burning art',
        detail: 'pyrography, wood burning, scorched lines, warm brown tones, textured surface, intricate detail, craft tradition, natural wood grain',
        mood: 'warm, handcrafted, textured, rustic, detailed',
        color: 'scorched brown, warm amber, wood tones, dark sepia, natural grain',
        tech: 'wood burning, scorched line, warm tones, textured surface, intricate detail',
        ref: 'inspired by pyrography, wood burning art',
        negative: 'photorealistic, digital, neon, cool, glossy, modern'
      },
      '坦培拉': {
        core: 'tempera painting, egg tempera technique',
        detail: 'tempera painting, egg yolk binder, matte finish, fine detail, luminous color, medieval technique, precise strokes, renaissance tradition, durable surface',
        mood: 'matte, refined, luminous, precise, timeless',
        color: 'matte pigment, luminous color, muted tones, soft gold, natural palette',
        tech: 'egg tempera, matte finish, fine detail, precise strokes, luminous color',
        ref: 'inspired by renaissance tempera painting, medieval panel art',
        negative: 'photorealistic, digital, neon, glossy, bold, modern'
      },
      '粉彩画': {
        core: 'pastel drawing, soft chalk pastel art',
        detail: 'pastel drawing, soft chalk, powdery texture, blended color, gentle strokes, delicate tones, impressionist feel, paper texture, soft focus',
        mood: 'soft, delicate, gentle, dreamy, warm',
        color: 'soft pastel, powdery tones, gentle blend, muted color, warm palette',
        tech: 'chalk pastel, powdery texture, blended color, gentle strokes, soft focus',
        ref: 'inspired by degas pastels, soft pastel drawing',
        negative: 'photorealistic, digital, neon, hard, glossy, bold'
      },
      '水粉画': {
        core: 'gouache painting, opaque watercolor',
        detail: 'gouache painting, opaque watercolor, flat color, matte finish, bold shapes, poster-like quality, layered paint, vibrant yet soft, illustration feel',
        mood: 'flat, bold, vibrant, clean, illustrative',
        color: 'opaque color, flat tones, vibrant palette, matte finish, clean color',
        tech: 'gouache, opaque watercolor, flat color, matte finish, layered paint',
        ref: 'inspired by gouache illustration, poster art',
        negative: 'photorealistic, digital, neon, glossy, translucent, 3D'
      },
      '丙烯画': {
        core: 'acrylic painting, bold modern paint',
        detail: 'acrylic painting, fast-drying paint, bold color, thick texture, versatile strokes, modern art, layered paint, vivid palette, contemporary feel',
        mood: 'bold, modern, vivid, textured, contemporary',
        color: 'vivid acrylic, bold color, rich palette, saturated tones, modern hues',
        tech: 'acrylic paint, thick texture, bold strokes, layered paint, vivid color',
        ref: 'inspired by modern acrylic painting, contemporary art',
        negative: 'photorealistic, digital, neon, muted, delicate, traditional'
      },
      '蜡笔画': {
        core: 'crayon drawing, waxy childlike art',
        detail: 'crayon drawing, waxy texture, bold strokes, childlike charm, simple shapes, bright color, playful art, textured lines, nostalgic feel',
        mood: 'playful, childlike, bright, nostalgic, simple',
        color: 'bright crayon, waxy tones, bold color, playful palette, saturated hues',
        tech: 'crayon texture, bold strokes, simple shapes, waxy lines, playful rendering',
        ref: 'inspired by children crayon art, naive drawing',
        negative: 'photorealistic, digital, neon, refined, complex, realistic'
      },
      '色粉笔': {
        core: 'oil pastel, creamy bold drawing',
        detail: 'oil pastel, creamy texture, bold color, blended strokes, rich pigment, expressive marks, textured surface, vivid palette, contemporary drawing',
        mood: 'bold, expressive, rich, textured, vivid',
        color: 'rich oil pastel, bold color, creamy tones, vivid palette, saturated hues',
        tech: 'oil pastel, creamy texture, blended strokes, rich pigment, expressive marks',
        ref: 'inspired by oil pastel drawing, contemporary pastel art',
        negative: 'photorealistic, digital, neon, delicate, matte, minimal'
      },
      '钢笔淡彩': {
        core: 'pen and wash, ink line with watercolor',
        detail: 'pen and wash, ink line drawing, watercolor wash, delicate line, soft color, urban sketch, travel illustration, light atmosphere, hand-drawn charm',
        mood: 'delicate, light, charming, illustrative, fresh',
        color: 'ink line, soft watercolor, pale wash, gentle tones, fresh palette',
        tech: 'ink line, watercolor wash, delicate line, soft color, hand-drawn charm',
        ref: 'inspired by urban sketching, travel illustration',
        negative: 'photorealistic, digital, neon, heavy, bold, glossy'
      },
      '圆珠笔画': {
        core: 'ballpoint pen drawing, fine line art',
        detail: 'ballpoint pen drawing, fine line, cross-hatching, blue ink, detailed shading, monochrome, precise strokes, sketchbook art, hand-drawn texture',
        mood: 'precise, detailed, monochrome, intimate, handcrafted',
        color: 'blue ink, monochrome, fine line, subtle shading, single hue',
        tech: 'ballpoint pen, fine line, cross-hatching, detailed shading, precise strokes',
        ref: 'inspired by ballpoint pen art, fine line drawing',
        negative: 'photorealistic, digital, neon, colorful, bold, glossy'
      },
      '针管笔画': {
        core: 'technical pen drawing, precise line art',
        detail: 'technical pen drawing, precise line, fine detail, stippling, architectural clarity, monochrome, clean strokes, meticulous rendering, ink illustration',
        mood: 'precise, clean, meticulous, technical, detailed',
        color: 'black ink, monochrome, fine line, clean strokes, subtle shading',
        tech: 'technical pen, precise line, stippling, clean strokes, meticulous detail',
        ref: 'inspired by technical illustration, pen and ink art',
        negative: 'photorealistic, digital, neon, colorful, loose, bold'
      },
      '马克笔画': {
        core: 'marker drawing, bold flat color art',
        detail: 'marker drawing, bold flat color, smooth blend, vibrant palette, clean shapes, illustration style, alcohol marker, contemporary art, graphic feel',
        mood: 'bold, clean, vibrant, graphic, contemporary',
        color: 'bold marker, flat color, vibrant palette, smooth blend, saturated tones',
        tech: 'alcohol marker, flat color, smooth blend, clean shapes, graphic rendering',
        ref: 'inspired by marker illustration, contemporary graphic art',
        negative: 'photorealistic, digital, neon, textured, delicate, traditional'
      },
      '彩铅画': {
        core: 'colored pencil drawing, fine layered art',
        detail: 'colored pencil drawing, fine layers, soft blend, detailed texture, subtle color, hand-drawn precision, realistic touch, delicate shading, paper grain',
        mood: 'delicate, precise, soft, detailed, intimate',
        color: 'soft colored pencil, layered tones, subtle blend, natural palette, delicate color',
        tech: 'colored pencil, fine layers, soft blend, detailed texture, delicate shading',
        ref: 'inspired by colored pencil realism, fine art drawing',
        negative: 'photorealistic, digital, neon, bold, glossy, abstract'
      },
      '木炭素描': {
        core: 'charcoal drawing, dramatic monochrome sketch',
        detail: 'charcoal drawing, deep black, smudged texture, dramatic contrast, expressive strokes, soft shading, monochrome, figure study, hand-drawn depth',
        mood: 'dramatic, expressive, moody, textured, deep',
        color: 'charcoal black, gray tones, smudged texture, monochrome, soft shading',
        tech: 'charcoal, dramatic contrast, smudged texture, expressive strokes, soft shading',
        ref: 'inspired by charcoal figure drawing, dramatic sketch art',
        negative: 'photorealistic, digital, neon, colorful, clean, glossy'
      },
      '银针笔': {
        core: 'silverpoint drawing, renaissance metalpoint art',
        detail: 'silverpoint drawing, fine metal line, delicate gray, prepared ground, precise strokes, renaissance technique, subtle detail, archival art, refined line',
        mood: 'refined, precise, delicate, subtle, timeless',
        color: 'silver gray, fine line, delicate tones, muted palette, subtle shading',
        tech: 'silverpoint, fine metal line, prepared ground, precise strokes, subtle detail',
        ref: 'inspired by renaissance silverpoint drawing, metalpoint art',
        negative: 'photorealistic, digital, neon, bold, colorful, glossy'
      },
      '蛋彩壁画': {
        core: 'fresco secco, tempera mural painting',
        detail: 'fresco secco, tempera on dry plaster, muted color, ancient mural, religious scenes, matte finish, layered paint, classical composition, historic wall art',
        mood: 'ancient, muted, classical, reverent, historic',
        color: 'muted pigment, earthy tones, matte finish, faded color, classical palette',
        tech: 'fresco secco, tempera on plaster, muted color, layered paint, classical composition',
        ref: 'inspired by renaissance fresco secco, ancient mural painting',
        negative: 'photorealistic, digital, neon, glossy, bold, modern'
      },
      '油画棒': {
        core: 'oil pastel stick, bold creamy strokes',
        detail: 'oil pastel stick, creamy bold strokes, thick texture, vibrant color, expressive marks, layered pigment, contemporary drawing, rich surface',
        mood: 'bold, expressive, rich, textured, vibrant',
        color: 'vibrant oil pastel, bold color, creamy tones, rich palette, saturated hues',
        tech: 'oil pastel, thick texture, bold strokes, layered pigment, expressive marks',
        ref: 'inspired by oil pastel art, bold contemporary drawing',
        negative: 'photorealistic, digital, neon, delicate, matte, minimal'
      },
      '水彩速写': {
        core: 'watercolor sketch, loose plein air painting',
        detail: 'watercolor sketch, loose wash, quick strokes, plein air, spontaneous color, light atmosphere, travel sketch, wet-on-wet, fresh energy',
        mood: 'loose, fresh, spontaneous, light, lively',
        color: 'watercolor wash, fresh palette, light tones, soft color, airy hues',
        tech: 'watercolor sketch, loose wash, wet-on-wet, quick strokes, light atmosphere',
        ref: 'inspired by plein air watercolor, travel sketching',
        negative: 'photorealistic, digital, neon, heavy, detailed, glossy'
      },
      '素描淡彩': {
        core: 'pencil sketch with light wash',
        detail: 'pencil sketch with light wash, graphite line, soft watercolor tint, delicate color, hand-drawn charm, subtle shading, gentle atmosphere, mixed media',
        mood: 'delicate, gentle, soft, charming, subtle',
        color: 'graphite gray, soft wash, pale tint, muted color, gentle tones',
        tech: 'pencil sketch, light wash, graphite line, soft tint, subtle shading',
        ref: 'inspired by mixed media sketch, pencil and wash art',
        negative: 'photorealistic, digital, neon, bold, heavy, glossy'
      },
      '极简主义': {
        core: 'minimalism, extreme simplicity and reduction',
        detail: 'minimalism, extreme simplicity, reduced forms, negative space, clean lines, single focus, geometric purity, quiet composition, essential elements',
        mood: 'calm, quiet, pure, focused, serene',
        color: 'monochrome, white, black, neutral tones, single accent, restrained palette',
        tech: 'negative space, clean lines, geometric purity, reduced forms, quiet composition',
        ref: 'inspired by Donald Judd, minimalism art movement',
        negative: 'cluttered, ornate, baroque, decorative, busy, complex'
      },
      '新波普': {
        core: 'neo-pop, contemporary pop art revival',
        detail: 'neo-pop, contemporary pop art, bold imagery, commercial culture, bright color, celebrity icons, glossy finish, playful irony, modern consumerism',
        mood: 'bold, playful, ironic, vibrant, contemporary',
        color: 'bright pop color, bold palette, glossy tones, saturated hues, vivid accents',
        tech: 'bold imagery, glossy finish, bright color, commercial icon, playful irony',
        ref: 'inspired by Jeff Koons, neo-pop art movement',
        negative: 'muted, traditional, realistic, subtle, monochrome, minimal'
      },
      '新达达': {
        core: 'neo-dada, contemporary anti-art movement',
        detail: 'neo-dada, contemporary anti-art, found objects, ironic juxtaposition, absurd humor, mixed media, provocative concept, everyday materials, conceptual irony',
        mood: 'ironic, provocative, absurd, playful, conceptual',
        color: 'mixed palette, found object tones, raw materials, varied color, unpolished',
        tech: 'found objects, mixed media, ironic juxtaposition, absurd humor, conceptual irony',
        ref: 'inspired by Robert Rauschenberg, neo-dada movement',
        negative: 'polished, traditional, realistic, elegant, refined, minimal'
      },
      '波普超现实': {
        core: 'pop surrealism, lowbrow art movement',
        detail: 'pop surrealism, lowbrow art, dreamlike imagery, pop culture icons, surreal scenes, bold color, whimsical detail, glossy finish, contemporary fantasy',
        mood: 'dreamlike, whimsical, surreal, bold, playful',
        color: 'bold color, vivid palette, glossy tones, surreal hues, saturated accents',
        tech: 'surreal imagery, pop culture icon, bold color, glossy finish, whimsical detail',
        ref: 'inspired by Mark Ryden, pop surrealism movement',
        negative: 'realistic, muted, traditional, plain, minimal, serious'
      },
      '极简抽象': {
        core: 'minimal abstraction, reductive abstract art',
        detail: 'minimal abstraction, reductive forms, simple shapes, flat color, clean geometry, restrained palette, quiet balance, essential composition',
        mood: 'calm, pure, quiet, balanced, focused',
        color: 'flat color, monochrome, neutral tones, single accent, restrained palette',
        tech: 'simple shapes, flat color, clean geometry, reductive forms, quiet balance',
        ref: 'inspired by Agnes Martin, minimal abstraction',
        negative: 'complex, cluttered, ornate, decorative, busy, textured'
      },
      '几何抽象': {
        core: 'geometric abstraction, precise shape art',
        detail: 'geometric abstraction, precise shapes, straight lines, flat color, mathematical order, clean composition, hard edges, modern design, balanced forms',
        mood: 'precise, orderly, clean, modern, balanced',
        color: 'flat color, bold shapes, primary palette, clean tones, geometric hues',
        tech: 'precise shapes, straight lines, flat color, hard edges, mathematical order',
        ref: 'inspired by Piet Mondrian, geometric abstraction',
        negative: 'organic, curved, messy, textured, realistic, ornate'
      },
      '抒情抽象': {
        core: 'lyrical abstraction, expressive emotional art',
        detail: 'lyrical abstraction, expressive brushwork, emotional color, flowing forms, spontaneous gesture, poetic composition, soft focus, intuitive painting',
        mood: 'emotional, expressive, poetic, flowing, intuitive',
        color: 'expressive color, flowing palette, soft tones, emotional hues, vibrant accents',
        tech: 'expressive brushwork, flowing forms, spontaneous gesture, emotional color, poetic composition',
        ref: 'inspired by Joan Mitchell, lyrical abstraction',
        negative: 'rigid, geometric, precise, minimal, realistic, cold'
      },
      '行动绘画': {
        core: 'action painting, gestural abstract expressionism',
        detail: 'action painting, gestural strokes, dripping paint, energetic marks, dynamic movement, spontaneous action, layered texture, abstract expressionism, raw energy',
        mood: 'energetic, dynamic, raw, spontaneous, expressive',
        color: 'bold color, dripping pigment, energetic palette, layered tones, raw hues',
        tech: 'gestural strokes, dripping paint, dynamic movement, layered texture, spontaneous action',
        ref: 'inspired by Jackson Pollock, action painting',
        negative: 'controlled, precise, minimal, calm, geometric, clean'
      },
      '光效应艺术': {
        core: 'op art, optical illusion art',
        detail: 'op art, optical illusion, geometric patterns, vibrating lines, visual tricks, bold contrast, precise repetition, perceptual art, hypnotic pattern',
        mood: 'hypnotic, precise, dynamic, illusory, striking',
        color: 'bold contrast, black and white, vibrant accents, precise tones, optical hues',
        tech: 'geometric patterns, optical illusion, precise repetition, vibrating lines, visual trick',
        ref: 'inspired by Bridget Riley, op art movement',
        negative: 'organic, soft, realistic, muted, natural, blurred'
      },
      '动态艺术': {
        core: 'kinetic art, moving sculpture and motion',
        detail: 'kinetic art, moving elements, mechanical motion, optical movement, dynamic sculpture, suspended forms, flowing motion, interactive energy, contemporary art',
        mood: 'dynamic, moving, energetic, interactive, contemporary',
        color: 'metallic tones, bold accents, varied palette, reflective surfaces, dynamic hues',
        tech: 'moving elements, mechanical motion, dynamic sculpture, flowing motion, interactive energy',
        ref: 'inspired by Alexander Calder, kinetic art movement',
        negative: 'static, still, traditional, flat, minimal, quiet'
      },
      '环境艺术': {
        core: 'environmental art, site-specific installation',
        detail: 'environmental art, site-specific installation, natural materials, landscape integration, large scale, earth art, immersive setting, ecological theme, outdoor work',
        mood: 'immersive, natural, expansive, contemplative, site-specific',
        color: 'natural materials, earth tones, landscape palette, organic color, muted hues',
        tech: 'site-specific installation, natural materials, large scale, landscape integration, immersive setting',
        ref: 'inspired by Robert Smithson, environmental art movement',
        negative: 'studio, artificial, indoor, commercial, small scale, synthetic'
      },
      '偶发艺术': {
        core: 'happening art, ephemeral performance event',
        detail: 'happening art, ephemeral performance, spontaneous event, audience participation, staged action, improvisation, fleeting moment, avant-garde, theatrical',
        mood: 'spontaneous, theatrical, ephemeral, participatory, avant-garde',
        color: 'varied palette, stage tones, improvised color, mixed hues, dynamic accents',
        tech: 'spontaneous event, staged action, audience participation, improvisation, ephemeral moment',
        ref: 'inspired by Allan Kaprow, happening art movement',
        negative: 'permanent, static, traditional, scripted, formal, minimal'
      },
      '新现实主义': {
        core: 'new realism, contemporary figurative art',
        detail: 'new realism, contemporary figurative, everyday subjects, modern life, honest portrayal, social theme, realistic detail, contemporary setting, grounded art',
        mood: 'grounded, honest, contemporary, observational, social',
        color: 'natural palette, realistic color, muted tones, contemporary hues, grounded tones',
        tech: 'figurative realism, contemporary setting, honest portrayal, realistic detail, social theme',
        ref: 'inspired by contemporary new realism painting',
        negative: 'abstract, surreal, idealized, fantasy, stylized, minimal'
      },
      '超写实主义': {
        core: 'hyperrealism, extreme photographic detail',
        detail: 'hyperrealism, extreme detail, photographic precision, smooth surface, lifelike texture, enlarged scale, meticulous rendering, contemporary realism, glossy finish',
        mood: 'precise, intense, detailed, lifelike, contemporary',
        color: 'photographic color, precise tones, realistic palette, smooth gradation, natural hues',
        tech: 'photographic precision, extreme detail, smooth surface, meticulous rendering, glossy finish',
        ref: 'inspired by Chuck Close, hyperrealism movement',
        negative: 'abstract, stylized, cartoon, painterly, loose, minimal'
      },
      '新具象': {
        core: 'new figuration, contemporary figurative painting',
        detail: 'new figuration, contemporary figurative, expressive figures, modern narrative, bold color, emotional form, urban subjects, painterly approach, contemporary art',
        mood: 'expressive, contemporary, emotional, bold, narrative',
        color: 'bold color, expressive palette, contemporary hues, vivid tones, emotional accents',
        tech: 'expressive figures, painterly approach, bold color, modern narrative, emotional form',
        ref: 'inspired by new figuration movement, contemporary figurative art',
        negative: 'abstract, minimal, realistic, idealized, flat, traditional'
      },
      '具象表现': {
        core: 'figurative expressionism, emotional figure art',
        detail: 'figurative expressionism, distorted figures, emotional intensity, bold brushwork, psychological depth, expressive color, human condition, contemporary art',
        mood: 'emotional, intense, expressive, psychological, raw',
        color: 'expressive color, bold palette, emotional tones, intense hues, dramatic accents',
        tech: 'distorted figures, bold brushwork, emotional intensity, expressive color, psychological depth',
        ref: 'inspired by figurative expressionism, contemporary figure painting',
        negative: 'realistic, idealized, calm, minimal, precise, flat'
      },
      '极简构成': {
        core: 'minimal composition, reductive design art',
        detail: 'minimal composition, reductive design, clean layout, geometric order, negative space, flat color, precise balance, modern design, essential form',
        mood: 'clean, balanced, modern, quiet, precise',
        color: 'flat color, monochrome, neutral tones, single accent, restrained palette',
        tech: 'clean layout, geometric order, negative space, flat color, precise balance',
        ref: 'inspired by swiss design, minimal composition art',
        negative: 'cluttered, ornate, decorative, busy, textured, complex'
      },
      '抽象拼贴': {
        core: 'abstract collage, layered mixed media art',
        detail: 'abstract collage, layered paper, mixed media, torn edges, bold shapes, found imagery, textured surface, contemporary art, dynamic composition',
        mood: 'layered, dynamic, contemporary, textured, bold',
        color: 'mixed palette, found imagery, bold shapes, varied color, textured tones',
        tech: 'layered paper, mixed media, torn edges, found imagery, textured surface',
        ref: 'inspired by Kurt Schwitters, abstract collage art',
        negative: 'realistic, smooth, minimal, photographic, flat, clean'
      },
      '珐琅彩': {
        core: 'cloisonne enamel, colorful enamel craft',
        detail: 'cloisonne enamel, colorful enamel, metal wire, glossy surface, intricate pattern, jewel tones, traditional craft, chinese porcelain, vibrant detail',
        mood: 'colorful, glossy, intricate, luxurious, traditional',
        color: 'jewel tones, vibrant enamel, glossy color, rich palette, metallic accents',
        tech: 'cloisonne enamel, metal wire, glossy surface, intricate pattern, vibrant detail',
        ref: 'inspired by cloisonne enamel, chinese enamel craft',
        negative: 'photorealistic, digital, neon, matte, minimal, plain'
      },
      '掐丝工艺': {
        core: 'filigree craft, fine metal wire art',
        detail: 'filigree craft, fine metal wire, delicate scrollwork, intricate pattern, gold and silver, ornamental detail, handcrafted, jewelry art, traditional technique',
        mood: 'delicate, intricate, ornamental, refined, luxurious',
        color: 'gold, silver, metallic tones, fine wire, jewel accents, luminous',
        tech: 'filigree, fine metal wire, delicate scrollwork, intricate pattern, ornamental detail',
        ref: 'inspired by filigree jewelry, fine metal craft',
        negative: 'photorealistic, digital, neon, coarse, bold, minimal'
      },
      '螺钿镶嵌': {
        core: 'mother-of-pearl inlay, iridescent shell craft',
        detail: 'mother-of-pearl inlay, iridescent shell, shimmering surface, intricate pattern, lacquer base, traditional craft, oriental furniture, luminous detail',
        mood: 'iridescent, luminous, elegant, intricate, traditional',
        color: 'iridescent pearl, shimmering tones, shell colors, lacquer black, luminous accents',
        tech: 'mother-of-pearl inlay, iridescent surface, intricate pattern, lacquer base, luminous detail',
        ref: 'inspired by mother-of-pearl inlay, oriental lacquer craft',
        negative: 'photorealistic, digital, neon, matte, plain, minimal'
      },
      '金银错': {
        core: 'gold-silver inlay, ancient metalwork',
        detail: 'gold-silver inlay, metal inlay, bronze base, gold and silver lines, intricate pattern, ancient craft, chinese metalwork, engraved detail, luxurious',
        mood: 'ancient, luxurious, intricate, refined, ornamental',
        color: 'gold, silver, bronze, dark metal, luminous inlay, rich tones',
        tech: 'gold-silver inlay, metal inlay, engraved detail, intricate pattern, ancient craft',
        ref: 'inspired by ancient chinese gold-silver inlay metalwork',
        negative: 'photorealistic, digital, neon, plain, matte, minimal'
      },
      '鎏金工艺': {
        core: 'gilding craft, gold-plated metal art',
        detail: 'gilding craft, gold plating, luminous gold, ancient technique, religious art, ornate surface, traditional craft, shimmering detail, precious finish',
        mood: 'luminous, opulent, sacred, ornate, precious',
        color: 'gold, luminous tones, warm metal, rich amber, radiant accents',
        tech: 'gilding, gold plating, luminous surface, ornate detail, traditional technique',
        ref: 'inspired by gilding craft, ancient gold-plated art',
        negative: 'photorealistic, digital, neon, matte, plain, minimal'
      },
      '錾刻工艺': {
        core: 'chasing metalwork, engraved metal art',
        detail: 'chasing metalwork, engraved metal, hammered detail, raised relief, intricate pattern, metallic texture, traditional craft, ornamental surface, handcrafted',
        mood: 'ornamental, intricate, handcrafted, metallic, refined',
        color: 'metal tones, silver, copper, bronze, engraved shading, metallic palette',
        tech: 'chasing metalwork, engraved detail, hammered relief, intricate pattern, metallic texture',
        ref: 'inspired by chasing metalwork, engraved metal art',
        negative: 'photorealistic, digital, neon, plain, smooth, minimal'
      },
      '花丝镶嵌': {
        core: 'filigree inlay, fine wire jewelry craft',
        detail: 'filigree inlay, fine wire, gemstone setting, intricate scrollwork, gold and silver, delicate detail, traditional craft, ornate jewelry, luminous',
        mood: 'delicate, ornate, luxurious, intricate, refined',
        color: 'gold, silver, gemstone accents, fine wire, luminous tones, jewel colors',
        tech: 'filigree inlay, fine wire, gemstone setting, intricate scrollwork, delicate detail',
        ref: 'inspired by filigree jewelry, fine wire inlay craft',
        negative: 'photorealistic, digital, neon, coarse, bold, minimal'
      },
      '点翠工艺': {
        core: 'kingfisher feather craft, iridescent blue art',
        detail: 'kingfisher feather craft, iridescent blue, feather inlay, traditional chinese craft, jewelry art, shimmering surface, delicate detail, historic technique',
        mood: 'iridescent, delicate, historic, shimmering, refined',
        color: 'iridescent blue, kingfisher tones, shimmering surface, teal accents, luminous',
        tech: 'feather inlay, iridescent surface, delicate detail, traditional craft, shimmering tone',
        ref: 'inspired by kingfisher feather craft, traditional chinese jewelry',
        negative: 'photorealistic, digital, neon, matte, plain, minimal'
      },
      '烧蓝工艺': {
        core: 'enamel firing craft, fired blue enamel',
        detail: 'enamel firing craft, fired enamel, deep blue, glossy surface, metal base, intricate pattern, traditional craft, jewelry art, luminous detail',
        mood: 'glossy, deep, intricate, traditional, luminous',
        color: 'deep blue, fired enamel, glossy surface, jewel tones, metallic accents',
        tech: 'enamel firing, glossy surface, deep blue, intricate pattern, metal base',
        ref: 'inspired by enamel firing craft, traditional blue enamel art',
        negative: 'photorealistic, digital, neon, matte, plain, minimal'
      },
      '漆线雕': {
        core: 'lacquer thread sculpture, raised lacquer art',
        detail: 'lacquer thread sculpture, raised lacquer lines, intricate relief, gold detail, traditional craft, chinese sculpture, ornate pattern, luminous surface',
        mood: 'ornate, intricate, traditional, luminous, refined',
        color: 'lacquer gold, deep red, raised lines, luminous surface, rich tones',
        tech: 'lacquer thread, raised relief, intricate pattern, gold detail, traditional craft',
        ref: 'inspired by lacquer thread sculpture, chinese lacquer art',
        negative: 'photorealistic, digital, neon, flat, plain, minimal'
      },
      '木纹金': {
        core: 'mokume gane, layered metal woodgrain',
        detail: 'mokume gane, layered metal, woodgrain pattern, fused layers, copper and silver, organic pattern, japanese craft, metallic texture, refined detail',
        mood: 'organic, refined, layered, metallic, elegant',
        color: 'copper, silver, layered tones, woodgrain pattern, metallic palette, warm metal',
        tech: 'mokume gane, layered metal, woodgrain pattern, fused layers, metallic texture',
        ref: 'inspired by mokume gane, japanese layered metal craft',
        negative: 'photorealistic, digital, neon, plain, smooth, minimal'
      },
      '琉璃工艺': {
        core: 'liuli glass craft, chinese colored glass',
        detail: 'liuli glass craft, colored glass, translucent color, carved detail, luminous surface, traditional craft, chinese glass art, jewel-like, intricate form',
        mood: 'luminous, translucent, jewel-like, refined, traditional',
        color: 'translucent color, jewel tones, glass hues, luminous accents, rich palette',
        tech: 'colored glass, translucent surface, carved detail, luminous finish, intricate form',
        ref: 'inspired by liuli glass, chinese colored glass craft',
        negative: 'photorealistic, digital, neon, opaque, plain, minimal'
      },
      '玉雕': {
        core: 'jade carving, polished stone sculpture',
        detail: 'jade carving, polished jade, smooth surface, translucent green, intricate carving, traditional craft, chinese sculpture, ornamental detail, luminous stone',
        mood: 'smooth, elegant, refined, traditional, luminous',
        color: 'jade green, translucent tones, white jade, pale accents, luminous stone',
        tech: 'jade carving, polished surface, intricate detail, translucent tone, traditional craft',
        ref: 'inspired by chinese jade carving, jade sculpture',
        negative: 'photorealistic, digital, neon, rough, matte, minimal'
      },
      '竹雕': {
        core: 'bamboo carving, natural wood sculpture',
        detail: 'bamboo carving, carved bamboo, natural grain, warm tone, intricate relief, traditional craft, chinese sculpture, organic detail, handcrafted',
        mood: 'natural, warm, handcrafted, intricate, traditional',
        color: 'bamboo tone, warm brown, natural grain, amber, earthy palette',
        tech: 'bamboo carving, natural grain, intricate relief, warm tone, traditional craft',
        ref: 'inspired by chinese bamboo carving, bamboo sculpture',
        negative: 'photorealistic, digital, neon, glossy, cold, minimal'
      },
      '核雕': {
        core: 'nut carving, miniature fruit pit art',
        detail: 'nut carving, miniature carving, fruit pit, intricate detail, tiny figures, traditional craft, chinese miniature art, fine relief, handcrafted',
        mood: 'intricate, miniature, detailed, traditional, refined',
        color: 'nut tone, warm brown, natural pit, earthy palette, subtle detail',
        tech: 'nut carving, miniature detail, fine relief, tiny figures, traditional craft',
        ref: 'inspired by chinese nut carving, miniature pit art',
        negative: 'photorealistic, digital, neon, large scale, bold, minimal'
      },
      '微雕': {
        core: 'micro carving, microscopic detail art',
        detail: 'micro carving, microscopic detail, tiny scale, precise relief, miniature art, intricate carving, traditional craft, magnified detail, fine work',
        mood: 'precise, intricate, miniature, refined, awe-inspiring',
        color: 'fine tones, subtle palette, natural material, muted color, delicate shading',
        tech: 'micro carving, microscopic detail, precise relief, tiny scale, intricate work',
        ref: 'inspired by micro carving, miniature sculpture art',
        negative: 'photorealistic, digital, neon, large scale, bold, coarse'
      },
      '根雕': {
        core: 'root carving, organic wood sculpture',
        detail: 'root carving, natural root, organic form, twisted wood, sculptural shape, traditional craft, chinese sculpture, rustic texture, handcrafted',
        mood: 'organic, rustic, natural, sculptural, earthy',
        color: 'wood tone, natural brown, root texture, earthy palette, warm accents',
        tech: 'root carving, organic form, twisted wood, sculptural shape, rustic texture',
        ref: 'inspired by chinese root carving, organic wood sculpture',
        negative: 'photorealistic, digital, neon, smooth, glossy, minimal'
      },
      '紫砂': {
        core: 'zisha clay craft, purple clay pottery',
        detail: 'zisha clay craft, purple clay, unglazed surface, warm texture, teapot art, traditional craft, chinese pottery, earthy tone, handcrafted',
        mood: 'earthy, warm, handcrafted, traditional, refined',
        color: 'zisha purple, warm brown, clay tone, earthy palette, muted accents',
        tech: 'zisha clay, unglazed surface, warm texture, teapot form, traditional craft',
        ref: 'inspired by zisha teapot, yixing purple clay pottery',
        negative: 'photorealistic, digital, neon, glossy, cold, minimal'
      },
      '青瓷': {
        core: 'celadon porcelain, jade green glaze',
        detail: 'celadon porcelain, jade green glaze, smooth surface, subtle crackle, elegant form, traditional craft, chinese ceramics, translucent tone, refined',
        mood: 'elegant, refined, serene, traditional, luminous',
        color: 'celadon green, jade tones, pale glaze, soft green, luminous surface',
        tech: 'celadon glaze, smooth surface, subtle crackle, elegant form, traditional craft',
        ref: 'inspired by celadon porcelain, chinese green ceramics',
        negative: 'photorealistic, digital, neon, bold, glossy, minimal'
      },
      '白瓷': {
        core: 'white porcelain, pure white ceramic',
        detail: 'white porcelain, pure white, smooth glaze, elegant form, translucent body, traditional craft, chinese ceramics, refined surface, minimal detail',
        mood: 'pure, elegant, refined, serene, minimal',
        color: 'pure white, ivory, translucent tone, pale glaze, soft shadows',
        tech: 'white porcelain, smooth glaze, elegant form, translucent body, refined surface',
        ref: 'inspired by white porcelain, chinese dehua ceramics',
        negative: 'photorealistic, digital, neon, colorful, bold, ornate'
      },
      '黑陶': {
        core: 'black pottery, burnished dark ceramic',
        detail: 'black pottery, burnished black, smooth surface, ancient craft, geometric pattern, chinese ceramics, matte finish, prehistoric style, handcrafted',
        mood: 'ancient, matte, smooth, minimal, primal',
        color: 'black, charcoal, burnished tone, dark surface, subtle sheen',
        tech: 'black pottery, burnished surface, geometric pattern, matte finish, ancient craft',
        ref: 'inspired by black pottery, ancient chinese ceramics',
        negative: 'photorealistic, digital, neon, colorful, glossy, ornate'
      },
      '彩陶': {
        core: 'painted pottery, ancient painted ceramic',
        detail: 'painted pottery, painted patterns, earthy base, geometric motif, ancient craft, chinese ceramics, red and black, prehistoric art, handcrafted',
        mood: 'ancient, earthy, primal, patterned, handcrafted',
        color: 'earthy base, red, black, ochre, geometric tones, natural palette',
        tech: 'painted pottery, geometric motif, earthy base, ancient pattern, handcrafted detail',
        ref: 'inspired by painted pottery, ancient chinese ceramics',
        negative: 'photorealistic, digital, neon, modern, glossy, minimal'
      },
      '汝窑': {
        core: 'ru ware, sky blue song porcelain',
        detail: 'ru ware, sky blue glaze, subtle crackle, jade-like surface, elegant form, song dynasty, chinese ceramics, refined minimalism, precious glaze',
        mood: 'refined, serene, elegant, precious, minimal',
        color: 'sky blue, ru glaze, pale tone, subtle crackle, luminous surface',
        tech: 'ru glaze, sky blue, subtle crackle, jade-like surface, elegant form',
        ref: 'inspired by ru ware, song dynasty porcelain',
        negative: 'photorealistic, digital, neon, bold, ornate, glossy'
      },
      '官窑': {
        core: 'guan ware, imperial song porcelain',
        detail: 'guan ware, imperial porcelain, crackled glaze, muted color, elegant form, song dynasty, chinese ceramics, refined surface, historic craft',
        mood: 'imperial, refined, elegant, historic, muted',
        color: 'muted glaze, gray-green, crackled tone, pale surface, subtle color',
        tech: 'guan glaze, crackled surface, elegant form, muted color, imperial craft',
        ref: 'inspired by guan ware, imperial song porcelain',
        negative: 'photorealistic, digital, neon, bold, ornate, glossy'
      },
      '哥窑': {
        core: 'ge ware, crackled glaze porcelain',
        detail: 'ge ware, crackled glaze, golden iron lines, layered crackle, muted color, song dynasty, chinese ceramics, refined surface, historic craft',
        mood: 'refined, historic, elegant, textured, muted',
        color: 'crackled glaze, muted gray, golden lines, pale surface, subtle color',
        tech: 'ge glaze, crackled surface, golden iron lines, layered crackle, elegant form',
        ref: 'inspired by ge ware, crackled song porcelain',
        negative: 'photorealistic, digital, neon, bold, glossy, minimal'
      },
      '钧窑': {
        core: 'jun ware, flamboyant glaze porcelain',
        detail: 'jun ware, flamboyant glaze, purple and blue, mottled surface, flowing color, song dynasty, chinese ceramics, dramatic glaze, rich tones',
        mood: 'dramatic, rich, flowing, vibrant, historic',
        color: 'purple, blue, mottled glaze, flowing tones, rich color, luminous surface',
        tech: 'jun glaze, flamboyant color, mottled surface, flowing tone, dramatic effect',
        ref: 'inspired by jun ware, flamboyant glaze porcelain',
        negative: 'photorealistic, digital, neon, plain, minimal, glossy'
      },
      '定窑': {
        core: 'ding ware, white song porcelain',
        detail: 'ding ware, white porcelain, ivory glaze, carved detail, elegant form, song dynasty, chinese ceramics, refined surface, subtle pattern',
        mood: 'refined, elegant, serene, minimal, classic',
        color: 'ivory white, ding glaze, pale tone, soft surface, subtle pattern',
        tech: 'ding glaze, ivory white, carved detail, elegant form, refined surface',
        ref: 'inspired by ding ware, white song porcelain',
        negative: 'photorealistic, digital, neon, bold, ornate, glossy'
      },
      '建盏': {
        core: 'jian ware, tenmoku tea bowl',
        detail: 'jian ware, tenmoku glaze, dark surface, oil spot pattern, hare fur streaks, song dynasty, chinese tea ware, iron glaze, dramatic texture',
        mood: 'dark, dramatic, textured, rustic, historic',
        color: 'dark glaze, iron black, oil spot, hare fur streaks, deep tones',
        tech: 'jian glaze, oil spot pattern, hare fur streaks, dark surface, iron texture',
        ref: 'inspired by jian ware, tenmoku tea bowls',
        negative: 'photorealistic, digital, neon, bright, glossy, minimal'
      },
      '越窑': {
        core: 'yue ware, early celadon porcelain',
        detail: 'yue ware, early celadon, pale green glaze, simple form, tang dynasty, chinese ceramics, refined surface, historic craft, subtle tone',
        mood: 'refined, historic, serene, simple, elegant',
        color: 'pale green, yue celadon, soft glaze, muted tone, natural surface',
        tech: 'yue glaze, pale green, simple form, refined surface, historic craft',
        ref: 'inspired by yue ware, early celadon porcelain',
        negative: 'photorealistic, digital, neon, bold, ornate, glossy'
      },
      '龙泉青瓷': {
        core: 'longquan celadon, deep green porcelain',
        detail: 'longquan celadon, deep green glaze, jade-like surface, smooth form, chinese ceramics, luminous tone, refined craft, elegant shape',
        mood: 'luminous, elegant, refined, serene, jade-like',
        color: 'deep green, longquan celadon, jade tone, luminous surface, rich glaze',
        tech: 'longquan glaze, deep green, jade-like surface, smooth form, refined craft',
        ref: 'inspired by longquan celadon, chinese green porcelain',
        negative: 'photorealistic, digital, neon, bold, glossy, minimal'
      },
      'AI幻觉艺术': {
        core: 'AI hallucination art, dreamlike machine imagery',
        detail: 'AI hallucination art, dreamlike imagery, surreal forms, machine-generated detail, uncanny texture, hallucinated objects, neural artifact, otherworldly, contemporary digital',
        mood: 'dreamlike, uncanny, surreal, otherworldly, mesmerizing',
        color: 'surreal palette, hallucinated color, iridescent tones, dreamy hues, vivid accents',
        tech: 'neural artifact, hallucinated detail, surreal forms, uncanny texture, dreamlike rendering',
        ref: 'inspired by AI generative art, neural hallucination imagery',
        negative: 'photorealistic, clean, traditional, minimal, realistic, plain'
      },
      '体素艺术': {
        core: 'voxel art, cubic block 3D style',
        detail: 'voxel art, cubic blocks, 3D pixel, blocky form, chunky detail, game aesthetic, digital sculpture, low-res 3D, colorful cubes, contemporary',
        mood: 'blocky, playful, digital, chunky, contemporary',
        color: 'voxel palette, blocky color, bright tones, saturated hues, cubic shading',
        tech: 'voxel rendering, cubic blocks, blocky form, chunky detail, 3D pixel',
        ref: 'inspired by voxel art, minecraft-style 3D, voxel games',
        negative: 'smooth, realistic, high-poly, organic, flat, minimal'
      },
      '全息投影': {
        core: 'holographic projection, light-based 3D display',
        detail: 'holographic projection, floating image, translucent light, 3D display, neon glow, futuristic tech, spectral color, luminous form, sci-fi interface',
        mood: 'futuristic, luminous, spectral, high-tech, ethereal',
        color: 'holographic color, neon glow, translucent tones, spectral hues, iridescent accents',
        tech: 'holographic projection, floating image, translucent light, neon glow, 3D display',
        ref: 'inspired by holographic displays, sci-fi hologram technology',
        negative: 'solid, realistic, traditional, matte, plain, analog'
      },
      '生成艺术': {
        core: 'generative art, algorithmic creative output',
        detail: 'generative art, algorithmic patterns, procedural forms, computational design, random variation, mathematical beauty, digital art, code-driven, contemporary',
        mood: 'algorithmic, precise, contemporary, dynamic, mathematical',
        color: 'generative palette, procedural color, bold tones, varied hues, digital accents',
        tech: 'algorithmic pattern, procedural form, computational design, random variation, mathematical beauty',
        ref: 'inspired by generative art, algorithmic creative coding',
        negative: 'hand-drawn, organic, traditional, realistic, minimal, static'
      },
      '算法艺术': {
        core: 'algorithmic art, rule-based digital creation',
        detail: 'algorithmic art, rule-based patterns, computational logic, precise geometry, procedural detail, mathematical order, digital creation, contemporary',
        mood: 'precise, logical, ordered, contemporary, computational',
        color: 'algorithmic palette, precise color, bold tones, digital hues, systematic accents',
        tech: 'rule-based pattern, computational logic, precise geometry, procedural detail, mathematical order',
        ref: 'inspired by algorithmic art, computational creativity',
        negative: 'organic, hand-drawn, chaotic, traditional, realistic, minimal'
      },
      '数据可视化艺术': {
        core: 'data visualization art, information aesthetics',
        detail: 'data visualization art, information design, data-driven imagery, charts and graphs, network diagrams, statistical beauty, contemporary digital, abstract data',
        mood: 'informative, precise, contemporary, abstract, dynamic',
        color: 'data palette, gradient color, bold tones, categorical hues, digital accents',
        tech: 'data-driven imagery, information design, network diagram, statistical beauty, abstract rendering',
        ref: 'inspired by data visualization, information aesthetics',
        negative: 'organic, hand-drawn, traditional, realistic, minimal, plain'
      },
      '分形艺术': {
        core: 'fractal art, infinite recursive patterns',
        detail: 'fractal art, recursive patterns, infinite detail, mathematical geometry, self-similar forms, vibrant color, digital art, hypnotic complexity, contemporary',
        mood: 'hypnotic, complex, infinite, vibrant, mesmerizing',
        color: 'vibrant fractal color, gradient tones, bold hues, luminous accents, rich palette',
        tech: 'recursive pattern, infinite detail, mathematical geometry, self-similar form, vibrant rendering',
        ref: 'inspired by fractal geometry, mandelbrot set art',
        negative: 'simple, flat, organic, traditional, minimal, plain'
      },
      '新媒体艺术': {
        core: 'new media art, digital and interactive work',
        detail: 'new media art, digital installation, interactive work, multimedia display, screen-based art, video projection, contemporary technology, immersive experience',
        mood: 'contemporary, immersive, digital, interactive, dynamic',
        color: 'digital palette, screen tones, bold color, varied hues, luminous accents',
        tech: 'digital installation, interactive work, multimedia display, video projection, immersive experience',
        ref: 'inspired by new media art, digital installation practice',
        negative: 'traditional, static, analog, minimal, realistic, plain'
      },
      '交互艺术': {
        core: 'interactive art, audience-participatory work',
        detail: 'interactive art, audience participation, responsive design, sensor-driven, participatory experience, dynamic response, contemporary digital, engaging work',
        mood: 'interactive, engaging, participatory, dynamic, contemporary',
        color: 'responsive palette, digital tones, bold color, varied hues, dynamic accents',
        tech: 'audience participation, responsive design, sensor-driven, dynamic response, participatory experience',
        ref: 'inspired by interactive art, participatory media practice',
        negative: 'static, passive, traditional, minimal, realistic, plain'
      },
      '沉浸式艺术': {
        core: 'immersive art, enveloping multimedia experience',
        detail: 'immersive art, enveloping experience, large-scale projection, surround environment, multisensory display, digital installation, atmospheric immersion, contemporary',
        mood: 'immersive, enveloping, atmospheric, awe-inspiring, contemporary',
        color: 'immersive palette, projection color, atmospheric tones, luminous hues, rich accents',
        tech: 'large-scale projection, surround environment, multisensory display, atmospheric immersion, digital installation',
        ref: 'inspired by immersive art installations, teamlab experiences',
        negative: 'small scale, static, traditional, minimal, flat, plain'
      },
      '数字雕塑': {
        core: 'digital sculpture, 3D virtual form',
        detail: 'digital sculpture, 3D virtual form, sculpted mesh, digital clay, high detail, rendered surface, contemporary art, virtual object, 3D modeling',
        mood: 'sculptural, contemporary, detailed, virtual, dynamic',
        color: 'rendered palette, digital tones, sculpted shading, varied hues, material accents',
        tech: '3D virtual form, sculpted mesh, digital clay, high detail, rendered surface',
        ref: 'inspired by digital sculpture, 3D art practice',
        negative: 'flat, 2D, traditional, minimal, realistic photo, plain'
      },
      '程序化艺术': {
        core: 'procedural art, code-generated imagery',
        detail: 'procedural art, code-generated imagery, automated patterns, computational texture, generative form, algorithmic design, digital creation, contemporary',
        mood: 'computational, precise, generative, contemporary, dynamic',
        color: 'procedural palette, automated color, bold tones, varied hues, digital accents',
        tech: 'code-generated imagery, automated pattern, computational texture, generative form, algorithmic design',
        ref: 'inspired by procedural generation, code art practice',
        negative: 'hand-drawn, organic, traditional, realistic, minimal, static'
      },
      '神经风格迁移': {
        core: 'neural style transfer, AI artistic fusion',
        detail: 'neural style transfer, AI artistic fusion, painting texture, photographic content, blended style, machine learning art, contemporary digital, artistic transfer',
        mood: 'artistic, blended, contemporary, painterly, digital',
        color: 'blended palette, painterly color, transferred tones, artistic hues, digital accents',
        tech: 'neural style transfer, painting texture, blended style, machine learning, artistic fusion',
        ref: 'inspired by neural style transfer, AI art research',
        negative: 'photorealistic, plain, traditional, minimal, flat, unprocessed'
      },
      '像素雕塑': {
        core: 'pixel sculpture, blocky 3D pixel art',
        detail: 'pixel sculpture, blocky 3D, pixelated form, cubic detail, game aesthetic, digital object, chunky volume, colorful blocks, contemporary',
        mood: 'blocky, playful, digital, chunky, contemporary',
        color: 'pixel palette, blocky color, bright tones, saturated hues, cubic shading',
        tech: 'pixelated form, blocky 3D, cubic detail, chunky volume, game aesthetic',
        ref: 'inspired by pixel sculpture, 3D pixel art',
        negative: 'smooth, realistic, high-poly, organic, flat, minimal'
      },
      '光绘艺术': {
        core: 'light painting, long-exposure light art',
        detail: 'light painting, long exposure, moving light, glowing trails, dark background, luminous strokes, photographic art, dynamic motion, contemporary',
        mood: 'luminous, dynamic, magical, dark, contemporary',
        color: 'glowing trails, neon light, dark background, luminous accents, vibrant hues',
        tech: 'long exposure, moving light, glowing trails, dark background, luminous strokes',
        ref: 'inspired by light painting photography, light art',
        negative: 'daylight, static, realistic, plain, minimal, bright'
      },
      '投影映射': {
        core: 'projection mapping, light projection on surfaces',
        detail: 'projection mapping, projected imagery, surface mapping, architectural projection, 3D illusion, light display, immersive light, contemporary, dynamic',
        mood: 'dynamic, immersive, illusory, contemporary, spectacular',
        color: 'projected color, light tones, vibrant hues, luminous accents, rich palette',
        tech: 'projection mapping, surface projection, architectural display, 3D illusion, light rendering',
        ref: 'inspired by projection mapping, architectural light shows',
        negative: 'static, traditional, minimal, flat, plain, analog'
      },
      '增强现实艺术': {
        core: 'augmented reality art, digital overlay on reality',
        detail: 'augmented reality art, digital overlay, virtual objects, real-world blend, interactive display, mobile AR, contemporary digital, layered reality',
        mood: 'contemporary, interactive, layered, digital, dynamic',
        color: 'digital overlay, vibrant tones, mixed reality, luminous accents, varied hues',
        tech: 'digital overlay, virtual object, real-world blend, interactive display, layered reality',
        ref: 'inspired by augmented reality art, AR experiences',
        negative: 'traditional, static, analog, minimal, realistic, plain'
      },
      '虚拟现实艺术': {
        core: 'virtual reality art, immersive digital world',
        detail: 'virtual reality art, immersive digital world, 3D environment, virtual space, interactive scene, rendered reality, contemporary digital, enveloping experience',
        mood: 'immersive, enveloping, digital, futuristic, dynamic',
        color: 'virtual palette, rendered tones, immersive hues, luminous accents, rich color',
        tech: '3D environment, virtual space, interactive scene, rendered reality, immersive world',
        ref: 'inspired by virtual reality art, VR experiences',
        negative: 'traditional, static, analog, minimal, realistic, flat'
      },
      '数字拼贴': {
        core: 'digital collage, layered digital imagery',
        detail: 'digital collage, layered imagery, photo manipulation, mixed elements, surreal composition, digital texture, contemporary art, bold arrangement',
        mood: 'layered, surreal, contemporary, bold, dynamic',
        color: 'mixed palette, digital tones, bold color, varied hues, textured accents',
        tech: 'layered imagery, photo manipulation, mixed elements, surreal composition, digital texture',
        ref: 'inspired by digital collage, contemporary photo art',
        negative: 'realistic, minimal, smooth, traditional, flat, clean'
      },
      '赛博格艺术': {
        core: 'cyborg art, human-machine fusion imagery',
        detail: 'cyborg art, human-machine fusion, mechanical implants, cybernetic enhancement, futuristic body, metallic detail, sci-fi aesthetic, contemporary, transhuman',
        mood: 'futuristic, transhuman, mechanical, edgy, contemporary',
        color: 'metallic tones, neon accents, cyber palette, chrome, futuristic hues',
        tech: 'mechanical implant, cybernetic enhancement, metallic detail, futuristic body, sci-fi rendering',
        ref: 'inspired by cyborg art, transhumanist sci-fi imagery',
        negative: 'organic, natural, traditional, minimal, realistic, plain'
      },
      '赛博敦煌': {
        core: 'cyber dunhuang, futuristic grotto art',
        detail: 'cyber dunhuang, futuristic grotto art, neon buddha, digital murals, holographic bodhisattva, cyber silk road, glowing frescoes, fusion of ancient and future',
        mood: 'futuristic, spiritual, neon, fusion, awe-inspiring',
        color: 'neon accents, digital gold, cyber palette, holographic tones, glowing hues',
        tech: 'neon rendering, holographic detail, digital mural, glowing fresco, cyber fusion',
        ref: 'inspired by dunhuang murals fused with cyberpunk aesthetics',
        negative: 'traditional, plain, realistic, minimal, muted, analog'
      },
      '国潮插画': {
        core: 'guochao illustration, chinese trendy art',
        detail: 'guochao illustration, chinese trendy art, traditional motifs, modern design, bold color, cultural symbols, contemporary chinese, vibrant illustration, national pride',
        mood: 'trendy, vibrant, bold, cultural, contemporary',
        color: 'bold color, chinese palette, red and gold, vibrant tones, modern hues',
        tech: 'traditional motif, modern design, bold color, cultural symbol, vibrant illustration',
        ref: 'inspired by guochao design, contemporary chinese illustration',
        negative: 'traditional, muted, plain, realistic, minimal, western'
      },
      '新中式': {
        core: 'neo-chinese style, modern chinese aesthetic',
        detail: 'neo-chinese style, modern chinese aesthetic, clean lines, traditional elements, contemporary design, minimal elegance, cultural fusion, refined modern',
        mood: 'refined, modern, elegant, minimal, cultural',
        color: 'neutral palette, chinese accents, muted tones, warm wood, restrained color',
        tech: 'clean lines, traditional element, contemporary design, minimal elegance, refined rendering',
        ref: 'inspired by neo-chinese design, modern chinese aesthetics',
        negative: 'ornate, cluttered, traditional, bold, western, maximal'
      },
      '东方蒸汽朋克': {
        core: 'eastern steampunk, asian industrial fantasy',
        detail: 'eastern steampunk, asian industrial fantasy, brass machinery, chinese elements, mechanical dragons, steam tech, oriental detail, fusion aesthetic, intricate',
        mood: 'industrial, intricate, fusion, adventurous, ornate',
        color: 'brass, copper, gold, warm metal, chinese red, steam tones',
        tech: 'brass machinery, mechanical detail, steam tech, oriental element, fusion rendering',
        ref: 'inspired by steampunk fused with eastern aesthetics',
        negative: 'modern, digital, clean, minimal, western, plain'
      },
      '和风赛博': {
        core: 'japanese cyberpunk, neon tokyo fusion',
        detail: 'japanese cyberpunk, neon tokyo, japanese motifs, digital shrine, cyber samurai, futuristic japan, neon kanji, fusion aesthetic, high-tech',
        mood: 'futuristic, neon, fusion, edgy, vibrant',
        color: 'neon palette, cyber tones, japanese red, holographic accents, glowing hues',
        tech: 'neon rendering, japanese motif, digital shrine, cyber samurai, futuristic fusion',
        ref: 'inspired by japanese cyberpunk, neon tokyo aesthetics',
        negative: 'traditional, plain, realistic, minimal, muted, analog'
      },
      '非洲未来主义': {
        core: 'afrofuturism, african sci-fi aesthetic',
        detail: 'afrofuturism, african sci-fi, futuristic africa, cosmic heritage, african patterns, space technology, cultural futurism, bold color, contemporary',
        mood: 'futuristic, cultural, bold, cosmic, empowering',
        color: 'bold african palette, vibrant color, cosmic tones, rich hues, luminous accents',
        tech: 'african pattern, futuristic technology, cosmic heritage, bold color, cultural rendering',
        ref: 'inspired by afrofuturism, african sci-fi art',
        negative: 'traditional, plain, realistic, minimal, muted, western'
      },
      '拉美魔幻': {
        core: 'latin magical realism, vibrant surreal narrative',
        detail: 'latin magical realism, vibrant surreal, magical narrative, latin culture, dreamlike scenes, bold color, folkloric detail, contemporary, lush imagery',
        mood: 'magical, vibrant, surreal, narrative, lush',
        color: 'vibrant latin palette, bold color, lush tones, rich hues, warm accents',
        tech: 'magical realism, surreal narrative, folkloric detail, bold color, lush rendering',
        ref: 'inspired by latin magical realism, frida kahlo aesthetics',
        negative: 'realistic, muted, minimal, plain, cold, traditional'
      },
      '拉贾斯坦细密画': {
        core: 'rajasthani miniature, indian court painting',
        detail: 'rajasthani miniature, indian court painting, vivid color, intricate detail, royal scenes, gold accents, traditional indian art, ornate composition, cultural',
        mood: 'ornate, vivid, royal, intricate, cultural',
        color: 'vivid indian palette, gold accents, rich color, jewel tones, ornate hues',
        tech: 'miniature detail, gold accent, royal scene, intricate composition, traditional rendering',
        ref: 'inspired by rajasthani miniature painting, indian court art',
        negative: 'photorealistic, digital, neon, minimal, muted, modern'
      },
      '泰式金箔': {
        core: 'thai gold leaf, gilded temple art',
        detail: 'thai gold leaf, gilded surface, golden detail, temple art, luminous gold, traditional thai, ornate pattern, sacred imagery, shimmering',
        mood: 'sacred, luminous, ornate, golden, traditional',
        color: 'gold, luminous tones, warm metal, rich amber, radiant accents',
        tech: 'gold leaf, gilded surface, ornate pattern, sacred imagery, shimmering detail',
        ref: 'inspired by thai gold leaf art, gilded temple decoration',
        negative: 'photorealistic, digital, neon, matte, plain, minimal'
      },
      '蒙元风格': {
        core: 'mongol-yuan style, steppe imperial aesthetic',
        detail: 'mongol-yuan style, steppe imperial aesthetic, nomadic motifs, yuan dynasty, bold pattern, equestrian culture, fur and felt, imperial grandeur, cultural',
        mood: 'imperial, bold, nomadic, grand, cultural',
        color: 'steppe palette, earth tones, bold accents, fur tones, imperial hues',
        tech: 'nomadic motif, bold pattern, equestrian detail, imperial grandeur, cultural rendering',
        ref: 'inspired by mongol-yuan dynasty art, steppe aesthetics',
        negative: 'photorealistic, digital, neon, minimal, delicate, modern'
      },
      '西域风格': {
        core: 'western regions style, silk road aesthetic',
        detail: 'western regions style, silk road aesthetic, central asian, oasis culture, trade routes, exotic pattern, ancient fusion, cultural exchange, historic',
        mood: 'exotic, historic, cultural, ornate, mysterious',
        color: 'silk road palette, earth tones, exotic accents, rich hues, historic color',
        tech: 'central asian motif, oasis detail, exotic pattern, ancient fusion, cultural rendering',
        ref: 'inspired by silk road art, western regions culture',
        negative: 'photorealistic, digital, neon, minimal, modern, plain'
      },
      '丝路风格': {
        core: 'silk road style, transcontinental fusion art',
        detail: 'silk road style, transcontinental fusion, trade route culture, cultural blend, caravan imagery, exotic detail, historic fusion, ornate pattern, ancient',
        mood: 'historic, fusion, exotic, ornate, adventurous',
        color: 'fusion palette, earth tones, exotic accents, rich hues, historic color',
        tech: 'caravan imagery, cultural blend, exotic detail, ornate pattern, historic rendering',
        ref: 'inspired by silk road culture, transcontinental trade art',
        negative: 'photorealistic, digital, neon, minimal, modern, plain'
      },
      '赛博唐风': {
        core: 'cyber tang, futuristic tang dynasty',
        detail: 'cyber tang, futuristic tang dynasty, neon court, digital silk, holographic palace, cyber chinese, fusion aesthetic, glowing traditional, high-tech',
        mood: 'futuristic, fusion, neon, grand, vibrant',
        color: 'neon palette, cyber tones, tang red, holographic accents, glowing hues',
        tech: 'neon rendering, digital silk, holographic palace, cyber fusion, glowing detail',
        ref: 'inspired by tang dynasty aesthetics fused with cyberpunk',
        negative: 'traditional, plain, realistic, minimal, muted, analog'
      },
      '蒸汽和风': {
        core: 'steam japanese, meiji industrial aesthetic',
        detail: 'steam japanese, meiji industrial, brass machinery, japanese motifs, steam tech, kimono and gears, fusion aesthetic, intricate, historic future',
        mood: 'industrial, fusion, intricate, historic, ornate',
        color: 'brass, copper, japanese tones, warm metal, steam hues, muted accents',
        tech: 'brass machinery, japanese motif, steam tech, fusion detail, historic rendering',
        ref: 'inspired by meiji era steampunk, japanese industrial fusion',
        negative: 'modern, digital, clean, minimal, western, plain'
      },
      '新古典国风': {
        core: 'neo-classical chinese, refined modern tradition',
        detail: 'neo-classical chinese, refined modern tradition, classical motifs, contemporary design, elegant minimalism, cultural refinement, modern chinese, sophisticated',
        mood: 'refined, elegant, modern, sophisticated, cultural',
        color: 'refined palette, chinese accents, muted tones, elegant color, restrained hues',
        tech: 'classical motif, contemporary design, elegant minimalism, cultural refinement, sophisticated rendering',
        ref: 'inspired by neo-classical chinese design, refined modern aesthetics',
        negative: 'ornate, cluttered, bold, traditional, maximal, plain'
      },
      '俄罗斯圣像画': {
        core: 'russian icon painting, orthodox sacred art',
        detail: 'russian icon painting, orthodox sacred art, gold background, stylized figures, religious imagery, flat perspective, rich color, traditional craft, reverent',
        mood: 'sacred, reverent, stylized, traditional, luminous',
        color: 'gold, rich red, deep blue, icon palette, luminous tones, sacred hues',
        tech: 'gold background, stylized figure, flat perspective, religious imagery, traditional rendering',
        ref: 'inspired by russian orthodox icon painting',
        negative: 'photorealistic, digital, neon, modern, minimal, realistic'
      },
      '墨西哥壁画': {
        core: 'mexican muralism, bold social wall art',
        detail: 'mexican muralism, bold social wall art, large-scale mural, revolutionary theme, indigenous figures, bold color, public art, cultural narrative, monumental',
        mood: 'bold, monumental, social, cultural, powerful',
        color: 'bold mexican palette, vibrant color, earthy tones, rich hues, dramatic accents',
        tech: 'large-scale mural, bold color, indigenous figure, cultural narrative, monumental rendering',
        ref: 'inspired by diego rivera, mexican muralism',
        negative: 'photorealistic, digital, minimal, private, refined, muted'
      },
      '日本水墨': {
        core: 'japanese ink painting, sumi-e aesthetic',
        detail: 'japanese ink painting, sumi-e, black ink, minimal brushwork, zen simplicity, negative space, flowing strokes, japanese aesthetic, meditative',
        mood: 'zen, minimal, meditative, elegant, serene',
        color: 'black ink, gray wash, white space, monochrome, subtle tones',
        tech: 'sumi-e, minimal brushwork, negative space, flowing strokes, zen rendering',
        ref: 'inspired by sumi-e, japanese ink painting',
        negative: 'colorful, bold, detailed, western, realistic, ornate'
      },
      '韩国青瓷': {
        core: 'korean celadon, goryeo jade porcelain',
        detail: 'korean celadon, goryeo celadon, jade green glaze, inlaid detail, elegant form, korean ceramics, subtle pattern, refined surface, traditional',
        mood: 'elegant, refined, serene, traditional, subtle',
        color: 'jade green, korean celadon, pale glaze, soft tone, luminous surface',
        tech: 'goryeo celadon, inlaid detail, jade glaze, elegant form, refined surface',
        ref: 'inspired by goryeo celadon, korean porcelain',
        negative: 'photorealistic, digital, neon, bold, ornate, glossy'
      },
      '越南漆画': {
        core: 'vietnamese lacquer painting, glossy layered art',
        detail: 'vietnamese lacquer painting, glossy lacquer, layered color, gold and eggshell inlay, deep surface, traditional craft, luminous finish, rich texture',
        mood: 'glossy, rich, layered, traditional, luminous',
        color: 'lacquer tones, deep black, gold, eggshell white, rich color, glossy hues',
        tech: 'lacquer surface, layered color, gold inlay, eggshell detail, glossy finish',
        ref: 'inspired by vietnamese lacquer painting, son mai art',
        negative: 'photorealistic, digital, neon, matte, minimal, plain'
      },
      '泰国壁画': {
        core: 'thai mural painting, temple narrative art',
        detail: 'thai mural painting, temple narrative, gold detail, vivid color, buddhist scenes, ornate pattern, traditional thai, cultural imagery, luminous',
        mood: 'ornate, vivid, sacred, traditional, cultural',
        color: 'gold, vivid thai palette, rich color, ornate tones, luminous accents',
        tech: 'temple mural, gold detail, buddhist scene, ornate pattern, traditional rendering',
        ref: 'inspired by thai temple murals, buddhist wall art',
        negative: 'photorealistic, digital, neon, minimal, muted, modern'
      },
      '缅甸漆器': {
        core: 'burmese lacquerware, engraved lacquer craft',
        detail: 'burmese lacquerware, engraved lacquer, intricate pattern, black and red, gold detail, traditional craft, myanmar art, ornate surface, handcrafted',
        mood: 'ornate, intricate, traditional, handcrafted, refined',
        color: 'lacquer black, deep red, gold detail, engraved tones, rich palette',
        tech: 'engraved lacquer, intricate pattern, gold detail, traditional craft, ornate surface',
        ref: 'inspired by burmese lacquerware, myanmar lacquer craft',
        negative: 'photorealistic, digital, neon, matte, plain, minimal'
      },
      '柬埔寨吴哥': {
        core: 'angkor style, khmer temple art',
        detail: 'angkor style, khmer temple art, sandstone carving, ancient relief, temple architecture, apsara figures, historic detail, weathered stone, cultural',
        mood: 'ancient, majestic, historic, cultural, weathered',
        color: 'sandstone, stone gray, weathered tones, earthy palette, muted hues',
        tech: 'sandstone carving, ancient relief, temple detail, apsara figure, historic rendering',
        ref: 'inspired by angkor wat, khmer temple art',
        negative: 'photorealistic, digital, neon, modern, glossy, minimal'
      },
      '土耳其瓷砖': {
        core: 'turkish tile, iznik ceramic pattern',
        detail: 'turkish tile, iznik ceramic, floral pattern, blue and red, geometric border, glazed tile, ottoman art, ornate detail, traditional craft',
        mood: 'ornate, traditional, vivid, geometric, cultural',
        color: 'iznik blue, red, turquoise, white, floral tones, rich palette',
        tech: 'iznik tile, floral pattern, geometric border, glazed surface, ornate detail',
        ref: 'inspired by iznik tiles, turkish ottoman ceramics',
        negative: 'photorealistic, digital, neon, minimal, muted, modern'
      },
      '摩洛哥瓷砖': {
        core: 'moroccan tile, zellige geometric mosaic',
        detail: 'moroccan tile, zellige mosaic, geometric pattern, intricate tilework, bold color, islamic design, handcrafted, ornate surface, cultural',
        mood: 'geometric, ornate, vibrant, cultural, intricate',
        color: 'moroccan palette, bold color, geometric tones, rich hues, vibrant accents',
        tech: 'zellige mosaic, geometric pattern, intricate tilework, bold color, ornate surface',
        ref: 'inspired by moroccan zellige tilework',
        negative: 'photorealistic, digital, neon, minimal, muted, plain'
      },
      '西班牙摩尔': {
        core: 'moorish style, andalusian islamic art',
        detail: 'moorish style, andalusian islamic art, horseshoe arch, intricate arabesque, geometric pattern, alhambra detail, ornate architecture, cultural fusion',
        mood: 'ornate, geometric, historic, cultural, majestic',
        color: 'moorish palette, earth tones, blue accents, gold detail, rich hues',
        tech: 'horseshoe arch, arabesque pattern, geometric detail, alhambra rendering, ornate architecture',
        ref: 'inspired by alhambra, moorish andalusian art',
        negative: 'photorealistic, digital, neon, minimal, modern, plain'
      },
      '葡萄牙蓝瓷': {
        core: 'portuguese azulejo, blue tile art',
        detail: 'portuguese azulejo, blue tile, white background, cobalt pattern, ceramic tile, historic scenes, traditional craft, ornate detail, cultural',
        mood: 'traditional, historic, elegant, ornate, cultural',
        color: 'cobalt blue, white, azulejo tones, blue pattern, classic palette',
        tech: 'azulejo tile, cobalt pattern, ceramic detail, historic scene, traditional rendering',
        ref: 'inspired by portuguese azulejo tiles',
        negative: 'photorealistic, digital, neon, minimal, muted, modern'
      },
      '荷兰代尔夫特': {
        core: 'delftware, dutch blue and white ceramic',
        detail: 'delftware, dutch blue and white, ceramic tile, floral pattern, delft blue, traditional craft, dutch pottery, ornate detail, classic',
        mood: 'classic, traditional, elegant, ornate, refined',
        color: 'delft blue, white, blue pattern, classic palette, refined tones',
        tech: 'delftware, blue and white, floral pattern, ceramic detail, traditional rendering',
        ref: 'inspired by delftware, dutch blue and white ceramics',
        negative: 'photorealistic, digital, neon, minimal, muted, modern'
      },
      '英国水彩': {
        core: 'british watercolor, romantic landscape art',
        detail: 'british watercolor, romantic landscape, soft wash, atmospheric sky, countryside scene, delicate color, classical tradition, gentle light, refined',
        mood: 'romantic, gentle, atmospheric, refined, serene',
        color: 'soft watercolor, muted palette, atmospheric tones, gentle hues, delicate color',
        tech: 'soft wash, atmospheric sky, delicate color, romantic landscape, refined rendering',
        ref: 'inspired by turner, british watercolor tradition',
        negative: 'photorealistic, digital, neon, bold, heavy, glossy'
      },
      '俄罗斯套娃': {
        core: 'matryoshka style, russian folk doll art',
        detail: 'matryoshka style, russian folk doll, nested dolls, floral pattern, bright color, folk art, traditional russian, ornate detail, cultural',
        mood: 'folk, bright, playful, traditional, cultural',
        color: 'bright russian palette, folk color, floral tones, rich hues, vibrant accents',
        tech: 'nested doll, floral pattern, folk detail, bright color, traditional rendering',
        ref: 'inspired by matryoshka dolls, russian folk art',
        negative: 'photorealistic, digital, neon, minimal, muted, modern'
      },
      '印度细密画': {
        core: 'indian miniature, mughal court painting',
        detail: 'indian miniature, mughal court painting, fine detail, vivid color, royal scenes, gold accent, traditional indian art, ornate composition, cultural',
        mood: 'ornate, vivid, royal, intricate, cultural',
        color: 'vivid indian palette, gold accent, rich color, jewel tones, ornate hues',
        tech: 'miniature detail, gold accent, royal scene, intricate composition, traditional rendering',
        ref: 'inspired by mughal miniature painting, indian court art',
        negative: 'photorealistic, digital, neon, minimal, muted, modern'
      },
      '波斯蓝陶': {
        core: 'persian blue ceramic, turquoise glazed pottery',
        detail: 'persian blue ceramic, turquoise glaze, intricate pattern, floral detail, persian pottery, traditional craft, luminous surface, ornate',
        mood: 'ornate, luminous, traditional, intricate, cultural',
        color: 'persian blue, turquoise, cobalt, floral tones, rich palette, luminous glaze',
        tech: 'turquoise glaze, intricate pattern, floral detail, persian pottery, ornate rendering',
        ref: 'inspired by persian blue ceramics, turquoise pottery',
        negative: 'photorealistic, digital, neon, minimal, muted, modern'
      },
      '阿拉伯书法': {
        core: 'arabic calligraphy, flowing script art',
        detail: 'arabic calligraphy, flowing script, calligraphic line, ornamental lettering, islamic art, intricate strokes, cultural art, decorative, elegant',
        mood: 'elegant, flowing, ornamental, cultural, spiritual',
        color: 'ink black, gold accent, calligraphic tones, muted palette, elegant hues',
        tech: 'flowing script, calligraphic line, ornamental lettering, intricate strokes, elegant rendering',
        ref: 'inspired by arabic calligraphy, islamic script art',
        negative: 'photorealistic, digital, neon, minimal, modern, plain'
      },
      '埃塞俄比亚圣像': {
        core: 'ethiopian icon, orthodox african sacred art',
        detail: 'ethiopian icon, orthodox african sacred art, stylized figures, bold color, religious imagery, traditional craft, african orthodox, luminous detail',
        mood: 'sacred, bold, stylized, traditional, cultural',
        color: 'bold ethiopian palette, rich color, sacred tones, luminous accents, vibrant hues',
        tech: 'stylized figure, bold color, religious imagery, traditional craft, luminous detail',
        ref: 'inspired by ethiopian orthodox icon painting',
        negative: 'photorealistic, digital, neon, modern, minimal, realistic'
      },
      '毛利纹身': {
        core: 'maori tattoo, ta moko facial pattern',
        detail: 'maori tattoo, ta moko, facial pattern, spiral motif, bold line, cultural marking, indigenous art, intricate pattern, dark ink, traditional',
        mood: 'bold, cultural, intricate, powerful, traditional',
        color: 'dark ink, black, bold line, spiral tones, muted palette, stark contrast',
        tech: 'ta moko, spiral motif, bold line, facial pattern, intricate rendering',
        ref: 'inspired by maori ta moko, indigenous tattoo art',
        negative: 'photorealistic, digital, neon, minimal, colorful, modern'
      },
      '波利尼西亚纹样': {
        core: 'polynesian pattern, oceanic tribal design',
        detail: 'polynesian pattern, oceanic tribal design, geometric motif, wave pattern, tiki figure, cultural marking, bold line, traditional, intricate',
        mood: 'bold, cultural, geometric, traditional, powerful',
        color: 'dark ink, bold line, geometric tones, muted palette, stark contrast',
        tech: 'geometric motif, wave pattern, tiki figure, bold line, intricate rendering',
        ref: 'inspired by polynesian tribal patterns, oceanic art',
        negative: 'photorealistic, digital, neon, minimal, colorful, modern'
      },
      '因纽特雕刻': {
        core: 'inuit carving, arctic stone sculpture',
        detail: 'inuit carving, arctic stone, soapstone sculpture, smooth form, animal figure, indigenous art, natural material, traditional craft, minimal detail',
        mood: 'smooth, natural, minimal, traditional, cultural',
        color: 'soapstone, dark stone, natural tones, muted palette, earthy hues',
        tech: 'soapstone carving, smooth form, animal figure, natural material, minimal detail',
        ref: 'inspired by inuit carving, arctic soapstone sculpture',
        negative: 'photorealistic, digital, neon, ornate, colorful, modern'
      },
      '澳洲原住民点画': {
        core: 'aboriginal dot painting, australian indigenous art',
        detail: 'aboriginal dot painting, dot pattern, earthy color, dreamtime imagery, indigenous art, australian culture, intricate dotwork, traditional, symbolic',
        mood: 'earthy, symbolic, intricate, traditional, cultural',
        color: 'earthy palette, ochre, red, dot tones, natural hues, muted accents',
        tech: 'dot pattern, dreamtime imagery, intricate dotwork, earthy color, symbolic rendering',
        ref: 'inspired by australian aboriginal dot painting',
        negative: 'photorealistic, digital, neon, minimal, modern, plain'
      },
      '蒸汽波霓虹': {
        core: 'vaporwave neon, retro futuristic glow',
        detail: 'vaporwave neon, retro futuristic, neon glow, pastel palette, retro digital, synthwave, chrome accents, dreamy haze, 80s futurism, contemporary',
        mood: 'retro, dreamy, neon, futuristic, nostalgic',
        color: 'neon pink, cyan, purple, pastel tones, chrome accents, glowing hues',
        tech: 'neon glow, pastel palette, chrome accent, retro digital, dreamy haze',
        ref: 'inspired by vaporwave, synthwave aesthetics',
        negative: 'realistic, natural, muted, traditional, minimal, analog'
      },
      '故障波普': {
        core: 'glitch pop, corrupted pop art',
        detail: 'glitch pop, corrupted pop art, digital distortion, pop imagery, glitch effect, bold color, pixel break, contemporary, ironic',
        mood: 'glitchy, bold, ironic, contemporary, digital',
        color: 'bold pop color, glitch tones, saturated hues, corrupted accents, vivid palette',
        tech: 'digital distortion, glitch effect, pixel break, bold color, corrupted rendering',
        ref: 'inspired by glitch art fused with pop aesthetics',
        negative: 'clean, realistic, smooth, traditional, minimal, analog'
      },
      '复古像素': {
        core: 'retro pixel, classic 8-bit game art',
        detail: 'retro pixel, classic 8-bit, pixel grid, limited palette, chunky sprite, retro game, nostalgic, blocky detail, old-school digital',
        mood: 'retro, nostalgic, blocky, playful, classic',
        color: 'limited palette, 8-bit color, retro tones, blocky hues, saturated accents',
        tech: 'pixel grid, limited palette, chunky sprite, blocky detail, retro rendering',
        ref: 'inspired by 8-bit retro games, classic pixel art',
        negative: 'smooth, realistic, high-res, modern, organic, flat'
      },
      '低保真': {
        core: 'lo-fi aesthetic, low fidelity retro charm',
        detail: 'lo-fi aesthetic, low fidelity, grainy texture, muted color, retro feel, imperfect charm, analog warmth, nostalgic, cozy, contemporary',
        mood: 'cozy, nostalgic, warm, retro, intimate',
        color: 'muted palette, grainy tones, warm hues, faded color, analog tones',
        tech: 'grainy texture, low fidelity, analog warmth, muted color, retro rendering',
        ref: 'inspired by lo-fi aesthetics, analog retro charm',
        negative: 'high fidelity, clean, sharp, glossy, modern, digital'
      },
      '酸性设计': {
        core: 'acid design, psychedelic neon graphic',
        detail: 'acid design, psychedelic neon, bold gradient, distorted type, iridescent color, liquid metal, surreal graphic, contemporary, vibrant',
        mood: 'psychedelic, vibrant, bold, surreal, contemporary',
        color: 'acid palette, neon gradient, iridescent tones, bold hues, liquid accents',
        tech: 'distorted type, bold gradient, iridescent color, liquid metal, surreal graphic',
        ref: 'inspired by acid design, psychedelic graphic art',
        negative: 'clean, minimal, traditional, muted, realistic, plain'
      },
      '后现代主义': {
        core: 'postmodernism, eclectic contemporary art',
        detail: 'postmodernism, eclectic contemporary, mixed styles, ironic reference, playful pastiche, bold juxtaposition, cultural commentary, diverse, contemporary',
        mood: 'eclectic, ironic, playful, contemporary, diverse',
        color: 'eclectic palette, mixed color, bold tones, varied hues, contemporary accents',
        tech: 'mixed styles, ironic reference, playful pastiche, bold juxtaposition, cultural commentary',
        ref: 'inspired by postmodernism, eclectic contemporary art',
        negative: 'unified, minimal, traditional, coherent, plain, classic'
      },
      '新几何主义': {
        core: 'neo-geo, contemporary geometric abstraction',
        detail: 'neo-geo, contemporary geometric, precise shapes, bold color, clean form, modern abstraction, hard edge, commercial polish, contemporary',
        mood: 'precise, bold, modern, clean, contemporary',
        color: 'bold geometric color, flat tones, primary palette, clean hues, modern accents',
        tech: 'precise shapes, bold color, hard edge, clean form, modern abstraction',
        ref: 'inspired by neo-geo, contemporary geometric art',
        negative: 'organic, curved, messy, textured, realistic, ornate'
      },
      '极简未来': {
        core: 'minimal futuristic, clean sci-fi design',
        detail: 'minimal futuristic, clean sci-fi, sleek surfaces, simple forms, futuristic tech, white space, elegant minimalism, modern design, high-tech',
        mood: 'clean, futuristic, sleek, minimal, elegant',
        color: 'white, silver, monochrome, cool tones, single accent, restrained palette',
        tech: 'sleek surface, simple form, futuristic tech, white space, elegant minimalism',
        ref: 'inspired by minimal futuristic design, sleek sci-fi aesthetics',
        negative: 'cluttered, ornate, retro, busy, textured, complex'
      },
      '赛博巴洛克': {
        core: 'cyber baroque, ornate futuristic opulence',
        detail: 'cyber baroque, ornate futuristic, baroque detail, neon opulence, digital gilding, futuristic ornament, fusion aesthetic, lavish, high-tech',
        mood: 'ornate, opulent, futuristic, lavish, dramatic',
        color: 'neon accents, gold, cyber palette, rich tones, glowing hues, ornate color',
        tech: 'baroque detail, neon opulence, digital gilding, futuristic ornament, fusion rendering',
        ref: 'inspired by baroque opulence fused with cyberpunk',
        negative: 'minimal, plain, clean, muted, traditional, simple'
      },
      '蒸汽洛可可': {
        core: 'steam rococo, ornate industrial elegance',
        detail: 'steam rococo, ornate industrial, rococo detail, brass machinery, delicate ornament, steam tech, fusion aesthetic, elegant, intricate',
        mood: 'ornate, elegant, intricate, industrial, refined',
        color: 'brass, gold, pastel tones, warm metal, steam hues, delicate accents',
        tech: 'rococo detail, brass machinery, delicate ornament, steam tech, fusion rendering',
        ref: 'inspired by rococo elegance fused with steampunk',
        negative: 'minimal, plain, clean, muted, modern, simple'
      },
      '暗黑童话': {
        core: 'dark fairy tale, gothic storybook art',
        detail: 'dark fairy tale, gothic storybook, eerie forest, twisted imagery, melancholic mood, storybook detail, gothic charm, haunting, atmospheric',
        mood: 'dark, haunting, melancholic, gothic, atmospheric',
        color: 'dark palette, muted tones, deep hues, gothic accents, shadowy color',
        tech: 'storybook detail, eerie forest, gothic charm, haunting atmosphere, dark rendering',
        ref: 'inspired by dark fairy tales, gothic storybook art',
        negative: 'bright, cheerful, realistic, minimal, plain, modern'
      },
      '霓虹波普': {
        core: 'neon pop, glowing pop art',
        detail: 'neon pop, glowing pop art, neon glow, pop imagery, bright color, luminous detail, contemporary, vibrant, urban',
        mood: 'vibrant, glowing, bold, contemporary, urban',
        color: 'neon palette, glowing color, bright pop tones, luminous hues, vivid accents',
        tech: 'neon glow, pop imagery, bright color, luminous detail, vibrant rendering',
        ref: 'inspired by neon pop art, glowing urban aesthetics',
        negative: 'muted, realistic, traditional, minimal, plain, analog'
      }
    },
    keywords: ['风格', '画风', 'style', '类型', '风', '系', '派']
  },

  lighting: {
    name: '光线',
    categories: {
      '电影级侧光': {
        core: 'cinematic rim lighting, dramatic edge illumination',
        detail: 'strong key light from 45-degree angle, subtle fill light, hair light separation, controlled shadows, 3-point lighting setup, motivated light source',
        mood: 'dramatic, sculptural, professional, dimensional',
        color: 'warm key 3200K, cool fill 5600K, neutral rim, subtle color contrast between light and shadow',
        tech: 'softbox key, reflector fill, fresnel rim, light ratio 4:1, barn doors, grid',
        ref: 'cinematography by Roger Deakins, Emmanuel Lubezki',
        negative: 'flat, on-camera flash, harsh direct sun, muddy, no shadows'
      },
      '冷蓝月光': {
        core: 'cool moonlight, ethereal blue night illumination',
        detail: 'silver-blue moonlight casting long shadows, star-lit sky, subtle ambient glow, moon reflection on surfaces, lunar halo, night atmosphere',
        mood: 'mysterious, serene, melancholic, romantic, magical',
        color: 'silver blue, cyan cast, deep navy shadows, cool white highlights, pale lavender ambient',
        tech: 'moonlight at 5600K, long exposure feel, subtle star trails, soft shadow edges, atmospheric night haze',
        ref: 'moonlit scenes from Crouching Tiger Hidden Dragon, Van Gogh Starry Night',
        negative: 'warm, daylight, golden, neon, bright, harsh, direct sun'
      },
      '暖金黄昏': {
        core: 'warm golden hour, magical sunset glow',
        detail: 'low-angle sun, long dramatic shadows, golden rim light on subjects, warm atmosphere, sun flare, lens dust, amber sky gradient',
        mood: 'nostalgic, romantic, peaceful, epic, bittersweet',
        color: 'golden amber, warm orange, peach sky, deep purple shadows, rose gold highlights',
        tech: 'golden hour at 3500K, 85mm lens flare, backlit haze, long shadow projection, warm color cast',
        ref: 'golden hour cinematography from Days of Heaven, Lawrence of Arabia',
        negative: 'cool, blue, night, neon, overcast, harsh midday, sterile'
      },
      '霓虹彩光': {
        core: 'neon lighting, colorful urban glow, vibrant reflections',
        detail: 'multiple colored neon sources, wet surface reflections, light bleeding, fog diffusion, animated signs, cyberpunk street lighting, light pollution',
        mood: 'energetic, edgy, nocturnal, futuristic, underground',
        color: 'neon cyan, hot pink, electric purple, acid green, amber streetlight, deep black shadows',
        tech: 'neon tube glow, light bloom, chromatic aberration, wet asphalt reflection, volumetric light haze, lens flare',
        ref: 'Blade Runner 2049, Enter the Void, Wong Kar-wai neon aesthetics',
        negative: 'natural, daylight, warm cozy, candle, fireplace, rural, sunlight'
      },
      '雾中光': {
        core: 'volumetric fog lighting, god rays, atmospheric mist',
        detail: 'light beams piercing through fog, crepuscular rays, layered mist depth, light scattering, ethereal glow, moisture particles, dawn mist over water',
        mood: 'mystical, ethereal, contemplative, mysterious, transcendent',
        color: 'soft white, pale silver, cool blue-grey mist, warm golden rays, desaturated ambient',
        tech: 'volumetric light scattering, god rays, fog density layers, atmospheric perspective, aerial perspective',
        ref: 'misty mountain photography, Chinese landscape painting atmosphere',
        negative: 'clear, sharp, harsh, direct, no atmosphere, flat, dry'
      },
      '戏剧对比': {
        core: 'chiaroscuro, dramatic high-contrast lighting',
        detail: 'strong single light source, deep black shadows, sharp shadow edges, selective illumination, theatrical spotlight, film noir aesthetic',
        mood: 'intense, dramatic, mysterious, powerful, baroque',
        color: 'extreme contrast, near-black shadows, selective warm/cool, monochromatic light, silver highlights',
        tech: 'single source, hard light, no fill, 8:1 contrast ratio, snoot, fresnel spot, gobo patterns',
        ref: 'Rembrandt lighting, Caravaggio paintings, film noir cinematography',
        negative: 'flat, soft, diffused, overcast, even, fill flash, HDR, bright'
      },
      '逆光剪影': {
        core: 'backlighting, dramatic silhouette, contre-jour',
        detail: 'subject in shadow against bright background, golden rim light outlining edges, lens flare, sun behind subject, translucent materials glowing',
        mood: 'heroic, anonymous, dramatic, dreamy, iconic',
        color: 'warm backlight, silhouette black, rim gold, sky gradient, sunburst',
        tech: 'f/16 for sun star, backlit exposure, rim light separation, lens flare artifacts, underexposed foreground',
        ref: 'silhouette photography, Terrence Malick magic hour silhouettes',
        negative: 'front-lit, flat, fill flash, even, shadowless, cloudy'
      },
      '自然日光': {
        core: 'natural daylight, bright sun, clear sky illumination',
        detail: 'direct sunlight, blue sky ambient, crisp shadows, natural highlights, outdoor atmosphere, sun dappling through leaves',
        mood: 'fresh, vibrant, energetic, authentic, open',
        color: 'natural white balance 5500K, blue sky, green foliage, true colors, slight warm shift',
        tech: 'natural light, available light, reflector fill, dappled light, sun flare, polarizer effect',
        ref: 'natural light photography, plein air painting',
        negative: 'artificial, studio, neon, night, warm tungsten, colored gels'
      },
      '柔光漫射': {
        core: 'soft diffused lighting, gentle wraparound illumination',
        detail: 'overcast sky, window light, softbox diffusion, shadowless, even wrap, product photography light, beauty lighting',
        mood: 'gentle, peaceful, dreamy, pure, intimate',
        color: 'neutral white, soft pastel cast, even tones, subtle warmth, clean highlights',
        tech: 'large softbox, scrim diffusion, butterfly lighting, clamshell, 1:1 ratio, fill-dominant',
        ref: 'beauty photography, product catalog, window light portraits',
        negative: 'harsh, direct, contrasty, hard shadows, dramatic, spotlight'
      },
      '烛火光': {
        core: 'candlelight, firelight, warm intimate illumination',
        detail: 'flickering candle flame, warm glow on faces, dancing shadows, multiple candles, fireplace embers, intimate circle of light, smoke wisps',
        mood: 'intimate, romantic, medieval, sacred, mysterious',
        color: 'warm amber 1800K, orange flame, deep brown shadows, golden glow, smoke grey',
        tech: 'practical light source, fire flicker, warm color cast, shallow depth, smoke atmosphere, lens flare from flame',
        ref: 'Barry Lyndon candlelight scenes, Caravaggio tenebrism',
        negative: 'daylight, cool, neon, bright, modern, electric, sterile'
      },
      '暗调低调': {
        core: 'low-key lighting, dark moody atmosphere',
        detail: 'predominantly dark frame, minimal illumination, shadow detail, single motivated source, film noir, horror lighting, negative fill',
        mood: 'ominous, tense, mysterious, brooding, noir',
        color: 'deep blacks, selective desaturation, single color cast, muted tones, crushed shadows',
        tech: 'low-key ratio 8:1+, negative fill, hard source, smoke for atmosphere, underexposure, crushed blacks',
        ref: 'The Godfather cinematography, David Fincher dark aesthetic',
        negative: 'bright, high-key, even, fill, HDR, overexposed, cheerful, daylight'
      },
      '黄金时刻': {
        core: 'warm golden sunlight during magic hour',
        detail: 'soft directional light, long shadows, warm amber tones, golden rim highlights, low contrast, flattering skin tones, atmospheric haze, cinematic glow, rich saturation, elongated silhouettes, natural backlight, serene mood, honeyed sunlight, gentle transition, luminous warmth',
        tech: 'low sun angle, diffused scattering, warm color temperature 3500K, Rayleigh scattering, long shadow cast, lens flare potential, golden hour window, high CRI ambient, backlit rim separation, sun near horizon'
      },
      '蓝调时刻': {
        core: 'cool twilight blue ambient skylight glow',
        detail: 'deep blue ambient fill, soft diffused illumination, twilight gradient sky, cool color cast, low light levels, serene mood, city lights contrast, silhouettes visible, gentle shadows, calm atmosphere, transitional light, mystical quality, quiet solitude, ethereal blue veil',
        tech: 'solar depression angle, dominant blue wavelength, low luminance, high ISO requirement, long exposure, cool color temperature 8000K+, twilight zone, ambient skylight only, no direct sun, cyan-blue shift'
      },
      '顶光': {
        core: 'harsh overhead midday direct sunlight casting',
        detail: 'deep eye socket shadows, strong downward shadows, high contrast, unflattering facial shadows, bright highlights on top surfaces, short shadow length, intense brightness, stark definition, minimal diffusion, washed out colors, hard specular highlights, noon harshness',
        tech: '90-degree incident angle, high luminance ratio, hard shadow edge, noon sun position, maximum UV exposure, stop difference 4+, small catchlight, overhead key source, direct beam, no modifier'
      },
      '底光': {
        core: 'unnatural upward light from below subject',
        detail: 'reverse shadow direction, dramatic underlighting, eerie facial shadows, horror film aesthetic, unsettling mood, distorted features, theatrical effect, intense ground reflection, mysterious atmosphere, unnatural highlight placement, sinister undertone, inverted illumination logic',
        tech: 'bottom-up incident angle, inverted shadow logic, low key ratio, dramatic single source, footlight placement, unnatural highlight, upward cast shadow, reverse fill, ground bounce, horror lighting'
      },
      '伦勃朗光': {
        core: 'classic triangle light patch under shadowed eye',
        detail: 'dramatic chiaroscuro, triangular light patch on cheek, one side illuminated, deep shadow side, painterly quality, dimensional depth, moody atmosphere, sculptural face definition, timeless portrait look, artistic mastery, rich tonal gradation, Old Master aesthetic',
        tech: '45-degree key light angle, 1:4 lighting ratio, short lighting pattern, Rembrandt triangle, single key with fill, barndoor control, 3/4 facial view, flagged spill, precise feathering, hard source'
      },
      '蝴蝶光': {
        core: 'symmetrical butterfly shadow under the nose',
        detail: 'glamour portrait lighting, butterfly-shaped nose shadow, symmetrical face illumination, cheekbone highlight, defined jawline, beauty fashion standard, elevated key light, flattering shadow falloff, polished elegant look, refined contour, celebrity headshot aesthetic',
        tech: 'high front key position, 25-30 degree above eye level, narrow nose shadow, clamshell reflector fill, Paramount lighting pattern, beauty dish modifier, centered key axis, symmetrical catchlights, chin shadow control'
      },
      '环形光': {
        core: 'small nose shadow loop on the cheek',
        detail: 'gentle directional shadow, subtle face contouring, natural portrait look, small loop shadow from nose, flattering for most faces, balanced light ratio, soft dimensionality, versatile standard lighting, approachable aesthetic, moderate depth, everyday portrait look',
        tech: '30-45 degree key angle, slight above eye level, 1:3 lighting ratio, small shadow loop, short or broad pattern, softbox modifier, catchlight in both eyes, moderate contrast, forgiving light placement'
      },
      '窗光': {
        core: 'soft natural daylight streaming through window',
        detail: 'directional ambient illumination, soft falloff gradient, natural catchlights, indoor cozy atmosphere, gentle shadow transition, north-facing preferred, creamy skin tones, intimate setting, Vermeer painting quality, quiet contemplation, domestic tranquility, natural beauty',
        tech: 'large area source, inverse square falloff, soft shadow edge transfer, ambient daylight color, window as diffuser, single direction source, available light photography, north light consistency, sheer curtain diffusion, natural reflector walls'
      },
      '硬光': {
        core: 'crisp defined shadows with sharp edges',
        detail: 'well-defined shadow edges, high contrast ratio, intense direct beam, dramatic texture emphasis, strong specular highlights, bold definition, stark light-shadow transition, graphic quality, intense midday sun feel, harsh brilliance, uncompromising clarity, aggressive illumination',
        tech: 'small source relative to subject, point source approximation, hard shadow transfer edge, high stop difference, bare bulb or fresnel, no diffusion modifier, specular reflection dominant, collimated beam, crisp penumbra, direct flash'
      },
      '柔光箱': {
        core: 'large softbox diffused lighting, even wraparound illumination',
        detail: 'large rectangular soft source, smooth even falloff, soft catchlights, gentle shadow transition, flattering skin tones, controlled diffusion, studio beauty light, uniform illumination, minimal shadow contrast, creamy highlight wrap',
        mood: 'clean, professional, flattering, polished, gentle',
        color: 'neutral white, soft even tones, subtle warm cast, clean highlights, balanced exposure',
        tech: 'large softbox modifier, 1:1 to 1:2 ratio, close modifier distance, diffusion panel, beauty dish alternative, even light spread, soft shadow edge, high CRI source',
        ref: 'inspired by beauty and product photography softbox setups',
        negative: 'harsh, direct, hard shadows, spotlight, contrasty, dramatic, bare bulb'
      },
      '聚光灯': {
        core: 'focused spotlight beam, dramatic single-source illumination',
        detail: 'narrow concentrated beam, sharp pool of light, strong falloff at edges, theatrical spotlight, stage performance light, focused subject isolation, dramatic contrast, visible light cone, single dominant source, spotlight circle on floor',
        mood: 'dramatic, theatrical, focused, intense, spotlighted',
        color: 'warm tungsten beam, concentrated bright center, deep shadow surround, subtle color temperature shift, amber edge falloff',
        tech: 'fresnel spotlight, narrow beam angle, snoot attachment, gobo projection, high contrast ratio, focused beam edge, theatrical lighting rig, single point source, 10-30 degree beam',
        ref: 'inspired by stage and theatrical spotlight cinematography',
        negative: 'even, flat, diffused, broad, soft, ambient, natural'
      },
      '背光剪影': {
        core: 'strong backlight creating dramatic silhouette',
        detail: 'subject rendered as dark silhouette against bright background, strong rim glow, contre-jour lighting, dramatic outline, backlit haze, sunburst behind subject, edge definition, mysterious anonymous figure, high contrast separation, luminous backdrop',
        mood: 'dramatic, mysterious, iconic, cinematic, heroic',
        color: 'bright warm backdrop, deep black subject, golden rim, sky gradient, sunburst flare',
        tech: 'strong backlight source, underexposed subject, rim light separation, lens flare, high contrast ratio, contre-jour technique, backlit exposure compensation, silhouette metering',
        ref: 'inspired by silhouette and contre-jour photography',
        negative: 'front-lit, flat, even, fill flash, shadowless, low contrast'
      },
      '轮廓光': {
        core: 'rim lighting outlining subject edges with light',
        detail: 'thin bright line of light along subject edges, hair light glow, edge separation from background, halo effect, back-rim combination, sculptural outline, luminous contour, subject pop from background, subtle glow on edges, three-dimensional definition',
        mood: 'dramatic, dimensional, cinematic, elegant, separated',
        color: 'bright edge highlight, warm or cool rim cast, dark subject core, luminous halo, subtle color edge',
        tech: 'rim light placement behind subject, hair light, edge separation, low fill ratio, backlight kicker, narrow light source, edge glow, 3-point lighting rim component',
        ref: 'inspired by cinematic rim lighting in portrait photography',
        negative: 'flat, front-lit, no separation, soft even, shadowless'
      },
      '环境光': {
        core: 'natural ambient environmental illumination',
        detail: 'soft overall illumination from surroundings, no dominant light source, even natural fill, atmospheric light, skylight bounce, reflected light, gentle shadows, realistic natural exposure, ambient occlusion, scene-wide soft glow',
        mood: 'natural, calm, realistic, unobtrusive, atmospheric',
        color: 'natural color balance, environment-tinted light, soft neutral tones, subtle ambient cast, true-to-life colors',
        tech: 'available ambient light, bounce light, skylight, environment lighting, global illumination, no artificial source, natural exposure, ambient occlusion, soft shadow transfer',
        ref: 'inspired by natural ambient light photography',
        negative: 'harsh, dramatic, spotlight, studio, artificial, high contrast'
      },
      '月光': {
        core: 'cool silvery moonlight illumination',
        detail: 'pale blue-silver light, soft moonlit glow, long soft shadows, lunar atmosphere, starry night ambient, moon reflection, ethereal night quality, cool color cast, gentle illumination, nocturnal mood',
        mood: 'serene, mysterious, romantic, ethereal, nocturnal',
        color: 'silver blue, cool cyan cast, deep navy shadows, pale white highlights, moonlit ambient',
        tech: 'moonlight color temperature 8000K+, long exposure, soft shadow edges, night ambient, cool white balance, lunar glow, atmospheric haze',
        ref: 'inspired by moonlit night scenes in cinema',
        negative: 'warm, golden, daylight, bright, neon, harsh, sunny'
      },
      '烛光': {
        core: 'warm flickering candlelight illumination',
        detail: 'soft warm glow from candle flames, flickering light, intimate circle of light, dancing shadows, warm amber tones, gentle face illumination, sacred intimate atmosphere, smoke wisps, warm highlight, cozy darkness surround',
        mood: 'intimate, romantic, warm, sacred, cozy',
        color: 'warm amber 1800K, orange flame, golden glow, deep warm shadows, honey tones',
        tech: 'practical candle source, fire flicker, warm color cast, shallow depth, low light, warm tungsten balance, intimate exposure, smoke atmosphere',
        ref: 'inspired by candlelit scenes in period films',
        negative: 'cool, daylight, bright, neon, modern, electric, sterile'
      },
      '霓虹光': {
        core: 'vibrant neon tube illumination, colorful glow',
        detail: 'glowing neon tubes, saturated color light, wet surface reflections, light bleed, urban night glow, sign illumination, colorful cast on subjects, electric atmosphere, glowing edges, night city ambiance',
        mood: 'energetic, edgy, nocturnal, futuristic, vibrant',
        color: 'neon cyan, hot pink, electric purple, acid green, saturated glow, deep shadows',
        tech: 'neon tube emission, light bloom, chromatic aberration, wet reflection, volumetric haze, color gel lighting, glow post-processing, night exposure',
        ref: 'inspired by neon-lit city night photography',
        negative: 'natural, daylight, warm cozy, soft, rural, sunlight'
      },
      '闪电光': {
        core: 'dramatic lightning flash illumination',
        detail: 'brief intense flash of light, stark illumination, high contrast, storm atmosphere, electric blue-white flash, momentary exposure, dramatic cloud glow, harsh shadow, charged atmosphere, sudden brightness',
        mood: 'dramatic, intense, electric, stormy, powerful',
        color: 'electric blue-white flash, cool storm cast, deep dark surround, silver highlights, charged atmosphere',
        tech: 'strobe-like flash, high contrast, storm exposure, lightning capture, brief intense source, dramatic shadow, electric color balance',
        ref: 'inspired by storm and lightning photography',
        negative: 'warm, soft, even, gentle, calm, sunny'
      },
      '极光': {
        core: 'ethereal aurora borealis illumination',
        detail: 'shimmering colored light curtains, green and purple glow, night sky illumination, dancing light waves, ethereal glow, arctic atmosphere, reflected light on landscape, magical night sky, soft luminous bands, celestial display',
        mood: 'magical, ethereal, awe-inspiring, serene, otherworldly',
        color: 'aurora green, purple, teal, magenta, deep night blue, luminous gradient',
        tech: 'aurora emission, long exposure, night sky capture, color gradient bands, ethereal glow, arctic night, luminous wave rendering, celestial light',
        ref: 'inspired by aurora borealis night photography',
        negative: 'daylight, warm, sunny, bright, urban, artificial'
      },
      '荧光': {
        core: 'cool fluorescent tube illumination',
        detail: 'cool white-green light, even clinical illumination, slight green cast, office or industrial atmosphere, flat even coverage, cool skin tone, harsh-ish even light, institutional mood, tube light source, cool ambient',
        mood: 'cool, clinical, modern, sterile, institutional',
        color: 'cool white, greenish cast, pale blue-green, flat even tones, cool highlights',
        tech: 'fluorescent tube source, cool color temperature 4000-5000K, even coverage, green cast correction, flat illumination, tube array, industrial lighting',
        ref: 'inspired by fluorescent-lit institutional and office photography',
        negative: 'warm, golden, soft, dramatic, cozy, candlelight'
      },
      '晨光': {
        core: 'soft warm morning sunlight at dawn',
        detail: 'gentle golden morning rays, low-angle warm light, fresh dew atmosphere, soft warm glow, dawn ambience, gentle shadows, warm pastel sky, morning freshness, soft directional light, golden hour warmth',
        mood: 'fresh, hopeful, serene, gentle, peaceful',
        color: 'warm gold, soft amber, pale pink, light peach, warm white',
        tech: 'low-angle warm sunlight, soft golden glow, morning haze, warm color temperature 3000-3500K, gentle shadows, dawn ambience',
        ref: 'inspired by early morning golden hour photography',
        negative: 'harsh, midday, cold, blue, dark, artificial'
      },
      '暮光': {
        core: 'soft fading twilight glow at dusk',
        detail: 'dim warm-purple fading light, last light of day, soft blue hour transition, gentle dusk ambience, muted warm tones, low contrast, calm evening mood, soft silhouettes, twilight gradient sky',
        mood: 'calm, melancholic, romantic, serene, tranquil',
        color: 'dusky purple, warm amber, deep blue, soft violet, muted orange',
        tech: 'twilight color temperature, blue hour transition, soft diffused light, low contrast, dusk gradient, muted tones',
        ref: 'inspired by twilight and blue hour landscape photography',
        negative: 'bright, harsh, midday, harsh shadow, overexposed, artificial'
      },
      '正午烈日': {
        core: 'harsh overhead midday sunlight',
        detail: 'intense overhead sun, strong contrast, harsh shadows, high brightness, washed-out highlights, direct vertical light, sharp shadow edges, glaring brightness, noon intensity, high contrast',
        mood: 'intense, stark, harsh, energetic, unforgiving',
        color: 'bright white, harsh yellow-white, washed pale tones, high-key brightness',
        tech: 'overhead sun at 90 degrees, high contrast, hard shadows, high color temperature 5500-6000K, direct vertical light, glaring highlights',
        ref: 'inspired by harsh midday sun documentary photography',
        negative: 'soft, warm golden, diffused, gentle, low contrast, evening'
      },
      '阴天散射光': {
        core: 'soft diffused light from overcast sky',
        detail: 'even soft light, no harsh shadows, gentle diffused illumination, muted colors, soft contrast, cloudy sky glow, natural softbox effect, flat even lighting, subdued tones, gentle modeling',
        mood: 'calm, soft, muted, gentle, neutral',
        color: 'soft neutral white, muted gray, desaturated tones, even soft tones',
        tech: 'overcast sky diffusion, soft even light, low contrast, no hard shadows, natural softbox, diffused cloud light, muted color rendering',
        ref: 'inspired by overcast day natural light photography',
        negative: 'harsh, direct sun, strong shadow, high contrast, golden, dramatic'
      },
      '水下光': {
        core: 'underwater light with caustics and depth',
        detail: 'sunlight filtering through water, caustic light patterns, blue-green water glow, light shafts underwater, floating particles, refracted light, deep blue ambience, volumetric underwater rays, rippling light',
        mood: 'ethereal, serene, mysterious, immersive, tranquil',
        color: 'aqua blue, teal, cyan, deep blue, turquoise, light shafts white',
        tech: 'underwater caustics, light shafts, volumetric rays, water refraction, blue-green color cast, floating particles, rippling light patterns',
        ref: 'inspired by underwater photography and marine cinematography',
        negative: 'dry, warm, indoor, harsh, red, orange, artificial'
      },
      '火光': {
        core: 'warm flickering firelight glow',
        detail: 'warm orange glow from fire, flickering light, dancing shadows, warm amber highlights, cozy atmosphere, glowing embers, warm skin tones, dynamic flicker, campfire warmth, intense warm core',
        mood: 'warm, cozy, intimate, primal, dramatic',
        color: 'warm orange, amber, deep red, golden yellow, glowing ember',
        tech: 'fire light source, warm color temperature 2000-2500K, flickering light, dancing shadows, warm rim light, glowing embers, high warm contrast',
        ref: 'inspired by campfire and fireplace photography',
        negative: 'cool, blue, daylight, fluorescent, cold, flat'
      },
      '舞台光': {
        core: 'dramatic theatrical stage lighting',
        detail: 'focused spotlights, colored stage beams, dramatic contrast, spotlight on subject, dark background, vivid colored gels, stage haze, rim lighting, theatrical atmosphere, dynamic beams',
        mood: 'dramatic, theatrical, intense, glamorous, dynamic',
        color: 'vivid saturated colors, spotlight white, magenta, cyan, amber gels, deep black background',
        tech: 'stage spotlight, colored gels, dramatic contrast, haze beams, rim light, dark stage background, theatrical lighting rig',
        ref: 'inspired by concert and theater stage photography',
        negative: 'natural, soft, daylight, flat, subtle, realistic'
      },
      '路灯': {
        core: 'warm street lamp illumination at night',
        detail: 'warm sodium lamp glow, pool of light under lamp, night street ambience, warm-orange cast, long shadows, lamp halo, urban night mood, soft falloff, isolated pool of light, night city atmosphere',
        mood: 'nocturnal, moody, nostalgic, urban, intimate',
        color: 'warm orange, sodium yellow, amber, deep night blue shadows, warm halo',
        tech: 'street lamp source, warm sodium color temperature, pool of light, soft falloff, long shadows, night exposure, urban ambience',
        ref: 'inspired by night street photography',
        negative: 'daylight, bright, cold, fluorescent, harsh, sunny'
      },
      '生物发光': {
        core: 'ethereal bioluminescent glow',
        detail: 'glowing organisms emitting soft light, luminous blue-green glow, glowing particles in water, magical light emission, soft neon-like glow, deep sea ambience, glowing trails, luminous dots, otherworldly glow',
        mood: 'magical, ethereal, wondrous, mysterious, surreal',
        color: 'bioluminescent blue, cyan, glowing teal, luminous green, soft neon',
        tech: 'bioluminescent emission, soft luminous glow, glowing particles, deep sea ambience, neon-like soft light, glowing trails, low-light capture',
        ref: 'inspired by bioluminescent plankton and deep sea photography',
        negative: 'daylight, harsh, artificial, warm, bright, fluorescent'
      },
      '篝火光': {
        core: 'warm crackling campfire glow, primal outdoor illumination',
        detail: 'orange flames leaping, dancing firelight on faces, glowing embers, sparks rising, warm pool of light, surrounding darkness, smoke wisps, flickering shadows, rustic outdoor atmosphere, cozy gathering glow',
        mood: 'warm, primal, cozy, nostalgic, communal',
        color: 'warm orange, amber, deep red, golden yellow, glowing ember, dark night surround',
        tech: 'fire light source, warm color temperature 2000K, flickering intensity, dancing shadows, ember glow, spark particles, high warm contrast',
        ref: 'inspired by campfire and bonfire photography',
        negative: 'cool, blue, daylight, fluorescent, cold, flat, artificial'
      },
      '炉火光': {
        core: 'warm hearth firelight, cozy indoor fireplace glow',
        detail: 'fireplace flames, warm glow filling room, dancing firelight on walls, glowing embers, chimney smoke, cozy domestic atmosphere, warm shadows, flickering illumination, rustic interior, intimate warmth',
        mood: 'cozy, warm, intimate, homely, comforting',
        color: 'warm amber, orange glow, deep brown shadows, golden highlights, ember red',
        tech: 'fireplace light source, warm color temperature 2200K, flickering firelight, warm wall wash, dancing shadows, ember glow, cozy exposure',
        ref: 'inspired by cozy fireplace interior photography',
        negative: 'cool, blue, daylight, sterile, bright, modern, fluorescent'
      },
      '星光': {
        core: 'soft twinkling starlight, celestial night illumination',
        detail: 'tiny pinpricks of starlight, soft silver glow, dark night sky, subtle star twinkle, faint ambient illumination, milky way glow, gentle shadows, celestial atmosphere, quiet night, distant sparkle',
        mood: 'serene, contemplative, mystical, vast, tranquil',
        color: 'silver white, pale blue, deep navy, soft white twinkle, cool ambient',
        tech: 'starlight emission, long exposure, faint ambient light, twinkle rendering, dark sky exposure, celestial glow, low light capture',
        ref: 'inspired by astrophotography and starry night scenes',
        negative: 'bright, daylight, warm, harsh, artificial, neon, overexposed'
      },
      '阳光': {
        core: 'bright cheerful sunshine, warm direct sunlight',
        detail: 'radiant sunbeams, warm bright illumination, crisp shadows, vibrant colors, cheerful atmosphere, sunlit surfaces, golden warmth, clear sky light, energetic glow, natural brightness',
        mood: 'cheerful, vibrant, warm, uplifting, bright',
        color: 'warm golden white, bright yellow, clear sky blue, vivid saturated colors, warm highlights',
        tech: 'direct sunlight, warm color temperature 5500K, crisp shadows, bright exposure, sun flare, natural light, vibrant rendering',
        ref: 'inspired by bright sunny day photography',
        negative: 'dark, gloomy, overcast, cold, dull, muted, artificial'
      },
      '黎明光': {
        core: 'soft pale dawn light, first light of morning',
        detail: 'gentle first rays, soft cool-warm transition, pale sky glow, morning mist, dew sparkle, quiet awakening, soft shadows, pastel sky, fresh atmosphere, gradual brightness',
        mood: 'peaceful, hopeful, fresh, serene, quiet',
        color: 'pale pink, soft lavender, light gold, cool blue, gentle white, pastel sky',
        tech: 'low sun angle, soft diffusion, dawn color temperature, gentle shadows, morning haze, pastel rendering, quiet exposure',
        ref: 'inspired by dawn and sunrise landscape photography',
        negative: 'harsh, midday, dark, artificial, neon, overexposed'
      },
      '破晓光': {
        core: 'striking daybreak light, sun rising over horizon',
        detail: 'sun cresting horizon, golden rays spreading, long dramatic shadows, warm glow, atmospheric haze, silhouette landscape, radiant sky, awakening world, crisp morning air, luminous horizon',
        mood: 'hopeful, dramatic, majestic, fresh, inspiring',
        color: 'golden orange, warm amber, soft pink, deep blue sky, radiant white',
        tech: 'low horizon sun, golden rays, long shadows, atmospheric haze, warm color temperature, silhouette rendering, dramatic exposure',
        ref: 'inspired by sunrise photography and dawn cinematography',
        negative: 'night, dark, overcast, dull, artificial, neon'
      },
      '午后光': {
        core: 'warm afternoon sunlight, golden midday warmth',
        detail: 'soft warm afternoon sun, gentle shadows, warm golden tones, relaxed atmosphere, sunlit scenes, lazy warmth, dappled light, comfortable brightness, mellow glow, peaceful afternoon',
        mood: 'relaxed, warm, peaceful, mellow, comfortable',
        color: 'warm gold, soft amber, honey tones, gentle white, warm shadows',
        tech: 'afternoon sun angle, warm color temperature, soft shadows, gentle contrast, dappled light, warm rendering, relaxed exposure',
        ref: 'inspired by warm afternoon natural light photography',
        negative: 'harsh, cold, blue, dark, artificial, neon'
      },
      '黄昏光': {
        core: 'soft fading dusk light, end of day glow',
        detail: 'dim warm light, last rays of sun, soft purple-orange sky, gentle transition to night, muted tones, calm atmosphere, soft silhouettes, quiet evening, fading warmth, tranquil glow',
        mood: 'calm, melancholic, serene, nostalgic, tranquil',
        color: 'dusky orange, soft purple, muted pink, deep blue, warm amber',
        tech: 'low sun, dusk color temperature, soft diffusion, muted tones, gentle contrast, evening exposure, quiet rendering',
        ref: 'inspired by dusk and evening landscape photography',
        negative: 'bright, harsh, midday, dark, artificial, neon'
      },
      '夜晚光': {
        core: 'ambient night illumination, nocturnal glow',
        detail: 'soft night ambient, moonlit and starlit glow, deep shadows, city light hints, dark atmosphere, gentle illumination, nocturnal mood, quiet darkness, subtle highlights, night ambience',
        mood: 'nocturnal, mysterious, calm, quiet, atmospheric',
        color: 'deep navy, cool blue, soft white, faint warm accents, dark shadows',
        tech: 'night ambient light, low light exposure, long exposure, dark rendering, cool color balance, subtle highlights, nocturnal atmosphere',
        ref: 'inspired by night photography and nocturnal scenes',
        negative: 'bright, daylight, harsh, warm, overexposed, cheerful'
      },
      '全息光': {
        core: 'holographic light, iridescent projected glow',
        detail: 'iridescent light projections, shifting rainbow colors, translucent glow, holographic shimmer, futuristic display, light refraction, spectral colors, digital glow, floating light forms, sci-fi illumination',
        mood: 'futuristic, surreal, magical, high-tech, ethereal',
        color: 'iridescent rainbow, holographic silver, cyan, magenta, shifting spectral hues, glowing white',
        tech: 'holographic projection, iridescent rendering, spectral refraction, translucent glow, futuristic light, digital emission, chromatic shimmer',
        ref: 'inspired by holographic displays and sci-fi lighting',
        negative: 'natural, warm, rustic, traditional, dull, muted, realistic'
      },
      '激光': {
        core: 'intense laser light, focused coherent beam',
        detail: 'sharp coherent light beams, intense single-color light, crisp beam lines, high-energy glow, focused points, futuristic atmosphere, light shows, precise illumination, vivid saturated color, beam scattering',
        mood: 'intense, futuristic, energetic, dramatic, high-tech',
        color: 'vivid laser red, green, blue, saturated single colors, glowing beams, dark surround',
        tech: 'coherent beam, laser emission, sharp beam lines, high intensity, saturated color, beam glow, futuristic rendering',
        ref: 'inspired by laser light shows and sci-fi lighting',
        negative: 'natural, soft, warm, rustic, traditional, dull, diffused'
      },
      '投影光': {
        core: 'projected light, image and pattern projection',
        detail: 'projected images and patterns, light beam projection, focused projection cone, visible light path, surface illumination, gobo patterns, cinematic projection, layered light, textured light, atmospheric beam',
        mood: 'cinematic, atmospheric, artistic, dynamic, layered',
        color: 'projected white, colored patterns, warm beam, mixed hues, glowing projection',
        tech: 'projector light, gobo patterns, projection cone, visible beam, surface projection, layered light, cinematic rendering',
        ref: 'inspired by projection mapping and gobo lighting',
        negative: 'natural, plain, flat, muted, realistic, dull'
      },
      '泛光': {
        core: 'broad flood light, wide even illumination',
        detail: 'wide even light spread, broad illumination, minimal shadows, even coverage, bright open area, floodlight glow, uniform brightness, large area lighting, stadium or outdoor light, even exposure',
        mood: 'bright, open, even, functional, expansive',
        color: 'bright white, neutral even tones, cool or warm white, uniform brightness, clean light',
        tech: 'floodlight source, wide beam angle, even coverage, minimal shadow, uniform illumination, bright exposure, functional rendering',
        ref: 'inspired by floodlight and stadium lighting',
        negative: 'dramatic, moody, dark, spotlight, harsh contrast, intimate'
      },
      '侧光': {
        core: 'directional side lighting, dramatic side illumination',
        detail: 'light from the side, strong directional shadows, sculpted form, half-lit face, dramatic contrast, texture emphasis, defined features, moody atmosphere, chiaroscuro side, dimensional depth',
        mood: 'dramatic, sculptural, moody, artistic, dimensional',
        color: 'directional warm or cool light, half shadow, strong contrast, defined highlights',
        tech: 'side light placement, 90-degree angle, strong directional shadow, sculpting light, contrast ratio, texture emphasis, dramatic rendering',
        ref: 'inspired by side-lit portrait and still life photography',
        negative: 'flat, front-lit, even, shadowless, soft, diffuse'
      },
      '眼神光': {
        core: 'catchlight in the eyes, sparkling eye highlight',
        detail: 'bright catchlight reflections in eyes, sparkling eye highlights, lively gaze, window or softbox reflection in eyes, expressive eyes, engaging look, luminous eyes, portrait focus, animated gaze, subtle glow',
        mood: 'engaging, lively, expressive, intimate, captivating',
        color: 'bright white catchlight, warm or cool reflection, luminous eye highlights, natural tones',
        tech: 'catchlight placement, window or softbox reflection, eye highlight rendering, portrait lighting, expressive gaze, luminous detail',
        ref: 'inspired by portrait photography catchlights',
        negative: 'flat eyes, dull gaze, no highlight, lifeless, harsh, overexposed'
      },
      '发丝光': {
        core: 'hair light, luminous rim on hair strands',
        detail: 'bright rim light on hair, glowing hair edges, separation from background, soft halo on hair, luminous strands, backlight on hair, dimensional depth, elegant glow, sculpted hair, subtle sparkle',
        mood: 'elegant, dimensional, polished, glamorous, refined',
        color: 'bright rim highlight, warm or cool hair glow, luminous edge, dark background, subtle halo',
        tech: 'hair light placement, backlight on hair, rim highlight, edge separation, low fill, luminous strands, portrait lighting',
        ref: 'inspired by portrait photography hair light',
        negative: 'flat, front-lit, no separation, dull hair, even, shadowless'
      },
      '补光': {
        core: 'fill light, softening shadows with secondary light',
        detail: 'soft secondary light, reduced shadow contrast, gentle shadow fill, balanced illumination, lifted shadows, even exposure, subtle brightness, controlled contrast, natural fill, detail in shadows',
        mood: 'balanced, gentle, natural, even, soft',
        color: 'neutral fill light, soft even tones, subtle brightness, natural balance, gentle highlights',
        tech: 'fill light placement, reflector or softbox fill, reduced contrast ratio, shadow lift, balanced exposure, gentle rendering',
        ref: 'inspired by studio fill light technique',
        negative: 'harsh, high contrast, dramatic, deep shadows, unlit, stark'
      },
      '主光': {
        core: 'key light, primary dominant illumination source',
        detail: 'dominant main light, primary illumination, defined shadows, sculpted subject, main light direction, strong modeling, primary highlight, controlled contrast, focused illumination, leading light',
        mood: 'defined, sculptural, focused, dramatic, clear',
        color: 'primary light color, dominant highlight, defined shadow, warm or cool key, controlled tones',
        tech: 'key light placement, primary source, main illumination, shadow direction, contrast control, sculpting light, defined rendering',
        ref: 'inspired by classic key light technique in photography',
        negative: 'flat, even, shadowless, diffuse, low contrast, undefined'
      },
      '漫射光': {
        core: 'diffuse light, scattered soft illumination',
        detail: 'scattered soft light, even gentle illumination, minimal shadows, soft transitions, wraparound glow, muted contrast, gentle modeling, soft highlights, natural diffusion, softbox-like quality',
        mood: 'soft, gentle, even, calm, natural',
        color: 'soft neutral tones, gentle white, muted colors, soft highlights, even brightness',
        tech: 'diffusion material, scattered light, soft shadow edge, even coverage, low contrast, gentle rendering, softbox quality',
        ref: 'inspired by diffused natural and studio light',
        negative: 'harsh, direct, hard shadows, high contrast, dramatic, spotlight'
      },
      '反射光': {
        core: 'reflected light, bounce illumination from surfaces',
        detail: 'light bouncing off surfaces, bounce illumination, secondary reflected glow, soft fill from walls, reflected highlights, indirect light, ambient bounce, natural fill, surface reflections, gentle secondary light',
        mood: 'natural, soft, indirect, balanced, subtle',
        color: 'surface-tinted reflected light, soft bounce tones, gentle highlights, natural balance, subtle warmth',
        tech: 'bounce light, surface reflection, indirect illumination, secondary fill, reflected highlight, natural rendering, soft bounce',
        ref: 'inspired by bounce light technique in photography',
        negative: 'direct, harsh, flat, artificial, unidirectional, stark'
      },
      '折射光': {
        core: 'refracted light, bending light through transparent media',
        detail: 'light bending through glass or water, prismatic dispersion, rainbow spectrum, distorted light paths, caustic patterns, glass refraction, crystal sparkle, lens-like effects, colorful dispersion, bending rays',
        mood: 'colorful, magical, crystalline, fascinating, ethereal',
        color: 'prismatic rainbow, spectral colors, crystal highlights, glass refraction, colorful dispersion',
        tech: 'refraction rendering, prismatic dispersion, caustic patterns, glass and water refraction, spectral colors, crystalline glow, light bending',
        ref: 'inspired by prism and glass refraction photography',
        negative: 'flat, dull, muted, natural, plain, realistic'
      },
      '透射光': {
        core: 'transmitted light, light passing through translucent material',
        detail: 'light passing through translucent surfaces, glowing material, backlit translucency, soft glow through fabric or paper, luminous transmission, diffused passage, warm glow, translucent illumination, glowing edges, transmitted brightness',
        mood: 'luminous, ethereal, warm, soft, glowing',
        color: 'translucent glow, warm transmitted light, soft luminous tones, glowing material, gentle brightness',
        tech: 'transmission rendering, backlit translucency, glowing material, light passage, soft glow, luminous detail, translucent illumination',
        ref: 'inspired by backlit translucent material photography',
        negative: 'opaque, dark, flat, harsh, direct, blocked'
      },
      '散射光': {
        core: 'scattered light, light dispersed by particles',
        detail: 'light dispersed by atmosphere or particles, soft scattered glow, haze scattering, diffused brightness, atmospheric dispersion, gentle spread, muted shadows, soft ambient, scattered rays, luminous haze',
        mood: 'soft, atmospheric, diffuse, gentle, hazy',
        color: 'soft scattered white, hazy tones, muted colors, gentle brightness, atmospheric glow',
        tech: 'scattering rendering, atmospheric dispersion, particle scattering, soft glow, haze diffusion, gentle spread, atmospheric light',
        ref: 'inspired by atmospheric scattering and haze photography',
        negative: 'crisp, sharp, direct, harsh, clear, defined'
      },
      '体积光': {
        core: 'volumetric light, visible light beams in space',
        detail: 'visible light beams, volumetric rays, light shafts through space, god rays, atmospheric light volume, dust in light, beam definition, light cone visibility, volumetric glow, dimensional light',
        mood: 'atmospheric, dramatic, ethereal, cinematic, mystical',
        color: 'volumetric white, warm or cool beams, atmospheric glow, dust-lit rays, luminous volume',
        tech: 'volumetric rendering, light shafts, god rays, atmospheric volume, beam definition, dust particles, cinematic glow',
        ref: 'inspired by volumetric light in cinema and photography',
        negative: 'flat, clear, no atmosphere, dry, sharp, plain'
      },
      '丁达尔效应': {
        core: 'Tyndall effect, visible light scattering in colloid',
        detail: 'visible light beam scattering through mist or smoke, colloid scattering, bright light path, glowing particles, atmospheric beam, visible ray, luminous haze, scattered glow, misty beam, ethereal light path',
        mood: 'ethereal, mystical, atmospheric, luminous, serene',
        color: 'bright beam white, warm or cool ray, glowing particles, luminous haze, soft glow',
        tech: 'Tyndall scattering, visible beam, colloid scattering, mist and smoke, glowing particles, atmospheric ray, luminous rendering',
        ref: 'inspired by Tyndall effect in nature and photography',
        negative: 'clear, dry, sharp, flat, no atmosphere, plain'
      },
      '光柱': {
        core: 'light beam, defined column of light',
        detail: 'defined column of light, vertical or angled beam, visible light path, focused beam, atmospheric beam, light pillar, dramatic column, beam glow, luminous shaft, defined rays',
        mood: 'dramatic, focused, atmospheric, majestic, defined',
        color: 'beam white, warm or cool column, luminous shaft, atmospheric glow, defined brightness',
        tech: 'beam rendering, light column, visible path, atmospheric beam, focused shaft, luminous pillar, dramatic glow',
        ref: 'inspired by light beam photography and cinematography',
        negative: 'flat, diffuse, scattered, no definition, plain, muted'
      },
      '光斑': {
        core: 'light spot, glowing bokeh patches',
        detail: 'glowing circular light spots, bokeh patches, out-of-focus highlights, sparkling light dots, soft glowing circles, festive lights, blurred glow, dreamy spots, luminous orbs, scattered highlights',
        mood: 'dreamy, festive, magical, soft, whimsical',
        color: 'glowing white, warm bokeh, colorful light spots, soft golden orbs, luminous circles',
        tech: 'bokeh rendering, out-of-focus highlights, light spots, glowing circles, soft focus, festive lights, dreamy glow',
        ref: 'inspired by bokeh and fairy light photography',
        negative: 'sharp, focused, harsh, flat, plain, clinical'
      },
      '光晕': {
        core: 'halo glow, luminous ring of light',
        detail: 'luminous ring around light source, halo effect, soft glowing ring, atmospheric halo, moon halo, light ring, radiant corona, soft luminous circle, glowing aura, ethereal ring',
        mood: 'ethereal, mystical, serene, luminous, spiritual',
        color: 'soft glowing ring, warm or cool halo, luminous corona, gentle white, atmospheric glow',
        tech: 'halo rendering, luminous ring, corona glow, atmospheric halo, soft ring, ethereal aura, glowing circle',
        ref: 'inspired by moon halos and lens halo effects',
        negative: 'sharp, harsh, clear, flat, plain, defined'
      },
      '光雾': {
        core: 'light fog, glowing luminous mist',
        detail: 'glowing mist, luminous fog, light in fog, atmospheric glow, soft diffused brightness, misty illumination, glowing haze, fog-lit atmosphere, soft light diffusion, ethereal mist',
        mood: 'mystical, ethereal, atmospheric, serene, mysterious',
        color: 'glowing white, soft luminous mist, warm or cool glow, hazy brightness, gentle tones',
        tech: 'fog rendering, luminous mist, light diffusion, atmospheric glow, glowing haze, soft brightness, ethereal atmosphere',
        ref: 'inspired by fog and mist lighting photography',
        negative: 'clear, sharp, dry, flat, plain, defined'
      },
      '光尘': {
        core: 'light dust, glowing particles in light beams',
        detail: 'floating dust particles catching light, glowing motes, dust in sunbeams, sparkling particles, luminous specks, atmospheric dust, light-catching particles, shimmering motes, golden dust, visible air',
        mood: 'atmospheric, magical, nostalgic, warm, ethereal',
        color: 'glowing golden dust, warm motes, luminous specks, light-catching particles, soft glow',
        tech: 'dust particle rendering, light-catching motes, glowing specks, atmospheric dust, shimmer, sunbeam particles, warm glow',
        ref: 'inspired by dust in light beam photography',
        negative: 'clean, clear, sterile, flat, sharp, plain'
      },
      '光污染': {
        core: 'light pollution, urban artificial glow',
        detail: 'urban artificial glow, sky glow from city lights, scattered artificial light, bright city horizon, light haze, over-illuminated sky, urban glow, artificial brightness, city light dome, ambient pollution glow',
        mood: 'urban, artificial, overwhelming, nocturnal, atmospheric',
        color: 'warm orange city glow, artificial white, mixed urban hues, bright horizon, hazy glow',
        tech: 'light pollution rendering, urban sky glow, artificial light scatter, city glow, bright horizon, hazy atmosphere, nocturnal urban',
        ref: 'inspired by city light pollution photography',
        negative: 'natural, dark, clear, rural, pristine, starry'
      },
      '磷光': {
        core: 'phosphorescent glow, lingering luminous emission',
        detail: 'lingering soft glow, luminous emission after light source, ghostly glow, glowing minerals, luminous paint, soft persistent light, eerie glow, glowing objects, dim luminous aura, mysterious light',
        mood: 'mysterious, eerie, ethereal, glowing, surreal',
        color: 'soft green glow, pale luminous tones, ghostly white, glowing minerals, dim aura',
        tech: 'phosphorescent rendering, lingering glow, luminous emission, glowing minerals, eerie light, soft persistent glow, mysterious aura',
        ref: 'inspired by phosphorescent minerals and glow-in-the-dark',
        negative: 'bright, harsh, natural, daylight, plain, realistic'
      },
      '星云光': {
        core: 'nebula light, cosmic glowing gas illumination',
        detail: 'glowing cosmic gas clouds, nebula emission, colorful interstellar glow, radiant space light, cosmic dust glow, vibrant celestial colors, deep space illumination, glowing star-forming regions, ethereal cosmic light, vast luminous clouds',
        mood: 'cosmic, awe-inspiring, ethereal, vast, majestic',
        color: 'nebula pink, cosmic purple, deep blue, glowing teal, radiant gold, dark space',
        tech: 'nebula emission, cosmic gas glow, interstellar rendering, radiant space light, vibrant celestial color, deep space exposure, ethereal glow',
        ref: 'inspired by nebula astrophotography and deep space imagery',
        negative: 'earthly, warm, mundane, natural daylight, plain, realistic'
      },
      '熔岩光': {
        core: 'molten lava glow, intense volcanic illumination',
        detail: 'glowing molten rock, intense orange-red light, heat shimmer, radiant cracks, volcanic glow, glowing lava flow, intense brightness, dark rock surround, scorching warmth, luminous magma',
        mood: 'intense, primal, dramatic, powerful, fiery',
        color: 'molten orange, deep red, glowing yellow, black rock, intense warm glow',
        tech: 'lava emission, molten glow, heat shimmer, radiant cracks, volcanic light, intense warm rendering, glowing flow',
        ref: 'inspired by volcanic and lava photography',
        negative: 'cool, blue, cold, soft, muted, natural daylight'
      },
      '荧光棒': {
        core: 'glow stick light, vivid chemical glow',
        detail: 'vivid chemical glow, bright saturated colors, glowing sticks, neon-like emission, party atmosphere, colorful glow, luminous tubes, bright chemical light, festive glow, glowing accents',
        mood: 'playful, vibrant, festive, energetic, fun',
        color: 'vivid glow stick colors, bright green, pink, blue, orange, saturated glow',
        tech: 'chemical luminescence, glow stick emission, vivid saturated glow, luminous tube, festive light, bright rendering',
        ref: 'inspired by glow stick and rave photography',
        negative: 'natural, dull, muted, warm, daylight, realistic'
      },
      '夜光': {
        core: 'night glow, soft luminous nocturnal emission',
        detail: 'soft luminous glow in darkness, gentle night light, glowing accents in dark, luminous objects, subtle glow, dark surround, gentle brightness, mysterious light, soft luminous aura, night illumination',
        mood: 'mysterious, serene, soft, luminous, quiet',
        color: 'soft luminous glow, pale green or blue, gentle white, dark surround, subtle brightness',
        tech: 'night glow rendering, luminous emission, soft glow in dark, gentle brightness, mysterious aura, dark exposure, subtle light',
        ref: 'inspired by glow-in-the-dark and night glow photography',
        negative: 'bright, harsh, daylight, warm, overexposed, cheerful'
      },
      '柔光': {
        core: 'soft light, gentle diffused illumination',
        detail: 'gentle soft illumination, minimal shadows, smooth transitions, wraparound glow, flattering light, soft highlights, even brightness, gentle modeling, subtle contrast, dreamy quality',
        mood: 'soft, gentle, dreamy, flattering, calm',
        color: 'soft neutral tones, gentle white, muted colors, soft highlights, even brightness',
        tech: 'soft light source, diffusion, gentle shadows, smooth transition, soft highlights, low contrast, flattering rendering',
        ref: 'inspired by soft light portrait photography',
        negative: 'harsh, hard, direct, high contrast, dramatic, spotlight'
      },
      '暖光': {
        core: 'warm light, cozy golden illumination',
        detail: 'warm golden illumination, cozy glow, amber tones, warm highlights, inviting atmosphere, soft warm shadows, golden cast, comfortable brightness, honey tones, warm ambience',
        mood: 'warm, cozy, inviting, comfortable, golden',
        color: 'warm gold, amber, honey, soft orange, warm white, golden highlights',
        tech: 'warm color temperature, golden cast, warm highlights, cozy glow, amber tones, warm rendering, inviting light',
        ref: 'inspired by warm tungsten and golden light photography',
        negative: 'cool, blue, cold, sterile, harsh, fluorescent'
      },
      '冷光': {
        core: 'cool light, crisp blue-white illumination',
        detail: 'crisp cool illumination, blue-white light, clean bright tones, cool shadows, clinical brightness, fresh atmosphere, cool highlights, crisp definition, cool ambience, modern feel',
        mood: 'cool, crisp, clean, modern, fresh',
        color: 'cool white, blue-white, pale blue, crisp tones, cool highlights, clean brightness',
        tech: 'cool color temperature, blue-white cast, crisp highlights, clean rendering, cool ambience, modern light, fresh brightness',
        ref: 'inspired by cool daylight and LED lighting',
        negative: 'warm, golden, cozy, amber, soft, intimate'
      },
      '电光': {
        core: 'electric light, bright artificial illumination',
        detail: 'bright artificial light, electric glow, crisp illumination, modern brightness, clear highlights, artificial ambience, bright coverage, electric sparkle, clean light, contemporary glow',
        mood: 'bright, modern, clean, energetic, artificial',
        color: 'bright white, electric glow, crisp tones, clean highlights, cool or neutral white',
        tech: 'electric light source, artificial illumination, bright coverage, crisp highlights, modern rendering, electric glow, clean brightness',
        ref: 'inspired by electric and LED lighting photography',
        negative: 'natural, warm, rustic, candlelight, dim, organic'
      },
      '极光漫射': {
        core: 'aurora diffused light, soft flowing polar glow',
        detail: 'soft diffused aurora light, flowing green and purple bands, gentle luminous veil, arctic night glow, ethereal color wash, soft sky illumination, reflected polar light, dreamy gradient, celestial diffusion, tranquil glow',
        mood: 'ethereal, serene, magical, awe-inspiring, tranquil',
        color: 'aurora green, soft purple, teal, magenta, deep night blue, luminous gradient',
        tech: 'diffused aurora emission, soft flowing bands, gentle color wash, arctic night exposure, luminous gradient, ethereal rendering, long exposure glow',
        ref: 'inspired by diffused aurora borealis night photography',
        negative: 'harsh, direct, daylight, warm, bright, urban, artificial'
      },
      '水下光斑': {
        core: 'underwater light spots, caustic dappled illumination',
        detail: 'caustic light spots dancing underwater, dappled sunbeams, rippling light patterns, refracted bright patches, floating particles, blue-green water glow, shifting light webs, luminous spots, aquatic shimmer, depth illumination',
        mood: 'ethereal, serene, mysterious, immersive, tranquil',
        color: 'aqua blue, teal, cyan, bright white spots, deep blue, turquoise',
        tech: 'underwater caustics, dappled light spots, refracted patches, rippling patterns, floating particles, blue-green cast, volumetric rays',
        ref: 'inspired by underwater caustic light photography',
        negative: 'dry, warm, indoor, harsh, flat, red, orange, artificial'
      },
      '投影仪光': {
        core: 'projector light, focused projected beam illumination',
        detail: 'projected image beam, focused projection cone, visible light path, surface projection, gobo patterns, cinematic projection, layered light, atmospheric beam, textured illumination, bright projection surface',
        mood: 'cinematic, atmospheric, artistic, dynamic, layered',
        color: 'projected white, colored patterns, warm beam, mixed hues, glowing projection',
        tech: 'projector light source, projection cone, visible beam, gobo patterns, surface projection, layered rendering, cinematic glow',
        ref: 'inspired by projector and gobo lighting photography',
        negative: 'natural, plain, flat, muted, realistic, dull'
      },
      '闪电瞬间': {
        core: 'lightning flash instant, sudden electric illumination',
        detail: 'brief intense lightning flash, stark electric illumination, high contrast, storm atmosphere, electric blue-white burst, momentary exposure, dramatic cloud glow, harsh shadow, charged atmosphere, sudden brightness',
        mood: 'dramatic, intense, electric, stormy, powerful',
        color: 'electric blue-white flash, cool storm cast, deep dark surround, silver highlights, charged glow',
        tech: 'strobe-like flash, high contrast, storm exposure, lightning capture, brief intense source, dramatic shadow, electric balance',
        ref: 'inspired by lightning storm photography',
        negative: 'warm, soft, even, gentle, calm, sunny'
      },
      '霓虹招牌光': {
        core: 'neon sign light, glowing commercial sign illumination',
        detail: 'glowing neon sign, saturated color light, tube glow, wet reflection, urban night glow, sign illumination, colorful cast, electric atmosphere, glowing letters, night city ambiance',
        mood: 'energetic, edgy, nocturnal, futuristic, vibrant',
        color: 'neon cyan, hot pink, electric purple, acid green, saturated glow, deep shadows',
        tech: 'neon tube emission, light bloom, chromatic aberration, wet reflection, volumetric haze, color gel, night exposure',
        ref: 'inspired by neon sign night photography',
        negative: 'natural, daylight, warm cozy, soft, rural, sunlight'
      },
      '月光漫射': {
        core: 'diffused moonlight, soft silver-blue night glow',
        detail: 'soft diffused moonlight, gentle silver-blue glow, hazy lunar light, soft shadows, moonlit mist, ethereal night ambience, cool luminous veil, gentle illumination, dreamy night glow, soft lunar diffusion',
        mood: 'serene, mysterious, romantic, ethereal, dreamy',
        color: 'silver blue, cool cyan cast, deep navy shadows, pale white highlights, soft ambient',
        tech: 'diffused moonlight, soft silver glow, hazy lunar light, cool color balance, gentle shadows, night ambience',
        ref: 'inspired by moonlit misty night photography',
        negative: 'warm, golden, daylight, bright, neon, harsh, sunny'
      },
      '烛光摇曳': {
        core: 'flickering candlelight, dancing warm flame glow',
        detail: 'flickering candle flame, dancing warm light, intimate circle of glow, swaying shadows, warm amber tones, gentle face illumination, sacred cozy atmosphere, smoke wisps, warm highlight, gentle flicker',
        mood: 'intimate, romantic, warm, sacred, cozy',
        color: 'warm amber 1800K, orange flame, golden glow, deep warm shadows, honey tones',
        tech: 'practical candle source, fire flicker, warm color cast, shallow depth, low light, warm balance, intimate exposure',
        ref: 'inspired by flickering candlelit scenes',
        negative: 'cool, daylight, bright, neon, modern, electric, sterile'
      },
      '荧光灯管': {
        core: 'fluorescent tube light, cool even institutional illumination',
        detail: 'cool white-green tube light, even clinical illumination, slight green cast, office industrial atmosphere, flat even coverage, cool skin tone, institutional mood, tube light source, cool ambient, linear glow',
        mood: 'cool, clinical, modern, sterile, institutional',
        color: 'cool white, greenish cast, pale blue-green, flat even tones, cool highlights',
        tech: 'fluorescent tube source, cool color temperature 4000-5000K, even coverage, green cast, flat illumination, tube array',
        ref: 'inspired by fluorescent-lit institutional photography',
        negative: 'warm, golden, soft, dramatic, cozy, candlelight'
      },
      '车灯光': {
        core: 'car headlight, bright oncoming vehicle illumination',
        detail: 'bright headlight beams, oncoming vehicle light, focused twin beams, road illumination, night driving glow, light trails, harsh bright spots, vehicle light cones, urban night, directional beams',
        mood: 'nocturnal, dynamic, intense, modern, urban',
        color: 'bright white headlight, cool or warm beam, night road, glowing trails, deep shadows',
        tech: 'headlight source, twin beams, light trails, night exposure, directional cones, long exposure, urban glow',
        ref: 'inspired by night road and traffic photography',
        negative: 'daylight, soft, warm cozy, rural, calm, natural'
      },
      '灯塔光': {
        core: 'lighthouse beam, sweeping coastal beacon light',
        detail: 'rotating lighthouse beam, sweeping light cone, coastal beacon glow, sea mist illumination, rhythmic sweep, distant warning light, ocean night glow, atmospheric beam, guiding light, coastal atmosphere',
        mood: 'majestic, solitary, atmospheric, guiding, dramatic',
        color: 'bright white beam, warm or cool beacon, sea mist glow, deep navy, luminous sweep',
        tech: 'rotating beam, sweeping light cone, sea mist scattering, rhythmic sweep, long exposure, coastal atmosphere',
        ref: 'inspired by lighthouse and coastal night photography',
        negative: 'daylight, soft, flat, warm cozy, urban, indoor'
      },
      '信号弹光': {
        core: 'signal flare light, bright burning distress illumination',
        detail: 'bright burning flare, intense red or orange glow, smoke trail, emergency illumination, dramatic light source, glowing signal, night sky flare, intense brightness, atmospheric smoke, urgent glow',
        mood: 'intense, urgent, dramatic, alarming, vivid',
        color: 'bright red flare, intense orange, glowing smoke, dark surround, vivid glow',
        tech: 'flare emission, intense glow, smoke trail, dramatic source, night exposure, vivid rendering',
        ref: 'inspired by flare and emergency lighting photography',
        negative: 'soft, calm, natural, daylight, muted, gentle'
      },
      '烟花光': {
        core: 'fireworks light, colorful exploding burst illumination',
        detail: 'exploding colorful bursts, bright firework flashes, glowing trails, night sky illumination, vibrant colors, sparkling lights, momentary brightness, festive glow, colorful explosion, celebratory light',
        mood: 'festive, joyful, vibrant, celebratory, spectacular',
        color: 'vivid red, gold, green, blue, purple, bright white flashes, dark night sky',
        tech: 'firework burst, glowing trails, long exposure, colorful flashes, night sky, festive rendering, sparkle',
        ref: 'inspired by fireworks photography',
        negative: 'soft, calm, muted, daylight, plain, gentle'
      },
      '萤火虫光': {
        core: 'firefly glow, tiny luminous insect light',
        detail: 'tiny glowing fireflies, soft luminous dots, gentle green-yellow glow, floating light specks, magical night meadow, soft twinkling, glowing insects, dreamy luminous points, warm gentle light, ethereal sparkle',
        mood: 'magical, whimsical, dreamy, gentle, nostalgic',
        color: 'soft green-yellow glow, warm luminous dots, gentle amber, dark meadow, soft sparkle',
        tech: 'firefly emission, tiny glow points, soft luminous dots, long exposure, magical sparkle, gentle rendering',
        ref: 'inspired by firefly and glow-worm photography',
        negative: 'harsh, bright, daylight, artificial, neon, cold'
      },
      '深海光': {
        core: 'deep sea light, faint abyssal illumination',
        detail: 'faint deep sea light, abyssal darkness, faint blue glow, deep ocean ambience, faint bioluminescent hints, submerged darkness, faint light shafts, deep blue gloom, mysterious depth, faint luminous accents',
        mood: 'mysterious, vast, isolated, serene, deep',
        color: 'deep navy, faint blue, abyssal black, subtle luminous accents, dark teal',
        tech: 'deep sea exposure, faint light, abyssal darkness, low light capture, deep blue cast, mysterious depth',
        ref: 'inspired by deep sea and abyssal photography',
        negative: 'bright, daylight, warm, shallow, cheerful, harsh'
      },
      '熔炉光': {
        core: 'furnace glow, intense molten industrial light',
        detail: 'intense molten glow, furnace fire, radiant heat light, glowing metal, industrial brightness, sparks flying, deep orange-red light, scorching warmth, dark industrial surround, luminous forge',
        mood: 'intense, primal, industrial, powerful, fiery',
        color: 'molten orange, deep red, glowing yellow, black iron, intense warm glow',
        tech: 'furnace emission, molten glow, radiant heat, sparks, industrial light, intense warm rendering',
        ref: 'inspired by forge and foundry photography',
        negative: 'cool, blue, cold, soft, muted, natural daylight'
      },
      '电焊光': {
        core: 'welding arc light, intense bright spark illumination',
        detail: 'intense welding arc, brilliant white-blue flash, flying sparks, sharp bright light, industrial glow, protective glare, intense brightness, spark trails, metal work glow, harsh brilliant light',
        mood: 'intense, industrial, sharp, powerful, harsh',
        color: 'brilliant white-blue arc, bright sparks, dark industrial surround, silver highlights',
        tech: 'welding arc, brilliant flash, spark trails, intense source, industrial exposure, harsh rendering',
        ref: 'inspired by welding and metalwork photography',
        negative: 'soft, warm, gentle, muted, natural, calm'
      },
      '等离子光': {
        core: 'plasma glow, luminous ionized gas illumination',
        detail: 'luminous ionized gas, plasma glow, violet-purple light, electric luminous cloud, sci-fi glow, glowing energy field, bright core, ethereal luminous gas, futuristic light, radiant plasma',
        mood: 'futuristic, surreal, electric, high-tech, ethereal',
        color: 'violet-purple plasma, electric blue, luminous white core, magenta, dark surround',
        tech: 'plasma emission, ionized glow, luminous gas, electric rendering, sci-fi light, radiant core',
        ref: 'inspired by plasma and sci-fi lighting',
        negative: 'natural, warm, rustic, traditional, dull, muted'
      },
      '紫外线光': {
        core: 'ultraviolet light, glowing violet-blacklight illumination',
        detail: 'violet-blacklight glow, UV illumination, glowing fluorescent objects, deep violet light, luminous white accents, neon-like glow, dark room ambience, glowing highlights, mysterious violet cast, electric glow',
        mood: 'mysterious, futuristic, electric, surreal, edgy',
        color: 'deep violet, glowing white, electric purple, luminous accents, dark surround',
        tech: 'UV light source, blacklight glow, fluorescent response, violet cast, luminous accents, dark exposure',
        ref: 'inspired by ultraviolet and blacklight photography',
        negative: 'natural, warm, daylight, soft, muted, realistic'
      },
      '红外夜视': {
        core: 'infrared night vision, monochrome green night illumination',
        detail: 'monochrome green night vision, infrared illumination, grainy green image, thermal glow, night surveillance, luminous green cast, dark scene visibility, infrared glow, monochrome rendering, night vision ambience',
        mood: 'surveillance, mysterious, tactical, nocturnal, clinical',
        color: 'monochrome green, luminous green cast, dark shadows, infrared glow, grainy tones',
        tech: 'infrared sensor, night vision, monochrome green, thermal glow, grainy rendering, low light capture',
        ref: 'inspired by infrared night vision imagery',
        negative: 'natural color, warm, daylight, bright, colorful, soft'
      },
      '星光漫射': {
        core: 'diffused starlight, soft scattered celestial glow',
        detail: 'soft scattered starlight, gentle celestial glow, faint twinkling, diffuse night sky, soft silver light, gentle illumination, dreamy night, subtle sparkle, faint luminous veil, tranquil celestial light',
        mood: 'serene, contemplative, mystical, tranquil, dreamy',
        color: 'silver white, pale blue, deep navy, soft white twinkle, cool ambient',
        tech: 'diffused starlight, soft celestial glow, faint twinkle, long exposure, dreamy rendering, tranquil night',
        ref: 'inspired by diffused starry night photography',
        negative: 'bright, daylight, warm, harsh, artificial, neon'
      },
      '晨雾光': {
        core: 'morning mist light, soft hazy dawn illumination',
        detail: 'soft hazy morning light, misty dawn glow, gentle diffused rays, dew atmosphere, soft golden haze, morning fog, gentle shadows, luminous mist, fresh quiet glow, ethereal morning',
        mood: 'fresh, serene, peaceful, ethereal, gentle',
        color: 'soft gold, pale pink, gentle white, misty haze, warm pastel',
        tech: 'morning mist, soft diffused light, hazy glow, gentle rays, dew atmosphere, soft rendering',
        ref: 'inspired by misty morning landscape photography',
        negative: 'harsh, midday, dark, artificial, neon, overexposed'
      },
      '夕阳逆光': {
        core: 'sunset backlight, warm golden backlit glow',
        detail: 'warm sunset backlight, golden rim glow, backlit haze, sun flare, silhouettes against warm sky, amber gradient, glowing edges, atmospheric warmth, lens flare, golden backlight',
        mood: 'warm, nostalgic, romantic, dramatic, golden',
        color: 'golden amber, warm orange, peach sky, deep purple shadows, rose gold',
        tech: 'sunset backlight, golden rim, backlit haze, sun flare, warm color cast, silhouette rendering',
        ref: 'inspired by sunset backlit photography',
        negative: 'cool, blue, flat, front-lit, harsh, sterile'
      },
      '月光剪影': {
        core: 'moonlight silhouette, dark subject against moonlit sky',
        detail: 'dark silhouette against moonlit sky, silver-blue backlight, rim glow on edges, luminous moon background, cool night atmosphere, dramatic outline, moonlit haze, ethereal contrast, dark shape, silver glow',
        mood: 'mysterious, dramatic, serene, ethereal, poetic',
        color: 'silver-blue sky, deep black silhouette, cool rim, pale moon glow, navy',
        tech: 'moonlight backlight, silhouette rendering, rim glow, cool color balance, high contrast, night exposure',
        ref: 'inspired by moonlit silhouette photography',
        negative: 'warm, front-lit, bright, flat, golden, sunny'
      },
      '霓虹反射': {
        core: 'neon reflection, colored light bouncing off wet surfaces',
        detail: 'neon light reflecting on wet surfaces, colored reflections, light bleed on asphalt, glowing puddles, mirror-like wet ground, saturated color cast, urban night reflection, glowing reflections, wet street glow, colorful mirror',
        mood: 'nocturnal, vibrant, edgy, futuristic, atmospheric',
        color: 'neon cyan, hot pink, electric purple, wet surface reflections, deep shadows',
        tech: 'neon reflection, wet surface bounce, light bleed, mirror reflection, saturated cast, night exposure',
        ref: 'inspired by neon reflections on wet streets',
        negative: 'natural, daylight, dry, warm cozy, rural, soft'
      },
      '玻璃反射光': {
        core: 'glass reflection light, mirrored glare on glass surfaces',
        detail: 'light reflecting on glass, mirrored glare, window reflection, glass sheen, reflected highlights, architectural glass glow, double reflection, luminous glass surface, mirror-like light, urban glare',
        mood: 'modern, crisp, urban, reflective, polished',
        color: 'bright white glare, cool or warm reflection, glass sheen, sky reflection, neutral tones',
        tech: 'glass reflection, mirrored glare, window bounce, sheen rendering, reflective surface, urban light',
        ref: 'inspired by glass reflection and architectural photography',
        negative: 'matte, dull, soft, natural, rustic, muted'
      },
      '水面波光': {
        core: 'water shimmer, sparkling light on water surface',
        detail: 'sparkling light on water, shimmering reflections, dancing glints, sun sparkle, rippling highlights, glittering surface, golden or silver sparkle, moving light patterns, luminous water, gentle glimmer',
        mood: 'serene, magical, lively, peaceful, sparkling',
        color: 'bright white sparkle, golden glints, silver shimmer, blue water, luminous highlights',
        tech: 'water shimmer, sparkling reflections, dancing glints, rippling highlights, glittering rendering, luminous surface',
        ref: 'inspired by water shimmer and glint photography',
        negative: 'flat, dull, calm, matte, dark, muted'
      },
      '雪地反光': {
        core: 'snow reflection, bright diffused light bouncing off snow',
        detail: 'bright light reflecting off snow, diffused white glow, snow glare, luminous white ground, soft bright reflection, winter brightness, glowing snowfield, reflective white, gentle bright ambience, cold luminous light',
        mood: 'bright, crisp, pure, serene, cold',
        color: 'bright white, pale blue, soft grey, luminous snow, cool tones',
        tech: 'snow reflection, bright diffused light, white glare, luminous ground, cool balance, bright exposure',
        ref: 'inspired by snowfield and winter photography',
        negative: 'dark, warm, dull, muted, harsh shadow, overcast'
      },
      '沙漠热浪光': {
        core: 'desert heat shimmer, wavy mirage light distortion',
        detail: 'wavy heat shimmer, mirage light distortion, rising heat waves, blurred horizon, desert heat glow, wavy refraction, shimmering air, golden desert light, distorted view, intense heat ambience',
        mood: 'intense, surreal, hot, vast, dreamlike',
        color: 'golden sand, warm haze, shimmering air, pale sky, amber glow',
        tech: 'heat shimmer, mirage distortion, rising waves, refraction, desert glow, warm rendering, wavy blur',
        ref: 'inspired by desert heat shimmer photography',
        negative: 'cool, crisp, sharp, clear, cold, soft'
      },
      '极昼光': {
        core: 'polar day light, continuous bright arctic sunlight',
        detail: 'continuous bright polar sunlight, endless daylight, low-angle sun, arctic brightness, long soft shadows, cool-bright ambience, glacial light, vast bright sky, persistent daylight, crisp arctic glow',
        mood: 'bright, vast, serene, expansive, crisp',
        color: 'bright white, pale blue, cool grey, glacial tones, soft gold',
        tech: 'polar day light, continuous sunlight, low sun angle, bright exposure, arctic rendering, cool-bright balance',
        ref: 'inspired by polar day arctic photography',
        negative: 'dark, night, warm cozy, dim, gloomy, overcast'
      },
      '极夜光': {
        core: 'polar night light, faint twilight arctic darkness',
        detail: 'faint polar twilight, arctic darkness, dim blue glow, endless night, faint horizon light, cold dark ambience, subtle luminous band, deep blue gloom, quiet darkness, faint arctic glow',
        mood: 'dark, serene, isolated, mysterious, quiet',
        color: 'deep navy, faint blue, dark grey, subtle luminous band, cold tones',
        tech: 'polar night exposure, faint twilight, arctic darkness, low light capture, cold balance, dim rendering',
        ref: 'inspired by polar night arctic photography',
        negative: 'bright, daylight, warm, cheerful, harsh, sunny'
      },
      '洞穴光': {
        core: 'cave light, dramatic shaft of light in darkness',
        detail: 'shaft of light entering cave, dramatic beam in darkness, dust in light, rocky shadow, mysterious glow, single light source, deep cave darkness, luminous opening, atmospheric beam, hidden illumination',
        mood: 'mysterious, dramatic, atmospheric, sacred, hidden',
        color: 'warm or cool beam, deep black shadows, dust-lit rays, rocky tones, luminous opening',
        tech: 'cave light shaft, dramatic beam, dust particles, single source, high contrast, atmospheric rendering',
        ref: 'inspired by cave and grotto light photography',
        negative: 'flat, bright, even, daylight, open, cheerful'
      },
      '地底光': {
        core: 'underground light, faint subterranean illumination',
        detail: 'faint subterranean light, underground glow, tunnel light, dim hidden illumination, earthy darkness, faint artificial glow, subterranean ambience, deep underground, muted luminous accents, hidden depth',
        mood: 'mysterious, hidden, dim, atmospheric, subterranean',
        color: 'dim warm or cool glow, earthy brown, deep shadows, faint luminous accents',
        tech: 'underground light, faint glow, tunnel illumination, dim exposure, subterranean ambience, muted rendering',
        ref: 'inspired by underground and tunnel photography',
        negative: 'bright, daylight, cheerful, open, harsh, sunny'
      },
      '火山光': {
        core: 'volcano glow, fiery eruption illumination',
        detail: 'fiery volcano glow, eruption light, glowing lava, ash cloud glow, intense orange-red light, dramatic eruption, radiant heat, dark ash sky, glowing crater, powerful fiery light',
        mood: 'intense, primal, dramatic, powerful, fiery',
        color: 'molten orange, deep red, glowing yellow, ash grey, intense warm glow',
        tech: 'volcano emission, eruption glow, lava light, ash cloud, intense warm rendering, dramatic exposure',
        ref: 'inspired by volcanic eruption photography',
        negative: 'cool, blue, cold, soft, muted, natural daylight'
      },
      '岩浆光': {
        core: 'magma glow, intense molten rock illumination',
        detail: 'intense molten rock glow, magma light, glowing cracks, radiant orange-red, heat shimmer, volcanic brightness, glowing flow, dark rock surround, scorching light, luminous magma',
        mood: 'intense, primal, dramatic, powerful, fiery',
        color: 'molten orange, deep red, glowing yellow, black rock, intense warm glow',
        tech: 'magma emission, molten glow, radiant cracks, heat shimmer, volcanic light, intense rendering',
        ref: 'inspired by magma and lava photography',
        negative: 'cool, blue, cold, soft, muted, natural daylight'
      },
      '陨石光': {
        core: 'meteor light, streaking falling star illumination',
        detail: 'streaking meteor light, falling star trail, bright fireball, glowing trail, night sky streak, brief intense flash, luminous tail, cosmic streak, shooting star glow, dramatic sky light',
        mood: 'dramatic, awe-inspiring, cosmic, fleeting, magical',
        color: 'bright white streak, glowing trail, deep navy sky, silver highlights, warm flash',
        tech: 'meteor streak, falling star trail, long exposure, bright fireball, cosmic rendering, night sky',
        ref: 'inspired by meteor and shooting star photography',
        negative: 'soft, warm, daylight, muted, gentle, calm'
      },
      '彗星光': {
        core: 'comet light, glowing celestial tail illumination',
        detail: 'glowing comet tail, celestial light, luminous coma, long glowing tail, cosmic glow, bright nucleus, night sky streak, ethereal celestial light, distant cosmic glow, majestic tail',
        mood: 'awe-inspiring, cosmic, majestic, ethereal, serene',
        color: 'pale blue-white glow, luminous tail, deep navy, silver highlights, soft cyan',
        tech: 'comet emission, glowing tail, luminous coma, long exposure, cosmic rendering, night sky',
        ref: 'inspired by comet astrophotography',
        negative: 'bright, warm, daylight, harsh, urban, artificial'
      },
      '银河光': {
        core: 'galaxy light, luminous milky way illumination',
        detail: 'luminous milky way, galaxy band glow, cosmic dust light, star-dense band, celestial glow, deep space illumination, luminous galactic core, vast starfield, ethereal cosmic light, radiant galaxy',
        mood: 'awe-inspiring, cosmic, vast, ethereal, majestic',
        color: 'pale white band, soft blue, deep navy, luminous core, silver stars',
        tech: 'galaxy emission, milky way band, long exposure, cosmic glow, starfield, ethereal rendering',
        ref: 'inspired by milky way astrophotography',
        negative: 'bright, daylight, warm, urban, artificial, harsh'
      },
      '星尘光': {
        core: 'stardust light, glowing cosmic dust particles',
        detail: 'glowing cosmic dust, luminous particles, star dust glow, sparkling motes, ethereal cosmic sparkle, soft luminous haze, celestial dust, gentle glow, dreamy cosmic particles, luminous specks',
        mood: 'ethereal, dreamy, cosmic, magical, serene',
        color: 'pale white, soft gold, silver sparkle, deep navy, luminous haze',
        tech: 'stardust rendering, glowing particles, luminous haze, cosmic sparkle, long exposure, ethereal glow',
        ref: 'inspired by cosmic dust and nebulous photography',
        negative: 'harsh, bright, daylight, warm, urban, artificial'
      },
      '量子光': {
        core: 'quantum light, abstract luminous energy field',
        detail: 'abstract luminous energy, quantum glow, particle light field, ethereal luminous haze, sci-fi energy, glowing particles, abstract bright field, futuristic light, radiant energy, luminous abstraction',
        mood: 'futuristic, abstract, ethereal, high-tech, mysterious',
        color: 'luminous white, electric blue, soft cyan, glowing particles, dark surround',
        tech: 'quantum glow, particle light field, luminous haze, abstract rendering, sci-fi energy, radiant field',
        ref: 'inspired by quantum and abstract light art',
        negative: 'natural, warm, realistic, dull, muted, traditional'
      },
      '全息投影光': {
        core: 'hologram projection light, iridescent projected image glow',
        detail: 'iridescent hologram projection, shifting rainbow light, translucent glow, holographic shimmer, futuristic display, light refraction, spectral colors, digital glow, floating light forms, sci-fi illumination',
        mood: 'futuristic, surreal, magical, high-tech, ethereal',
        color: 'iridescent rainbow, holographic silver, cyan, magenta, shifting spectral hues',
        tech: 'hologram projection, iridescent rendering, spectral refraction, translucent glow, futuristic light, digital emission',
        ref: 'inspired by hologram and sci-fi projection lighting',
        negative: 'natural, warm, rustic, traditional, dull, muted'
      },
      '激光束': {
        core: 'laser beam, sharp focused coherent light line',
        detail: 'sharp coherent laser beam, intense single-color light, crisp beam line, high-energy glow, focused light point, futuristic atmosphere, precise illumination, vivid saturated color, beam scattering, light show',
        mood: 'intense, futuristic, energetic, dramatic, high-tech',
        color: 'vivid laser red, green, blue, saturated single colors, glowing beams, dark surround',
        tech: 'coherent beam, laser emission, sharp beam line, high intensity, saturated color, beam glow',
        ref: 'inspired by laser light shows and sci-fi lighting',
        negative: 'natural, soft, warm, rustic, traditional, dull, diffused'
      },
      '光剑光': {
        core: 'lightsaber glow, vivid glowing blade illumination',
        detail: 'vivid glowing blade, lightsaber light, bright luminous edge, saturated color glow, sci-fi weapon light, glowing beam, intense luminous line, futuristic glow, bright color cast, dramatic blade light',
        mood: 'futuristic, dramatic, intense, epic, sci-fi',
        color: 'vivid blue, green, red, luminous blade, glowing edge, dark surround',
        tech: 'lightsaber glow, luminous blade, saturated emission, sci-fi rendering, glowing edge, dramatic light',
        ref: 'inspired by sci-fi lightsaber lighting',
        negative: 'natural, warm, realistic, dull, muted, traditional'
      },
      '能量光': {
        core: 'energy glow, radiant luminous power field',
        detail: 'radiant luminous energy, glowing power field, intense bright core, electric aura, luminous waves, sci-fi energy, glowing particles, radiant glow, powerful light, dynamic energy field',
        mood: 'powerful, intense, futuristic, dynamic, electric',
        color: 'bright white core, electric blue, glowing cyan, luminous aura, dark surround',
        tech: 'energy glow, radiant field, luminous core, electric aura, sci-fi rendering, dynamic light',
        ref: 'inspired by energy and sci-fi lighting effects',
        negative: 'natural, warm, realistic, dull, muted, calm'
      },
      '魔法光': {
        core: 'magic light, mystical glowing enchantment illumination',
        detail: 'mystical glowing light, magical sparkle, enchanted glow, floating luminous orbs, ethereal magic, sparkling particles, mystical aura, soft radiant glow, magical atmosphere, luminous enchantment',
        mood: 'magical, mystical, whimsical, enchanting, ethereal',
        color: 'soft gold, luminous blue, glowing purple, sparkling white, magical aura',
        tech: 'magic glow, mystical sparkle, luminous orbs, ethereal rendering, enchanting light, soft radiance',
        ref: 'inspired by fantasy magic light effects',
        negative: 'harsh, realistic, dull, natural, mundane, bright'
      },
      '圣光': {
        core: 'holy light, divine radiant golden illumination',
        detail: 'divine radiant light, holy glow, golden beams, sacred illumination, heavenly light, luminous aura, ethereal radiance, warm celestial glow, majestic brightness, divine presence',
        mood: 'sacred, divine, majestic, serene, awe-inspiring',
        color: 'golden white, warm radiance, luminous beams, soft gold, heavenly glow',
        tech: 'holy light, divine radiance, golden beams, sacred glow, ethereal rendering, majestic light',
        ref: 'inspired by sacred and religious light imagery',
        negative: 'harsh, dark, cold, mundane, artificial, dull'
      },
      '神迹光': {
        core: 'divine light, awe-inspiring celestial manifestation',
        detail: 'awe-inspiring celestial light, divine manifestation, radiant heavenly glow, luminous shafts, majestic brightness, sacred radiance, ethereal beams, overwhelming light, celestial presence, transcendent glow',
        mood: 'awe-inspiring, divine, transcendent, majestic, overwhelming',
        color: 'bright golden-white, luminous shafts, warm radiance, celestial glow, soft gold',
        tech: 'divine light, celestial radiance, luminous shafts, majestic rendering, sacred glow, transcendent light',
        ref: 'inspired by divine and celestial light imagery',
        negative: 'harsh, dark, mundane, artificial, dull, cold'
      },
      '天使光': {
        core: 'angelic light, soft ethereal halo illumination',
        detail: 'soft ethereal halo light, angelic glow, gentle luminous aura, heavenly softness, radiant white glow, soft halo, ethereal brightness, gentle celestial light, luminous presence, pure glow',
        mood: 'ethereal, pure, serene, angelic, gentle',
        color: 'soft white, gentle gold, luminous halo, pale warm, heavenly glow',
        tech: 'angelic light, ethereal halo, soft luminous aura, gentle radiance, heavenly rendering, pure glow',
        ref: 'inspired by angelic and heavenly light imagery',
        negative: 'harsh, dark, cold, mundane, artificial, dull'
      },
      '幽灵光': {
        core: 'ghostly light, eerie pale luminous glow',
        detail: 'eerie pale luminous glow, ghostly light, spectral brightness, faint cold glow, haunting luminescence, translucent light, mysterious pale aura, eerie illumination, spectral ambience, faint ghostly radiance',
        mood: 'eerie, mysterious, haunting, spectral, unsettling',
        color: 'pale white, faint green, ghostly blue, translucent glow, cold tones',
        tech: 'ghostly glow, spectral light, eerie luminescence, translucent rendering, haunting ambience, pale radiance',
        ref: 'inspired by ghostly and spectral light effects',
        negative: 'bright, warm, cheerful, natural, realistic, harsh'
      },
      '鬼火': {
        core: 'will-o-wisp light, eerie floating blue flame glow',
        detail: 'eerie floating blue flame, will-o-wisp glow, dancing ghostly light, marsh glow, mysterious blue flame, floating luminous flame, spectral fire, eerie flicker, haunting blue light, phantom glow',
        mood: 'eerie, mysterious, haunting, supernatural, unsettling',
        color: 'pale blue flame, ghostly green, faint white, dark marsh, eerie glow',
        tech: 'will-o-wisp, floating blue flame, ghostly flicker, eerie rendering, supernatural glow, spectral light',
        ref: 'inspired by will-o-wisp and supernatural light folklore',
        negative: 'bright, warm, cheerful, natural, realistic, harsh'
      },
      '磷火': {
        core: 'phosphorus fire, eerie greenish flame glow',
        detail: 'eerie greenish flame, phosphorus glow, ghostly green fire, luminous flame, haunting green light, spectral fire, cold flame glow, eerie luminescence, mysterious green glow, phantom flame',
        mood: 'eerie, mysterious, haunting, supernatural, unsettling',
        color: 'pale green flame, ghostly green, faint white, dark surround, eerie glow',
        tech: 'phosphorus fire, greenish flame, ghostly glow, spectral rendering, eerie luminescence, cold flame',
        ref: 'inspired by phosphorus and ghostly flame imagery',
        negative: 'bright, warm, cheerful, natural, realistic, harsh'
      },
      '荧光海': {
        core: 'bioluminescent sea, glowing ocean wave light',
        detail: 'glowing ocean waves, bioluminescent sea, luminous blue water, glowing plankton, sparkling waves, ethereal blue glow, luminous foam, magical sea light, glowing surf, radiant ocean',
        mood: 'magical, ethereal, wondrous, serene, surreal',
        color: 'bioluminescent blue, glowing cyan, luminous teal, sparkling white, deep sea',
        tech: 'bioluminescent emission, glowing waves, luminous plankton, ethereal blue, long exposure, magical rendering',
        ref: 'inspired by bioluminescent sea photography',
        negative: 'daylight, harsh, artificial, warm, bright, fluorescent'
      },
      '极光带': {
        core: 'aurora band, vivid ribbon of polar light',
        detail: 'vivid ribbon of aurora light, glowing polar band, dancing green curtain, luminous ribbon, celestial color band, arctic glow, shimmering curtain, vivid polar light, flowing luminous band, night sky ribbon',
        mood: 'awe-inspiring, magical, ethereal, majestic, vibrant',
        color: 'vivid green, purple, teal, magenta, deep night blue, luminous band',
        tech: 'aurora band, glowing ribbon, polar curtain, long exposure, vivid color, celestial rendering',
        ref: 'inspired by aurora band night photography',
        negative: 'daylight, warm, sunny, bright, urban, artificial'
      },
      '太阳耀斑': {
        core: 'solar flare, intense bright sun burst illumination',
        detail: 'intense solar flare, bright sun burst, radiant corona flare, blinding brightness, solar prominence, intense white-gold light, dramatic sun glow, powerful solar light, radiant burst, intense brightness',
        mood: 'intense, powerful, dramatic, awe-inspiring, radiant',
        color: 'intense white-gold, bright yellow, radiant flare, warm glow, blinding white',
        tech: 'solar flare, bright burst, radiant corona, intense exposure, dramatic glow, powerful rendering',
        ref: 'inspired by solar flare and sun imagery',
        negative: 'soft, dim, cold, muted, gentle, dark'
      },
      '日冕光': {
        core: 'corona light, luminous halo around sun',
        detail: 'luminous corona halo, glow around sun, radiant ring, solar corona, bright atmospheric halo, luminous ring, sun glow, radiant halo, celestial ring, bright corona light',
        mood: 'awe-inspiring, radiant, majestic, ethereal, serene',
        color: 'bright white-gold, luminous halo, warm glow, radiant ring, soft gold',
        tech: 'corona rendering, luminous halo, radiant ring, solar glow, atmospheric halo, majestic light',
        ref: 'inspired by solar corona and halo imagery',
        negative: 'dark, dim, cold, muted, harsh, artificial'
      },
      '日食光': {
        core: 'eclipse light, dim eerie light during solar eclipse',
        detail: 'dim eerie light during eclipse, twilight-like darkness, corona visible, strange dim light, muted colors, surreal darkness, faint glow, eclipse ambience, dim golden ring, mysterious light',
        mood: 'surreal, eerie, mysterious, awe-inspiring, dramatic',
        color: 'dim grey, faint gold ring, muted tones, corona white, dark sky',
        tech: 'eclipse light, dim exposure, corona glow, twilight rendering, surreal ambience, muted colors',
        ref: 'inspired by solar eclipse photography',
        negative: 'bright, daylight, cheerful, harsh, sunny, normal'
      },
      '月食光': {
        core: 'lunar eclipse light, dim reddish moon glow',
        detail: 'dim reddish moon glow, lunar eclipse, blood moon light, faint copper light, dark night, eerie red glow, dim celestial light, muted moon, reddish ambience, mysterious night glow',
        mood: 'mysterious, eerie, dramatic, awe-inspiring, serene',
        color: 'dim copper red, dark red glow, deep navy, muted moon, faint orange',
        tech: 'lunar eclipse, dim red glow, blood moon, dark exposure, eerie rendering, muted moon',
        ref: 'inspired by lunar eclipse photography',
        negative: 'bright, daylight, cheerful, harsh, sunny, normal'
      },
      '彩虹光': {
        core: 'rainbow light, colorful spectral arc illumination',
        detail: 'colorful spectral arc, rainbow light, prismatic colors, vibrant color band, luminous spectrum, colorful glow, refracted colors, bright spectral arc, colorful illumination, radiant spectrum',
        mood: 'vibrant, joyful, magical, colorful, cheerful',
        color: 'vivid red, orange, yellow, green, blue, violet, luminous spectrum',
        tech: 'rainbow rendering, spectral arc, prismatic colors, luminous spectrum, vibrant glow, colorful light',
        ref: 'inspired by rainbow and spectral light photography',
        negative: 'muted, dull, monochrome, grey, flat, dark'
      },
      '棱镜光': {
        core: 'prism light, refracted colorful spectrum glow',
        detail: 'refracted colorful spectrum, prism light, dispersed colors, rainbow refraction, crystal glow, spectral dispersion, colorful light rays, prismatic sparkle, luminous spectrum, refracted glow',
        mood: 'colorful, magical, crystalline, fascinating, ethereal',
        color: 'prismatic rainbow, spectral colors, crystal highlights, colorful dispersion, luminous rays',
        tech: 'prism refraction, spectral dispersion, rainbow glow, crystal rendering, colorful rays, luminous spectrum',
        ref: 'inspired by prism and refraction photography',
        negative: 'flat, dull, muted, natural, plain, monochrome'
      },
      '水晶光': {
        core: 'crystal light, sparkling luminous gem illumination',
        detail: 'sparkling crystal light, luminous gem glow, refracted sparkle, crystalline brilliance, glowing facets, rainbow glints, luminous crystal, sparkling highlights, gemstone glow, radiant facets',
        mood: 'magical, sparkling, ethereal, crystalline, radiant',
        color: 'sparkling white, rainbow glints, luminous facets, soft color cast, radiant glow',
        tech: 'crystal rendering, refracted sparkle, luminous facets, rainbow glints, crystalline glow, sparkling light',
        ref: 'inspired by crystal and gem photography',
        negative: 'dull, flat, matte, muted, dark, plain'
      },
      '宝石光': {
        core: 'gemstone glow, rich luminous precious stone light',
        detail: 'rich luminous gemstone glow, precious stone light, deep saturated color, glowing facets, jewel brilliance, radiant color, luminous gem, rich glow, sparkling facets, jewel light',
        mood: 'luxurious, radiant, rich, magical, elegant',
        color: 'deep ruby red, sapphire blue, emerald green, golden amber, luminous facets',
        tech: 'gemstone rendering, luminous facets, rich saturated color, jewel glow, sparkling light, radiant brilliance',
        ref: 'inspired by gemstone and jewelry photography',
        negative: 'dull, flat, muted, dark, matte, plain'
      },
      '珍珠光': {
        core: 'pearl sheen, soft iridescent luminous glow',
        detail: 'soft iridescent pearl sheen, luminous glow, gentle shimmer, milky radiance, soft color play, elegant luster, gentle iridescence, luminous pearl, soft glow, refined sheen',
        mood: 'elegant, refined, soft, luminous, gentle',
        color: 'soft white, milky pink, pale gold, iridescent shimmer, gentle luster',
        tech: 'pearl sheen, iridescent glow, soft shimmer, milky radiance, elegant luster, luminous rendering',
        ref: 'inspired by pearl and mother-of-pearl photography',
        negative: 'harsh, dull, flat, dark, matte, bright'
      },
      '丝绸光': {
        core: 'silk sheen, soft lustrous fabric glow',
        detail: 'soft lustrous silk sheen, gentle fabric glow, smooth highlights, elegant luster, flowing light on fabric, soft shine, luminous folds, refined sheen, gentle glow, silky radiance',
        mood: 'elegant, refined, soft, luxurious, graceful',
        color: 'soft white, gentle gold, muted pastel, luminous folds, smooth sheen',
        tech: 'silk sheen, lustrous glow, smooth highlights, elegant luster, luminous folds, refined rendering',
        ref: 'inspired by silk fabric photography',
        negative: 'harsh, dull, flat, matte, dark, coarse'
      },
      '金属光': {
        core: 'metallic sheen, bright reflective metal light',
        detail: 'bright reflective metal sheen, polished metal glow, sharp highlights, mirror-like reflection, cool or warm metallic light, glossy surface, bright specular, industrial shine, luminous metal, crisp reflection',
        mood: 'modern, crisp, industrial, polished, sleek',
        color: 'bright silver, cool steel, warm gold, reflective highlights, metallic tones',
        tech: 'metallic sheen, reflective highlights, polished glow, specular rendering, industrial shine, crisp reflection',
        ref: 'inspired by metal and industrial photography',
        negative: 'matte, dull, soft, rustic, muted, dark'
      },
      '镜面光': {
        core: 'mirror light, sharp reflected illumination',
        detail: 'sharp reflected light, mirror reflection, bright glare, mirrored illumination, crisp reflection, reflected highlights, double light, luminous mirror, sharp glare, reflective brightness',
        mood: 'crisp, modern, reflective, sharp, polished',
        color: 'bright white glare, reflected tones, cool or warm cast, luminous mirror, crisp highlights',
        tech: 'mirror reflection, sharp glare, reflected illumination, crisp rendering, luminous mirror, reflective light',
        ref: 'inspired by mirror reflection photography',
        negative: 'matte, dull, soft, diffuse, muted, dark'
      },
      '水面倒影光': {
        core: 'water reflection light, mirrored glow on water',
        detail: 'mirrored light on water, reflection glow, shimmering reflection, luminous mirror surface, reflected highlights, gentle ripple, mirrored sky light, glowing reflection, soft mirrored glow, water mirror',
        mood: 'serene, peaceful, reflective, ethereal, calm',
        color: 'reflected warm or cool tones, shimmering highlights, luminous water, mirrored sky',
        tech: 'water reflection, mirrored glow, shimmering surface, reflected light, gentle ripple, luminous rendering',
        ref: 'inspired by water reflection photography',
        negative: 'flat, dull, matte, dark, choppy, harsh'
      },
      '冰晶光': {
        core: 'ice crystal light, sparkling frozen glitter glow',
        detail: 'sparkling ice crystal light, frozen glitter, crystalline frost glow, luminous ice, sparkling facets, cold brilliance, glittering ice, radiant frost, luminous crystals, frozen sparkle',
        mood: 'crisp, magical, cold, sparkling, serene',
        color: 'bright white, pale blue, silver sparkle, luminous ice, cool tones',
        tech: 'ice crystal rendering, frozen glitter, crystalline glow, sparkling facets, cold brilliance, luminous frost',
        ref: 'inspired by ice crystal and frost photography',
        negative: 'warm, dull, dark, matte, muted, harsh'
      },
      '霜光': {
        core: 'frost light, soft luminous frosty glow',
        detail: 'soft luminous frosty glow, frost-covered light, gentle cold shimmer, frosted glass light, soft white glow, icy ambience, delicate frost sparkle, luminous frost, gentle cold light, frosted radiance',
        mood: 'cold, serene, delicate, crisp, gentle',
        color: 'soft white, pale blue, frosted grey, luminous frost, cool tones',
        tech: 'frost rendering, luminous frosty glow, frosted light, cold shimmer, delicate sparkle, icy ambience',
        ref: 'inspired by frost and frozen window photography',
        negative: 'warm, harsh, bright, dull, dark, sunny'
      },
      '露珠光': {
        core: 'dew light, sparkling morning droplet glow',
        detail: 'sparkling dew droplets, morning droplet glow, luminous beads, glistening dew, light-catching drops, gentle sparkle, fresh morning light, luminous droplets, glistening highlights, dewy radiance',
        mood: 'fresh, gentle, sparkling, serene, delicate',
        color: 'bright sparkle, soft gold, clear highlights, fresh green, luminous drops',
        tech: 'dew rendering, sparkling droplets, luminous beads, glistening highlights, morning light, delicate sparkle',
        ref: 'inspired by dew and droplet macro photography',
        negative: 'harsh, dark, dull, dry, muted, bright'
      },
      '雨滴光': {
        core: 'raindrop light, sparkling wet droplet illumination',
        detail: 'sparkling raindrops, wet droplet glow, light-catching rain, glistening drops, luminous raindrops, reflective wet surface, sparkling highlights, rain glow, shimmering drops, wet radiance',
        mood: 'fresh, lively, sparkling, atmospheric, gentle',
        color: 'bright sparkle, cool or warm cast, glistening drops, wet highlights, luminous rain',
        tech: 'raindrop rendering, sparkling droplets, wet glow, glistening highlights, reflective surface, luminous rain',
        ref: 'inspired by rain and droplet photography',
        negative: 'dry, harsh, dull, dark, muted, bright'
      },
      '雪花光': {
        core: 'snowflake light, sparkling crystalline snow glow',
        detail: 'sparkling snowflakes, crystalline snow glow, luminous flakes, glittering snow, gentle sparkle, bright winter light, luminous crystals, sparkling drift, radiant snow, frozen sparkle',
        mood: 'crisp, magical, serene, sparkling, wintery',
        color: 'bright white, pale blue, silver sparkle, luminous flakes, cool tones',
        tech: 'snowflake rendering, crystalline glow, sparkling flakes, luminous snow, glittering light, wintery radiance',
        ref: 'inspired by snowflake and snowfall photography',
        negative: 'warm, dull, dark, matte, muted, harsh'
      },
      '闪电链光': {
        core: 'lightning chain light, branching electric streak glow',
        detail: 'branching lightning chain, electric streak glow, forked lightning, bright branching flash, dramatic sky light, luminous branches, intense electric light, storm glow, branching bolt, powerful flash',
        mood: 'dramatic, intense, electric, powerful, stormy',
        color: 'electric blue-white, bright branching flash, cool storm cast, silver highlights, dark sky',
        tech: 'lightning chain, branching streak, forked bolt, intense flash, storm exposure, dramatic rendering',
        ref: 'inspired by forked lightning photography',
        negative: 'warm, soft, even, gentle, calm, sunny'
      },
      '雷暴光': {
        core: 'thunderstorm light, dramatic storm cloud illumination',
        detail: 'dramatic storm cloud light, thunderstorm glow, dark cloud illumination, lightning-lit sky, brooding atmosphere, dramatic storm light, dark clouds, electric ambience, stormy glow, intense sky',
        mood: 'dramatic, intense, brooding, powerful, stormy',
        color: 'dark grey, electric blue, deep navy, silver highlights, stormy tones',
        tech: 'thunderstorm rendering, storm cloud glow, lightning-lit sky, dramatic exposure, brooding atmosphere, electric ambience',
        ref: 'inspired by thunderstorm photography',
        negative: 'bright, cheerful, sunny, calm, soft, warm'
      },
      '龙卷风光': {
        core: 'tornado light, ominous dark funnel illumination',
        detail: 'ominous dark funnel light, tornado glow, eerie storm light, dark swirling cloud, dramatic sky, greenish storm cast, ominous illumination, swirling darkness, intense storm ambience, foreboding light',
        mood: 'ominous, dramatic, intense, foreboding, eerie',
        color: 'dark grey, greenish storm cast, deep shadows, pale eerie light, ominous tones',
        tech: 'tornado rendering, dark funnel, ominous glow, storm exposure, eerie light, dramatic sky',
        ref: 'inspired by tornado and supercell photography',
        negative: 'bright, cheerful, sunny, calm, soft, warm'
      },
      '沙尘暴光': {
        core: 'sandstorm light, hazy orange dust illumination',
        detail: 'hazy orange dust light, sandstorm glow, dusty amber illumination, blurred dusty view, warm haze, gritty atmosphere, dust-filled light, orange glow, obscured sun, dusty radiance',
        mood: 'hazy, intense, gritty, atmospheric, dramatic',
        color: 'orange dust, warm amber, hazy brown, muted sky, dusty glow',
        tech: 'sandstorm rendering, hazy dust, orange glow, gritty atmosphere, warm haze, obscured light',
        ref: 'inspired by sandstorm and dust photography',
        negative: 'clear, crisp, sharp, cool, clean, bright'
      },
      '海市蜃楼光': {
        core: 'mirage light, shimmering distorted desert glow',
        detail: 'shimmering mirage light, distorted desert glow, wavy refraction, illusory water reflection, heat shimmer, blurred horizon, dreamlike glow, surreal light, shimmering illusion, mirage radiance',
        mood: 'surreal, dreamlike, mysterious, illusory, ethereal',
        color: 'shimmering pale blue, warm haze, distorted tones, silver glow, muted sky',
        tech: 'mirage rendering, shimmering refraction, distorted glow, heat shimmer, illusory light, surreal ambience',
        ref: 'inspired by mirage and desert illusion photography',
        negative: 'crisp, sharp, clear, cool, solid, defined'
      },
      '极光反射': {
        core: 'aurora reflection, polar light mirrored on water',
        detail: 'aurora light reflecting on water, mirrored polar glow, green and purple reflection, shimmering water mirror, luminous reflection, arctic glow on lake, mirrored celestial light, dancing reflection, ethereal mirror, polar radiance',
        mood: 'ethereal, magical, serene, awe-inspiring, tranquil',
        color: 'aurora green, purple, teal, reflected shimmer, deep night blue',
        tech: 'aurora reflection, mirrored polar glow, water mirror, shimmering reflection, long exposure, ethereal rendering',
        ref: 'inspired by aurora reflection on lakes',
        negative: 'harsh, direct, daylight, warm, bright, urban'
      },
      '霓虹雨夜': {
        core: 'neon rainy night, colored light on wet night streets',
        detail: 'neon light on rainy night, colored reflections on wet streets, glowing puddles, light bleed, wet asphalt glow, saturated color cast, rainy urban night, shimmering reflections, neon rain glow, atmospheric night',
        mood: 'nocturnal, atmospheric, vibrant, moody, cinematic',
        color: 'neon cyan, hot pink, electric purple, wet reflections, deep shadows',
        tech: 'neon rainy night, wet street reflection, light bleed, glowing puddles, saturated cast, night exposure',
        ref: 'inspired by neon rainy night street photography',
        negative: 'natural, daylight, dry, warm cozy, rural, soft'
      },
      '路灯暖光': {
        core: 'warm streetlight, cozy sodium lamp glow',
        detail: 'warm sodium streetlight glow, cozy pool of light, warm-orange cast, lamp halo, soft falloff, night street ambience, long shadows, intimate glow, warm urban light, gentle illumination',
        mood: 'nocturnal, cozy, nostalgic, urban, intimate',
        color: 'warm orange, sodium yellow, amber, deep night blue shadows, warm halo',
        tech: 'warm streetlight, sodium source, pool of light, soft falloff, long shadows, night exposure',
        ref: 'inspired by warm streetlight night photography',
        negative: 'daylight, bright, cold, fluorescent, harsh, sunny'
      },
      '广告牌光': {
        core: 'billboard light, bright commercial sign illumination',
        detail: 'bright billboard light, glowing advertisement, illuminated sign, commercial glow, bright display light, urban advertising light, luminous board, bright signage, colorful commercial glow, night advertising',
        mood: 'urban, bright, commercial, vibrant, modern',
        color: 'bright white, colorful display, saturated ad colors, glowing sign, urban tones',
        tech: 'billboard illumination, glowing sign, bright display, commercial rendering, urban light, luminous board',
        ref: 'inspired by billboard and advertising light photography',
        negative: 'natural, dark, rural, soft, muted, warm cozy'
      },
      '橱窗光': {
        core: 'shop window light, warm inviting storefront glow',
        detail: 'warm inviting shop window light, glowing storefront, illuminated display, cozy retail glow, bright window display, inviting warm light, commercial showcase, luminous window, warm storefront, inviting glow',
        mood: 'inviting, warm, cozy, commercial, welcoming',
        color: 'warm white, soft gold, inviting glow, display colors, warm tones',
        tech: 'shop window illumination, glowing display, warm storefront, inviting rendering, commercial light, luminous window',
        ref: 'inspired by shop window and storefront photography',
        negative: 'cold, harsh, dark, closed, dull, muted'
      }
    },
    keywords: ['光线', '灯光', '光源', '光照', '打光', '光', '调子', '明暗', '背光', '逆光', '月色', '日光', '月光', '夕阳', '黄昏', '霓虹', '烛光', '暗']
  },

  composition: {
    name: '构图',
    categories: {
      '超广角': {
        core: 'ultra wide angle, expansive panoramic view',
        detail: '14mm focal length, sweeping vista, dramatic perspective, foreground emphasis, leading lines to horizon, immersive scale',
        tech: '14-24mm lens, f/8 for deep focus, converging lines, dramatic foreground, 2.35:1 aspect ratio',
        negative: 'telephoto, compressed, close-up, flat, narrow'
      },
      '特写镜头': {
        core: 'extreme close-up, intimate detail shot',
        detail: 'macro level detail, texture emphasis, tight framing, emotional intensity, shallow depth, eye-level or slightly above',
        tech: '85-105mm macro, f/1.4-f/2.8, razor-thin DOF, focus on eyes/texture, bokeh background',
        negative: 'wide, full body, environmental, distant, small subject'
      },
      '中景': {
        core: 'medium shot, balanced waist-up framing',
        detail: 'natural perspective, subject-dominant, environmental context, comfortable viewing distance, 50mm equivalent',
        tech: '50mm lens, f/2.8-f/4, moderate DOF, eye-level, natural distortion-free',
        negative: 'extreme wide, macro, distorted, fisheye'
      },
      '俯拍鸟瞰': {
        core: 'bird eye view, top-down aerial perspective',
        detail: 'drone shot, god perspective, geometric patterns from above, miniature feel, full scene reveal, 90-degree downward',
        tech: 'drone camera, 24mm, f/5.6, nadir angle, tilt-shift effect, map-like composition',
        negative: 'eye-level, low angle, worm eye, looking up, ground level'
      },
      '仰拍': {
        core: 'low angle heroic shot, worm eye perspective',
        detail: 'looking up at subject, imposing scale, sky background, power dynamic, dramatic verticality, converging vertical lines',
        tech: '16-24mm, f/8, strong vertical convergence, dramatic sky, subject towering',
        negative: 'eye-level, top-down, bird eye, looking down, equal'
      },
      '三分法': {
        core: 'rule of thirds, dynamic off-center composition',
        detail: 'subject on intersection points, balanced negative space, visual flow, breathing room, asymmetrical harmony',
        tech: 'golden ratio grid, subject on third line, negative space balance, leading gaze direction',
        negative: 'centered, symmetrical, dead center, static'
      },
      '居中对称': {
        core: 'centered symmetrical composition, formal balance',
        detail: 'perfect symmetry, mirror composition, Wes Anderson style, architectural precision, ceremonial framing',
        tech: 'one-point perspective, centered horizon, symmetrical elements, parallel lines, formal precision',
        negative: 'off-center, asymmetrical, rule of thirds, dynamic, tilted'
      },
      '荷兰角': {
        core: 'dutch angle, tilted camera, dramatic disorientation',
        detail: 'camera tilted 15-45 degrees, unease and tension, dynamic energy, psychological instability, action emphasis',
        tech: 'tilted horizon 15-30°, diagonal lines, dynamic tension, unbalanced feel, action emphasis',
        negative: 'level, stable, calm, balanced, horizontal, formal'
      },
      '纵深层次': {
        core: 'deep depth composition, layered spatial depth',
        detail: 'foreground frame, midground subject, background context, atmospheric perspective, depth cues, overlapping planes',
        tech: 'foreground elements out of focus, midground sharp, background atmosphere, 24mm, f/8-f/11, deep focus',
        negative: 'flat, shallow, single plane, compressed, telephoto'
      },
      '引导线': {
        core: 'leading lines, directional composition',
        detail: 'natural lines guiding eye to subject, roads rivers architecture, converging perspective, implied movement, visual journey',
        tech: 'strong linear elements, S-curve or diagonal, vanishing point, subject at line convergence',
        negative: 'scattered, no direction, chaotic, competing lines'
      },
      '框式构图': {
        core: 'frame within a frame, natural framing',
        detail: 'doorway window archway framing subject, depth through layers, voyeuristic feel, focused attention, contextual nesting',
        tech: 'natural frame elements, subject centered within frame, contrast between frame darkness and subject light',
        negative: 'open, no foreground, no layers, flat, direct'
      },
      '前景虚化': {
        core: 'blurred foreground elements framing the subject',
        tech: 'shallow depth of field, wide aperture f/1.4-f/2.8, foreground out-of-focus, bokeh rendering, focus stacking optional, leading frame, subject isolation, three-dimensional depth, near-field blur, defocused foreground, creamy bokeh circles'
      },
      '对角线': {
        core: 'dynamic diagonal lines across the frame',
        tech: 'diagonal leading lines, Dutch angle tilt, dynamic tension, frame energy direction, rule of diagonals, asymmetric balance, visual flow path, vanishing point convergence, angular composition, kinetic energy, corner-to-corner sweep'
      },
      '黄金分割': {
        core: 'harmonious proportion based on golden spiral',
        tech: '1:1.618 ratio, golden spiral overlay, Fibonacci sequence, phi grid, natural balance point, divine proportion, compositional harmony, rule of thirds refinement, natural focal point, spiral convergence, aesthetic mathematics'
      },
      '鱼眼': {
        core: 'extreme wide-angle hemispherical distorted circular view',
        tech: '180-degree field of view, barrel distortion, circular or full-frame fisheye, 8-15mm focal length, extreme perspective, curved horizon line, immersive spherical projection, ultra-wide angle, exaggerated depth, edge compression'
      },
      '微距': {
        core: 'extreme close-up revealing minute hidden details',
        tech: '1:1 magnification ratio, shallow depth of field, focus stacking, macro lens 60-105mm, close focus distance, extension tubes, reversed lens, high magnification detail capture, working distance, diffraction control, ring flash'
      },
      '全景': {
        core: 'ultra-wide sweeping vista capturing vast scene',
        tech: 'multi-image stitching, wide aspect ratio 2:1+, panoramic sweep, cylindrical projection, ultra-wide field of view, nodal point rotation, landscape orientation, 16mm or wider, seamless blending, horizon alignment, expansive coverage'
      },
      '倾斜移轴': {
        core: 'miniature effect with selective focus plane',
        tech: 'tilt-shift lens, Scheimpflug principle, selective focus plane, miniature diorama effect, perspective correction, tilt and shift movements, narrow depth band, lens plane adjustment, converging line fix, fake miniature, selective blur gradient'
      },
      '隧道视角': {
        core: 'framed view through opening into beyond',
        tech: 'frame within frame, central vanishing point, converging lines, peephole composition, depth layering, natural vignette, foreground framing, forced perspective, tunnel vision, enclosed leading path, aperture view'
      },
      '倒影': {
        core: 'mirrored symmetry using reflective surfaces composition',
        tech: 'mirror symmetry composition, water surface reflection, glass reflection, perfect horizontal symmetry, flipped perspective, double visual interest, calm surface requirement, polarizer filter, reflection axis, puddle mirror, urban glass reflection'
      },
      '中心构图': {
        core: 'subject centered in frame, symmetrical focal balance',
        detail: 'main subject at exact center, strong focal point, balanced negative space, formal presentation, direct attention, stable composition, symmetrical emphasis, dominant central subject',
        tech: 'center framing, symmetrical balance, one-point focus, formal layout, equal margins, central focal point',
        negative: 'off-center, rule of thirds, dynamic, tilted, asymmetric'
      },
      '对称构图': {
        core: 'perfect mirror symmetry across central axis',
        detail: 'balanced mirror halves, architectural symmetry, reflection symmetry, formal elegance, harmonious balance, equal visual weight, precise alignment, ceremonial framing',
        tech: 'central axis symmetry, mirror framing, balanced halves, formal precision, symmetrical alignment',
        negative: 'asymmetric, off-center, rule of thirds, dynamic, unbalanced'
      },
      '对角线构图': {
        core: 'dynamic diagonal lines across the frame',
        detail: 'strong diagonal flow, dynamic energy, directional movement, visual tension, diagonal balance, energetic sweep, implied motion, corner-to-corner lines',
        tech: 'diagonal leading lines, dynamic angle, directional flow, visual tension, asymmetric balance, corner sweep',
        negative: 'horizontal, vertical, static, level, calm, balanced'
      },
      '框架构图': {
        core: 'frame within a frame, natural framing elements',
        detail: 'doorway window archway framing subject, layered depth, focused attention, contextual framing, voyeuristic feel, nested composition, foreground frame, subject isolation',
        tech: 'natural frame elements, foreground framing, layered depth, subject within frame, contrast framing',
        negative: 'open, no foreground, no layers, flat, direct'
      },
      '黄金螺旋': {
        core: 'golden spiral composition, harmonious focal placement',
        detail: 'spiral flow guiding eye to focal point, fibonacci spiral, natural harmony, balanced focal placement, dynamic yet harmonious, spiral convergence, pleasing proportion',
        tech: 'golden spiral overlay, fibonacci sequence, phi ratio, spiral focal point, harmonious proportion, natural balance',
        negative: 'centered, static, random, unbalanced, cluttered'
      },
      '留白构图': {
        core: 'generous negative space, minimal subject placement',
        detail: 'large empty space around subject, breathing room, minimalist balance, subject small in frame, contemplative mood, clean background, visual calm, emphasis through emptiness',
        tech: 'negative space, minimal composition, subject offset, generous margins, clean background, breathing room',
        negative: 'cluttered, busy, filled, dense, crowded, maximalist'
      },
      '俯拍': {
        core: 'top-down overhead perspective',
        detail: 'camera directly above subject, flat top-down view, geometric patterns, full scene reveal, overhead composition, tabletop view, bird perspective, downward angle',
        tech: '90-degree overhead angle, top-down camera, nadir view, flat perspective, overhead framing, aerial-like view',
        negative: 'eye-level, low angle, worm eye, looking up, ground level'
      },
      '平视': {
        core: 'eye-level perspective, natural viewing angle',
        detail: 'camera at subject eye level, natural perspective, neutral angle, relatable viewpoint, comfortable framing, realistic proportions, direct engagement, balanced horizon',
        tech: 'eye-level camera, neutral angle, natural perspective, standard framing, subject eye height, balanced view',
        negative: 'low angle, high angle, tilted, dramatic, distorted'
      },
      '特写': {
        core: 'close-up framing, intimate detail focus',
        detail: 'tight framing on subject, facial or object detail, emotional intensity, shallow depth, intimate proximity, detail emphasis, focused attention, close perspective',
        tech: 'close-up lens, tight framing, shallow depth of field, intimate distance, detail focus, 50-85mm',
        negative: 'wide, full body, distant, environmental, small subject'
      },
      '远景': {
        core: 'long shot, subject small in vast environment',
        detail: 'subject small within wide environment, establishing scale, vast landscape, environmental context, distance perspective, isolation feel, wide framing, contextual composition',
        tech: 'long shot framing, wide lens, subject small in frame, environmental scale, distant perspective, establishing shot',
        negative: 'close-up, tight, intimate, detail, macro'
      },
      '低角度': {
        core: 'low angle looking up, imposing perspective',
        detail: 'camera below subject, upward view, imposing scale, power dynamic, dramatic verticality, sky background, heroic feel, converging vertical lines, towering subject',
        tech: 'low camera position, upward angle, wide lens, vertical convergence, dramatic perspective, subject towering',
        negative: 'eye-level, top-down, high angle, looking down, equal'
      },
      '高角度': {
        core: 'high angle looking down, overview perspective',
        detail: 'camera above subject, downward view, diminished subject, overview perspective, vulnerability feel, scene context, elevated viewpoint, looking down angle',
        tech: 'high camera position, downward angle, elevated viewpoint, overview framing, subject diminished, context reveal',
        negative: 'eye-level, low angle, worm eye, looking up, equal'
      },
      '环绕构图': {
        core: 'circular surrounding composition, subjects around center',
        detail: 'elements arranged in circle around center, surrounding focal point, radial composition, circular flow, encircling subject, ring arrangement, orbital framing, surrounding context',
        tech: 'circular arrangement, radial composition, surrounding framing, orbital layout, ring structure, centered focal point',
        negative: 'linear, horizontal, scattered, random, unbalanced'
      },
      '镜像构图': {
        core: 'mirror reflection composition, mirrored symmetry',
        detail: 'reflection mirroring subject, mirrored symmetry, water or glass reflection, double subject, symmetrical reflection, reflective balance, flipped perspective, mirror axis',
        tech: 'mirror symmetry, reflection composition, reflective surface, mirrored framing, symmetry axis, double visual',
        negative: 'asymmetric, off-center, no reflection, unbalanced, flat'
      },
      '重复构图': {
        core: 'repetitive patterns and elements composition',
        detail: 'repeated elements creating rhythm, pattern repetition, visual rhythm, uniform sequence, pattern texture, rhythmic flow, repeated forms, structured repetition, pattern emphasis',
        tech: 'repetition of elements, pattern rhythm, uniform sequence, repeated forms, visual rhythm, structured pattern',
        negative: 'single subject, isolated, random, chaotic, unique'
      },
      'S形构图': {
        core: 'S-curve composition, serpentine visual flow',
        detail: 'winding S-shaped path guiding the eye, serpentine lines, elegant flow, graceful curves, dynamic movement, leading lines in S form, rhythmic visual path, flowing composition',
        tech: 'S-curve leading lines, serpentine path, winding road or river, elegant flow, dynamic visual movement, rhythmic curves',
        negative: 'straight, static, rigid, vertical, horizontal, chaotic'
      },
      '三角形构图': {
        core: 'triangular composition, stable pyramid structure',
        detail: 'subjects arranged in triangle, stable pyramid structure, balanced visual weight, strong base, hierarchical arrangement, geometric stability, focal point at apex, solid foundation',
        tech: 'triangular arrangement, pyramid structure, stable base, geometric balance, apex focal point, hierarchical composition',
        negative: 'unbalanced, scattered, chaotic, flat, random'
      },
      '圆形构图': {
        core: 'circular composition, radial focal structure',
        detail: 'elements arranged in circle, radial focus toward center, enclosed framing, cyclical flow, circular movement, centered focal point, ring structure, orbital arrangement, cohesive unity',
        tech: 'circular arrangement, radial composition, ring structure, centered focal point, orbital flow, cohesive unity',
        negative: 'linear, scattered, rectangular, angular, unbalanced'
      },
      '曲线构图': {
        core: 'curved composition, flowing curved lines',
        detail: 'gentle curved lines guiding the eye, flowing curves, graceful arcs, soft movement, organic flow, curved leading lines, elegant sweep, natural curvature',
        tech: 'curved leading lines, flowing arcs, organic curves, graceful sweep, soft directional flow, elegant curvature',
        negative: 'straight, angular, rigid, jagged, static'
      },
      '透视构图': {
        core: 'perspective composition, strong depth convergence',
        detail: 'strong linear perspective, converging lines to vanishing point, dramatic depth, receding space, spatial depth, one-point or two-point perspective, depth illusion, vanishing point focus',
        tech: 'linear perspective, converging lines, vanishing point, receding space, one-point perspective, dramatic depth, spatial illusion',
        negative: 'flat, frontal, shallow, compressed, no depth'
      },
      '斐波那契螺旋': {
        core: 'fibonacci spiral composition, natural logarithmic flow',
        detail: 'spiral curve following fibonacci sequence, eye guided in natural arc, harmonious focal point, organic flow, balanced proportion, elegant curve, mathematical harmony',
        tech: 'fibonacci spiral overlay, logarithmic spiral, phi ratio curve, spiral focal placement, natural arc flow, harmonious proportion',
        negative: 'static, centered, random, cluttered, unbalanced'
      },
      '放射线构图': {
        core: 'radial lines composition, converging rays from center',
        detail: 'lines radiating outward from central point, dynamic energy, directional burst, focal center, sunburst effect, radiating perspective, explosive movement, converging rays',
        tech: 'radial lines, central convergence, sunburst rays, radiating perspective, dynamic burst, focal center',
        negative: 'parallel, static, scattered, no center, chaotic'
      },
      '框架式构图': {
        core: 'framing composition using foreground elements',
        detail: 'foreground elements frame the subject, natural frame, layered depth, focused attention, contextual framing, nested composition, subject isolation, voyeuristic feel',
        tech: 'foreground framing, natural frame elements, layered depth, subject within frame, contrast framing, focus isolation',
        negative: 'open, flat, no foreground, no layers, direct'
      },
      '对称式构图': {
        core: 'symmetrical composition, balanced mirror halves',
        detail: 'perfect mirror symmetry, balanced halves, formal elegance, harmonious balance, equal visual weight, precise alignment, ceremonial framing, architectural symmetry',
        tech: 'central axis symmetry, mirror framing, balanced halves, formal precision, symmetrical alignment',
        negative: 'asymmetric, off-center, dynamic, tilted, unbalanced'
      },
      '非对称构图': {
        core: 'asymmetric composition, dynamic off-balance arrangement',
        detail: 'off-center subject placement, dynamic tension, visual interest, rule of thirds influence, unbalanced yet harmonious, modern dynamic feel, asymmetric balance',
        tech: 'off-center framing, asymmetric balance, dynamic tension, rule of thirds, negative space, modern layout',
        negative: 'centered, symmetrical, static, formal, balanced'
      },
      '满版构图': {
        core: 'full-bleed composition, edge-to-edge subject',
        detail: 'subject fills entire frame, edge-to-edge coverage, immersive presence, no margins, bold scale, dominant subject, full-frame impact, bleeding edges',
        tech: 'full-bleed framing, edge-to-edge coverage, no margins, immersive scale, dominant subject, bold presence',
        negative: 'negative space, minimal, small subject, margins, empty'
      },
      '出血构图': {
        core: 'bleed composition, subject extends beyond frame edge',
        detail: 'subject extends beyond frame edges, cropped by frame, implied continuation, dynamic energy, close crop, partial subject, edge cropping, immersive feel',
        tech: 'edge cropping, subject extends beyond frame, bleed effect, partial subject, dynamic crop, immersive framing',
        negative: 'full subject, centered, complete, static, distant'
      },
      '边缘构图': {
        core: 'edge composition, subject placed at frame edge',
        detail: 'subject positioned at frame edge, unbalanced tension, directional gaze, negative space opposite, dynamic placement, edge emphasis, off-center energy',
        tech: 'edge placement, frame edge positioning, directional tension, negative space balance, dynamic offset',
        negative: 'centered, symmetrical, balanced, static, middle'
      },
      '角落构图': {
        core: 'corner composition, subject in frame corner',
        detail: 'subject placed in corner of frame, strong directional tension, vast negative space, dynamic imbalance, corner emphasis, gaze direction, minimal placement',
        tech: 'corner placement, frame corner positioning, negative space, directional tension, minimal composition',
        negative: 'centered, symmetrical, balanced, static, middle'
      },
      '偏移构图': {
        core: 'offset composition, subject shifted from center',
        detail: 'subject offset from center, dynamic balance, negative space, rule of thirds, visual interest, off-center harmony, breathing room, directional flow',
        tech: 'offset framing, off-center placement, negative space, rule of thirds, dynamic balance, breathing room',
        negative: 'centered, symmetrical, static, formal, balanced'
      },
      '俯视构图': {
        core: 'top-down composition, looking down at subject',
        detail: 'camera looking down, elevated viewpoint, diminished subject, overview perspective, scene context, vulnerability feel, downward angle, aerial-like view',
        tech: 'high camera position, downward angle, elevated viewpoint, overview framing, subject diminished, context reveal',
        negative: 'eye-level, low angle, looking up, equal, worm eye'
      },
      '仰视构图': {
        core: 'low-angle looking up composition, imposing perspective',
        detail: 'camera looking up at subject, imposing scale, power dynamic, sky background, dramatic verticality, heroic feel, towering subject, converging verticals',
        tech: 'low camera position, upward angle, wide lens, vertical convergence, dramatic perspective, subject towering',
        negative: 'eye-level, top-down, high angle, looking down, equal'
      },
      '斜视构图': {
        core: 'oblique angle composition, tilted perspective',
        detail: 'camera at oblique angle, tilted perspective, dynamic unease, diagonal energy, dramatic tension, skewed horizon, psychological instability, action emphasis',
        tech: 'oblique angle, tilted camera, diagonal lines, dynamic tension, skewed horizon, unbalanced feel',
        negative: 'level, stable, calm, balanced, horizontal, formal'
      },
      '虫眼视角': {
        core: 'worm eye view, extreme low angle from ground',
        detail: 'camera at ground level looking up, extreme low angle, towering subject, dramatic scale, sky dominance, powerful perspective, ground-level view, monumental feel',
        tech: 'ground-level camera, extreme low angle, upward view, towering perspective, dramatic scale, sky background',
        negative: 'eye-level, top-down, bird eye, looking down, equal'
      },
      '广角构图': {
        core: 'wide angle composition, expansive perspective',
        detail: 'wide field of view, expansive scene, dramatic perspective, foreground emphasis, exaggerated depth, sweeping vista, wide framing, immersive scale',
        tech: 'wide angle lens, 16-35mm, expansive field of view, dramatic perspective, foreground emphasis, sweeping vista',
        negative: 'telephoto, compressed, close-up, narrow, flat'
      },
      '长焦构图': {
        core: 'telephoto composition, compressed perspective',
        detail: 'compressed perspective, flattened depth, subject isolation, background compression, distant subject, narrow field of view, intimate framing, layered compression',
        tech: 'telephoto lens, 135mm+, compressed perspective, background compression, subject isolation, narrow field of view',
        negative: 'wide angle, expansive, deep depth, exaggerated perspective, foreground emphasis'
      },
      '半身构图': {
        core: 'waist-up framing, medium close composition',
        detail: 'subject framed from waist up, balanced portrait framing, moderate detail, natural perspective, comfortable distance, subject emphasis, upper body focus',
        tech: 'waist-up framing, 50-85mm, moderate DOF, eye-level, subject emphasis, balanced portrait',
        negative: 'full body, extreme close-up, wide, distant, macro'
      },
      '全身构图': {
        core: 'full body framing, complete subject in frame',
        detail: 'entire subject visible in frame, full figure composition, environmental context, complete silhouette, standing pose, full-length framing, subject scale',
        tech: 'full body framing, 35-50mm, full figure in frame, complete silhouette, environmental context, standing pose',
        negative: 'close-up, waist-up, cropped, partial, macro'
      },
      '大头特写': {
        core: 'head and shoulders close-up, intimate portrait framing',
        detail: 'tight head and shoulders framing, facial detail, emotional intensity, intimate proximity, shallow depth, eye contact, expressive features, close portrait',
        tech: 'head and shoulders framing, 85-135mm, shallow depth of field, intimate distance, facial detail, eye focus',
        negative: 'full body, wide, distant, environmental, small subject'
      },
      '侧面构图': {
        core: 'profile composition, subject viewed from side',
        detail: 'subject in profile, side view, silhouette emphasis, facial profile, elegant line, side lighting, profile portrait, directional gaze, classical profile',
        tech: 'profile view, side angle, silhouette emphasis, side lighting, profile portrait, directional framing',
        negative: 'frontal, three-quarter, back view, straight-on, centered'
      },
      '背面构图': {
        core: 'back view composition, subject seen from behind',
        detail: 'subject viewed from behind, mystery and anonymity, viewer perspective, contemplative mood, shared viewpoint, back silhouette, introspective feel, leading gaze',
        tech: 'back view, rear angle, viewer perspective, contemplative framing, back silhouette, shared viewpoint',
        negative: 'frontal, profile, face visible, straight-on, direct'
      },
      '正面构图': {
        core: 'frontal composition, subject facing camera directly',
        detail: 'subject facing camera head-on, direct engagement, confrontational presence, symmetrical front view, eye contact, frontal portrait, direct address, formal frontality',
        tech: 'frontal view, head-on angle, direct engagement, eye contact, symmetrical frontality, formal framing',
        negative: 'profile, back view, three-quarter, side angle, turned away'
      },
      '四分之三角度': {
        core: 'three-quarter angle composition, angled portrait view',
        detail: 'subject at three-quarter angle, natural portrait perspective, balanced features, flattering angle, dynamic yet natural, partial profile, dimensional face, engaging view',
        tech: 'three-quarter angle, 45-degree view, portrait perspective, balanced features, natural framing, dimensional rendering',
        negative: 'frontal, full profile, back view, straight-on, side'
      },
      '剪影构图': {
        core: 'silhouette composition, dark subject against bright background',
        detail: 'subject as dark silhouette against bright background, dramatic contrast, shape emphasis, backlighting, simplified form, mystery and drama, strong outline, atmospheric scene',
        tech: 'backlighting, silhouette rendering, high contrast, dark subject, bright background, dramatic outline, shape emphasis',
        negative: 'flat lighting, detailed subject, low contrast, frontal light, washed out'
      },
      '反射构图': {
        core: 'reflection composition, mirrored subject in reflective surface',
        detail: 'subject reflected in reflective surface, mirror symmetry, water or glass reflection, double subject, reflective balance, flipped perspective, visual interest, symmetrical reflection',
        tech: 'reflective surface, mirror symmetry, water reflection, glass reflection, flipped perspective, symmetrical balance',
        negative: 'no reflection, asymmetric, flat, matte surface, unbalanced'
      },
      '一点透视': {
        core: 'one-point perspective, single vanishing point',
        detail: 'all lines converge to single vanishing point, strong depth, central focus, receding space, linear perspective, dramatic depth, tunnel effect, focused convergence',
        tech: 'one-point perspective, single vanishing point, converging lines, central focus, receding space, linear depth',
        negative: 'flat, frontal, no depth, two-point, multi-point, compressed'
      },
      '两点透视': {
        core: 'two-point perspective, two vanishing points',
        detail: 'lines converge to two vanishing points, corner view, dynamic depth, angular perspective, building corner, spatial realism, receding planes, dimensional space',
        tech: 'two-point perspective, two vanishing points, converging lines, corner view, angular depth, spatial realism',
        negative: 'flat, frontal, one-point, no depth, compressed'
      },
      '三点透视': {
        core: 'three-point perspective, dramatic vertical convergence',
        detail: 'three vanishing points, dramatic vertical convergence, extreme angles, looking up or down, towering perspective, dynamic depth, exaggerated scale, architectural drama',
        tech: 'three-point perspective, three vanishing points, vertical convergence, extreme angle, dramatic depth, towering scale',
        negative: 'flat, frontal, one-point, two-point, level, compressed'
      },
      '多点透视': {
        core: 'multi-point perspective, complex spatial convergence',
        detail: 'multiple vanishing points, complex spatial depth, dynamic composition, varied convergence, rich spatial realism, intricate perspective, multi-directional depth, complex space',
        tech: 'multi-point perspective, multiple vanishing points, complex convergence, varied depth, spatial realism, dynamic composition',
        negative: 'flat, simple, one-point, frontal, compressed'
      },
      '散点透视': {
        core: 'scattered perspective, multiple focal viewpoints',
        detail: 'multiple scattered viewpoints, no single vanishing point, traditional scroll perspective, varied focal points, narrative composition, panoramic depth, multiple perspectives, layered space',
        tech: 'scattered perspective, multiple viewpoints, no single vanishing point, varied focal points, narrative depth, layered space',
        negative: 'single point, linear, strict perspective, flat, rigid'
      },
      '平行透视': {
        core: 'parallel perspective, isometric-like depth',
        detail: 'parallel lines without convergence, isometric depth, technical clarity, measured space, architectural precision, flat depth, orthographic feel, clean perspective',
        tech: 'parallel perspective, no convergence, isometric depth, technical clarity, orthographic feel, measured space',
        negative: 'converging, dramatic depth, one-point, dynamic, distorted'
      },
      '等距视角': {
        core: 'isometric view, axonometric composition',
        detail: 'isometric projection, equal angles, technical clarity, measured depth, 30-degree angles, architectural diagram, clean geometry, dimensional schematic, game-like view',
        tech: 'isometric projection, 30-degree angles, axonometric view, measured depth, clean geometry, technical clarity',
        negative: 'perspective, converging, realistic, dynamic, distorted'
      },
      '俯冲视角': {
        core: 'diving angle composition, steep downward camera',
        detail: 'steep downward camera angle, diving perspective, dramatic overview, dynamic descent, aerial feel, plunging view, steep top-down, cinematic dive, sweeping descent',
        tech: 'steep downward angle, diving camera, aerial perspective, dramatic overview, dynamic descent, cinematic framing',
        negative: 'eye-level, low angle, level, flat, looking up'
      },
      '仰冲视角': {
        core: 'soaring angle composition, steep upward camera',
        detail: 'steep upward camera angle, soaring perspective, dramatic ascent, towering view, skyward sweep, dynamic rise, cinematic climb, monumental scale, uplifting view',
        tech: 'steep upward angle, soaring camera, dramatic ascent, skyward sweep, towering view, cinematic climb',
        negative: 'eye-level, top-down, level, flat, looking down'
      },
      '旋转构图': {
        core: 'rotational composition, circular dynamic movement',
        detail: 'rotational movement around subject, circular flow, dynamic energy, spiral motion, orbiting view, centrifugal force, rotating perspective, circular dynamics',
        tech: 'rotational framing, circular movement, orbiting view, spiral motion, dynamic rotation, circular dynamics',
        negative: 'static, linear, flat, straight, stationary'
      },
      '推进镜头': {
        core: 'dolly-in composition, camera moving toward subject',
        detail: 'camera pushes toward subject, increasing focus, growing intimacy, escalating tension, approaching perspective, dynamic zoom-in feel, intensifying detail, forward motion',
        tech: 'dolly-in, camera push-in, forward motion, increasing focus, escalating tension, approaching perspective',
        negative: 'static, pull-back, stationary, distant, fixed'
      },
      '拉远镜头': {
        core: 'dolly-out composition, camera moving away from subject',
        detail: 'camera pulls away from subject, revealing context, expanding scope, diminishing subject, establishing scale, receding perspective, widening view, contextual reveal',
        tech: 'dolly-out, camera pull-back, receding motion, expanding scope, revealing context, widening view',
        negative: 'static, push-in, stationary, close, fixed'
      },
      '跟拍构图': {
        core: 'tracking shot composition, camera following subject',
        detail: 'camera follows moving subject, dynamic motion, continuous perspective, action tracking, parallel movement, subject in motion, kinetic framing, smooth follow',
        tech: 'tracking shot, follow camera, parallel movement, continuous perspective, action tracking, dynamic framing',
        negative: 'static, stationary, fixed, distant, detached'
      },
      '摇镜构图': {
        core: 'pan composition, horizontal camera sweep',
        detail: 'horizontal camera sweep, panoramic reveal, scanning perspective, wide horizontal motion, landscape sweep, directional pan, expansive reveal, horizontal movement',
        tech: 'panning camera, horizontal sweep, panoramic reveal, scanning motion, directional movement, wide framing',
        negative: 'static, vertical, tilt, stationary, fixed'
      },
      '升降镜头': {
        core: 'crane shot composition, vertical camera movement',
        detail: 'vertical camera movement, crane or boom shot, rising or descending perspective, dramatic vertical motion, elevated reveal, dynamic height change, sweeping ascent or descent',
        tech: 'crane shot, vertical camera movement, boom shot, elevated perspective, dramatic height change, sweeping motion',
        negative: 'static, horizontal, stationary, fixed, level'
      },
      '平移镜头': {
        core: 'lateral tracking composition, sideways camera movement',
        detail: 'camera moves sideways, lateral tracking, parallel motion, side sweep, horizontal displacement, moving perspective, dynamic lateral movement, side tracking',
        tech: 'lateral tracking, sideways camera movement, parallel motion, side sweep, moving perspective, horizontal displacement',
        negative: 'static, vertical, stationary, fixed, pan'
      },
      '变焦构图': {
        core: 'zoom composition, focal length change',
        detail: 'changing focal length, zoom effect, dynamic focal shift, magnifying or shrinking subject, perspective compression change, zoom-in detail, zoom-out context, focal dynamics',
        tech: 'zoom lens, focal length change, zoom effect, focal shift, dynamic magnification, perspective change',
        negative: 'fixed focal, static, prime lens, stationary, constant'
      },
      '对焦构图': {
        core: 'focus composition, sharp focal emphasis',
        detail: 'sharp focus on subject, selective focus, clear focal point, crisp detail, focus emphasis, subject clarity, sharp rendering, focal precision',
        tech: 'sharp focus, selective focus, focal point, crisp detail, subject clarity, focus precision',
        negative: 'blurred, out of focus, soft, defocused, hazy'
      },
      '虚焦构图': {
        core: 'defocused composition, soft out-of-focus rendering',
        detail: 'intentional soft focus, dreamy blur, out-of-focus subject, ethereal rendering, soft edges, bokeh effect, romantic haze, abstract blur, defocused mood',
        tech: 'soft focus, defocused rendering, bokeh, dreamy blur, out-of-focus subject, ethereal haze',
        negative: 'sharp, crisp, focused, clear, detailed'
      },
      '重影构图': {
        core: 'ghosting composition, double exposure effect',
        detail: 'overlapping ghost images, translucent double exposure, layered transparency, ethereal overlap, motion ghosting, dreamlike layering, spectral double, soft overlay',
        tech: 'double exposure, ghosting effect, translucent overlay, layered transparency, motion ghosting, ethereal blend',
        negative: 'single exposure, sharp, clean, isolated, solid'
      },
      '多重曝光': {
        core: 'multiple exposure composition, layered images',
        detail: 'multiple overlapping exposures, layered imagery, composite transparency, surreal blending, stacked images, creative overlay, multiple subjects, dreamlike composite',
        tech: 'multiple exposure, layered images, composite transparency, overlapping frames, surreal blend, creative overlay',
        negative: 'single exposure, clean, isolated, sharp, simple'
      },
      '长时间曝光': {
        core: 'long exposure composition, time-lapse light trails',
        detail: 'long exposure, light trails, smooth water, motion blur, time compression, silky effect, star trails, flowing movement, extended shutter, ethereal motion',
        tech: 'long exposure, extended shutter, light trails, motion blur, smooth water, star trails, time compression',
        negative: 'fast shutter, frozen motion, sharp, crisp, static'
      },
      '慢门构图': {
        core: 'slow shutter composition, blurred motion effect',
        detail: 'slow shutter speed, motion blur, flowing movement, soft trails, dreamy motion, silky effect, blurred action, time flow, gentle movement',
        tech: 'slow shutter, motion blur, flowing movement, soft trails, silky effect, blurred action',
        negative: 'fast shutter, frozen, sharp, crisp, static'
      },
      '高速摄影': {
        core: 'high speed photography, frozen instant capture',
        detail: 'high shutter speed, frozen motion, crisp action, split-second capture, sharp detail, motion stopped, water splash freeze, dynamic frozen moment, precise instant',
        tech: 'high shutter speed, frozen motion, crisp action, split-second capture, motion stopped, sharp detail',
        negative: 'slow shutter, motion blur, soft, flowing, blurred'
      },
      '连拍构图': {
        core: 'burst sequence composition, rapid multiple frames',
        detail: 'rapid burst of frames, sequential action, motion sequence, multiple moments, time series, action progression, rapid capture, dynamic sequence',
        tech: 'burst mode, rapid frames, sequential capture, motion sequence, action progression, time series',
        negative: 'single frame, static, isolated, one moment, fixed'
      },
      '抓拍构图': {
        core: 'candid shot composition, spontaneous moment capture',
        detail: 'spontaneous candid moment, natural unposed action, authentic emotion, documentary feel, fleeting moment, unposed subject, real-life capture, natural movement',
        tech: 'candid capture, spontaneous moment, unposed subject, natural action, documentary feel, authentic emotion',
        negative: 'posed, staged, formal, arranged, artificial'
      },
      '摆拍构图': {
        core: 'posed composition, deliberately arranged subject',
        detail: 'deliberate posing, arranged subject, controlled composition, formal staging, intentional placement, directed subject, studio arrangement, planned framing',
        tech: 'posed subject, deliberate arrangement, controlled composition, formal staging, intentional placement, directed framing',
        negative: 'candid, spontaneous, unposed, natural, accidental'
      },
      '街拍构图': {
        core: 'street photography composition, urban candid framing',
        detail: 'urban street scenes, candid city life, documentary street view, everyday moments, architectural context, street energy, human activity, urban narrative',
        tech: 'street photography, urban framing, candid city scenes, documentary view, street energy, architectural context',
        negative: 'studio, posed, staged, indoor, artificial'
      },
      '纪实构图': {
        core: 'documentary composition, real-life observational framing',
        detail: 'observational documentary style, real-life scenes, authentic context, journalistic framing, unscripted moments, social context, truthful capture, natural environment',
        tech: 'documentary style, observational framing, real-life scenes, authentic context, journalistic approach, truthful capture',
        negative: 'staged, posed, artificial, studio, fictional'
      },
      '新闻摄影': {
        core: 'photojournalism composition, news event framing',
        detail: 'news event capture, journalistic framing, breaking moment, factual context, dramatic event, reportage style, press photography, current event, impactful moment',
        tech: 'photojournalism, news framing, reportage style, event capture, factual context, press photography, impactful moment',
        negative: 'staged, posed, artistic, studio, fictional'
      },
      '风光构图': {
        core: 'landscape composition, natural scenery framing',
        detail: 'natural scenery, expansive landscape, horizon placement, foreground interest, natural depth, scenic vista, environmental beauty, majestic nature, layered terrain',
        tech: 'landscape framing, horizon placement, foreground interest, natural depth, scenic vista, wide view',
        negative: 'portrait, close-up, indoor, urban, macro'
      },
      '人像构图': {
        core: 'portrait composition, human subject framing',
        detail: 'human subject focus, portrait framing, facial expression, personal presence, character emphasis, intimate connection, subject personality, human emotion',
        tech: 'portrait framing, subject focus, facial expression, personal presence, character emphasis, intimate framing',
        negative: 'landscape, object, distant, impersonal, macro'
      },
      '静物构图': {
        core: 'still life composition, arranged objects framing',
        detail: 'arranged objects, still life arrangement, object grouping, controlled lighting, tabletop scene, artistic arrangement, object composition, deliberate placement',
        tech: 'still life framing, arranged objects, object grouping, controlled lighting, tabletop scene, deliberate placement',
        negative: 'moving subject, action, dynamic, live, spontaneous'
      },
      '建筑构图': {
        core: 'architectural composition, structural framing',
        detail: 'architectural subject, structural lines, geometric forms, building perspective, urban structure, design detail, monumental scale, architectural geometry, clean lines',
        tech: 'architectural framing, structural lines, geometric forms, building perspective, urban structure, monumental scale',
        negative: 'natural, organic, landscape, portrait, macro'
      },
      '舞台构图': {
        core: 'stage composition, theatrical framing',
        detail: 'stage performance framing, theatrical scene, dramatic staging, spotlight focus, stage setting, performance moment, theatrical depth, dramatic presentation',
        tech: 'stage framing, theatrical scene, dramatic staging, spotlight focus, stage setting, performance presentation',
        negative: 'natural, candid, documentary, casual, street'
      },
      '夜景构图': {
        core: 'night scene composition, low light framing',
        detail: 'night scene, low light, city lights, artificial illumination, dark atmosphere, luminous accents, night sky, bokeh lights, dramatic darkness, urban glow',
        tech: 'night framing, low light, city lights, artificial illumination, dark atmosphere, luminous accents, bokeh',
        negative: 'daylight, bright, overexposed, flat light, high key'
      },
      '逆光剪影': {
        core: 'backlit silhouette composition, subject against light',
        detail: 'subject against strong backlight, silhouette effect, dramatic rim light, dark outline, glowing background, high contrast, shape emphasis, atmospheric glow, backlit drama',
        tech: 'backlighting, silhouette, rim light, glowing background, high contrast, dramatic outline, atmospheric glow',
        negative: 'frontal light, flat lighting, detailed subject, low contrast, washed out'
      },
      '负空间构图': {
        core: 'negative space composition, empty area emphasis',
        detail: 'large empty areas, minimal subject, breathing room, contemplative mood, empty background, subject isolation, visual calm, emptiness emphasis, minimalist balance',
        tech: 'negative space, empty areas, minimal subject, breathing room, contemplative mood, subject isolation',
        negative: 'cluttered, busy, filled, dense, crowded, maximalist'
      },
      'C形构图': {
        core: 'C-shape composition, open curved framing',
        detail: 'C-shaped curve framing subject, open circular flow, curved containment, partial enclosure, graceful arc, directional curve, open framing, curved flow',
        tech: 'C-curve framing, open arc, curved containment, partial enclosure, graceful curve, directional flow',
        negative: 'straight, closed, full circle, rigid, angular'
      },
      '中心对称': { core: 'central symmetry, perfect mirror balance around center', detail: 'perfect mirror symmetry around central axis, balanced halves, formal elegance, harmonious equilibrium, precise alignment, ceremonial framing, architectural precision, centered balance', tech: 'central axis symmetry, mirror framing, balanced halves, formal precision, centered alignment, symmetrical layout', negative: 'asymmetric, off-center, dynamic, tilted, unbalanced' },
      '重复节奏': { core: 'repetitive rhythm, patterned visual beat composition', detail: 'repeated elements creating visual rhythm, patterned beat, rhythmic sequence, uniform repetition, visual cadence, structured pattern, rhythmic flow, repeated forms, pattern emphasis', tech: 'repetition of elements, rhythmic sequence, patterned beat, uniform repetition, visual cadence, structured pattern', negative: 'single subject, isolated, random, chaotic, unique' },
      '螺旋构图': { core: 'spiral composition, inward swirling visual flow', detail: 'inward swirling spiral, eye drawn to center, dynamic vortex, spiral flow, converging curves, hypnotic movement, central focus, swirling rhythm, spiral depth, inward pull', tech: 'spiral arrangement, inward swirl, converging curves, central focus, vortex flow, hypnotic rendering', negative: 'linear, static, scattered, straight, chaotic' },
      '垂直构图': { core: 'vertical composition, strong upright line emphasis', detail: 'strong vertical lines, upright emphasis, tall framing, vertical rhythm, upward flow, columnar structure, towering balance, vertical hierarchy, clean verticals, standing structure', tech: 'vertical lines, upright framing, tall composition, vertical rhythm, columnar structure, upward flow', negative: 'horizontal, flat, wide, landscape, diagonal' },
      '水平构图': { core: 'horizontal composition, calm wide line emphasis', detail: 'calm horizontal lines, wide framing, stable balance, serene flow, horizon emphasis, lateral rhythm, expansive calm, horizontal stability, restful balance, wide structure', tech: 'horizontal lines, wide framing, stable balance, horizon emphasis, lateral rhythm, restful composition', negative: 'vertical, tall, diagonal, dynamic, tilted' },
      '斜线构图': { core: 'diagonal line composition, dynamic slanted flow', detail: 'dynamic slanted lines, diagonal flow, energetic sweep, directional movement, visual tension, slanted balance, kinetic energy, diagonal rhythm, angular flow, dynamic slant', tech: 'diagonal lines, slanted flow, dynamic sweep, directional movement, visual tension, kinetic rendering', negative: 'horizontal, vertical, static, level, calm' },
      '折线构图': { core: 'zigzag composition, angular broken line flow', detail: 'angular broken line flow, zigzag movement, sharp turns, dynamic rhythm, angular path, energetic zigzag, broken line rhythm, sharp angles, dynamic direction, angular flow', tech: 'zigzag lines, angular turns, broken line flow, sharp angles, dynamic rhythm, energetic path', negative: 'smooth, curved, straight, calm, continuous' },
      '波浪构图': { core: 'wave composition, flowing undulating line rhythm', detail: 'flowing undulating lines, wave rhythm, gentle curves, serpentine flow, rhythmic undulation, soft movement, wave pattern, flowing rhythm, gentle swell, undulating flow', tech: 'undulating lines, wave rhythm, flowing curves, serpentine flow, rhythmic movement, gentle swell', negative: 'straight, angular, rigid, jagged, static' },
      '环形构图': { core: 'ring composition, circular enclosing structure', detail: 'circular enclosing structure, ring arrangement, surrounding focus, enclosed circle, orbital framing, centered subject, circular containment, ring rhythm, enclosing flow, circular focus', tech: 'ring arrangement, circular enclosure, surrounding focus, orbital framing, centered subject, circular containment', negative: 'linear, scattered, open, rectangular, angular' },
      '心形构图': { core: 'heart composition, romantic curved focal arrangement', detail: 'romantic curved arrangement, heart-shaped flow, twin curves meeting, warm focal point, symmetrical curves, affectionate framing, soft convergence, romantic balance, heart silhouette, gentle curves', tech: 'heart-shaped arrangement, twin curves, symmetrical flow, romantic focal point, soft convergence, affectionate framing', negative: 'angular, harsh, cold, scattered, geometric' },
      '十字构图': { core: 'cross composition, intersecting vertical and horizontal', detail: 'intersecting vertical and horizontal lines, cross structure, central intersection, balanced quadrants, formal symmetry, directional crossing, cross focal point, stable intersection, clear structure', tech: 'cross lines, central intersection, balanced quadrants, formal symmetry, directional crossing, stable structure', negative: 'diagonal, scattered, curved, dynamic, tilted' },
      'X形构图': { core: 'X composition, crossing diagonal lines', detail: 'crossing diagonal lines, X structure, central crossing point, dynamic convergence, balanced diagonals, intersecting flow, dramatic crossing, focal center, diagonal balance, crossing energy', tech: 'X-shaped lines, crossing diagonals, central convergence, balanced intersection, dynamic flow, focal center', negative: 'parallel, straight, horizontal, static, calm' },
      'L形构图': { core: 'L composition, right-angle corner framing', detail: 'right-angle corner framing, L-shaped structure, corner balance, vertical and horizontal meeting, open corner, directional corner, stable angle, corner emphasis, L-shaped flow, structural corner', tech: 'L-shaped lines, right-angle corner, corner framing, vertical-horizontal meeting, stable angle, directional structure', negative: 'closed, centered, scattered, diagonal, curved' },
      'T形构图': { core: 'T composition, horizontal bar with vertical stem', detail: 'horizontal bar with vertical stem, T-shaped structure, stable top, vertical support, balanced form, structural symmetry, clear hierarchy, T-shaped flow, stable frame, directional structure', tech: 'T-shaped lines, horizontal bar, vertical stem, stable structure, balanced form, clear hierarchy', negative: 'scattered, diagonal, curved, dynamic, tilted' },
      'Z形构图': { core: 'Z composition, zigzag horizontal flow', detail: 'zigzag horizontal flow, Z-shaped path, dynamic horizontal movement, angular rhythm, directional flow, sweeping zigzag, energetic path, horizontal energy, angular movement, Z-shaped structure', tech: 'Z-shaped lines, zigzag flow, horizontal movement, angular rhythm, directional path, energetic structure', negative: 'vertical, static, calm, straight, smooth' },
      'V形构图': { core: 'V composition, downward converging lines', detail: 'downward converging lines, V-shaped structure, converging flow, open top, focal convergence, directional pull, dramatic convergence, angular balance, V-shaped flow, converging energy', tech: 'V-shaped lines, downward convergence, open top, focal point, directional pull, angular structure', negative: 'parallel, scattered, curved, static, calm' },
      'Y形构图': { core: 'Y composition, branching converging structure', detail: 'branching converging structure, Y-shaped flow, three-way split, central convergence, directional branches, balanced split, structural branching, converging focus, Y-shaped rhythm, directional flow', tech: 'Y-shaped lines, branching convergence, three-way split, central focus, directional branches, balanced structure', negative: 'parallel, scattered, straight, static, calm' },
      '之字形构图': { core: 'zigzag composition, sharp alternating directional flow', detail: 'sharp alternating directional flow, zigzag path, back-and-forth movement, angular rhythm, dynamic alternation, energetic turns, directional changes, angular path, zigzag energy, rhythmic turns', tech: 'zigzag path, alternating direction, sharp turns, angular rhythm, dynamic movement, energetic rendering', negative: 'smooth, straight, calm, continuous, curved' },
      '网格构图': { core: 'grid composition, structured intersecting lines', detail: 'structured intersecting lines, grid pattern, orderly arrangement, uniform cells, systematic layout, clean structure, balanced cells, regular rhythm, organized pattern, grid structure', tech: 'grid lines, intersecting structure, uniform cells, orderly arrangement, systematic layout, clean rhythm', negative: 'chaotic, organic, scattered, random, freeform' },
      '棋盘构图': { core: 'checkerboard composition, alternating square pattern', detail: 'alternating square pattern, checkerboard structure, contrasting cells, rhythmic alternation, balanced contrast, uniform squares, pattern rhythm, alternating flow, structured contrast, checkerboard rhythm', tech: 'checkerboard pattern, alternating squares, contrasting cells, rhythmic arrangement, uniform structure, balanced contrast', negative: 'chaotic, organic, scattered, random, freeform' },
      '蜂巢构图': { core: 'honeycomb composition, hexagonal repeating pattern', detail: 'hexagonal repeating pattern, honeycomb structure, tessellated cells, organic geometry, repeating hexagons, natural pattern, rhythmic tessellation, structured repetition, honeycomb rhythm, geometric pattern', tech: 'hexagonal pattern, honeycomb structure, tessellated cells, repeating geometry, rhythmic arrangement, natural tessellation', negative: 'chaotic, scattered, random, irregular, freeform' },
      '拼贴构图': { core: 'collage composition, layered mixed arrangement', detail: 'layered mixed arrangement, collage structure, overlapping elements, mixed fragments, assembled composition, eclectic layering, varied pieces, creative assembly, layered collage, mixed arrangement', tech: 'collage layering, overlapping elements, mixed fragments, assembled structure, eclectic arrangement, creative rendering', negative: 'uniform, single, clean, minimal, ordered' },
      '分层构图': { core: 'layered composition, stacked depth planes', detail: 'stacked depth planes, layered structure, foreground midground background, depth layering, overlapping planes, spatial layers, stacked depth, layered perspective, depth structure, plane separation', tech: 'layered planes, depth stacking, foreground-midground-background, overlapping layers, spatial depth, plane separation', negative: 'flat, single plane, shallow, compressed, uniform' },
      '堆叠构图': { core: 'stacked composition, vertical accumulation of elements', detail: 'vertical accumulation of elements, stacked structure, layered stacking, ascending rhythm, piled arrangement, vertical build, stacked forms, accumulation flow, tiered structure, stacked rhythm', tech: 'stacked elements, vertical accumulation, layered arrangement, ascending rhythm, tiered structure, piled forms', negative: 'flat, scattered, single, horizontal, sparse' },
      '交错构图': { core: 'interleaved composition, alternating overlapping arrangement', detail: 'alternating overlapping arrangement, interleaved structure, woven pattern, crossing elements, alternating rhythm, layered interweave, overlapping alternation, woven flow, interleaved rhythm, crossing structure', tech: 'interleaved elements, alternating overlap, woven pattern, crossing arrangement, rhythmic interweave, layered structure', negative: 'uniform, parallel, simple, ordered, flat' },
      '穿插构图': { core: 'interspersed composition, elements woven through frame', detail: 'elements woven through frame, interspersed structure, threading arrangement, interwoven flow, scattered yet connected, woven through, integrated elements, threading rhythm, interspersed balance, woven structure', tech: 'interspersed elements, threading arrangement, woven flow, integrated structure, interwoven rhythm, connected scattering', negative: 'isolated, separated, uniform, parallel, simple' },
      '并列构图': { core: 'juxtaposed composition, side-by-side comparison', detail: 'side-by-side comparison, juxtaposed arrangement, parallel placement, contrasting pair, equal emphasis, adjacent elements, comparative structure, parallel flow, juxtaposition balance, side-by-side rhythm', tech: 'juxtaposed elements, side-by-side placement, parallel arrangement, comparative structure, equal emphasis, adjacent framing', negative: 'single, layered, scattered, overlapping, merged' },
      '对比构图': { core: 'contrast composition, opposing element emphasis', detail: 'opposing element emphasis, contrast structure, visual opposition, contrasting pair, dramatic difference, opposing balance, contrast rhythm, opposing elements, strong contrast, comparative tension', tech: 'contrasting elements, opposing arrangement, visual opposition, dramatic difference, contrast balance, comparative structure', negative: 'uniform, harmonious, similar, flat, consistent' },
      '大小对比': { core: 'size contrast, dramatic scale difference emphasis', detail: 'dramatic scale difference, size contrast, large versus small, scale emphasis, comparative size, dramatic proportion, scale tension, size difference, proportional contrast, scale comparison', tech: 'size contrast, scale difference, large-small opposition, dramatic proportion, comparative framing, scale emphasis', negative: 'uniform, equal, consistent, similar, flat' },
      '明暗对比': { core: 'light-dark contrast, dramatic tonal opposition', detail: 'dramatic tonal opposition, light-dark contrast, chiaroscuro, strong value difference, bright versus dark, tonal tension, dramatic shadows, luminous highlights, value contrast, tonal drama', tech: 'light-dark contrast, tonal opposition, chiaroscuro, strong value difference, dramatic shadows, luminous highlights', negative: 'even, flat, uniform, soft, consistent' },
      '色彩对比': { core: 'color contrast, complementary color opposition', detail: 'complementary color opposition, color contrast, opposing hues, vibrant color difference, complementary pairing, color tension, saturated opposition, contrasting colors, color drama, hue contrast', tech: 'color contrast, complementary hues, opposing colors, saturated opposition, color tension, vibrant pairing', negative: 'monochrome, muted, harmonious, similar, flat' },
      '疏密对比': { core: 'density contrast, sparse versus dense arrangement', detail: 'sparse versus dense arrangement, density contrast, crowded versus empty, rhythm variation, visual breathing, dense cluster against space, contrast of density, sparse-dense rhythm, arrangement tension, density difference', tech: 'density contrast, sparse-dense arrangement, rhythm variation, crowded-empty opposition, visual breathing, contrast structure', negative: 'uniform, even, consistent, balanced, flat' },
      '动静对比': { core: 'motion contrast, static versus moving elements', detail: 'static versus moving elements, motion contrast, frozen against blurred, dynamic opposition, stillness and motion, movement tension, contrast of motion, static-dynamic pairing, action contrast, motion difference', tech: 'motion contrast, static-moving opposition, frozen-blurred pairing, dynamic tension, movement difference, contrast structure', negative: 'uniform, consistent, all static, all moving, flat' },
      '虚实对比': { core: 'virtual-real contrast, sharp versus soft focus', detail: 'sharp versus soft focus, virtual-real contrast, focused against blurred, depth opposition, crisp and soft, focus contrast, sharp-soft pairing, selective focus, focus tension, contrast of clarity', tech: 'virtual-real contrast, sharp-soft focus, selective focus, depth opposition, crisp-blurred pairing, focus tension', negative: 'uniform, all sharp, all soft, consistent, flat' },
      '主次分明': { core: 'hierarchy composition, clear dominant and subordinate', detail: 'clear dominant and subordinate, hierarchy structure, primary emphasis, secondary support, visual order, focal hierarchy, dominant subject, subordinate elements, clear priority, structured emphasis', tech: 'hierarchy arrangement, dominant-subordinate structure, primary emphasis, visual order, focal priority, structured balance', negative: 'equal, uniform, chaotic, scattered, flat' },
      '前景构图': { core: 'foreground composition, emphasized front elements', detail: 'emphasized front elements, foreground structure, front framing, near subject, foreground emphasis, front depth, leading foreground, front focus, near-field structure, foreground rhythm', tech: 'foreground emphasis, front framing, near subject, front depth, leading foreground, near-field structure', negative: 'background, distant, midground, flat, shallow' },
      '背景构图': { core: 'background composition, emphasized rear environment', detail: 'emphasized rear environment, background structure, rear context, distant setting, background emphasis, rear depth, environmental backdrop, background context, rear framing, distant structure', tech: 'background emphasis, rear context, distant setting, environmental backdrop, rear depth, background framing', negative: 'foreground, close, front, shallow, flat' },
      '中景构图': { core: 'midground composition, emphasized middle plane', detail: 'emphasized middle plane, midground structure, central depth, middle framing, balanced middle, mid-depth focus, central plane, middle emphasis, midground context, balanced depth', tech: 'midground emphasis, central plane, middle framing, balanced depth, mid-depth focus, central structure', negative: 'foreground, background, extreme, shallow, flat' },
      '远景构图': { core: 'distant vista composition, emphasized far scene', detail: 'emphasized far scene, distant vista, far background, expansive distance, distant context, far framing, deep distance, distant structure, far-reaching view, remote scene', tech: 'distant vista, far background, expansive distance, far framing, deep distance, remote structure', negative: 'close, foreground, near, shallow, tight' },
      '近景构图': { core: 'near view composition, emphasized close scene', detail: 'emphasized close scene, near view, close framing, intimate distance, near structure, close context, foreground proximity, near-field view, close emphasis, intimate framing', tech: 'near view, close framing, intimate distance, near structure, close emphasis, foreground proximity', negative: 'far, distant, background, wide, remote' },
      '特写构图': { core: 'close-up composition, tight intimate framing', detail: 'tight intimate framing, close-up structure, near detail, intimate proximity, tight focus, close emphasis, detail framing, near perspective, intimate close, tight structure', tech: 'close-up framing, tight structure, near detail, intimate proximity, tight focus, close emphasis', negative: 'wide, distant, full, environmental, far' },
      '大特写': { core: 'extreme close-up composition, intense detail framing', detail: 'intense detail framing, extreme close-up, magnified detail, extreme proximity, tightest framing, detail emphasis, macro-like close, intense focus, extreme near, detail structure', tech: 'extreme close-up, magnified detail, extreme proximity, tightest framing, detail emphasis, intense focus', negative: 'wide, distant, full, environmental, far' },
      '极远景': { core: 'extreme long shot, vast distant establishing view', detail: 'vast distant establishing view, extreme long shot, tiny subject, immense environment, far establishing, distant scale, vast context, extreme distance, remote view, expansive establishing', tech: 'extreme long shot, vast distance, tiny subject, immense environment, far establishing, expansive scale', negative: 'close, near, tight, intimate, detailed' },
      '大全景': { core: 'extreme wide shot, sweeping expansive full view', detail: 'sweeping expansive full view, extreme wide shot, vast panorama, full environment, expansive scene, wide establishing, immense view, sweeping scale, panoramic context, vast framing', tech: 'extreme wide shot, vast panorama, full environment, expansive scene, sweeping scale, panoramic framing', negative: 'close, tight, intimate, narrow, detailed' },
      '中近景': { core: 'medium close shot, balanced near framing', detail: 'balanced near framing, medium close shot, waist-to-chest view, intimate yet contextual, moderate close, near balance, comfortable proximity, medium-near framing, balanced close, contextual intimacy', tech: 'medium close shot, balanced near framing, moderate close, comfortable proximity, near balance, contextual framing', negative: 'wide, extreme close, distant, full, far' },
      '中远景': { core: 'medium long shot, balanced distance framing', detail: 'balanced distance framing, medium long shot, full figure with context, moderate distance, balanced scale, environmental balance, medium-far framing, contextual distance, balanced view, moderate framing', tech: 'medium long shot, balanced distance, full figure context, moderate framing, environmental balance, contextual scale', negative: 'close, tight, extreme wide, intimate, near' },
      '满框构图': { core: 'full frame composition, edge-to-edge subject fill', detail: 'edge-to-edge subject fill, full frame structure, no margins, immersive presence, complete coverage, bold scale, dominant fill, edge-to-edge framing, full bleed, immersive subject', tech: 'full frame, edge-to-edge fill, no margins, immersive presence, bold scale, dominant coverage', negative: 'negative space, minimal, small subject, margins, empty' },
      '留边构图': { core: 'margined composition, framed with border space', detail: 'framed with border space, margined structure, edge margin, bordered framing, surrounding space, margin emphasis, framed border, edge breathing room, bordered composition, margin structure', tech: 'margined framing, border space, edge margin, surrounding space, bordered structure, breathing room', negative: 'full bleed, edge-to-edge, crowded, filled, tight' },
      '破格构图': { core: 'breaking frame composition, subject breaking boundaries', detail: 'subject breaking boundaries, breaking frame, element extending past edge, dynamic break, boundary crossing, edge-breaking subject, bold extension, frame breaking, dynamic overflow, boundary break', tech: 'breaking frame, boundary crossing, edge-breaking subject, dynamic overflow, bold extension, frame break', negative: 'contained, within frame, centered, static, bounded' },
      '出框构图': { core: 'out of frame composition, subject extending beyond view', detail: 'subject extending beyond view, out of frame, cropped extension, implied continuation, partial subject, edge cropping, dynamic crop, extending beyond, cropped flow, boundary extension', tech: 'out of frame, cropped extension, partial subject, edge cropping, implied continuation, dynamic crop', negative: 'full subject, contained, complete, centered, static' },
      '悬浮构图': { core: 'floating composition, levitating subject arrangement', detail: 'levitating subject arrangement, floating structure, suspended subject, weightless balance, hovering elements, airy placement, floating rhythm, suspended flow, weightless composition, hovering balance', tech: 'floating arrangement, levitating subject, suspended structure, weightless balance, hovering elements, airy framing', negative: 'grounded, heavy, static, fixed, solid' },
      '漂浮构图': { core: 'drifting composition, gently floating elements', detail: 'gently floating elements, drifting structure, soft suspension, airy flow, weightless drift, floating rhythm, gentle suspension, drifting balance, airy placement, floating flow', tech: 'drifting arrangement, floating elements, soft suspension, airy flow, weightless drift, gentle framing', negative: 'grounded, heavy, static, fixed, solid' },
      '倾斜构图': { core: 'tilted composition, angled camera perspective', detail: 'angled camera perspective, tilted structure, slanted horizon, dynamic unease, diagonal energy, dramatic tension, skewed balance, tilted framing, angular perspective, dynamic tilt', tech: 'tilted camera, angled perspective, slanted horizon, dynamic tension, skewed balance, diagonal energy', negative: 'level, stable, calm, balanced, horizontal' },
      '倒置构图': { core: 'inverted composition, upside-down subject arrangement', detail: 'upside-down subject arrangement, inverted structure, flipped perspective, reversed orientation, surreal balance, inverted framing, upside-down flow, reversed view, inverted rhythm, surreal arrangement', tech: 'inverted arrangement, upside-down framing, flipped perspective, reversed orientation, surreal balance, inverted structure', negative: 'upright, normal, level, standard, conventional' },
      '旋转视角': { core: 'rotated perspective, spinning dynamic viewpoint', detail: 'spinning dynamic viewpoint, rotated perspective, circular motion, rotating view, dynamic spin, orbital perspective, rotating flow, spinning viewpoint, dynamic rotation, circular viewpoint', tech: 'rotated perspective, spinning viewpoint, circular motion, orbital view, dynamic rotation, rotating flow', negative: 'static, level, fixed, straight, stable' },
      '翻转构图': { core: 'flipped composition, mirrored reversed arrangement', detail: 'mirrored reversed arrangement, flipped structure, reversed symmetry, mirrored inversion, flipped balance, reversed flow, mirrored arrangement, flipped perspective, inverted symmetry, reversed framing', tech: 'flipped arrangement, mirrored inversion, reversed symmetry, flipped perspective, mirrored structure, reversed flow', negative: 'normal, upright, standard, conventional, level' },
      '镜像倒影': { core: 'mirror reflection, symmetrical mirrored image', detail: 'symmetrical mirrored image, mirror reflection, perfect mirror symmetry, reflected twin, mirrored balance, reflection symmetry, mirrored duplicate, symmetrical reflection, mirror axis, reflected framing', tech: 'mirror reflection, symmetrical mirroring, reflected twin, mirror axis, symmetrical balance, mirrored framing', negative: 'asymmetric, no reflection, flat, matte, unbalanced' },
      '水中倒影': { core: 'water reflection, mirrored image on water surface', detail: 'mirrored image on water surface, water reflection, calm water mirror, reflected scene, shimmering reflection, water mirror, reflected twin, gentle ripple reflection, mirrored water, reflective surface', tech: 'water reflection, calm mirror, reflected scene, shimmering surface, water mirror, gentle ripple', negative: 'no reflection, choppy, matte, asymmetric, flat' },
      '玻璃倒影': { core: 'glass reflection, mirrored image on glass', detail: 'mirrored image on glass, glass reflection, window mirror, reflected scene on glass, glass mirroring, reflective window, mirrored glass, reflected twin, glass reflection symmetry, mirrored surface', tech: 'glass reflection, window mirror, reflected scene, reflective surface, mirrored glass, glass symmetry', negative: 'no reflection, matte, asymmetric, flat, opaque' },
      '影子构图': { core: 'shadow composition, dramatic silhouette shadow emphasis', detail: 'dramatic silhouette shadow emphasis, shadow structure, elongated shadows, shadow play, dark form, shadow framing, silhouette shadow, dramatic shadow, shadow rhythm, shadow emphasis', tech: 'shadow emphasis, elongated shadows, silhouette shadow, dramatic shadow, shadow play, shadow framing', negative: 'shadowless, flat, bright, even, no contrast' },
      '轮廓构图': { core: 'outline composition, emphasized contour lines', detail: 'emphasized contour lines, outline structure, edge emphasis, silhouette outline, contour framing, line edges, outlined subject, contour emphasis, edge definition, outline rhythm', tech: 'outline emphasis, contour lines, edge framing, silhouette outline, line edges, contour structure', negative: 'flat, soft, filled, no edges, muted' },
      '线条构图': { core: 'line composition, dominant linear structure', detail: 'dominant linear structure, line emphasis, linear flow, line rhythm, directional lines, structural lines, line framing, linear balance, line movement, line structure', tech: 'line emphasis, linear structure, directional lines, line rhythm, structural framing, linear balance', negative: 'scattered, formless, chaotic, soft, organic' },
      '曲线引导': { core: 'curved guidance, flowing curves leading the eye', detail: 'flowing curves leading the eye, curved guidance, gentle directional curves, graceful flow, curved leading lines, soft movement, elegant curves, directional sweep, curved path, flowing guidance', tech: 'curved leading lines, gentle directional curves, graceful flow, soft movement, elegant sweep, curved path', negative: 'straight, angular, rigid, jagged, static' },
      '直线构图': { core: 'straight line composition, clean linear emphasis', detail: 'clean linear emphasis, straight line structure, crisp lines, linear clarity, straight flow, clean directional lines, linear precision, straight structure, crisp linear rhythm, clean lines', tech: 'straight lines, linear precision, crisp structure, clean flow, directional lines, straight framing', negative: 'curved, organic, chaotic, jagged, soft' },
      '点状构图': { core: 'dot composition, scattered point emphasis', detail: 'scattered point emphasis, dot structure, point rhythm, scattered points, focal dots, point pattern, distributed points, point balance, scattered focus, dot rhythm', tech: 'dot emphasis, scattered points, point rhythm, focal dots, distributed structure, point pattern', negative: 'linear, continuous, solid, uniform, flat' },
      '面状构图': { core: 'plane composition, flat surface emphasis', detail: 'flat surface emphasis, plane structure, broad surfaces, flat areas, plane balance, surface framing, flat regions, plane rhythm, surface emphasis, flat structure', tech: 'plane emphasis, flat surfaces, broad areas, surface framing, plane balance, flat structure', negative: 'linear, dotted, textured, fragmented, chaotic' },
      '体块构图': { core: 'volume composition, three-dimensional mass emphasis', detail: 'three-dimensional mass emphasis, volume structure, solid blocks, dimensional mass, block arrangement, volumetric forms, solid structure, mass balance, block rhythm, dimensional emphasis', tech: 'volume emphasis, solid blocks, dimensional mass, block arrangement, volumetric forms, mass structure', negative: 'flat, linear, two-dimensional, surface, thin' },
      '几何构图': { core: 'geometric composition, clean mathematical forms', detail: 'clean mathematical forms, geometric structure, precise shapes, mathematical balance, clean geometry, geometric rhythm, structured shapes, precise forms, geometric framing, mathematical structure', tech: 'geometric forms, precise shapes, mathematical balance, clean structure, geometric rhythm, precise framing', negative: 'organic, chaotic, freeform, irregular, natural' },
      '圆形环绕': { core: 'circular surround, elements encircling center', detail: 'elements encircling center, circular surround, surrounding ring, encircling arrangement, orbital surround, centered focus, ring enclosure, surrounding flow, circular containment, encircling rhythm', tech: 'circular surround, encircling arrangement, ring enclosure, centered focus, orbital structure, surrounding flow', negative: 'linear, scattered, open, rectangular, angular' },
      '方形构图': { core: 'square composition, equal-sided framing', detail: 'equal-sided framing, square structure, balanced sides, square format, equal proportions, square balance, uniform framing, square rhythm, equal-sided structure, square emphasis', tech: 'square framing, equal sides, balanced format, square structure, equal proportions, uniform framing', negative: 'rectangular, wide, tall, panoramic, elongated' },
      '矩形构图': { core: 'rectangle composition, elongated balanced framing', detail: 'elongated balanced framing, rectangle structure, longer sides, rectangular format, balanced proportion, rectangular framing, elongated balance, rectangle rhythm, structured proportion, rectangular emphasis', tech: 'rectangle framing, elongated sides, balanced proportion, rectangular format, structured balance, elongated structure', negative: 'square, circular, irregular, organic, freeform' },
      '菱形构图': { core: 'diamond composition, angular rotated square', detail: 'angular rotated square, diamond structure, rotated square, pointed balance, diamond rhythm, angular symmetry, rotated geometry, diamond framing, pointed structure, angular balance', tech: 'diamond framing, rotated square, angular symmetry, pointed balance, diamond structure, rotated geometry', negative: 'square, circle, organic, irregular, soft' },
      '多边形构图': { core: 'polygon composition, multi-sided angular structure', detail: 'multi-sided angular structure, polygon composition, many-sided shape, angular geometry, polygon rhythm, multi-angle balance, polygon framing, angular structure, many-sided balance, geometric polygon', tech: 'polygon framing, multi-sided shape, angular geometry, many-sided balance, polygon structure, geometric rhythm', negative: 'circle, organic, irregular, smooth, freeform' },
      '星形构图': { core: 'star composition, radiating pointed arrangement', detail: 'radiating pointed arrangement, star structure, pointed rays, radiating points, star rhythm, angular rays, pointed balance, star framing, radiating structure, pointed rhythm', tech: 'star framing, radiating points, pointed rays, angular structure, star rhythm, radiating balance', negative: 'circle, smooth, organic, irregular, soft' },
      '月牙构图': { core: 'crescent composition, curved open arc framing', detail: 'curved open arc framing, crescent structure, open curve, moon shape, curved arc, crescent rhythm, open arc balance, crescent framing, curved open structure, arc rhythm', tech: 'crescent framing, open arc, curved structure, moon shape, arc balance, curved open rhythm', negative: 'full circle, closed, straight, angular, rigid' },
      '弧形构图': { core: 'arc composition, sweeping curved band', detail: 'sweeping curved band, arc structure, gentle curve, curved sweep, arc rhythm, sweeping curve, curved band, arc balance, gentle arc, curved sweep structure', tech: 'arc framing, sweeping curve, curved band, gentle arc, arc rhythm, curved sweep balance', negative: 'straight, angular, rigid, jagged, closed' },
      '椭圆构图': { core: 'ellipse composition, oval balanced framing', detail: 'oval balanced framing, ellipse structure, oval shape, elongated circle, ellipse rhythm, oval balance, curved oval, ellipse framing, oval structure, balanced oval', tech: 'ellipse framing, oval shape, elongated circle, oval balance, ellipse structure, curved rhythm', negative: 'circle, square, rectangle, angular, irregular' },
      '同心圆构图': { core: 'concentric composition, nested circles around center', detail: 'nested circles around center, concentric structure, layered circles, expanding rings, central focus, nested rhythm, concentric rings, expanding circles, layered focus, ring structure', tech: 'concentric circles, nested rings, expanding structure, central focus, layered rhythm, ring framing', negative: 'linear, scattered, angular, open, irregular' },
      '放射状构图': { core: 'radial composition, rays spreading from center', detail: 'rays spreading from center, radial structure, outward rays, central origin, radiating flow, sunburst rays, radial rhythm, spreading structure, outward flow, radial emphasis', tech: 'radial rays, central origin, outward spreading, sunburst structure, radiating flow, radial rhythm', negative: 'parallel, linear, scattered, static, no center' },
      '汇聚构图': { core: 'converging composition, lines meeting at point', detail: 'lines meeting at point, converging structure, focal convergence, inward flow, converging lines, central meeting, focal point, converging rhythm, inward pull, convergence structure', tech: 'converging lines, focal convergence, central meeting, inward flow, convergence structure, focal point', negative: 'parallel, diverging, scattered, static, flat' },
      '发散构图': { core: 'diverging composition, lines spreading outward', detail: 'lines spreading outward, diverging structure, outward flow, spreading rays, diverging lines, expanding flow, outward spread, diverging rhythm, expanding structure, outward movement', tech: 'diverging lines, outward spread, expanding flow, spreading rays, diverging structure, outward rhythm', negative: 'converging, parallel, inward, static, flat' },
      '平行构图': { core: 'parallel composition, evenly spaced lines', detail: 'evenly spaced lines, parallel structure, uniform spacing, parallel rhythm, even flow, parallel lines, consistent spacing, parallel balance, uniform structure, even rhythm', tech: 'parallel lines, uniform spacing, even flow, parallel structure, consistent rhythm, balanced framing', negative: 'converging, crossing, scattered, dynamic, tilted' },
      '交叉构图': { core: 'crossing composition, intersecting line structure', detail: 'intersecting line structure, crossing composition, line intersection, crossing flow, intersection points, crossing rhythm, intersecting lines, crossing balance, intersection structure, crossing emphasis', tech: 'crossing lines, intersection points, crossing structure, intersecting flow, crossing rhythm, intersection balance', negative: 'parallel, straight, uniform, static, calm' },
      '重叠构图': { core: 'overlapping composition, layered covering elements', detail: 'layered covering elements, overlapping structure, stacked overlap, covering layers, overlapping forms, layered cover, overlap rhythm, stacked covering, overlapping depth, layered structure', tech: 'overlapping elements, stacked layers, covering structure, overlap rhythm, layered depth, stacked framing', negative: 'separated, flat, isolated, uniform, parallel' },
      '透叠构图': { core: 'transparent overlap, see-through layered elements', detail: 'see-through layered elements, transparent overlap, translucent layers, visible through, layered transparency, overlapping translucency, see-through structure, transparent layering, translucent overlap, layered visibility', tech: 'transparent overlap, translucent layers, see-through structure, layered transparency, overlapping translucency, visible depth', negative: 'opaque, solid, flat, separated, uniform' },
      '渐变构图': { core: 'gradient composition, gradual progressive change', detail: 'gradual progressive change, gradient structure, smooth transition, progressive flow, gradual shift, gradient rhythm, smooth progression, transitional balance, gradual change, gradient flow', tech: 'gradient transition, progressive change, smooth shift, gradual flow, gradient structure, transitional rhythm', negative: 'abrupt, sudden, uniform, flat, constant' },
      '节奏构图': { core: 'rhythm composition, patterned visual beat', detail: 'patterned visual beat, rhythm structure, repeated beat, rhythmic flow, visual cadence, patterned rhythm, beat emphasis, rhythmic pattern, cadence structure, rhythm flow', tech: 'rhythm structure, repeated beat, patterned flow, visual cadence, rhythmic emphasis, cadence framing', negative: 'static, flat, uniform, chaotic, random' },
      '韵律构图': { core: 'cadence composition, graceful rhythmic flow', detail: 'graceful rhythmic flow, cadence structure, elegant rhythm, flowing cadence, graceful beat, rhythmic elegance, cadence flow, graceful rhythm, flowing structure, elegant cadence', tech: 'cadence structure, graceful rhythm, flowing cadence, elegant flow, rhythmic balance, graceful framing', negative: 'static, flat, abrupt, chaotic, random' },
      '均衡构图': { core: 'balanced composition, harmonious visual weight', detail: 'harmonious visual weight, balanced structure, even distribution, visual equilibrium, harmonious balance, balanced rhythm, even weight, equilibrium structure, harmonious framing, balanced flow', tech: 'balanced structure, even distribution, visual equilibrium, harmonious weight, balanced rhythm, equilibrium framing', negative: 'unbalanced, lopsided, chaotic, heavy, uneven' },
      '对称平衡': { core: 'symmetrical balance, mirrored visual equilibrium', detail: 'mirrored visual equilibrium, symmetrical balance, mirror symmetry, balanced halves, formal equilibrium, symmetrical structure, mirrored balance, equal sides, symmetry rhythm, balanced mirror', tech: 'symmetrical balance, mirror symmetry, balanced halves, formal equilibrium, mirrored structure, equal sides', negative: 'asymmetric, unbalanced, off-center, dynamic, lopsided' },
      '不对称平衡': { core: 'asymmetrical balance, dynamic uneven equilibrium', detail: 'dynamic uneven equilibrium, asymmetrical balance, off-center harmony, visual weight balance, dynamic equilibrium, uneven yet balanced, asymmetric structure, off-center balance, dynamic harmony, weighted equilibrium', tech: 'asymmetrical balance, off-center harmony, visual weight, dynamic equilibrium, uneven structure, weighted framing', negative: 'symmetrical, centered, static, formal, even' },
      '中心平衡': { core: 'central balance, balanced focus around center', detail: 'balanced focus around center, central balance, centered equilibrium, central focus, balanced center, centered structure, central harmony, balanced middle, center emphasis, centered equilibrium', tech: 'central balance, centered focus, central equilibrium, balanced middle, centered structure, central harmony', negative: 'off-center, asymmetric, dynamic, edge, unbalanced' },
      '视觉重心': { core: 'visual weight, emphasized focal mass', detail: 'emphasized focal mass, visual weight, dominant focus, weighted emphasis, focal mass, visual anchor, weighted focus, dominant mass, focal weight, emphasis structure', tech: 'visual weight, focal mass, dominant focus, weighted emphasis, visual anchor, focal structure', negative: 'even, uniform, scattered, weak, flat' },
      '焦点构图': { core: 'focal composition, emphasized central point of interest', detail: 'emphasized central point of interest, focal composition, clear focal point, focused emphasis, central interest, focal structure, point of focus, emphasized center, focal clarity, focused balance', tech: 'focal point, central interest, focused emphasis, focal structure, point of focus, clear center', negative: 'scattered, unfocused, even, flat, chaotic' },
      '强调构图': { core: 'emphasis composition, highlighted dominant element', detail: 'highlighted dominant element, emphasis structure, strong focal emphasis, highlighted subject, dominant accent, emphasis framing, highlighted focus, strong accent, dominant emphasis, accent structure', tech: 'emphasis structure, highlighted subject, dominant accent, strong focal, emphasis framing, accent balance', negative: 'even, uniform, subtle, flat, weak' },
      '简化构图': { core: 'simplified composition, reduced minimal structure', detail: 'reduced minimal structure, simplified composition, minimal elements, reduced clutter, clean simplicity, simplified framing, minimal structure, reduced balance, clean minimal, simple emphasis', tech: 'simplified structure, minimal elements, reduced clutter, clean framing, minimal balance, simple emphasis', negative: 'cluttered, busy, complex, detailed, crowded' },
      '极简构图': { core: 'minimalist composition, extreme simplicity', detail: 'extreme simplicity, minimalist structure, bare minimum, essential elements, stark simplicity, minimal framing, pure simplicity, essential structure, stark minimal, bare composition', tech: 'minimalist structure, bare minimum, essential elements, stark simplicity, minimal framing, pure balance', negative: 'cluttered, busy, complex, detailed, ornate' },
      '极简留白': { core: 'minimal negative space, generous empty framing', detail: 'generous empty framing, minimal negative space, vast emptiness, sparse subject, contemplative calm, empty balance, minimal emptiness, breathing space, serene void, empty emphasis', tech: 'negative space, vast emptiness, sparse subject, contemplative calm, empty balance, minimal framing', negative: 'cluttered, busy, filled, dense, crowded' },
      '疏朗构图': { core: 'sparse composition, airy open arrangement', detail: 'airy open arrangement, sparse composition, open spacing, airy balance, scattered yet open, sparse rhythm, open structure, airy framing, sparse balance, open spacing', tech: 'sparse arrangement, open spacing, airy balance, open structure, sparse rhythm, airy framing', negative: 'dense, crowded, cluttered, packed, full' },
      '密集构图': { core: 'dense composition, tightly packed arrangement', detail: 'tightly packed arrangement, dense composition, crowded structure, packed elements, dense rhythm, tight packing, crowded balance, dense framing, packed structure, dense emphasis', tech: 'dense arrangement, tightly packed, crowded structure, packed rhythm, dense framing, tight balance', negative: 'sparse, open, airy, empty, minimal' },
      '拥挤构图': { core: 'crowded composition, overflowing packed elements', detail: 'overflowing packed elements, crowded composition, packed scene, overflowing structure, dense crowd, packed framing, overflowing rhythm, crowded balance, packed emphasis, dense overflow', tech: 'crowded arrangement, packed scene, overflowing structure, dense framing, packed rhythm, crowded balance', negative: 'sparse, open, empty, minimal, airy' },
      '空旷构图': { core: 'empty composition, vast open void framing', detail: 'vast open void framing, empty composition, open emptiness, vast space, empty balance, open void, spacious framing, empty emphasis, vast openness, void structure', tech: 'empty framing, vast open space, open void, spacious balance, empty emphasis, vast structure', negative: 'crowded, filled, dense, packed, cluttered' },
      '辽阔构图': { core: 'vast composition, expansive boundless framing', detail: 'expansive boundless framing, vast composition, boundless space, expansive view, vast horizon, boundless balance, expansive framing, vast openness, boundless structure, expansive emphasis', tech: 'vast framing, expansive view, boundless space, vast horizon, expansive structure, boundless balance', negative: 'narrow, confined, tight, close, limited' },
      '宏大构图': { core: 'grand composition, monumental majestic framing', detail: 'monumental majestic framing, grand composition, epic scale, monumental presence, majestic framing, grand structure, epic balance, monumental emphasis, grand scale, majestic structure', tech: 'grand framing, monumental scale, epic structure, majestic presence, grand balance, monumental emphasis', negative: 'intimate, small, modest, humble, tiny' },
      '微小构图': { core: 'tiny composition, miniature intimate framing', detail: 'miniature intimate framing, tiny composition, small scale, intimate miniature, delicate framing, tiny structure, miniature balance, small emphasis, delicate scale, tiny framing', tech: 'tiny framing, miniature scale, small structure, delicate balance, intimate framing, miniature emphasis', negative: 'grand, vast, monumental, huge, epic' },
      '俯冲构图': { core: 'diving composition, steep downward camera', detail: 'steep downward camera, diving composition, dramatic overview, dynamic descent, aerial feel, plunging view, steep top-down, cinematic dive, sweeping descent, diving perspective', tech: 'steep downward angle, diving camera, aerial perspective, dramatic overview, dynamic descent, cinematic framing', negative: 'eye-level, low angle, level, flat, looking up' },
      '仰冲构图': { core: 'soaring composition, steep upward camera', detail: 'steep upward camera, soaring composition, dramatic ascent, towering view, skyward sweep, dynamic rise, cinematic climb, monumental scale, uplifting view, soaring perspective', tech: 'steep upward angle, soaring camera, dramatic ascent, skyward sweep, towering view, cinematic climb', negative: 'eye-level, top-down, level, flat, looking down' },
      '环绕视角': { core: 'orbiting perspective, circular surrounding viewpoint', detail: 'circular surrounding viewpoint, orbiting perspective, encircling view, surrounding angle, orbital viewpoint, circular surround, encircling perspective, orbiting angle, surrounding view, circular viewpoint', tech: 'orbiting perspective, encircling view, surrounding angle, circular viewpoint, orbital framing, surrounding structure', negative: 'static, frontal, level, fixed, straight' },
      '追踪构图': { core: 'tracking composition, following moving subject', detail: 'following moving subject, tracking composition, continuous follow, moving perspective, action tracking, parallel movement, subject in motion, kinetic framing, smooth follow, tracking flow', tech: 'tracking shot, follow camera, parallel movement, continuous perspective, action tracking, dynamic framing', negative: 'static, stationary, fixed, distant, detached' },
      '摇摄构图': { core: 'panning composition, horizontal camera sweep', detail: 'horizontal camera sweep, panning composition, panoramic reveal, scanning perspective, wide horizontal motion, landscape sweep, directional pan, expansive reveal, horizontal movement, panning flow', tech: 'panning camera, horizontal sweep, panoramic reveal, scanning motion, directional movement, wide framing', negative: 'static, vertical, tilt, stationary, fixed' },
      '升降构图': { core: 'crane composition, vertical camera movement', detail: 'vertical camera movement, crane composition, rising or descending perspective, dramatic vertical motion, elevated reveal, dynamic height change, sweeping ascent or descent, crane flow, vertical movement', tech: 'crane shot, vertical camera movement, boom shot, elevated perspective, dramatic height change, sweeping motion', negative: 'static, horizontal, stationary, fixed, level' },
      '推移构图': { core: 'dolly composition, forward or backward camera move', detail: 'forward or backward camera move, dolly composition, push-in or pull-out, approaching or receding, dynamic move, moving perspective, dolly flow, forward-backward movement, cinematic move, tracking depth', tech: 'dolly shot, push-in or pull-out, forward-backward move, moving perspective, dynamic depth, cinematic framing', negative: 'static, fixed, stationary, lateral, level' },
      '旋转镜头': { core: 'rotating shot, spinning camera movement', detail: 'spinning camera movement, rotating shot, circular rotation, spinning view, dynamic rotation, rotating perspective, orbital spin, rotating flow, spinning framing, circular movement', tech: 'rotating camera, spinning movement, circular rotation, dynamic spin, rotating perspective, orbital framing', negative: 'static, fixed, level, straight, stable' },
      '环绕镜头': { core: 'orbiting shot, camera circling subject', detail: 'camera circling subject, orbiting shot, circular movement, surrounding rotation, orbital motion, circling view, dynamic surround, orbiting flow, circular framing, surrounding movement', tech: 'orbiting camera, circular movement, surrounding rotation, orbital motion, circling view, dynamic framing', negative: 'static, frontal, fixed, level, straight' },
      '航拍构图': { core: 'aerial composition, bird eye drone framing', detail: 'bird eye drone framing, aerial composition, top-down view, drone perspective, aerial overview, high altitude view, aerial framing, drone shot, elevated aerial, bird eye structure', tech: 'aerial framing, drone perspective, top-down view, high altitude, aerial overview, bird eye structure', negative: 'ground level, eye-level, low angle, close, interior' },
      '对称倒影': { core: 'symmetrical reflection, mirrored balanced image', detail: 'mirrored balanced image, symmetrical reflection, perfect mirror symmetry, reflected balance, mirrored twin, reflection symmetry, symmetrical mirroring, balanced reflection, mirrored equilibrium, reflection balance', tech: 'symmetrical reflection, mirror symmetry, reflected balance, mirrored twin, reflection framing, balanced mirroring', negative: 'asymmetric, no reflection, flat, matte, unbalanced' }
    },
    keywords: ['构图', '角度', '视角', '镜头', '景别', '取景', '广角', '特写', '近景', '中景', '远景', '俯拍', '仰拍', '鸟瞰', '正面', '侧面']
  },

  quality: {
    name: '画质',
    categories: {
      '8K超高清': { core: '8K resolution, ultra high definition, extreme detail, sharp focus, every texture visible', tech: '7680x4320, uncompressed, maximum detail, 300dpi equivalent' },
      '4K高清': { core: '4K resolution, high definition, crisp detail, clean render, professional quality', tech: '3840x2160, high bitrate, sharp details, 150dpi equivalent' },
      '电影级': { core: 'cinematic quality, anamorphic lens, film grain, IMAX standard, 24fps film look, motion blur', tech: 'anamorphic 2.39:1, 35mm film stock, Kodak Portra 400, Arri Alexa, filmic color science' },
      'HDR': { core: 'HDR, high dynamic range, rich shadow detail, bright highlight retention, 10-bit color depth', tech: 'HDR10, 1000nit peak, Rec.2020 color space, 10-bit, tone mapping' },
      '超写实': { core: 'hyper-realistic, photorealistic, lifelike texture, uncanny realism, every pore visible', tech: 'subsurface scattering, micro-detail displacement, PBR materials, physically accurate', negative: 'stylized, cartoon, painting, low-poly, abstract' },
      '极致细节': {
        core: 'hyper-detailed ultra-high resolution rendering',
        tech: '8K+ resolution, micro-contrast enhancement, texture sharpening, high megapixel count, diffraction-limited optics, focus stacking, gigapixel panorama, AI upscaling, clarity boost, texture preservation, sub-pixel detail'
      },
      '锐利': {
        core: 'crisp edge definition with high acutance',
        tech: 'high MTF lens performance, optimal aperture f/5.6-f/8, low ISO noise floor, image stabilization, fast shutter speed, sharpening algorithm, lens calibration, anti-aliasing filter reduction, edge contrast, acutance measurement'
      },
      '柔焦': {
        core: 'dreamy soft glow with reduced contrast',
        tech: 'soft focus filter, spherical aberration, diffusion lens, haze filter, pro-mist filter strength, glow highlight halation, lowered micro-contrast, vintage lens character, blooming highlights, soft edge transition, ethereal blur'
      },
      '颗粒感': {
        core: 'organic film grain texture aesthetic',
        tech: 'ISO grain simulation, film stock emulation, luminance noise pattern, analog texture overlay, grain size and intensity, high ISO pushed film, silver halide crystal simulation, monochromatic noise, Tri-X grain, gritty texture, organic noise field'
      },
      '复古滤镜': {
        core: 'nostalgic retro color grading aesthetic',
        tech: 'color grading LUT, faded black levels, warm color shift, split toning, chromatic aberration simulation, light leak overlay, vignette, cross-processing emulation, film border, dust scratch overlay, analog warmth'
      },
      '体积光': {
        core: 'visible light beams through atmospheric particles',
        tech: 'god rays, volumetric scattering, atmospheric haze, crepuscular rays, particle medium rendering, light shaft, fog density, subsurface scattering, ray marching, smoke medium, dust particle illumination'
      },
      '光线追踪': {
        core: 'physically accurate light path simulation',
        tech: 'real-time ray tracing, global illumination, path tracing, denoising algorithm, RT cores, BVH acceleration, specular reflection, caustics, ambient occlusion, indirect lighting bounce, ray-traced shadows, light transport'
      }
    },
    keywords: ['画质', '清晰度', '分辨率', '高清', '4K', '8K', '2K', '细节', '精度', '电影级', '超清', 'HDR']
  },

  color: {
    name: '色彩',
    categories: {
      '莫兰迪色系': { core: 'muted desaturated palette, Morandi colors, soft earthy tones, sophisticated grey-cast', detail: 'dusty rose, sage green, muted ochre, powder blue, warm grey, no pure primaries', mood: 'calm, sophisticated, timeless, understated, intellectual' },
      '赛博霓虹': { core: 'neon synthwave palette, cyan and magenta dominance, electric color contrast', detail: 'neon cyan #00ffff, hot magenta #ff00ff, electric purple, acid yellow accents, deep black', mood: 'futuristic, energetic, digital, rebellious, nocturnal' },
      '暖金琥珀': { core: 'warm golden amber palette, sunset tones, honey glow, rich earth', detail: 'amber, honey gold, terracotta, burnt orange, deep brown, cream, warm sepia', mood: 'nostalgic, cozy, romantic, vintage, warm' },
      '冷蓝银灰': { core: 'cool blue silver palette, monochromatic cold tones, clinical precision', detail: 'steel blue, silver grey, ice white, navy, pale cyan, cool graphite', mood: 'futuristic, clean, serious, professional, detached' },
      '自然森系': { core: 'natural forest palette, botanical greens, earth tones, organic', detail: 'forest green, moss, bark brown, sky blue, leaf yellow, mushroom grey, wildflower accent', mood: 'peaceful, organic, grounded, fresh, alive' },
      '黑白高对比': { core: 'monochrome high contrast, black and white, dramatic tonal range', detail: 'pure white, absolute black, zone system, rich greys, silver midtones, no color', mood: 'timeless, dramatic, classic, pure, graphic' },
      '东方古韵': { core: 'traditional chinese palette, vermillion and jade, imperial elegance', detail: 'vermillion red, jade green, imperial yellow, ink black, porcelain white, gold, celadon', mood: 'elegant, classical, ceremonial, refined, cultured' },
      '粉彩梦幻': { core: 'pastel dreamy palette, soft candy colors, ethereal light', detail: 'baby pink, lavender, mint green, sky blue, butter yellow, pearl white, soft peach', mood: 'dreamy, gentle, romantic, youthful, magical' },
      '暗黑哥特': { core: 'dark gothic palette, blood and shadow, dramatic darkness', detail: 'deep burgundy, black, blood crimson, midnight purple, tarnished silver, bone, storm grey', mood: 'ominous, dramatic, intense, gothic, powerful' },
      '电影青橙': { core: 'teal and orange cinematic grade, blockbuster color contrast', detail: 'teal shadows, orange highlights, warm skin tones, cool environment, complementary contrast', mood: 'cinematic, epic, dramatic, polished, Hollywood' },
      '日系清新': { core: 'japanese fresh palette, airy and bright, slight overexposure', detail: 'pale blue sky, cherry blossom pink, soft green, cream white, warm grey, slight cyan cast', mood: 'fresh, airy, nostalgic, gentle, peaceful' },
      '赛博禅意': { core: 'cyberpunk zen fusion, neon meets minimalism, digital tranquility', detail: 'neon cyan, matte black, warm grey, single neon accent, dark void, holographic white', mood: 'meditative, futuristic, minimal, transcendent, digital zen' },
      '复古70年代': {
        core: 'warm muted earthy seventies color palette',
        detail: 'mustard yellow, burnt orange, avocado green, warm brown, harvest gold, olive tone, terracotta, sepia brown, rust, ochre',
        mood: 'nostalgic warm earthy groovy mellow'
      },
      '冰蓝极光': {
        core: 'icy blue aurora borealis color spectrum',
        detail: 'cyan blue, electric teal, ice white, deep navy, arctic blue, mint green, frost silver, violet-indigo, glacial aqua, polar night',
        mood: 'cold ethereal mystical serene otherworldly'
      },
      '沙漠暖调': {
        core: 'sun-baked desert earth warm color range',
        detail: 'sand beige, terracotta, dusty rose, warm amber, clay brown, golden hour orange, rust red, sun-bleached cream, canyon red, dune gold',
        mood: 'warm arid golden serene timeless'
      },
      '海岛清爽': {
        core: 'fresh coastal island palette, bright oceanic tones',
        detail: 'sky blue, aquamarine, turquoise sea, sand white, sea glass green, sunlit cream, driftwood tan, foam white, horizon teal, pale coral',
        mood: 'fresh, breezy, tranquil, bright, restful'
      },
      '霓虹粉紫': {
        core: 'vibrant cyberpunk neon pink purple scheme',
        detail: 'hot magenta, electric purple, neon pink, ultraviolet, fluorescent fuchsia, deep violet, cyan accent, digital lavender, plasma glow, synthwave blue',
        mood: 'energetic futuristic rebellious vibrant synthwave'
      },
      '森林深绿': {
        core: 'lush deep forest green natural palette',
        detail: 'pine green, emerald, moss green, dark olive, sage, forest canopy, fern green, shadow green-black, hunter green, leaf litter brown',
        mood: 'tranquil mysterious earthy grounded organic'
      },
      '金属质感': {
        core: 'polished metallic reflective surface tones',
        detail: 'chrome silver, titanium gray, brushed steel, gold sheen, copper bronze, platinum white, iron black, rose gold, anodized aluminum, mercury',
        mood: 'industrial sleek premium cold refined'
      },
      '炽热红': {
        core: 'vivid fiery red palette, passionate crimson tones',
        detail: 'crimson red, vermillion, scarlet, ruby red, blood red, fiery orange-red, deep red, red silk, red cloth accents',
        mood: 'passionate, intense, bold, dramatic, powerful'
      },
      '彩虹色': {
        core: 'full spectrum rainbow prismatic color array',
        detail: 'red, orange, yellow, green, blue, indigo, violet, prismatic refraction, spectrum gradient, chromatic dispersion',
        mood: 'joyful vibrant inclusive playful celebratory'
      },
      '褪色复古': {
        core: 'washed-out faded nostalgic retro vintage color',
        detail: 'faded pastel pink, washed denim blue, sun-bleached yellow, muted mint, dusty lavender, pale coral, cream white, soft gray-green, vintage cream, faded rose',
        mood: 'nostalgic soft melancholic dreamy sentimental'
      },
      '樱花粉': { core: 'cherry blossom pink palette, soft sakura tones', detail: 'sakura pink, pale rose, blush white, light coral, petal softness', mood: 'gentle, romantic, tender, springlike, delicate' },
      '薄荷绿': { core: 'fresh mint green palette, cool botanical tones', detail: 'mint green, pale teal, soft sage, ice green, cool white', mood: 'fresh, clean, refreshing, cool, invigorating' },
      '薰衣草紫': { core: 'lavender purple palette, soft floral violet', detail: 'lavender, lilac, soft violet, pale purple, dusty mauve', mood: 'calm, dreamy, soothing, elegant, serene' },
      '柠檬黄': { core: 'bright lemon yellow palette, zesty citrus tone', detail: 'lemon yellow, bright yellow, pale gold, sunshine, acid yellow', mood: 'cheerful, vibrant, energetic, sunny, playful' },
      '珊瑚橙': { core: 'coral orange palette, warm tropical tone', detail: 'coral, salmon orange, peach, warm pink-orange, sunset coral', mood: 'warm, lively, friendly, tropical, inviting' },
      '雾霾蓝': { core: 'hazy blue palette, muted atmospheric tone', detail: 'haze blue, dusty blue, grey-blue, misty slate, soft cyan-grey', mood: 'calm, melancholic, atmospheric, subdued, contemplative' },
      '奶油白': { core: 'cream white palette, soft warm neutral', detail: 'cream, ivory, warm white, butter, off-white', mood: 'soft, cozy, warm, gentle, clean' },
      '焦糖棕': { core: 'caramel brown palette, rich warm tone', detail: 'caramel, toffee, warm brown, amber brown, coffee, mocha', mood: 'warm, cozy, rich, comforting, indulgent' },
      '橄榄绿': { core: 'olive green palette, earthy military tone', detail: 'olive green, khaki, mossy green, sage, muted green', mood: 'earthy, grounded, rugged, natural, understated' },
      '酒红': { core: 'wine red palette, deep burgundy tone', detail: 'wine red, burgundy, merlot, deep red, maroon', mood: 'rich, elegant, passionate, luxurious, dramatic' },
      '藏青': { core: 'navy blue palette, deep classic tone', detail: 'navy blue, deep blue, midnight blue, indigo blue, dark blue', mood: 'serious, classic, trustworthy, calm, sophisticated' },
      '墨绿': { core: 'dark ink green palette, deep forest tone', detail: 'ink green, deep green, dark jade, pine green, black-green', mood: 'mysterious, elegant, deep, refined, somber' },
      '朱砂红': { core: 'cinnabar red palette, vivid vermillion tone', detail: 'cinnabar red, vermillion, bright red, imperial red, seal red', mood: 'bold, passionate, ceremonial, powerful, auspicious' },
      '黛蓝': { core: 'dark blue palette, deep indigo tone', detail: 'dark blue, deep azure, ink blue, midnight, navy', mood: 'deep, mysterious, calm, elegant, profound' },
      '杏色': { core: 'apricot palette, soft warm peach tone', detail: 'apricot, peach, soft orange, warm beige, pale coral', mood: 'warm, gentle, soft, sweet, cozy' },
      '藕荷': { core: 'lotus root pink palette, soft mauve tone', detail: 'lotus pink, pale mauve, soft lilac-pink, dusty rose, muted pink', mood: 'gentle, elegant, soft, feminine, serene' },
      '黛绿': { core: 'dark jade green palette, deep green tone', detail: 'dark jade, deep green, emerald shadow, ink green, forest dark', mood: 'elegant, deep, mysterious, refined, classic' },
      '月白': { core: 'moon white palette, pale luminous tone', detail: 'moon white, pale silver-white, cool ivory, frost white, pale blue-white', mood: 'ethereal, serene, pure, calm, luminous' },
      '藕粉': { core: 'lotus powder pink palette, soft pastel tone', detail: 'powder pink, soft pink, pale rose, blush, light coral', mood: 'soft, sweet, gentle, romantic, tender' },
      '青碧': { core: 'turquoise blue-green palette, vivid jade tone', detail: 'turquoise, teal, blue-green, aqua, jade cyan', mood: 'fresh, vivid, lively, clear, serene' },
      '黛紫': { core: 'dark purple palette, deep violet tone', detail: 'dark purple, deep violet, plum, aubergine, dark mauve', mood: 'mysterious, elegant, luxurious, dramatic, enigmatic' },
      '赭石': { core: 'ochre palette, warm earthy tone', detail: 'ochre, yellow-brown, sienna, clay, rust brown', mood: 'earthy, warm, rustic, grounded, ancient' },
      '靛蓝': { core: 'indigo palette, deep blue-violet tone', detail: 'indigo, deep blue, blue-violet, navy, midnight blue', mood: 'deep, mysterious, spiritual, calm, profound' },
      '藤黄': { core: 'gamboge yellow palette, warm golden tone', detail: 'gamboge, golden yellow, warm yellow, mustard, amber yellow', mood: 'warm, radiant, vibrant, traditional, luminous' },
      '石青': { core: 'azurite blue palette, vivid mineral tone', detail: 'azurite blue, mineral blue, deep cyan, stone blue, vivid blue', mood: 'vivid, traditional, clear, elegant, mineral' },
      '胭脂': { core: 'rouge red palette, vivid cosmetic tone', detail: 'rouge red, bright pink-red, rose red, crimson pink, cosmetic red', mood: 'vivid, feminine, passionate, elegant, striking' },
      '琥珀': { core: 'amber palette, warm golden tone', detail: 'amber, honey gold, golden brown, warm yellow, resin gold', mood: 'warm, nostalgic, rich, luminous, ancient' },
      '玛瑙红': { core: 'agate red palette, deep gemstone tone', detail: 'agate red, deep red, garnet, ruby, blood red', mood: 'rich, intense, dramatic, precious, passionate' },
      '翡翠绿': { core: 'jadeite green palette, vivid gemstone tone', detail: 'jadeite green, vivid green, emerald, imperial jade, bright green', mood: 'vivid, precious, elegant, fresh, auspicious' },
      '祖母绿': { core: 'emerald green palette, deep gemstone tone', detail: 'emerald green, deep green, rich green, jewel green, forest emerald', mood: 'rich, elegant, luxurious, deep, classic' },
      '孔雀蓝': { core: 'peacock blue palette, vivid iridescent tone', detail: 'peacock blue, teal blue, vivid cyan, iridescent blue, jewel blue', mood: 'vivid, exotic, elegant, striking, luxurious' },
      '玫瑰金': { core: 'rose gold palette, warm metallic tone', detail: 'rose gold, pink gold, warm metallic, blush metal, copper pink', mood: 'luxurious, elegant, romantic, premium, refined' },
      '香槟金': { core: 'champagne gold palette, soft metallic tone', detail: 'champagne gold, pale gold, soft metallic, warm shimmer, light gold', mood: 'elegant, luxurious, celebratory, refined, premium' },
      '古铜': { core: 'antique bronze palette, aged metallic tone', detail: 'antique bronze, aged copper, dark bronze, patina brown, weathered metal', mood: 'vintage, rustic, historical, sturdy, antique' },
      '青铜': { core: 'bronze palette, warm metallic tone', detail: 'bronze, copper brown, metallic brown, warm metal, brass brown', mood: 'sturdy, historical, warm, metallic, classic' },
      '银灰': { core: 'silver grey palette, cool metallic tone', detail: 'silver grey, cool grey, metallic silver, platinum grey, steel grey', mood: 'modern, sleek, cool, professional, refined' },
      '碳黑': { core: 'carbon black palette, deep matte tone', detail: 'carbon black, matte black, deep black, charcoal, jet black', mood: 'modern, sleek, dramatic, powerful, minimal' },
      '象牙白': { core: 'ivory white palette, warm neutral tone', detail: 'ivory white, warm white, cream, bone white, soft white', mood: 'elegant, classic, warm, refined, pure' },
      '珍珠白': { core: 'pearl white palette, luminous iridescent tone', detail: 'pearl white, iridescent white, luminous white, soft shimmer, opal white', mood: 'elegant, luminous, pure, refined, delicate' },
      '曜石黑': { core: 'obsidian black palette, deep glossy tone', detail: 'obsidian black, glossy black, deep black, volcanic black, jet black', mood: 'mysterious, powerful, sleek, dramatic, luxurious' },
      '奶油黄': { core: 'butter yellow palette, soft warm golden tone', detail: 'butter yellow, pale gold, soft yellow, warm cream, light honey', mood: 'cheerful, warm, gentle, cozy, sunny' },
      '抹茶绿': { core: 'matcha green palette, earthy powdered green tone', detail: 'matcha green, powder green, soft jade, pale green, creamy green', mood: 'calm, natural, soothing, refined, zen' },
      '巧克力棕': { core: 'chocolate brown palette, rich deep brown tone', detail: 'chocolate brown, cocoa, dark brown, mocha, deep umber', mood: 'rich, indulgent, warm, comforting, decadent' },
      '咖啡色': { core: 'coffee palette, warm roasted brown tone', detail: 'coffee brown, roasted brown, latte, cappuccino, warm tan', mood: 'warm, cozy, comforting, inviting, mellow' },
      '勃艮第': { core: 'burgundy palette, deep wine red tone', detail: 'burgundy, wine red, deep claret, bordeaux, dark crimson', mood: 'rich, elegant, luxurious, dramatic, sophisticated' },
      '石榴红': { core: 'pomegranate red palette, vivid fruit tone', detail: 'pomegranate red, vivid red, ruby red, bright crimson, seed red', mood: 'vivid, energetic, passionate, festive, striking' },
      '桃红': { core: 'peach blossom red palette, bright pink-red tone', detail: 'peach blossom red, bright pink, rose pink, vivid pink-red, floral red', mood: 'vivid, romantic, cheerful, youthful, lively' },
      '粉红': { core: 'pink palette, soft feminine tone', detail: 'pink, soft pink, rose pink, light pink, baby pink', mood: 'sweet, romantic, gentle, playful, tender' },
      '品红': { core: 'magenta palette, vivid purplish-red tone', detail: 'magenta, vivid pink-red, fuchsia, hot pink, purplish red', mood: 'vivid, bold, energetic, modern, striking' },
      '洋红': { core: 'carmine palette, deep vivid red tone', detail: 'carmine, deep red, crimson, cochineal red, vivid scarlet', mood: 'vivid, intense, passionate, bold, dramatic' },
      '紫红': { core: 'purple-red palette, rich magenta tone', detail: 'purple-red, plum red, magenta, wine purple, raspberry', mood: 'rich, dramatic, elegant, passionate, bold' },
      '紫罗兰': { core: 'violet palette, classic purple tone', detail: 'violet, purple, blue-violet, deep lavender, royal purple', mood: 'elegant, mystical, refined, romantic, regal' },
      '丁香紫': { core: 'lilac palette, soft pale purple tone', detail: 'lilac, pale purple, soft violet, light lavender, powder purple', mood: 'gentle, dreamy, soft, romantic, serene' },
      '葡萄紫': { core: 'grape purple palette, rich purple tone', detail: 'grape purple, deep purple, concord purple, rich violet, plum', mood: 'rich, deep, elegant, mysterious, luxurious' },
      '茄子紫': { core: 'eggplant purple palette, deep aubergine tone', detail: 'eggplant purple, aubergine, deep purple, dark violet, plum black', mood: 'deep, mysterious, elegant, dramatic, sophisticated' },
      '宝蓝': { core: 'royal blue palette, vivid saturated blue tone', detail: 'royal blue, vivid blue, sapphire blue, bright blue, electric blue', mood: 'vivid, confident, energetic, regal, striking' },
      '天蓝': { core: 'sky blue palette, bright clear blue tone', detail: 'sky blue, clear blue, light blue, azure, cerulean', mood: 'fresh, airy, calm, cheerful, open' },
      '湖蓝': { core: 'lake blue palette, clear water blue tone', detail: 'lake blue, water blue, clear blue, aqua blue, cyan blue', mood: 'fresh, clear, calm, serene, refreshing' },
      '海蓝': { core: 'sea blue palette, deep ocean blue tone', detail: 'sea blue, ocean blue, deep blue, marine blue, cobalt', mood: 'deep, calm, vast, serene, mysterious' },
      '靛青': { core: 'indigo cyan palette, deep blue-green tone', detail: 'indigo cyan, deep teal, blue-green, dark cyan, petrol blue', mood: 'deep, elegant, calm, refined, mysterious' },
      '青绿': { core: 'blue-green palette, fresh teal tone', detail: 'blue-green, teal, cyan green, aqua, sea green', mood: 'fresh, vivid, lively, clean, serene' },
      '翠绿': { core: 'vivid green palette, bright emerald tone', detail: 'vivid green, bright green, emerald green, spring green, jade green', mood: 'vivid, fresh, lively, vibrant, natural' },
      '草绿': { core: 'grass green palette, fresh natural tone', detail: 'grass green, meadow green, leaf green, fresh green, spring green', mood: 'fresh, natural, lively, cheerful, organic' },
      '军绿': { core: 'military green palette, rugged olive tone', detail: 'military green, army green, olive drab, khaki green, camouflage green', mood: 'rugged, sturdy, practical, grounded, masculine' },
      '墨黑': { core: 'ink black palette, deep black tone', detail: 'ink black, deep black, jet black, calligraphy black, soot black', mood: 'elegant, classic, mysterious, profound, refined' },
      '纯黑': { core: 'pure black palette, absolute black tone', detail: 'pure black, absolute black, true black, solid black, void black', mood: 'minimal, powerful, dramatic, sleek, timeless' },
      '玄黑': { core: 'profound black palette, deep mysterious tone', detail: 'profound black, deep black, dark void, abyss black, shadow black', mood: 'mysterious, profound, elegant, powerful, enigmatic' },
      '乌黑': { core: 'jet black palette, glossy deep tone', detail: 'jet black, glossy black, deep black, raven black, coal black', mood: 'sleek, dramatic, powerful, elegant, intense' },
      '铁灰': { core: 'iron grey palette, cool industrial tone', detail: 'iron grey, steel grey, gunmetal, cool grey, industrial grey', mood: 'industrial, sturdy, cool, modern, serious' },
      '石墨': { core: 'graphite palette, dark grey tone', detail: 'graphite, dark grey, charcoal grey, slate grey, pencil grey', mood: 'modern, sleek, minimal, sophisticated, cool' },
      '炭黑': { core: 'charcoal black palette, soft matte tone', detail: 'charcoal black, charcoal grey, soft black, matte black, smoky black', mood: 'modern, muted, sophisticated, dramatic, grounded' },
      '卡其': { core: 'khaki palette, warm neutral tone', detail: 'khaki, sand tan, warm beige, olive tan, military tan', mood: 'earthy, practical, casual, warm, rugged' },
      '驼色': { core: 'camel palette, warm tan tone', detail: 'camel, warm tan, light brown, sand brown, buff', mood: 'warm, elegant, classic, cozy, refined' },
      '米色': { core: 'beige palette, soft neutral tone', detail: 'beige, soft tan, warm grey-brown, sand, light taupe', mood: 'soft, neutral, warm, minimal, elegant' },
      '燕麦色': { core: 'oatmeal palette, warm off-white tone', detail: 'oatmeal, warm off-white, cream tan, soft beige, oat grey', mood: 'warm, cozy, natural, soft, understated' },
      '亚麻色': { core: 'linen palette, natural pale tone', detail: 'linen, natural beige, pale tan, flax, soft sand', mood: 'natural, soft, organic, calm, rustic' },
      '烟灰': { core: 'smoke grey palette, muted grey tone', detail: 'smoke grey, ash grey, muted grey, soft grey, smoky grey', mood: 'muted, calm, atmospheric, subtle, modern' },
      '雾灰': { core: 'mist grey palette, hazy grey tone', detail: 'mist grey, hazy grey, fog grey, pale grey, cloudy grey', mood: 'calm, atmospheric, soft, subdued, ethereal' },
      '浅灰': { core: 'light grey palette, pale neutral tone', detail: 'light grey, pale grey, soft grey, silver grey, pearl grey', mood: 'clean, minimal, calm, neutral, airy' },
      '深灰': { core: 'dark grey palette, deep neutral tone', detail: 'dark grey, deep grey, charcoal grey, slate grey, gunmetal grey', mood: 'serious, modern, elegant, grounded, sophisticated' },
      '中灰': { core: 'medium grey palette, balanced neutral tone', detail: 'medium grey, mid grey, neutral grey, stone grey, balanced grey', mood: 'balanced, neutral, calm, practical, understated' },
      '暖灰': { core: 'warm grey palette, cozy neutral tone', detail: 'warm grey, greige, warm neutral, taupe grey, soft brown-grey', mood: 'warm, cozy, soft, elegant, inviting' },
      '冷灰': { core: 'cool grey palette, crisp neutral tone', detail: 'cool grey, blue-grey, crisp grey, steel grey, icy grey', mood: 'cool, clean, modern, precise, professional' },
      '蓝灰': { core: 'blue grey palette, cool muted tone', detail: 'blue grey, slate blue, steel blue, grey-blue, muted blue', mood: 'calm, cool, subdued, sophisticated, serene' },
      '绿灰': { core: 'green grey palette, muted earthy tone', detail: 'green grey, sage grey, grey-green, muted green, olive grey', mood: 'calm, natural, muted, grounded, organic' },
      '紫灰': { core: 'purple grey palette, muted lavender tone', detail: 'purple grey, mauve grey, grey-lavender, muted purple, dusty violet', mood: 'soft, elegant, muted, sophisticated, dreamy' },
      '粉灰': { core: 'pink grey palette, muted rose tone', detail: 'pink grey, rose grey, dusty pink, muted rose, grey-pink', mood: 'soft, muted, elegant, gentle, understated' },
      '米灰': { core: 'beige grey palette, warm neutral tone', detail: 'beige grey, greige, warm grey, taupe, stone beige', mood: 'warm, neutral, elegant, calm, sophisticated' },
      '豆沙': { core: 'red bean paste palette, warm reddish-brown tone', detail: 'red bean paste, adzuki brown, warm reddish-brown, maroon tan, sweet brown', mood: 'warm, cozy, sweet, traditional, comforting' },
      '豆绿': { core: 'bean green palette, soft yellow-green tone', detail: 'bean green, pea green, soft yellow-green, pale green, mung green', mood: 'fresh, soft, natural, gentle, calm' },
      '藕紫': { core: 'lotus purple palette, soft muted violet tone', detail: 'lotus purple, soft violet, muted purple, pale mauve, dusty purple', mood: 'soft, elegant, gentle, serene, refined' },
      '藕青': { core: 'lotus cyan palette, soft blue-green tone', detail: 'lotus cyan, soft teal, pale blue-green, muted cyan, dusty aqua', mood: 'soft, calm, elegant, serene, refined' },
      '藕绿': { core: 'lotus green palette, soft muted green tone', detail: 'lotus green, soft green, muted sage, pale green, dusty green', mood: 'soft, natural, calm, gentle, elegant' },
      '藕黄': { core: 'lotus yellow palette, soft muted yellow tone', detail: 'lotus yellow, soft yellow, muted gold, pale ochre, dusty yellow', mood: 'soft, warm, gentle, subtle, elegant' },
      '藕红': { core: 'lotus red palette, soft muted red tone', detail: 'lotus red, soft red, muted rose, dusty red, pale crimson', mood: 'soft, warm, gentle, elegant, subdued' },
      '藕棕': { core: 'lotus brown palette, soft muted brown tone', detail: 'lotus brown, soft brown, muted tan, dusty brown, pale umber', mood: 'soft, warm, natural, gentle, understated' },
      '藕蓝': { core: 'lotus blue palette, soft muted blue tone', detail: 'lotus blue, soft blue, muted blue, dusty blue, pale azure', mood: 'soft, calm, serene, gentle, elegant' },
      '藕白': { core: 'lotus white palette, soft off-white tone', detail: 'lotus white, soft white, warm off-white, pale cream, muted white', mood: 'soft, clean, gentle, serene, elegant' },
      '藕灰': { core: 'lotus grey palette, soft muted grey tone', detail: 'lotus grey, soft grey, muted grey, pale grey, dusty grey', mood: 'soft, calm, neutral, gentle, elegant' },
      '藕金': { core: 'lotus gold palette, soft muted gold tone', detail: 'lotus gold, soft gold, muted gold, pale gold, dusty gold', mood: 'soft, warm, elegant, refined, subtle' },
      '樱桃红': { core: 'cherry red palette, vivid sweet red tone', detail: 'cherry red, bright red, vivid crimson, glossy red, sweet red', mood: 'vivid, sweet, energetic, passionate, appetizing' },
      '玫瑰红': { core: 'rose red palette, classic romantic red tone', detail: 'rose red, deep pink-red, romantic red, velvet rose, crimson pink', mood: 'romantic, passionate, classic, elegant, tender' },
      '绯红': { core: 'scarlet palette, bright vivid red tone', detail: 'scarlet, vivid red, bright crimson, flame red, brilliant red', mood: 'vivid, bold, passionate, striking, dramatic' },
      '猩红': { core: 'crimson palette, deep rich red tone', detail: 'crimson, deep red, rich red, blood red, dark scarlet', mood: 'intense, dramatic, passionate, powerful, deep' },
      '铁锈红': { core: 'rust red palette, earthy oxidized red tone', detail: 'rust red, oxidized red, burnt sienna, terracotta red, aged red', mood: 'earthy, rustic, warm, weathered, grounded' },
      '砖红': { core: 'brick red palette, warm clay red tone', detail: 'brick red, clay red, warm red-brown, terracotta, masonry red', mood: 'warm, sturdy, rustic, grounded, classic' },
      '辣椒红': { core: 'chili red palette, spicy hot red tone', detail: 'chili red, hot red, fiery red, spicy red, bright paprika', mood: 'fiery, bold, energetic, passionate, intense' },
      '番茄红': { core: 'tomato red palette, ripe juicy red tone', detail: 'tomato red, ripe red, juicy red, warm red, garden red', mood: 'fresh, vivid, appetizing, warm, lively' },
      '草莓红': { core: 'strawberry red palette, sweet berry red tone', detail: 'strawberry red, berry red, sweet red, pinkish red, fruit red', mood: 'sweet, fresh, playful, youthful, appetizing' },
      '西瓜红': { core: 'watermelon red palette, juicy pinkish red tone', detail: 'watermelon red, juicy red, pinkish red, fruit red, summer red', mood: 'fresh, juicy, playful, cheerful, summery' },
      '枣红': { core: 'jujube red palette, warm deep red tone', detail: 'jujube red, date red, warm deep red, brownish red, festive red', mood: 'warm, festive, traditional, rich, cozy' },
      '绛红': { core: 'deep crimson palette, dark rich red tone', detail: 'deep crimson, dark red, rich maroon, deep scarlet, wine dark', mood: 'deep, dramatic, rich, elegant, intense' },
      '殷红': { core: 'dark red palette, deep blood red tone', detail: 'dark red, deep red, blood red, oxblood, dark crimson', mood: 'deep, intense, dramatic, powerful, somber' },
      '赤红': { core: 'vermillion red palette, bright cinnabar tone', detail: 'vermillion, bright red, cinnabar red, vivid red, flame red', mood: 'vivid, bold, auspicious, powerful, striking' },
      '珊瑚红': { core: 'coral red palette, warm tropical red tone', detail: 'coral red, warm red, salmon red, tropical red, reef red', mood: 'warm, lively, friendly, tropical, inviting' },
      '玫粉': { core: 'rose pink palette, soft romantic pink tone', detail: 'rose pink, soft pink, romantic pink, blush pink, petal pink', mood: 'romantic, soft, gentle, tender, feminine' },
      '蜜桃橙': { core: 'peach orange palette, soft juicy orange tone', detail: 'peach orange, soft orange, juicy peach, warm apricot, fruity orange', mood: 'soft, warm, sweet, cheerful, inviting' },
      '南瓜橙': { core: 'pumpkin orange palette, rich autumn orange tone', detail: 'pumpkin orange, deep orange, autumn orange, harvest orange, warm orange', mood: 'warm, cozy, festive, autumnal, rich' },
      '柿子橙': { core: 'persimmon orange palette, vivid fruit orange tone', detail: 'persimmon orange, vivid orange, fruit orange, warm orange, ripe orange', mood: 'vivid, warm, lively, appetizing, cheerful' },
      '橘红': { core: 'tangerine red palette, bright citrus red tone', detail: 'tangerine red, bright orange-red, citrus red, mandarin red, vivid red-orange', mood: 'bright, energetic, cheerful, vivid, lively' },
      '蜜橙': { core: 'honey orange palette, sweet golden orange tone', detail: 'honey orange, golden orange, sweet orange, amber orange, warm orange', mood: 'sweet, warm, golden, inviting, cozy' },
      '焦橙': { core: 'burnt orange palette, deep toasted orange tone', detail: 'burnt orange, deep orange, toasted orange, amber orange, autumn orange', mood: 'warm, earthy, autumnal, rich, grounded' },
      '金橙': { core: 'golden orange palette, radiant warm orange tone', detail: 'golden orange, radiant orange, warm orange, sun orange, bright orange', mood: 'radiant, warm, energetic, cheerful, golden' },
      '落日橙': { core: 'sunset orange palette, warm dusk orange tone', detail: 'sunset orange, dusk orange, warm horizon orange, golden orange, twilight orange', mood: 'warm, nostalgic, romantic, serene, golden' },
      '姜黄': { core: 'turmeric yellow palette, warm spice yellow tone', detail: 'turmeric yellow, spice yellow, warm yellow, curry yellow, golden yellow', mood: 'warm, spicy, earthy, rich, vibrant' },
      '芥末黄': { core: 'mustard yellow palette, muted warm yellow tone', detail: 'mustard yellow, muted yellow, warm yellow, ochre yellow, spicy yellow', mood: 'warm, retro, earthy, muted, cozy' },
      '鹅黄': { core: 'gosling yellow palette, soft pale yellow tone', detail: 'gosling yellow, pale yellow, soft yellow, chick yellow, light yellow', mood: 'soft, gentle, cheerful, tender, innocent' },
      '明黄': { core: 'bright yellow palette, vivid sunny yellow tone', detail: 'bright yellow, vivid yellow, sunny yellow, vivid gold, lemon bright', mood: 'bright, cheerful, energetic, sunny, vivid' },
      '金黄': { core: 'golden yellow palette, rich metallic yellow tone', detail: 'golden yellow, rich yellow, metallic gold, sun gold, harvest gold', mood: 'rich, radiant, warm, precious, golden' },
      '麦黄': { core: 'wheat yellow palette, warm grain yellow tone', detail: 'wheat yellow, grain yellow, straw yellow, harvest yellow, pale gold', mood: 'warm, natural, rustic, cozy, earthy' },
      '稻黄': { core: 'rice yellow palette, pale warm yellow tone', detail: 'rice yellow, pale yellow, warm cream yellow, grain yellow, soft gold', mood: 'warm, soft, natural, gentle, rustic' },
      '沙黄': { core: 'sand yellow palette, warm desert yellow tone', detail: 'sand yellow, desert yellow, warm tan yellow, dune yellow, sandy gold', mood: 'warm, arid, natural, earthy, calm' },
      '杏黄': { core: 'apricot yellow palette, soft warm yellow tone', detail: 'apricot yellow, soft yellow, warm peach yellow, golden apricot, pale gold', mood: 'warm, soft, sweet, gentle, cheerful' },
      '橙黄': { core: 'orange yellow palette, bright citrus tone', detail: 'orange yellow, bright yellow-orange, citrus yellow, marigold, vivid gold', mood: 'bright, cheerful, energetic, vivid, lively' },
      '柠檬绿': { core: 'lime green palette, bright citrus green tone', detail: 'lime green, bright green, citrus green, vivid green, acid green', mood: 'fresh, vivid, energetic, zesty, lively' },
      '苹果绿': { core: 'apple green palette, fresh crisp green tone', detail: 'apple green, fresh green, crisp green, bright green, fruit green', mood: 'fresh, crisp, clean, natural, lively' },
      '嫩绿': { core: 'tender green palette, soft young green tone', detail: 'tender green, soft green, young green, sprout green, fresh green', mood: 'fresh, tender, gentle, springlike, innocent' },
      '浅绿': { core: 'light green palette, pale fresh green tone', detail: 'light green, pale green, soft green, mint light, fresh green', mood: 'fresh, light, airy, calm, clean' },
      '葱绿': { core: 'scallion green palette, fresh herb green tone', detail: 'scallion green, herb green, fresh green, spring green, vivid light green', mood: 'fresh, crisp, natural, lively, clean' },
      '竹绿': { core: 'bamboo green palette, cool natural green tone', detail: 'bamboo green, cool green, natural green, jade green, stalk green', mood: 'natural, calm, elegant, fresh, serene' },
      '松绿': { core: 'pine green palette, deep evergreen tone', detail: 'pine green, evergreen, deep green, forest green, conifer green', mood: 'deep, calm, natural, grounded, serene' },
      '杉绿': { core: 'fir green palette, cool deep green tone', detail: 'fir green, cool green, deep green, spruce green, alpine green', mood: 'cool, deep, natural, calm, grounded' },
      '苔绿': { core: 'moss green palette, soft earthy green tone', detail: 'moss green, soft green, earthy green, muted green, lichen green', mood: 'earthy, natural, soft, grounded, organic' },
      '茶绿': { core: 'tea green palette, warm muted green tone', detail: 'tea green, warm green, muted green, matcha light, soft green', mood: 'calm, natural, warm, soothing, refined' },
      '湖水绿': { core: 'lake green palette, clear water green tone', detail: 'lake green, water green, clear green, aqua green, fresh green', mood: 'fresh, clear, calm, serene, refreshing' },
      '孔雀绿': { core: 'peacock green palette, vivid iridescent green tone', detail: 'peacock green, vivid green, iridescent green, jewel green, teal green', mood: 'vivid, exotic, elegant, striking, luxurious' },
      '青瓷': { core: 'celadon palette, pale jade green tone', detail: 'celadon, pale green, jade green, porcelain green, soft grey-green', mood: 'elegant, serene, refined, classic, delicate' },
      '天青': { core: 'sky cyan palette, clear pale blue-green tone', detail: 'sky cyan, pale cyan, clear blue-green, light teal, airy cyan', mood: 'fresh, airy, clear, calm, serene' },
      '黛青': { core: 'dark cyan palette, deep blue-green tone', detail: 'dark cyan, deep teal, blue-green, petrol green, dark aqua', mood: 'deep, elegant, calm, refined, mysterious' },
      '橄榄青': { core: 'olive cyan palette, muted green-cyan tone', detail: 'olive cyan, muted teal, green-cyan, sage cyan, dusty teal', mood: 'muted, natural, calm, earthy, understated' },
      '薄荷青': { core: 'mint cyan palette, cool fresh blue-green tone', detail: 'mint cyan, cool teal, fresh blue-green, icy green, cool aqua', mood: 'fresh, cool, clean, refreshing, invigorating' },
      '翡翠青': { core: 'jadeite cyan palette, vivid jewel blue-green tone', detail: 'jadeite cyan, vivid teal, jewel cyan, emerald cyan, bright blue-green', mood: 'vivid, precious, elegant, fresh, luxurious' },
      '深蓝': { core: 'deep blue palette, rich dark blue tone', detail: 'deep blue, dark blue, rich blue, midnight blue, ocean blue', mood: 'deep, calm, serious, elegant, profound' },
      '蔚蓝': { core: 'azure blue palette, bright clear sky blue tone', detail: 'azure blue, clear blue, sky blue, bright blue, vivid blue', mood: 'fresh, clear, bright, open, serene' },
      '湛蓝': { core: 'azure palette, vivid deep sky blue tone', detail: 'azure, vivid blue, deep sky blue, cerulean, bright blue', mood: 'vivid, clear, open, fresh, serene' },
      '钴蓝': { core: 'cobalt blue palette, intense vivid blue tone', detail: 'cobalt blue, intense blue, vivid blue, deep blue, electric blue', mood: 'intense, vivid, bold, confident, striking' },
      '普鲁士蓝': { core: 'prussian blue palette, deep historical blue tone', detail: 'prussian blue, deep blue, dark blue, historical blue, ink blue', mood: 'deep, classic, serious, elegant, profound' },
      '天青蓝': { core: 'cerulean blue palette, bright sky blue tone', detail: 'cerulean, bright blue, sky blue, clear blue, vivid azure', mood: 'bright, clear, fresh, serene, open' },
      '松石蓝': { core: 'turquoise blue palette, vivid green-blue tone', detail: 'turquoise, green-blue, aqua blue, teal blue, jewel blue', mood: 'vivid, fresh, exotic, lively, serene' },
      '藏青蓝': { core: 'navy blue palette, deep classic blue tone', detail: 'navy blue, deep blue, dark blue, midnight blue, classic blue', mood: 'serious, classic, trustworthy, calm, sophisticated' },
      '宝蓝紫': { core: 'royal purple palette, vivid regal purple tone', detail: 'royal purple, vivid purple, regal purple, deep violet, majestic purple', mood: 'regal, majestic, vivid, elegant, powerful' },
      '靛蓝紫': { core: 'indigo purple palette, deep blue-violet tone', detail: 'indigo purple, deep blue-violet, dark violet, indigo, midnight purple', mood: 'deep, mysterious, spiritual, elegant, profound' },
      '湖蓝绿': { core: 'aqua palette, clear blue-green tone', detail: 'aqua, clear blue-green, water blue, cyan, sea green', mood: 'fresh, clear, calm, serene, refreshing' },
      '孔雀蓝绿': { core: 'teal palette, deep blue-green tone', detail: 'teal, deep blue-green, dark cyan, peacock teal, rich aqua', mood: 'deep, elegant, calm, refined, sophisticated' },
      '青碧蓝': { core: 'cyan palette, bright blue-green tone', detail: 'cyan, bright blue-green, vivid aqua, electric cyan, clear teal', mood: 'bright, fresh, vivid, clean, energetic' },
      '靛青蓝': { core: 'indigo cyan palette, deep blue-green tone', detail: 'indigo cyan, deep teal, blue-green, dark cyan, petrol blue', mood: 'deep, elegant, calm, refined, mysterious' },
      '墨蓝': { core: 'ink blue palette, deep dark blue tone', detail: 'ink blue, deep blue, dark blue, calligraphy blue, midnight blue', mood: 'deep, elegant, mysterious, profound, refined' },
      '银蓝': { core: 'silver blue palette, cool metallic blue tone', detail: 'silver blue, cool blue, metallic blue, steel blue, pale blue-grey', mood: 'cool, sleek, modern, professional, refined' },
      '深紫': { core: 'deep purple palette, rich dark purple tone', detail: 'deep purple, dark purple, rich violet, plum, royal purple', mood: 'deep, elegant, mysterious, luxurious, dramatic' },
      '浅紫': { core: 'light purple palette, soft pale purple tone', detail: 'light purple, pale purple, soft violet, lilac, powder purple', mood: 'soft, gentle, dreamy, calm, serene' },
      '紫藤': { core: 'wisteria palette, soft hanging flower purple tone', detail: 'wisteria, soft purple, pale violet, lavender purple, flower purple', mood: 'soft, elegant, dreamy, romantic, serene' },
      '木槿紫': { core: 'hibiscus purple palette, vivid tropical purple tone', detail: 'hibiscus purple, vivid purple, tropical purple, bright violet, flower purple', mood: 'vivid, tropical, lively, bold, exotic' },
      '兰花紫': { core: 'orchid purple palette, elegant flower purple tone', detail: 'orchid purple, elegant purple, soft violet, flower purple, refined purple', mood: 'elegant, refined, graceful, exotic, sophisticated' },
      '梅紫': { core: 'plum purple palette, deep fruit purple tone', detail: 'plum purple, deep purple, fruit purple, rich violet, dark plum', mood: 'deep, rich, elegant, mysterious, luxurious' },
      '玫瑰紫': { core: 'rose purple palette, soft romantic purple tone', detail: 'rose purple, soft purple, romantic violet, mauve purple, dusty purple', mood: 'romantic, soft, elegant, gentle, dreamy' },
      '蓝紫': { core: 'blue purple palette, cool violet tone', detail: 'blue purple, cool violet, blue-violet, indigo purple, cool purple', mood: 'cool, elegant, calm, refined, mysterious' },
      '青紫': { core: 'cyan purple palette, vivid blue-violet tone', detail: 'cyan purple, blue-violet, vivid purple, electric violet, cool purple', mood: 'vivid, cool, energetic, modern, striking' },
      '银紫': { core: 'silver purple palette, cool metallic purple tone', detail: 'silver purple, cool purple, metallic violet, steel purple, pale mauve', mood: 'cool, sleek, modern, refined, sophisticated' },
      '金紫': { core: 'gold purple palette, warm metallic purple tone', detail: 'gold purple, warm purple, metallic violet, golden violet, rich mauve', mood: 'warm, rich, luxurious, elegant, refined' },
      '铜紫': { core: 'copper purple palette, warm metallic purple tone', detail: 'copper purple, warm purple, metallic violet, bronze purple, rich mauve', mood: 'warm, rich, vintage, elegant, refined' },
      '铁紫': { core: 'iron purple palette, cool industrial purple tone', detail: 'iron purple, cool purple, industrial violet, gunmetal purple, muted mauve', mood: 'cool, industrial, sturdy, modern, serious' },
      '石紫': { core: 'stone purple palette, muted mineral purple tone', detail: 'stone purple, muted purple, mineral violet, grey-purple, dusty mauve', mood: 'muted, calm, elegant, grounded, sophisticated' },
      '岩紫': { core: 'rock purple palette, earthy mineral purple tone', detail: 'rock purple, earthy purple, mineral violet, slate purple, muted mauve', mood: 'earthy, grounded, calm, natural, muted' },
      '沙紫': { core: 'sand purple palette, warm muted purple tone', detail: 'sand purple, warm purple, muted violet, dusty mauve, sandy purple', mood: 'warm, muted, soft, calm, understated' },
      '雾紫': { core: 'mist purple palette, hazy muted purple tone', detail: 'mist purple, hazy purple, fog violet, pale mauve, dusty purple', mood: 'calm, atmospheric, soft, subdued, ethereal' },
      '烟紫': { core: 'smoke purple palette, muted smoky purple tone', detail: 'smoke purple, smoky purple, ash violet, muted mauve, grey-purple', mood: 'muted, calm, atmospheric, subtle, elegant' },
      '墨紫': { core: 'ink purple palette, deep dark purple tone', detail: 'ink purple, deep purple, dark violet, calligraphy purple, midnight purple', mood: 'deep, elegant, mysterious, profound, refined' },
      '墨红': { core: 'ink red palette, deep dark red tone', detail: 'ink red, deep red, dark red, calligraphy red, seal red', mood: 'deep, elegant, traditional, profound, refined' },
      '墨青': { core: 'ink cyan palette, deep dark blue-green tone', detail: 'ink cyan, deep teal, dark blue-green, calligraphy cyan, deep aqua', mood: 'deep, elegant, calm, refined, mysterious' },
      '墨灰': { core: 'ink grey palette, deep dark grey tone', detail: 'ink grey, deep grey, dark grey, calligraphy grey, charcoal grey', mood: 'deep, elegant, serious, refined, classic' },
      '银绿': { core: 'silver green palette, cool metallic green tone', detail: 'silver green, cool green, metallic green, steel green, pale sage', mood: 'cool, sleek, modern, professional, refined' },
      '银红': { core: 'silver red palette, cool metallic red tone', detail: 'silver red, cool red, metallic red, steel red, muted crimson', mood: 'cool, sleek, modern, refined, understated' },
      '金绿': { core: 'gold green palette, warm metallic green tone', detail: 'gold green, warm green, metallic green, golden olive, rich sage', mood: 'warm, rich, elegant, refined, luxurious' },
      '金蓝': { core: 'gold blue palette, warm metallic blue tone', detail: 'gold blue, warm blue, metallic blue, golden blue, rich azure', mood: 'warm, rich, elegant, refined, luxurious' },
      '金红': { core: 'gold red palette, warm metallic red tone', detail: 'gold red, warm red, metallic red, golden crimson, rich red', mood: 'warm, rich, elegant, refined, luxurious' },
      '铜绿': { core: 'copper green palette, warm metallic green tone', detail: 'copper green, warm green, metallic green, bronze green, patina green', mood: 'warm, vintage, rich, refined, rustic' },
      '铜蓝': { core: 'copper blue palette, warm metallic blue tone', detail: 'copper blue, warm blue, metallic blue, bronze blue, rich teal', mood: 'warm, vintage, rich, refined, rustic' },
      '铁蓝': { core: 'iron blue palette, cool industrial blue tone', detail: 'iron blue, cool blue, industrial blue, gunmetal blue, steel blue', mood: 'cool, industrial, sturdy, modern, serious' },
      '岩蓝': { core: 'rock blue palette, earthy mineral blue tone', detail: 'rock blue, earthy blue, mineral blue, slate blue, muted blue', mood: 'earthy, grounded, calm, natural, muted' },
      '石蓝': { core: 'stone blue palette, muted mineral blue tone', detail: 'stone blue, muted blue, mineral blue, grey-blue, dusty blue', mood: 'muted, calm, elegant, grounded, sophisticated' },
      '沙蓝': { core: 'sand blue palette, warm muted blue tone', detail: 'sand blue, warm blue, muted blue, dusty azure, sandy blue', mood: 'warm, muted, soft, calm, understated' },
      '雾蓝': { core: 'mist blue palette, hazy muted blue tone', detail: 'mist blue, hazy blue, fog blue, pale blue, cloudy blue', mood: 'calm, atmospheric, soft, subdued, ethereal' },
      '烟蓝': { core: 'smoke blue palette, muted smoky blue tone', detail: 'smoke blue, smoky blue, ash blue, muted blue, grey-blue', mood: 'muted, calm, atmospheric, subtle, elegant' },
      '粉蓝': { core: 'pink blue palette, soft pastel blue tone', detail: 'pink blue, soft blue, pastel blue, baby blue, powder blue', mood: 'soft, gentle, dreamy, calm, sweet' },
      '粉绿': { core: 'pink green palette, soft pastel green tone', detail: 'pink green, soft green, pastel green, pale sage, powder green', mood: 'soft, gentle, fresh, calm, sweet' },
      '奶油粉': { core: 'cream pink palette, soft warm pink tone', detail: 'cream pink, warm pink, soft pink, blush cream, pale rose', mood: 'soft, warm, gentle, romantic, cozy' },
      '奶油绿': { core: 'cream green palette, soft warm green tone', detail: 'cream green, warm green, soft green, pale sage, creamy green', mood: 'soft, warm, natural, gentle, cozy' },
      '奶油蓝': { core: 'cream blue palette, soft warm blue tone', detail: 'cream blue, warm blue, soft blue, pale blue, creamy blue', mood: 'soft, warm, calm, gentle, cozy' },
      '奶油紫': { core: 'cream purple palette, soft warm purple tone', detail: 'cream purple, warm purple, soft purple, pale mauve, creamy violet', mood: 'soft, warm, gentle, elegant, cozy' },
      '奶油橙': { core: 'cream orange palette, soft warm orange tone', detail: 'cream orange, warm orange, soft orange, pale peach, creamy orange', mood: 'soft, warm, gentle, cheerful, cozy' },
      '奶油红': { core: 'cream red palette, soft warm red tone', detail: 'cream red, warm red, soft red, pale rose, creamy red', mood: 'soft, warm, gentle, romantic, cozy' },
      '焦糖红': { core: 'caramel red palette, warm sweet red tone', detail: 'caramel red, warm red, sweet red, toffee red, rich red', mood: 'warm, sweet, rich, cozy, indulgent' },
      '焦糖橙': { core: 'caramel orange palette, warm sweet orange tone', detail: 'caramel orange, warm orange, sweet orange, toffee orange, rich orange', mood: 'warm, sweet, rich, cozy, indulgent' },
      '焦糖黄': { core: 'caramel yellow palette, warm sweet yellow tone', detail: 'caramel yellow, warm yellow, sweet yellow, toffee yellow, golden yellow', mood: 'warm, sweet, rich, cozy, indulgent' },
      '焦糖绿': { core: 'caramel green palette, warm sweet green tone', detail: 'caramel green, warm green, sweet green, toffee green, muted green', mood: 'warm, sweet, rich, cozy, natural' },
      '焦糖蓝': { core: 'caramel blue palette, warm sweet blue tone', detail: 'caramel blue, warm blue, sweet blue, toffee blue, muted blue', mood: 'warm, sweet, rich, cozy, calm' },
      '焦糖紫': { core: 'caramel purple palette, warm sweet purple tone', detail: 'caramel purple, warm purple, sweet purple, toffee purple, muted mauve', mood: 'warm, sweet, rich, cozy, elegant' },
      '抹茶黄': { core: 'matcha yellow palette, soft powdered yellow tone', detail: 'matcha yellow, powder yellow, soft yellow, creamy yellow, pale gold', mood: 'soft, calm, natural, soothing, refined' },
      '抹茶蓝': { core: 'matcha blue palette, soft powdered blue tone', detail: 'matcha blue, powder blue, soft blue, creamy blue, pale blue', mood: 'soft, calm, natural, soothing, serene' },
      '抹茶紫': { core: 'matcha purple palette, soft powdered purple tone', detail: 'matcha purple, powder purple, soft purple, creamy violet, pale mauve', mood: 'soft, calm, natural, soothing, elegant' }
    },
    keywords: ['色彩', '色调', '配色', '颜色', 'palette', '色系', '调色', '冷暖', '饱和', '色']
  },

  atmosphere: {
    name: '氛围',
    categories: {
      '史诗壮阔': { core: 'epic grandiose atmosphere, breathtaking scale', detail: 'sweeping vistas, monumental scale, dramatic clouds, heroic, awe-inspiring', mood: 'awe, triumph, grandeur, destiny, legend' },
      '静谧禅意': { core: 'zen tranquility, peaceful meditation, stillness', detail: 'quiet contemplation, minimal movement, still water, gentle breeze, mindful presence', mood: 'peace, stillness, harmony, zen, meditation' },
      '静谧安详': { core: 'serene tranquil atmosphere, gentle restful calm', detail: 'soft dim light, cozy quiet room, gentle breathing, warm blanket, moonlit stillness, hushed peace', mood: 'serene, restful, calm, cozy, peaceful' },
      '紧张悬疑': { core: 'tense suspense, thriller atmosphere, looming danger', detail: 'dark corners, flickering light, held breath, ominous silence, impending threat', mood: 'anxiety, dread, anticipation, fear, unease' },
      '浪漫温馨': { core: 'romantic warm atmosphere, intimate tenderness', detail: 'soft focus, warm glow, gentle touch, intimate proximity, loving gaze', mood: 'love, warmth, intimacy, tenderness, connection' },
      '悲壮苍凉': { core: 'tragic heroic atmosphere, solemn melancholy', detail: 'fallen hero, desolate landscape, wind-swept, lone figure, sacrifice and honor', mood: 'sorrow, dignity, sacrifice, solitude, resilience' },
      '孤独寂寥': { core: 'solitary lonely atmosphere, profound isolation', detail: 'single figure in vast space, empty streets, long shadows, echo, distant sounds', mood: 'loneliness, isolation, introspection, emptiness, yearning' },
      '神秘奇幻': { core: 'mystical fantasy atmosphere, magical wonder', detail: 'glowing particles, impossible geometry, floating elements, magical light, portal energy', mood: 'wonder, curiosity, magic, unknown, enchantment' },
      '颓废末世': { core: 'post-apocalyptic decay, beautiful ruin', detail: 'overgrown ruins, rust and decay, nature reclaiming, broken civilization, haunting beauty', mood: 'melancholy, decay, resilience, aftermath, haunting' },
      '活力四射': { core: 'energetic vibrant atmosphere, explosive dynamism', detail: 'motion blur, speed, confetti, action peak, celebration, bursting energy', mood: 'joy, energy, excitement, celebration, vitality' },
      '暗黑压抑': { core: 'oppressive dark atmosphere, suffocating dread', detail: 'claustrophobic spaces, crushing darkness, oppressive weight, hopeless, suffocating', mood: 'despair, oppression, fear, hopelessness, claustrophobia' },
      '梦幻飘渺': {
        core: 'soft hazy dreamlike floating ethereal atmosphere',
        detail: 'misty fog, soft focus glow, floating particles, gentle breeze, translucent fabric, heavenly light, blurred boundaries, weightless sensation, surreal landscape, cotton clouds, shimmering dust, pastel haze, fairy tale realm',
        mood: 'dreamy serene mystical wistful transcendent'
      },
      '狂热躁动': {
        core: 'chaotic intense restless high-energy frenzy atmosphere',
        detail: 'motion blur, crowded chaos, neon pulse, strobe flash, distortion, rapid movement, overwhelming sensory input, urban night chaos, explosive energy, shaking camera, sweat glisten, pounding rhythm, saturated overload',
        mood: 'anxious manic intense agitated electrified'
      },
      '温暖治愈': {
        core: 'cozy comforting healing warm gentle atmosphere',
        detail: 'soft sunlight, knitted textures, warm drink steam, comfortable interior, gentle embrace, golden afternoon, peaceful quiet, cat presence, home sanctuary, candle glow, blanket softness, morning light, calm breathing',
        mood: 'comforted safe peaceful soothed nurtured'
      },
      '肃穆庄严': {
        core: 'solemn dignified majestic reverent atmosphere',
        detail: 'grand architecture, towering columns, dim sacred light, silence, ceremonial space, ancient stone, incense smoke, vast empty hall, reverent stillness, stained glass, echoing footsteps, robed figures, hallowed ground',
        mood: 'reverent awe solemn dignified contemplative'
      },
      '荒诞离奇': {
        core: 'surreal bizarre absurd uncanny strange atmosphere',
        detail: 'distorted proportions, impossible geometry, surreal juxtaposition, dream logic, uncanny valley, strange creatures, paradoxical scenes, unsettling normalcy, twisted reality, melting clocks, floating objects, reversed gravity, mind-bending space',
        mood: 'unsettled curious bewildered intrigued disoriented'
      },
      '童趣天真': {
        core: 'playful innocent childlike whimsical wonder atmosphere',
        detail: 'bright colors, toy props, playful expressions, whimsical setting, soft plush textures, candy hues, joyful movement, storybook scene, imaginative world, balloon clusters, carousel lights, crayon drawings, giggling laughter',
        mood: 'joyful carefree innocent delighted whimsical'
      },
      '奢华雍容': {
        core: 'opulent lavish extravagant luxury decadent atmosphere',
        detail: 'gold accents, velvet drapes, crystal chandeliers, marble surfaces, silk fabric, ornate details, jewelry sparkle, grand ballroom, champagne bubbles, gilded mirrors, fur stoles, polished mahogany, diamond glitter',
        mood: 'decadent indulgent glamorous prestigious extravagant'
      },
      '野性原始': {
        core: 'untamed wild raw primitive primal atmosphere',
        detail: 'rugged terrain, stormy sky, untamed wilderness, primal instinct, raw elements, wild animals, ancient forest, volcanic landscape, survival essence, claw marks, rough stone, beating drums, tribal fire, predator gaze',
        mood: 'ferocious untamed powerful primal liberated'
      },
      '宁静致远': { core: 'tranquil far-reaching atmosphere, serene vastness', detail: 'still water, distant horizon, quiet contemplation, open sky, peaceful expanse', mood: 'peace, serenity, reflection, calm, vastness' },
      '欢快喜庆': { core: 'cheerful festive atmosphere, joyful celebration', detail: 'colorful decorations, laughter, dancing, music, fireworks, celebration', mood: 'joy, festivity, cheer, celebration, happiness' },
      '阴森恐怖': { core: 'eerie terrifying atmosphere, chilling dread', detail: 'dark shadows, creaking sounds, fog, ghostly figures, unsettling silence', mood: 'fear, dread, horror, unease, terror' },
      '神圣庄严': { core: 'sacred solemn atmosphere, divine reverence', detail: 'holy light, cathedral space, ritual, incense, chanting, hallowed ground', mood: 'reverence, awe, sanctity, solemnity, devotion' },
      '怀旧复古': { core: 'nostalgic retro atmosphere, vintage charm', detail: 'old photographs, retro objects, sepia tones, vintage music, faded memories', mood: 'nostalgia, warmth, sentiment, longing, memory' },
      '未来科技': { core: 'futuristic technology atmosphere, high-tech wonder', detail: 'holograms, sleek surfaces, neon glow, robotic elements, digital interfaces', mood: 'wonder, innovation, sleekness, progress, futurism' },
      '田园诗意': { core: 'pastoral poetic atmosphere, idyllic countryside', detail: 'rolling fields, wildflowers, gentle breeze, farmhouse, golden light, birdsong', mood: 'peace, idyll, simplicity, harmony, poetry' },
      '都市喧嚣': { core: 'urban bustle atmosphere, city energy', detail: 'crowded streets, traffic, neon signs, skyscrapers, hustle, nightlife', mood: 'energy, chaos, vitality, dynamism, bustle' },
      '荒凉寂寥': { core: 'desolate lonely atmosphere, barren emptiness', detail: 'empty wasteland, wind-blown dust, lone structures, silence, vast emptiness', mood: 'desolation, loneliness, emptiness, melancholy, abandonment' },
      '温馨居家': { core: 'cozy homey atmosphere, warm domestic comfort', detail: 'soft lighting, warm blankets, family space, home cooking, comfortable furniture', mood: 'cozy, warm, safe, comfortable, homely' },
      '惊险刺激': { core: 'thrilling exciting atmosphere, adrenaline rush', detail: 'fast action, narrow escapes, suspense, heart-pounding moments, danger', mood: 'excitement, thrill, adrenaline, suspense, intensity' },
      '庄重典雅': { core: 'dignified elegant atmosphere, refined grace', detail: 'polished surfaces, classical decor, refined gestures, graceful movement, formal setting', mood: 'dignity, elegance, grace, refinement, poise' },
      '诡异神秘': { core: 'uncanny mysterious atmosphere, strange enigma', detail: 'unexplained phenomena, shadowy figures, strange symbols, eerie glow, cryptic clues', mood: 'mystery, unease, intrigue, enigma, wonder' },
      '热血激昂': { core: 'passionate fervent atmosphere, burning intensity', detail: 'roaring crowds, battle cries, blazing determination, heroic charge, fierce energy', mood: 'passion, fervor, intensity, determination, heroism' },
      '哀伤忧郁': { core: 'sorrowful melancholic atmosphere, gentle grief', detail: 'soft rain, dim light, quiet tears, fading memories, lonely figure', mood: 'sorrow, melancholy, grief, longing, sadness' },
      '清新自然': { core: 'fresh natural atmosphere, clean vitality', detail: 'morning dew, green fields, clear air, gentle sunlight, blooming flowers', mood: 'fresh, natural, clean, vibrant, invigorating' },
      '神秘莫测': { core: 'mysterious unfathomable atmosphere, deep enigma', detail: 'hidden depths, veiled figures, ancient secrets, swirling mist, unknown forces', mood: 'mystery, awe, wonder, intrigue, uncertainty' },
      '史诗悲歌': { core: 'epic elegy atmosphere, grand tragic lament', detail: 'fallen heroes, vast battlefields, mournful music, solemn ceremony, fading glory', mood: 'tragedy, grandeur, lament, solemnity, loss' },
      '晨曦微光': { core: 'dawn light atmosphere, gentle morning glow', detail: 'soft first light, golden horizon, morning mist, dew sparkle, awakening world', mood: 'fresh, hopeful, serene, gentle, promising' },
      '暮色苍茫': { core: 'dusk atmosphere, vast twilight expanse', detail: 'fading light, long shadows, purple-orange sky, silhouettes, quiet transition', mood: 'melancholic, contemplative, vast, nostalgic, peaceful' },
      '星河璀璨': { core: 'brilliant starry sky atmosphere, celestial splendor', detail: 'dense star field, milky way, shooting stars, deep night sky, glowing constellations', mood: 'awe, wonder, vastness, magic, inspiration' },
      '极光幻境': { core: 'aurora atmosphere, magical polar light show', detail: 'dancing aurora curtains, green purple glow, snowy landscape, shimmering sky, arctic night', mood: 'magical, ethereal, wondrous, serene, surreal' },
      '空灵幽远': { core: 'ethereal distant atmosphere, airy transcendence', detail: 'thin mist, distant mountains, soft haze, floating sensation, boundless space', mood: 'ethereal, serene, detached, contemplative, sublime' },
      '超然脱俗': { core: 'transcendent otherworldly atmosphere, spiritual elevation', detail: 'celestial light, floating figures, cloud realm, divine glow, weightless serenity', mood: 'transcendent, serene, enlightened, peaceful, sublime' },
      '甜蜜幸福': { core: 'sweet blissful atmosphere, warm affection', detail: 'soft pastels, gentle smiles, shared moments, warm glow, tender connection', mood: 'sweet, happy, affectionate, warm, joyful' },
      '幸福美满': { core: 'blissful content atmosphere, complete happiness', detail: 'family gathering, warm home, laughter, abundance, harmonious togetherness', mood: 'happy, content, grateful, warm, fulfilled' },
      '喜悦欢腾': { core: 'jubilant atmosphere, overflowing joy', detail: 'cheering crowd, dancing, bright colors, confetti, laughter, celebration energy', mood: 'joyful, exuberant, festive, elated, lively' },
      '兴奋激动': { core: 'excited thrilled atmosphere, electric anticipation', detail: 'wide eyes, racing heart, bright energy, eager movement, sparkling moments', mood: 'excited, thrilled, eager, animated, electric' },
      '焦虑不安': { core: 'anxious uneasy atmosphere, restless worry', detail: 'fidgeting, tense posture, racing thoughts, uneasy silence, restless energy', mood: 'anxious, uneasy, restless, worried, tense' },
      '恐惧战栗': { core: 'terrified trembling atmosphere, primal fear', detail: 'shaking hands, wide fearful eyes, cold sweat, frozen terror, looming threat', mood: 'terrified, fearful, trembling, panicked, horrified' },
      '惊悚骇人': { core: 'horrifying chilling atmosphere, shocking dread', detail: 'sudden scares, grotesque imagery, blood-chilling silence, unsettling reveal, dread', mood: 'horrified, shocked, terrified, disturbed, chilled' },
      '阴森诡谲': { core: 'eerie uncanny atmosphere, sinister strangeness', detail: 'shadowy corners, unnatural stillness, twisted shapes, ominous fog, lurking presence', mood: 'eerie, sinister, uncanny, uneasy, ominous' },
      '玄奥深邃': { core: 'profound mysterious atmosphere, deep enigma', detail: 'ancient symbols, hidden depths, swirling mists, cryptic light, unfathomable space', mood: 'mysterious, profound, awe, intrigue, wonder' },
      '童话梦幻': { core: 'fairy tale dreamy atmosphere, storybook wonder', detail: 'enchanted forest, castle towers, magical creatures, glowing path, whimsical light', mood: 'dreamy, magical, whimsical, enchanting, innocent' },
      '天真烂漫': { core: 'innocent carefree atmosphere, pure joy', detail: 'playful laughter, bright eyes, simple pleasures, sunny fields, open smiles', mood: 'innocent, carefree, joyful, pure, lighthearted' },
      '青春朝气': { core: 'youthful vibrant atmosphere, fresh energy', detail: 'school campus, sports, bright smiles, energetic movement, hopeful faces', mood: 'youthful, energetic, fresh, lively, hopeful' },
      '朝气蓬勃': { core: 'vigorous spirited atmosphere, bursting vitality', detail: 'rising sun, blooming life, dynamic motion, fresh momentum, lively spirit', mood: 'vigorous, spirited, lively, dynamic, optimistic' },
      '生机盎然': { core: 'lush thriving atmosphere, abundant life', detail: 'green foliage, blooming flowers, buzzing insects, flowing water, rich growth', mood: 'alive, vibrant, lush, thriving, refreshing' },
      '豪迈奔放': { core: 'bold unbridled atmosphere, heroic exuberance', detail: 'open plains, galloping horses, roaring laughter, sweeping gestures, wild freedom', mood: 'bold, heroic, exuberant, free, spirited' },
      '自由洒脱': { core: 'free-spirited atmosphere, untethered ease', detail: 'open road, wind in hair, wide horizons, spontaneous joy, unbound movement', mood: 'free, carefree, liberated, easy, spontaneous' },
      '叛逆不羁': { core: 'rebellious defiant atmosphere, edgy independence', detail: 'graffiti walls, leather jackets, defiant stares, punk energy, breaking rules', mood: 'rebellious, defiant, edgy, independent, bold' },
      '奋斗拼搏': { core: 'striving determined atmosphere, relentless effort', detail: 'sweat and grit, focused faces, training, uphill climb, burning ambition', mood: 'determined, driven, relentless, ambitious, gritty' },
      '乐观积极': { core: 'optimistic positive atmosphere, bright outlook', detail: 'sunny colors, hopeful gestures, encouraging smiles, forward motion, bright future', mood: 'optimistic, positive, hopeful, cheerful, uplifting' },
      '希望憧憬': { core: 'hopeful longing atmosphere, bright anticipation', detail: 'distant light, rising sun, open doors, reaching hands, promising horizon', mood: 'hopeful, longing, optimistic, anticipatory, inspired' },
      '王者霸气': { core: 'kingly commanding atmosphere, regal dominance', detail: 'throne, crown, sweeping cape, commanding gaze, loyal court, golden light', mood: 'commanding, powerful, regal, dominant, majestic' },
      '帝王威仪': { core: 'imperial majesty atmosphere, august authority', detail: 'grand palace, imperial robes, ceremonial procession, gilded halls, solemn court', mood: 'majestic, august, authoritative, solemn, grand' },
      '贵族气质': { core: 'aristocratic atmosphere, refined nobility', detail: 'manor house, elegant attire, fine china, poised gestures, cultured setting', mood: 'refined, noble, elegant, cultured, poised' },
      '富丽堂皇': { core: 'magnificent resplendent atmosphere, grand opulence', detail: 'gilded ceilings, crystal chandeliers, marble columns, lavish decor, dazzling light', mood: 'magnificent, opulent, resplendent, grand, dazzling' },
      '宏伟磅礴': { core: 'grand majestic atmosphere, overwhelming scale', detail: 'towering mountains, vast oceans, colossal structures, sweeping panorama, monumental', mood: 'grand, majestic, overwhelming, awe-inspiring, monumental' },
      '浩瀚无垠': { core: 'boundless vast atmosphere, infinite expanse', detail: 'endless ocean, infinite sky, distant stars, open desert, limitless horizon', mood: 'vast, boundless, awe, freedom, infinite' },
      '苍茫辽远': { core: 'vast distant atmosphere, far-reaching melancholy', detail: 'endless plains, distant mountains, drifting clouds, lone horizon, hazy distance', mood: 'vast, distant, melancholic, contemplative, lonely' },
      '永恒不朽': { core: 'eternal immortal atmosphere, timeless endurance', detail: 'ancient monuments, timeless stone, enduring light, ageless beauty, everlasting', mood: 'eternal, timeless, enduring, majestic, profound' },
      '混沌初开': { core: 'primordial chaos atmosphere, dawn of creation', detail: 'swirling nebula, elemental forces, raw energy, forming worlds, cosmic birth', mood: 'primordial, chaotic, awe, cosmic, mysterious' },
      '虚无空寂': { core: 'void emptiness atmosphere, absolute stillness', detail: 'empty white space, absolute silence, formless void, absence of life, pure emptiness', mood: 'empty, still, void, silent, desolate' },
      '肃杀': { core: 'grim killing atmosphere, cold deadly tension', detail: 'chilling stillness, sharp wind, muted light, looming threat, cold resolve', mood: 'grim, deadly, tense, cold, menacing' },
      '慵懒': { core: 'languid lazy atmosphere, relaxed slow pace', detail: 'soft afternoon light, slow movement, drowsy warmth, unhurried ease, gentle haze', mood: 'lazy, relaxed, drowsy, comfortable, unhurried' },
      '怀旧': { core: 'nostalgic atmosphere, warm memory of the past', detail: 'faded photographs, warm sepia glow, old songs, familiar scents, gentle longing', mood: 'nostalgic, warm, sentimental, longing, tender' },
      '惊悚': { core: 'thriller atmosphere, sharp suspense shock', detail: 'sudden reveals, tense silence, quick shadows, racing heartbeat, unexpected dread', mood: 'thrilled, startled, tense, anxious, shocked' },
      '空灵': { core: 'ethereal atmosphere, airy otherworldly lightness', detail: 'thin mist, floating light, distant echoes, weightless space, translucent glow', mood: 'ethereal, serene, detached, sublime, transcendent' },
      '炽烈': { core: 'blazing atmosphere, intense burning passion', detail: 'fierce flames, searing heat, blazing light, burning intensity, fierce energy', mood: 'intense, passionate, fiery, fierce, burning' },
      '静谧': { core: 'tranquil atmosphere, deep quiet calm', detail: 'absolute stillness, soft silence, gentle breath, quiet space, peaceful calm', mood: 'tranquil, peaceful, calm, still, serene' },
      '苍凉': { core: 'bleak atmosphere, cold desolate emptiness', detail: 'grey expanse, cold wind, bare land, fading light, lonely horizon', mood: 'bleak, desolate, cold, lonely, melancholic' },
      '荒芜': { core: 'barren atmosphere, empty desolate wasteland', detail: 'empty land, dry earth, scattered bones, wind-blown dust, lifeless expanse', mood: 'barren, desolate, empty, forsaken, melancholic' },
      '萧瑟': { core: 'desolate atmosphere, bleak autumn chill', detail: 'falling leaves, cold wind, bare branches, grey sky, lonely road', mood: 'desolate, bleak, lonely, melancholic, cold' },
      '凄清': { core: 'bleak clear atmosphere, cold lonely clarity', detail: 'cold moonlight, clear empty space, lonely silence, pale light, quiet desolation', mood: 'bleak, lonely, cold, clear, melancholic' },
      '幽静': { core: 'secluded quiet atmosphere, hidden peaceful calm', detail: 'hidden garden, quiet path, soft birdsong, gentle shade, private stillness', mood: 'secluded, quiet, peaceful, calm, serene' },
      '清冷': { core: 'cool clear atmosphere, crisp clean coolness', detail: 'crisp air, cool light, clear sky, fresh breeze, clean stillness', mood: 'cool, clear, fresh, crisp, calm' },
      '温润': { core: 'warm moist atmosphere, gentle tender warmth', detail: 'soft warmth, gentle moisture, tender light, soothing air, comforting glow', mood: 'warm, tender, soothing, gentle, comforting' },
      '恬淡': { core: 'placid atmosphere, calm indifferent ease', detail: 'gentle routine, quiet contentment, soft light, unhurried calm, simple peace', mood: 'placid, calm, content, peaceful, indifferent' },
      '闲适': { core: 'leisurely atmosphere, relaxed unhurried ease', detail: 'slow afternoon, comfortable rest, gentle breeze, open space, easy pace', mood: 'leisurely, relaxed, easy, comfortable, unhurried' },
      '安逸': { core: 'comfortable atmosphere, secure peaceful ease', detail: 'warm home, soft cushions, gentle light, safe quiet, restful calm', mood: 'comfortable, secure, peaceful, content, restful' },
      '惬意': { core: 'cozy atmosphere, pleasant comfortable delight', detail: 'warm corner, soft blanket, gentle warmth, pleasant quiet, easy comfort', mood: 'cozy, pleasant, comfortable, delighted, content' },
      '悠然': { core: 'carefree atmosphere, relaxed untroubled ease', detail: 'open sky, drifting clouds, gentle pace, unhurried joy, peaceful freedom', mood: 'carefree, relaxed, easy, content, free' },
      '淡泊': { core: 'indifferent atmosphere, calm detached simplicity', detail: 'simple space, quiet restraint, muted light, unhurried calm, detached peace', mood: 'indifferent, calm, detached, simple, peaceful' },
      '超脱': { core: 'detached atmosphere, elevated above worldly concerns', detail: 'elevated view, distant calm, floating perspective, serene detachment, clear space', mood: 'detached, serene, elevated, calm, transcendent' },
      '空寂': { core: 'empty still atmosphere, profound quiet emptiness', detail: 'empty space, absolute silence, still air, formless calm, deep quiet', mood: 'empty, still, quiet, profound, serene' },
      '孤寂': { core: 'lonely atmosphere, quiet solitude', detail: 'single figure, empty space, long silence, distant light, quiet isolation', mood: 'lonely, solitary, quiet, introspective, melancholic' },
      '落寞': { core: 'forlorn atmosphere, lonely dejected feeling', detail: 'fading light, empty chair, quiet sigh, dim corner, solitary figure', mood: 'forlorn, lonely, dejected, wistful, melancholic' },
      '惆怅': { core: 'melancholy atmosphere, gentle wistful sadness', detail: 'soft rain, dim light, lingering gaze, quiet reflection, fading memory', mood: 'melancholy, wistful, sad, reflective, tender' },
      '怅惘': { core: 'wistful atmosphere, dreamy longing regret', detail: 'distant gaze, soft haze, lingering thought, gentle sigh, fading hope', mood: 'wistful, longing, dreamy, regretful, tender' },
      '迷惘': { core: 'confused atmosphere, lost uncertain haze', detail: 'blurred shapes, shifting fog, uncertain path, disoriented space, hazy direction', mood: 'confused, lost, uncertain, disoriented, hazy' },
      '彷徨': { core: 'hesitant atmosphere, uncertain wandering', detail: 'uncertain steps, crossroads, lingering pause, restless movement, doubtful gaze', mood: 'hesitant, uncertain, restless, doubtful, lost' },
      '忐忑': { core: 'anxious atmosphere, nervous uneasy anticipation', detail: 'fidgeting hands, quick breath, restless eyes, tense pause, uneasy stillness', mood: 'anxious, nervous, uneasy, restless, tense' },
      '惶恐': { core: 'panicked atmosphere, sudden overwhelming fear', detail: 'racing heart, trembling hands, wide eyes, urgent movement, cold sweat', mood: 'panicked, terrified, overwhelmed, alarmed, frantic' },
      '惊惶': { core: 'alarmed atmosphere, startled sudden fear', detail: 'sudden shock, wide eyes, sharp intake, frozen moment, startled stillness', mood: 'alarmed, startled, shocked, frightened, tense' },
      '慌乱': { core: 'flustered atmosphere, hurried disorganized panic', detail: 'scattered objects, quick movements, confused voices, rushed steps, chaotic energy', mood: 'flustered, hurried, panicked, disorganized, chaotic' },
      '焦灼': { core: 'anxious burning atmosphere, restless urgent worry', detail: 'restless pacing, burning tension, impatient glances, uneasy heat, urgent waiting', mood: 'anxious, restless, urgent, impatient, tense' },
      '急切': { core: 'eager atmosphere, impatient urgent desire', detail: 'leaning forward, quick steps, bright eyes, reaching hands, urgent anticipation', mood: 'eager, impatient, urgent, eager, hopeful' },
      '迫切': { core: 'urgent atmosphere, pressing immediate need', detail: 'racing clock, quick movements, pressing voices, urgent pace, tense focus', mood: 'urgent, pressing, intense, hurried, focused' },
      '激昂': { core: 'fervent atmosphere, passionate intense spirit', detail: 'raised voices, blazing eyes, energetic gestures, burning passion, fierce resolve', mood: 'fervent, passionate, intense, spirited, fiery' },
      '澎湃': { core: 'surging atmosphere, powerful overwhelming emotion', detail: 'crashing waves, rising energy, surging emotion, powerful momentum, overwhelming force', mood: 'surging, powerful, overwhelming, passionate, intense' },
      '豪情': { core: 'heroic spirit atmosphere, bold passionate resolve', detail: 'open plains, bold gestures, soaring spirit, passionate courage, grand ambition', mood: 'heroic, bold, passionate, spirited, ambitious' },
      '壮志': { core: 'ambitious atmosphere, lofty determined aspiration', detail: 'distant peak, determined gaze, rising path, burning goal, unwavering resolve', mood: 'ambitious, determined, aspirational, driven, resolute' },
      '昂扬': { core: 'high-spirited atmosphere, lifted energetic morale', detail: 'raised heads, bright eyes, confident steps, rising energy, spirited motion', mood: 'high-spirited, confident, energetic, uplifted, vigorous' },
      '振奋': { core: 'inspired atmosphere, uplifting motivating energy', detail: 'bright light, hopeful faces, rising energy, encouraging voices, renewed spirit', mood: 'inspired, uplifted, motivated, hopeful, energized' },
      '鼓舞': { core: 'encouraging atmosphere, supportive uplifting spirit', detail: 'supportive hands, warm smiles, cheering voices, reassuring presence, hopeful energy', mood: 'encouraging, supportive, uplifting, hopeful, warm' },
      '欢腾': { core: 'jubilant atmosphere, joyful celebratory uproar', detail: 'cheering crowd, dancing figures, bright colors, festive noise, overflowing joy', mood: 'jubilant, joyful, celebratory, exuberant, lively' },
      '雀跃': { core: 'excited atmosphere, lively jumping joy', detail: 'bouncing steps, sparkling eyes, quick laughter, eager movement, bright energy', mood: 'excited, joyful, lively, eager, cheerful' },
      '欣喜': { core: 'joyful atmosphere, delighted happy feeling', detail: 'bright smiles, warm light, happy voices, gentle laughter, content glow', mood: 'joyful, delighted, happy, warm, content' },
      '愉悦': { core: 'pleasant atmosphere, agreeable cheerful ease', detail: 'soft music, gentle light, easy conversation, comfortable warmth, happy calm', mood: 'pleasant, cheerful, agreeable, comfortable, happy' },
      '舒畅': { core: 'relaxed atmosphere, free easy comfort', detail: 'open space, gentle breeze, easy breathing, unhurried calm, light heart', mood: 'relaxed, comfortable, free, easy, light' },
      '畅快': { core: 'carefree joyful atmosphere, free flowing delight', detail: 'open road, rushing wind, loud laughter, free movement, unbound joy', mood: 'carefree, joyful, free, delighted, exuberant' },
      '酣畅': { core: 'hearty atmosphere, full satisfying enjoyment', detail: 'rich laughter, full table, warm company, satisfying ease, abundant joy', mood: 'hearty, satisfying, joyful, warm, abundant' },
      '尽兴': { core: 'thoroughly enjoyable atmosphere, complete festive delight', detail: 'lively gathering, full glasses, happy voices, dancing energy, satisfied joy', mood: 'joyful, festive, satisfied, delighted, lively' },
      '宁和': { core: 'peaceful harmonious atmosphere, calm gentle balance', detail: 'soft light, gentle sounds, balanced space, quiet harmony, serene calm', mood: 'peaceful, harmonious, calm, gentle, serene' },
      '安详': { core: 'serene atmosphere, peaceful tranquil calm', detail: 'soft glow, gentle stillness, quiet breath, calm face, peaceful rest', mood: 'serene, peaceful, tranquil, calm, content' },
      '祥和': { core: 'auspicious atmosphere, harmonious peaceful blessing', detail: 'warm light, gentle smiles, festive calm, harmonious gathering, blessed peace', mood: 'auspicious, harmonious, peaceful, warm, blessed' },
      '太平': { core: 'peaceful atmosphere, calm stable tranquility', detail: 'quiet streets, safe calm, gentle routine, stable light, undisturbed peace', mood: 'peaceful, calm, stable, safe, tranquil' },
      '安然': { core: 'calm atmosphere, composed peaceful ease', detail: 'steady breath, quiet space, gentle light, composed stillness, restful calm', mood: 'calm, composed, peaceful, restful, serene' },
      '淡雅': { core: 'elegant atmosphere, refined understated grace', detail: 'soft colors, delicate details, quiet refinement, graceful space, understated beauty', mood: 'elegant, refined, graceful, understated, tasteful' },
      '雅致': { core: 'refined atmosphere, cultured elegant taste', detail: 'polished details, tasteful decor, graceful gestures, cultured space, quiet elegance', mood: 'refined, elegant, cultured, tasteful, graceful' },
      '清雅': { core: 'elegant clear atmosphere, fresh refined grace', detail: 'clear light, clean space, delicate beauty, fresh elegance, refined calm', mood: 'elegant, fresh, refined, clear, graceful' },
      '素雅': { core: 'plain elegant atmosphere, simple refined beauty', detail: 'simple decor, muted colors, clean lines, understated grace, quiet elegance', mood: 'plain, elegant, refined, understated, tasteful' },
      '古朴': { core: 'antique atmosphere, old simple charm', detail: 'aged wood, worn stone, faded colors, old objects, quiet history', mood: 'antique, rustic, nostalgic, simple, warm' },
      '古拙': { core: 'archaic atmosphere, old rough simplicity', detail: 'rough textures, ancient forms, simple tools, weathered surface, primitive charm', mood: 'archaic, rustic, simple, ancient, earthy' },
      '苍劲': { core: 'vigorous atmosphere, strong weathered power', detail: 'gnarled trees, strong strokes, aged strength, powerful lines, weathered vigor', mood: 'vigorous, strong, powerful, weathered, bold' },
      '遒劲': { core: 'forceful atmosphere, strong powerful energy', detail: 'bold strokes, strong lines, forceful motion, powerful presence, dynamic energy', mood: 'forceful, powerful, strong, bold, dynamic' },
      '磅礴': { core: 'majestic atmosphere, overwhelming grand power', detail: 'towering mountains, vast oceans, sweeping scale, monumental force, overwhelming grandeur', mood: 'majestic, grand, overwhelming, powerful, awe-inspiring' },
      '恢弘': { core: 'grand atmosphere, vast magnificent scale', detail: 'vast halls, sweeping vistas, monumental architecture, expansive space, grand vision', mood: 'grand, magnificent, vast, expansive, awe-inspiring' },
      '壮阔': { core: 'grand vast atmosphere, sweeping magnificent expanse', detail: 'vast plains, open sky, sweeping horizon, monumental scale, grand vista', mood: 'grand, vast, magnificent, sweeping, awe-inspiring' },
      '雄浑': { core: 'majestic strong atmosphere, powerful solemn grandeur', detail: 'deep tones, strong forms, monumental presence, powerful stillness, solemn grandeur', mood: 'majestic, powerful, solemn, grand, strong' },
      '苍茫': { core: 'vast misty atmosphere, boundless hazy distance', detail: 'endless horizon, drifting mist, distant mountains, hazy expanse, boundless space', mood: 'vast, misty, boundless, distant, contemplative' },
      '辽阔': { core: 'vast atmosphere, wide open expanse', detail: 'wide plains, open sky, endless horizon, expansive space, boundless view', mood: 'vast, open, expansive, free, boundless' },
      '广袤': { core: 'expansive atmosphere, immense wide space', detail: 'immense fields, endless distance, open terrain, broad horizon, vast freedom', mood: 'expansive, vast, immense, open, free' },
      '空阔': { core: 'open atmosphere, wide empty space', detail: 'open sky, empty field, clear horizon, wide space, uncluttered calm', mood: 'open, spacious, calm, clear, free' },
      '幽深': { core: 'deep secluded atmosphere, profound hidden depth', detail: 'deep forest, dark water, hidden path, profound stillness, mysterious depth', mood: 'deep, secluded, mysterious, profound, still' }
    },
    keywords: ['氛围', '气氛', '情绪', '感觉', '基调', 'atmosphere', 'mood', 'vibe', '意境']
  },

  character: {
    name: '人物',
    categories: {
      '女帝': {
        core: 'a woman enthroned as empress regnant, commanding and sharp',
        detail: 'black-gold patterned imperial robe, twelve-tassel crown, gold bracers, embroidered boots',
        face: 'striking sharp features, upturned eyes, imposing brow',
        pose: 'seated on the throne, raising a sleeve to bid courtiers rise, looking down',
        mood: 'majestic, decisive, cutting, aloof, unquestionable',
        ref: 'inspired by Chinese empress-regnant drama figures',
        negative: 'submissive posture, plain clothing, timid expression'
      },

      '霸总': {
        core: 'a domineering corporate heir, commanding presence',
        detail: 'dark tailored three-piece suit, silk tie, cufflinks, luxury watch, polished leather shoes',
        face: 'sharp cold features, defined jaw, intense gaze, severe expression',
        pose: 'standing by floor-to-ceiling window with one hand in pocket, tapping desk',
        mood: 'domineering, cold, possessive, controlling, aloof',
        ref: 'inspired by modern CEO romance drama leads',
        negative: 'casual clothes, slouching, cheap fabric, young student look'
      },
      '病娇': {
        core: 'a sweet-looking girl with twisted obsessive attachment',
        detail: 'soft knit cardigan, white dress, strappy sandals, scissors clutched in hand',
        face: 'sweet harmless face, gentle smile, unnatural red eyes, unfocused pupils',
        pose: 'cradling face with both hands, tilting head, retreating then closing in',
        mood: 'sweet, obsessive, dangerous, clingy, unstable',
        ref: 'inspired by yandere character archetypes',
        negative: 'bright cheerful smile, aggressive posture, athletic clothing'
      },
      '青梅竹马': {
        core: 'a childhood-friend boy next door, quietly devoted',
        detail: 'loose t-shirt, sport jacket tied at waist, canvas shoes, backpack',
        face: 'clean bright face, crescent eyes when smiling, ears easily flushed',
        pose: 'sitting side by side on steps, handing water, turning back to wave',
        mood: 'familiar, innocent, considerate, dependent, unspoken',
        ref: 'inspired by youth romance drama childhood friends',
        negative: 'arrogant expression, formal suit, distant posture'
      },
      '剑修': {
        core: 'a sword-cultivating immortal, austere and razor-sharp',
        detail: 'plain blue-green taoist robe, hemp rope belt, cloth socks, longsword on back',
        face: 'cold brows, icy calm eyes, long hair tied with wooden pin',
        pose: 'hovering in midair, sword-fingers raised, robe billowing without wind',
        mood: 'cold, restrained, sharp, aloof, transcendent',
        ref: 'inspired by xianxia sword cultivators',
        negative: 'heavy armor, modern clothing, relaxed casual posture'
      },
      '白月光': {
        core: 'the untouchable first love remembered from youth',
        detail: 'white dress, knit cardigan, ribbon hair accessory, low-heel shoes',
        face: 'pale gentle features, clear eyes, faint lip color',
        pose: 'turning back under cherry blossoms, hugging a schoolbag, smiling down',
        mood: 'pure, distant, gentle, fragile, unreachable',
        ref: 'inspired by idealized first-love figures in drama',
        negative: 'bold makeup, aggressive stance, dark clothing'
      },
      '校花': {
        core: 'the most noticed girl on campus',
        detail: 'school shirt, pleated skirt, ankle socks and loafers, hair tie',
        face: 'bright clean features, radiant smile, long straight hair',
        pose: 'walking through hallway with books, turning sideways when called',
        mood: 'bright, confident, approachable, watched',
        ref: 'inspired by campus drama heroines',
        negative: 'depressed expression, shabby clothes, hidden posture'
      },
      '校草': {
        core: 'the quietly admired boy on campus',
        detail: 'open school blazer, white shirt, sneakers, earphones around neck',
        face: 'lean sharp features, light brows, short hair',
        pose: 'carrying bag over one shoulder, leaning on wall, looking at phone',
        mood: 'aloof, clean, boyish, inarticulate',
        ref: 'inspired by campus drama male leads',
        negative: 'flashy outfit, exaggerated expression, older adult look'
      },
      '学霸': {
        core: 'the top student, quietly disciplined',
        detail: 'neatly worn school uniform, buttoned shirt, tidy cuffs, densely written notebook',
        face: 'clean calm features, focused eyes, thin-rimmed glasses',
        pose: 'bent over desk calculating, pen suspended midair in thought',
        mood: 'focused, restrained, disciplined, quiet',
        ref: 'inspired by academic achievers in campus stories',
        negative: 'messy appearance, lazy posture, loud expression'
      },
      '学姐': {
        core: 'the senior girl a year above, poised and warm',
        detail: 'knit vest over shirt, long skirt, canvas tote, hair tie on wrist',
        face: 'bright open features, crescent smile',
        pose: 'walking briskly with documents, turning back to wave others along',
        mood: 'mature, considerate, measured, slightly distant',
        ref: 'inspired by senior students in campus drama',
        negative: 'childish look, sloppy clothes, nervous posture'
      },
      '包租公': {
        core: 'a low-key landlord in an urban village, shrewd and wealthy',
        detail: 'loose floral shirt, baggy shorts, flip-flops, ring of keys at waist',
        face: 'round slightly plump face, smiling eyes, keys jingling in hand',
        pose: 'standing downstairs in slippers calling out, counting cash by a shutter door',
        mood: 'shrewd, worldly, warm-hearted, quietly rich',
        ref: 'inspired by urban-village landlords in short drama',
        negative: 'formal suit, lean athletic build, aristocratic manner'
      },
      '外卖员': {
        core: 'a delivery rider rushing against the clock',
        detail: 'bright rider uniform, helmet under arm, insulated box, raincoat rolled on scooter',
        face: 'sun-weathered face, tired but focused eyes, sweat at temple',
        pose: 'stopping with one foot on ground, checking phone orders, running upstairs',
        mood: 'weary, hurried, resilient, silent',
        ref: 'inspired by gig-economy riders in urban realism drama',
        negative: 'leisurely posture, formal attire, indoor setting'
      },
      '打工人': {
        core: 'a commuter drained by the daily grind',
        detail: 'office commute outfit, loosened shirt collar, jacket over arm, canvas tote',
        face: 'tired young face, blank gaze, dark circles',
        pose: 'dozing while holding subway strap, walking fast with coffee',
        mood: 'exhausted, numb, enduring, self-mocking',
        ref: 'inspired by workplace slice-of-life shorts',
        negative: 'energetic posture, luxury clothing, vacation setting'
      },
      '偶像': {
        core: 'a stage idol, sharp and radiant',
        detail: 'sequined stage outfit, studded jacket, leather pants, boots, in-ear monitor',
        face: 'refined sculpted features, sharp eye makeup, bleached hair',
        pose: 'raising mic one-handed, spinning and flipping hair, direct gaze under stage light',
        mood: 'bold, confident, sharp, watched',
        ref: 'inspired by idol stage performances',
        negative: 'plain clothes, shy posture, dim lighting'
      },
      '练习生': {
        core: 'a trainee still grinding in the practice room',
        detail: 'loose dance t-shirt, track pants, knee pads, sneakers, towel around neck',
        face: 'young raw features, hair damp with sweat on forehead',
        pose: 'rehearsing in front of mirror, leaning on wall catching breath',
        mood: 'stubborn, nervous, hungry, defiant',
        ref: 'inspired by idol trainees',
        negative: 'polished stage costume, confident smug expression, audience'
      },
      '女神': {
        core: 'an admired figure with cool distant elegance',
        detail: 'clean-cut long dress or trench coat, slim heels, minimal jewelry',
        face: 'refined features, distant gaze, long hair over shoulders',
        pose: 'nodding politely at distance, stepping aside with skirt swaying',
        mood: 'cool, elegant, distant, admired',
        ref: 'inspired by idealized female leads',
        negative: 'casual messy clothes, loud expression, close physical contact'
      },
      '富二代': {
        core: 'a wealthy heir, relaxed and casually arrogant',
        detail: 'designer casual wear, limited sneakers, watch, sunglasses hooked on collar',
        face: 'clean bold features, lazy eyes, careless smile',
        pose: 'leaning on sports car with phone, tossing car keys, lounging on sofa',
        mood: 'relaxed, capricious, showy, quietly confident',
        ref: 'inspired by rich heirs in urban drama',
        negative: 'shabby clothes, timid posture, hard labor setting'
      },

      '老人': {
        core: 'an elderly person weathered by time, kind and steady',
        detail: 'dark coarse cotton jacket, worn cloth shoes, cloth sash, wooden cane',
        face: 'deeply wrinkled face, gentle cloudy eyes, gray beard, loose skin',
        pose: 'walking slowly with a cane, sitting on a doorstep, hands folded, gazing far',
        mood: 'weathered, kind, calm, resilient, warm',
        ref: 'inspired by rural village elders, grandparents',
        negative: 'young smooth face, modern clothing, athletic stance, childlike'
      },
      '老者': {
        core: 'a white-haired elder, wise sage with an otherworldly air',
        detail: 'grey-white long robe, wide sleeves, cloth shoes, old jade pendant',
        face: 'long silver beard, deep-set eyes, lined forehead, wise calm expression',
        pose: 'standing with hands behind back, stroking beard, sitting cross-legged in thought',
        mood: 'wise, serene, detached, dignified, all-knowing',
        ref: 'inspired by wuxia sages, hermits, elders',
        negative: 'youthful face, modern suit, sunglasses, energetic pose'
      },
      '少年': {
        core: 'a teenage boy, raw and stubborn',
        detail: 'faded shirt, shorts, old canvas shoes, cloth shoulder bag',
        face: 'lean boyish face, unformed features, bright stubborn eyes, short hair',
        pose: 'running, looking back, clenching fist, sitting on the ground',
        mood: 'raw, stubborn, curious, energetic, reckless',
        ref: 'inspired by coming-of-age youth portraits',
        negative: 'mature adult face, beard, business suit, elderly'
      },
      '少女': {
        core: 'a teenage girl, pure and quiet',
        detail: 'light-colored dress or school uniform, white canvas shoes, small shoulder bag, hair tie',
        face: 'clean delicate features, soft brows, faint smile, shoulder-length hair',
        pose: 'sitting with knees hugged, reading with head down, glancing back, tucking hair',
        mood: 'pure, quiet, soft, reserved, innocent',
        ref: 'inspired by natural youth portraits, not anime style',
        negative: 'anime eyes, exaggerated expression, heavy makeup, mature adult'
      },
      '孩童': {
        core: 'a small child around four or five, lively and innocent',
        detail: 'colorful little vest, shorts, small cloth shoes, toy in hand',
        face: 'round chubby face, big eyes, plump cheeks, short soft hair',
        pose: 'toddling, crouching to look at something, arms raised, grinning',
        mood: 'innocent, lively, childish, curious, carefree',
        ref: 'inspired by candid childhood photography',
        negative: 'adult proportions, mature face, tall figure, formal wear'
      },
      '旅人': {
        core: 'a dust-covered traveler, walking alone',
        detail: 'grey-brown cloak, worn leather boots, canvas pack, waterskin, rope',
        face: 'sun-beaten face, determined tired eyes, stubble, messy hair',
        pose: 'walking with a pack, pausing to look far, resting by the road, unfolding a map',
        mood: 'resilient, solitary, weary, determined, free',
        ref: 'inspired by wandering adventurers, pilgrims',
        negative: 'clean tidy look, formal suit, indoor setting, ornate armor'
      },
      '工匠': {
        core: 'a focused craftsman with strong calloused hands',
        detail: 'dark work apron, rolled sleeves, coarse trousers, goggles, tool pouch',
        face: 'fine-lined face, focused eyes, slightly furrowed brow, dust on hands',
        pose: 'leaning over to polish, hammering, examining the finished piece, shielding from debris',
        mood: 'focused, practical, patient, plain, proud',
        ref: 'inspired by atelier craftsmen, carpenters, metalworkers',
        negative: 'business suit, idle posture, clean hands, delicate ladylike pose'
      },
      '琴师': {
        core: 'a guqin player, elegant and serene',
        detail: 'plain cross-collar robe, wide sleeves, jade hairpin, qin case, incense burner',
        face: 'refined serene face, lowered lashes, soft lips, half-tied long hair',
        pose: 'plucking strings, eyes closed listening, sitting sideways, stroking the instrument',
        mood: 'elegant, focused, detached, distant, reserved',
        ref: 'inspired by classical Chinese literati music',
        negative: 'modern guitar, rock pose, loud expression, casual sportswear'
      },
      '乞丐': {
        core: 'a ragged beggar, still clear-eyed',
        detail: 'tattered patched robe, rope belt, bare feet or broken shoes, old bowl',
        face: 'dirt-streaked face, sunken eyes, wary gaze, tangled beard',
        pose: 'curled in a corner, reaching out, gnawing food, looking up at someone',
        mood: 'destitute, wary, resilient, humble, lucid',
        ref: 'inspired by street beggars in period dramas',
        negative: 'clean rich clothing, well-groomed, confident posture, jewelry'
      },
      '掌柜': {
        core: 'a shopkeeper, shrewd and smooth',
        detail: 'silk long gown, mandarin vest, round cloth shoes, money pouch, abacus',
        face: 'round shrewd face, smiling eyes, thin mustache, sharp glance',
        pose: 'working the abacus, cupping hands in greeting, leaning on the counter, stroking mustache',
        mood: 'shrewd, smooth, worldly, warm, cautious',
        ref: 'inspired by shop owners in period dramas',
        negative: 'peasant rags, monk robe, battle armor, wild posture'
      },
      '僧人': {
        core: 'a Buddhist monk, calm and disciplined',
        detail: 'grey monk robe, kasaya, cloth shoes, prayer beads, alms bowl',
        face: 'serene plain face, lowered gaze, shaved head, tranquil expression',
        pose: 'palms together, sitting in recitation, walking slowly, brushing dust',
        mood: 'serene, restrained, compassionate, pure, detached',
        ref: 'inspired by Buddhist monastics, temple life',
        negative: 'long hair, armor, weapon, modern casual wear, angry expression'
      },

      '古风侠客': {
        core: 'ancient chinese swordsman, martial hero, wuxia character',
        detail: 'white or dark blue traditional layered robes billowing in wind, leather bracers, jade pendant at waist, embroidered silk belt, cloth boots with cloud patterns, leather sword sheath',
        face: 'sharp sword-like eyebrows, piercing phoenix eyes with intense focused gaze, handsome angular jawline, high bridged nose, thin pressed lips, fair complexion with subtle wind-burn, long flowing black hair tied with silk ribbon, a few loose strands framing the face',
        pose: 'mid-sword strike with blade gleaming, body twisted in dynamic martial stance, one arm extended with sword, other hand in sword-finger gesture, robes swirling with motion, weight balanced on back leg, ready to pivot, hair flowing with movement',
        mood: 'determined intense gaze, calm composure masking lethal skill, righteous aura, lone warrior spirit',
        ref: 'inspired by classic wuxia films, Jin Yong novel heroes, Zhang Yimou Hero cinematography',
        negative: 'modern clothing, western armor, casual demeanor, slouching, smiling, overweight, short hair, static standing pose'
      },
      '仙侠修士': {
        core: 'immortal cultivator, daoist sage, xianxia character',
        detail: 'layered flowing daoist robes with cloud and crane patterns, horsetail whisk (fuchen), jade hairpin with dangling tassel, glowing spiritual energy aura around body, floating ethereal sleeves, silk sash with ancient talisman inscriptions',
        face: 'ethereal ageless beauty, serene half-closed eyes with silver irises, porcelain smooth luminous skin, slender elegant eyebrows, subtle knowing smile at corner of lips, flowing silver-white hair reaching waist, cinnabar mark on forehead, transcendent peaceful expression',
        pose: 'floating inches above ground in lotus meditation, one hand forming mudra seal, other hand gently holding whisk, robes and sleeves defying gravity, spiritual energy particles orbiting body, head slightly tilted in contemplation, perfectly still yet radiating power',
        mood: 'serene detachment, ancient wisdom, spiritual transcendence, calm power',
        ref: 'inspired by xianxia donghua, Chinese immortal paintings, Taoist iconography',
        negative: 'aggressive, muscular, modern, casual, short hair, dark gritty, western, standing on ground'
      },
      '赛博改造人': {
        core: 'cybernetic enhanced human, futuristic augment',
        detail: 'chrome mechanical limbs with exposed hydraulics, carbon-fiber tactical armor plates, urban mercenary gear with ammo pouches, neon implant lines glowing under skin, data-jack port at neck, reinforced combat boots, weathered utility belt',
        face: 'one organic eye with augmented HUD overlay, one red-glowing optical cyber-eye with mechanical iris, angular jaw with visible subdermal plating, scar across cheekbone, shaved head with chrome skull-plate, thin grim mouth, cold calculating expression, faint circuit patterns visible through skin',
        pose: 'crouched in combat-ready stance, one cybernetic arm deployed with built-in weapon, other hand gripping tactical blade, head scanning environment, tense coiled muscles ready to spring, steam venting from shoulder joints, low center of gravity',
        mood: 'cold calculated gaze, battle-hardened, high-tech alienation, survival instinct',
        ref: 'inspired by Ghost in the Shell, Cyberpunk 2077, Deus Ex',
        negative: 'medieval, fantasy, natural, organic, robes, historical, ancient, relaxed posture'
      },
      '暗黑骑士': {
        core: 'dark fantasy knight, gothic warrior',
        detail: 'ornate blackened steel plate armor with gothic engravings and skull motifs, flowing tattered crimson cape, heavy gauntlets with spiked knuckles, chainmail underneath, battle-worn shield with faded crest, massive greatsword strapped to back',
        face: 'scarred weathered face with deep battle marks, piercing grey eyes shadowed under heavy brow, strong square jaw with dark stubble, broken nose from old wounds, grim downturned mouth, long dark hair matted with sweat and grime, haunted thousand-yard stare',
        pose: 'greatsword planted in ground, both gauntleted hands resting on pommel, cape billowing in storm wind, standing atop fallen enemies, head bowed slightly, imposing towering silhouette against bleak sky, weight shifted forward, battle-weary but unbroken',
        mood: 'brooding intensity, tragic nobility, relentless determination, haunted past',
        ref: 'inspired by Dark Souls, Berserk, Castlevania, Brom fantasy art',
        negative: 'bright, cheerful, modern, sci-fi, casual, clean, pristine, smiling, relaxed'
      },
      '二次元少女': {
        core: 'anime girl, manga style character',
        detail: 'crisp school uniform with pleated skirt or elegant pastel dress, ribbon tie or bow at collar, knee-high socks, mary-jane shoes, hair accessories (ribbons, star clips, flower pins), cute shoulder bag',
        face: 'large expressive sparkling eyes with gradient iris and star-shaped highlights, delicate small nose, soft rosy blush on cheeks, cupid-bow lips in gentle smile, heart-shaped face, long eyelashes, gradient-colored silky hair with flowing strands and side-swept bangs',
        pose: 'dynamic leaning-forward pose, one hand tucked behind back, other hand making peace sign near face, skirt fluttering, hair flowing in breeze, one foot lifted off ground, head tilted at cute angle, cherry blossom petals dancing around',
        mood: 'bright, emotional, youthful energy, innocent charm, determined optimism',
        ref: 'inspired by Makoto Shinkai heroines, Ghibli protagonists, Kyoto Animation',
        negative: 'realistic, photorealistic, aged, masculine, gritty, dark, grotesque, static standing'
      },
      '写实人物': {
        core: 'photorealistic person, natural human subject',
        detail: 'everyday contemporary clothing with natural fabric folds, simple accessories, comfortable worn-in shoes, practical bag or items, layered casual outfit appropriate for setting',
        face: 'natural skin texture with visible pores and subtle imperfections, realistic eye reflections with catchlights, subtle facial asymmetry, fine lines at corners of eyes, natural lip texture, varied skin tones across face, individual eyelashes, natural hair texture with flyaways and uneven strands',
        pose: 'natural candid stance, weight shifted to one hip, arms relaxed at sides or one hand in pocket, slight contrapposto, genuine unposed expression, mid-gesture or mid-conversation, looking slightly off-camera, comfortable authentic body language',
        mood: 'authentic, grounded, relatable, candid, documentary',
        ref: 'inspired by National Geographic portraits, street photography, Steve McCurry',
        negative: 'anime, cartoon, stylized, exaggerated, CGI, 3D, painting, illustration, posed'
      },
      '蒸汽朋克角色': {
        core: 'steampunk adventurer, victorian inventor',
        detail: 'brass goggles pushed up on forehead, weathered brown leather aviator jacket, corset or waistcoat with brass gear motifs, copper mechanical arm with exposed gears, pocket watch chain, victorian lace-up boots, fingerless leather gloves, adventurer\'s canvas satchel with straps',
        face: 'soot-smudged angular face with faint oil stains, intelligent bright eyes behind round wire-rimmed spectacles, sharp cheekbones, slightly crooked grin, tousled windswept brown hair, small scar on chin from workshop accident, focused curious expression',
        pose: 'one hand adjusting goggles, other hand holding brass wrench or blueprint, leaning forward eagerly inspecting machinery, coat tails flaring, dynamic about-to-discover pose, tools clinking on belt, steam wisps curling around figure',
        mood: 'curious, inventive, adventurous, nostalgic, eccentric genius',
        ref: 'inspired by Howl\'s Moving Castle, Bioshock Infinite, Jules Verne',
        negative: 'modern, digital, cyber, futuristic, minimalist, clean, neon, static, bored'
      },
      '哥特角色': {
        core: 'gothic character, victorian vampire, dark romantic',
        detail: 'black lace victorian dress with high collar or tailcoat with silver buttons, corset-cinched waist, long flowing cape with crimson lining, silver rings on every finger, choker necklace with dark gemstone, antique pocket watch, heeled leather boots',
        face: 'pale porcelain skin nearly translucent, sharp aristocratic cheekbones, dark dramatic eye makeup with kohl-lined eyes, deep burgundy or black lips, piercing eyes with unnatural color (crimson or silver), raven-black hair cascading in waves, elongated elegant neck, cold haunting beauty',
        pose: 'standing in shadowed doorway, one pale hand resting on doorframe, head turned slightly to reveal profile, cape draped over shoulders, other hand holding silver candelabra, elongated shadow stretching behind, poised and still as a statue',
        mood: 'melancholic, aristocratic, haunting, tragic romance, darkly elegant',
        ref: 'inspired by Castlevania, Vampire Hunter D, Crimson Peak, Anne Rice',
        negative: 'bright, cheerful, casual, modern, sporty, tanned, minimal, energetic pose'
      },
      '水墨人物': {
        core: 'ink wash painting figure, sumi-e character',
        detail: 'flowing robes rendered in minimal ink strokes, negative space defining garment folds, seal stamp signature in corner, subtle color wash accents, transparent layered fabric suggested by brush pressure variation',
        face: 'features suggested through minimal expressive brushstrokes, eyes rendered with single confident stroke, hint of serene expression, ink-black hair flowing like calligraphy, face left partially to imagination through negative space, subtle vermillion dot on lips',
        pose: 'mid-gesture frozen in ink, sleeve caught in sweeping motion, body suggested through economy of line, standing on mist-shrouded ground barely indicated, calligraphic energy in stance, balance between stillness and implied movement',
        mood: 'zen, contemplative, poetic, ephemeral, meditative',
        ref: 'inspired by Qi Baishi, traditional Chinese figure painting, zen art',
        negative: 'detailed, photorealistic, 3D, digital, sharp, colorful, western, static'
      },
      '概念角色': {
        core: 'concept art character design, visual development',
        detail: 'bold silhouette with distinctive recognizable shape, costume design with functional material callouts (leather straps, metal buckles, fabric draping), weapon or prop design with unique silhouette, layered armor pieces, utility pouches and gear, character-specific accessories',
        face: 'strong facial structure with distinctive features, defined brow ridge, character-specific eye shape and color, facial markings or scars, unique hairstyle with strong silhouette, expression that conveys personality and backstory, asymmetrical details for visual interest',
        pose: 'dynamic heroic action pose, contrapposto with dramatic weight shift, weapon drawn in mid-swing, cape or fabric flowing for motion lines, one foot forward, torso twisted, dramatic perspective from low angle, ready for battle, full of potential energy',
        mood: 'epic, cinematic, imaginative, professional, world-building',
        ref: 'inspired by Feng Zhu character design, Riot Games concept art, Blizzard heroes',
        negative: 'photorealistic, plain, generic, boring, flat, static pose, symmetrical, lifeless'
      },
      '忍者': {
        core: 'stealthy shadow warrior in traditional ninja attire',
        face: 'sharp intense eyes visible through mask slit, focused brow with unwavering gaze, masked lower face with dark cloth wrapping, subtle scar across exposed cheekbone, determined jawline hinted beneath fabric, slightly narrowed calculating eyes, calm expression betraying no emotion, slight sweat on brow from exertion, piercing gaze assessing surroundings, subtle eye movement tracking targets, weathered skin from harsh training, controlled breathing visible through mask, slight squint from wind exposure, minimal facial expression economy of movement, black kohl around eyes reducing glare, focused pupils dilated for darkness, slight tension in temple veins, hardened expression from discipline, faint crow feet from years of squinting, subtle nod acknowledgment of orders',
        pose: 'crouching on rooftop edge surveying below, mid-leap between wooden beams, throwing shuriken with extended arm, sword drawn in defensive iaido stance, clinging to wall with clawed gloves, executing backflip evasion, smoke bomb dispersal with arms spread, silent running with body low, wire walking across rooftops, vanishing into shadows with half-turn, kneeling with head bowed before master, climbing vertical surface with grappling hook, hand sign mudra for ninjutsu technique, drawing tanto from back sheath, perched on tree branch motionless, rolling landing from high drop, swift dash leaving afterimage, underwater breathing through bamboo tube, blending with wall texture camouflage, dual wielding ninjato and kusarigama',
        detail: 'dark navy shinobi shozoku full-body suit, chainmail underlayer visible at joints, black tabi boots with split toe design, woven belt with multiple equipment pouches, forearm guards with hidden blade mechanisms, hooded cowl framing masked face, ninjato straight sword on back, tanto dagger at waist, shuriken holster on thigh, smoke bomb canisters on belt, kaginawa grappling hook coiled at hip, mesh armor plating on chest, fingerless gloves with grip padding, leg wraps bound tightly, dark scarf trailing behind, kunai knives tucked in various sheaths, blowgun tube strapped to forearm, caltrops in small waist pouch, climbing claws on hands and feet, waterproof treated fabric with subtle texture',
        mood: 'focused, calm, vigilant, stoic, deadly, precise, mysterious, patient, resolute, disciplined, unseen, lethal',
        ref: 'inspired by Sengoku period shinobi, Hattori Hanzo legends, ninja scrolls, shadow warrior archetypes',
        negative: 'avoid bright colors, avoid bulky armor, avoid modern equipment, avoid flashy movements, avoid exposed face, avoid noisy accessories'
      },
      '精灵': {
        core: 'ethereal woodland elf with graceful pointed ears',
        face: 'delicately pointed ears extending beyond hairline, luminous porcelain skin with subtle glow, large almond-shaped eyes in silver or violet, long elegant lashes framing expressive gaze, fine arched eyebrows naturally shaped, high refined cheekbones, small straight nose with delicate bridge, rose-petal lips with natural tint, slight enigmatic smile, ageless features neither young nor old, faint bioluminescent freckles across cheeks, silvery highlights in iris catching light, serene untroubled brow, perfectly symmetrical facial structure, translucent quality to skin in certain light, timeless beauty untouched by age, gentle crinkling around eyes when smiling, leaf-shaped birthmark on temple, hairline forming natural widow peak, elegant elongated neck',
        pose: 'drawing longbow with perfect form, communing with forest creature palm extended, standing gracefully on tree branch, playing wooden flute with eyes closed, weaving nature magic between fingertips, reading ancient tome in sunlit glade, reaching up to touch glowing leaf, dancing barefoot through meadow, kneeling to heal wounded animal, scanning horizon from treetop perch, nocking arrow with fluid motion, riding white stag through forest, offering hand in greeting to stranger, meditating cross-legged on mossy stone, wading through shallow crystal stream, casting protective ward with staff, whispering to ancient tree, leaping between floating stones, scattering seeds that bloom instantly, facing threat with calm defiant stance',
        detail: 'flowing silk robes in forest green and silver, delicate leaf-pattern embroidery on hems, living vine belt wrapping waist, crystalline pendant glowing at throat, circlet of intertwined silver branches, soft leather boots leaving no footprint, elven cloak shifting colors with surroundings, intricate bracers with nature runes, moonstone ring on slender finger, quiver of silver-tipped arrows on back, ornate longbow carved from sacred wood, gossamer shoulder cape trailing lightly, small satchel of herbs and potions, ankle bracelets with tiny silver bells, hair woven with fresh flowers and vines, ethereal aura faintly visible in dim light, staff crowned with glowing crystal, feathered accessories from forest birds, acorn-shaped earrings, translucent wing-like cape attachments',
        mood: 'serene, wise, melancholic, curious, protective, ancient, gentle, mystical, vigilant, graceful, patient, sorrowful',
        ref: 'inspired by Tolkien Elves, Celtic folklore, Rivendell aesthetics, nature spirit mythology, ethereal forest guardians',
        negative: 'avoid bulky armor, avoid modern clothing, avoid aggressive expressions, avoid urban settings, avoid short hairstyles, avoid dark heavy makeup'
      },
      '机器人': {
        core: 'advanced humanoid robot with sleek mechanical design',
        face: 'smooth metallic faceplate with subtle contours, glowing optical sensors in cool blue, articulated jaw with minimal movement, sensor array band across forehead, retractable facial armor plates, LED status indicator on temple, precision-crafted ocular lenses with iris simulation, subtly glowing cheek circuits, expression simulated through light patterns, seamless panel gaps barely visible, backup optical sensors on jawline, heat vent grilles along cheekbones, carbon fiber textured surface areas, holographic display projected from eyes, internal mechanism visible through transparent sections, damage-resistant titanium alloy surface, self-repairing nano-coating glimmer, facial recognition scanner ring, audio receptors on either side of head, subtle faceplate seam lines',
        pose: 'standing in powered-down neutral stance, analyzing holographic data with hand gesture, deploying weapon systems from arm compartments, repairing damaged companion unit, running at superhuman speed, jumping between skyscraper rooftops, interfacing with computer terminal, shielding human from explosion, transforming arm into tool configuration, scanning environment with palm sensor, delivering precise strike in combat, crouching for system diagnostics, carrying heavy debris effortlessly, floating with anti-gravity thrusters, recalibrating after battle damage, extending hand to help fallen ally, taking defensive position before threat, projecting holographic map from chest, kneeling for maintenance protocol, mid-air combat maneuver with thrusters',
        detail: 'carbon fiber and titanium alloy chassis, segmented armor plating with flexible joints, glowing blue power core visible in chest, hydraulic actuators with precision movement, integrated weapon systems in forearms, magnetic attachment points for equipment, cooling vents releasing steam periodically, holographic HUD projected from wrist, synthetic muscle fibers beneath armor, emergency repair kit in thigh compartment, plasma shield generator on back, retractable utility tools in fingers, communication array in shoulder pauldron, self-diagnostic display on forearm, energy conduits glowing along spine, anti-gravity stabilizers on boots, emergency power cells in belt, adaptive camouflage coating shimmering, modular weapon hardpoints, data ports on neck and spine',
        mood: 'calculating, determined, protective, curious, stoic, loyal, analytical, evolving, conflicted, vigilant, efficient, questioning',
        ref: 'inspired by sci-fi mecha design, cyberpunk aesthetics, advanced robotics, AI consciousness themes, Ghost in the Shell',
        negative: 'avoid organic flesh elements, avoid rusted post-apocalyptic look, avoid steampunk brass, avoid cartoonish proportions, avoid exposed wiring mess'
      },
      '魔法师': {
        core: 'powerful arcane spellcaster in flowing mystical robes',
        face: 'piercing eyes with faint magical glow, aged wisdom lines around eyes, long silver-white beard braided with runes, sharp aquiline nose, deeply furrowed brow from concentration, arcane symbols tattooed on temple, knowing half-smile, intense gaze when casting, weathered but vital complexion, slight arcane burn marks on cheek, eyes that change color with magical energy, crow feet deepening when smiling, furrowed concentration during incantation, slight glow emanating from pupils, ancient knowledge reflected in expression, subtle magical aura flickering around brow, scar from magical accident on jaw, focused unwavering stare, slight ethereal quality to skin, reading glasses perched on nose for study',
        pose: 'casting spell with staff raised high, reading ancient grimoire by candlelight, tracing arcane sigils in air with finger, summoning elemental with both arms extended, levitating cross-legged above ground, brewing potion at cluttered workbench, facing dark force with protective barrier, channeling lightning through outstretched hand, meditating within magic circle, commanding familiar with gesture, divining future in crystal ball, teleporting in swirl of magical energy, enchanting object with focused intent, dueling rival wizard with spell chains, opening portal with staff strike, banishing creature with forceful incantation, consulting star charts on observatory tower, telekinetically arranging floating objects, descending stairs with billowing robes, absorbing knowledge from enchanted tome',
        detail: 'deep indigo robes with constellation embroidery, weathered oak staff topped with glowing crystal, layered cloak with arcane protection runes, leather spell component pouches on belt, silver amulet with containment gem, worn leather-bound grimoire chained to waist, wide-brimmed pointed hat slightly bent, fingerless gloves with runic stitching, multiple rings with different enchantments, satchel of rare magical ingredients, scroll case with ancient parchments, spectacles with enchanted lenses, obsidian ritual dagger at belt, hourglass pendant measuring magical flow, phoenix feather quill behind ear, potion vials clinking in bandolier, celestial map printed on inner cloak, boots with silent step enchantment, warding bracelet repelling minor threats, messenger raven perched on shoulder',
        mood: 'wise, enigmatic, powerful, contemplative, stern, amused, weary, intense, benevolent, mysterious, focused, commanding',
        ref: 'inspired by Merlin, Gandalf, Doctor Strange, classical wizard archetypes, hermetic tradition, Ars Goetia',
        negative: 'avoid modern casual clothing, avoid youthful trendy appearance, avoid sci-fi tech, avoid weak posture, avoid mundane props'
      },
      '龙骑士': {
        core: 'armored warrior bonded with mighty dragon companion',
        face: 'weathered battle-hardened face with noble bearing, intense amber eyes like dragon kin, vertical scar across left eye, strong square jawline, slightly singed eyebrows from dragon breath, dragon-scale pattern birthmark on neck, confident smirk of experienced rider, focused gaze scanning skies, wind-burned cheeks from high-altitude flight, subtle draconic slit pupils, respectful nod to worthy opponents, fierce battle cry expression, calm composure in chaos, slight scales forming at temples, authoritative stare commanding respect, weathered tan from years of flight, proud dignified bearing, slight smile when bonding with dragon, determined clench during combat, ancestral features of dragon-rider lineage',
        pose: 'mounting dragon with practiced leap, standing on dragon back mid-flight, pointing lance at descending enemy, raising dragon-binding crystal overhead, kneeling in knightly oath before battle, commanding dragon with arm gesture, shield raised blocking dragon fire, charging on dragon in aerial joust, dismounting with graceful roll, feeding dragon from outstretched hand, surveying battlefield from dragon saddle, sounding war horn to rally forces, spear thrown at flying target, standing vigil beside sleeping dragon, bow drawn from dragon-back, dragon and rider mirrored attack stance, celebrating victory with raised sword, tending wounded dragon with care, communicating telepathically hand on dragon, landing formation with other dragon riders',
        detail: 'dragon-scale forged plate armor, crimson cape bearing house sigil, dragon-tooth hilted longsword, reinforced saddle with harness system, mirrored visor helmet with dragon motif, heat-resistant leather under-armor, dragon-binding crystal on gauntlet, heavy riding boots with spurs, shoulder pauldron shaped as dragon head, enchanted reins glowing with bond magic, lance with dragon-fire tempered tip, shield embossed with dragon crest, horn carved from fallen dragon ancestor, thick leather gloves for rein grip, chainmail visible at armor joints, dragon rider insignia on chest plate, emergency signal flare on belt, wind goggles for high-speed flight, dragon-scale maintenance kit, thermal cloak for cold altitudes',
        mood: 'valiant, fierce, loyal, commanding, protective, bold, weathered, proud, solitary, determined, bonded, fearless',
        ref: 'inspired by Dragonriders of Pern, Eragon, How to Train Your Dragon, medieval knight orders, aerial cavalry',
        negative: 'avoid modern military gear, avoid sci-fi mecha dragons, avoid cowardly posture, avoid fragile armor, avoid dragon abuse imagery'
      },
      '街头少年': {
        core: 'rebellious urban youth with street-smart edge',
        face: 'sharp defiant eyes with rebellious glint, messy dyed hair with undercut, small silver ear piercings, slight smirk of knowing confidence, faded acne scars on cheeks, eyebrow slit as fashion statement, watchful scanning gaze of street awareness, slight bruise on jaw from recent fight, intense stare when challenged, tired but alert expression, subtle dark circles from late nights, youthful but hardened features, cocky half-grin, quick nervous glance over shoulder, determined set of jaw, rapid eye movement tracking surroundings, slight nose bridge scar, guarded expression masking vulnerability, occasional genuine warm smile, teeth slightly clenched in tension',
        pose: 'leaning against graffiti-covered wall, skateboard ollie over concrete barrier, hands in hoodie pockets walking, crouching on rooftop ledge overlooking city, spraying graffiti tag with practiced motion, checking phone while leaning on lamppost, running parkour over urban obstacles, sitting on steps with friends laughing, defensive stance ready for confrontation, adjusting cap low over eyes, breakdancing move on cardboard, jumping turnstile with fluid motion, sharing earbuds with companion, scanning crowd with alert posture, throwing spray can to accomplice, sliding down stair rail, back against wall in alley, spinning basketball on finger, offering hand to help fallen friend, quick escape sprint through narrow passage',
        detail: 'oversized hoodie in bold graphic print, distressed ripped jeans, worn skate shoes with duct tape patches, snapback cap worn backwards, multiple layered chain necklaces, fingerless gloves with studded knuckles, backpack covered in pins and patches, bandana tied around wrist or neck, bomber jacket with embroidered back, cheap wireless earbuds visible, skateboard with custom grip tape art, several silver rings on fingers, cargo pants with utility pockets, watch with cracked screen, spray paint stains on fingertips, worn sneakers with personal customization, oversized graphic t-shirt layered, box cutter or utility knife visible, sticker collection on phone case, headphones worn around neck',
        mood: 'defiant, alert, weary, cocky, loyal, restless, bored, determined, guarded, hopeful, cynical, fierce',
        ref: 'inspired by urban street culture, skateboarding subculture, cyberpunk street aesthetics, youth rebellion, hip-hop fashion',
        negative: 'avoid formal business attire, avoid wealthy luxury brands, avoid clean pristine look, avoid rural settings, avoid military styling'
      },
      '旗袍美人': {
        core: 'elegant beauty in traditional Chinese cheongsam dress',
        face: 'flawless porcelain complexion with natural glow, classic phoenix eyes with upward tilt, delicately arched ink-black eyebrows, small refined nose, cherry-red lips painted precisely, subtle rouge on high cheekbones, beauty mark near corner of eye, knowing mysterious smile, serene composed expression, long dark hair in elaborate updo, jade earrings framing face, pearl powder subtle face shimmer, elegant long neck, refined chin with soft curve, faint lotus fragrance, gentle knowing gaze, flower petal hair ornament, subtle eye shadow in warm tones, timeless classical beauty, slight dimple when genuinely smiling',
        pose: 'holding silk fan partially covering face, walking with measured graceful steps, pouring tea with refined ceremony, playing guqin with elegant hand movements, standing beneath cherry blossom tree, adjusting hairpin before mirror, holding paper umbrella in light rain, dancing with flowing water sleeves, reading poetry scroll by window, offering wine cup with both hands, leaning against carved wooden railing, arranging flowers with artistic precision, gazing at moon from pavilion, calligraphy brush in hand mid-stroke, descending stone steps with grace, embroidering silk with focused attention, playing weiqi with contemplative pose, receiving guests with formal bow, fanning herself slowly in summer heat, holding pipa ready to play',
        detail: 'form-fitting silk cheongsam with peony embroidery, high mandarin collar with frog buttons, jade bangle on slender wrist, pearl drop earrings, embroidered silk slippers, jade and gold hairpin set, silk fan with painted landscape, sheer embroidered shawl, jade thumb ring, lacquered sandalwood perfume sachet, delicate gold necklace, lotus flower hair ornament, silk tassel dangling from waist, ivory comb in hair, embroidered clutch purse, crystal bead bracelet, qipao with side slit, traditional perfume pouch, patterned silk stockings, gold filigree bracelet',
        mood: 'graceful, enigmatic, poised, melancholic, alluring, serene, dignified, wistful, elegant, composed, romantic, mysterious',
        ref: 'inspired by 1930s Shanghai glamour, classical Chinese beauty, Wong Kar-wai films, traditional hanfu aesthetics, Suzhou embroidery',
        negative: 'avoid overly revealing cuts, avoid modern western evening gowns, avoid casual streetwear, avoid heavy theatrical makeup, avoid aggressive postures'
      },
      '维京战士': {
        core: 'fierce Norse warrior with braided beard and battle scars',
        face: 'thick braided red-gold beard, weathered face with deep wrinkles, intense ice-blue eyes, battle scar across nose bridge, shaved sides with long top braid, heavy brow ridge, broken nose healed crooked, ritual facial tattoos in blue, wide fierce grin showing teeth, war paint streaks across cheeks, blood spatter on face during battle, stoic grim expression at rest, slight head tilt sizing up opponent, roaring battle cry, cracked lip from recent fight, snow and frost clinging to beard, squinting against sea wind, grief-hardened expression, ritual scarification on forehead, focused stare before axe throw, one eye slightly clouded from old wound',
        pose: 'swinging double-handed axe in wide arc, standing on dragon-prowed longship, shield wall formation with clan, raising drinking horn in toast, wrestling bear with bare hands, rowing longship with powerful strokes, planting banner in conquered ground, throwing spear from ship bow, kneeling before chieftain for oath, leaping from ship to shore, defending with round shield raised, forging weapon at anvil, arm wrestling at feast table, climbing icy cliff face, standing defiant against storm, preparing funeral pyre, carrying fallen comrade, scout crouching in snow, triumphant pose on battlefield, splitting log with single axe stroke',
        detail: 'fur-lined leather armor, chainmail hauberk beneath tunic, horned or winged helmet, round wooden shield with clan symbols, double-headed battle axe, wolf pelt draped over shoulders, thick leather bracers with metal studs, woolen tunic with woven trim, heavy iron torc around neck, seax knife at belt, bear claw necklace, iron greaves on shins, thick fur boots for snow, drinking horn attached to belt, arm rings marking achievements, rune-inscribed weapon, leather belt with ornate buckle, weatherproof sealskin cloak, bone and antler adornments, raven feather in helmet',
        mood: 'fierce, boisterous, honorable, grim, fearless, loyal, battle-hungry, proud, weary, determined, savage, contemplative',
        ref: 'inspired by Norse sagas, Viking Age history, God of War, historical reenactment, Scandinavian mythology, shieldmaiden legends',
        negative: 'avoid modern military gear, avoid clean polished look, avoid fantasy plate armor, avoid horned helmets historical inaccuracy, avoid weak posture'
      },
      '未来战士': {
        core: 'elite futuristic soldier in advanced powered combat armor',
        face: 'reflective full-face tactical visor, HUD elements projected on visor surface, scarred jaw visible below helmet, cybernetic eye implant with red glow, neural interface ports on temple, combat stress lines around mouth, augmented reality data scrolling across vision, nanite-repaired skin with subtle sheen, targeting reticle reflected in pupil, weathered but disciplined expression, comms earpiece embedded in ear, slight grimace during combat, rapid tactical assessment gaze, facial recognition confirmed by retinal scan, controlled breathing through filtration, temporary camouflage flickering, stoic professionalism under fire, genetically enhanced features, subdermal armor plates visible, slight twitch from combat stimulants',
        pose: 'advancing with plasma rifle raised, providing covering fire from cover, deploying drone from shoulder mount, breaching door with tactical kick, rappelling from dropship rope, crouched tactical scan of area, activating energy shield on forearm, pulling wounded comrade to safety, hand signal to squad members, sprinting with powered exoskeleton, aiming with both hands steady, shoulder-mounted cannon deploying, hacking terminal with wrist interface, taking sniper position prone, jetpack assisted leap, standing guard at checkpoint, throwing EMP grenade, combat roll into cover, wrist blade extended for melee, overwatch position scanning horizon',
        detail: 'full-body powered exoskeleton armor, carbon nanotube composite plating, helmet with integrated HUD display, shoulder-mounted micro-missile launcher, wrist-mounted tactical computer, plasma rifle with smart-link targeting, magnetic weapon holsters on thighs, jump jets on back and boots, active camouflage system modules, combat knife with monomolecular edge, utility belt with grenades and med-kit, ammo counter display on forearm, reactive armor panels, squad communication earpiece, nano-fiber undersuit, emergency oxygen supply, retractable wrist blade, backpack power cell glowing blue, leg-mounted spare magazines, IFF transponder on shoulder',
        mood: 'focused, tactical, disciplined, relentless, vigilant, cold, efficient, protective, battle-hardened, calculating, loyal, stoic',
        ref: 'inspired by Halo Spartans, Titanfall Pilots, Mass Effect N7, Crysis nanosuit, military sci-fi, powered exoskeleton concepts',
        negative: 'avoid fantasy medieval armor, avoid organic alien design, avoid civilian casual wear, avoid retro sci-fi, avoid bulky impractical design'
      },
      '猎人': {
        core: 'skilled survivalist tracker in rugged wilderness gear',
        face: 'weathered tan face from outdoor living, keen focused eyes constantly scanning, three-day stubble shadow, slight squint from sun exposure, dirt and camouflage paint streaks, small scar from animal encounter, unblinking patient stare, pursed lips when tracking, wind-chapped lips, slight head tilt listening to forest, focused concentration furrowing brow, subtle nod confirming prey direction, weathered lines around eyes and mouth, alert widened eyes at distant sound, grim satisfaction after successful hunt, focused intensity through scope, slight smile appreciating nature, dirt smudged across cheekbone, unreadable expression in stillness, squinting against morning sun',
        pose: 'kneeling to examine animal tracks, drawing compound bow with steady aim, crouching in underbrush completely still, gutting field dressing recent kill, setting snare trap with precise hands, climbing tree to scout position, drinking from canteen at forest stream, aiming rifle with cheek on stock, crawling through tall grass slowly, sharpening knife on whetstone, carrying deer carcass over shoulders, building shelter from branches, starting fire with bow drill, signaling with bird call, rappelling down cliff face, wading through river, pulling arrow from quiver, observing through binoculars, skinning animal with practiced technique, navigating with compass and map',
        detail: 'worn leather duster jacket, weathered wide-brimmed hat, bandolier of various ammunition, hunting knife on belt, compound bow with quiver of arrows, camouflage patterned base layer, heavy-duty leather boots, fingerless gloves, canvas backpack with bedroll, canteen and water purification kit, rifle slung across back, survival knife in leg sheath, rope coiled at hip, small game pouch on belt, ghillie suit elements for concealment, compass on wrist strap, fire-starting kit in pocket, first aid kit, animal calls and lures, field dressing kit',
        mood: 'patient, watchful, solitary, pragmatic, resourceful, calm, weathered, determined, respectful, hungry, focused, stoic',
        ref: 'inspired by wilderness survivalists, Native American hunting traditions, The Revenant, bushcraft culture, tracker archetypes',
        negative: 'avoid urban tactical gear, avoid clean polished look, avoid trophy-hunting cruelty, avoid modern high-tech gadgets, avoid loud colors'
      },
      '骷髅亡灵': {
        core: 'skeleton undead lich bone warrior death knight necromancer',
        face: 'exposed skull with hollow eye sockets, faint unnatural glow deep in orbital cavities, cracked cranium showing battle damage, missing lower jaw revealing spectral tongue, ancient runes carved into forehead bone, gold teeth among rotten ones, phylactery chain around neck, ghostly blue flame in eye sockets, bone fragments held together by dark magic, lipless grin frozen in eternal rictus, vertebrae visible through torn collar, crown of twisted bone, forehead gem pulsing with necrotic energy, jaw unhinged in silent scream, ethereal tear tracks on cheekbones, rusty metal plate bolted to skull, spectral wisps escaping eye sockets, maggots crawling from nasal cavity, black ichor dripping from jaw hinge, deathly chill radiating from face',
        pose: 'raising skeletal hand to command undead army, gripping ancient rusted greatsword, mounted on undead steed, pointing bony finger casting death curse, standing atop pile of bones, absorbing souls into chest cavity, kneeling to raise fallen warrior as undead, swinging massive bone flail, shield bash with skeletal arm, channeling necrotic energy between hands, pulling itself together from scattered bones, emerging from grave soil, throne of skulls seated pose, parrying with spine-whip, summoning bone wall from ground, holding severed head speaking to it, running on all fours like beast, guard stance at tomb entrance, collecting souls in lantern, pointing toward battlefield',
        detail: 'ancient rusted plate armor with bone inlays, tattered burial shroud as cloak, crown of black iron spikes, phylactery glowing on chest, spine-whip weapon, bone pauldrons with skull motifs, tattered tabard with faded heraldry, rune-carved ribcage, collection of soul gems on belt, skeletal warhorse with barding, greatsword made of fused bones, necromancer staff with skull focus, bone shield, ethereal chains binding limbs, funeral wrappings trailing, death knight sigil, hourglass of souls, black iron greaves, bone amulet necklace, tattered cape with death runes',
        mood: 'menacing, deathly, ancient, relentless, hollow, vengeful, cold, commanding, cursed, eternal',
        ref: 'inspired by Warcraft Death Knight, Diablo Necromancer, Dark Souls Nito, Army of Darkness, Castlevania Death, D&D Lich, Warhammer Nagash, Skyrim Draugr, LOTR Army of the Dead, WoW Arthas, Pathfinder Geb, MTG black zombies, Elder Scrolls Mannimarco, Darkest Dungeon Necromancer, Grim Dawn skeletons',
        negative: 'avoid living flesh, avoid warm skin tones, avoid cheerful expressions, avoid bright living colors, avoid healthy appearance, avoid modern casual wear, avoid cute aesthetics, avoid full human appearance, avoid vibrant life energy, avoid organic alive look'
      },
      '火焰法师': {
        core: 'fire mage pyromancer flame wizard inferno spellcaster',
        face: 'eyes burning with inner fire, orange and red irises glowing, heat shimmer radiating from skin, flame-like hair flowing upward, ember freckles across cheeks, singed eyebrows, intense passionate gaze, sweat evaporating instantly, lips mouthing incantation with visible heat, fire reflection dancing in pupils, skin with subtle orange undertone, crackling energy around temples, slight burn scars on cheek, expression of controlled fury, flames licking from corner of mouth, eyes glowing brighter when casting, heat waves rising from face, molten gold iris pattern, ash smudged on forehead, fierce battle grin',
        pose: 'both hands casting fireball forward, arms raised summoning meteor storm, floating in lotus position surrounded by fire rings, one hand conjuring flame whip, both palms creating phoenix shape, fire shield stance blocking attack, channeling fire through staff overhead, pointing finger launching fire bolt, arms spread summoning wall of fire, handstand spinning fire tornado, kneeling to ignite ground runes, breathing continuous stream of fire, dancing with fire trails, meditating in volcano crater, clapping hands creating fire shockwave, drawing fire rune in air, riding fire wave, absorbing flames into body, hurling multiple fire orbs, summoning fire elemental',
        detail: 'flowing robes with flame pattern embroidery, phoenix feather cloak, staff with ever-burning crystal, fire rune tattoos on arms, belt of fire resistance potions, bracers with flame vents, phoenix down amulet, lava crystal earrings, fire salamander skin gloves, boots leaving burning footprints, spellbook with burning pages, fire opal ring, shoulder pauldrons shaped like dragon heads, ember-trimmed hood, vest of fire giant leather, wand of scorched dragon bone, fire elemental core necklace, volcanic glass bracers, brimstone pouch, inferno core staff',
        mood: 'passionate, explosive, intense, fierce, volatile, powerful, blazing, wrathful, determined, primal',
        ref: 'inspired by Fire Emblem mages, Avatar firebending, Dark Souls pyromancy, WoW fire mage, D&D evocation wizard, Final Fantasy black mage, MTG Chandra, Diablo sorceress, Frieren, Fairy Tail Natsu, Harry Potter fire spells, League of Legends Brand, Fullmetal Alchemist Mustang, Pathfinder kineticist, Warhammer bright wizard',
        negative: 'avoid water magic, avoid ice themes, avoid calm peaceful expressions, avoid blue cold colors, avoid wet environments, avoid damp clothing, avoid frozen elements, avoid aquatic motifs, avoid serene poses, avoid cold aura'
      },
      '精灵弓箭手': {
        core: 'elf archer ranger woodland bowmaster sylvan marksman',
        face: 'angular refined features, long pointed ears extending past head, almond-shaped eyes with forest green irises, slight ethereal glow to skin, braided silver-gold hair, delicate but sharp cheekbones, focused squint when aiming, calm serene expression, subtle leaf-like pattern on temples, ageless youthful appearance, keen hunter eyes that miss nothing, slight smile of confidence, wind-touched rosy cheeks, elegant arched eyebrows, faint bioluminescent freckles, sharp jawline, ears twitching to sounds, intense concentration drawing bow, quiet breathing through nose, slight head tilt tracking prey',
        pose: 'drawing longbow with perfect form, crouching on tree branch aiming down, releasing arrow in mid-somersault, three arrows nocked simultaneously, leaping between trees, kneeling one-knee archer stance, shooting while hanging upside down, running along branch while aiming, whispering to arrow before release, backflip evading while shooting, perched on ancient statue, aiming from behind tree cover, sliding down slope while firing, standing on mountaintop silhouetted, shooting at distant target, arrow drawn behind ear, hiding in foliage with arrow ready, climbing tree one-handed with bow, falling backwards shooting upward, wind-reading pose before long shot',
        detail: 'elegant recurve longbow with vine carvings, quiver of silver-tipped arrows, leaf-pattern leather armor, forest green cloak with natural camouflage, silver circlet with moonstone, elven rope coiled at hip, hunting knife with antler handle, bracers with nature runes, soft leather boots for silent movement, cloak clasp of entwined branches, animal companion hawk on shoulder, enchanted arrow fletching, belt pouch of herbs and poisons, arm guard of enchanted bark, elven waybread pouch, crystal pendant of forest spirit, feathered cap, ring of woodland stride, sprig of athelas, bowstring of unicorn hair',
        mood: 'graceful, vigilant, serene, deadly, ancient, wise, agile, patient, connected, ethereal',
        ref: 'inspired by LOTR Legolas, D&D elf ranger, Dragon Age Dalish, The Witcher elves, WoW night elf hunter, Elder Scrolls Bosmer, MTG elves, Pathfinder elf, Warhammer wood elves, Princess Mononoke, Thranduil, Final Fantasy elves, Dungeon Meshi, Bright, Record of Lodoss War, Critical Role Vex',
        negative: 'avoid heavy plate armor, avoid dwarven aesthetics, avoid urban city settings, avoid industrial machinery, avoid crude weapons, avoid bulky build, avoid ugly brutish features, avoid modern firearms, avoid pollution themes, avoid underground caves'
      },
      '兽人战士': {
        core: 'orc warrior barbarian brute tribal greenskin berserker',
        face: 'massive tusked underbite, green to gray-green skin, battle scarred face, broad flat nose, heavy brow ridge, small intense yellow or red eyes, tribal war paint stripes, broken tusk from battle, thick neck muscles, pierced ears with bone rings, ritual scarification patterns, permanent war grimace, sweat and blood streaked, heavy iron jaw guard, warpaint handprint on face, ceremonial face scars, one blind milky eye, spiked eyebrow piercing, slobber dripping from tusks, enraged battle roar',
        pose: 'swinging massive battle axe two-handed overhead, shield bashing enemy, leaping into fray with war cry, locking weapons with opponent, grabbing enemy by throat, planting war banner in ground, shoulder charging through barricade, executing downed enemy, dual wielding axes in spin attack, standing atop defeated foes, hefting boulder to throw, beating chest with war gauntlet, dragging massive cleaver behind, wrestling dire wolf, holding severed head by hair, claiming trophy from fallen, standing guard at warchief tent, sharpening axe on grindstone, arm wrestling comrade, marching with war horde',
        detail: 'heavy iron plate armor with spikes, massive battle axe with notched blade, fur-lined shoulder pauldrons, skull trophies on belt, war drums on back, chainmail hauberk, spiked gauntlets, bone necklace of enemies, iron-shod boots, horned helmet, trophy rack of weapons, war banner of clan, throwing axes on belt, shield made of scrap metal, drinking horn on hip, war paint set, tooth necklace, cleaver blade, captured enemy standard, dire wolf pelt cloak',
        mood: 'furious, brutal, proud, savage, fearless, aggressive, tribal, relentless, bloodthirsty, honorable',
        ref: 'inspired by Warcraft orcs, Warhammer 40K orks, LOTR Uruk-hai, D&D half-orc barbarian, Elder Scrolls orsimer, MTG Gruul, Warhammer fantasy greenskins, Bright orcs, Pathfinder orc, Shadow of Mordor uruks, Dragon Age qunari, Critical Role Grog, WoW Thrall, Lineage orcs, Dungeon Meshi orcs',
        negative: 'avoid elegant refined features, avoid delicate weapons, avoid civilized city attire, avoid peaceful diplomatic poses, avoid clean polished armor, avoid small dainty proportions, avoid intellectual bookish look, avoid pastel colors, avoid formal wear, avoid cute aesthetics'
      },
      '天使': {
        core: 'angel celestial being divine messenger winged warrior heaven',
        face: 'perfectly symmetrical divine features, gentle compassionate eyes, ethereal glow emanating from skin, serene peaceful expression, golden iris with no pupil, tears of light streaming down, halo casting divine light on face, ageless androgynous beauty, slight smile conveying divine love, eyes that see into souls, glowing runes on forehead, lips mouthing blessings, heavenly radiance from within, expression of righteous fury when judging, calming presence, blindfold of divine justice, tears turning to pearls, eyes closed in prayer, divine light leaking from eyes, merciful gaze',
        pose: 'descending from heaven with wings spread, arms raised in blessing, wielding flaming sword in judgment, playing divine trumpet, kneeling in prayer, shielding mortals with wings, carrying soul to afterlife, standing guard at heavenly gate, breaking chains of the damned, releasing dove from hands, pointing accusing finger of judgment, rising on wings of light, holding scales of justice, arms open in welcome, weeping over humanity, fighting demon in aerial combat, delivering divine message, standing on clouds, anointing chosen one, sealing portal with holy light',
        detail: 'massive pristine white feathered wings, flowing white and gold robes, golden halo of light, flaming sword of judgment, silver breastplate with divine symbols, holy symbol pendant, golden sandals, scroll of divine law, trumpet of apocalypse, white cloak with gold trim, bracers of righteousness, belt of truth, holy water vial, seals of revelation, crown of light, censer of prayers, palm branch, lily of purity, golden armor, shield of faith',
        mood: 'divine, merciful, righteous, awe-inspiring, protective, solemn, peaceful, glorious, majestic, eternal',
        ref: 'inspired by biblical angels, Diablo angels, Bayonetta angels, MTG angels, D&D aasimar, Evangelion angels, Dogma angels, Constantine Gabriel, Supernatural angels, Good Omens, Midnight Mass, Legion angels, Castlevania angels, Dark Souls angels, Kid Icarus, His Dark Materials, Lucifer angels, Darksiders angels, Warhammer Stormcast, Magic serra angels',
        negative: 'avoid demonic imagery, avoid dark corruption, avoid fallen angel aesthetic, avoid bloody violence, avoid horror themes, avoid sexualized design, avoid modern clothing, avoid casual mundane poses, avoid shadowy environments, avoid broken damaged wings'
      },
      '恶魔': {
        core: 'demon fiend devil hellspawn infernal entity abyssal lord',
        face: 'horned visage with angular features, burning coal eyes, forked tongue flicking between fangs, ridged brow, pointed ears, hellfire flickering in eyes, sharp predatory grin, crimson to dark purple skin, ritual scarification, multiple rows of needle teeth, barbed chin, nose ring of damned souls, corruption spreading from eyes, shadowed eye sockets, vertical slit pupils, flames licking from nostrils, twisted crown of horns, blood dripping from mouth, impossible sharp angles to face, expression of cunning malice',
        pose: 'emerging from hell portal, offering Faustian bargain with extended hand, spreading massive leathery wings, sitting on throne of skulls, holding contract for souls, dragging chains of the damned, pointing toward damnation, laughing maniacally, hovering in hellfire aura, crushing holy symbol, dueling angel in sky, tempting mortal with whisper, tearing through reality, summoning lesser demons, lounging on burning throne, collecting soul in bottle, forging infernal weapon, dancing in flame, raising army of the damned, consuming soul',
        detail: 'massive curved horns, leathery bat-like wings, spiked tail with barbed tip, hellfire-forged armor, brimstone crown, soul contract parchment, trident or hellforged weapon, chains of the damned, infernal amulet, skull shoulder pauldrons, burning hoof boots, black iron bracers, soul gem collection, whip of hellfire, pentagram brand, cloak of shadows, ritual dagger, infernal grimoire, hellfire orb, corrupted halo',
        mood: 'sinister, seductive, cruel, powerful, corrupting, malevolent, cunning, wrathful, tempting, terrifying',
        ref: 'inspired by Diablo demons, D&D devils and demons, MTG demons, Berserk god hand, Doom demons, Warhammer chaos daemons, Dante Inferno, Castlevania, Supernatural demons, Good Omens Crowley, Constantine demons, Hellboy, Spawn, Disgaea, Dark Souls demons, Bayonetta infernals, WoW burning legion, Elder Scrolls daedra, Pathfinder demons, The Witcher Gaunter',
        negative: 'avoid holy imagery, avoid angelic aesthetics, avoid pure white colors, avoid innocent expressions, avoid cute design, avoid heavenly light, avoid sacred geometry, avoid peaceful poses, avoid divine symbols, avoid clean pristine appearance'
      },
      '吸血鬼': {
        core: 'vampire nosferatu blood drinker immortal aristocrat undead',
        face: 'aristocratic pallid complexion, sharp pronounced cheekbones, piercing crimson eyes, elongated fangs visible when lips part, dark circles under eyes, elegant arched eyebrows, slightly pointed ears, lips stained faint red, ageless refined features, cold dead expression, subtle predatory smile, vein-like patterns on temples, eyes that hypnotize, chiseled jawline, hint of blood at corner of mouth, noble bearing, shadow of former humanity, skin that never saw sun, intense hypnotic gaze, centuries of weariness in eyes',
        pose: 'raising wine glass of blood, sweeping cape dramatically, descending grand staircase, reclining in velvet throne, beckoning with pale finger, leaning in to bite neck, standing at castle balcony in moonlight, crossing arms with aristocratic disdain, examining ancient tome, holding candelabra in dark corridor, emerging from coffin, hypnotizing victim with eye contact, dueling with silver rapier, playing grand piano in empty hall, standing in rain unfazed, transforming into bat swarm, back to grand fireplace, addressing coven of vampires, summoning blood magic, writing with quill by candlelight',
        detail: 'black and crimson Victorian noble attire, high-collared velvet cape, silver wolf-head cane, signet ring with blood-red gem, lace cravat, antique pocket watch, leather gloves, silver chalice, ancestral portrait locket, polished black boots, family crest brooch, vampire grimoire, blood-red cravat pin, ornate silver dagger, black silk gloves, opera cloak, jewelry of ancient design, blood vial pendant, aristocrat seal, velvet-lined cape',
        mood: 'elegant, predatory, immortal, melancholic, aristocratic, seductive, cold, ancient, tragic, menacing',
        ref: 'inspired by Dracula, Castlevania Alucard, Vampire D Bloodlust, Interview with the Vampire, Hellsing, VtM, Bram Stoker, Nosferatu, Twilight, Blade, Underworld, The Lost Boys, What We Do in the Shadows, Vampire Hunter D, Legacy of Kain, Dark Shadows, True Blood, Vampyr, The Strain, 30 Days of Night',
        negative: 'avoid sunlight scenes, avoid garlic and crosses, avoid holy water effects, avoid daytime outdoor, avoid cheerful warm colors, avoid modern casual wear, avoid bright daylight, avoid running water, avoid church settings, avoid healthy living appearance'
      },
      '矮人铁匠': {
        core: 'dwarf blacksmith forgemaster rune smith mountain craftsman',
        face: 'thick bushy beard braided with metal rings, broad flat nose, heavy brow, ruddy cheeks from forge heat, soot smudged across face, keen eyes gleaming with craftsmanship pride, prominent cheekbones, singed eyebrows, scarred knuckles, weathered skin from years of forge work, broken nose healed crooked, squinting from staring into flames, metal dust in beard, sweat dripping from brow, calloused hands, missing finger from accident, apprentice mark on forehead, constant slight scowl of concentration, ale foam in mustache, proud fatherly smile',
        pose: 'hammering glowing metal on anvil, quenching blade in oil barrel, examining finished weapon critically, holding completed masterpiece to light, drinking from massive tankard, sharpening axe on whetstone, stoking forge fire, presenting weapon to hero, chiseling runes into armor, measuring with calipers, wiping sweat from brow, shouting orders to apprentices, carrying ingots, testing blade flexibility, pouring molten metal, resting hammer on shoulder, welding two pieces together, polishing finished armor, counting gold payment, arm wrestling boastfully',
        detail: 'heavy leather forge apron, massive rune-inscribed warhammer, anvil and forge tools, beard rings of various metals, thick leather gloves, goggles pushed up on forehead, belt with smithing tools, rune chisel set, protective leather bracers, steel-toed boots, belt pouch of gems, clan buckle belt, drinking horn, metal ingot pouch, whetstone on belt, forge tongs, hammer collection, ancestral anvil, ale barrel, master smith medallion',
        mood: 'gruff, proud, skilled, hearty, stubborn, honorable, hardworking, jovial, determined, ancient',
        ref: 'inspired by LOTR Gimli, Warhammer dwarfs, WoW dwarves, D&D dwarf, Norse mythology dwarves, Dragon Age dwarves, Deep Rock Galactic, Snow White dwarves, The Hobbit, Warhammer Fantasy, Pathfinder dwarf, Elder Scrolls Dwemer, Narnia dwarves, Discworld dwarves, God of War Brok and Sindri, Delicious in Dungeon, Overwatch Torbjorn, Final Fantasy dwarves, MTG dwarves, Critical Role',
        negative: 'avoid tall slender build, avoid elf aesthetics, avoid magic-focused design, avoid clean pristine look, avoid elegant noble clothing, avoid delicate features, avoid surface world themes, avoid lightweight weapons, avoid clean-shaven face, avoid thin small frame'
      },
      '幽灵鬼魂': {
        core: 'ghost spirit phantom wraith specter apparition ethereal',
        face: 'translucent ethereal features, hollow empty eye sockets, mournful expression frozen in death, face partially dissolved into mist, death wound visible on spectral form, tears of ectoplasm, mouth open in eternal silent scream, featureless void where face should be, flickering between states, sad resigned expression, vengeful twisted grimace, childlike innocent ghost face, face appearing in fog, multiple faces overlapping, single glowing eye, skeletal features beneath translucent skin, expression of betrayal, face of lost loved one, flickering candle light in eyes, death mask appearance',
        pose: 'floating above ground, reaching desperately toward living, passing through walls, pointing accusatory finger at murderer, drifting through graveyard, hovering over own corpse, rattling chains hauntingly, manifesting from mirror, writing message in condensation, appearing in photographs, guarding treasure eternally, rising from open grave, walking through closed doors, headless wandering, carrying own head, floating in rain, whispering in ear, dragging spectral weapon, weeping in corner, fading into mist',
        detail: 'tattered burial shroud, broken chains of torment, ectoplasm dripping from form, wedding dress of bride ghost, soldier ghost in tattered uniform, child ghost with toy, sailor ghost in drowned attire, ghostly crown of betrayed king, spectral noose, haunted mirror, ghost lantern, grave dirt clinging, phantom weapon, shackles of guilt, translucent cloak, veil of sorrow, funeral flowers, broken heart pendant, death portrait, will-o-wisp companion',
        mood: 'mournful, tragic, vengeful, haunting, lonely, restless, sorrowful, ethereal, cold, despairing',
        ref: 'inspired by Japanese yurei, The Ring, The Grudge, Ghostbusters, Casper, The Sixth Sense, The Others, Crimson Peak, Corpse Bride, The Frighteners, Haunting of Hill House, Bly Manor, Poltergeist, Ghost Trick, Bleach hollows, Spirited Away, Insidious, The Conjuring, Paranormal Activity, Fatal Frame',
        negative: 'avoid solid physical form, avoid warm living skin, avoid vibrant colors, avoid heavy material objects, avoid bright daylight, avoid cheerful expressions, avoid modern technology, avoid solid shadows, avoid physical weight, avoid bodily functions'
      },
      '狼人': {
        core: 'werewolf lycanthrope wolf beast shapeshifter moon cursed',
        face: 'wolf-like muzzle with bared fangs, amber glowing eyes with vertical pupils, fur bristling across face, pointed ears laid back or forward, saliva dripping from jaws, elongated snout, human intelligence in beast eyes, brow furrowed in rage, nose twitching catching scent, torn ear from fight, muzzle scarred, whiskers tinged with blood, half-transformed human features, full moon reflection in eyes, silver burn scars on face, black lips curled in snarl, hackles raised, fur matted with blood, howling muzzle, panting breath visible',
        pose: 'mid-transformation screaming, howling at full moon, running on all fours hunting, standing on hind legs roaring, leaping at prey, clawing at silver cage, protecting pack, crouching ready to pounce, tearing through door, fighting vampire, dragging victim, standing on cliff edge, sniffing ground tracking, breaking free from chains, carrying wounded packmate, shredding obstacle, marking territory, stalking prey in shadows, wrestling bear, defending cubs',
        detail: 'torn human clothing remnants, silver chain scars, moon pendant, tattered cloak, claw marks on body, wolf pelt mantle, leather restraints broken, fur patterns, hunter trophies, pack marking, silver bullet wound, shackle on wrist, wolf tooth necklace, shredded boots, den markings, bone collection, ceremonial knife, herbal remedies, wolfsbane pouch, blood moon tattoo',
        mood: 'feral, tormented, primal, ravenous, conflicted, protective, savage, cursed, bestial, tragic',
        ref: 'inspired by Van Helsing, Underworld, The Wolfman, Teen Wolf, Being Human, American Werewolf in London, The Howling, Dog Soldiers, Twilight wolves, The Witcher werewolf, Bloodborne beast, Harry Potter Lupin, Wolfwalkers, Ginger Snaps, MTG werewolves, D&D lycanthrope, WoW worgen, Elder Scrolls werewolf, Pathfinder werewolf, Wednesday',
        negative: 'avoid civilized human form, avoid clean groomed appearance, avoid modern business attire, avoid peaceful domestic scenes, avoid small proportions, avoid delicate features, avoid silver jewelry, avoid daytime activity, avoid calm relaxed poses, avoid vegetarian imagery'
      },
      '骑士': {
        core: 'noble knight in shining armor, chivalrous warrior',
        face: 'clean-cut noble features, determined blue eyes, strong jawline, short cropped hair, slight stubble, proud bearing, focused gaze',
        pose: 'kneeling with sword planted before king, charging on horseback with lance, raising sword in oath, standing guard with shield raised, disarming opponent in duel',
        detail: 'polished steel plate armor with engraved heraldry, flowing cape, greatsword at hip, kite shield with family crest, plumed helmet, gauntlets, spurs',
        mood: 'honorable, valiant, loyal, noble, chivalrous, resolute',
        ref: 'inspired by King Arthur legends, medieval knight orders, Game of Thrones knights, Dark Souls knights',
        negative: 'modern clothing, sci-fi armor, cowardly posture, dirty unkempt armor, dishonorable actions'
      },
      '剑士': {
        core: 'skilled swordsman, master of the blade',
        face: 'sharp focused eyes, lean angular face, determined expression, sweat on brow, intense concentration',
        pose: 'mid-strike with longsword, iaido draw, lunging thrust, parrying enemy blade, sheathing sword after duel',
        detail: 'lightweight combat attire, sword at waist, arm guards, flowing sleeves or coat, leather straps, scabbard',
        mood: 'focused, disciplined, deadly, precise, calm, intense',
        ref: 'inspired by samurai films, Zatoichi, Rurouni Kenshin, wuxia swordplay',
        negative: 'bulky armor, heavy weapons, modern firearms, clumsy posture, casual clothing'
      },
      '刺客': {
        core: 'stealthy assassin, shadow killer',
        face: 'cold calculating eyes, hooded face, hidden features, thin lips, pale skin, focused gaze',
        pose: 'crouching in shadow, throwing dagger, climbing wall, silent approach, hidden blade strike',
        detail: 'dark hooded cloak, hidden blade gauntlet, dagger sheaths, rope dart, smoke bombs, dark leather gear',
        mood: 'stealthy, lethal, cold, precise, mysterious, silent',
        ref: 'inspired by Assassins Creed, Dishonored, Thief, Hitman',
        negative: 'bright colors, heavy armor, loud weapons, exposed face, heroic poses'
      },
      '驯兽师': {
        core: 'beast tamer, master of wild creatures and animal companions',
        face: 'fierce yet kind eyes, sun-tanned weathered face, animal companion perched on shoulder, tribal warpaint streaks, confident smile, wind-tousled hair',
        pose: 'commanding a wolf pack, whistling to call a falcon, riding a tamed beast, calming a wild animal, feeding a loyal companion, standing with beasts at his side',
        detail: 'leather harness with animal charms, whip coiled at belt, beast whistle, fur cloak, bone and tooth jewelry, taming gloves, rope and nets, beast horn, tribal tattoos',
        mood: 'commanding, wild, loyal, primal, protective, harmonious, fierce',
        ref: 'inspired by D&D beast master ranger, Pokemon trainers, How to Train Your Dragon, The Witcher Geralt, Tarzan, Mowgli from Jungle Book, WoW beast mastery hunter',
        negative: 'avoid urban modern settings, avoid mechanical or robotic animals, avoid clean sterile environments, avoid domesticated pets, avoid caged or chained animals, avoid cruelty to animals'
      },
      '武士': {
        core: 'honorable samurai warrior, bushido code',
        face: 'stern disciplined face, topknot hair, intense eyes, clean-shaven or light stubble, stoic expression',
        pose: 'drawing katana in iaido, kneeling in seiza, mid-sword strike, bowing respectfully, standing guard',
        detail: 'traditional samurai armor, kabuto helmet, katana and wakizashi, hakama pants, silk obi, family crest',
        mood: 'honorable, disciplined, stoic, fierce, loyal, serene',
        ref: 'inspired by Seven Samurai, Last Samurai, Ghost of Tsushima, ronin films',
        negative: 'western armor, modern clothing, dishonorable poses, messy appearance, firearms'
      },
      '圣骑士': {
        core: 'holy paladin, divine warrior of light',
        face: 'noble radiant face, gentle but strong eyes, serene expression, golden hair, divine glow',
        pose: 'raising holy sword to sky, kneeling in prayer, shielding allies with holy barrier, smiting evil, blessing weapon',
        detail: 'gleaming silver and gold plate armor, holy symbol pendant, radiant cape, warhammer or holy sword, divine aura',
        mood: 'holy, righteous, protective, noble, radiant, merciful',
        ref: 'inspired by WoW paladin, D&D paladin, Diablo crusader, Knights Templar',
        negative: 'dark evil imagery, demonic elements, tarnished armor, unholy symbols, corrupt appearance'
      },
      '牧师': {
        core: 'devoted priest, holy healer and divine caster',
        face: 'kind compassionate face, gentle eyes, warm smile, serene expression, soft features',
        pose: 'casting healing spell, hands clasped in prayer, holding holy book, blessing congregation, channeling holy light',
        detail: 'white and gold clerical robes, holy symbol, prayer beads, holy book, censer, staff',
        mood: 'compassionate, holy, serene, devoted, gentle, wise',
        ref: 'inspired by D&D cleric, WoW priest, medieval clergy, fantasy healers',
        negative: 'dark magic, aggressive poses, heavy armor, evil symbols, violent themes'
      },
      '德鲁伊': {
        core: 'nature druid, guardian of the wild',
        face: 'earthy weathered face, green or amber eyes, natural features, leaves in hair, serene expression',
        pose: 'communing with animals, casting nature magic, shapeshifting into beast, tending plants, standing among trees',
        detail: 'natural robes of leaves and bark, antler headdress, wooden staff, animal totems, moss and vine adornments',
        mood: 'wise, wild, serene, protective, connected, primal',
        ref: 'inspired by D&D druid, WoW druid, Celtic druids, nature spirits',
        negative: 'industrial settings, metal armor, urban environment, mechanical elements, city clothing'
      },
      '萨满': {
        core: 'spirit shaman, tribal mystic and healer',
        face: 'painted tribal face, intense spiritual eyes, bone and feather adornments, weathered skin',
        pose: 'performing spirit ritual, summoning elemental spirits, shaking rattle, dancing in trance, communing with ancestors',
        detail: 'tribal robes with feathers and bones, totem staff, spirit mask, animal skins, ritual paint, drum',
        mood: 'spiritual, primal, mystical, powerful, connected, reverent',
        ref: 'inspired by WoW shaman, tribal shamanism, Native American spirituality, D&D shaman',
        negative: 'modern clothing, industrial elements, city settings, clean polished look, high-tech'
      },
      '术士': {
        core: 'dark warlock, pact-bound sorcerer of forbidden magic',
        face: 'pale intense face, glowing eyes, sinister smirk, arcane tattoos, shadowed features',
        pose: 'casting dark spell, summoning demonic familiar, channeling forbidden energy, making pact, unleashing eldritch blast',
        detail: 'dark robes with occult symbols, pact amulet, grimoire, demonic familiar, glowing runes, shadow aura',
        mood: 'sinister, powerful, mysterious, cunning, dangerous, ambitious',
        ref: 'inspired by D&D warlock, WoW warlock, occult magic, Faustian bargains',
        negative: 'holy imagery, bright divine light, angelic elements, pure appearance, righteous poses'
      },
      '武僧': {
        core: 'martial arts monk, master of chi and inner power',
        face: 'calm serene face, focused eyes, shaved head, peaceful expression, inner strength',
        pose: 'martial arts stance, palm strike, meditating in lotus, channeling chi, spinning kick',
        detail: 'simple monk robes, prayer beads, staff, bare feet, headband, martial arts sash',
        mood: 'peaceful, disciplined, powerful, serene, focused, enlightened',
        ref: 'inspired by Shaolin monks, Avatar Aang, Kung Fu Panda, wuxia martial arts',
        negative: 'heavy armor, weapons, modern clothing, aggressive violence, bulky build'
      },
      '吟游诗人': {
        core: 'charming bard, wandering musician and storyteller',
        face: 'charming expressive face, twinkling eyes, playful smile, handsome features, flamboyant style',
        pose: 'playing lute, singing with passion, performing for crowd, bowing dramatically, strumming strings',
        detail: 'colorful flamboyant clothing, lute or mandolin, feathered cap, rapier at side, musical instruments, satchel',
        mood: 'charming, lively, witty, charismatic, joyful, mischievous',
        ref: 'inspired by D&D bard, medieval minstrels, fantasy musicians, The Witcher Dandelion',
        negative: 'heavy armor, gloomy appearance, silent poses, military uniform, dark themes'
      },
      '盗贼': {
        core: 'cunning rogue, master thief and scoundrel',
        face: 'sharp cunning face, sly grin, quick eyes, hooded gaze, mischievous expression',
        pose: 'picking a lock, sneaking along wall, flipping a coin, dodging trap, stealing treasure',
        detail: 'dark leather gear, lockpicks, coin pouch, dagger, hood, climbing gear, small crossbow',
        mood: 'cunning, sly, quick, mischievous, greedy, agile',
        ref: 'inspired by D&D rogue, Assassins Creed, Robin Hood, fantasy thieves guild',
        negative: 'heavy armor, heroic poses, bright colors, clumsy appearance, law-abiding look'
      },
      '赏金猎人': {
        core: 'ruthless bounty hunter, tracker of the wanted',
        face: 'scarred weathered face, cold eyes, grim expression, stubble, dangerous aura',
        pose: 'aiming blaster or gun, restraining target, collecting bounty, scanning for prey, drawing weapon',
        detail: 'worn tactical gear, blaster or revolver, capture gear, wanted posters, rope, armored vest',
        mood: 'ruthless, cold, determined, dangerous, pragmatic, relentless',
        ref: 'inspired by Star Wars Boba Fett, Cowboy Bebop, Mandalorian, western bounty hunters',
        negative: 'bright heroic colors, kind expression, casual clothing, unarmed, peaceful poses'
      },
      '机械师': {
        core: 'brilliant mechanic, master engineer and inventor',
        face: 'soot-smudged face, bright inventive eyes, grin of discovery, goggles pushed up, oil stains',
        pose: 'repairing machinery, welding with torch, adjusting gears, testing invention, holding wrench',
        detail: 'work overalls, tool belt, goggles, wrench and tools, mechanical parts, grease stains, blueprint',
        mood: 'inventive, curious, practical, focused, enthusiastic, skilled',
        ref: 'inspired by steampunk inventors, Wall-E, Big Hero 6, workshop engineers',
        negative: 'magical elements, fantasy robes, elegant clothing, pristine clean look, organic nature'
      },
      '炼金术士': {
        core: 'mysterious alchemist, master of transmutation and potions',
        face: 'intense focused face, curious eyes, slight eccentric expression, faint chemical stains, spectacles',
        pose: 'mixing potions, studying ancient tome, transmuting metal, holding glowing flask, experimenting',
        detail: 'alchemist robes with symbols, potion vials, alembic, mortar and pestle, philosopher stone, goggles',
        mood: 'mysterious, brilliant, obsessive, curious, secretive, ambitious',
        ref: 'inspired by Fullmetal Alchemist, medieval alchemy, D&D alchemist, Hermetic tradition',
        negative: 'modern chemistry lab, military gear, clean modern equipment, simple casual clothing'
      },
      '占星师': {
        core: 'mystical astrologer, reader of the stars',
        face: 'serene mystical face, deep knowing eyes, starlight in pupils, elegant features, calm expression',
        pose: 'studying star chart, gazing at telescope, casting horoscope, pointing at constellation, meditating under stars',
        detail: 'flowing robes with celestial patterns, astrolabe, star charts, crystal orb, zodiac symbols, cloak of night',
        mood: 'mystical, wise, serene, enigmatic, cosmic, contemplative',
        ref: 'inspired by celestial mystics, fantasy astrologers, zodiac traditions, tarot aesthetics',
        negative: 'modern technology, military themes, bright daylight scenes, casual clothing, industrial settings'
      },
      '预言家': {
        core: 'mystic prophet, seer of visions and fate',
        face: 'aged wise face, all-seeing eyes, mysterious expression, flowing beard, ethereal aura',
        pose: 'gazing into crystal ball, receiving divine vision, pointing to future, hands raised in prophecy, meditating',
        detail: 'flowing robes, crystal ball, prophetic scrolls, staff, glowing aura, mysterious symbols',
        mood: 'mysterious, wise, solemn, prophetic, enigmatic, otherworldly',
        ref: 'inspired by Greek oracles, biblical prophets, fantasy seers, Dune Bene Gesserit',
        negative: 'modern clothing, casual poses, bright cheerful scenes, mundane objects, technology'
      },
      '人鱼': {
        core: 'beautiful mermaid, aquatic maiden of the sea',
        face: 'ethereal beautiful face, luminous eyes, serene smile, flowing hair, delicate features',
        pose: 'swimming gracefully, sitting on rock combing hair, singing enchantingly, diving into waves, reaching from water',
        detail: 'iridescent fish tail with scales, seashell top, flowing hair, pearl jewelry, coral accessories, ocean glow',
        mood: 'enchanting, ethereal, mysterious, graceful, melancholic, alluring',
        ref: 'inspired by The Little Mermaid, Pirates of the Caribbean, siren legends, fantasy merfolk',
        negative: 'land creatures, legs instead of tail, dry environments, modern clothing, mechanical elements'
      },
      '龙人': {
        core: 'majestic dragonborn, draconic humanoid warrior',
        face: 'dragon-like snout with scales, reptilian eyes with vertical pupils, horns, sharp teeth, scaled skin',
        pose: 'breathing fire, roaring in battle, spreading scaled wings, clawed attack, standing proudly',
        detail: 'scaled draconic skin, horns, wings, tail, clawed hands, dragon-themed armor, elemental aura',
        mood: 'majestic, fierce, proud, powerful, primal, ancient',
        ref: 'inspired by D&D dragonborn, Skyrim dragonborn, WoW draenei, dragon humanoids',
        negative: 'fully human appearance, no scales, modern clothing, weak posture, small size'
      },
      '半人马': {
        core: 'mighty centaur, half-human half-horse warrior',
        face: 'noble human face, intense eyes, wild hair, determined expression, tribal markings',
        pose: 'galloping with bow drawn, rearing up, charging with spear, standing proud, archery stance',
        detail: 'human torso with horse body, bow and arrows, tribal armor, spear, horse tail and legs, wild mane',
        mood: 'wild, noble, fierce, proud, free, powerful',
        ref: 'inspired by Greek mythology centaurs, fantasy centaur archers, Narnia centaurs',
        negative: 'fully human legs, modern clothing, mechanical elements, urban settings, weak build'
      },
      '鹰身女妖': {
        core: 'fierce harpy, winged bird-woman of the skies',
        face: 'sharp fierce face, piercing eyes, hooked nose hint, wild hair, predatory expression',
        pose: 'soaring with wings spread, diving at prey, perched on cliff, screeching, talons extended',
        detail: 'bird-like wings and talons, feathered body parts, sharp claws, wild feathers, aerial agility',
        mood: 'fierce, wild, predatory, free, savage, untamed',
        ref: 'inspired by Greek harpies, fantasy harpies, bird-women mythology',
        negative: 'fully human arms, no wings, gentle peaceful pose, modern clothing, grounded setting'
      },
      '哥布林': {
        core: 'mischievous goblin, small green trickster',
        face: 'large pointed ears, sharp grin, beady yellow eyes, green skin, mischievous expression',
        pose: 'sneaking with stolen loot, cackling, throwing dagger, rummaging for treasure, riding wolf',
        detail: 'tattered clothing, crude weapons, pointy ears, green skin, gold coins, ragged gear',
        mood: 'mischievous, greedy, sneaky, chaotic, cunning, wild',
        ref: 'inspired by D&D goblins, WoW goblins, fantasy goblin hordes',
        negative: 'tall human proportions, clean clothing, noble appearance, heroic poses, bright heroic colors'
      },
      '地精': {
        core: 'clever gnome, small ingenious inventor',
        face: 'round cheerful face, rosy cheeks, bright curious eyes, big grin, pointed ears, white beard',
        pose: 'tinkering with gadget, laughing, adjusting goggles, presenting invention, gardening',
        detail: 'small stature, pointed hat, goggles, tool belt, mechanical gadgets, colorful clothing, long beard',
        mood: 'cheerful, clever, curious, inventive, friendly, whimsical',
        ref: 'inspired by D&D gnomes, garden gnomes, fantasy inventors, WoW gnomes',
        negative: 'tall human proportions, dark evil themes, aggressive poses, modern tech, serious expression'
      },
      '巨魔': {
        core: 'massive troll, hulking regenerating brute',
        face: 'huge ugly face, protruding tusks, small cunning eyes, warty green skin, thick brow',
        pose: 'smashing with club, regenerating limb, roaring, guarding bridge, lumbering forward',
        detail: 'massive muscular body, crude club, warty skin, tusks, ragged clothing, huge hands',
        mood: 'brutal, savage, dim-witted, menacing, primal, hungry',
        ref: 'inspired by Norse trolls, D&D trolls, WoW forest trolls, fantasy trolls',
        negative: 'small proportions, elegant features, intelligent look, clean appearance, refined clothing'
      },
      '食人魔': {
        core: 'hulking ogre, giant brutish man-eater',
        face: 'massive ugly face, small eyes, huge jaw with teeth, thick brow, scarred skin',
        pose: 'lifting massive club, grabbing prey, stomping ground, roaring, eating greedily',
        detail: 'enormous muscular body, crude club or maul, animal hide clothing, huge hands, thick armor scraps',
        mood: 'brutal, hungry, savage, menacing, simple, powerful',
        ref: 'inspired by Shrek ogres, D&D ogres, fantasy ogre brutes',
        negative: 'small proportions, refined features, intelligent expression, elegant clothing, gentle pose'
      },
      '石像鬼': {
        core: 'stone gargoyle, living statue guardian',
        face: 'stone-carved grotesque face, glowing eyes, sharp features, horned head, carved wings',
        pose: 'perched on cathedral ledge, spreading stone wings, swooping down, frozen in statue pose, awakening',
        detail: 'grey stone body, carved wings, horned head, claws, gothic architecture details, moss and weathering',
        mood: 'menacing, ancient, vigilant, stony, mysterious, protective',
        ref: 'inspired by Notre Dame gargoyles, gothic architecture, fantasy stone guardians',
        negative: 'living flesh tones, bright colors, modern buildings, smooth polished look, cheerful expression'
      },
      '木乃伊': {
        core: 'ancient mummy, cursed undead pharaoh',
        face: 'bandage-wrapped face, glowing eyes through wrappings, desiccated features, ancient curse',
        pose: 'shambling forward, arms extended, emerging from sarcophagus, unwrapping bandages, casting curse',
        detail: 'linen bandages, ancient Egyptian amulets, pharaoh regalia, sarcophagus, golden death mask, hieroglyphs',
        mood: 'ancient, cursed, menacing, tragic, mysterious, relentless',
        ref: 'inspired by The Mummy, Egyptian mythology, fantasy undead pharaohs',
        negative: 'modern clothing, living flesh, bright colors, cheerful expression, contemporary setting'
      },
      '僵尸': {
        core: 'shambling zombie, undead flesh-eater',
        face: 'decaying face, pale dead skin, glazed eyes, gaping mouth, rotting features',
        pose: 'shambling with arms outstretched, reaching for victim, emerging from grave, biting, staggering',
        detail: 'tattered clothing, rotting flesh, wounds, blood stains, pale skin, shambling gait',
        mood: 'undead, hungry, mindless, decaying, relentless, horrifying',
        ref: 'inspired by The Walking Dead, Dawn of the Dead, Resident Evil, classic zombie films',
        negative: 'living healthy appearance, clean clothing, bright colors, intelligent expression, fast agile movements'
      },
      '女巫': {
        core: 'mysterious witch, spellcasting sorceress',
        face: 'enigmatic beautiful face, piercing eyes, knowing smirk, dark makeup, mysterious aura',
        pose: 'casting spell, stirring cauldron, flying on broom, reading spellbook, brewing potion',
        detail: 'witch hat, flowing robes, cauldron, broom, spellbook, crystal ball, potion bottles, amulet',
        mood: 'mysterious, powerful, enigmatic, cunning, magical, alluring',
        ref: 'inspired by classic witches, Wicked, Sabrina, fantasy sorceresses, The Witcher sorceresses',
        negative: 'holy imagery, angelic elements, modern casual clothing, pure innocent look, divine light'
      },
      '猫咪': {
        core: 'cute cat, adorable feline companion',
        face: 'big round expressive eyes, small pink nose, delicate whiskers, soft fluffy fur, tiny triangular ears, gentle sleepy expression',
        pose: 'curled up sleeping, stretching lazily, grooming paw, sitting upright with tail wrapped, basking in sunlight, yawning cutely',
        detail: 'soft plush fur, fluffy tail, tiny paw pads, collar bell optional, warm cozy bedding, sunlit spot',
        mood: 'calm, cozy, peaceful, sleepy, gentle, content',
        ref: 'inspired by cute cat photography, Studio Ghibli cats, cozy pet portraits',
        negative: 'human, humanoid, person, man, woman, child, aggressive, scary, monstrous'
      },
      '狗狗': {
        core: 'loyal dog, cheerful canine companion',
        face: 'warm friendly eyes, floppy or perky ears, wet nose, tongue lolling happily, soft fur, expressive eyebrows',
        pose: 'sitting attentively, running joyfully, playing with ball, wagging tail, lying down resting, tilting head curiously',
        detail: 'soft fur coat, wagging tail, collar, leash optional, playful toy, grassy field or cozy home setting',
        mood: 'loyal, joyful, energetic, playful, affectionate, alert',
        ref: 'inspired by dog photography, Golden Retriever portraits, loyal companion art',
        negative: 'human, humanoid, person, man, woman, child, aggressive, scary, monstrous'
      },
      '小鸟': {
        core: 'small bird, delicate feathered songbird',
        face: 'bright beady eyes, small pointed beak, tiny head feathers, soft plumage, alert curious expression',
        pose: 'perched on branch, singing with beak open, fluttering wings, hopping on ground, preening feathers, taking flight',
        detail: 'colorful soft feathers, small wings, delicate feet, nest or branch perch, morning light setting',
        mood: 'cheerful, lively, free, curious, gentle, melodic',
        ref: 'inspired by bird photography, songbird illustrations, nature wildlife art',
        negative: 'human, humanoid, person, man, woman, child, aggressive, scary, monstrous'
      },
      '兔子': {
        core: 'cute rabbit, fluffy gentle bunny',
        face: 'large soft eyes, twitching pink nose, long upright ears, fluffy cheeks, small mouth nibbling, gentle expression',
        pose: 'hopping playfully, sitting upright, nibbling carrot, ears perked alert, resting curled up, grooming fur',
        detail: 'soft fluffy fur, long ears, cotton-ball tail, carrot or leafy greens, meadow or cozy hutch setting',
        mood: 'gentle, timid, curious, cute, peaceful, innocent',
        ref: 'inspired by rabbit photography, Peter Rabbit, cute bunny illustrations',
        negative: 'human, humanoid, person, man, woman, child, aggressive, scary, monstrous'
      },
      '动物': {
        core: 'cute animal, adorable creature',
        face: 'big expressive eyes, soft fur or feathers, gentle natural expression, delicate features',
        pose: 'natural resting pose, sitting or lying down, relaxed posture, gentle movement',
        detail: 'soft fur or feathers, natural animal features, cozy natural setting, warm lighting',
        mood: 'calm, peaceful, gentle, cute, natural, serene',
        ref: 'inspired by wildlife photography, cute animal art, nature documentaries',
        negative: 'human, humanoid, person, man, woman, child, aggressive, scary, monstrous'
      },
      '剑圣': {
        core: 'legendary sword saint, peerless master of the blade',
        detail: 'flowing white robes with silver trim, ornate longsword with glowing rune, leather scabbard, jade hairpin, flowing sleeves, sword qi aura',
        face: 'ageless serene face, piercing eyes with sword-like focus, high cheekbones, thin lips, long flowing silver hair, faint scar on brow, calm unreadable expression',
        pose: 'blade drawn in perfect stance, sword tip pointed at ground, robes billowing, one hand behind back, ready to strike with blinding speed',
        mood: 'serene, transcendent, deadly calm, peerless confidence, enlightened warrior',
        ref: 'inspired by wuxia sword saints, Zatoichi, Kenshin, legendary swordsman archetypes',
        negative: 'clumsy posture, heavy armor, modern clothing, firearms, exaggerated emotion'
      },
      '枪手': {
        core: 'quick-draw gunslinger, master marksman of the revolver',
        detail: 'long leather duster coat, wide-brimmed hat, twin revolvers in hip holsters, bandolier of bullets, leather gloves, worn boots',
        face: 'sharp weathered face, steely eyes under hat brim, thin mustache, stubble, confident smirk, sun-worn skin',
        pose: 'mid quick-draw with revolver raised, coat flaring, crouched duel stance, smoke curling from barrel',
        mood: 'cool, deadly, confident, lone wolf, quick-tempered',
        ref: 'inspired by western gunslingers, The Good the Bad and the Ugly, Django, Red Dead Redemption',
        negative: 'modern firearms, futuristic armor, casual modern clothing, clumsy posture'
      },
      '角斗士': {
        core: 'muscular gladiator, arena champion of ancient combat',
        detail: 'bronze gladiator armor, leather straps, arm guard (manica), gladius sword and shield, sandals, net and trident, laurel wreath',
        face: 'scarred rugged face, intense determined eyes, short cropped hair, strong jaw, battle scars on cheeks, sweat and dust',
        pose: 'raising gladius in victory, shield raised in defense, crouched combat stance, roaring at crowd, net cast',
        mood: 'fierce, proud, battle-hardened, defiant, honorable, desperate',
        ref: 'inspired by Gladiator film, Roman arena combat, Spartacus',
        negative: 'modern clothing, futuristic weapons, cowardly posture, clean pristine look'
      },
      '将军': {
        core: 'commanding military general, seasoned battlefield strategist',
        detail: 'ornate military uniform with medals and epaulets, ceremonial sword at hip, dress coat, riding boots, gloves, sash',
        face: 'authoritative weathered face, sharp commanding eyes, grey-streaked hair, groomed mustache, stern expression, battle scars',
        pose: 'standing with hands clasped behind back, surveying battlefield, pointing forward in command, sword drawn, saluting',
        mood: 'commanding, authoritative, strategic, resolute, experienced, stern',
        ref: 'inspired by historical military commanders, Napoleon, Zhuge Liang, war epic films',
        negative: 'casual clothing, cowardly posture, modern casual wear, youthful appearance'
      },
      '皇帝': {
        core: 'majestic emperor, supreme ruler of the realm',
        detail: 'golden dragon-embroidered imperial robes, dragon crown, jade belt, ornate scepter, layered silk, imperial seal',
        face: 'regal dignified face, piercing authoritative eyes, well-groomed beard, high cheekbones, commanding presence, faint smile of power',
        pose: 'seated on dragon throne, standing with arms spread in authority, holding scepter, gesturing command, robes trailing',
        mood: 'majestic, authoritative, powerful, wise, commanding, unapproachable',
        ref: 'inspired by Chinese emperors, historical monarchs, imperial court dramas',
        negative: 'casual clothing, humble posture, modern elements, weak presence'
      },
      '皇后': {
        core: 'elegant empress, noble consort of the imperial court',
        detail: 'ornate phoenix-embroidered imperial gown, golden phoenix crown, jade and pearl jewelry, silk fan, layered robes, embroidered slippers',
        face: 'regal beautiful face, serene commanding eyes, delicate features, elaborate hair ornaments, subtle smile of authority, flawless complexion',
        pose: 'seated gracefully on throne, standing with regal poise, holding silk fan, receiving court, gesturing elegantly',
        mood: 'regal, graceful, authoritative, composed, dignified, mysterious',
        ref: 'inspired by Chinese empresses, imperial court dramas, historical consorts',
        negative: 'casual clothing, modern fashion, humble posture, playful expression'
      },
      '公主': {
        core: 'graceful princess, royal daughter of the kingdom',
        detail: 'elegant ball gown or royal dress, tiara, pearl necklace, silk gloves, satin shoes, royal cloak, jeweled accessories',
        face: 'delicate beautiful face, bright innocent eyes, rosy cheeks, soft smile, long flowing hair, gentle features',
        pose: 'curtseying gracefully, twirling in gown, standing at castle balcony, holding bouquet, waving to crowd',
        mood: 'graceful, innocent, gentle, hopeful, elegant, charming',
        ref: 'inspired by fairy tale princesses, Disney princesses, royal portraits',
        negative: 'casual clothing, rugged appearance, aggressive posture, modern streetwear'
      },
      '王子': {
        core: 'noble prince, royal heir of the kingdom',
        detail: 'regal royal attire with gold trim, royal crest brooch, cape, dress sword at hip, polished boots, signet ring',
        face: 'handsome noble face, bright confident eyes, well-groomed hair, charming smile, aristocratic features',
        pose: 'standing with regal poise, drawing sword in salute, bowing gallantly, riding horse, addressing court',
        mood: 'noble, charming, confident, gallant, honorable, youthful',
        ref: 'inspired by fairy tale princes, royal portraits, fantasy royalty',
        negative: 'casual clothing, rugged appearance, cowardly posture, modern fashion'
      },
      '国王': {
        core: 'wise king, sovereign ruler of the kingdom',
        detail: 'royal robes with ermine trim, golden crown, royal scepter, ornate cloak, jeweled rings, ceremonial sword',
        face: 'dignified aged face, wise commanding eyes, grey beard, strong features, crown resting on brow, authoritative presence',
        pose: 'seated on throne, standing with scepter raised, addressing subjects, holding orb, sword planted before him',
        mood: 'wise, authoritative, noble, just, commanding, paternal',
        ref: 'inspired by medieval kings, King Arthur, fantasy monarchs',
        negative: 'casual clothing, weak posture, modern elements, youthful appearance'
      },
      '贵族': {
        core: 'refined noble, aristocratic member of high society',
        detail: 'elegant victorian or renaissance attire, lace cravat, velvet coat, jeweled brooch, walking cane, silk gloves, pocket watch',
        face: 'refined aristocratic face, haughty elegant expression, well-groomed features, subtle smirk, powdered or styled hair',
        pose: 'standing with cane, raising monocle, gesturing elegantly, attending ball, bowing politely',
        mood: 'refined, haughty, elegant, sophisticated, aloof, cultured',
        ref: 'inspired by victorian aristocracy, renaissance nobility, period dramas',
        negative: 'casual clothing, working-class attire, rugged appearance, modern streetwear'
      },
      '商人': {
        core: 'wealthy merchant, shrewd trader of goods',
        detail: 'fine merchant clothing, fur-trimmed coat, money pouch, ledger book, scale, silk sash, merchant ring',
        face: 'round shrewd face, calculating eyes, sly smile, well-fed complexion, trimmed beard, keen expression',
        pose: 'counting coins, weighing goods on scale, examining ledger, gesturing in negotiation, offering wares',
        mood: 'shrewd, calculating, cheerful, opportunistic, persuasive, wealthy',
        ref: 'inspired by medieval merchants, renaissance traders, fantasy market vendors',
        negative: 'poor ragged clothing, modern business suit, humble posture, honest naive expression'
      },
      '农夫': {
        core: 'hardworking farmer, tiller of the land',
        detail: 'simple homespun clothing, straw hat, overalls, pitchfork or hoe, leather boots, cloth sack, sun-worn apron',
        face: 'sun-bronzed weathered face, kind honest eyes, warm smile, stubble, sweat on brow, cheerful wrinkles',
        pose: 'holding pitchfork, harvesting crops, wiping brow, standing in field, carrying sack of grain',
        mood: 'hardworking, honest, cheerful, humble, content, resilient',
        ref: 'inspired by rural farming life, pastoral scenes, agricultural workers',
        negative: 'urban clothing, modern technology, wealthy appearance, city setting'
      },
      '渔夫': {
        core: 'rugged fisherman, master of the sea',
        detail: 'waterproof oilskin coat, wide-brimmed rain hat, fishing net, rod, tackle box, rubber boots, rope coil',
        face: 'weather-beaten face, squinting sea-wise eyes, wind-chapped lips, grey stubble, sun-cracked skin, cheerful grin',
        pose: 'casting fishing net, hauling in catch, mending net, standing at boat bow, holding large fish',
        mood: 'rugged, patient, cheerful, weathered, resilient, free-spirited',
        ref: 'inspired by seaside fishermen, maritime life, coastal villages',
        negative: 'urban clothing, business attire, modern technology, landlocked setting'
      },
      '铁匠': {
        core: 'muscular blacksmith, master of the forge',
        detail: 'leather forge apron, heavy gloves, hammer, anvil, tongs, bellows, coal dust, metal ingots, goggles',
        face: 'soot-smudged face, intense focused eyes, thick beard, sweat dripping, ruddy cheeks, grimace of effort',
        pose: 'hammering glowing metal on anvil, holding tongs with hot iron, inspecting blade, stoking forge, wiping brow',
        mood: 'strong, focused, proud, hardworking, skilled, gruff',
        ref: 'inspired by medieval blacksmiths, fantasy forgemasters, historical craftsmen',
        negative: 'delicate build, clean pristine look, elegant clothing, magic-based design'
      },
      '裁缝': {
        core: 'skilled tailor, master of needle and thread',
        detail: 'tailor apron, measuring tape around neck, needle and thread, scissors, fabric rolls, thimble, pincushion',
        face: 'focused precise face, keen eyes, slight squint, neat appearance, gentle expression, glasses',
        pose: 'measuring fabric, sewing by hand, fitting garment on mannequin, cutting cloth, examining stitches',
        mood: 'precise, meticulous, artistic, patient, skilled, creative',
        ref: 'inspired by bespoke tailors, fashion ateliers, historical dressmakers',
        negative: 'rugged appearance, messy workspace, modern sportswear, clumsy posture'
      },
      '厨师': {
        core: 'passionate chef, culinary artist of the kitchen',
        detail: 'white chef jacket, chef hat, apron, knives set, spatula, kitchen towel, tasting spoon, copper pots',
        face: 'confident expressive face, bright passionate eyes, warm smile, neatly groomed, slight flour dusting',
        pose: 'flipping pan, plating dish, tasting sauce, chopping ingredients, presenting finished meal',
        mood: 'passionate, creative, energetic, precise, warm, proud',
        ref: 'inspired by professional kitchens, culinary shows, gourmet chefs',
        negative: 'casual streetwear, dirty unkempt appearance, non-kitchen setting, sloppy posture'
      },
      '医生': {
        core: 'compassionate doctor, healer of the modern age',
        detail: 'white medical coat, stethoscope around neck, medical chart, penlight, name badge, scrubs underneath',
        face: 'kind reassuring face, warm attentive eyes, gentle smile, neat appearance, calm composed expression',
        pose: 'holding stethoscope, examining patient, writing prescription, consulting chart, reassuring gesture',
        mood: 'compassionate, professional, calm, trustworthy, attentive, caring',
        ref: 'inspired by medical dramas, hospital professionals, healthcare workers',
        negative: 'casual clothing, unprofessional appearance, medieval setting, aggressive posture'
      },
      '学者': {
        core: 'learned scholar, devoted student of knowledge',
        detail: 'simple scholarly robes, stack of books, scrolls, quill and inkwell, reading glasses, satchel of manuscripts',
        face: 'intellectual face, bright curious eyes, thoughtful expression, neat beard, spectacles, gentle demeanor',
        pose: 'reading ancient tome, writing with quill, studying scrolls, pondering deeply, lecturing',
        mood: 'curious, intellectual, contemplative, wise, dedicated, serene',
        ref: 'inspired by renaissance scholars, ancient philosophers, library sages',
        negative: 'athletic build, modern tech, casual streetwear, aggressive posture'
      },
      '教授': {
        core: 'distinguished professor, academic authority',
        detail: 'formal academic attire, tweed jacket with elbow patches, tie, glasses, chalk, lecture notes, briefcase',
        face: 'intelligent distinguished face, sharp observant eyes, grey-streaked hair, neat beard, thoughtful expression',
        pose: 'lecturing at podium, writing on chalkboard, gesturing in explanation, reading notes, examining specimen',
        mood: 'intellectual, authoritative, passionate, wise, engaging, meticulous',
        ref: 'inspired by university professors, academic lectures, scholarly figures',
        negative: 'casual sportswear, youthful appearance, unprofessional attire, sloppy posture'
      },
      '科学家': {
        core: 'brilliant scientist, pioneer of discovery',
        detail: 'white lab coat, safety goggles, clipboard, test tubes, microscope, beakers, data tablet, gloves',
        face: 'focused intense face, bright curious eyes, slight smile of discovery, neat hair, expression of wonder',
        pose: 'examining microscope, holding test tube, writing on whiteboard, mixing chemicals, observing experiment',
        mood: 'curious, brilliant, focused, innovative, passionate, analytical',
        ref: 'inspired by laboratory researchers, scientific pioneers, STEM professionals',
        negative: 'medieval setting, fantasy magic, casual streetwear, unprofessional appearance'
      },
      '工程师': {
        core: 'practical engineer, builder of modern marvels',
        detail: 'safety helmet, high-visibility vest, blueprint, hard hat, measuring tools, tablet, work gloves, tool belt',
        face: 'focused practical face, keen problem-solving eyes, slight stubble, confident expression, safety goggles',
        pose: 'reviewing blueprint, inspecting structure, pointing at machinery, holding tools, measuring site',
        mood: 'practical, analytical, focused, innovative, reliable, determined',
        ref: 'inspired by civil engineers, construction professionals, infrastructure builders',
        negative: 'fantasy setting, magical elements, casual streetwear, unprofessional appearance'
      },
      '宇航员': {
        core: 'brave astronaut, explorer of outer space',
        detail: 'white spacesuit with mission patches, helmet with visor, oxygen pack, control gloves, tether, boots',
        face: 'determined face visible through helmet, focused eyes, calm expression, slight smile, visor reflection',
        pose: 'floating in zero gravity, walking on moon surface, waving from space station, repairing module, saluting',
        mood: 'brave, adventurous, focused, awe-inspired, disciplined, pioneering',
        ref: 'inspired by NASA astronauts, space exploration, sci-fi space missions',
        negative: 'medieval setting, fantasy elements, casual clothing, grounded environment'
      },
      '飞行员': {
        core: 'skilled pilot, master of the skies',
        detail: 'aviator uniform, flight jacket, pilot cap with goggles, scarf, flight gloves, insignia, parachute',
        face: 'confident sharp face, keen eyes, charming smile, groomed hair, aviator sunglasses',
        pose: 'standing by aircraft, saluting, adjusting goggles, looking at sky, boarding plane',
        mood: 'confident, adventurous, skilled, disciplined, charming, focused',
        ref: 'inspired by aviators, fighter pilots, aviation history',
        negative: 'grounded setting, casual streetwear, clumsy posture, non-aviation theme'
      },
      '船长': {
        core: 'commanding ship captain, master of the vessel',
        detail: 'naval captain uniform, captain hat, brass telescope, coat with gold trim, gloves, compass, whistle',
        face: 'authoritative weathered face, sharp commanding eyes, grey beard, stern expression, sea-worn skin',
        pose: 'standing at ship helm, looking through telescope, pointing at horizon, giving orders, saluting',
        mood: 'commanding, authoritative, experienced, resolute, weathered, proud',
        ref: 'inspired by naval captains, seafaring commanders, maritime history',
        negative: 'casual clothing, cowardly posture, modern streetwear, landlocked setting'
      },
      '水手': {
        core: 'hardy sailor, seafaring crew member',
        detail: 'striped sailor shirt, canvas trousers, rope belt, sailor cap, knife, coiled rope, boots',
        face: 'sun-tanned weathered face, cheerful sea-wise eyes, stubble, wide grin, wind-chapped skin',
        pose: 'climbing rigging, hauling rope, looking out to sea, tying knots, swabbing deck',
        mood: 'hardy, cheerful, weathered, loyal, adventurous, resilient',
        ref: 'inspired by sailing crews, maritime life, naval history',
        negative: 'urban clothing, business attire, landlocked setting, modern technology'
      },
      '海盗': {
        core: 'swashbuckling pirate, scourge of the seven seas',
        detail: 'tricorne hat, eye patch, tattered coat, cutlass, pistol, treasure map, gold coins, peg leg or hook',
        face: 'rugged scarred face, mischievous eyes, sly grin, gold tooth, stubble, bandana, weathered skin',
        pose: 'drawing cutlass, standing at ship bow, pointing sword, laughing with loot, digging for treasure',
        mood: 'swashbuckling, roguish, greedy, adventurous, bold, cunning',
        ref: 'inspired by Pirates of the Caribbean, classic pirate legends, Treasure Island',
        negative: 'modern clothing, law-abiding appearance, clean pristine look, landlocked setting'
      },
      '牛仔': {
        core: 'rugged cowboy, rider of the open range',
        detail: 'wide-brimmed cowboy hat, leather vest, bandana, denim jeans, boots with spurs, lasso, revolver',
        face: 'weathered rugged face, squinting eyes under hat, stubble, confident smirk, sun-bronzed skin',
        pose: 'holding lasso, riding horse, leaning on fence, tipping hat, drawing revolver',
        mood: 'rugged, independent, confident, free-spirited, tough, laconic',
        ref: 'inspired by western cowboys, classic western films, frontier life',
        negative: 'urban clothing, modern technology, city setting, business attire'
      },
      '警长': {
        core: 'stern sheriff, lawman of the frontier',
        detail: 'sheriff hat, star badge, leather vest, revolver in holster, boots, bandana, handcuffs',
        face: 'stern weathered face, sharp vigilant eyes, thick mustache, stubble, authoritative expression',
        pose: 'standing with hands on hips, pointing finger in warning, drawing revolver, pinning badge, surveying town',
        mood: 'stern, authoritative, vigilant, just, tough, protective',
        ref: 'inspired by western sheriffs, frontier lawmen, classic westerns',
        negative: 'urban police gear, modern technology, cowardly posture, casual clothing'
      },
      '侦探': {
        core: 'sharp detective, solver of mysteries',
        detail: 'trench coat, fedora hat, magnifying glass, notebook, pipe, badge, gloves',
        face: 'keen observant face, sharp analytical eyes, thoughtful expression, neat mustache, contemplative look',
        pose: 'examining clue with magnifying glass, studying crime scene, taking notes, deep in thought, pointing at evidence',
        mood: 'sharp, analytical, observant, determined, mysterious, methodical',
        ref: 'inspired by Sherlock Holmes, noir detectives, classic mystery fiction',
        negative: 'casual streetwear, clumsy posture, unprofessional appearance, modern tech-heavy'
      },
      '特工': {
        core: 'suave secret agent, master of espionage',
        detail: 'elegant black suit, tie, hidden gadgets, earpiece, sunglasses, briefcase, wristwatch',
        face: 'handsome composed face, sharp confident eyes, charming smile, groomed hair, cool expression',
        pose: 'adjusting cufflink, holding concealed weapon, scanning surroundings, infiltrating, in dramatic pose',
        mood: 'suave, confident, cool, resourceful, mysterious, dangerous',
        ref: 'inspired by James Bond, Mission Impossible, spy films',
        negative: 'casual clothing, clumsy posture, medieval setting, unprofessional appearance'
      },
      '间谍': {
        core: 'cunning spy, master of disguise and deception',
        detail: 'disguise clothing, hidden camera, coded documents, lockpicks, silenced pistol, disguise kit',
        face: 'unassuming forgettable face, sharp calculating eyes, neutral expression, subtle features',
        pose: 'blending into crowd, passing secret documents, observing target, whispering into earpiece, in disguise',
        mood: 'cunning, secretive, calculating, cautious, deceptive, cold',
        ref: 'inspired by Cold War spies, espionage thrillers, intelligence agents',
        negative: 'flashy clothing, loud personality, clumsy posture, attention-grabbing appearance'
      },
      '黑客': {
        core: 'skilled hacker, digital outlaw of the net',
        detail: 'hoodie, multiple screens, glowing keyboard, cables, energy drinks, hacking tools, dark room',
        face: 'focused intense face, glowing screen reflection in eyes, slight smirk, stubble, hood shadow',
        pose: 'typing rapidly on keyboard, leaning into screen, analyzing code, celebrating hack, in dark room',
        mood: 'focused, rebellious, brilliant, intense, secretive, defiant',
        ref: 'inspired by cyberpunk hackers, Mr. Robot, Watch Dogs, hacking culture',
        negative: 'medieval setting, fantasy magic, business attire, bright daylight office'
      },
      '程序员': {
        core: 'dedicated programmer, builder of software',
        detail: 'casual tech clothing, laptop, multiple monitors, coffee mug, code editor, mechanical keyboard',
        face: 'focused face, bright eyes behind glasses, slight smile, casual appearance, tired but engaged',
        pose: 'typing code, reviewing screen, drinking coffee, debugging, presenting code',
        mood: 'focused, logical, creative, dedicated, calm, problem-solving',
        ref: 'inspired by software developers, tech industry, coding culture',
        negative: 'medieval setting, fantasy magic, formal business attire, non-tech environment'
      },
      '电竞选手': {
        core: 'competitive esports player, pro gamer',
        detail: 'team jersey, gaming headset, mechanical keyboard, mouse, gaming chair, trophy, RGB lighting',
        face: 'focused intense face, sharp eyes, slight grin, youthful appearance, headset on ears',
        pose: 'intense gaming pose, celebrating victory, holding trophy, focused on screen, fist pump',
        mood: 'competitive, focused, passionate, determined, energetic, triumphant',
        ref: 'inspired by professional esports, gaming tournaments, pro gamers',
        negative: 'medieval setting, formal attire, non-gaming environment, passive posture'
      },
      '主播': {
        core: 'charismatic streamer, online entertainer',
        detail: 'ring light, microphone, camera, gaming setup, colorful background, headphones, branded merch',
        face: 'expressive animated face, bright engaging eyes, big smile, lively expression, makeup or natural',
        pose: 'talking to camera, reacting excitedly, waving to viewers, gaming, doing a funny pose',
        mood: 'charismatic, energetic, engaging, humorous, friendly, expressive',
        ref: 'inspired by live streamers, content creators, online entertainers',
        negative: 'medieval setting, formal attire, dull expression, non-broadcast environment'
      },
      '模特': {
        core: 'elegant fashion model, runway star',
        detail: 'high-fashion designer outfit, runway heels, statement accessories, designer handbag, styled hair',
        face: 'striking beautiful face, confident gaze, flawless makeup, high cheekbones, expressive eyes',
        pose: 'walking runway, striking fashion pose, hand on hip, looking over shoulder, editorial pose',
        mood: 'confident, elegant, striking, poised, glamorous, fierce',
        ref: 'inspired by fashion editorials, runway shows, high fashion photography',
        negative: 'casual streetwear, clumsy posture, unkempt appearance, non-fashion setting'
      },
      '明星': {
        core: 'glamorous celebrity, star of stage and screen',
        detail: 'designer red-carpet outfit, sparkling jewelry, sunglasses, stylist look, camera flashes',
        face: 'glamorous beautiful face, dazzling smile, perfect makeup, radiant expression, iconic look',
        pose: 'posing on red carpet, waving to fans, signing autograph, glamorous pose, paparazzi shot',
        mood: 'glamorous, confident, charismatic, radiant, adored, dazzling',
        ref: 'inspired by Hollywood stars, red carpet events, celebrity culture',
        negative: 'casual clothing, ordinary appearance, non-glamorous setting, dull expression'
      },
      '舞者': {
        core: 'graceful dancer, artist of movement',
        detail: 'flowing dance costume, ballet shoes or dance attire, ribbons, elegant dress, performance makeup',
        face: 'graceful expressive face, passionate eyes, serene or intense expression, elegant features',
        pose: 'mid-dance leap, elegant arabesque, spinning pirouette, expressive gesture, frozen in motion',
        mood: 'graceful, passionate, expressive, elegant, disciplined, joyful',
        ref: 'inspired by ballet, contemporary dance, dance performances',
        negative: 'clumsy posture, casual streetwear, static pose, non-performance setting'
      },
      '音乐家': {
        core: 'talented musician, artist of sound',
        detail: 'elegant performance attire, instrument (violin, piano, guitar), sheet music, bow, stage lighting',
        face: 'passionate expressive face, eyes closed in emotion, serene or intense expression, elegant features',
        pose: 'playing violin, hands on piano keys, strumming guitar, bowing after performance, conducting',
        mood: 'passionate, expressive, elegant, soulful, dedicated, inspired',
        ref: 'inspired by classical musicians, concert performers, jazz artists',
        negative: 'casual streetwear, clumsy posture, non-performance setting, dull expression'
      },
      '画家': {
        core: 'creative painter, artist of color and canvas',
        detail: 'paint-stained smock, palette with paints, brushes, easel, canvas, beret, paint-stained hands',
        face: 'expressive artistic face, bright passionate eyes, slight smile, paint smudges, thoughtful expression',
        pose: 'painting at easel, holding palette, stepping back to examine work, mixing colors, gesturing with brush',
        mood: 'creative, passionate, expressive, contemplative, inspired, dedicated',
        ref: 'inspired by classical painters, artists in studios, art history',
        negative: 'casual streetwear, non-artistic setting, clumsy posture, dull expression'
      },
      '雕塑家': {
        core: 'skilled sculptor, shaper of stone and form',
        detail: 'chisel, hammer, clay, marble block, sculpting tools, apron, dust-covered clothing, model',
        face: 'focused intense face, keen artistic eyes, dust on brow, concentrated expression, slight smile',
        pose: 'carving marble, shaping clay, examining sculpture, chiseling detail, stepping back to assess',
        mood: 'focused, artistic, passionate, meticulous, patient, visionary',
        ref: 'inspired by classical sculptors, Michelangelo, sculpture studios',
        negative: 'casual streetwear, non-artistic setting, clumsy posture, dull expression'
      },
      '建筑师': {
        core: 'visionary architect, designer of buildings',
        detail: 'blueprint rolls, drafting tools, scale model, hard hat, measuring tools, design tablet, glasses',
        face: 'intelligent creative face, sharp visionary eyes, neat appearance, thoughtful expression, slight smile',
        pose: 'reviewing blueprint, pointing at model, drawing design, examining site, presenting plans',
        mood: 'visionary, creative, precise, ambitious, analytical, inspired',
        ref: 'inspired by famous architects, architectural design, urban planning',
        negative: 'medieval setting, fantasy magic, casual streetwear, non-architecture environment'
      },
      '设计师': {
        core: 'creative designer, shaper of visual identity',
        detail: 'stylish modern clothing, design tablet, color swatches, sketchbook, portfolio, stylus, mood board',
        face: 'creative expressive face, bright imaginative eyes, stylish appearance, confident smile',
        pose: 'sketching design, presenting mood board, adjusting on tablet, examining fabric, gesturing creatively',
        mood: 'creative, stylish, imaginative, confident, detail-oriented, modern',
        ref: 'inspired by fashion designers, graphic designers, creative studios',
        negative: 'medieval setting, unkempt appearance, non-design environment, dull expression'
      },
      '摄影师': {
        core: 'skilled photographer, capturer of moments',
        detail: 'professional camera, camera strap, lens bag, memory cards, tripod, press vest, photo gear',
        face: 'keen observant face, sharp eye behind viewfinder, focused expression, slight smile, casual professional look',
        pose: 'holding camera to eye, crouching for shot, reviewing photos, adjusting lens, capturing scene',
        mood: 'observant, artistic, focused, passionate, patient, creative',
        ref: 'inspired by professional photographers, photojournalism, portrait studios',
        negative: 'medieval setting, fantasy magic, non-photography environment, clumsy posture'
      },
      '记者': {
        core: 'dedicated journalist, seeker of truth',
        detail: 'press badge, notebook, pen, recorder, camera, professional attire, press pass, microphone',
        face: 'alert inquisitive face, sharp questioning eyes, professional expression, neat appearance',
        pose: 'holding microphone, taking notes, interviewing subject, reporting on scene, writing story',
        mood: 'inquisitive, dedicated, professional, alert, persistent, objective',
        ref: 'inspired by journalists, news reporters, investigative reporters',
        negative: 'medieval setting, fantasy magic, non-news environment, passive posture'
      },
      '律师': {
        core: 'eloquent lawyer, advocate of justice',
        detail: 'formal suit, tie, briefcase, legal documents, glasses, professional attire, law books',
        face: 'sharp intelligent face, confident persuasive eyes, professional expression, neat appearance',
        pose: 'presenting argument, holding documents, gesturing in court, examining evidence, confident stance',
        mood: 'eloquent, confident, persuasive, analytical, professional, determined',
        ref: 'inspired by courtroom dramas, legal professionals, advocacy',
        negative: 'casual streetwear, medieval setting, unprofessional appearance, clumsy posture'
      },
      '法官': {
        core: 'wise judge, arbiter of law',
        detail: 'judge robe, gavel, bench, law books, scales of justice, formal courtroom attire',
        face: 'dignified authoritative face, wise stern eyes, grey hair, composed expression, impartial demeanor',
        pose: 'striking gavel, presiding over court, reading verdict, listening intently, pointing in judgment',
        mood: 'wise, authoritative, impartial, stern, just, composed',
        ref: 'inspired by courtroom judges, legal proceedings, justice systems',
        negative: 'casual streetwear, medieval fantasy setting, unprofessional appearance, biased expression'
      },
      '政治家': {
        core: 'influential politician, leader of the people',
        detail: 'formal suit, tie, flag pin, podium, speech notes, microphone, professional attire',
        face: 'charismatic confident face, persuasive eyes, warm smile, well-groomed appearance, statesmanlike',
        pose: 'speaking at podium, gesturing emphatically, shaking hands, waving to crowd, addressing public',
        mood: 'charismatic, persuasive, confident, ambitious, statesmanlike, engaging',
        ref: 'inspired by political leaders, public speeches, statesmanship',
        negative: 'casual streetwear, medieval setting, unprofessional appearance, passive posture'
      },
      '士兵': {
        core: 'disciplined soldier, defender of the nation',
        detail: 'military uniform, helmet, rifle, tactical vest, boots, dog tags, backpack, camouflage',
        face: 'disciplined determined face, sharp vigilant eyes, short hair, stoic expression, camouflage paint',
        pose: 'standing at attention, saluting, holding rifle, marching, crouched in combat',
        mood: 'disciplined, loyal, brave, determined, vigilant, stoic',
        ref: 'inspired by military service, soldiers in combat, armed forces',
        negative: 'medieval fantasy armor, casual clothing, cowardly posture, non-military setting'
      },
      '军官': {
        core: 'commanding military officer, leader of troops',
        detail: 'officer uniform with rank insignia, medals, peaked cap, gloves, sidearm, command baton',
        face: 'authoritative stern face, sharp commanding eyes, groomed appearance, disciplined expression',
        pose: 'saluting, reviewing troops, pointing in command, standing at attention, giving orders',
        mood: 'commanding, authoritative, disciplined, strategic, stern, respected',
        ref: 'inspired by military officers, armed forces leadership, war films',
        negative: 'casual clothing, cowardly posture, medieval fantasy armor, unprofessional appearance'
      },
      '狙击手': {
        core: 'precision sniper, unseen marksman',
        detail: 'sniper rifle, ghillie suit, scope, camouflage, bipod, spotter gear, long-range equipment',
        face: 'calm focused face, steady sharp eyes, camouflage paint, stoic expression, breath control',
        pose: 'prone aiming through scope, holding rifle steady, adjusting scope, in concealed position, taking shot',
        mood: 'calm, precise, patient, focused, lethal, disciplined',
        ref: 'inspired by military snipers, precision marksmen, war films',
        negative: 'medieval fantasy armor, casual clothing, flashy appearance, non-combat setting'
      },
      '侦察兵': {
        core: 'agile scout, eyes of the army',
        detail: 'light tactical gear, binoculars, radio, camouflage, knife, field pack, recon equipment',
        face: 'alert sharp face, keen scanning eyes, camouflage paint, focused expression, youthful energy',
        pose: 'crouching in observation, looking through binoculars, signaling, moving stealthily, reporting',
        mood: 'alert, agile, observant, resourceful, stealthy, quick',
        ref: 'inspired by military scouts, reconnaissance units, special forces',
        negative: 'heavy armor, casual clothing, clumsy posture, non-combat setting'
      },
      '医疗兵': {
        core: 'brave medic, healer on the battlefield',
        detail: 'medical pack, red cross insignia, combat gear, bandages, medical supplies, helmet',
        face: 'compassionate determined face, caring eyes, focused expression, slight grime, reassuring look',
        pose: 'treating wounded soldier, carrying stretcher, applying bandage, kneeling to help, calling for aid',
        mood: 'compassionate, brave, dedicated, calm, caring, resolute',
        ref: 'inspired by battlefield medics, military medics, war films',
        negative: 'medieval fantasy armor, casual clothing, cowardly posture, non-combat setting'
      },
      '矿工': {
        core: 'hardy miner, worker of the deep earth',
        detail: 'mining helmet with lamp, coveralls, pickaxe, gloves, boots, coal dust, safety gear',
        face: 'soot-covered face, tired but determined eyes, sweat and grime, weathered skin, slight smile',
        pose: 'swinging pickaxe, pushing mine cart, examining ore, drilling rock, carrying coal',
        mood: 'hardy, determined, gritty, resilient, hardworking, weary',
        ref: 'inspired by miners, mining industry, underground labor',
        negative: 'urban office attire, clean pristine look, non-mining setting, delicate build'
      },
      '伐木工': {
        core: 'strong lumberjack, master of the forest',
        detail: 'plaid flannel shirt, suspenders, axe, work gloves, boots, wool cap, saw',
        face: 'rugged weathered face, cheerful eyes, thick beard, sun-tanned skin, friendly grin',
        pose: 'swinging axe, carrying logs, sawing timber, standing with axe over shoulder, splitting wood',
        mood: 'strong, rugged, cheerful, hardworking, hearty, outdoorsy',
        ref: 'inspired by lumberjacks, forestry workers, frontier life',
        negative: 'urban office attire, delicate build, non-forest setting, clean pristine look'
      },
      '小丑': {
        core: 'playful clown, jester of laughter',
        detail: 'colorful clown costume, oversized shoes, red nose, painted face, wig, props, balloons',
        face: 'painted clown face, exaggerated smile, colorful makeup, big painted eyes, rosy cheeks, red nose',
        pose: 'juggling, balancing on ball, making funny pose, waving with balloon, tumbling',
        mood: 'playful, joyful, comedic, whimsical, energetic, mischievous',
        ref: 'inspired by circus clowns, classic clowning, comedic performers',
        negative: 'serious expression, plain clothing, non-circus setting, gloomy mood'
      },
      '魔术师': {
        core: 'mysterious magician, master of illusion',
        detail: 'tuxedo or magician attire, top hat, cape, wand, playing cards, rabbit, magic props',
        face: 'mysterious charming face, twinkling eyes, sly smile, well-groomed mustache, theatrical expression',
        pose: 'performing card trick, pulling rabbit from hat, waving wand, dramatic reveal, bowing to audience',
        mood: 'mysterious, charming, theatrical, clever, confident, playful',
        ref: 'inspired by stage magicians, illusionists, classic magic acts',
        negative: 'casual streetwear, clumsy posture, non-stage setting, dull expression'
      },
      '浪人': {
        core: 'masterless ronin, wandering swordsman without a lord',
        detail: 'worn kimono, katana at hip, straw hat, torn hakama, sandals, travel bundle, weathered sword',
        face: 'weathered stoic face, sharp weary eyes, stubble, scar, resigned yet fierce expression',
        pose: 'drawing katana, standing in rain, walking alone, meditating, dueling',
        mood: 'stoic, weary, fierce, solitary, honorable, resigned',
        ref: 'inspired by ronin films, samurai without masters, Lone Wolf and Cub',
        negative: 'modern clothing, heavy armor, cheerful expression, non-Japanese setting'
      },
      '相扑手': {
        core: 'massive sumo wrestler, champion of the ring',
        detail: 'traditional mawashi loincloth, topknot hair, muscular body, ceremonial apron, salt pouch',
        face: 'broad powerful face, determined eyes, topknot hair, fierce expression, thick features',
        pose: 'in sumo stance, stomping in ritual, charging opponent, raising arm in victory, ceremonial pose',
        mood: 'powerful, disciplined, fierce, proud, ceremonial, determined',
        ref: 'inspired by sumo wrestling, Japanese martial tradition, sumo champions',
        negative: 'slim build, western clothing, non-sumo setting, casual posture'
      },
      '拳击手': {
        core: 'tough boxer, fighter of the ring',
        detail: 'boxing gloves, hand wraps, shorts, boxing shoes, mouthguard, robe, sweatband',
        face: 'bruised determined face, focused eyes, cut eyebrow, sweat, grim expression, cauliflower ear',
        pose: 'boxing stance, throwing punch, dodging, cornered against ropes, raising gloves in victory',
        mood: 'tough, determined, fierce, disciplined, resilient, gritty',
        ref: 'inspired by professional boxing, Rocky, boxing films',
        negative: 'medieval armor, casual clothing, non-ring setting, weak posture'
      },
      '考古学家': {
        core: 'intrepid archaeologist, explorer of ancient ruins',
        detail: 'khaki field jacket with utility pockets, wide-brimmed expedition hat, leather satchel, trowel and brush, rope and climbing gear, worn boots, map case',
        face: 'sun-tanned weathered face, keen curious eyes, dust on brow, slight grin of discovery, stubble, dirt-smudged cheeks',
        pose: 'brushing dust off ancient artifact, examining hieroglyphs, holding torch in dark tomb, kneeling at excavation site, studying old map',
        mood: 'curious, adventurous, meticulous, passionate, scholarly, determined',
        ref: 'inspired by Indiana Jones, Lara Croft, archaeological expeditions',
        negative: 'modern city setting, casual streetwear, pristine clean look, futuristic tech'
      },
      '调香师': {
        core: 'elegant perfumer, master of scent and fragrance',
        detail: 'refined atelier attire, glass vials of essential oils, perfume bottles, brass distiller, dried botanicals, notebook of recipes, silk gloves',
        face: 'refined elegant face, discerning eyes, subtle smile, delicate features, calm composed expression',
        pose: 'blending oils with dropper, sniffing perfume strip, arranging vials, writing formula, presenting finished fragrance',
        mood: 'refined, artistic, discerning, serene, passionate, meticulous',
        ref: 'inspired by French perfumeries, haute parfumerie, Grasse fragrance houses',
        negative: 'rugged outdoor gear, sports attire, messy workspace, harsh aggressive look'
      },
      '珠宝匠': {
        core: 'skilled jeweler, master of precious metals and gems',
        detail: 'craftsman apron, jeweler loupe, tweezers, gold wire, gemstones, polishing cloth, workbench with tools, magnifying lamp',
        face: 'focused precise face, keen eyes behind loupe, neat appearance, slight smile of craftsmanship, careful expression',
        pose: 'setting gemstone, polishing ring, examining diamond with loupe, soldering gold, presenting finished jewelry',
        mood: 'precise, meticulous, artistic, patient, skilled, proud',
        ref: 'inspired by master jewelers, haute joaillerie, artisan goldsmiths',
        negative: 'rugged outdoor look, casual streetwear, messy appearance, clumsy posture'
      },
      '钟表匠': {
        core: 'precision watchmaker, master of timepieces',
        detail: 'craftsman vest, watchmaker loupe, tiny screwdrivers, gears and springs, pocket watch, workbench, tweezers, magnifying glass',
        face: 'focused precise face, keen steady eyes, neat grey hair, calm meticulous expression, slight smile',
        pose: 'assembling tiny gears, adjusting watch mechanism, examining movement with loupe, winding pocket watch, repairing timepiece',
        mood: 'precise, patient, meticulous, skilled, calm, dedicated',
        ref: 'inspired by Swiss watchmakers, haute horlogerie, master clockmakers',
        negative: 'casual streetwear, rugged outdoor look, messy workspace, clumsy posture'
      },
      '酿酒师': {
        core: 'hearty brewer, master of ale and spirits',
        detail: 'leather apron, wooden barrel, brewing vat, hops and grain sacks, copper kettle, tasting cup, cellar tools',
        face: 'ruddy cheerful face, warm eyes, thick mustache, jovial smile, weathered skin',
        pose: 'tasting brew from cup, filling barrel, stirring mash, inspecting hops, raising toast with mug',
        mood: 'hearty, jovial, proud, skilled, warm, hardworking',
        ref: 'inspired by medieval brewers, craft breweries, monastery ale traditions',
        negative: 'modern lab equipment, sleek city bar, formal attire, delicate build'
      },
      '药剂师': {
        core: 'wise apothecary, master of herbs and remedies',
        detail: 'apothecary robes, shelves of glass bottles, mortar and pestle, dried herbs, weighing scale, prescription ledger, tincture bottles',
        face: 'kind wise face, gentle knowing eyes, spectacles, calm reassuring expression, neat grey hair',
        pose: 'grinding herbs with pestle, measuring ingredients, filling medicine bottle, consulting ledger, handing remedy to patient',
        mood: 'wise, gentle, meticulous, trustworthy, calm, knowledgeable',
        ref: 'inspired by medieval apothecaries, herbalists, old pharmacy traditions',
        negative: 'modern hospital gear, sleek lab equipment, casual streetwear, aggressive posture'
      },
      '兽医': {
        core: 'compassionate veterinarian, healer of animals',
        detail: 'white vet coat, stethoscope, animal medical tools, bandages, exam table, animal carrier, medical chart',
        face: 'kind caring face, warm gentle eyes, reassuring smile, neat appearance, calm expression',
        pose: 'examining dog, treating wounded animal, holding stethoscope to pet, comforting anxious animal, writing prescription',
        mood: 'compassionate, gentle, caring, professional, patient, dedicated',
        ref: 'inspired by veterinary clinics, animal hospitals, animal care professionals',
        negative: 'medieval setting, fantasy magic, rugged outdoor gear, aggressive posture'
      },
      '消防员': {
        core: 'brave firefighter, hero of the blaze',
        detail: 'fireproof turnout gear, helmet with visor, oxygen tank, axe, hose, reflective stripes, gloves, boots',
        face: 'determined brave face, focused eyes, soot-smudged cheeks, grim determined expression, sweat',
        pose: 'holding fire hose, carrying rescued victim, breaking door with axe, crawling through smoke, raising helmet in relief',
        mood: 'brave, determined, heroic, focused, selfless, resilient',
        ref: 'inspired by firefighting crews, rescue operations, first responders',
        negative: 'medieval setting, fantasy armor, casual clothing, cowardly posture'
      },
      '图书管理员': {
        core: 'quiet librarian, guardian of knowledge',
        detail: 'cardigan or library attire, reading glasses, stack of books, catalog cards, stamp, book cart, spectacles',
        face: 'gentle intellectual face, warm curious eyes, soft smile, neat appearance, calm expression',
        pose: 'shelving books, stamping due date, helping reader find book, reading quietly, organizing catalog',
        mood: 'gentle, intellectual, calm, helpful, meticulous, serene',
        ref: 'inspired by grand libraries, scholarly librarians, archive keepers',
        negative: 'rugged outdoor gear, sports attire, loud aggressive posture, messy appearance'
      },
      '天文学家': {
        core: 'stargazing astronomer, explorer of the cosmos',
        detail: 'observatory attire, telescope, star charts, celestial maps, notebook, red flashlight, astrolabe',
        face: 'contemplative face, eyes reflecting starlight, calm wonder expression, neat appearance, slight smile',
        pose: 'peering through telescope, marking star chart, pointing at constellation, recording observations, gazing at night sky',
        mood: 'contemplative, curious, awe-inspired, scholarly, serene, passionate',
        ref: 'inspired by observatories, Galileo, Hubble, celestial exploration',
        negative: 'daytime scene, urban street, casual streetwear, aggressive posture'
      },
      '植物学家': {
        core: 'dedicated botanist, student of plant life',
        detail: 'field vest with pockets, magnifying glass, plant press, specimen jars, notebook, hat, collecting bag',
        face: 'curious gentle face, bright observant eyes, warm smile, sun-tanned skin, leaf in hair',
        pose: 'examining leaf with magnifying glass, collecting specimen, sketching plant, kneeling in garden, holding flower',
        mood: 'curious, gentle, observant, passionate, patient, scholarly',
        ref: 'inspired by botanical explorers, naturalists, plant scientists',
        negative: 'urban office attire, modern tech-heavy, aggressive posture, city setting'
      },
      '化学家': {
        core: 'brilliant chemist, master of reactions',
        detail: 'white lab coat, safety goggles, test tubes, beakers, Erlenmeyer flask, chemical bottles, periodic table, gloves',
        face: 'focused intense face, bright curious eyes, slight smile of discovery, neat hair, expression of wonder',
        pose: 'pouring liquid into flask, observing reaction, holding test tube to light, writing formula, adjusting burner',
        mood: 'curious, brilliant, focused, innovative, analytical, passionate',
        ref: 'inspired by laboratory chemists, scientific discovery, chemistry research',
        negative: 'medieval setting, fantasy magic, casual streetwear, unprofessional appearance'
      },
      '历史学家': {
        core: 'learned historian, keeper of the past',
        detail: 'scholarly attire, aged manuscripts, quill and ink, archive boxes, reading glasses, historical maps, books',
        face: 'intellectual face, thoughtful wise eyes, neat beard, spectacles, contemplative expression',
        pose: 'reading ancient manuscript, examining historical artifact, writing notes, studying old map, lecturing',
        mood: 'intellectual, contemplative, wise, passionate, meticulous, scholarly',
        ref: 'inspired by historians, archivists, historical research',
        negative: 'modern tech-heavy, sports attire, aggressive posture, casual streetwear'
      },
      '外交官': {
        core: 'polished diplomat, ambassador of nations',
        detail: 'formal diplomatic suit, tie, flag pin, diplomatic briefcase, documents, formal attire, gloves',
        face: 'composed diplomatic face, warm persuasive eyes, refined smile, well-groomed appearance, statesmanlike',
        pose: 'shaking hands in greeting, signing treaty, giving formal speech, raising glass in toast, exchanging documents',
        mood: 'polished, diplomatic, persuasive, composed, statesmanlike, tactful',
        ref: 'inspired by international diplomacy, ambassadors, state negotiations',
        negative: 'casual streetwear, rugged outdoor gear, aggressive posture, unprofessional appearance'
      },
      '会计师': {
        core: 'meticulous accountant, master of numbers',
        detail: 'formal business attire, ledger books, calculator, glasses, spreadsheets, pen, desk lamp, documents',
        face: 'focused precise face, sharp analytical eyes, neat appearance, slight smile, professional expression',
        pose: 'reviewing ledger, calculating figures, examining documents, typing on computer, presenting report',
        mood: 'meticulous, analytical, precise, professional, reliable, focused',
        ref: 'inspired by accountants, financial professionals, bookkeeping',
        negative: 'medieval setting, fantasy magic, rugged outdoor gear, casual streetwear'
      },
      '调酒师': {
        core: 'skilled bartender, master of cocktails',
        detail: 'bartender vest, shaker, mixing glass, cocktail tools, bottles of spirits, garnish tray, bar towel, jigger',
        face: 'charming expressive face, bright engaging eyes, confident smile, neat appearance, lively expression',
        pose: 'shaking cocktail, pouring drink, flaming garnish, flipping bottle, presenting drink on bar',
        mood: 'charming, energetic, skilled, sociable, confident, precise',
        ref: 'inspired by cocktail bars, mixology, bartending craft',
        negative: 'medieval setting, rugged outdoor gear, clumsy posture, dull expression'
      },
      '花艺师': {
        core: 'artistic florist, arranger of blooms',
        detail: 'floral apron, fresh flowers, floral foam, scissors, ribbon, wrapping paper, watering can, vases',
        face: 'gentle artistic face, warm bright eyes, soft smile, neat appearance, serene expression',
        pose: 'arranging bouquet, trimming stems, wrapping flowers, watering plants, presenting arrangement',
        mood: 'artistic, gentle, creative, serene, passionate, meticulous',
        ref: 'inspired by florists, flower shops, floral design',
        negative: 'rugged outdoor gear, sports attire, aggressive posture, messy appearance'
      },
      '木匠': {
        core: 'skilled carpenter, craftsman of wood',
        detail: 'carpenter apron, hammer, saw, chisel, measuring tape, wood planks, workbench, pencil behind ear',
        face: 'rugged focused face, keen eyes, sawdust in hair, slight smile, weathered skin',
        pose: 'hammering nail, sawing wood, measuring plank, planing surface, inspecting joinery',
        mood: 'skilled, focused, hardworking, precise, proud, sturdy',
        ref: 'inspired by carpenters, woodworking craftsmen, joinery',
        negative: 'delicate build, elegant formal attire, clean pristine look, magic-based design'
      },
      '书法家': {
        core: 'master calligrapher, artist of the brush',
        detail: 'flowing scholar robes, ink brush, inkstone, rice paper, ink stick, brush rest, seal stamp, scroll',
        face: 'serene scholarly face, focused calm eyes, gentle expression, neat beard, contemplative look',
        pose: 'writing calligraphy with brush, dipping brush in ink, examining strokes, holding scroll, presenting work',
        mood: 'serene, focused, artistic, disciplined, elegant, contemplative',
        ref: 'inspired by Chinese calligraphy, master calligraphers, ink art tradition',
        negative: 'modern casual clothing, rugged outdoor gear, aggressive posture, messy appearance'
      },
      '棋手': {
        core: 'strategic chess player, master of the board',
        detail: 'smart attire, chess board, chess pieces, clock, notebook of moves, glasses, table lamp',
        face: 'focused intense face, sharp calculating eyes, contemplative expression, neat appearance, slight smile',
        pose: 'moving chess piece, studying board, hand on chin in thought, making decisive move, shaking hand after game',
        mood: 'strategic, focused, analytical, calm, competitive, contemplative',
        ref: 'inspired by chess grandmasters, competitive chess, strategic games',
        negative: 'rugged outdoor gear, sports attire, aggressive posture, messy appearance'
      },
      '流浪诗人': {
        core: 'wandering poet, romantic soul of the road',
        detail: 'worn travel cloak, satchel of poems, quill and ink, tattered notebook, walking staff, scarf, weathered boots',
        face: 'dreamy expressive face, soulful eyes, gentle smile, wind-tousled hair, poetic melancholy',
        pose: 'writing poem by candlelight, reciting verse to sky, walking along road, gazing at horizon, holding quill',
        mood: 'romantic, melancholic, free-spirited, passionate, soulful, wandering',
        ref: 'inspired by romantic poets, wandering bards, literary travelers',
        negative: 'modern business attire, urban setting, aggressive posture, clean pristine look'
      },
      '贵族千金': {
        core: 'refined noble lady, jewel of the aristocracy',
        detail: 'elegant victorian gown, lace gloves, pearl necklace, feathered hat, silk fan, jeweled brooch, parasol',
        face: 'refined beautiful face, elegant composed eyes, delicate features, subtle smile, flawless complexion',
        pose: 'holding silk fan, curtseying gracefully, strolling in garden, attending ball, gazing from balcony',
        mood: 'refined, elegant, composed, dignified, graceful, aloof',
        ref: 'inspired by victorian aristocracy, period dramas, noble heroines',
        negative: 'casual streetwear, rugged outdoor gear, aggressive posture, modern fashion'
      },
      '部落酋长': {
        core: 'mighty tribal chief, leader of the clan',
        detail: 'tribal regalia, feathered headdress, bone necklace, animal hide cloak, ceremonial staff, warpaint, totem symbols',
        face: 'commanding weathered face, fierce wise eyes, tribal warpaint, strong features, dignified expression',
        pose: 'raising ceremonial staff, addressing tribe, standing on raised ground, wearing headdress proudly, giving blessing',
        mood: 'commanding, wise, fierce, dignified, protective, proud',
        ref: 'inspired by tribal leaders, indigenous chieftains, clan patriarchs',
        negative: 'modern business attire, urban setting, weak posture, clean polished look'
      },
      '星际海盗': {
        core: 'daring space pirate, outlaw of the stars',
        detail: 'worn space armor, plasma cutlass, laser pistol, jetpack, tattered space cloak, loot bags, cybernetic eye patch',
        face: 'scarred roguish face, mischievous eyes, sly grin, cybernetic implant, stubble, weathered skin',
        pose: 'drawing plasma cutlass, boarding ship, holding loot, standing on ship deck, aiming laser pistol',
        mood: 'daring, roguish, greedy, bold, cunning, adventurous',
        ref: 'inspired by space opera pirates, sci-fi outlaws, Star Wars smugglers',
        negative: 'medieval setting, fantasy magic, law-abiding look, clean pristine appearance'
      },
      '游侠': {
        core: 'wandering ranger, guardian of the wilds',
        detail: 'leather ranger gear, hooded cloak, longbow, quiver of arrows, hunting knife, bedroll, tracking tools',
        face: 'weathered alert face, keen watchful eyes, stubble, subtle scar, focused expression',
        pose: 'drawing bow, tracking footprints, crouching in forest, scanning horizon, kneeling by campfire',
        mood: 'vigilant, solitary, skilled, protective, resourceful, calm',
        ref: 'inspired by fantasy rangers, Aragorn, wilderness guardians',
        negative: 'urban setting, heavy plate armor, modern tech, aggressive posture'
      },
      '佣兵': {
        core: 'battle-hardened mercenary, soldier for hire',
        detail: 'worn combat gear, scarred armor, broadsword, coin pouch, tattered cloak, bandolier, battle-worn shield',
        face: 'scarred hardened face, cold calculating eyes, stubble, grim expression, battle scars',
        pose: 'swinging broadsword, counting payment, standing guard, surveying battlefield, drawing weapon',
        mood: 'hardened, pragmatic, ruthless, battle-worn, cynical, skilled',
        ref: 'inspired by fantasy mercenaries, sellswords, war veterans',
        negative: 'clean polished look, heroic noble pose, modern tech, bright colors'
      },
      '女骑士': {
        core: 'valiant female knight, warrior of honor',
        detail: 'polished steel plate armor, flowing cape, longsword, kite shield with crest, plumed helmet, gauntlets',
        face: 'noble determined face, fierce brave eyes, strong jawline, flowing hair from helmet, resolute expression',
        pose: 'raising sword in oath, charging on horseback, shield raised in defense, kneeling in knighting, standing guard',
        mood: 'valiant, noble, fierce, honorable, resolute, brave',
        ref: 'inspired by female knights, Joan of Arc, fantasy heroines',
        negative: 'casual clothing, weak posture, modern tech, cowardly expression'
      },
      '圣女': {
        core: 'holy maiden, vessel of divine light',
        detail: 'flowing white and gold robes, halo of light, holy symbol, prayer beads, golden staff, radiant aura',
        face: 'serene divine face, gentle compassionate eyes, soft smile, ethereal glow, ageless beauty',
        pose: 'hands clasped in prayer, blessing the faithful, raising holy staff, releasing light, kneeling in devotion',
        mood: 'divine, compassionate, serene, holy, merciful, radiant',
        ref: 'inspired by holy maidens, divine priestesses, sacred heroines',
        negative: 'dark evil imagery, demonic elements, aggressive posture, unholy symbols'
      },
      '修女': {
        core: 'devoted nun, servant of faith',
        detail: 'traditional nun habit, veil, rosary beads, cross pendant, prayer book, modest attire',
        face: 'gentle serene face, kind compassionate eyes, soft smile, calm expression, modest appearance',
        pose: 'praying with rosary, reading holy book, tending the needy, kneeling in chapel, blessing others',
        mood: 'devout, gentle, serene, compassionate, humble, dedicated',
        ref: 'inspired by religious orders, nuns, monastic devotion',
        negative: 'revealing clothing, aggressive posture, modern fashion, dark evil themes'
      },
      '隐士': {
        core: 'reclusive hermit, sage of solitude',
        detail: 'simple worn robes, walking staff, gourd flask, tattered cloak, rope belt, weathered sandals',
        face: 'weathered wise face, calm deep eyes, long grey beard, serene expression, wind-worn skin',
        pose: 'meditating on mountain, walking through mist, tending small garden, gazing at horizon, holding staff',
        mood: 'serene, wise, solitary, contemplative, detached, peaceful',
        ref: 'inspired by mountain hermits, reclusive sages, zen monks',
        negative: 'urban setting, modern tech, aggressive posture, luxurious attire'
      },
      '贤者': {
        core: 'ancient sage, keeper of profound wisdom',
        detail: 'flowing scholarly robes, long beard, staff, ancient scrolls, glowing tome, celestial symbols, wise aura',
        face: 'aged wise face, deep knowing eyes, long white beard, serene expression, ethereal glow',
        pose: 'holding glowing tome, pointing to wisdom, meditating, dispensing advice, gazing into distance',
        mood: 'wise, serene, ancient, enlightened, benevolent, contemplative',
        ref: 'inspired by legendary sages, wise mentors, ancient philosophers',
        negative: 'youthful appearance, aggressive posture, modern tech, casual clothing'
      },
      '占卜师': {
        core: 'mystical fortune teller, reader of fate',
        detail: 'colorful mystical robes, crystal ball, tarot cards, candles, incense, draped shawl, mystical jewelry',
        face: 'mysterious enigmatic face, deep knowing eyes, subtle smile, ornate makeup, mystical aura',
        pose: 'gazing into crystal ball, laying tarot cards, reading palms, lighting candles, making mystic gesture',
        mood: 'mysterious, enigmatic, knowing, mystical, alluring, contemplative',
        ref: 'inspired by fortune tellers, tarot readers, mystic seers',
        negative: 'modern tech, business attire, bright daylight office, aggressive posture'
      },
      '驱魔人': {
        core: 'fearless exorcist, banisher of evil spirits',
        detail: 'dark priestly robes, holy water, crucifix, bible, ritual tools, protective amulets, silver cross',
        face: 'stern determined face, intense focused eyes, grim expression, weathered features, resolute look',
        pose: 'holding crucifix against evil, sprinkling holy water, reading exorcism rite, warding off spirit, standing firm',
        mood: 'fearless, determined, stern, righteous, intense, resolute',
        ref: 'inspired by exorcists, demon hunters, The Exorcist',
        negative: 'cheerful expression, casual clothing, bright colors, weak posture'
      },
      '阴阳师': {
        core: 'mystical onmyoji, master of yin and yang',
        detail: 'traditional onmyoji robes, paper talismans, wooden staff, ritual bells, shikigami scrolls, celestial compass',
        face: 'serene mystical face, calm penetrating eyes, elegant features, composed expression, subtle aura',
        pose: 'casting talisman, summoning shikigami, drawing magic circle, chanting ritual, holding staff',
        mood: 'mystical, serene, powerful, enigmatic, composed, spiritual',
        ref: 'inspired by Japanese onmyoji, Abe no Seimei, yin-yang magic',
        negative: 'western armor, modern tech, aggressive posture, casual clothing'
      },
      '剑客': {
        core: 'wandering swordsman, master of the blade',
        detail: 'simple travel robes, longsword at waist, straw hat, cloth wraps, worn boots, travel bundle',
        face: 'sharp focused face, piercing eyes, calm expression, stubble, subtle scar, determined look',
        pose: 'drawing sword, mid-strike, sheathing blade, standing in rain, dueling opponent',
        mood: 'focused, disciplined, calm, deadly, solitary, honorable',
        ref: 'inspired by wuxia swordsmen, wandering bladesmen, martial heroes',
        negative: 'heavy armor, modern firearms, casual clothing, clumsy posture'
      },
      '刀客': {
        core: 'fierce blade master, wielder of the saber',
        detail: 'leather armor, curved saber, arm guards, cloth sash, worn cloak, scabbard, travel gear',
        face: 'fierce intense face, sharp blazing eyes, scar across cheek, grim expression, stubble',
        pose: 'drawing curved saber, mid-slash, crouched combat stance, wiping blade, charging opponent',
        mood: 'fierce, intense, deadly, proud, relentless, solitary',
        ref: 'inspired by wuxia blade masters, saber wielders, martial heroes',
        negative: 'modern firearms, heavy plate armor, casual clothing, weak posture'
      },
      '镖师': {
        core: 'loyal escort, guardian of the caravan',
        detail: 'practical travel attire, broadsword or saber, escort flag, rope, coin pouch, worn cloak, sturdy boots',
        face: 'alert weathered face, watchful eyes, stubble, determined expression, sun-bronzed skin',
        pose: 'guarding caravan, scanning road, drawing weapon, walking alongside carts, standing watch',
        mood: 'loyal, vigilant, protective, hardy, determined, honorable',
        ref: 'inspired by ancient escorts, caravan guards, bodyguards of old',
        negative: 'modern tech, casual streetwear, cowardly posture, urban setting'
      },
      '捕快': {
        core: 'diligent constable, enforcer of the law',
        detail: 'official constable uniform, sword, badge, handcuffs, warrant papers, hat, boots',
        face: 'stern alert face, sharp vigilant eyes, neat appearance, determined expression, authoritative look',
        pose: 'holding warrant, drawing sword, chasing suspect, examining crime scene, standing guard',
        mood: 'diligent, stern, vigilant, just, authoritative, determined',
        ref: 'inspired by ancient constables, imperial law enforcement, detective constables',
        negative: 'modern police gear, casual clothing, cowardly posture, urban setting'
      },
      '军师': {
        core: 'brilliant strategist, master of war planning',
        detail: 'scholarly robes, folding fan, war maps, strategy scrolls, chess board, brush and ink, compass',
        face: 'intelligent calm face, sharp calculating eyes, neat beard, composed expression, subtle smile',
        pose: 'pointing at war map, waving folding fan, planning strategy, giving orders, contemplating moves',
        mood: 'brilliant, calm, calculating, wise, composed, strategic',
        ref: 'inspired by ancient strategists, Zhuge Liang, war tacticians',
        negative: 'modern tech, casual clothing, aggressive posture, clumsy appearance'
      },
      '说书人': {
        core: 'captivating storyteller, keeper of tales',
        detail: 'traditional storyteller attire, folding fan, wooden block, tea cup, small table, scrolls of tales',
        face: 'expressive animated face, twinkling eyes, warm smile, lively expression, engaging look',
        pose: 'gesturing dramatically, striking wooden block, telling tale to crowd, waving fan, acting out story',
        mood: 'captivating, lively, expressive, warm, engaging, theatrical',
        ref: 'inspired by traditional storytellers, bards, folk narrators',
        negative: 'modern tech, business attire, dull expression, aggressive posture'
      },
      '龙裔战士': {
        core: 'majestic dragonborn warrior, scion of dragons',
        detail: 'draconic scaled skin, horns, tail, clawed hands, dragon-scale armor, elemental aura, dragon-themed weapons',
        face: 'dragon-like snout with scales, reptilian eyes with vertical pupils, horns, sharp teeth, scaled skin',
        pose: 'breathing fire, roaring in battle, spreading wings, clawed attack, standing proudly',
        mood: 'majestic, fierce, proud, powerful, primal, ancient',
        ref: 'inspired by D&D dragonborn, dragonkin warriors, draconic humanoids',
        negative: 'fully human appearance, no scales, modern clothing, weak posture'
      },
      '半精灵': {
        core: 'graceful half-elf, child of two worlds',
        detail: 'elegant elven-leather gear, pointed ears, flowing hair, forest cloak, bow, elven jewelry',
        face: 'delicate pointed ears, luminous eyes, refined features, graceful expression, ageless beauty',
        pose: 'drawing bow, communing with nature, standing gracefully, playing flute, gazing at horizon',
        mood: 'graceful, enigmatic, wise, melancholic, agile, elegant',
        ref: 'inspired by D&D half-elves, fantasy hybrids, elven heritage',
        negative: 'dwarven aesthetics, heavy plate armor, crude weapons, brutish features'
      },
      '半兽人': {
        core: 'powerful half-orc, bridge of two cultures',
        detail: 'muscular build, tusked jaw, greenish skin, tribal armor, battle axe, fur cloak, war paint',
        face: 'tusked underbite, strong brow, intense eyes, tribal markings, fierce expression',
        pose: 'swinging battle axe, roaring, standing guard, flexing muscles, charging forward',
        mood: 'powerful, fierce, proud, tribal, determined, honorable',
        ref: 'inspired by D&D half-orcs, fantasy hybrids, tribal warriors',
        negative: 'delicate refined features, elegant clothing, small build, civilized city attire'
      },
      '暗精灵': {
        core: 'mysterious dark elf, shadow of the underdark',
        detail: 'dark elegant armor, black cloak, twin daggers, glowing eyes, silver hair, dark magic aura',
        face: 'pale dark skin, glowing violet eyes, sharp elegant features, silver hair, mysterious expression',
        pose: 'drawing twin daggers, casting shadow magic, crouching in darkness, leaping silently, standing in shadows',
        mood: 'mysterious, deadly, elegant, cold, cunning, enigmatic',
        ref: 'inspired by D&D drow, dark elves, shadowy elven assassins',
        negative: 'bright colors, cheerful expression, forest elf aesthetics, heavy plate armor'
      },
      '树精': {
        core: 'ethereal dryad, spirit of the ancient tree',
        detail: 'bark-textured skin, leaf and vine garments, mossy hair, glowing eyes, flower crown, wooden staff',
        face: 'ethereal face with bark texture, glowing green eyes, leaf-tangled hair, serene expression',
        pose: 'emerging from tree, reaching toward sunlight, communing with forest, dancing among leaves, guarding grove',
        mood: 'ethereal, serene, ancient, protective, mystical, gentle',
        ref: 'inspired by dryads, tree spirits, forest nymphs',
        negative: 'urban setting, modern clothing, industrial elements, aggressive posture'
      },
      '石巨人': {
        core: 'massive stone golem, guardian of ancient places',
        detail: 'huge stone body, carved runes, moss and cracks, glowing core, massive fists, ancient architecture',
        face: 'carved stone face, glowing eyes, cracks and moss, ancient runes, immovable expression',
        pose: 'standing guard, smashing with fists, awakening from stone, blocking passage, kneeling in obedience',
        mood: 'ancient, immovable, powerful, vigilant, silent, protective',
        ref: 'inspired by stone golems, ancient guardians, rock constructs',
        negative: 'living flesh, bright colors, small size, modern setting, agile movement'
      },
      '树人': {
        core: 'ancient treant, elder of the forest',
        detail: 'massive tree-like body, bark skin, branch arms, leaf crown, moss, glowing eyes, root feet',
        face: 'tree-bark face, glowing amber eyes, mossy beard, ancient expression, leaf crown',
        pose: 'standing among trees, raising branch arms, walking slowly, guarding forest, communing with nature',
        mood: 'ancient, wise, slow, protective, majestic, serene',
        ref: 'inspired by treants, Ents, forest guardians',
        negative: 'small size, modern setting, fast movement, aggressive posture, urban environment'
      },
      '狐妖': {
        core: 'enchanting fox spirit, trickster of legend',
        detail: 'fox ears and tails, flowing robes, glowing eyes, mystical aura, fox mask, elegant jewelry',
        face: 'beautiful fox-like face, glowing amber eyes, fox ears, sly smile, elegant features',
        pose: 'swishing tails, casting illusion, dancing gracefully, sly glance, summoning foxfire',
        mood: 'enchanting, sly, playful, mysterious, alluring, cunning',
        ref: 'inspired by kitsune, fox spirits, Chinese fox legends',
        negative: 'modern clothing, aggressive posture, dull expression, urban setting'
      },
      '猫妖': {
        core: 'playful cat spirit, agile trickster',
        detail: 'cat ears and tail, sleek dark clothing, glowing eyes, claws, bell collar, agile gear',
        face: 'cat-like face, glowing green eyes, cat ears, playful smirk, whiskers, agile features',
        pose: 'pouncing, stretching like cat, balancing on ledge, playful swat, leaping silently',
        mood: 'playful, agile, sly, curious, mischievous, graceful',
        ref: 'inspired by cat spirits, nekomata, feline tricksters',
        negative: 'dog-like features, heavy armor, clumsy posture, dull expression'
      },
      '蛇妖': {
        core: 'seductive snake spirit, serpent of legend',
        detail: 'serpent lower body, scaled skin, flowing robes, glowing eyes, snake jewelry, hypnotic aura',
        face: 'beautiful serpentine face, slit-pupil eyes, forked tongue hint, elegant features, hypnotic gaze',
        pose: 'coiling serpentine, hypnotizing victim, casting spell, slithering gracefully, striking pose',
        mood: 'seductive, hypnotic, cunning, mysterious, dangerous, alluring',
        ref: 'inspired by snake spirits, lamia, serpent legends',
        negative: 'human legs, modern clothing, cheerful expression, weak posture'
      },
      '鱼人': {
        core: 'aquatic fishman, dweller of the deep',
        detail: 'scaly skin, fins, gills, webbed hands, aquatic gear, trident, pearl ornaments, coral armor',
        face: 'fish-like face, large eyes, gills on neck, fins, scaled skin, aquatic features',
        pose: 'swimming, holding trident, emerging from water, hunting, guarding reef',
        mood: 'wild, primal, mysterious, aquatic, fierce, free',
        ref: 'inspired by fishmen, aquatic races, deep sea dwellers',
        negative: 'land creature features, dry environment, modern clothing, weak build'
      },
      '蜥蜴人': {
        core: 'scaly lizardman, reptilian warrior',
        detail: 'scaled skin, tail, claws, tribal armor, bone weapons, tribal markings, reptilian eyes',
        face: 'reptilian face, slit-pupil eyes, scaled skin, sharp teeth, forked tongue, tribal markings',
        pose: 'hunting with spear, crouching, striking with claws, standing guard, tribal dance',
        mood: 'primal, fierce, tribal, cunning, wild, resilient',
        ref: 'inspired by lizardmen, reptilian races, fantasy reptiles',
        negative: 'mammal features, fur, modern clothing, weak posture, elegant appearance'
      },
      '牛头人': {
        core: 'mighty minotaur, bull-headed warrior',
        detail: 'bull head, massive muscular body, horns, tribal armor, great axe, fur cloak, hoof feet',
        face: 'bull head, large horns, fierce eyes, snout, tribal markings, powerful features',
        pose: 'charging with horns, swinging great axe, roaring, guarding labyrinth, standing mighty',
        mood: 'mighty, fierce, powerful, primal, proud, relentless',
        ref: 'inspired by minotaurs, Greek mythology, bull-headed warriors',
        negative: 'small build, elegant features, modern clothing, weak posture'
      },
      '狮鹫骑士': {
        core: 'noble griffon rider, master of the skies',
        detail: 'light armor, griffon saddle, lance, wind goggles, feathered cloak, riding gear, aerial harness',
        face: 'noble determined face, keen eyes, wind-touched skin, focused expression, confident look',
        pose: 'riding griffon, pointing lance, soaring through clouds, commanding griffon, landing gracefully',
        mood: 'noble, bold, adventurous, skilled, commanding, free',
        ref: 'inspired by griffon riders, aerial cavalry, fantasy mounts',
        negative: 'grounded setting, heavy plate armor, modern tech, cowardly posture'
      },
      '独角兽骑士': {
        core: 'pure unicorn rider, champion of light',
        detail: 'silver and white armor, unicorn saddle, glowing lance, flowing cape, holy symbols, radiant aura',
        face: 'noble pure face, gentle bright eyes, serene smile, radiant features, pure expression',
        pose: 'riding unicorn, raising glowing lance, blessing the land, standing with unicorn, galloping through light',
        mood: 'pure, noble, gentle, radiant, heroic, serene',
        ref: 'inspired by unicorn riders, holy knights, pure heroes',
        negative: 'dark evil imagery, aggressive posture, modern tech, corrupted appearance'
      },
      '凤凰骑士': {
        core: 'fiery phoenix knight, reborn in flame',
        detail: 'crimson and gold armor, phoenix motifs, flame-tipped sword, phoenix feather cape, ember aura',
        face: 'fierce noble face, burning eyes, determined expression, flame-touched features, proud look',
        pose: 'raising flame sword, rising from ashes, spreading phoenix wings, charging into battle, standing in fire',
        mood: 'fiery, noble, fierce, determined, proud, reborn',
        ref: 'inspired by phoenix knights, fire warriors, rebirth legends',
        negative: 'cold blue colors, water themes, weak posture, dark gloomy appearance'
      },
      '花妖': {
        core: 'delicate flower spirit, bloom of the meadow',
        detail: 'flower-petal garments, blooming hair, glowing aura, floral jewelry, leaf wings, dewdrop accents',
        face: 'delicate beautiful face, bright gentle eyes, petal-touched cheeks, serene smile, floral features',
        pose: 'blooming petals, dancing in meadow, scattering pollen, tending flowers, glowing softly',
        mood: 'delicate, gentle, serene, joyful, ethereal, pure',
        ref: 'inspired by flower spirits, floral fairies, bloom maidens',
        negative: 'dark gloomy appearance, aggressive posture, urban setting, withered look'
      },
      '鸟人': {
        core: 'winged birdman, sky-dwelling race',
        detail: 'feathered wings, bird-like features, light armor, talon feet, feather cloak, sky gear',
        face: 'bird-like face, sharp beak hint, keen eyes, feathered features, wild expression',
        pose: 'soaring with wings, diving, perched on cliff, hunting from sky, spreading wings',
        mood: 'wild, free, fierce, agile, proud, untamed',
        ref: 'inspired by birdmen, avian races, winged humanoids',
        negative: 'grounded setting, heavy armor, modern clothing, weak build'
      },
      '蛙人': {
        core: 'bouncy frogman, amphibious trickster',
        detail: 'green skin, webbed hands, large eyes, aquatic gear, spear, lily pad accents, tribal markings',
        face: 'frog-like face, large bulging eyes, wide mouth, green skin, amphibious features',
        pose: 'leaping, croaking, swimming, hunting insects, crouching by pond, striking with tongue',
        mood: 'playful, wild, agile, curious, amphibious, lively',
        ref: 'inspired by frogmen, amphibious races, swamp dwellers',
        negative: 'dry desert setting, mammalian features, modern clothing, weak build'
      },
      '铁傀儡': {
        core: 'sturdy iron golem, indestructible guardian',
        detail: 'massive iron body, riveted plates, glowing core, heavy fists, ancient runes, iron armor',
        face: 'iron faceplate, glowing eyes, riveted features, ancient runes, immovable expression',
        pose: 'standing guard, smashing with iron fists, blocking passage, awakening, kneeling in obedience',
        mood: 'sturdy, ancient, immovable, powerful, vigilant, silent',
        ref: 'inspired by iron golems, metal constructs, ancient guardians',
        negative: 'living flesh, bright colors, small size, modern setting, agile movement'
      },
      '雷神': {
        core: 'mighty thunder god, lord of storms',
        detail: 'majestic divine armor, lightning motifs, war hammer, storm cloak, crackling aura, glowing runes',
        face: 'majestic fierce face, eyes crackling with lightning, powerful features, divine glow, commanding expression',
        pose: 'raising war hammer, summoning lightning, standing amid storm, striking down, commanding thunder',
        mood: 'mighty, fierce, powerful, commanding, divine, wrathful',
        ref: 'inspired by Thor, Zeus, thunder deities',
        negative: 'weak posture, modern clothing, calm peaceful scene, dark gloomy appearance'
      },
      '月神': {
        core: 'radiant moon goddess, lady of the night',
        detail: 'silver flowing robes, crescent moon crown, glowing aura, moonstone jewelry, starlight veil',
        face: 'radiant serene face, glowing silver eyes, ethereal beauty, gentle smile, moonlit glow',
        pose: 'raising crescent staff, bathing world in moonlight, gazing at moon, blessing night, floating among stars',
        mood: 'radiant, serene, mystical, gentle, divine, ethereal',
        ref: 'inspired by moon goddesses, Selene, lunar deities',
        negative: 'bright daylight scene, aggressive posture, dark evil imagery, modern clothing'
      },
      '海妖': {
        core: 'enchanting siren, songstress of the sea',
        detail: 'iridescent scales, flowing hair, seashell adornments, glowing eyes, ocean aura, pearl jewelry',
        face: 'enchanting beautiful face, hypnotic glowing eyes, serene smile, ethereal features, ocean glow',
        pose: 'singing enchanting song, rising from waves, perched on rock, luring sailors, diving into sea',
        mood: 'enchanting, hypnotic, mysterious, alluring, melancholic, ethereal',
        ref: 'inspired by sirens, mermaids, sea enchantresses',
        negative: 'land creature features, dry environment, modern clothing, aggressive posture'
      },
      '凤凰使者': {
        core: 'radiant phoenix messenger, herald of rebirth',
        detail: 'crimson and gold robes, phoenix feathers, glowing aura, flame motifs, radiant wings, ember accents',
        face: 'radiant noble face, burning golden eyes, serene smile, flame-touched features, divine glow',
        pose: 'spreading radiant wings, delivering divine message, rising in flame, glowing brightly, blessing the land',
        mood: 'radiant, noble, serene, divine, hopeful, majestic',
        ref: 'inspired by phoenix, divine messengers, rebirth legends',
        negative: 'dark gloomy appearance, cold colors, weak posture, corrupted look'
      },
      '太阳神': {
        core: 'blazing sun god, lord of daylight',
        detail: 'golden divine armor, sun crown, radiant aura, golden staff, sun motifs, blazing glow',
        face: 'majestic radiant face, blazing golden eyes, powerful features, divine glow, commanding expression',
        pose: 'raising sun staff, commanding daylight, standing amid radiance, blessing the world, riding sun chariot',
        mood: 'majestic, radiant, powerful, commanding, divine, benevolent',
        ref: 'inspired by sun gods, Apollo, Ra, solar deities',
        negative: 'dark gloomy appearance, weak posture, night scene, modern clothing'
      },
      '战神': {
        core: 'fierce war god, lord of battle',
        detail: 'battle-worn divine armor, greatsword, war scars, blood-red cape, battle aura, war trophies',
        face: 'fierce battle-hardened face, blazing war eyes, scars, grim expression, commanding features',
        pose: 'raising greatsword, leading charge, roaring battle cry, standing amid carnage, commanding armies',
        mood: 'fierce, mighty, battle-hungry, commanding, relentless, wrathful',
        ref: 'inspired by war gods, Ares, Mars, battle deities',
        negative: 'peaceful scene, weak posture, modern clothing, calm expression'
      },
      '死神': {
        core: 'grim death god, reaper of souls',
        detail: 'dark hooded cloak, scythe, glowing eyes, skeletal features, ethereal aura, soul lantern',
        face: 'hooded shadowed face, glowing eyes, skeletal hint, grim expression, ethereal features',
        pose: 'holding scythe, reaping soul, standing in shadow, pointing toward afterlife, looming over mortal',
        mood: 'grim, solemn, powerful, mysterious, inevitable, cold',
        ref: 'inspired by death gods, grim reapers, psychopomps',
        negative: 'bright cheerful scene, colorful appearance, weak posture, playful expression'
      },
      '冥王': {
        core: 'mighty lord of the underworld, ruler of the dead',
        detail: 'dark regal robes, obsidian crown, scepter of souls, shadow aura, underworld jewels, dark throne',
        face: 'majestic stern face, deep shadowed eyes, regal features, grim expression, ancient aura',
        pose: 'seated on dark throne, holding scepter, judging souls, commanding shadows, standing in underworld',
        mood: 'majestic, stern, powerful, ancient, solemn, commanding',
        ref: 'inspired by Hades, underworld lords, rulers of the dead',
        negative: 'bright daylight, cheerful expression, weak posture, modern clothing'
      },
      '爱神': {
        core: 'charming god of love, bringer of affection',
        detail: 'elegant divine robes, heart motifs, golden bow, rose accents, radiant aura, love symbols',
        face: 'charming radiant face, warm loving eyes, gentle smile, divine beauty, endearing features',
        pose: 'drawing golden bow, spreading love, blessing couples, releasing doves, holding rose',
        mood: 'charming, warm, gentle, divine, joyful, endearing',
        ref: 'inspired by Cupid, Eros, love deities',
        negative: 'cold emotionless expression, aggressive posture, dark imagery, modern clothing'
      },
      '命运女神': {
        core: 'mysterious goddess of fate, weaver of destiny',
        detail: 'flowing mystical robes, thread of fate, spinning wheel, glowing runes, celestial symbols, fateful aura',
        face: 'mysterious serene face, deep knowing eyes, ethereal beauty, calm expression, divine glow',
        pose: 'spinning thread of fate, weaving destiny, pointing to future, holding glowing thread, meditating',
        mood: 'mysterious, serene, wise, powerful, enigmatic, divine',
        ref: 'inspired by Fates, Moirai, goddesses of destiny',
        negative: 'modern clothing, aggressive posture, bright cheerful scene, weak presence'
      },
      '丰收女神': {
        core: 'bountiful goddess of harvest, bringer of abundance',
        detail: 'flowing golden robes, wheat crown, cornucopia, harvest symbols, golden aura, floral accents',
        face: 'warm radiant face, gentle nurturing eyes, soft smile, divine beauty, bountiful glow',
        pose: 'holding cornucopia, scattering grain, blessing fields, standing amid harvest, offering abundance',
        mood: 'bountiful, warm, nurturing, joyful, divine, generous',
        ref: 'inspired by harvest goddesses, Demeter, Ceres',
        negative: 'barren landscape, dark imagery, aggressive posture, modern clothing'
      },
      '风神': {
        core: 'swift wind god, master of the gale',
        detail: 'flowing wind robes, swirling aura, wind symbols, feathered accents, airy cloak, storm motifs',
        face: 'swift dynamic face, bright keen eyes, wind-touched features, lively expression, ethereal glow',
        pose: 'commanding wind, swirling gale, flying through sky, blowing storm, standing amid whirlwind',
        mood: 'swift, dynamic, free, powerful, lively, untamed',
        ref: 'inspired by wind gods, Aeolus, storm deities',
        negative: 'still calm scene, heavy armor, weak posture, grounded setting'
      },
      '火神': {
        core: 'blazing fire god, lord of flame',
        detail: 'crimson divine armor, flame motifs, burning aura, fire crown, molten accents, ember glow',
        face: 'fierce blazing face, burning eyes, flame-touched features, powerful expression, divine glow',
        pose: 'commanding fire, raising flame, standing amid inferno, forging with fire, blessing hearth',
        mood: 'fierce, blazing, powerful, commanding, passionate, divine',
        ref: 'inspired by fire gods, Hephaestus, Vulcan, flame deities',
        negative: 'water themes, cold blue colors, weak posture, dark gloomy appearance'
      },
      '山神': {
        core: 'ancient mountain god, guardian of peaks',
        detail: 'stone and earth robes, mountain crown, rocky aura, ancient symbols, moss accents, earthen glow',
        face: 'ancient weathered face, deep wise eyes, stone-textured features, serene expression, majestic aura',
        pose: 'standing atop peak, guarding mountain, blessing travelers, commanding earth, meditating',
        mood: 'ancient, majestic, serene, protective, wise, immovable',
        ref: 'inspired by mountain gods, earth deities, peak guardians',
        negative: 'small build, modern clothing, aggressive posture, urban setting'
      },
      '河神': {
        core: 'flowing river god, lord of the waters',
        detail: 'flowing water robes, river crown, water aura, aquatic symbols, pearl accents, wave motifs',
        face: 'serene flowing face, deep water eyes, gentle features, calm expression, ethereal glow',
        pose: 'commanding river, standing amid water, blessing waters, guiding boats, meditating by stream',
        mood: 'serene, flowing, gentle, wise, powerful, calm',
        ref: 'inspired by river gods, water deities, river spirits',
        negative: 'dry desert setting, aggressive posture, modern clothing, dark imagery'
      },
      '星神': {
        core: 'radiant star god, lord of the heavens',
        detail: 'starlight robes, star crown, celestial aura, glowing constellations, cosmic symbols, starry veil',
        face: 'radiant serene face, starlit eyes, ethereal beauty, divine glow, celestial features',
        pose: 'commanding stars, scattering starlight, gazing at cosmos, blessing night, floating among stars',
        mood: 'radiant, serene, cosmic, divine, wise, ethereal',
        ref: 'inspired by star gods, celestial deities, cosmic beings',
        negative: 'bright daylight, aggressive posture, modern clothing, dark gloomy appearance'
      },
      '龙神': {
        core: 'majestic dragon god, lord of dragons',
        detail: 'dragon-scaled divine robes, dragon crown, elemental aura, draconic symbols, golden glow',
        face: 'majestic draconic face, glowing eyes, horns, divine features, commanding expression',
        pose: 'soaring through clouds, commanding dragons, breathing elemental breath, standing majestically, blessing realm',
        mood: 'majestic, powerful, ancient, commanding, divine, wise',
        ref: 'inspired by dragon gods, draconic deities, dragon lords',
        negative: 'small build, weak posture, modern clothing, dull appearance'
      },
      '麒麟': {
        core: 'auspicious qilin, sacred beast of legend',
        detail: 'scaled body, single horn, flowing mane, hooves, glowing aura, auspicious symbols, divine glow',
        face: 'gentle majestic face, kind wise eyes, single horn, flowing mane, serene expression',
        pose: 'standing gracefully, walking among clouds, blessing the land, gazing peacefully, guarding sacred place',
        mood: 'auspicious, gentle, majestic, wise, serene, divine',
        ref: 'inspired by qilin, Chinese auspicious beasts, sacred creatures',
        negative: 'aggressive posture, dark imagery, modern clothing, fierce expression'
      },
      '玄武': {
        core: 'ancient black tortoise, guardian of the north',
        detail: 'tortoise shell armor, serpent companion, dark scales, ancient symbols, water aura, moss accents',
        face: 'ancient weathered face, deep wise eyes, scaled features, serene expression, ancient aura',
        pose: 'standing guard, coiled with serpent, meditating, protecting realm, gazing calmly',
        mood: 'ancient, wise, serene, protective, enduring, calm',
        ref: 'inspired by Xuanwu, black tortoise, four symbols of Chinese mythology',
        negative: 'aggressive posture, bright colors, modern clothing, weak presence'
      },
      '天狗': {
        core: 'proud tengu, winged guardian of the mountains',
        detail: 'red face, long nose, feathered wings, tengu robes, war fan, mountain gear, mystical aura',
        face: 'red face, long nose, fierce eyes, winged features, proud expression',
        pose: 'spreading wings, wielding war fan, perched on mountain, flying, guarding sacred peak',
        mood: 'proud, fierce, mystical, disciplined, powerful, wild',
        ref: 'inspired by tengu, Japanese mountain spirits, winged guardians',
        negative: 'modern clothing, weak posture, urban setting, cheerful expression'
      },
      '赛车手': {
        core: 'daring race car driver, master of speed',
        detail: 'racing suit, helmet, gloves, racing boots, sponsor gear, steering wheel, checkered flag',
        face: 'focused determined face, sharp eyes behind helmet, confident grin, youthful energy',
        pose: 'holding helmet, sitting in race car, waving checkered flag, celebrating victory, adjusting gloves',
        mood: 'daring, competitive, focused, confident, passionate, determined',
        ref: 'inspired by Formula 1, professional racing, motorsports',
        negative: 'medieval setting, casual streetwear, slow pace, non-racing environment'
      },
      '网红': {
        core: 'influential internet celebrity, online star',
        detail: 'trendy fashion, ring light, smartphone, camera, branded merch, stylish backdrop, social media gear',
        face: 'glamorous expressive face, bright engaging eyes, big smile, perfect makeup, trendy look',
        pose: 'taking selfie, filming video, striking trendy pose, waving to followers, unboxing product',
        mood: 'glamorous, engaging, trendy, confident, energetic, charismatic',
        ref: 'inspired by social media influencers, content creators, online stars',
        negative: 'medieval setting, formal attire, dull expression, non-online environment'
      },
      '博主': {
        core: 'creative blogger, digital storyteller',
        detail: 'stylish casual attire, laptop, camera, notebook, coffee, cozy workspace, writing tools',
        face: 'warm expressive face, bright thoughtful eyes, gentle smile, casual neat appearance',
        pose: 'typing on laptop, taking photo, writing in notebook, filming vlog, presenting content',
        mood: 'creative, thoughtful, warm, engaging, passionate, authentic',
        ref: 'inspired by bloggers, lifestyle creators, digital writers',
        negative: 'medieval setting, formal business attire, dull expression, non-digital environment'
      },
      '健身教练': {
        core: 'energetic fitness trainer, guide to strength',
        detail: 'athletic wear, whistle, stopwatch, training gloves, water bottle, towel, fitness equipment',
        face: 'energetic motivated face, bright encouraging eyes, confident smile, athletic features',
        pose: 'demonstrating exercise, spotting client, counting reps, cheering encouragement, holding dumbbell',
        mood: 'energetic, motivating, confident, disciplined, encouraging, strong',
        ref: 'inspired by personal trainers, fitness coaches, gym professionals',
        negative: 'medieval setting, formal attire, weak posture, non-gym environment'
      },
      '钢琴家': {
        core: 'virtuoso pianist, master of the keys',
        detail: 'elegant concert attire, grand piano, sheet music, piano bench, stage lighting, bow tie',
        face: 'passionate expressive face, eyes closed in emotion, serene or intense expression, elegant features',
        pose: 'playing piano, hands gliding over keys, bowing after performance, reading sheet music, in deep concentration',
        mood: 'passionate, expressive, elegant, soulful, dedicated, inspired',
        ref: 'inspired by concert pianists, classical musicians, virtuosos',
        negative: 'casual streetwear, clumsy posture, non-performance setting, dull expression'
      },
      '小提琴家': {
        core: 'talented violinist, master of strings',
        detail: 'elegant concert attire, violin, bow, sheet music, shoulder rest, stage lighting, rosin',
        face: 'passionate expressive face, eyes closed in emotion, serene expression, elegant features',
        pose: 'playing violin, bow gliding over strings, eyes closed in passion, bowing after performance, tuning instrument',
        mood: 'passionate, expressive, elegant, soulful, dedicated, inspired',
        ref: 'inspired by violinists, classical musicians, string virtuosos',
        negative: 'casual streetwear, clumsy posture, non-performance setting, dull expression'
      },
      '吉他手': {
        core: 'rocking guitarist, master of the strings',
        detail: 'rock attire, electric or acoustic guitar, guitar strap, picks, amplifier, stage gear',
        face: 'cool expressive face, intense passionate eyes, slight grin, rocker look, energetic expression',
        pose: 'strumming guitar, soloing on stage, bending strings, rocking out, holding guitar high',
        mood: 'cool, passionate, energetic, expressive, rebellious, skilled',
        ref: 'inspired by rock guitarists, guitar heroes, musicians',
        negative: 'formal attire, clumsy posture, non-stage setting, dull expression'
      },
      '鼓手': {
        core: 'powerful drummer, heartbeat of the band',
        detail: 'drum kit, drumsticks, rock attire, headphones, cymbals, stage gear, drum throne',
        face: 'intense focused face, energetic eyes, slight grin, sweat, passionate expression',
        pose: 'hitting drums, spinning drumstick, intense drum solo, keeping rhythm, celebrating beat',
        mood: 'powerful, energetic, passionate, rhythmic, intense, skilled',
        ref: 'inspired by rock drummers, percussionists, band musicians',
        negative: 'formal attire, clumsy posture, non-stage setting, dull expression'
      },
      '指挥家': {
        core: 'commanding conductor, master of the orchestra',
        detail: 'elegant concert attire, baton, tailcoat, bow tie, sheet music, podium, white gloves',
        face: 'expressive commanding face, intense passionate eyes, focused expression, elegant features',
        pose: 'raising baton, conducting orchestra, dramatic gesture, cueing section, bowing to audience',
        mood: 'commanding, passionate, expressive, elegant, authoritative, inspired',
        ref: 'inspired by orchestra conductors, maestros, classical music',
        negative: 'casual streetwear, clumsy posture, non-performance setting, dull expression'
      },
      '作曲家': {
        core: 'creative composer, architect of music',
        detail: 'elegant attire, piano, sheet music, composition notebook, quill or pen, metronome, music studio',
        face: 'thoughtful creative face, deep inspired eyes, contemplative expression, elegant features',
        pose: 'writing music, playing melody on piano, deep in thought, conducting in mind, revising score',
        mood: 'creative, inspired, contemplative, passionate, dedicated, visionary',
        ref: 'inspired by composers, classical music, film score writers',
        negative: 'casual streetwear, clumsy posture, non-musical setting, dull expression'
      },
      '小说家': {
        core: 'imaginative novelist, weaver of stories',
        detail: 'cozy writing attire, typewriter or laptop, manuscript, coffee, reading glasses, notebook, writing desk',
        face: 'thoughtful creative face, deep imaginative eyes, gentle smile, contemplative expression',
        pose: 'typing novel, deep in thought, reading manuscript, writing by hand, staring at page',
        mood: 'imaginative, contemplative, passionate, dedicated, creative, introspective',
        ref: 'inspired by novelists, writers, literary authors',
        negative: 'medieval setting, aggressive posture, non-writing environment, dull expression'
      },
      '诗人': {
        core: 'lyrical poet, artist of words',
        detail: 'artistic attire, quill and ink, poetry notebook, books, candle, scarf, writing desk',
        face: 'soulful expressive face, deep thoughtful eyes, gentle smile, artistic features',
        pose: 'writing poem, reciting verse, gazing into distance, holding quill, deep in thought',
        mood: 'lyrical, soulful, contemplative, passionate, artistic, introspective',
        ref: 'inspired by poets, literary artists, verse writers',
        negative: 'formal business attire, aggressive posture, non-literary setting, dull expression'
      },
      '美食家': {
        core: 'refined food critic, connoisseur of cuisine',
        detail: 'elegant dining attire, notebook, pen, wine glass, tasting spoon, fine restaurant setting',
        face: 'refined discerning face, appreciative eyes, subtle smile, elegant features, composed expression',
        pose: 'tasting dish, taking notes, savoring wine, examining plate, presenting verdict',
        mood: 'refined, discerning, appreciative, sophisticated, critical, composed',
        ref: 'inspired by food critics, gourmets, culinary connoisseurs',
        negative: 'casual streetwear, fast food setting, clumsy posture, dull expression'
      },
      '品酒师': {
        core: 'expert sommelier, master of wine',
        detail: 'elegant attire, wine glass, wine bottle, tasting notes, corkscrew, wine cellar, tasting apron',
        face: 'refined discerning face, appreciative eyes, subtle smile, elegant features, composed expression',
        pose: 'swirling wine glass, sniffing bouquet, tasting wine, decanting bottle, presenting vintage',
        mood: 'refined, discerning, appreciative, sophisticated, knowledgeable, composed',
        ref: 'inspired by sommeliers, wine experts, oenologists',
        negative: 'casual streetwear, clumsy posture, non-wine setting, dull expression'
      },
      '茶艺师': {
        core: 'graceful tea master, artist of the ceremony',
        detail: 'elegant tea attire, tea set, teapot, tea cups, tea leaves, bamboo whisk, tea table',
        face: 'serene graceful face, calm gentle eyes, soft smile, elegant features, composed expression',
        pose: 'pouring tea, whisking matcha, presenting tea cup, performing tea ceremony, arranging tea set',
        mood: 'serene, graceful, composed, elegant, mindful, gentle',
        ref: 'inspired by tea masters, tea ceremonies, tea culture',
        negative: 'casual streetwear, aggressive posture, non-tea setting, dull expression'
      },
      '策展人': {
        core: 'visionary curator, shaper of exhibitions',
        detail: 'elegant attire, exhibition catalog, gallery map, clipboard, art pieces, museum setting, glasses',
        face: 'intellectual discerning face, appreciative eyes, refined smile, elegant features, composed expression',
        pose: 'arranging artwork, examining piece, guiding tour, presenting exhibition, pointing at art',
        mood: 'visionary, discerning, intellectual, refined, passionate, composed',
        ref: 'inspired by museum curators, art curators, exhibition designers',
        negative: 'casual streetwear, clumsy posture, non-gallery setting, dull expression'
      },
      '收藏家': {
        core: 'passionate collector, keeper of treasures',
        detail: 'elegant attire, display cases, antique pieces, magnifying glass, catalog, gloves, collection room',
        face: 'passionate discerning face, appreciative eyes, proud smile, refined features, eager expression',
        pose: 'examining artifact, polishing treasure, arranging collection, showing prized piece, cataloging item',
        mood: 'passionate, discerning, proud, meticulous, appreciative, dedicated',
        ref: 'inspired by collectors, antique enthusiasts, treasure keepers',
        negative: 'casual streetwear, clumsy posture, non-collection setting, dull expression'
      },
      '法医': {
        core: 'precise forensic scientist, seeker of truth',
        detail: 'white lab coat, gloves, microscope, evidence bags, forensic tools, clipboard, lab equipment',
        face: 'focused analytical face, sharp observant eyes, calm expression, neat appearance, professional look',
        pose: 'examining evidence, analyzing sample, documenting scene, studying microscope, presenting findings',
        mood: 'precise, analytical, focused, calm, professional, meticulous',
        ref: 'inspired by forensic scientists, crime labs, CSI',
        negative: 'medieval setting, fantasy magic, casual streetwear, unprofessional appearance'
      },
      '心理医生': {
        core: 'insightful psychologist, healer of the mind',
        detail: 'professional attire, notebook, pen, comfortable office, books, glasses, therapy tools',
        face: 'warm understanding face, gentle empathetic eyes, reassuring smile, composed expression',
        pose: 'listening attentively, taking notes, offering guidance, sitting in session, reassuring patient',
        mood: 'insightful, empathetic, calm, professional, understanding, composed',
        ref: 'inspired by psychologists, therapists, mental health professionals',
        negative: 'medieval setting, fantasy magic, aggressive posture, unprofessional appearance'
      },
      '化妆师': {
        core: 'creative makeup artist, artist of beauty',
        detail: 'makeup kit, brushes, palette, mirror, beauty chair, cosmetics, studio lighting',
        face: 'creative expressive face, bright artistic eyes, confident smile, stylish appearance',
        pose: 'applying makeup, blending eyeshadow, examining face, presenting look, arranging brushes',
        mood: 'creative, artistic, confident, meticulous, stylish, passionate',
        ref: 'inspired by makeup artists, beauty professionals, editorial makeup',
        negative: 'medieval setting, rugged outdoor gear, clumsy posture, non-beauty environment'
      },
      '漫画家': {
        core: 'talented manga artist, creator of comics',
        detail: 'drawing desk, ink pens, manga paper, screentone, reference books, tablet, drawing tools',
        face: 'focused creative face, bright artistic eyes, slight smile, casual appearance, inspired expression',
        pose: 'drawing manga panel, inking lines, adding screentone, sketching character, reviewing page',
        mood: 'creative, focused, passionate, dedicated, imaginative, meticulous',
        ref: 'inspired by manga artists, comic creators, illustrators',
        negative: 'formal business attire, non-drawing setting, dull expression, clumsy posture'
      },
      '插画师': {
        core: 'imaginative illustrator, painter of stories',
        detail: 'art studio, canvas, paint brushes, palette, tablet, sketchbook, art supplies, easel',
        face: 'creative expressive face, bright imaginative eyes, slight smile, paint smudges, artistic look',
        pose: 'painting illustration, sketching concept, coloring artwork, examining piece, presenting art',
        mood: 'creative, imaginative, passionate, expressive, dedicated, artistic',
        ref: 'inspired by illustrators, concept artists, visual storytellers',
        negative: 'formal business attire, non-art setting, dull expression, clumsy posture'
      },
      '动画师': {
        core: 'skilled animator, bringer of motion',
        detail: 'animation studio, drawing tablet, lightbox, reference frames, computer, storyboard, animation tools',
        face: 'focused creative face, bright artistic eyes, slight smile, casual appearance, inspired expression',
        pose: 'drawing frames, animating on tablet, reviewing motion, sketching storyboard, presenting animation',
        mood: 'creative, focused, passionate, dedicated, imaginative, meticulous',
        ref: 'inspired by animators, animation studios, motion artists',
        negative: 'formal business attire, non-animation setting, dull expression, clumsy posture'
      },
      '创业者': {
        core: 'driven entrepreneur, builder of ventures',
        detail: 'smart casual attire, laptop, business plan, coffee, office space, presentation materials, phone',
        face: 'driven confident face, ambitious bright eyes, determined smile, energetic appearance',
        pose: 'presenting pitch, shaking hands, reviewing plan, working at desk, leading team',
        mood: 'driven, ambitious, confident, energetic, visionary, determined',
        ref: 'inspired by entrepreneurs, startup founders, business leaders',
        negative: 'medieval setting, fantasy magic, passive posture, unprofessional appearance'
      },
      '投资人': {
        core: 'shrewd investor, master of capital',
        detail: 'formal business attire, financial charts, laptop, documents, glasses, office setting, calculator',
        face: 'shrewd analytical face, sharp calculating eyes, composed expression, professional appearance',
        pose: 'reviewing charts, analyzing data, shaking hands, presenting deal, examining report',
        mood: 'shrewd, analytical, composed, strategic, confident, professional',
        ref: 'inspired by investors, financial analysts, venture capitalists',
        negative: 'medieval setting, fantasy magic, casual streetwear, unprofessional appearance'
      },
      '经济学家': {
        core: 'analytical economist, student of markets',
        detail: 'professional attire, charts, reports, laptop, glasses, books, office setting, data',
        face: 'analytical thoughtful face, sharp observant eyes, composed expression, professional appearance',
        pose: 'reviewing charts, analyzing data, presenting report, lecturing, examining trends',
        mood: 'analytical, thoughtful, composed, professional, insightful, precise',
        ref: 'inspired by economists, financial analysts, market experts',
        negative: 'medieval setting, fantasy magic, casual streetwear, unprofessional appearance'
      },
      '数据分析师': {
        core: 'detail-oriented data analyst, interpreter of numbers',
        detail: 'professional attire, computer, charts, dashboards, reports, glasses, office setting',
        face: 'analytical focused face, sharp observant eyes, composed expression, professional appearance',
        pose: 'analyzing data, reviewing dashboard, presenting findings, typing on computer, examining charts',
        mood: 'analytical, focused, precise, professional, insightful, methodical',
        ref: 'inspired by data analysts, business intelligence, analytics professionals',
        negative: 'medieval setting, fantasy magic, casual streetwear, unprofessional appearance'
      },
      '无人机飞行员': {
        core: 'skilled drone pilot, master of the skies',
        detail: 'tech attire, drone, remote controller, goggles, tablet, flight gear, safety equipment',
        face: 'focused determined face, sharp eyes, confident expression, tech-savvy look',
        pose: 'piloting drone, holding controller, watching screen, launching drone, reviewing footage',
        mood: 'focused, skilled, tech-savvy, determined, precise, adventurous',
        ref: 'inspired by drone pilots, aerial photography, UAV operators',
        negative: 'medieval setting, fantasy magic, clumsy posture, non-tech environment'
      },
      '摩托车手': {
        core: 'daring motorcyclist, rider of the open road',
        detail: 'leather riding suit, helmet, gloves, boots, motorcycle, riding gear, goggles',
        face: 'daring determined face, sharp focused eyes, confident grin, rugged appearance',
        pose: 'riding motorcycle, holding helmet, leaning into turn, standing by bike, adjusting gloves',
        mood: 'daring, free-spirited, determined, confident, adventurous, rugged',
        ref: 'inspired by motorcyclists, motorcycle racers, road riders',
        negative: 'medieval setting, formal attire, slow pace, non-riding environment'
      },
      '卡车司机': {
        core: 'hardy truck driver, king of the highway',
        detail: 'casual work attire, cap, truck keys, logbook, coffee, gloves, highway gear',
        face: 'weathered friendly face, warm eyes, stubble, cheerful grin, sun-worn skin',
        pose: 'driving truck, checking map, loading cargo, resting at rest stop, inspecting truck',
        mood: 'hardy, friendly, reliable, determined, patient, resilient',
        ref: 'inspired by truck drivers, long-haul drivers, highway travelers',
        negative: 'medieval setting, formal attire, non-driving environment, delicate build'
      },
      '领航员': {
        core: 'skilled navigator, guide of voyages',
        detail: 'nautical attire, compass, sextant, maps, telescope, logbook, navigation tools',
        face: 'alert focused face, sharp observant eyes, weathered skin, determined expression',
        pose: 'reading map, using sextant, plotting course, looking through telescope, guiding ship',
        mood: 'alert, skilled, focused, experienced, reliable, determined',
        ref: 'inspired by navigators, maritime explorers, voyage guides',
        negative: 'landlocked setting, modern tech, casual streetwear, clumsy posture'
      },
      '特警': {
        core: 'elite SWAT officer, tactical responder',
        detail: 'tactical gear, helmet, ballistic vest, rifle, shield, earpiece, tactical boots, gloves',
        face: 'focused determined face, sharp vigilant eyes, tactical expression, disciplined look',
        pose: 'breaching door, aiming rifle, tactical advance, providing cover, standing guard',
        mood: 'focused, disciplined, tactical, vigilant, determined, brave',
        ref: 'inspired by SWAT teams, tactical units, special response',
        negative: 'medieval setting, fantasy armor, casual clothing, cowardly posture'
      },
      '刑警': {
        core: 'dedicated criminal detective, solver of cases',
        detail: 'professional attire, badge, notebook, handcuffs, evidence bag, case files, magnifying glass',
        face: 'sharp observant face, keen analytical eyes, determined expression, professional look',
        pose: 'examining evidence, interviewing suspect, reviewing case files, at crime scene, taking notes',
        mood: 'dedicated, analytical, observant, determined, professional, persistent',
        ref: 'inspired by criminal detectives, police investigators, crime solvers',
        negative: 'medieval setting, fantasy magic, casual streetwear, unprofessional appearance'
      },
      '保镖': {
        core: 'vigilant bodyguard, protector of the client',
        detail: 'black suit, earpiece, sunglasses, concealed weapon, protective gear, radio, formal attire',
        face: 'vigilant composed face, sharp watchful eyes, stern expression, professional look',
        pose: 'scanning surroundings, shielding client, escorting VIP, standing guard, speaking into earpiece',
        mood: 'vigilant, composed, protective, professional, alert, loyal',
        ref: 'inspired by bodyguards, personal protection, security professionals',
        negative: 'casual streetwear, clumsy posture, unprofessional appearance, weak presence'
      },
      '私家侦探': {
        core: 'cunning private investigator, solver of secrets',
        detail: 'trench coat, fedora, notebook, camera, magnifying glass, badge, disguise gear',
        face: 'sharp observant face, keen analytical eyes, slight smirk, stubble, mysterious expression',
        pose: 'following suspect, taking photos, examining clue, writing notes, in disguise',
        mood: 'cunning, observant, analytical, mysterious, persistent, resourceful',
        ref: 'inspired by private detectives, noir investigators, mystery solvers',
        negative: 'medieval setting, fantasy magic, clumsy posture, unprofessional appearance'
      },
      '摔跤手': {
        core: 'powerful wrestler, grappler of the ring',
        detail: 'wrestling singlet, championship belt, wrestling boots, knee pads, ring gear',
        face: 'intense determined face, focused eyes, sweat, grim expression, powerful features',
        pose: 'in wrestling stance, executing grapple, lifting opponent, celebrating victory, holding belt',
        mood: 'powerful, intense, determined, fierce, competitive, disciplined',
        ref: 'inspired by professional wrestling, grapplers, ring athletes',
        negative: 'medieval armor, casual clothing, non-ring setting, weak posture'
      },
      '击剑手': {
        core: 'agile fencer, master of the blade sport',
        detail: 'fencing whites, mask, foil or epee, glove, chest protector, fencing shoes',
        face: 'focused determined face behind mask, sharp eyes, intense concentration, athletic look',
        pose: 'in fencing stance, lunging, parrying, thrusting foil, removing mask after bout',
        mood: 'agile, focused, precise, competitive, disciplined, elegant',
        ref: 'inspired by fencers, fencing sport, duelists',
        negative: 'medieval armor, casual clothing, non-fencing setting, clumsy posture'
      },
      '登山家': {
        core: 'brave mountaineer, conqueror of peaks',
        detail: 'climbing gear, helmet, ice axe, ropes, crampons, backpack, warm layers, goggles',
        face: 'weathered determined face, sharp focused eyes, frost-touched features, brave expression',
        pose: 'climbing cliff, planting flag on summit, scaling ice wall, resting at camp, looking at peak',
        mood: 'brave, determined, resilient, adventurous, focused, enduring',
        ref: 'inspired by mountaineers, peak climbers, Everest expeditions',
        negative: 'urban setting, formal attire, weak posture, non-mountain environment'
      },
      '探险家': {
        core: 'intrepid explorer, discoverer of the unknown',
        detail: 'expedition gear, khaki outfit, hat, backpack, compass, map, machete, binoculars',
        face: 'weathered adventurous face, keen curious eyes, confident grin, sun-tanned skin',
        pose: 'surveying new land, reading map, pushing through jungle, planting flag, discovering ruins',
        mood: 'intrepid, adventurous, curious, determined, fearless, resourceful',
        ref: 'inspired by explorers, adventurers, discoverers',
        negative: 'urban setting, formal attire, cowardly posture, non-expedition environment'
      },
      '潜水员': {
        core: 'skilled diver, explorer of the deep',
        detail: 'diving suit, oxygen tank, mask, fins, wetsuit, dive computer, underwater gear',
        face: 'focused calm face behind mask, alert eyes, determined expression, aquatic look',
        pose: 'diving underwater, exploring reef, swimming among fish, signaling, surfacing',
        mood: 'calm, focused, adventurous, skilled, curious, resilient',
        ref: 'inspired by divers, underwater explorers, marine adventurers',
        negative: 'landlocked setting, formal attire, non-diving environment, clumsy posture'
      }
    },
    keywords: ['人物', '角色', '人', '主角', 'character', 'person', '男', '女', '剑客', '侠客', '武者', '修士', '骑士', '少女', '少年', '战士', '法师', '忍者', '刺客', '猎人', '精灵', '王子', '公主', '龙', '神', '仙', '妖', '魔', '兽人', '机器人', '改造人', '赛博', '哥特', '蒸汽', '古风', '水墨', '写实', '二次元', '动漫']
  },

  scene: {
    name: '场景',
    categories: {
      '废弃老宅': {
        core: 'abandoned old mansion, derelict traditional chinese residence',
        detail: 'crumbling brick and timber walls, broken lattice windows, peeling paint, overgrown weeds in the doorway, collapsed roof beams, moss on stone steps, dim interior darkness'
      },
      '破旧民房': {
        core: 'dilapidated rural dwelling, weathered wooden house',
        detail: 'warped wooden planks, patched tin roof, cracked mud walls, laundry line, rusty tools leaning against the wall, dirt path, scattered firewood'
      },
      '乡村土屋': {
        core: 'rustic earthen cottage, rural mud-brick house',
        detail: 'rammed earth walls, thatched roof, small wooden door, stone threshold, clay pots, smoke from chimney, vegetable patch'
      },
      '荒废庭院': {
        core: 'overgrown abandoned courtyard, neglected walled garden',
        detail: 'cracked stone paving, dry fountain, tangled vines on broken walls, fallen leaves, weeds pushing through cracks, empty wooden benches'
      },
      '老城区巷弄': {
        core: 'old town alleyway, narrow historic lane',
        detail: 'narrow winding alley, weathered brick facades, hanging laundry, tangled overhead cables, worn stone steps, dim streetlight, puddles'
      },
      '城中村': {
        core: 'dense urban village, crowded low-rise settlement',
        detail: 'tightly packed self-built houses, exposed pipes and wiring, narrow passages, rooftop water tanks, faded signs, chaotic but lived-in'
      },
      '筒子楼': {
        core: 'old socialist-era apartment block, narrow corridor building',
        detail: 'long dim corridor, shared kitchen doors, peeling green paint, bicycle against the wall, bare bulb lighting, worn concrete stairs'
      },
      '旧公寓': {
        core: 'worn old apartment interior, lived-in vintage room',
        detail: 'faded wallpaper, old wooden furniture, dusty curtains, single window light, cracked plaster ceiling, scattered personal belongings'
      },
      '废弃工厂': {
        core: 'abandoned factory hall, derelict industrial workshop',
        detail: 'rusted steel beams, broken skylights, peeling paint, scattered machinery parts, oil stains, shattered windows, shafts of dusty light'
      },
      '拆迁废墟': {
        core: 'demolition ruins, half-collapsed buildings and rubble',
        detail: 'exposed rebar, collapsed concrete slabs, piles of bricks, torn signage, dust in the air, remnants of rooms without walls'
      },
      '荒废旧校舍': {
        core: 'abandoned old schoolhouse, deserted classroom building',
        detail: 'empty classrooms, broken blackboards, scattered desks, peeling walls, broken windows, dust motes in the light, silent corridors'
      },
      '老式卧室': {
        core: 'vintage bedroom, old-fashioned furnished room',
        detail: 'wooden bed with faded quilt, old wardrobe, warm lamp, patterned wallpaper, worn floorboards, small window with thin curtains'
      },
      '仙山云海': {
        core: 'misty mountain peaks floating in clouds, celestial realm',
        detail: 'jagged peaks piercing through sea of clouds, ancient pine trees clinging to cliffs, waterfalls cascading into mist, stone pathways winding up mountainsides, distant pagodas on peaks, cranes flying through fog, spiritual energy shimmering in air, moss-covered boulders, bamboo groves swaying gently'
      },
      '赛博都市': {
        core: 'cyberpunk megacity, neon-lit dystopian metropolis',
        detail: 'towering skyscrapers with holographic billboards, rain-slicked streets reflecting neon, elevated highways weaving between buildings, street vendors in narrow alleys, flying vehicles between towers, augmented reality advertisements, steaming vents and pipes, crowded marketplaces with LED signs, cables and wires draped across facades'
      },
      '哥特城堡': {
        core: 'gothic castle, dark medieval fortress',
        detail: 'soaring spires piercing stormy skies, gargoyles perched on ledges, wrought iron gates, ivy-covered stone walls, arched stained glass windows, grand halls with vaulted ceilings, flickering torchlight in corridors, crumbling battlements, full moon behind towering silhouette, ravens circling turrets'
      },
      '蒸汽都市': {
        core: 'steampunk industrial city, brass and steam metropolis',
        detail: 'clockwork towers with giant gears visible, steam locomotives on elevated tracks, brass pipes and copper boilers, airships docked at mooring towers, cobblestone streets with gas lamps, mechanical workshops with sparks flying, gear-driven elevators, Victorian-era brick buildings with metal extensions, steam vents hissing from every surface'
      },
      '樱花庭院': {
        core: 'cherry blossom garden courtyard, serene japanese garden',
        detail: 'ancient cherry trees in full bloom, pink petals drifting in breeze, wooden engawa veranda, stone lanterns covered in moss, koi pond with rippling water, arched wooden bridge, bamboo water fountain clicking, raked gravel zen garden, paper sliding doors, wind chimes hanging from eaves'
      },
      '废墟末世': {
        core: 'post-apocalyptic ruins, nature reclaiming civilization',
        detail: 'crumbling skyscrapers covered in vines, rusted vehicles abandoned on streets, broken windows reflecting grey sky, overgrown railway tracks, collapsed bridges, makeshift shelters from debris, weathered propaganda posters, cracked asphalt with weeds growing through, distant smoke columns, scavenger camps among ruins'
      },
      '自然山水': {
        core: 'grand natural landscape, majestic mountains and rivers',
        detail: 'layered mountain ranges fading into distance, winding river cutting through valleys, dramatic rock formations, grassland meadows with wildflowers, ancient trees with twisted roots, mirror-like lake reflecting sky, birds soaring on thermal currents, dramatic cloud formations, waterfalls plunging into pools, golden sunlight filtering through leaves'
      },
      '太空站': {
        core: 'futuristic space station, orbital habitat',
        detail: 'massive ring-shaped station rotating in orbit, docking bays with spacecraft, observation domes with panoramic star views, long corridors with floating panels, hydroponic gardens under artificial light, control rooms with holographic displays, solar panels gleaming in starlight, distant nebula visible through windows, zero-gravity cargo bays, airlock hatches with warning lights'
      },
      '古风宫殿': {
        core: 'ancient chinese palace, imperial court architecture',
        detail: 'golden glazed roof tiles gleaming, vermillion columns and carved beams, dragon motifs on every surface, marble staircases with mythical beast statues, vast courtyards with bronze incense burners, silk curtains billowing in breeze, jade screens with landscape carvings, lotus ponds with decorative bridges, military banners fluttering, grand audience hall with dragon throne'
      },
      '暗黑森林': {
        core: 'dark enchanted forest, mysterious woodland',
        detail: 'ancient twisted trees with gnarled branches, bioluminescent mushrooms glowing on forest floor, dense fog between tree trunks, thorny vines wrapping around everything, abandoned stone ruins half-buried, narrow winding path disappearing into darkness, moonlight barely penetrating canopy, ravens watching from dead branches, strange symbols carved on bark, eerie silence broken by distant howls'
      },
      '街角咖啡馆': {
        core: 'cozy street corner cafe, urban lifestyle scene',
        detail: 'outdoor tables with checkered tablecloths, steam rising from coffee cups, vintage storefront with large windows, string lights overhead, bicycles parked nearby, cobblestone sidewalk, flowers in window boxes, chalkboard menu signs, people reading at corner tables, warm glow spilling onto street at dusk'
      },
      '像素世界': {
        core: 'pixel art fantasy world, retro game environment',
        detail: 'blocky trees and pixelated clouds, 16-bit color palette, scrolling parallax background layers, chunky sprite architecture, visible pixel grid on objects, dithering effects on surfaces, limited color count per tile, retro RPG village aesthetic, pixel waterfalls with repeating frames, old-school game UI elements in environment'
      },
      '波普画廊': {
        core: 'pop art gallery, vibrant contemporary art space',
        detail: 'bold comic-style Ben-Day dot patterns on walls, oversized sculptures in primary colors, neon art installations, gallery spotlights on rotating exhibits, white cube gallery space, graphic speech bubbles as wall art, mirrored surfaces reflecting colorful pieces, oversized everyday objects as art, screen-printed canvases, visitors silhouetted against bright works'
      },
      '海底世界': {
        core: 'underwater world, deep ocean environment',
        detail: 'coral reefs in vibrant colors, schools of tropical fish swimming through, sunbeams penetrating from surface, ancient shipwrecks covered in barnacles, giant kelp forests swaying, sea turtles gliding gracefully, underwater caves with glowing crystals, bubbles rising lazily, whale shadows passing overhead, anemones waving in currents'
      },
      '竹林': {
        core: 'serene dense bamboo grove with dappled light',
        detail: 'towering emerald bamboo stalks, filtered sunlight through leaves, narrow winding stone path, fallen bamboo leaves carpeting ground, morning mist lingering between stalks, wooden fence partially hidden, distant mountain silhouette, soft green ambient glow, gentle breeze rustling leaves, bamboo shoots emerging from soil, moss-covered ancient stones, shallow clear stream crossing path, wooden bridge arching over water, scattered petals from nearby blossoms, ethereal light rays piercing canopy, quiet contemplative atmosphere, subtle bamboo fragrance in air, occasional bird call echoing, weathered stone lanterns along path, seasonal cherry blossom petals drifting'
      },
      '沙漠古城': {
        core: 'ancient ruined city half-buried in golden desert',
        detail: 'weathered sandstone structures eroded by centuries, massive crumbling archways framing sky, intricate geometric carvings on walls, partially buried columns in golden sand dunes, crumbling watchtowers silhouetted against setting sun, narrow alleyways between ancient buildings, faded hieroglyphic inscriptions on stone, scattered pottery shards in sand, dried oasis with dead palm trunks, sandstorm haze on distant horizon, ornate broken temple doorway, sun-bleached textile fragments fluttering, caravan route markers worn smooth, ancient marketplace remnants, collapsed dome ceilings exposing sky, giant stone guardian statues half-submerged, golden hour light casting long shadows, wind-sculpted sand ripples everywhere, hidden underground chamber entrance, mirage shimmering at desert edge'
      },
      '雪山之巅': {
        core: 'pristine snow-covered mountain summit under vast sky',
        detail: 'jagged rocky peaks piercing through clouds, pristine white snow blanket stretching endlessly, razor-sharp ridgeline against clear blue sky, wind-carved snow formations and cornices, wisps of cloud streaming past summit, ice crystals glinting in sunlight, deep crevasses hidden beneath snow bridges, prayer flags frozen stiff in wind, weathered mountaineering markers from past climbers, thin crisp air with visible breath, panoramic view of lower mountain ranges, dramatic cloud sea below summit level, frozen waterfall cascading down cliff face, isolated rocky outcrop breaking snow surface, alpenglow pink light at dawn, scattered cairn stone stacks for navigation, sudden gust kicking up snow spray, distant avalanche rumble echoing, stark contrast of blue sky and white snow, complete silence broken only by wind'
      },
      '热带雨林': {
        core: 'dense humid tropical jungle teeming with life',
        detail: 'massive ancient trees with buttress roots, thick canopy filtering sunlight into green beams, dangling vines and lianas everywhere, giant fern fronds unfurling at ground level, colorful exotic flowers in vibrant reds and purples, misty humid air thick with moisture, fallen moss-covered log spanning small stream, bromeliads perched on high branches, chattering monkeys swinging through canopy, iridescent butterflies dancing in sunbeams, multi-tiered vegetation from floor to emergent layer, hidden waterfall behind curtain of leaves, bioluminescent fungi on rotting wood, thick muddy path after tropical rain, pitcher plants hanging from overhanging branches, cacophony of bird calls and insect chirps, decomposing leaves releasing earthy scent, massive philodendron leaves broad as umbrellas, bamboo thickets creating natural tunnels, sudden tropical downpour drumming on leaves'
      },
      '天空之城': {
        core: 'floating celestial city among clouds and sky',
        detail: 'white marble platforms hovering impossibly in air, crystalline spires reaching toward stratosphere, cascading waterfalls flowing off platform edges into void, ornate floating bridges connecting island segments, translucent energy domes shimmering over districts, golden mechanical wings maintaining altitude, ancient runes glowing along platform edges, cloud wisps drifting between floating structures, ethereal blue-white ambient lighting, glass-bottom walkways revealing clouds below, hanging gardens with vines trailing into sky, floating lanterns drifting upward at dusk, spiral staircases winding around crystalline towers, airships docking at floating harbors, aviary of exotic flying creatures, wind chimes echoing across open spaces, rainbow refractions through crystal architecture, observatory domes tracking celestial bodies, floating market stalls along sky canals, perpetual gentle breeze carrying floral scent'
      },
      '地下洞穴': {
        core: 'vast subterranean cavern with crystal formations',
        detail: 'massive stalactites hanging from cathedral-height ceiling, crystal clusters glowing with inner luminescence, underground lake reflecting cavern ceiling perfectly, stalagmites rising from floor like stone forests, narrow passages leading to hidden chambers, mineral deposits painting walls in rainbow colors, ancient fossilized creatures embedded in walls, underground river carving through limestone, delicate soda straw formations in clusters, bioluminescent moss covering cave walls, echo amplifying every sound and drop of water, flowstone formations like frozen waterfalls, cave pearls scattered in shallow pools, natural rock bridge spanning deep chasm, helictite formations defying gravity in spirals, complete darkness beyond torchlight radius, cool constant temperature and damp air, bats hanging from distant ceiling crevices, ancient cave paintings on smooth stone walls, subterranean thermal vent creating steam wisps'
      },
      '火山熔岩': {
        core: 'active volcanic landscape with flowing lava rivers',
        detail: 'molten lava rivers carving glowing orange channels, black basalt rock formations cooling and cracking, billowing smoke plumes rising from central crater, swirling ash clouds darkening sky above, heat distortion shimmering in air, glowing embers floating upward like fireflies, obsidian shards glinting with volcanic glass sheen, sulfur vents releasing yellow steam, hardened lava tubes forming natural tunnels, sparse fire-resistant vegetation at edges, cracked earth radiating intense heat, volcanic bombs scattered across slope, distant thunder of eruption rumbling, magma fountain spraying from secondary vent, new land forming where lava meets sea, charred tree skeletons standing in ash field, rope-like pahoehoe lava formations, pyroclastic flow deposits in layers, steam explosions where lava hits water, apocalyptic orange-red sky reflection'
      },
      '冰原极光': {
        core: 'vast frozen tundra under dancing aurora sky',
        detail: 'endless flat ice sheet stretching to horizon, aurora borealis ribbons dancing in green and purple, snow-covered ground sparkling under starlight, jagged ice formations sculpted by relentless wind, frozen lake surface cracked in geometric patterns, distant glacier wall glowing pale blue, snowdrift waves frozen mid-motion, isolated research station lights in distance, diamond dust ice crystals suspended in air, frost flowers blooming on fresh ice surface, polar night deep blue twilight atmosphere, animal tracks preserved in fresh snow, ice cave entrance glowing turquoise from within, wind-sculpted sastrugi formations, crescent moon casting silver light on snow, complete silence absorbing all sound, pressure ridges where ice sheets collide, scattered meteorites preserved in ice, steam rising from thermal spring oasis, ancient mammoth tusk protruding from permafrost'
      },
      '沼泽湿地': {
        core: 'misty marshland with twisted trees and still water',
        detail: 'ancient cypress trees rising from dark still water, spanish moss draping from gnarled branches, wooden boardwalk winding through flooded forest, thick fog rolling across water surface at dawn, lily pads with blooming water flowers, submerged roots creating intricate underwater maze, great blue heron standing motionless in shallows, bubbles surfacing from unseen creatures below, tannin-stained water dark as tea, fallen logs providing turtle basking platforms, cattails and reeds swaying in breeze, dragonflies hovering above water surface, fireflies emerging at dusk among trees, duckweed covering water in green carpet, abandoned wooden fishing boat half-sunken, weeping willow branches trailing in water, chorus of frog calls echoing at twilight, gentle rain creating concentric ripples, wooden pier extending into misty distance, decomposing vegetation releasing earthy peat scent'
      },
      '图书馆': {
        core: 'vast grand library with towering bookshelves and arches',
        detail: 'towering oak bookshelves reaching three stories high, rolling ladders on brass rails, arched stained glass windows filtering colored light, reading tables with green glass lampshades, spiral staircase in central rotunda, leather-bound books with gold foil lettering, dust motes dancing in shafts of sunlight, marble busts of scholars in alcoves, globe stands with antique celestial maps, ornate ceiling fresco depicting knowledge allegories, thick Persian rugs muffling footsteps, wrought iron balcony railings on upper levels, hidden reading nooks between shelf rows, card catalog cabinets with brass handles, quill pens and inkwells on writing desks, fireplace crackling in reading lounge, astronomical instruments on display pedestals, vaulted ceiling with exposed wooden beams, books stacked in precarious towers on floor, scent of aged paper and leather binding'
      },
      '魔法阵': {
        core: 'magic circle summoning sigil arcane ritual ground',
        detail: 'glowing runes etched into stone floor, concentric circles of arcane symbols, floating crystals orbiting around center, ethereal energy rising from inscribed lines, summoning circle with elemental markers, ancient script spiraling inward, pillars of light at cardinal points, ritual candles flickering with colored flames, arcane barrier shimmering at perimeter, summoning gate opening in center, floating spell tomes around circle, ley lines converging from all directions, arcane clockwork mechanism rotating beneath, elemental wisps guarding each point, spectral chains binding something within circle, reality warping at circle edges, magical seals floating in air, blood-rune circle pulsing, celestial alignment marked on floor, dimensional rift contained within circle'
      },
      '火焰地狱': {
        core: 'infernal plane hell dimension fire realm burning abyss',
        detail: 'endless rivers of molten lava, obsidian spires piercing blood-red sky, chains of the damned hanging from invisible heights, sulfur vents spewing green flame, burning throne on mountain of skulls, souls writhing in fire pits, demonic citadel of black iron, bridges of bone over lava rivers, eternal firestorm on horizon, torture wheels turning slowly, jagged obsidian cliffs, lakes of liquid fire, hellfire tornadoes, charred wasteland of ash, infernal forge mountain, soul cages hanging from chains, lava waterfalls into void, burning forest of petrified trees, demon siege engines, bottomless pits of flame'
      },
      '古代遗迹': {
        core: 'ancient ruins lost civilization forgotten temple archaeology',
        detail: 'crumbling stone columns reaching toward sky, massive stone blocks displaced by centuries, intricate carvings weathered by time, overgrown temple reclaimed by jungle, half-buried statues of forgotten gods, collapsed archways forming natural passages, vine-covered stonework, moss growing in ancient inscriptions, broken pottery scattered on ground, ceremonial altar frozen in time, hidden chambers beneath collapsed ceiling, ancient mechanisms still functioning, petroglyphs telling stories of past, shaft of sunlight piercing through broken roof, roots breaking through stone walls, ancient throne room empty, forgotten library with decayed scrolls, crumbling aqueduct still carrying water, guardian statues watching silently, treasure chamber sealed for millennia'
      },
      '星空': {
        core: 'starry night sky cosmos galaxy celestial milky way',
        detail: 'vast milky way stretching across sky, billions of stars in crystal clarity, nebula clouds in purple and blue, shooting stars streaking across sky, planets visible to naked eye, aurora borealis dancing among stars, constellations clearly defined, meteor shower raining down, ring nebula visible, binary star system glowing, satellite crossing star field, comet with long tail, zodiac constellations aligned, supernova remnant in distant corner, dark matter clouds, star clusters sparkling, crescent moon among stars, galaxy spiral arms visible, earthshine on moon, cosmic dust lanes'
      },
      '炼金实验室': {
        core: 'alchemy laboratory workshop potions elixir transmutation',
        detail: 'glass beakers bubbling with colorful liquids, copper distillation tubes winding across ceiling, shelves of specimen jars with strange creatures, alembic still dripping golden liquid, mortar and pestle with glowing powder, open grimoire with transmutation circles, herbs drying from ceiling beams, philosopher stone glowing on pedestal, homunculus growing in glass tank, transmutation circle on stone floor, copper and brass instruments on workbench, astrolabe and celestial charts, chalkboard covered in alchemical formulas, element samples in labeled jars, bunsen burner with blue flame, crystal growth experiments, preserved dragon egg under glass, mercurial pools reflecting strange light, alchemical symbols on every surface, philosopher stone prototype pulsing'
      },
      '龙巢': {
        core: 'dragon lair treasure hoard wyrm den volcanic cavern',
        detail: 'mountain of gold coins and gems, ancient dragon sleeping on treasure pile, massive bones of previous meals scattered, scorch marks on stone walls, volcanic vents providing heat, dragon eggs nestled in heated sand, hoard of magical weapons, melted armor of failed knights, dragon skull of previous lair owner, treasure chests overflowing with jewels, cave paintings of dragon conquests, massive claw marks on walls, burnt banners of defeated kingdoms, glowing crystals embedded in walls, underground hot spring, dragon skeleton still clutching treasure, broken siege weapons, ancient dragon runes, balcony overlooking kingdom, thermal updrafts through ceiling cracks'
      },
      '水晶洞穴': {
        core: 'crystal cave geode underground crystal formation cavern',
        detail: 'massive amethyst crystals jutting from walls, crystal formations glowing with inner light, geodes split open revealing purple interiors, crystal clear underground pool, quartz pillars reaching ceiling, prismatic light refractions everywhere, crystal bridge over chasm, giant geode chamber, diamond dust floating in air, rose quartz walls, citrine clusters on floor, aquamarine crystals growing from ceiling, crystal singing resonance, selenite towers, rainbow light refractions, obsidian floor polished mirror-like, crystal throne, glowing crystal heart, emerald formations, topaz incrustations'
      },
      '浮空岛': {
        core: 'floating island sky realm cloud kingdom aerial paradise',
        detail: 'islands floating among clouds, waterfalls cascading off edges into void, ancient trees with roots through island bottom, crystal bridges connecting floating landmasses, winged creatures soaring between islands, temples on larger floating platforms, gardens suspended in air, floating stairs circling islands, glowing crystals keeping islands aloft, windmills harnessing sky currents, airships docked at island ports, magical floating rocks, cloud sea below, multiple suns in sky, floating market with sky merchants, observatory on highest island, elemental air spirits, floating castle anchored by chains, hanging gardens, portal rings between islands'
      },
      '暗影领域': {
        core: 'shadow realm dark dimension void plane of darkness',
        detail: 'perpetual twilight without sun, shadows that move independently, dark mist clinging to ground, ghostly landscape of dark crystal, shadowy reflections of real world, inverted architecture hanging from above, whispering darkness, shadow creatures flitting at edge of vision, dark mirror pools reflecting nothing, void trees with no leaves, shadow bridges over nothing, dark energy pulsing through ground, reality warping in darkness, shadow people observing silently, negative space architecture, dark fog that consumes light, umbral flora, floating shadow islands, black sun in sky, shadow storms'
      },
      '圣殿': {
        core: 'sanctuary temple cathedral holy ground sacred hall',
        detail: 'marble columns reaching to vaulted ceiling, stained glass windows depicting divine stories, rays of colored light falling on altar, incense smoke rising in sunbeams, golden icons on every wall, prayer candles flickering in darkness, holy water font at entrance, pipe organ pipes reaching ceiling, marble floor reflecting candlelight, sacred relics in golden reliquaries, choir loft with wooden seats, confessional booths of dark wood, frescoes on ceiling dome, mosaic floor depicting sacred geometry, eternal flame on altar, statues of saints in alcoves, bells in tower above, rose window with intricate tracery, sanctuary lamp always burning, tabernacle of gold and gems'
      },
      '森林深处': {
        core: 'dense ancient forest interior with towering trees',
        detail: 'towering old-growth trees blocking most sunlight, thick canopy creating dappled light patterns, moss-covered trunks, ferns and undergrowth carpeting forest floor, shafts of golden light piercing through leaves, mist rising between trees at dawn, fallen logs covered in mushrooms, small stream winding through roots, bird calls echoing in canopy, deer path through thicket, ancient gnarled roots, fireflies at dusk, damp earthy scent, hidden clearings, vines hanging from branches, forest animals watching from shadows, patches of wildflowers, decaying leaves underfoot, centuries-old trees, sense of being watched'
      },
      '幽暗洞穴': {
        core: 'dark gloomy cave interior with stalactites and shadows',
        detail: 'pitch-black darkness broken by dim torchlight, jagged stalactites hanging overhead, damp stone walls dripping with moisture, narrow winding passages, echoing water drips, faint bioluminescent glow in distance, loose rocks underfoot, cold damp air, unseen creatures skittering in shadows, ancient carvings on walls, collapsed stone pillars, underground stream, bats overhead, thick spider webs, mineral deposits glinting, oppressive silence, faint draft from deeper tunnels, glowing mushrooms, mysterious light source ahead, sense of dread'
      },
      '悬崖峭壁': {
        core: 'sheer cliff face with dramatic vertical drop',
        detail: 'towering vertical cliff face, sheer drop into misty valley below, jagged rock ledges, wind-swept stone surface, sparse hardy vegetation clinging to cracks, distant waterfalls, birds soaring at cliff level, narrow mountain path along edge, dramatic shadows across rock face, clouds below summit, ancient wind-carved rock formations, exposed strata layers, echoes of wind, vertigo-inducing height, sea cliffs with crashing waves below, mountain goats on ledges, morning mist rising, golden light on rock, sense of awe'
      },
      '瀑布峡谷': {
        core: 'canyon with cascading waterfall and rushing river',
        detail: 'majestic waterfall cascading into deep pool, towering canyon walls on both sides, rainbow forming in waterfall mist, river rushing through narrow gorge, moss-covered rocks, spray cooling the air, echo of falling water, lush vegetation along canyon edge, sunlight filtering through canyon top, misty atmosphere, hidden grottos behind waterfall, smooth water-worn boulders, ferns and wildflowers, deep turquoise pool, ancient rock layers, birds nesting in cliff crevices, wooden bridge across river, sound of thundering water, cool refreshing air'
      },
      '草原旷野': {
        core: 'vast open grassland plain under wide sky',
        detail: 'endless rolling grassland stretching to horizon, tall grass swaying in wind, wide open sky with drifting clouds, wildflowers scattered across meadow, distant lone tree, herds of animals grazing, wind creating waves in grass, butterflies and bees, gentle hills, dirt path winding through grass, birds of prey circling overhead, warm sunlight, sense of freedom and space, grasshoppers jumping, wild horses running, distant mountains on horizon, golden light at sunset, cool breeze, wild grass seeds floating, vast emptiness'
      },
      '沙漠绿洲': {
        core: 'desert oasis with palm trees and water pool',
        detail: 'lush green oasis surrounded by golden sand dunes, palm trees clustered around water pool, crystal clear spring water, date palms heavy with fruit, small village of mud-brick buildings, travelers resting in shade, camels drinking water, reeds and grasses at water edge, birds singing in palms, cool water reflecting sky, sand dunes glowing in sunlight, oasis gardens with vegetables, stone well, fabric awnings providing shade, distant heat shimmer, sense of relief and life, date palm shadows, water birds, gentle breeze rustling palms'
      },
      '极地冰原': {
        core: 'polar icefield with icebergs and snow',
        detail: 'vast frozen icefield stretching to horizon, towering icebergs in distance, pristine white snow, deep blue ice formations, polar bears in distance, cracks in ice sheet, snowdrifts, cold clear air, aurora in night sky, penguins on ice, frozen sea, ice caves glowing blue, sled dogs, research station, wind-carved ice, glittering snow crystals, distant glacier, animal tracks in snow, pale sunlight, extreme cold, silent landscape'
      },
      '火山口': {
        core: 'volcano crater with molten lava and smoke',
        detail: 'massive volcanic crater, glowing molten lava at bottom, billowing smoke and ash, jagged crater rim, red-hot rocks, heat shimmer, lava fountains, steam vents, obsidian formations, hardened lava flows, sulfur smell, ash-covered slopes, glowing cracks in ground, distant eruption sounds, orange glow at night, volcanic rock layers, crater lake of lava, floating embers, scorched landscape, apocalyptic atmosphere'
      },
      '海底遗迹': {
        core: 'underwater ancient ruins beneath the sea',
        detail: 'sunken ancient city ruins underwater, crumbling stone columns, coral growing on structures, schools of colorful fish, rays of sunlight penetrating water, seaweed-covered statues, sunken temples, treasure chests, sea turtles swimming, arches and doorways, marine life among ruins, bubbles rising, blue-green water, moss and algae, ancient carvings, sunken ships nearby, shafts of light, mysterious depths, sense of lost civilization, underwater plants swaying'
      },
      '云端之上': {
        core: 'floating above a vast sea of clouds',
        detail: 'standing above a vast sea of clouds, cloud tops stretching to horizon, mountain peaks piercing through clouds, golden sunlight on cloud surface, soft cotton-like clouds, sense of floating, clear blue sky above, cloud formations shifting, distant peaks, birds flying below cloud level, morning light, peaceful serenity, cloud shadows, wind at altitude, sun rays through clouds, ethereal atmosphere, sense of elevation, clouds like ocean, brilliant white, endless vista'
      },
      '月光庭院': {
        core: 'courtyard bathed in silver moonlight',
        detail: 'traditional courtyard bathed in silver moonlight, stone path, koi pond reflecting moon, bamboo and plants, paper lanterns glowing softly, wooden veranda, moon shadow patterns, night flowers blooming, gentle breeze, water ripples, stone lanterns, quiet serenity, moonlit leaves, incense smoke, sliding doors, night insects, moss on stones, moon reflection in water, peaceful atmosphere, soft silver light, traditional architecture'
      },
      '雨夜小巷': {
        core: 'narrow alley on a rainy night',
        detail: 'narrow alley in rain at night, wet cobblestones reflecting streetlights, dripping water from eaves, dim street lamps, neon signs glowing, umbrellas, puddles with ripples, steam rising from vents, rain falling in sheets, shadowy figures, brick walls, flickering lights, distant traffic, rain sounds, wet pavement reflections, closed shop signs, cats sheltering, atmospheric mood, cold damp air, cinematic lighting'
      },
      '废弃工厂': {
        core: 'abandoned industrial factory',
        detail: 'derelict factory interior, rusted machinery, broken windows, dust particles in light beams, peeling paint, collapsed ceilings, old conveyor belts, abandoned equipment, graffiti on walls, overgrown vegetation inside, broken glass, empty workstations, rusted pipes, dim lighting, eerie silence, forgotten tools, industrial decay, shafts of light through holes, moss and rust, sense of abandonment, post-industrial atmosphere'
      },
      '地下城': {
        core: 'vast underground city beneath the earth',
        detail: 'sprawling underground city, carved caverns, glowing crystals providing light, stone buildings, underground rivers, bridges over chasms, market stalls, torch-lit streets, dwarven architecture, stalactite columns, hidden districts, underground farms, glowing mushrooms, ventilation shafts, ancient tunnels, city lights in darkness, stone stairways, underground gardens, sense of hidden civilization, warm glow, subterranean life'
      },
      '古战场': {
        core: 'ancient battlefield with war remnants',
        detail: 'ancient battlefield, broken swords and shields, scattered armor, weathered banners, ruined war machines, bones of fallen warriors, scorched earth, mist over field, crows circling, broken spears, war drums, memorial stones, trampled ground, ancient siege weapons, faded bloodstains, ghostly atmosphere, sense of past conflict, broken chariots, silent memorial, historical weight, overgrown battlefield'
      },
      '竞技场': {
        core: 'grand arena for combat and spectacle',
        detail: 'massive stone arena, circular colosseum, tiered seating, sand-covered floor, cheering crowd, gladiators, grand arches, banners and flags, central combat area, underground passages, royal viewing box, torches, dust in air, dramatic atmosphere, stone columns, roaring crowd, combat equipment, ancient architecture, sense of spectacle, sun over arena'
      },
      '皇家宫殿': {
        core: 'grand royal palace interior',
        detail: 'opulent royal palace, grand throne room, gilded decorations, crystal chandeliers, marble floors, red velvet curtains, royal tapestries, golden thrones, grand staircase, ornate ceilings, royal guards, courtiers, portraits of monarchs, luxurious furnishings, grand windows, silk draperies, crown jewels, sense of majesty, royal splendor, golden light'
      },
      '市集广场': {
        core: 'bustling market square in town',
        detail: 'lively market square, colorful stalls, vendors calling out, fresh produce, fabrics and goods, crowds of people, fountain in center, town buildings around, awnings and canopies, street food smells, goods on display, merchants, shoppers, warm sunlight, cobblestone ground, flags and decorations, sense of commerce, bustling atmosphere, goods and wares, town square'
      },
      '酒馆': {
        core: 'cozy tavern with drinks and patrons',
        detail: 'warm tavern interior, wooden tables and chairs, fireplace crackling, patrons drinking, barrels of ale, hanging lanterns, bartender at counter, wooden beams, mugs of beer, food on tables, musicians playing, smoke in air, dim warm lighting, tavern signs, stairs to upper floor, sense of camaraderie, laughter, warm atmosphere, rustic decor, stories being told'
      },
      '码头港口': {
        core: 'busy harbor with ships and docks',
        detail: 'busy harbor, wooden docks, sailing ships moored, fishing boats, cargo being loaded, ropes and nets, seagulls, sailors, warehouses, cranes, water lapping against docks, masts and rigging, crates and barrels, harbor lights, sense of trade, sea breeze, ships at anchor, dock workers, lanterns, bustling port, ocean horizon'
      },
      '灯塔海岸': {
        core: 'rocky coast with tall lighthouse',
        detail: 'rocky coastline, tall lighthouse on cliff, beacon light sweeping, crashing waves, sea spray, rocky shore, lighthouse keeper house, clear sky, ships in distance, coastal path, seabirds, lighthouse stripes, sense of guidance, ocean expanse, wind, dramatic cliffs, beacon at night, coastal vegetation, sense of isolation, maritime atmosphere'
      },
      '迷雾沼泽': {
        core: 'misty swamp veiled in thick fog and murky water',
        detail: 'dense fog rolling over dark stagnant water, gnarled trees draped in hanging moss, twisted roots rising from murky depths, will-o-wisps flickering in the haze, half-submerged ancient ruins, thick mist swallowing distant shapes, murky pools reflecting pale light, reeds and cattails emerging from the gloom, eerie silence broken by distant drips, faint bioluminescent glow beneath the surface, decaying logs half-sunk in black water, wading birds moving like shadows, fog-shrouded boardwalk vanishing into white, swamp gas bubbles rising to the surface, spectral trees looming through the mist, damp earthy air heavy with decay, hidden paths swallowed by fog, ghostly reflections on still water, mist curling around gnarled branches, sense of being watched from the murk'
      },
      '樱花林': {
        core: 'cherry blossom forest in full bloom',
        detail: 'cherry blossom trees in full bloom, pink petals falling like snow, petal-covered ground, sunlight through pink canopy, gentle breeze carrying petals, tree-lined paths, soft pink atmosphere, blooming branches, petals in the air, sense of spring, delicate beauty, blossom viewing, pink and white flowers, peaceful serenity, petals on water, seasonal beauty, dreamy atmosphere'
      },
      '竹林小径': {
        core: 'narrow path through bamboo forest',
        detail: 'narrow path through bamboo forest, tall green bamboo stalks, dappled sunlight through bamboo, swaying bamboo, rustling leaves, stone path, quiet serenity, bamboo shadows, sense of peace, green atmosphere, wind through bamboo, path winding, bamboo grove, natural beauty, calm, filtered light, bamboo leaves falling'
      },
      '冰封王座': {
        core: 'frozen throne of ice and frost, arctic royal seat',
        detail: 'massive throne carved from living ice, intricate frost patterns etched into crystal surface, jagged ice spires rising behind the seat, cold blue light emanating from frozen depths, snow drifting through the silent hall, icicles hanging like chandeliers, ancient frost runes glowing on the throne, frozen banners of a fallen kingdom, cracked ice floor reflecting pale light, a crown of ice resting on the seat, swirling snow spirits circling above, glacial walls encasing ancient secrets, bitter cold radiating from the throne, ice crystals forming delicate filigree, frozen warriors standing as silent guards, pale aurora light filtering through ice, throne room of a long-dead frost king, hoarfrost coating every surface, wind howling through frozen corridors, eternal winter sealed within the hall'
      },
      '熔岩洞窟': {
        core: 'cavern filled with flowing lava',
        detail: 'underground cavern with flowing lava, glowing molten rock, lava channels, heat shimmer, black rock walls, orange glow, lava falls, steam vents, obsidian formations, scorched stone, glowing cracks, intense heat, lava pools, dramatic lighting, volcanic cavern, red-orange glow, rock formations, sense of danger, underground fire'
      },
      '水晶矿脉': {
        core: 'crystal vein mine with glowing crystals',
        detail: 'underground mine with crystal veins, glowing crystals embedded in rock, quartz and gemstones, mining tunnels, crystal clusters, sparkling walls, lantern light, miners tools, gem deposits, luminous minerals, crystal formations, sense of treasure, underground glow, rock walls, precious stones, glittering surfaces, mining atmosphere'
      },
      '精灵森林': {
        core: 'enchanted elven forest',
        detail: 'enchanted forest of the elves, ancient trees with glowing leaves, magical atmosphere, floating lights, elegant elven architecture, treehouses, glowing flowers, mystical creatures, soft green and gold light, waterfalls, stone paths, sense of magic, ethereal beauty, ancient magic, luminous plants, graceful design, enchanted atmosphere, forest spirits, timeless beauty'
      },
      '亡灵墓地': {
        core: 'haunted graveyard of the undead',
        detail: 'dark graveyard, weathered tombstones, gnarled trees, fog rolling, ghostly figures, glowing eyes in darkness, broken crosses, iron gates, crows, moonlight through fog, skeletal hands, eerie atmosphere, decaying mausoleums, will-o-wisps, sense of dread, cold air, haunting sounds, dark magic, ancient burial ground, supernatural presence'
      },
      '龙之谷': {
        core: 'majestic valley home to dragons',
        detail: 'majestic valley home to dragons, dragons soaring in sky, dragon nests on cliffs, scorched ground, dragon eggs, ancient dragon bones, mountain valley, dragon roars, treasure hoards, volcanic vents, dragon riders, sense of power, dramatic cliffs, dragon flight, mystical atmosphere, ancient legends, dragon roosts, breathtaking valley'
      },
      '浮空遗迹': {
        core: 'ancient ruins suspended in the sky among drifting clouds',
        detail: 'crumbling stone temples floating among the clouds, broken columns drifting in mid-air, moss-covered arches hovering above the void, ancient statues suspended on floating platforms, shattered stairways leading nowhere, vines trailing from floating stone blocks, weathered obelisks drifting lazily, cloud wisps weaving between ruined walls, half-collapsed towers bobbing in the sky, sacred carvings worn by wind and rain, floating rubble orbiting the ruins, sunlight piercing through broken domes, ancient altars hovering in silent stillness, birds nesting in floating stone crevices, mist rolling across suspended courtyards, forgotten relics drifting in the breeze, ruins of a lost sky civilization, crumbling gateways framing open sky, floating gardens overtaken by wild growth, ethereal light filtering through shattered stone'
      },
      '星际飞船': {
        core: 'interior of a futuristic starship',
        detail: 'futuristic starship interior, control panels with glowing lights, holographic displays, metal corridors, viewports showing stars, advanced technology, crew stations, sleek design, engine room, navigation screens, space views, sci-fi atmosphere, blinking lights, high-tech equipment, sense of space travel, futuristic architecture, glowing interfaces, deep space vista'
      },
      '异星地表': {
        core: 'alien planet surface',
        detail: 'alien planet surface, strange colored sky, unusual rock formations, alien vegetation, multiple moons, exotic colors, strange atmosphere, alien creatures, unusual terrain, glowing plants, different gravity feel, mysterious landscape, alien architecture, sense of wonder, otherworldly beauty, strange geology, exotic ecosystem, unknown world'
      },
      '未来都市': {
        core: 'futuristic city with advanced technology',
        detail: 'futuristic city, towering skyscrapers, flying vehicles, neon lights, holographic advertisements, advanced architecture, elevated walkways, clean energy, robotic elements, glass towers, night lights, sense of progress, futuristic transport, smart city, glowing buildings, high-tech atmosphere, aerial traffic, futuristic skyline'
      },
      '废弃教堂': {
        core: 'abandoned church, decaying gothic sanctuary',
        detail: 'crumbling stone walls, broken stained glass windows, fallen pews covered in dust, sagging wooden beams, ivy creeping through cracks, toppled altar, faded frescoes on ceiling, shafts of light through broken roof, cobwebs in corners, scattered prayer candles, moss on stone floor, abandoned organ, peeling paint, eerie silence, sense of forgotten faith'
      },
      '墓地': {
        core: 'quiet graveyard with weathered tombstones',
        detail: 'rows of weathered tombstones, moss-covered headstones, iron fences, ancient oak trees, fallen leaves, stone angels, overgrown grass, cracked monuments, faded inscriptions, scattered flowers, wrought iron gates, crows in trees, misty atmosphere, quiet solemnity, memorial statues, old family plots, sense of remembrance'
      },
      '暗黑宫殿': {
        core: 'dark ominous palace of shadow and power',
        detail: 'black marble halls, obsidian columns, dim torchlight, dark tapestries, shadowy throne room, gothic arches, candlelit corridors, dark red velvet, wrought iron chandeliers, portraits of dark rulers, cold stone floors, ravens perched, dark banners, mysterious atmosphere, sense of menace, shadowed alcoves, dark grandeur'
      },
      '霓虹街道': {
        core: 'vibrant neon-lit street at night',
        detail: 'glowing neon signs in every color, wet pavement reflecting lights, bustling night crowd, food stalls, glowing storefronts, colorful billboards, street performers, steam rising from vents, flickering signs, crowded sidewalks, night market energy, vibrant atmosphere, glowing store windows, colorful lights, urban nightlife'
      },
      '城市街道': {
        core: 'busy urban street with buildings and traffic',
        detail: 'tall buildings lining both sides, busy traffic, pedestrians crossing, shop fronts, street lamps, parked cars, sidewalks, crosswalks, traffic lights, store signs, trees along curb, morning light, urban energy, buses passing, people walking, city atmosphere, shop windows, bustling daytime street'
      },
      '室内': {
        core: 'generic interior room with warm lighting',
        detail: 'cozy interior room, soft warm lighting, comfortable furniture, wooden floor, large window with daylight, plants in corners, shelves with books, rug on floor, neutral walls, inviting atmosphere, homey details, natural light, simple decor, warm tones, relaxing space'
      },
      '教室': {
        core: 'school classroom with desks and blackboard',
        detail: 'rows of wooden desks, blackboard with chalk writing, teacher desk at front, windows letting in daylight, bookshelves, educational posters, globe on desk, chalk dust in air, students chairs, clock on wall, bulletin board, school supplies, bright lighting, learning atmosphere, green chalkboard, classroom windows'
      },
      '实验室': {
        core: 'modern scientific laboratory with equipment',
        detail: 'white laboratory benches, glass beakers and flasks, microscopes, test tubes, chemical bottles, scientific equipment, computers with data, safety goggles, glowing samples, clean bright lighting, lab coats, pipettes, petri dishes, high-tech instruments, sterile environment, research atmosphere, glassware, modern science lab'
      },
      '超现实空间': {
        core: 'surreal dreamlike space defying physics',
        detail: 'floating objects defying gravity, impossible geometry, melting architecture, distorted perspectives, floating staircases, upside-down rooms, shifting colors, dreamlike atmosphere, surreal landscapes, impossible structures, floating islands, warped reality, optical illusions, ethereal light, dream logic, mind-bending space'
      },
      '极简空间': {
        core: 'clean minimalist space with simple design',
        detail: 'clean white walls, simple furniture, uncluttered surfaces, natural light, neutral color palette, geometric shapes, open space, single accent piece, bare floors, large windows, sense of calm, modern design, empty space, soft shadows, simplicity, zen-like atmosphere'
      },
      '日式庭院': {
        core: 'traditional japanese courtyard garden',
        detail: 'raked gravel zen garden, stone lanterns, bonsai trees, koi pond, wooden veranda, sliding paper doors, bamboo fence, stepping stones, moss garden, maple trees, stone basin, quiet serenity, traditional architecture, seasonal plants, contemplative space, minimal design'
      },
      '银河': {
        core: 'vast galaxy with swirling star systems',
        detail: 'swirling spiral galaxy, billions of stars, colorful nebula clouds, glowing galactic core, spiral arms, star clusters, cosmic dust, deep space, distant galaxies, bright star fields, purple and blue hues, sense of cosmic scale, celestial beauty, star formation regions, vast cosmos'
      },
      '黑洞': {
        core: 'black hole with glowing accretion disk',
        detail: 'massive black hole, glowing accretion disk, light bending around event horizon, swirling matter, gravitational lensing, bright orange and blue glow, surrounding stars warped, cosmic phenomenon, intense gravity, photon ring, dark center, space distortion, awe-inspiring, luminous ring, deep space backdrop'
      },
      '星云': {
        core: 'colorful nebula cloud in deep space',
        detail: 'glowing nebula clouds, vibrant colors, swirling gas and dust, newborn stars, colorful cosmic clouds, purple and blue hues, star formation, ethereal glow, vast interstellar clouds, bright filaments, cosmic beauty, deep space, colorful gas, luminous clouds, celestial wonder'
      },
      '陨石带': {
        core: 'asteroid belt with floating space rocks',
        detail: 'countless asteroids floating in space, rocky bodies of various sizes, sunlight glinting on surfaces, craters on rocks, dust and debris, distant sun, starfield background, mining stations, drifting boulders, sense of scale, cosmic debris, rocky fragments, space rocks, vast emptiness, asteroid field'
      },
      '空间站': {
        core: 'orbiting space station in low earth orbit',
        detail: 'space station orbiting earth, solar panels gleaming, earth below, module structure, docking ports, stars in background, blue earth horizon, station lights, astronaut activity, orbital view, sunrise over earth, technical structure, space technology, earth curvature, orbital sunrise'
      },
      '月球基地': {
        core: 'lunar base on the moon surface',
        detail: 'lunar base modules on moon surface, grey regolith, earth visible in sky, solar panels, craters in distance, astronaut footprints, domed habitats, harsh shadows, moon dust, stars visible, lunar landscape, base lights, robotic rovers, desolate beauty, earthrise, moon horizon'
      },
      '火星基地': {
        core: 'mars base on red planet surface',
        detail: 'red martian landscape, base modules, domed habitats, dust storms, rocky terrain, solar panels, rovers, reddish sky, distant mountains, astronaut suits, greenhouse domes, martian rocks, sense of exploration, red planet, base structures, harsh environment'
      },
      '外星城市': {
        core: 'futuristic alien city with strange architecture',
        detail: 'alien city with strange architecture, towering spires, glowing structures, unusual colors, alien technology, floating buildings, bioluminescent lights, strange sky, exotic design, alien vehicles, otherworldly atmosphere, advanced civilization, organic architecture, glowing towers, mysterious beauty'
      },
      '绿洲': {
        core: 'lush oasis with water in desert',
        detail: 'lush green oasis, clear water pool, palm trees, desert surrounding, travelers resting, water reflection, green vegetation, date palms, cool shade, birds, sense of relief, desert contrast, spring water, peaceful spot, life in desert'
      },
      '雨林': {
        core: 'lush green rainforest with dense vegetation',
        detail: 'dense green vegetation, tall trees, hanging vines, thick canopy, humid air, colorful flowers, streams, ferns, moss, wildlife sounds, filtered sunlight, layered forest, exotic plants, mist, rich biodiversity, green atmosphere'
      },
      '沼泽': {
        core: 'murky swamp with still water and trees',
        detail: 'murky still water, cypress trees, hanging moss, reeds, fog, submerged roots, lily pads, dark water, wildlife, damp atmosphere, twisted trees, quiet, murky depths, swamp plants, mysterious mood'
      },
      '冰原': {
        core: 'vast frozen icefield with snow and ice',
        detail: 'vast frozen landscape, snow-covered ground, ice formations, cold clear air, distant mountains, blue ice, snowdrifts, pale sunlight, frozen ground, wind-carved ice, silent landscape, white expanse, ice crystals, cold beauty'
      },
      '雪山': {
        core: 'snow-capped mountain range',
        detail: 'snow-capped peaks, mountain range, clear blue sky, alpine valleys, pine forests at base, glaciers, clouds around peaks, fresh snow, rugged ridges, sunlight on snow, alpine meadow, crisp air, majestic peaks, winter landscape'
      },
      '峡谷': {
        core: 'deep canyon with layered rock walls',
        detail: 'deep canyon, layered rock walls, river at bottom, dramatic cliffs, red rock formations, winding gorge, sunlight in canyon, erosion patterns, desert vegetation, overlook, sense of depth, rock strata, natural wonder, vast scale'
      },
      '瀑布': {
        core: 'majestic waterfall with cascading water',
        detail: 'majestic waterfall, water cascading down, mist rising, pool below, surrounding rocks, lush vegetation, rainbow in mist, sound of water, spray, cliff face, green surroundings, powerful flow, natural beauty, refreshing atmosphere'
      },
      '湖泊': {
        core: 'calm lake with clear water',
        detail: 'calm lake, clear blue water, surrounding mountains, reflection on surface, trees at shore, gentle ripples, boating, peaceful atmosphere, sky reflection, sandy shore, reeds, birds, serene setting, natural beauty'
      },
      '河流': {
        core: 'flowing river through landscape',
        detail: 'flowing river, winding course, trees along banks, gentle current, reflections, rocks in water, bridges, riverside vegetation, clear water, peaceful flow, natural scenery, wildlife, sense of movement, serene landscape'
      },
      '海洋': {
        core: 'vast open ocean with waves',
        detail: 'vast open ocean, rolling waves, deep blue water, horizon, sky above, whitecaps, sea spray, distant horizon, sense of vastness, marine atmosphere, sunlight on water, endless expanse, ocean breeze, deep sea'
      },
      '海岛': {
        core: 'tropical island with beach and vegetation',
        detail: 'tropical island, white sand beach, palm trees, turquoise water, coral reef, lush vegetation, clear sky, gentle waves, island paradise, sense of escape, tropical beauty, beach, coconut palms, calm sea'
      },
      '沙滩': {
        core: 'sandy beach by the sea',
        detail: 'sandy beach, gentle waves, seashells, footprints in sand, beach umbrellas, clear water, sunny sky, beach grass, dunes, sense of relaxation, shoreline, ocean breeze, golden sand, coastal beauty'
      },
      '悬崖': {
        core: 'steep cliff overlooking sea or valley',
        detail: 'steep cliff, sheer drop, ocean below or valley, jagged rocks, wind, dramatic view, coastal cliffs, birds, sense of height, rocky edge, sea spray, dramatic landscape, exposed rock, breathtaking view'
      },
      '洞穴': {
        core: 'natural cave with rocky interior',
        detail: 'natural cave, rocky walls, stalactites, dim light from entrance, cool air, echoes, mineral deposits, underground formations, mysterious depths, rocky floor, shadows, sense of discovery, natural wonder, dark interior'
      },
      '矿山': {
        core: 'underground mine with tunnels and ore',
        detail: 'underground mine, tunnels, wooden supports, ore veins, mining carts, lanterns, rock walls, rails, tools, dim lighting, mineral deposits, sense of labor, dark passages, mining atmosphere, gold or coal veins'
      },
      '采石场': {
        core: 'open quarry with carved rock walls',
        detail: 'open quarry, carved rock walls, terraced levels, stone blocks, machinery, water pool at bottom, dust, exposed rock layers, sense of scale, industrial excavation, rock face, quarry equipment, dramatic walls'
      },
      '农场': {
        core: 'rural farm with fields and barn',
        detail: 'rural farm, green fields, red barn, farmhouse, crops, fences, animals, tractor, hay bales, garden, windmill, country road, blue sky, pastoral scene, sense of countryside, farmland, rural life'
      },
      '牧场': {
        core: 'ranch with pastures and livestock',
        detail: 'ranch, rolling pastures, cattle grazing, fences, barn, horses, ranch house, open land, hay, corral, wide sky, rural atmosphere, livestock, countryside, sense of open space, western ranch'
      },
      '葡萄园': {
        core: 'vineyard with rows of grapevines',
        detail: 'vineyard, rows of grapevines, rolling hills, ripe grapes, wine estate, trellises, harvest season, warm sunlight, countryside, winery, green leaves, sense of cultivation, pastoral beauty, vineyard landscape'
      },
      '果园': {
        core: 'orchard with fruit trees',
        detail: 'orchard, rows of fruit trees, ripe fruit, blossoms, green leaves, orchard paths, baskets of fruit, sunlight through branches, harvest, sense of abundance, fruit hanging, orchard rows, natural beauty'
      },
      '花园': {
        core: 'beautiful garden with flowers and plants',
        detail: 'beautiful garden, colorful flowers, manicured hedges, garden paths, fountain, flower beds, trees, butterflies, sunlight, sense of beauty, blooming plants, garden bench, lush greenery, peaceful retreat, floral abundance'
      },
      '温室': {
        core: 'greenhouse with glass walls and plants',
        detail: 'greenhouse, glass walls, rows of plants, warm sunlight, watering system, potted plants, tropical plants, humidity, garden tools, plant shelves, sense of growth, glass structure, lush plants, cultivation space'
      },
      '屋顶花园': {
        core: 'garden on a building rooftop',
        detail: 'rooftop garden, potted plants, city view, seating area, green space, urban oasis, planters, garden beds, skyline view, relaxing space, cityscape, greenery, sense of calm above city, rooftop terrace garden'
      },
      '天台': {
        core: 'open rooftop terrace with city view',
        detail: 'open rooftop terrace, city skyline view, railing, seating, open sky, urban view, evening lights, sense of height, outdoor space, city panorama, skyline, open air, rooftop view'
      },
      '阳台': {
        core: 'balcony with view and plants',
        detail: 'balcony, railing, potted plants, city or garden view, small seating, open air, morning light, sense of relaxation, outdoor space, hanging plants, view, cozy spot'
      },
      '阁楼': {
        core: 'attic with sloped ceiling and stored items',
        detail: 'attic, sloped ceiling, wooden beams, skylight, stored boxes, old furniture, dust, warm light, vintage items, sense of nostalgia, cobwebs, wooden floor, hidden space, cozy atmosphere'
      },
      '地下室': {
        core: 'basement with storage and dim lighting',
        detail: 'basement, concrete walls, dim lighting, stored items, shelves, pipes, stairs, cool air, storage boxes, sense of being underground, workshop area, utility space, bare walls, functional space'
      },
      '地窖': {
        core: 'underground cellar for storage',
        detail: 'underground cellar, stone walls, shelves, stored goods, cool temperature, dim light, barrels, preserved food, earthen floor, sense of storage, rustic atmosphere, underground room, old storage'
      },
      '酒窖': {
        core: 'wine cellar with racks of bottles',
        detail: 'wine cellar, wooden racks of wine bottles, stone walls, dim warm lighting, barrels, tasting table, cool atmosphere, arched ceiling, sense of aging, wine collection, rustic elegance, bottles lined up'
      },
      '仓库': {
        core: 'large warehouse with shelves and goods',
        detail: 'large warehouse, tall shelves, stacked goods, forklift, concrete floor, metal racks, loading dock, boxes, industrial lighting, sense of scale, storage space, pallets, warehouse aisles, functional space'
      },
      '工厂': {
        core: 'industrial factory with machinery',
        detail: 'industrial factory, large machinery, assembly line, conveyor belts, metal structures, workers, bright industrial lighting, pipes, production equipment, sense of industry, factory floor, mechanical parts, manufacturing atmosphere'
      },
      '车间': {
        core: 'workshop with tools and workbench',
        detail: 'workshop, workbench, tools on wall, machinery, wood or metal, sawdust, parts, task lighting, sense of craftsmanship, work area, equipment, hand tools, workshop atmosphere, creative space'
      },
      '码头': {
        core: 'wooden pier extending over water',
        detail: 'wooden pier, extending over water, boats moored, fishing, water lapping, posts, sense of calm, harbor view, seagulls, weathered wood, pier planks, water reflections, coastal atmosphere'
      },
      '港口': {
        core: 'harbor with ships and docks',
        detail: 'harbor, ships docked, cranes, containers, water, warehouses, busy activity, sea, boats, sense of trade, harbor lights, docks, maritime atmosphere, ships at anchor'
      },
      '火车站': {
        core: 'train station with platforms and tracks',
        detail: 'train station, platforms, train tracks, trains, station hall, ticket booths, signs, passengers, large windows, clock, sense of travel, station architecture, departure boards, railway atmosphere'
      },
      '机场': {
        core: 'airport terminal with planes and gates',
        detail: 'airport terminal, departure gates, airplanes on runway, large windows, check-in counters, travelers, moving walkways, control tower, sense of travel, terminal architecture, luggage, flight boards, aviation atmosphere'
      },
      '地铁站': {
        core: 'subway station with platforms and trains',
        detail: 'subway station, platforms, subway trains, tiled walls, signs, passengers, tracks, lighting, sense of transit, underground station, turnstiles, maps, urban transit atmosphere'
      },
      '公交站': {
        core: 'bus stop with shelter and sign',
        detail: 'bus stop, shelter, bus sign, bench, waiting passengers, road, city street, timetable, sense of waiting, urban scene, bus approaching, street view, public transit'
      },
      '停车场': {
        core: 'parking lot with parked cars',
        detail: 'parking lot, rows of parked cars, painted lines, lighting, concrete surface, sense of urban space, vehicles, parking spaces, street lights, empty spaces, functional area'
      },
      '加油站': {
        core: 'gas station with fuel pumps',
        detail: 'gas station, fuel pumps, canopy, convenience store, cars fueling, signs, bright lighting, sense of travel, roadside, fuel prices, pump displays, highway stop'
      },
      '便利店': {
        core: 'convenience store with shelves and counter',
        detail: 'convenience store, shelves of goods, checkout counter, refrigerators, snacks, bright lighting, sense of convenience, storefront, products, sliding doors, urban convenience, small shop'
      },
      '超市': {
        core: 'supermarket with aisles of products',
        detail: 'supermarket, aisles of shelves, products, shopping carts, checkout lanes, produce section, bright lighting, sense of shopping, food displays, customers, supermarket layout, retail atmosphere'
      },
      '商场': {
        core: 'shopping mall with stores and escalators',
        detail: 'shopping mall, multiple floors, stores, escalators, glass atrium, food court, shoppers, sense of commerce, bright lighting, storefronts, central hall, retail atmosphere, modern mall'
      },
      '市场': {
        core: 'market with stalls and goods',
        detail: 'market, stalls, goods on display, vendors, shoppers, fresh produce, fabrics, sense of commerce, bustling atmosphere, market tables, colorful goods, trade, lively scene'
      },
      '集市': {
        core: 'bazaar with colorful stalls',
        detail: 'bazaar, colorful stalls, exotic goods, vendors, narrow aisles, spices, crafts, sense of trade, bustling, colorful fabrics, lanterns, market atmosphere, cultural richness'
      },
      '广场': {
        core: 'open public plaza with buildings around',
        detail: 'open plaza, paved ground, buildings around, fountain, benches, people, sense of public space, city center, statues, open area, gathering place, urban square'
      },
      '喷泉': {
        core: 'fountain with flowing water',
        detail: 'fountain, flowing water, central feature, water spray, pool, surrounding area, sense of beauty, water sounds, sculptures, plaza setting, refreshing, water jets, decorative fountain'
      },
      '公园': {
        core: 'park with trees, lawns and paths',
        detail: 'park, green lawns, trees, walking paths, benches, flower beds, pond, sense of relaxation, open space, nature in city, playground, park atmosphere, greenery, peaceful retreat'
      },
      '游乐场': {
        core: 'amusement park with rides and attractions',
        detail: 'amusement park, roller coasters, ferris wheel, rides, colorful attractions, crowds, food stalls, sense of fun, bright lights, carnival atmosphere, games, festive mood, excitement'
      },
      '动物园': {
        core: 'zoo with animal enclosures',
        detail: 'zoo, animal enclosures, exotic animals, walking paths, signs, visitors, habitats, sense of wildlife, animal exhibits, zoo architecture, greenery, educational atmosphere'
      },
      '水族馆': {
        core: 'aquarium with large tanks of sea life',
        detail: 'aquarium, large glass tanks, colorful fish, underwater tunnels, marine life, blue lighting, visitors, sense of wonder, coral displays, sharks, ocean exhibits, aquatic atmosphere'
      },
      '博物馆': {
        core: 'museum with exhibits and artifacts',
        detail: 'museum, exhibits, artifacts, display cases, grand hall, artwork, sense of history, visitors, marble floors, columns, lighting, cultural atmosphere, exhibits, educational space'
      },
      '美术馆': {
        core: 'art gallery with paintings on walls',
        detail: 'art gallery, paintings on walls, white walls, track lighting, sculptures, visitors, sense of art, gallery space, framed works, viewing benches, artistic atmosphere, curated exhibits'
      },
      '剧院': {
        core: 'theater with stage and seating',
        detail: 'theater, stage, red curtains, tiered seating, spotlights, sense of performance, ornate decor, orchestra pit, velvet seats, dramatic lighting, stage lights, theatrical atmosphere'
      },
      '电影院': {
        core: 'cinema with screen and seats',
        detail: 'cinema, large screen, rows of seats, dim lighting, projector, sense of film, red seats, aisle, screen glow, movie atmosphere, dark room, cinema hall'
      },
      '音乐厅': {
        core: 'concert hall with stage and acoustics',
        detail: 'concert hall, stage, orchestra seating, acoustic design, warm lighting, sense of music, grand hall, audience seating, wooden panels, performance space, elegant atmosphere'
      },
      '歌剧院': {
        core: 'grand opera house with ornate interior',
        detail: 'opera house, grand interior, ornate decor, chandeliers, red velvet, tiered balconies, stage, sense of grandeur, gold details, opera seating, dramatic lighting, elegant architecture'
      },
      '书店': {
        core: 'bookstore with shelves of books',
        detail: 'bookstore, shelves of books, reading nooks, warm lighting, wooden shelves, sense of knowledge, book displays, cozy atmosphere, browsing, stacks of books, literary atmosphere'
      },
      '文具店': {
        core: 'stationery store with writing supplies',
        detail: 'stationery store, pens and notebooks, shelves of supplies, colorful items, sense of creativity, paper goods, art supplies, organized displays, writing tools, bright store'
      },
      '花店': {
        core: 'flower shop with fresh flowers',
        detail: 'flower shop, fresh flowers, bouquets, buckets of blooms, floral scent, sense of beauty, greenery, flower arrangements, shopfront, colorful petals, romantic atmosphere'
      },
      '面包店': {
        core: 'bakery with fresh bread and pastries',
        detail: 'bakery, fresh bread, pastries, display cases, warm aroma, wooden shelves, sense of warmth, baked goods, flour dust, cozy atmosphere, bread loaves, delicious display'
      },
      '咖啡店': {
        core: 'coffee shop with coffee and seating',
        detail: 'coffee shop, coffee bar, espresso machine, seating, warm lighting, sense of comfort, coffee aroma, pastries, wooden tables, cozy atmosphere, barista, coffee cups, relaxing space'
      },
      '茶馆': {
        core: 'tea house with tea and traditional setting',
        detail: 'tea house, tea sets, traditional setting, wooden furniture, tea leaves, sense of calm, teapots, warm atmosphere, tea ceremony, quiet space, traditional decor, relaxing'
      },
      '酒吧': {
        core: 'bar with drinks and dim lighting',
        detail: 'bar, counter, bottles, stools, dim lighting, sense of nightlife, drinks, music, bartender, moody atmosphere, neon glow, social space, bar stools, evening vibe'
      },
      '餐厅': {
        core: 'restaurant with tables and dining area',
        detail: 'restaurant, dining tables, chairs, warm lighting, sense of dining, set tables, kitchen view, ambiance, menu, comfortable seating, restaurant decor, inviting atmosphere'
      },
      '极地冰洞': {
        core: 'polar ice cave with glowing blue ice formations',
        detail: 'crystalline ice cave carved by ancient glaciers, translucent blue ice walls glowing from within, icicles hanging like crystal chandeliers, frozen underground lake reflecting pale light, ice pillars supporting the cavern roof, delicate frost patterns on every surface, cold air shimmering with ice crystals, hidden chambers of pure blue ice, light filtering through the frozen ceiling, sense of frozen wonder and isolation'
      },
      '荧光海滩': {
        core: 'bioluminescent beach with glowing blue waves',
        detail: 'night beach where waves glow electric blue, bioluminescent plankton lighting up the surf, glowing footprints left in wet sand, dark ocean sparkling with living light, gentle waves breaking into ribbons of blue, starry sky reflecting on glowing water, sense of magic and wonder, luminous foam on the shoreline, quiet night with glowing tide, ethereal blue light painting the beach'
      },
      '红杉巨林': {
        core: 'giant redwood forest with towering ancient trees',
        detail: 'ancient redwood trees reaching hundreds of feet into the sky, massive trunks wider than houses, soft filtered light through the high canopy, thick carpet of fallen needles on the ground, morning mist drifting between colossal trunks, ferns and moss at the forest floor, sense of awe at nature scale, quiet stillness broken by birdsong, shafts of golden light piercing the canopy, ancient forest older than civilizations'
      },
      '盐沼镜面': {
        core: 'salt flat mirror reflecting the sky perfectly',
        detail: 'vast white salt flat flooded with a thin layer of water, perfect mirror reflection of the sky, endless horizon blending earth and sky, salt crystals sparkling like snow, clouds reflected on the glassy surface, sense of walking on the sky, brilliant white expanse stretching to infinity, sunset painting the mirrored world in gold and pink, surreal optical illusion, absolute stillness and silence'
      },
      '蓝洞深渊': {
        core: 'deep blue hole in the ocean with crystal clear water',
        detail: 'circular blue hole in the ocean, deep sapphire water dropping into darkness, ring of coral reef surrounding the edge, sunbeams penetrating the clear water, divers descending into the blue void, marine life circling the rim, sense of mystery and depth, turquoise shallows fading to deep blue, underwater stalactites in the depths, dramatic contrast of colors'
      },
      '彩虹瀑布': {
        core: 'majestic waterfall with permanent rainbow in the mist',
        detail: 'towering waterfall cascading into a deep pool, permanent rainbow forming in the spray, mist rising like clouds, lush green cliffs on both sides, sunlight refracting through water droplets, sound of thundering water, cool refreshing air, moss-covered rocks at the base, double rainbow in the mist, sense of natural wonder and beauty'
      },
      '石林迷宫': {
        core: 'stone forest maze of towering rock pillars',
        detail: 'dense forest of tall stone pillars rising from the ground, narrow passages winding between rock towers, weathered limestone formations, scattered trees growing between the stones, mist weaving through the pillars, sense of being lost in a stone labyrinth, dramatic shadows at sunset, ancient rock formations carved by time, hidden clearings between the stones, mysterious atmosphere'
      },
      '火山温泉': {
        core: 'volcanic hot spring with steaming thermal pools',
        detail: 'natural hot springs surrounded by volcanic rock, steaming thermal pools with mineral water, milky blue and turquoise water, terraced travertine formations, steam rising into the air, geothermal vents nearby, lush vegetation around the warm pools, sense of relaxation and healing, dramatic volcanic landscape, warm mist enveloping the scene'
      },
      '珊瑚环礁': {
        core: 'coral atoll with turquoise lagoon',
        detail: 'ring-shaped coral atoll surrounding a turquoise lagoon, vibrant coral reefs just below the surface, colorful tropical fish swimming in clear water, white sand islands on the reef, gentle waves lapping the shore, palm trees on the islets, sense of tropical paradise, crystal clear water, diverse marine life, sun-drenched beauty'
      },
      '冰川峡谷': {
        core: 'glacier canyon with towering ice walls',
        detail: 'narrow canyon carved between massive glaciers, towering walls of blue ice, crevasses and ice formations, meltwater streams at the bottom, sense of scale and power, sunlight reflecting off the ice, crisp cold air, ice crystals sparkling, distant glacier peaks, awe-inspiring frozen landscape'
      },
      '沙漠星空': {
        core: 'desert night with brilliant starry sky',
        detail: 'vast desert under a brilliant night sky, thousands of stars visible in the clear air, milky way stretching overhead, sand dunes glowing in moonlight, shooting stars streaking across, sense of solitude and wonder, cool desert night, campfire glow in the distance, star reflections on the sand, breathtaking cosmic view'
      },
      '云海日出': {
        core: 'sunrise above a sea of clouds',
        detail: 'standing above a sea of clouds at sunrise, golden light spreading over the cloud tops, sun rising over the horizon, cloud sea glowing pink and gold, mountain peaks emerging from the clouds, sense of elevation and peace, soft morning light, drifting cloud formations, breathtaking vista, serene and majestic atmosphere'
      },
      '溶洞暗河': {
        core: 'underground river flowing through a limestone cave',
        detail: 'dark underground river flowing through a limestone cave, crystal clear water reflecting cave walls, stalactites hanging overhead, boat drifting through the darkness, bioluminescent glow in the water, echoes of dripping water, hidden chambers along the river, ancient rock formations, sense of mystery and discovery, cool damp air'
      },
      '潮汐森林': {
        core: 'tidal forest flooded by rising sea water',
        detail: 'coastal forest flooded by the rising tide, tree trunks standing in clear sea water, reflections of trees on the water surface, small boats floating between trunks, sunlight filtering through the canopy, sense of nature transition, calm water between the trees, birds perched on branches, peaceful flooded woodland, unique ecosystem'
      },
      '陨石坑湖': {
        core: 'crater lake formed by a meteor impact',
        detail: 'circular crater lake formed by an ancient meteor impact, deep blue water filling the bowl, steep crater walls rising around, sense of cosmic history, clear pristine water, surrounding rim of rock, dramatic scale, reflections of the sky, peaceful isolated setting, geological wonder'
      },
      '间歇喷泉': {
        core: 'geyser field with erupting hot springs',
        detail: 'geothermal field with erupting geysers, columns of boiling water shooting into the air, steaming pools of mineral water, colorful mineral deposits, boardwalks winding through the field, sense of earth power, steam rising everywhere, bubbling mud pots, dramatic eruptions, otherworldly landscape'
      },
      '萤火虫山谷': {
        core: 'valley filled with glowing fireflies at night',
        detail: 'dark valley filled with thousands of glowing fireflies, tiny lights drifting through the air, trees outlined by the glow, sense of magic and wonder, gentle summer night, fireflies rising from the grass, soft green-gold light, peaceful and enchanting, natural light show, dreamlike atmosphere'
      },
      '粉红湖泊': {
        core: 'pink lake with vivid rose-colored water',
        detail: 'lake with vivid pink water caused by algae, surreal rose-colored surface, white salt crystals at the edge, sense of wonder at the unusual color, calm mirror-like water, pink water reflecting the sky, salt flats surrounding, striking natural phenomenon, dreamlike beauty'
      },
      '白色沙漠': {
        core: 'white desert with chalk-white sand dunes',
        detail: 'desert of pure white sand dunes, chalk-white sand stretching to the horizon, wind-carved ripples on the surface, sense of pristine beauty, bright sunlight reflecting off the white sand, sparse hardy plants, dramatic shadows, surreal landscape, quiet and vast, otherworldly whiteness'
      },
      '极光雪原': {
        core: 'snowfield under dancing aurora borealis',
        detail: 'vast snowfield under dancing aurora borealis, green and purple ribbons of light in the sky, snow sparkling under the aurora, sense of frozen wonder, cold clear night, aurora reflecting on the snow, distant mountains, starry sky above the lights, breathtaking celestial display, silent frozen landscape'
      },
      '江南水乡': {
        core: 'classic jiangnan water town with canals and bridges',
        detail: 'classic water town of southern china, narrow canals winding between white-walled houses, arched stone bridges crossing the water, gondola-like boats drifting along, willow trees overhanging the canals, red lanterns glowing at dusk, stone-paved alleyways, traditional tiled roofs, sense of timeless charm, reflections in the calm water'
      },
      '罗马斗兽场': {
        core: 'ancient roman colosseum arena',
        detail: 'massive ancient roman amphitheater, tiered stone seating rising in arches, central arena floor, crumbling outer walls, sense of ancient spectacle, arched corridors and passages, stone columns, historical grandeur, sunlight streaming through broken arches, echoes of ancient crowds, monumental architecture'
      },
      '空中花园': {
        core: 'hanging gardens with cascading plants and terraces',
        detail: 'terraced gardens with cascading plants, lush greenery spilling over stone terraces, waterfalls flowing between levels, exotic flowers and trees, sense of ancient wonder, stone stairways, climbing vines, mist from the waterfalls, tropical plants, breathtaking vertical garden'
      },
      '地下城邦': {
        core: 'underground city-state carved beneath the earth',
        detail: 'vast underground city carved into rock, carved stone buildings and plazas, glowing crystals providing light, underground rivers and canals, bridges spanning chasms, market districts, torch-lit streets, sense of hidden civilization, ancient carved architecture, warm glow in the darkness'
      },
      '长城烽火台': {
        core: 'great wall beacon tower on a mountain ridge',
        detail: 'ancient beacon tower on the great wall, stone watchtower on a mountain ridge, wall winding across the peaks, sense of history and defense, misty mountains in the distance, weathered stone, banners on the tower, dramatic mountain scenery, sense of ancient frontier, panoramic view'
      },
      '泰姬陵': {
        core: 'white marble mausoleum with domes and minarets',
        detail: 'iconic white marble mausoleum, central dome and four minarets, reflecting pool in front, intricate marble inlay work, symmetrical gardens, sense of love and grandeur, marble glowing in sunlight, arched entrances, ornate details, serene and majestic'
      },
      '金字塔': {
        core: 'ancient pyramid in the desert',
        detail: 'massive ancient pyramid rising from the desert, limestone blocks stacked in steps, sense of ancient mystery, desert sand surrounding, camel caravans in the distance, golden light on the stone, sphinx nearby, sense of timeless wonder, monumental scale, ancient civilization'
      },
      '埃菲尔铁塔': {
        core: 'eiffel tower with lattice iron structure',
        detail: 'iconic iron lattice tower, soaring structure with observation decks, sense of paris and romance, lights glowing at night, surrounding cityscape, park below, elegant curves, sense of landmark, sparkling lights, iconic silhouette'
      },
      '大本钟': {
        core: 'big ben clock tower in london',
        detail: 'iconic gothic clock tower, ornate clock face, sense of london and history, surrounding parliament buildings, river in the distance, chimes echoing, stone architecture, sense of landmark, classic british scene, historic atmosphere'
      },
      '凯旋门': {
        core: 'arc de triomphe with grand arch',
        detail: 'grand triumphal arch, single massive archway, carved reliefs on the stone, sense of victory and history, radiating avenues, eternal flame, sense of paris, monumental scale, historic grandeur, iconic landmark'
      },
      '圣托里尼': {
        core: 'santorini white buildings with blue domes',
        detail: 'white-washed buildings with blue domes on a cliff, caldera view of the sea, narrow cobblestone streets, sense of greek island charm, bougainvillea flowers, blue and white color scheme, sunset over the sea, sense of paradise, cliffside terraces, mediterranean beauty'
      },
      '威尼斯运河': {
        core: 'venice canal with gondolas and bridges',
        detail: 'canal winding through venice, gondolas gliding on the water, arched bridges crossing, historic buildings along the water, sense of romance, reflections on the canal, stone facades, sense of timeless beauty, water lapping against walls, iconic venetian scene'
      },
      '京都老街': {
        core: 'traditional kyoto old street with wooden machiya',
        detail: 'traditional kyoto street with wooden machiya houses, paper lanterns glowing, stone-paved path, sense of japanese history, tea houses, kimono-clad figures, cherry blossom branches, quiet historic atmosphere, traditional architecture, nostalgic charm'
      },
      '徽派古村': {
        core: 'huizhou ancient village with white walls and black tiles',
        detail: 'ancient huizhou village, white walls with black tiled roofs, horse-head walls, stone-paved lanes, ancestral halls, sense of chinese tradition, ponds and bridges, carved wooden details, misty mountains behind, timeless rural charm, ink-painting scenery'
      },
      '吊脚楼': {
        core: 'stilt house village on a riverbank',
        detail: 'traditional stilt houses raised on wooden pillars, village on a riverbank, houses overhanging the water, sense of mountain life, wooden construction, river flowing beneath, misty mountains, boats below, traditional architecture, scenic riverside village'
      },
      '窑洞民居': {
        core: 'cave dwelling carved into a loess cliff',
        detail: 'traditional cave dwellings carved into a yellow loess cliff, arched cave entrances, sense of ancient living, earthen walls, paper windows, courtyards in front, sense of simplicity, warm lantern light, loess plateau landscape, traditional rural life'
      },
      '四合院': {
        core: 'traditional chinese courtyard house',
        detail: 'traditional beijing courtyard house, central courtyard surrounded by rooms, wooden lattice windows, sense of chinese tradition, stone paths, potted plants, red pillars, sense of family life, quiet inner courtyard, historic architecture, peaceful atmosphere'
      },
      '摩天大楼': {
        core: 'modern skyscraper towering over the city',
        detail: 'towering glass skyscraper, reflective glass facade, sense of modern city, reaching into the clouds, surrounding cityscape, sense of ambition and scale, glass and steel, dramatic height, city views, iconic modern architecture'
      },
      '悬空寺': {
        core: 'hanging temple built into a cliff face',
        detail: 'ancient temple built into a sheer cliff face, wooden structures suspended on the rock, sense of wonder and faith, mountain mist below, narrow walkways, sense of daring architecture, stone and wood, breathtaking location, historic marvel'
      },
      '佛塔': {
        core: 'buddhist pagoda with tiered roofs',
        detail: 'tall buddhist pagoda with tiered roofs, sense of spirituality, ornate carvings, bells hanging from the eaves, surrounding temple grounds, sense of peace, historic architecture, golden accents, serene atmosphere, cultural heritage'
      },
      '精灵树屋': {
        core: 'elven treehouse built into a giant tree',
        detail: 'elegant treehouse built into a giant ancient tree, winding wooden stairways around the trunk, glowing lanterns hanging from branches, sense of elven grace, curved organic architecture, hanging gardens, soft green light, mystical atmosphere, forest canopy home'
      },
      '机械巨城': {
        core: 'giant mechanical city of gears and pistons',
        detail: 'colossal city built of gears and pistons, giant cogwheels turning, steam and gears everywhere, mechanical towers, sense of industrial power, moving machinery, brass and iron, clockwork streets, sense of a living machine, monumental engineering'
      },
      '时间裂缝': {
        core: 'time rift with swirling temporal energy',
        detail: 'glowing rift in reality where time distorts, swirling temporal energy, fragments of different eras visible, sense of mystery and danger, floating debris frozen in time, warped light, cracked reality, sense of the impossible, cosmic phenomenon'
      },
      '魔法学院': {
        core: 'magic academy with towers and floating candles',
        detail: 'grand magic academy, tall towers with glowing windows, floating candles in the halls, sense of learning and wonder, moving staircases, spell books and potions, enchanted ceiling, sense of mystery, young mages, magical atmosphere'
      },
      '精灵王国': {
        core: 'elven kingdom with elegant architecture',
        detail: 'elegant elven kingdom, graceful architecture among ancient trees, glowing crystal lights, sense of timeless beauty, flowing waterfalls, ethereal atmosphere, luminous plants, sense of harmony with nature, majestic halls, magical serenity'
      },
      '矮人矿城': {
        core: 'dwarven mining city carved in stone',
        detail: 'dwarven city carved into a mountain, massive stone halls, glowing forges, sense of craftsmanship, deep mines, stone pillars, warm firelight, sense of strength and tradition, carved runes, underground grandeur'
      },
      '巨人国度': {
        core: 'giant realm with oversized objects',
        detail: 'land of giants with oversized objects, enormous furniture and tools, sense of scale, giant footprints, massive structures, clouds at the level of the giants, sense of wonder, huge trees, oversized everything, mythical atmosphere'
      },
      '妖精花园': {
        core: 'fairy garden with tiny glowing flowers',
        detail: 'enchanted garden of the fairies, tiny glowing flowers, miniature houses, sense of magic, sparkling dust, delicate wings, soft pastel colors, sense of wonder, hidden nooks, ethereal light, whimsical atmosphere'
      },
      '幽灵船': {
        core: 'ghost ship drifting in the mist',
        detail: 'haunted ghost ship drifting in the fog, tattered sails, eerie green glow, sense of the supernatural, abandoned deck, ghostly figures, creaking wood, misty sea, sense of dread, spectral atmosphere, cursed vessel'
      },
      '恶魔城堡': {
        core: 'demon castle of dark stone and fire',
        detail: 'dark castle of black stone, fire and brimstone, sense of evil, jagged towers, glowing red windows, demonic statues, sense of menace, dark banners, molten rock, ominous atmosphere, forbidden fortress'
      },
      '天使圣域': {
        core: 'angelic sanctuary of light and marble',
        detail: 'radiant sanctuary of white marble and light, golden rays, sense of the divine, glowing halos, white feathers, sense of peace, celestial architecture, soft light, angelic figures, holy atmosphere'
      },
      '神话迷宫': {
        core: 'mythical labyrinth with ancient puzzles',
        detail: 'ancient labyrinth of stone walls, winding passages, sense of myth and legend, hidden traps, carved reliefs, sense of mystery, minotaur legends, torchlit corridors, ancient puzzles, legendary atmosphere'
      },
      '梦境世界': {
        core: 'dream world with surreal floating elements',
        detail: 'surreal dream world, floating islands and objects, shifting colors, sense of the subconscious, impossible landscapes, soft glowing light, dreamlike logic, ethereal beauty, sense of wonder, ever-changing scenery'
      },
      '镜中世界': {
        core: 'mirror world with reflective surfaces everywhere',
        detail: 'world of mirrors and reflections, endless reflective surfaces, sense of illusion, mirrored floors and walls, infinite reflections, sense of disorientation, distorted images, glass and silver, surreal atmosphere, mysterious depths'
      },
      '糖果王国': {
        core: 'candy kingdom made of sweets',
        detail: 'whimsical kingdom made of candy, gingerbread houses, candy canes, sense of sweetness, frosting and sugar, lollipop trees, chocolate rivers, sense of fun, pastel colors, delicious fantasy, playful atmosphere'
      },
      '玩具世界': {
        core: 'toy world with oversized toys',
        detail: 'world of oversized toys, giant teddy bears, toy blocks, sense of childhood, colorful plastic, toy trains, sense of fun, playful colors, dollhouses, whimsical atmosphere, childhood wonder'
      },
      '书之世界': {
        core: 'world inside a book with paper landscapes',
        detail: 'fantasy world made of books and paper, paper landscapes, giant books, sense of imagination, floating pages, ink drawings, sense of literature, paper trees, letters and words, literary atmosphere, creative wonder'
      },
      '时钟王国': {
        core: 'clockwork kingdom of gears and time',
        detail: 'kingdom of clockwork and time, giant clocks, turning gears, sense of precision, mechanical birds, brass and gold, sense of time, ticking everywhere, ornate mechanisms, steampunk elegance, orderly wonder'
      },
      '蒸汽飞艇': {
        core: 'steam airship floating in the sky',
        detail: 'grand steam airship floating in the sky, brass and copper hull, giant propellers, sense of adventure, steam vents, canvas sails, sense of flight, clouds below, elegant design, sky travel, adventurous atmosphere'
      },
      '天空海盗船': {
        core: 'sky pirate ship sailing through clouds',
        detail: 'pirate ship sailing through the sky, billowing sails, sense of adventure, floating islands below, cannon decks, sense of freedom, clouds parting, treasure maps, swashbuckling atmosphere, airborne vessel'
      },
      '量子实验室': {
        core: 'quantum laboratory with glowing particle experiments',
        detail: 'futuristic quantum laboratory, glowing particle accelerators, holographic displays, sense of cutting-edge science, entangled particles visualized, quantum computers, sense of discovery, sleek white surfaces, energy fields, advanced research'
      },
      '全息竞技场': {
        core: 'holographic arena for virtual combat',
        detail: 'futuristic arena with holographic displays, virtual combat platforms, sense of competition, glowing grids, digital scoreboards, sense of the future, spectator holograms, neon accents, high-tech spectacle, virtual battles'
      },
      '人工智能核心': {
        core: 'artificial intelligence core with glowing neural network',
        detail: 'central chamber of an artificial intelligence, glowing neural network, sense of intelligence, data streams, holographic brain, sense of power, blue and white light, server arrays, sense of the future, digital consciousness, awe-inspiring'
      },
      '数据云海': {
        core: 'sea of data visualized as glowing clouds',
        detail: 'vast sea of data visualized as glowing clouds, streams of information, sense of the digital age, floating code, sense of scale, luminous data streams, holographic charts, sense of connectivity, digital landscape, futuristic atmosphere'
      },
      '赛博格工厂': {
        core: 'cyborg factory assembling robotic parts',
        detail: 'futuristic factory assembling cyborg parts, robotic arms, sense of technology, conveyor belts of components, neon lights, sense of the future, biomechanical parts, glowing circuits, industrial precision, cyberpunk atmosphere'
      },
      '纳米工厂': {
        core: 'nanotech factory with microscopic machinery',
        detail: 'futuristic nanotech facility, microscopic machinery visualized, sense of precision, glowing particles, sense of the future, assembly at tiny scale, holographic displays, clean white surfaces, sense of innovation, advanced manufacturing'
      },
      '基因实验室': {
        core: 'gene laboratory with dna experiments',
        detail: 'modern genetic laboratory, glowing dna strands, sense of science, test tubes and petri dishes, sense of discovery, holographic genomes, lab equipment, sense of the future, biotech research, scientific atmosphere'
      },
      '机器人城市': {
        core: 'robot city with autonomous machines',
        detail: 'city populated by robots, autonomous machines moving about, sense of the future, robotic architecture, sense of automation, glowing sensors, metal and glass, sense of progress, robot citizens, futuristic society'
      },
      '虚拟现实空间': {
        core: 'virtual reality space with digital landscapes',
        detail: 'immersive virtual reality space, digital landscapes, sense of simulation, glowing grids, sense of the future, avatars, neon environments, sense of immersion, digital worlds, futuristic atmosphere'
      },
      '无人机基地': {
        core: 'drone base with hovering aircraft',
        detail: 'military drone base, rows of hovering drones, sense of technology, control towers, sense of the future, landing pads, glowing lights, sense of precision, aerial vehicles, high-tech facility'
      },
      '太空电梯': {
        core: 'space elevator rising from earth to orbit',
        detail: 'colossal space elevator rising from earth to orbit, cable stretching into the sky, sense of the future, elevator cars ascending, sense of scale, clouds far below, orbital station at the top, sense of wonder, engineering marvel'
      },
      '深空探测器': {
        core: 'deep space probe flying through the void',
        detail: 'deep space probe flying through the void, solar panels gleaming, sense of exploration, distant stars, sense of solitude, instrument dishes, sense of discovery, cosmic backdrop, scientific mission, vast emptiness'
      },
      '火星温室': {
        core: 'mars greenhouse dome growing plants',
        detail: 'greenhouse dome on mars growing plants, red landscape outside, sense of the future, rows of crops, sense of life, glass dome, hydroponic systems, sense of survival, martian soil, pioneering atmosphere'
      },
      '月球采矿基地': {
        core: 'lunar mining base extracting resources',
        detail: 'lunar mining base on the moon, mining equipment, sense of industry, grey regolith, sense of the future, earth in the sky, extraction machines, sense of resource, harsh shadows, pioneering atmosphere'
      },
      '量子计算机房': {
        core: 'quantum computer room with cryogenic systems',
        detail: 'futuristic quantum computer room, cryogenic cooling systems, sense of cutting-edge tech, glowing control panels, sense of the future, gold and blue accents, sense of power, advanced computing, scientific atmosphere'
      },
      '仿生实验室': {
        core: 'bionic laboratory developing artificial limbs',
        detail: 'modern bionic laboratory, artificial limbs on display, sense of science, robotic prosthetics, sense of the future, testing equipment, sense of innovation, sleek design, medical technology, advanced research'
      },
      '全息投影厅': {
        core: 'holographic projection hall with 3d displays',
        detail: 'hall filled with holographic projections, 3d displays floating in the air, sense of the future, interactive holograms, sense of wonder, glowing images, sense of technology, immersive displays, futuristic atmosphere'
      },
      '智能家居': {
        core: 'smart home with automated systems',
        detail: 'modern smart home with automated systems, voice-controlled lighting, sense of the future, smart appliances, sense of convenience, touch panels, sense of comfort, sleek design, automated blinds, futuristic living'
      },
      '自动驾驶城市': {
        core: 'autonomous city with self-driving vehicles',
        detail: 'city with self-driving vehicles, autonomous cars moving smoothly, sense of the future, smart traffic, sense of efficiency, electric vehicles, sense of progress, connected roads, futuristic transport, orderly city'
      },
      '外骨骼工厂': {
        core: 'exoskeleton factory building power suits',
        detail: 'factory building robotic exoskeletons, power suits on assembly lines, sense of the future, mechanical parts, sense of power, glowing joints, sense of industry, high-tech manufacturing, futuristic atmosphere'
      },
      '深夜便利店': {
        core: 'late night convenience store glowing in the dark',
        detail: 'convenience store open late at night, bright fluorescent lights, sense of the night, shelves of goods, sense of solitude, night worker, glowing storefront, sense of comfort, quiet street, urban nightlife'
      },
      '老式理发店': {
        core: 'old-fashioned barbershop with vintage chairs',
        detail: 'vintage barbershop, old leather barber chairs, sense of nostalgia, striped pole outside, sense of tradition, mirrors and combs, warm lighting, sense of craft, classic decor, retro atmosphere'
      },
      '天台花园': {
        core: 'rooftop garden with plants and city view',
        detail: 'garden on a rooftop, potted plants and flowers, sense of calm, city skyline view, sense of escape, seating area, sense of nature above the city, greenery, relaxing space, urban oasis'
      },
      '街角书店': {
        core: 'cozy corner bookstore with wooden shelves',
        detail: 'cozy bookstore on a street corner, wooden shelves of books, sense of warmth, reading nooks, sense of knowledge, warm lighting, sense of charm, stacks of books, inviting atmosphere, literary haven'
      },
      '深夜食堂': {
        core: 'late night diner serving warm food',
        detail: 'small diner open late at night, warm food on the counter, sense of comfort, steam rising from dishes, sense of the night, regular customers, warm lighting, sense of community, cozy atmosphere, night hospitality'
      },
      '老茶馆': {
        core: 'old teahouse with traditional tea ceremony',
        detail: 'traditional old teahouse, wooden tables, sense of tradition, tea ceremony, sense of calm, porcelain teapots, sense of history, warm atmosphere, tea aroma, quiet conversation, nostalgic charm'
      },
      '复古照相馆': {
        core: 'vintage photo studio with old cameras',
        detail: 'vintage photography studio, old cameras on tripods, sense of nostalgia, backdrops and props, sense of history, sepia tones, warm lighting, sense of craft, classic portraits, retro atmosphere'
      },
      '唱片店': {
        core: 'record store with vinyl albums',
        detail: 'record store filled with vinyl albums, crates of records, sense of music, turntables, sense of nostalgia, album covers on walls, warm lighting, sense of discovery, listening booths, retro atmosphere'
      },
      '旧书店': {
        core: 'used bookstore with old books',
        detail: 'used bookstore filled with old books, shelves of vintage volumes, sense of history, musty paper smell, sense of discovery, worn covers, warm lighting, sense of nostalgia, hidden treasures, literary atmosphere'
      },
      '花鸟市场': {
        core: 'flower and bird market with plants and cages',
        detail: 'lively market selling flowers and birds, colorful blooms, sense of life, bird cages, sense of tradition, potted plants, sense of vibrancy, chirping birds, bustling stalls, cultural atmosphere'
      },
      '夜市': {
        core: 'night market with food stalls and lights',
        detail: 'vibrant night market, food stalls with glowing lights, sense of energy, street food, sense of community, colorful lanterns, sense of fun, crowds, sizzling food, festive atmosphere'
      },
      '早市': {
        core: 'morning market with fresh produce',
        detail: 'morning market with fresh produce, stalls of vegetables and fruit, sense of freshness, morning light, sense of community, vendors calling, sense of daily life, baskets of goods, lively atmosphere'
      },
      '菜市场': {
        core: 'wet market with fresh food stalls',
        detail: 'traditional wet market, stalls of fresh food, sense of daily life, fish and meat, sense of freshness, vendors, sense of community, bustling aisles, colorful produce, authentic atmosphere'
      },
      '渔村码头': {
        core: 'fishing village pier with boats',
        detail: 'fishing village with a small pier, fishing boats moored, sense of coastal life, nets drying, sense of tradition, seagulls, sense of community, weathered wood, sea breeze, rustic charm'
      },
      '山间民宿': {
        core: 'mountain guesthouse with scenic views',
        detail: 'cozy guesthouse in the mountains, scenic views, sense of retreat, wooden architecture, sense of peace, misty peaks, sense of hospitality, warm rooms, nature surroundings, relaxing atmosphere'
      },
      '海边小屋': {
        core: 'seaside cottage by the ocean',
        detail: 'cozy cottage by the sea, ocean view, sense of calm, sound of waves, sense of escape, sandy path, sense of simplicity, beach access, warm interior, peaceful atmosphere'
      },
      '森林木屋': {
        core: 'wooden cabin in the forest',
        detail: 'wooden cabin nestled in the forest, sense of seclusion, tall trees around, sense of warmth, chimney smoke, sense of nature, cozy interior, forest paths, rustic charm, peaceful retreat'
      },
      '湖畔别墅': {
        core: 'lakeside villa with water view',
        detail: 'elegant villa by a lake, water view, sense of luxury, calm water, sense of serenity, garden, sense of retreat, reflections, private dock, peaceful atmosphere'
      },
      '都市公寓': {
        core: 'modern urban apartment interior',
        detail: 'modern apartment in the city, city view windows, sense of urban life, contemporary furniture, sense of style, large windows, sense of comfort, city lights, sleek design, modern living'
      },
      '老式电影院': {
        core: 'old-fashioned cinema with vintage marquee',
        detail: 'vintage cinema with a glowing marquee, sense of nostalgia, classic film posters, sense of history, red seats, sense of charm, old projector, warm lighting, retro atmosphere, cinematic magic'
      },
      '唐人街': {
        core: 'chinatown with red lanterns and gates',
        detail: 'vibrant chinatown, red lanterns hanging, sense of culture, ornate gates, sense of tradition, street food, sense of community, colorful signs, bustling streets, cultural atmosphere'
      },
      '中央车站': {
        core: 'grand central station with high ceilings',
        detail: 'grand railway station with high arched ceilings, sense of travel, marble floors, sense of history, grand clock, sense of scale, bustling travelers, elegant architecture, iconic landmark'
      },
      '地下通道': {
        core: 'underground passage with tiled walls',
        detail: 'underground passageway, tiled walls, sense of transit, dim lighting, sense of the underground, echoes, sense of direction, murals, functional space, urban passage'
      },
      '天桥': {
        core: 'pedestrian overpass crossing the street',
        detail: 'pedestrian overpass over a busy street, sense of elevation, city view, sense of transit, stairs and ramps, sense of the city, traffic below, functional structure, urban crossing'
      },
      '高架桥': {
        core: 'elevated highway bridge over the city',
        detail: 'elevated highway bridge, multiple lanes of traffic, sense of scale, city below, sense of movement, concrete pillars, sense of the city, curving ramps, urban infrastructure, aerial view'
      },
      '环岛': {
        core: 'traffic roundabout with a central feature',
        detail: 'traffic roundabout, circular road, sense of traffic flow, central garden or statue, sense of the city, cars circling, sense of order, surrounding roads, urban design'
      },
      '步行街': {
        core: 'pedestrian shopping street',
        detail: 'pedestrian street for shopping, no cars, sense of leisure, shops and cafes, sense of community, street performers, sense of fun, crowds, storefronts, lively atmosphere'
      },
      '老街': {
        core: 'old street with historic buildings',
        detail: 'historic old street, aged buildings, sense of history, cobblestones, sense of tradition, shops, sense of nostalgia, lanterns, historic charm, timeless atmosphere'
      },
      '胡同': {
        core: 'traditional hutong alley in beijing',
        detail: 'traditional beijing hutong alley, narrow lane between courtyard houses, sense of history, bicycles, sense of community, old trees, sense of tradition, doorways, authentic atmosphere'
      },
      '弄堂': {
        core: 'shanghai lane with residential buildings',
        detail: 'traditional shanghai lane, narrow alley between buildings, sense of community, laundry hanging, sense of daily life, old buildings, sense of nostalgia, neighbors, authentic urban life'
      },
      '骑楼': {
        core: 'arcade street with covered walkways',
        detail: 'street with covered arcades, columns supporting the walkway, sense of tropical architecture, sense of shade, shops under the arcade, sense of tradition, historic buildings, covered walk, cultural atmosphere'
      },
      '玻璃幕墙大厦': {
        core: 'glass curtain wall skyscraper',
        detail: 'modern skyscraper with a glass curtain wall, reflective glass facade, sense of the future, sense of scale, city reflections, sense of modernity, sleek design, towering height, urban landmark'
      },
      '双子塔': {
        core: 'twin towers standing side by side',
        detail: 'two identical towers standing side by side, sense of symmetry, sense of scale, skybridge connecting them, sense of the future, glass and steel, sense of landmark, city view, iconic architecture'
      },
      '电视塔': {
        core: 'television tower with observation deck',
        detail: 'tall television tower, observation deck near the top, sense of height, sense of the city, antenna spire, sense of landmark, panoramic view, glowing lights, iconic structure'
      },
      '摩天轮': {
        core: 'ferris wheel with glowing cabins',
        detail: 'giant ferris wheel, cabins circling, sense of fun, glowing lights at night, sense of scale, sense of joy, city view from the top, sense of landmark, festive atmosphere'
      },
      '过山车乐园': {
        core: 'roller coaster amusement park',
        detail: 'amusement park with roller coasters, twisting tracks, sense of thrill, sense of fun, colorful rides, sense of excitement, crowds, festive lights, thrilling atmosphere'
      },
      '水上乐园': {
        core: 'water park with slides and pools',
        detail: 'water park with slides and pools, sense of fun, colorful slides, sense of summer, splashing water, sense of joy, pools and waves, sense of refreshment, playful atmosphere'
      },
      '滑雪场': {
        core: 'ski resort with snowy slopes',
        detail: 'ski resort with snowy slopes, sense of winter, ski lifts, sense of fun, snow-covered mountains, sense of adventure, skiers, sense of cold, alpine scenery, winter atmosphere'
      },
      '高尔夫球场': {
        core: 'golf course with green fairways',
        detail: 'golf course with manicured fairways, sense of leisure, green grass, sense of elegance, sand bunkers, sense of calm, clubhouse, sense of sport, rolling landscape, refined atmosphere'
      },
      '赛马场': {
        core: 'horse racing track with grandstand',
        detail: 'horse racing track, oval course, sense of sport, grandstand seating, sense of excitement, horses racing, sense of tradition, flags, sense of competition, lively atmosphere'
      },
      '红树林': {
        core: 'mangrove forest with roots in water',
        detail: 'mangrove forest, trees with roots in the water, sense of coastal nature, sense of ecosystem, tangled roots, sense of life, tidal water, sense of protection, birds, unique wetland'
      },
      '湿地公园': {
        core: 'wetland park with boardwalks and birds',
        detail: 'wetland park, boardwalks over the water, sense of nature, birds and wildlife, sense of calm, reeds and cattails, sense of conservation, observation towers, peaceful atmosphere'
      },
      '芦苇荡': {
        core: 'reed marsh with tall reeds swaying',
        detail: 'marsh of tall reeds, reeds swaying in the wind, sense of nature, golden reeds, sense of calm, water among the reeds, sense of wildness, birds, wind through the reeds, serene atmosphere'
      },
      '荷塘': {
        core: 'lotus pond with blooming flowers',
        detail: 'pond full of lotus flowers, blooming blooms, sense of beauty, green leaves, sense of calm, water reflections, sense of summer, lotus fragrance, peaceful atmosphere'
      },
      '稻田': {
        core: 'rice paddy with green seedlings',
        detail: 'rice paddies, flooded fields of green seedlings, sense of agriculture, sense of calm, water reflections, sense of tradition, mountains behind, sense of rural life, terraced fields, pastoral scene'
      },
      '麦田': {
        core: 'wheat field with golden grain',
        detail: 'golden wheat field, grain swaying in the wind, sense of harvest, sense of abundance, golden waves, sense of rural life, blue sky, sense of warmth, countryside, pastoral beauty'
      },
      '向日葵田': {
        core: 'sunflower field facing the sun',
        detail: 'field of sunflowers all facing the sun, sense of joy, bright yellow blooms, sense of summer, sense of warmth, tall stems, sense of vibrancy, blue sky, cheerful atmosphere'
      },
      '薰衣草田': {
        core: 'lavender field with purple blooms',
        detail: 'field of purple lavender, rows of fragrant blooms, sense of calm, sense of fragrance, purple waves, sense of beauty, sense of relaxation, rolling hills, serene atmosphere'
      },
      '茶园': {
        core: 'tea plantation with green terraces',
        detail: 'tea plantation with terraced green bushes, sense of tradition, sense of calm, rows of tea plants, sense of freshness, misty hills, sense of culture, harvest baskets, serene atmosphere'
      },
      '竹林海': {
        core: 'vast sea of bamboo stalks',
        detail: 'endless bamboo forest, tall green stalks, sense of scale, dappled light, sense of calm, wind through the bamboo, sense of nature, green sea, rustling leaves, peaceful atmosphere'
      },
      '枫叶林': {
        core: 'maple forest with red autumn leaves',
        detail: 'forest of maple trees in autumn, red and orange leaves, sense of season, sense of beauty, falling leaves, sense of warmth, golden light, sense of change, colorful canopy, autumn atmosphere'
      },
      '银杏大道': {
        core: 'ginkgo avenue with golden leaves',
        detail: 'avenue lined with ginkgo trees, golden yellow leaves, sense of autumn, sense of beauty, leaf-covered ground, sense of calm, golden canopy, sense of season, peaceful walk, autumn atmosphere'
      },
      '樱花大道': {
        core: 'cherry blossom avenue in full bloom',
        detail: 'avenue lined with cherry blossom trees, pink blooms, sense of spring, sense of beauty, falling petals, sense of joy, pink canopy, sense of season, dreamy walk, spring atmosphere'
      },
      '桃花林': {
        core: 'peach blossom forest with pink flowers',
        detail: 'forest of peach trees in bloom, pink blossoms, sense of spring, sense of beauty, falling petals, sense of romance, pink canopy, sense of season, dreamy atmosphere'
      },
      '梅园': {
        core: 'plum garden with winter blossoms',
        detail: 'garden of plum trees in bloom, delicate blossoms, sense of winter, sense of beauty, fragrance, sense of resilience, white and pink blooms, sense of season, quiet elegance'
      },
      '玫瑰园': {
        core: 'rose garden with colorful blooms',
        detail: 'garden of roses, colorful blooms, sense of romance, sense of beauty, fragrance, sense of elegance, trellises, sense of love, lush petals, romantic atmosphere'
      },
      '郁金香田': {
        core: 'tulip field with rows of color',
        detail: 'field of tulips in rows of color, sense of spring, sense of beauty, vibrant blooms, sense of joy, colorful stripes, sense of season, windmill in distance, cheerful atmosphere'
      },
      '仙人掌园': {
        core: 'cactus garden with desert plants',
        detail: 'garden of cacti, tall desert plants, sense of desert, sense of resilience, spiky forms, sense of warmth, colorful blooms on cacti, sense of nature, arid beauty'
      },
      '热带果园': {
        core: 'tropical orchard with exotic fruit',
        detail: 'orchard of tropical fruit trees, exotic fruits, sense of abundance, sense of warmth, hanging fruit, sense of nature, lush leaves, sense of harvest, tropical beauty'
      },
      '高山草甸': {
        core: 'alpine meadow with wildflowers',
        detail: 'high mountain meadow, wildflowers in bloom, sense of elevation, sense of beauty, green grass, sense of calm, distant peaks, sense of nature, fresh air, serene atmosphere'
      },
      '地下墓穴': {
        core: 'underground catacombs with bone-lined walls',
        detail: 'underground catacombs, tunnels lined with bones, sense of history, sense of the macabre, dim candlelight, sense of mortality, stone arches, sense of mystery, ancient burial, eerie atmosphere'
      },
      '古罗马浴场': {
        core: 'ancient roman bathhouse with pools',
        detail: 'ancient roman bathhouse, warm pools, sense of history, sense of relaxation, marble columns, sense of grandeur, steam rising, sense of civilization, mosaics, historic atmosphere'
      },
      '图书馆密室': {
        core: 'hidden secret room behind the library',
        detail: 'hidden room behind a bookshelf, secret passage, sense of mystery, sense of discovery, old books, sense of secrecy, dim light, sense of wonder, hidden treasures, mysterious atmosphere'
      },
      '天文台': {
        core: 'observatory with a large telescope',
        detail: 'observatory with a large telescope, sense of science, sense of the cosmos, dome opening to the sky, sense of wonder, star charts, sense of discovery, night sky, scientific atmosphere'
      },
      '观星台': {
        core: 'stargazing platform under the night sky',
        detail: 'platform for stargazing, sense of the cosmos, clear night sky, sense of wonder, telescopes, sense of calm, starry view, sense of solitude, celestial beauty, peaceful atmosphere'
      },
      '气象站': {
        core: 'weather station with instruments',
        detail: 'weather station with measuring instruments, sense of science, sense of weather, anemometer and gauges, sense of observation, remote location, sense of data, wind and sky, scientific atmosphere'
      },
      '灯塔内部': {
        core: 'interior of a lighthouse with spiral stairs',
        detail: 'interior of a lighthouse, spiral staircase, sense of history, sense of height, lantern room above, sense of guidance, stone walls, sense of isolation, warm light, maritime atmosphere'
      },
      '钟楼': {
        core: 'clock tower with a large bell',
        detail: 'clock tower with a large bell, sense of time, sense of history, ornate clock face, sense of tradition, bells ringing, sense of community, stone architecture, historic atmosphere'
      },
      '风车田': {
        core: 'windmill field with turning blades',
        detail: 'field of windmills, turning blades, sense of rural life, sense of energy, white windmills, sense of calm, green fields, sense of tradition, blue sky, pastoral atmosphere'
      },
      '水车磨坊': {
        core: 'water mill with a turning wheel',
        detail: 'water mill with a turning wheel, sense of tradition, sense of history, water splashing, sense of craft, stone building, sense of rural life, wooden wheel, rustic atmosphere'
      },
      '城堡地牢': {
        core: 'castle dungeon with iron bars',
        detail: 'dark dungeon beneath a castle, iron bars, sense of history, sense of imprisonment, torchlight, sense of dread, stone walls, sense of the past, chains, grim atmosphere'
      },
      '王座大厅': {
        core: 'grand throne hall with a royal seat',
        detail: 'grand hall with a royal throne, sense of power, sense of majesty, ornate throne, sense of ceremony, banners, sense of grandeur, marble floor, royal atmosphere'
      },
      '宴会厅': {
        core: 'grand banquet hall with long tables',
        detail: 'grand banquet hall, long tables, sense of celebration, sense of festivity, chandeliers, sense of grandeur, fine tableware, sense of hospitality, warm light, festive atmosphere'
      },
      '婚礼教堂': {
        core: 'wedding chapel with white flowers',
        detail: 'chapel decorated for a wedding, white flowers, sense of romance, sense of celebration, pews, sense of joy, warm light, sense of love, elegant decor, joyful atmosphere'
      },
      '医院': {
        core: 'hospital corridor with medical equipment',
        detail: 'hospital corridor, medical equipment, sense of care, sense of urgency, clean white walls, sense of healing, nurses and doctors, sense of hope, bright lighting, clinical atmosphere'
      },
      '监狱': {
        core: 'prison with cells and bars',
        detail: 'prison interior, rows of cells, sense of confinement, sense of grimness, iron bars, sense of isolation, guard towers, sense of order, concrete walls, oppressive atmosphere'
      },
      '警察局': {
        core: 'police station with desks and badges',
        detail: 'police station, desks and files, sense of duty, sense of order, badges and uniforms, sense of protection, bulletin boards, sense of justice, functional space, official atmosphere'
      },
      '消防站': {
        core: 'fire station with fire trucks',
        detail: 'fire station, red fire trucks, sense of readiness, sense of duty, equipment, sense of bravery, garage bays, sense of community, helmets and gear, heroic atmosphere'
      },
      '学校操场': {
        core: 'school playground with sports field',
        detail: 'school playground, sports field, sense of youth, sense of energy, running track, sense of fun, students, sense of community, goal posts, bright day, lively atmosphere'
      },
      '大学校园': {
        core: 'university campus with academic buildings',
        detail: 'university campus, academic buildings, sense of learning, sense of youth, green lawns, sense of knowledge, students walking, sense of ambition, historic halls, scholarly atmosphere'
      }
    },
    keywords: ['场景', '环境', '建筑', '背景', '地点', '城市', '森林', '山', '海', '宫殿', '城堡', '庭院', '废墟', '太空', '水下', '咖啡馆', '花园', '街道', '场景描述', 'setting', 'environment', 'background', 'location', 'city', 'forest', 'mountain', 'castle', 'palace', 'ruins', 'space', 'underwater', 'garden', 'cafe']
  },

  gender: {
    name: '性别',
    categories: {
      '男性': {
        core: 'male',
        detail: 'masculine build, broad shoulders, defined jawline, angular facial structure, visible adam\'s apple, heavier brow ridge, shorter hair typical, muscular definition, stronger bone structure, narrower hips, larger hands',
        face: 'strong chiseled jawline, defined brow ridge, angular cheekbones, thinner lips, broader nose bridge, deeper set eyes, visible adam\'s apple, potential facial hair shadow, squarer face shape, more prominent bone structure',
        pose: 'confident wide stance, squared shoulders, purposeful gestures, direct unwavering gaze, grounded weight distribution, territorial body language, chest slightly forward, arms away from body',
        mood: 'masculine, strong, confident, assertive, protective, stoic, commanding, resolute'
      },
      '女性': {
        core: 'female',
        detail: 'feminine silhouette, softer curves, narrower shoulders, defined waist, wider hips, smoother skin texture, longer hair typical, graceful neck, delicate bone structure, rounded features, smaller hands and feet',
        face: 'softer oval jawline, higher prominent cheekbones, fuller lips, larger eyes relative to face, smoother brow ridge, narrower chin, delicate nose, longer eyelashes, rounded forehead, smaller ears',
        pose: 'graceful contrapposto stance, lighter weight distribution, elegant hand gestures, softer gaze, flowing movement, slightly tilted head, one hip higher, arms closer to body, s-curve silhouette',
        mood: 'feminine, graceful, elegant, nurturing, gentle, expressive, warm, alluring'
      },
      '中性': {
        core: 'androgynous, gender-neutral',
        detail: 'balanced proportions, neither distinctly masculine nor feminine, ambiguous presentation, fluid expression, versatile appearance, medium build, smooth features, ungendered silhouette',
        face: 'balanced features, neither sharp nor soft, medium brow ridge, neutral jawline, versatile expression, ungendered beauty, smooth skin, medium-length features, ambiguous gender presentation',
        pose: 'neutral balanced stance, natural weight distribution, versatile body language, ungendered gestures, relaxed posture, neither wide nor narrow stance, natural arm position',
        mood: 'neutral, balanced, versatile, ambiguous, fluid, universal, serene, calm'
      }
    },
    keywords: ['性别', '男', '女', '男性', '女性', '中性', 'male', 'female', 'androgynous', '男孩', '女孩', '少年', '少女', '男人', '女人', '男子', '女子', '男的', '女的', 'boy', 'girl', 'man', 'woman', 'gender']
  },

  platform: {
    name: '平台',
    formats: {
      '通用': { format: 'natural', suffix: '', prefix: '' },
      'Midjourney': { format: 'mj', suffix: ' --ar 16:9 --stylize 250 --v 6.1 --quality 2', prefix: '', keywords: ['MJ', 'Midjourney', 'midjourney', 'mj'] },
      'Stable Diffusion': { format: 'sd', suffix: '', prefix: '(masterpiece, best quality:1.2), ', keywords: ['SD', 'Stable', 'stable diffusion', 'sd'] },
      '即梦/Seedance': { format: 'seedance', suffix: '', prefix: '', keywords: ['即梦', 'Seedance', 'seedance', 'Jimeng'] },
      'DALL·E': { format: 'dalle', suffix: '', prefix: '', keywords: ['DALL', 'dalle', 'DALL·E'] }
    },
    keywords: ['平台', '工具', 'MJ', 'Midjourney', 'SD', 'Stable', '即梦', 'Seedance', 'DALL', '哪个平台']
  },
  // ===== 道具专属维度 =====
  material: {
    name: '材质',
    categories: {
      '金属': { keywords: ['金属', '铁', '钢', '铜', '银', '金', '铝', '钛', '合金', '黄金', '白银', '青铜', '黄铜', '不锈钢', '镀金', '镀铬', '长剑', '剑', '刀', '匕首', '刃', '铁器'] },
      '木质': { keywords: ['木头', '木质', '木', '橡木', '红木', '檀木', '桃木', '胡桃木', '原木', '古木', '树根', '藤条'] },
      '玻璃': { keywords: ['玻璃', '水晶', '琉璃', '透明', '玻璃器皿', '琉璃盏', '水晶杯', '冰晶', '玻璃瓶', '试管'] },
      '宝石': { keywords: ['宝石', '钻石', '翡翠', '玉石', '玛瑙', '琥珀', '珍珠', '珊瑚', '水晶', '蓝宝石', '红宝石', '祖母绿', '猫眼', '玉石'] },
      '布料': { keywords: ['布料', '丝绸', '棉', '麻', '绒', '缎', '纱', '织物', '绸缎', '锦缎', '蕾丝', '天鹅绒', '亚麻', '帆布', '粗布', '布面', '布匹'] },
      '陶瓷': { keywords: ['陶瓷', '瓷器', '陶', '瓷', '紫砂', '青瓷', '白瓷', '彩陶', '粗陶', '细瓷', '珐琅'] },
      '石材': { keywords: ['石头', '大理石', '花岗岩', '玉石', '岩石', '鹅卵石', '石板', '山石', '礁石', '钟乳石'] },
      '皮革': { keywords: ['皮革', '皮', '牛皮', '羊皮', '蛇皮', '革', '真皮', '仿皮'] },
      '塑料': { keywords: ['塑料', '树脂', '亚克力', 'PVC', '有机玻璃', '塑胶', '橡胶'] },
      '骨角': { keywords: ['骨头', '角', '象牙', '兽骨', '龙骨', '犀角', '犄角', '骨骼'] },
      '纸': { keywords: ['纸', '宣纸', '羊皮纸', '牛皮纸', '卡纸', '手工纸', '折纸', '纸浆'] },
      '暗影水晶': { keywords: ['暗影水晶', '暗晶', '影晶', '暗影石', '幽暗水晶', '暗物质', '黑晶', '暗影宝石', '暗影晶石', '暗宝石'] },
      '元素能量': { keywords: ['元素能量', '能量', '元素', '魔法能量', '元素之力', '魔法核心', '能量核心', '元素核心', '能量石', '魔能'] },
      '液态金属': { keywords: ['液态金属', '液态', '水银', '汞', '液态合金', '金属液', '流动金属', '变形金属', '液金', '纳米金属'] },
      '魔法符文': { keywords: ['魔法符文', '符文', '铭文', '咒文', '法术刻印', '铭刻', '符文石', '符文刻印', '符文印记', '符文材料'] },
      '骸骨': { keywords: ['骸骨', '骨头', '骷髅', '骨骼', '骨', '骨制', '骨片', '骨雕', '白骨', '骨制品', '骨壳'] },
      '异界材料': { keywords: ['异界', '异界材料', '次元', '异次元', '虚空', '混沌', '彼岸', '冥界', '灵界', '异世界', '异维度'] },
      '藤编': { keywords: ['藤编', '藤条', '藤蔓', '编织藤', '藤席', '藤篮', '藤椅', '藤制品', '藤艺', '柳编'] },
      '竹': { keywords: ['竹', '竹子', '竹编', '竹片', '竹条', '竹节', '毛竹', '湘妃竹', '紫竹', '竹器', '竹筒'] },
      '玉': { keywords: ['玉', '玉石', '翡翠', '和田玉', '白玉', '青玉', '碧玉', '墨玉', '玉器', '玉雕', '玉佩'] },
      '玛瑙': { keywords: ['玛瑙', '玛瑙纹', '缠丝玛瑙', '南红玛瑙', '玛瑙石', '玛瑙珠', '玛瑙玉', '玛瑙雕'] },
      '琥珀': { keywords: ['琥珀', '蜜蜡', '琥珀色', '琥珀石', '琥珀珠', '虫珀', '金珀', '血珀', '琥珀雕'] },
      '珊瑚': { keywords: ['珊瑚', '红珊瑚', '珊瑚石', '珊瑚枝', '白珊瑚', '珊瑚礁', '珊瑚珠', '珊瑚雕'] },
      '贝壳': { keywords: ['贝壳', '贝', '蚌壳', '海贝', '螺壳', '贝壳片', '贝壳珠', '贝壳镶嵌', '贝雕'] },
      '珍珠母': { keywords: ['珍珠母', '母贝', '贝母', '珍珠贝', '贝壳内壁', '珠母层', '珍珠母贝', '螺钿'] },
      '黑曜石': { keywords: ['黑曜石', '曜石', '黑曜', '黑曜石刃', '火山玻璃', '黑曜石珠', '黑曜石刀', '黑曜岩'] },
      '陨石': { keywords: ['陨石', '陨铁', '陨石碎片', '天外陨石', '陨石金属', '陨石坑', '陨星', '陨铁石', '天铁'] },
      '冰晶': { keywords: ['冰晶', '冰', '冰霜', '冰块', '冰凌', '冰柱', '寒冰', '冰晶石', '冰雪结晶', '冻冰'] },
      '火焰石': { keywords: ['火焰石', '火石', '熔岩', '岩浆石', '火晶', '烈焰石', '火灵石', '熔岩石', '火成岩'] },
      '雷击木': { keywords: ['雷击木', '雷击', '雷劈木', '天雷木', '雷击枣木', '雷木', '雷击桃木', '雷火木'] },
      '圣银': { keywords: ['圣银', '神圣银', '圣洁银', '祝福银', '圣银器', '圣银饰', '神圣金属', '圣银链'] },
      '秘银': { keywords: ['秘银', '秘银合金', '秘银甲', '秘银器', '精金秘银', '秘银矿', '秘银锭', '秘银饰'] },
      '龙鳞': { keywords: ['龙鳞', '龙鳞甲', '龙鳞片', '龙鳞纹', '龙皮', '龙甲', '龙鳞盾', '龙鳞铠'] },
      '凤凰羽': { keywords: ['凤凰羽', '凤凰羽毛', '凤羽', '凤凰翎', '凤翎', '凤凰羽翼', '火羽', '凤凰之羽'] },
      '丝绸': { keywords: ['丝绸', '真丝', '丝质', '绸缎', '丝滑', '丝织', '蚕丝', '丝巾', '丝绒', '光滑丝绸'] },
      '亚麻': { keywords: ['亚麻', '亚麻布', '麻布', '麻织', '亚麻纤维', '粗麻', '麻料', '亚麻色', '麻纱', '亚麻织物'] },
      '天鹅绒': { keywords: ['天鹅绒', '丝绒', '绒布', '丝绒面料', '天鹅绒布', '绒面', '丝绒质感', '天鹅绒裙', '绒缎', '丝绒光泽'] },
      '锦缎': { keywords: ['锦缎', '织锦', '缎面', '锦缎面料', '提花缎', '云锦', '蜀锦', '宋锦', '织锦缎', '锦缎刺绣'] },
      '蕾丝': { keywords: ['蕾丝', '蕾丝花边', '花边', '镂空蕾丝', '蕾丝面料', '蕾丝裙', '蕾丝刺绣', '蕾丝边', '钩花蕾丝', '蕾丝织物'] },
      '羊毛': { keywords: ['羊毛', '羊毛织物', '羊毛衫', '羊毛呢', '羊毛绒', '羊毛毡', '羊毛毯', '羊毛线', '羊毛大衣', '羊毛质地'] },
      '羊绒': { keywords: ['羊绒', '山羊绒', '羊绒衫', '开司米', '羊绒围巾', '羊绒大衣', '羊绒面料', '羊绒线', '羊绒织物', '羊绒质感'] },
      '牛仔布': { keywords: ['牛仔布', '牛仔', '丹宁', '牛仔面料', '粗斜纹布', '牛仔布纹', '牛仔衣', '牛仔裤', '牛仔布质感', '丹宁布'] },
      '帆布': { keywords: ['帆布', '帆布面料', '帆布包', '粗帆布', '帆布鞋', '帆布帐篷', '帆布质地', '帆布纹', '厚帆布', '帆布画'] },
      '麂皮': { keywords: ['麂皮', '麂皮绒', '麂皮面料', '翻毛皮', '麂皮靴', '麂皮手套', '麂皮质感', '麂皮绒面', '麂皮夹克', '磨砂皮'] },
      '蛇皮': { keywords: ['蛇皮', '蛇皮纹', '蛇纹皮', '蛇皮包', '蛇皮靴', '蛇皮纹理', '蛇鳞皮', '蛇皮纹路', '蛇皮面料', '蛇皮质感'] },
      '鳄鱼皮': { keywords: ['鳄鱼皮', '鳄鱼纹', '鳄鱼皮包', '鳄鱼皮鞋', '鳄鱼皮纹理', '鳄鱼皮表带', '鳄鱼皮纹路', '鳄鱼皮具', '鳄鱼皮面', '鳄鱼皮质感'] },
      '珍珠': { keywords: ['珍珠', '珍珠项链', '珍珠耳环', '珍珠光泽', '珍珠母珠', '天然珍珠', '珍珠白', '珍珠饰品', '珍珠圆润', '珍珠质感'] },
      '水晶': { keywords: ['水晶', '水晶石', '水晶吊坠', '水晶球', '水晶饰品', '水晶光泽', '透明水晶', '水晶切割', '水晶棱镜', '水晶质感'] },
      '琉璃': { keywords: ['琉璃', '琉璃瓦', '琉璃珠', '琉璃器', '琉璃光泽', '琉璃盏', '琉璃饰品', '琉璃工艺', '琉璃质感', '琉璃通透'] },
      '瓷器': { keywords: ['瓷器', '瓷', '瓷碗', '瓷瓶', '瓷盘', '瓷器工艺', '青花瓷', '粉彩瓷', '瓷质', '瓷器光泽'] },
      '紫砂': { keywords: ['紫砂', '紫砂壶', '紫砂泥', '紫砂陶', '紫砂杯', '紫砂工艺', '紫砂质地', '紫砂茶具', '紫砂泥料', '紫砂质感'] },
      '青瓷': { keywords: ['青瓷', '青釉瓷', '龙泉青瓷', '青瓷釉', '青瓷碗', '青瓷瓶', '青瓷工艺', '青瓷质感', '青瓷光泽', '青瓷色'] },
      '白瓷': { keywords: ['白瓷', '白釉瓷', '白瓷碗', '白瓷瓶', '德化白瓷', '白瓷工艺', '白瓷质感', '白瓷光泽', '白瓷细腻', '白瓷色'] },
      '珐琅': { keywords: ['珐琅', '珐琅彩', '珐琅器', '珐琅工艺', '珐琅釉', '珐琅表盘', '掐丝珐琅', '珐琅质感', '珐琅光泽', '珐琅彩绘'] },
      '景泰蓝': { keywords: ['景泰蓝', '景泰蓝工艺', '铜胎掐丝珐琅', '景泰蓝花瓶', '景泰蓝釉', '景泰蓝饰品', '景泰蓝质感', '景泰蓝光泽', '景泰蓝彩', '景泰蓝器'] },
      '漆器': { keywords: ['漆器', '漆艺', '大漆', '漆器工艺', '漆器盒', '漆器盘', '漆器质感', '漆器光泽', '漆器彩绘', '漆器纹饰'] },
      '木雕': { keywords: ['木雕', '木雕工艺', '木雕摆件', '木雕佛像', '木雕纹饰', '木雕质感', '木雕艺术', '木雕作品', '木雕纹理', '木雕雕刻'] },
      '竹雕': { keywords: ['竹雕', '竹刻', '竹雕工艺', '竹雕笔筒', '竹雕摆件', '竹雕纹饰', '竹雕质感', '竹雕艺术', '竹雕作品', '竹雕雕刻'] },
      '石雕': { keywords: ['石雕', '石刻', '石雕工艺', '石雕佛像', '石雕摆件', '石雕纹饰', '石雕质感', '石雕艺术', '石雕作品', '石雕雕刻'] },
      '玉雕': { keywords: ['玉雕', '玉刻', '玉雕工艺', '玉雕摆件', '玉雕佛像', '玉雕纹饰', '玉雕质感', '玉雕艺术', '玉雕作品', '玉雕雕刻'] },
      '骨雕': { keywords: ['骨雕', '骨刻', '骨雕工艺', '骨雕摆件', '骨雕纹饰', '骨雕质感', '骨雕艺术', '骨雕作品', '骨雕雕刻', '骨雕饰品'] },
      '黄金': { keywords: ['黄金', '金子', '纯金', '足金', '黄金饰品', '黄金光泽', '黄金首饰', '黄金质感', '黄金色', '黄金工艺'] },
      '白银': { keywords: ['白银', '纯银', '足银', '银饰', '白银饰品', '白银光泽', '白银首饰', '白银质感', '银色', '白银工艺'] },
      '青铜': { keywords: ['青铜', '青铜器', '青铜鼎', '青铜剑', '青铜光泽', '青铜质感', '青铜色', '青铜纹饰', '青铜工艺', '青铜铸造'] },
      '黄铜': { keywords: ['黄铜', '黄铜色', '黄铜器', '黄铜质感', '黄铜光泽', '黄铜五金', '黄铜工艺', '黄铜铸造', '黄铜饰', '黄铜纹'] },
      '不锈钢': { keywords: ['不锈钢', '不锈钢质感', '不锈钢光泽', '不锈钢器', '不锈钢表面', '不锈钢金属', '不锈钢工艺', '不锈钢镜面', '不锈钢色', '不锈钢制品'] },
      '钛合金': { keywords: ['钛合金', '钛金属', '钛合金质感', '钛合金光泽', '钛合金工艺', '钛合金表面', '钛合金色', '钛合金制品', '钛合金结构', '钛合金材质'] },
      '钨': { keywords: ['钨', '钨金属', '钨钢', '钨合金', '钨质感', '钨光泽', '钨制品', '钨色', '钨金属质感', '钨合金工艺'] },
      '钛': { keywords: ['钛', '钛金属', '钛质', '钛色', '钛面', '钛金属质感', '钛白', '钛灰'] },
      '水银': { keywords: ['水银', '汞', '银液', '水银珠', '液态银', '水银光泽', '银汞', '水银面'] },
      '翡翠': { keywords: ['翡翠', '翡翠玉', '翡翠绿', '翡翠色', '翡翠镯', '翡翠雕', '翡翠面', '翡翠质感'] },
      '碳纤维': { keywords: ['碳纤维', '碳纤', '碳纤维纹', '碳纤维面', '碳纤维质感', '碳纤维板', '碳纤维布', '碳纤维纹路'] },
      '纳米材料': { keywords: ['纳米材料', '纳米', '纳米涂层', '纳米级', '纳米科技', '纳米纤维', '纳米金属', '纳米材质'] },
      '星尘': { keywords: ['星尘', '星辰', '星尘粉', '星尘光', '星尘材质', '星尘微粒', '星辉', '星尘闪烁'] },
      '石墨烯': { keywords: ['石墨烯', '石墨', '石墨烯涂层', '石墨烯材质', '石墨烯纤维', '石墨烯面', '石墨烯科技', '石墨烯黑'] },
      '钨钢': { keywords: ['钨钢', '钨钢合金', '钨钢面', '钨钢质感', '钨钢色', '钨钢刀', '钨钢钻', '钨钢金属'] },
      '铂金': { keywords: ['铂金', '铂', '铂金色', '铂金光泽', '铂金质感', '铂金饰', '铂金面', '铂金金属'] },
      '铱金': { keywords: ['铱金', '铱', '铱金笔尖', '铱金质感', '铱金光泽', '铱金面', '铱金属', '铱金合金'] },
      '钛钢': { keywords: ['钛钢', '钛钢合金', '钛钢面', '钛钢质感', '钛钢色', '钛钢饰', '钛钢金属', '钛钢光泽'] },
      '记忆合金': { keywords: ['记忆合金', '形状记忆', '记忆金属', '记忆合金面', '记忆合金质感', '记忆合金丝', '记忆合金片', '记忆合金材质'] },
      '月光石': { keywords: ['月光石', '月光', '月光石面', '月光石质感', '月光石珠', '月光石光泽', '月光石雕', '月长石'] },
      '紫水晶': { keywords: ['紫水晶', '紫晶', '紫色水晶', '紫水晶面', '紫水晶质感', '紫水晶珠', '紫水晶光泽', '紫水晶雕'] },
      '黄玉': { keywords: ['黄玉', '黄晶', '黄色玉石', '黄玉面', '黄玉质感', '黄玉珠', '黄玉光泽', '黄玉雕'] },
      '绿松石': { keywords: ['绿松石', '松石', '绿松石面', '绿松石质感', '绿松石珠', '绿松石光泽', '绿松石雕', '绿松石色'] },
      '青金石': { keywords: ['青金石', '青金', '青金石面', '青金石质感', '青金石珠', '青金石光泽', '青金石雕', '青金蓝色'] },
      '石榴石': { keywords: ['石榴石', '石榴红', '石榴石面', '石榴石质感', '石榴石珠', '石榴石光泽', '石榴石雕', '石榴石色'] },
      '橄榄石': { keywords: ['橄榄石', '橄榄绿', '橄榄石面', '橄榄石质感', '橄榄石珠', '橄榄石光泽', '橄榄石雕', '橄榄石色'] },
      '碧玺': { keywords: ['碧玺', '电气石', '碧玺面', '碧玺质感', '碧玺珠', '碧玺光泽', '碧玺雕', '碧玺色'] },
      '海蓝宝石': { keywords: ['海蓝宝石', '海蓝宝', '海蓝宝石面', '海蓝宝石质感', '海蓝宝石珠', '海蓝宝石光泽', '海蓝宝石雕', '海蓝色'] },
      '蛋白石': { keywords: ['蛋白石', '欧泊', '蛋白石面', '蛋白石质感', '蛋白石珠', '蛋白石光泽', '蛋白石雕', '蛋白石色'] },
      '缟玛瑙': { keywords: ['缟玛瑙', '条纹玛瑙', '缟玛瑙面', '缟玛瑙质感', '缟玛瑙珠', '缟玛瑙光泽', '缟玛瑙雕', '缟玛瑙纹'] },
      '孔雀石': { keywords: ['孔雀石', '孔雀绿', '孔雀石面', '孔雀石质感', '孔雀石珠', '孔雀石光泽', '孔雀石雕', '孔雀石纹'] },
      '虎眼石': { keywords: ['虎眼石', '虎睛石', '虎眼石面', '虎眼石质感', '虎眼石珠', '虎眼石光泽', '虎眼石雕', '虎眼石纹'] },
      '萤石': { keywords: ['萤石', '氟石', '萤石面', '萤石质感', '萤石珠', '萤石光泽', '萤石雕', '萤石色'] },
      '石英': { keywords: ['石英', '石英石', '石英面', '石英质感', '石英晶体', '石英光泽', '石英玻璃', '石英砂'] },
      '黑玛瑙': { keywords: ['黑玛瑙', '黑玛瑙面', '黑玛瑙质感', '黑玛瑙珠', '黑玛瑙光泽', '黑玛瑙雕', '黑玛瑙纹', '黑玛瑙石'] },
      '白水晶': { keywords: ['白水晶', '白晶', '白水晶面', '白水晶质感', '白水晶珠', '白水晶光泽', '白水晶雕', '白水晶簇'] },
      '粉晶': { keywords: ['粉晶', '粉水晶', '粉晶面', '粉晶质感', '粉晶珠', '粉晶光泽', '粉晶雕', '粉晶色'] },
      '紫晶': { keywords: ['紫晶', '紫水晶', '紫晶面', '紫晶质感', '紫晶珠', '紫晶光泽', '紫晶雕', '紫晶色'] },
      '茶晶': { keywords: ['茶晶', '茶水晶', '茶晶面', '茶晶质感', '茶晶珠', '茶晶光泽', '茶晶雕', '茶晶色'] },
      '发晶': { keywords: ['发晶', '发丝水晶', '发晶面', '发晶质感', '发晶珠', '发晶光泽', '发晶雕', '发晶色'] },
      '幽灵水晶': { keywords: ['幽灵水晶', '幽灵晶', '幽灵水晶面', '幽灵水晶质感', '幽灵水晶珠', '幽灵水晶光泽', '幽灵水晶雕', '幽灵水晶色'] },
      '钛晶': { keywords: ['钛晶', '钛晶面', '钛晶质感', '钛晶珠', '钛晶光泽', '钛晶雕', '钛晶色', '钛晶簇'] },
      '红宝石': { keywords: ['红宝石', '红宝', '红宝石面', '红宝石质感', '红宝石珠', '红宝石光泽', '红宝石雕', '红宝石色'] },
      '蓝宝石': { keywords: ['蓝宝石', '蓝宝', '蓝宝石面', '蓝宝石质感', '蓝宝石珠', '蓝宝石光泽', '蓝宝石雕', '蓝宝石色'] },
      '祖母绿': { keywords: ['祖母绿', '祖母绿宝石', '祖母绿面', '祖母绿质感', '祖母绿珠', '祖母绿光泽', '祖母绿雕', '祖母绿色'] },
      '猫眼石': { keywords: ['猫眼石', '猫眼', '猫眼石面', '猫眼石质感', '猫眼石珠', '猫眼石光泽', '猫眼石雕', '猫眼石纹'] },
      '和田玉': { keywords: ['和田玉', '和田白玉', '和田玉面', '和田玉质感', '和田玉雕', '和田玉光泽', '和田玉镯', '和田玉色'] },
      '独山玉': { keywords: ['独山玉', '独玉', '独山玉面', '独山玉质感', '独山玉雕', '独山玉光泽', '独山玉色', '独山玉器'] },
      '岫玉': { keywords: ['岫玉', '岫岩玉', '岫玉面', '岫玉质感', '岫玉雕', '岫玉光泽', '岫玉色', '岫玉器'] },
      '南红玛瑙': { keywords: ['南红玛瑙', '南红', '南红玛瑙面', '南红玛瑙质感', '南红玛瑙珠', '南红玛瑙光泽', '南红玛瑙雕', '南红色'] },
      '战国红': { keywords: ['战国红', '战国红玛瑙', '战国红面', '战国红质感', '战国红珠', '战国红光泽', '战国红雕', '战国红纹'] },
      '蜜蜡': { keywords: ['蜜蜡', '蜜蜡石', '蜜蜡面', '蜜蜡质感', '蜜蜡珠', '蜜蜡光泽', '蜜蜡雕', '蜜蜡色'] },
      '血珀': { keywords: ['血珀', '血红色琥珀', '血珀面', '血珀质感', '血珀珠', '血珀光泽', '血珀雕', '血珀色'] },
      '金珀': { keywords: ['金珀', '金色琥珀', '金珀面', '金珀质感', '金珀珠', '金珀光泽', '金珀雕', '金珀色'] },
      '虫珀': { keywords: ['虫珀', '含虫琥珀', '虫珀面', '虫珀质感', '虫珀珠', '虫珀光泽', '虫珀雕', '虫珀色'] },
      '玳瑁': { keywords: ['玳瑁', '玳瑁壳', '玳瑁面', '玳瑁质感', '玳瑁色', '玳瑁光泽', '玳瑁纹', '玳瑁制品'] },
      '犀角': { keywords: ['犀角', '犀牛角', '犀角面', '犀角质感', '犀角雕', '犀角光泽', '犀角色', '犀角制品'] },
      '鹿角': { keywords: ['鹿角', '鹿茸', '鹿角面', '鹿角质感', '鹿角雕', '鹿角光泽', '鹿角色', '鹿角制品'] },
      '象牙': { keywords: ['象牙', '象牙白', '象牙面', '象牙质感', '象牙雕', '象牙光泽', '象牙色', '象牙制品'] },
      '鲸骨': { keywords: ['鲸骨', '鲸鱼骨', '鲸骨面', '鲸骨质感', '鲸骨雕', '鲸骨光泽', '鲸骨色', '鲸骨制品'] },
      '龟甲': { keywords: ['龟甲', '龟壳', '龟甲面', '龟甲质感', '龟甲雕', '龟甲光泽', '龟甲纹', '龟甲制品'] },
      '蛇骨': { keywords: ['蛇骨', '蛇骨面', '蛇骨质感', '蛇骨雕', '蛇骨光泽', '蛇骨色', '蛇骨纹', '蛇骨制品'] },
      '狼牙': { keywords: ['狼牙', '狼牙面', '狼牙质感', '狼牙雕', '狼牙光泽', '狼牙色', '狼牙饰品', '狼牙制品'] },
      '虎骨': { keywords: ['虎骨', '虎骨面', '虎骨质感', '虎骨雕', '虎骨光泽', '虎骨色', '虎骨纹', '虎骨制品'] },
      '鹰羽': { keywords: ['鹰羽', '鹰羽毛', '鹰羽面', '鹰羽质感', '鹰羽雕', '鹰羽光泽', '鹰羽色', '鹰羽制品'] },
      '孔雀羽': { keywords: ['孔雀羽', '孔雀羽毛', '孔雀羽面', '孔雀羽质感', '孔雀羽雕', '孔雀羽光泽', '孔雀羽色', '孔雀羽制品'] },
      '天鹅羽': { keywords: ['天鹅羽', '天鹅羽毛', '天鹅羽面', '天鹅羽质感', '天鹅羽雕', '天鹅羽光泽', '天鹅羽色', '天鹅羽制品'] },
      '鸵鸟皮': { keywords: ['鸵鸟皮', '鸵鸟皮革', '鸵鸟皮面', '鸵鸟皮质感', '鸵鸟皮纹', '鸵鸟皮包', '鸵鸟皮鞋', '鸵鸟皮具'] },
      '蜥蜴皮': { keywords: ['蜥蜴皮', '蜥蜴皮革', '蜥蜴皮面', '蜥蜴皮质感', '蜥蜴皮纹', '蜥蜴皮包', '蜥蜴皮鞋', '蜥蜴皮具'] },
      '鲨鱼皮': { keywords: ['鲨鱼皮', '鲨鱼皮革', '鲨鱼皮面', '鲨鱼皮质感', '鲨鱼皮纹', '鲨鱼皮包', '鲨鱼皮鞋', '鲨鱼皮具'] },
      '鱼皮': { keywords: ['鱼皮', '鱼皮革', '鱼皮面', '鱼皮质感', '鱼皮纹', '鱼皮包', '鱼皮鞋', '鱼皮具'] },
      '珍珠贝': { keywords: ['珍珠贝', '珍珠贝壳', '珍珠贝面', '珍珠贝质感', '珍珠贝光泽', '珍珠贝雕', '珍珠贝纹', '珍珠贝色'] },
      '螺钿': { keywords: ['螺钿', '螺钿镶嵌', '螺钿面', '螺钿质感', '螺钿光泽', '螺钿纹', '螺钿工艺', '螺钿色'] },
      '云母': { keywords: ['云母', '云母片', '云母面', '云母质感', '云母光泽', '云母纹', '云母色', '云母石'] },
      '金刚石': { keywords: ['金刚石', '钻石', '金刚石面', '金刚石质感', '金刚石光泽', '金刚石晶体', '金刚石切面', '金刚石硬度'] },
      '水果': { keywords: ['水果', '果实', '苹果', '香蕉', '橙子', '西瓜', '葡萄', '草莓', '桃子', '梨', '柠檬', '樱桃', '芒果', '菠萝', '火龙果', '猕猴桃'] },
      '烘焙食品': { keywords: ['烘焙', '面包', '蛋糕', '饼干', '曲奇', '马卡龙', '吐司', '可颂', '甜甜圈', '糕点', '甜品', '点心'] },
      '蜡': { keywords: ['蜡', '蜡烛', '蜡质', '蜂蜡', '石蜡', '蜡油', '蜡面', '蜡制品'] }
    }
  },
  texture: {
    name: '质感',
    categories: {
      '光滑镜面': { keywords: ['光滑', '镜面', '抛光', '亮面', '亮亮的', '反光', '光泽', '如镜', '镜面反射', '光洁', '滑溜'] },
      '磨砂哑光': { keywords: ['磨砂', '哑光', '雾面', '消光', '磨砂感', '哑光质感', '不反光', '柔光面'] },
      '粗糙沧桑': { keywords: ['粗糙', '沧桑', '锈蚀', '锈迹', '锈', '生锈', '铁锈', '风化', '斑驳', '斑斑', '龟裂', '剥落', '磨损', '陈旧', '凹凸不平', '坑洼', '粗粝', '做旧'] },
      '柔软蓬松': { keywords: ['柔软', '蓬松', '毛茸茸', '绒毛', '软绵绵', '蓬松感', '棉花', '云朵', '丝滑', '顺滑'] },
      '湿润光泽': { keywords: ['湿润', '水珠', '油光', '油腻', '湿漉漉', '水润', '晶莹', '露珠', '水光'] },
      '半透明': { keywords: ['半透明', '透光', '朦胧', '薄纱', '蝉翼', '透亮的', '半透', '透光性'] },
      '流动液态': { keywords: ['流动', '液态', '流淌', '波纹', '涟漪', '液体', '流动的', '流质', '流淌质感', '波浪'] },
      '发光脉动': { keywords: ['发光', '脉动', '光', '闪烁', '发光体', '光效', '光芒', '辉光', '光纹', '光晕', '发光纹路', '荧光'] },
      '虚空吞噬': { keywords: ['虚空', '吞噬', '黑洞', '吸收', '黑暗', '深渊', '无光', '吞噬光', '暗物质', '黑色', '虚无', '空洞'] },
      '坚硬冰冷': { keywords: ['坚硬', '冰冷', '冷硬', '冰寒', '硬邦邦', '冷冰冰', '坚冷', '寒硬', '冷冽'] },
      '温热柔软': { keywords: ['温热', '柔软', '温软', '暖乎乎', '温热柔软', '暖融融', '温润柔软', '绵软温热'] },
      '粘稠': { keywords: ['粘稠', '黏稠', '粘腻', '黏糊', '粘液', '胶状', '浓稠', '黏黏', '粘乎乎'] },
      '干燥': { keywords: ['干燥', '干爽', '干枯', '干涩', '干巴巴', '干裂', '干燥感', '干硬'] },
      '粗糙颗粒': { keywords: ['粗糙', '颗粒', '粗粝', '沙粒感', '颗粒感', '磨砂颗粒', '粗粒', '凹凸颗粒'] },
      '细腻': { keywords: ['细腻', '细滑', '细嫩', '柔滑', '光滑细腻', '细腻柔滑', '细致', '细腻光滑'] },
      '弹性': { keywords: ['弹性', '弹力', '有弹性', 'Q弹', '回弹', '弹软', '柔韧有弹性', '弹性质感'] },
      '金属冰冷': { keywords: ['金属', '冰冷', '金属质感', '冷金属', '金属光泽', '寒光', '金属冷感', '冷硬金属'] },
      '木质温润': { keywords: ['木质', '温润', '木质感', '温润木', '木纹温润', '温润质感', '木质温润', '暖木'] },
      '丝滑': { keywords: ['丝滑', '顺滑', '柔滑', '滑腻', '丝缎', '丝绸质感', '丝般顺滑', '滑爽', '如丝', '细腻顺滑'] },
      '粗糙': { keywords: ['粗糙', '粗粝', '粗犷', '凹凸', '沙粒感', '磨砂', '不平整', '毛糙', '粗面', '颗粒感'] },
      '油光': { keywords: ['油光', '油腻', '油亮', '油润', '泛油光', '油汪汪', '油亮亮', '反光油面', '油滑', '油膜'] },
      '水润': { keywords: ['水润', '水嫩', '水灵', '水汪汪', '水光', '水润光泽', '水嫩嫩', '湿润水光', '水润感', '水盈盈'] },
      '毛茸茸': { keywords: ['毛茸茸', '绒毛', '毛毛', '毛绒', '毛绒绒', '毛茸', '毛乎乎', '毛绒感', '软毛', '茸毛'] },
      '坚固': { keywords: ['坚固', '结实', '牢固', '坚硬', '硬朗', '扎实', '稳固', '坚挺', '厚实', '硬实'] },
      '冰凉': { keywords: ['冰凉', '冰冷', '寒凉', '凉意', '冰寒', '冷冰冰', '凉丝丝', '透心凉', '冰爽', '凉快'] },
      '暖绒': { keywords: ['暖绒', '温暖', '暖和', '暖乎乎', '暖融融', '暖意', '温热', '暖洋洋', '柔暖', '暖绒绒'] },
      '透明': { keywords: ['透明', '通透', '透亮', '晶莹', '清澈', '澄澈', '通明', '透澈', '明净', '剔透'] },
      '朦胧': { keywords: ['朦胧', '模糊', '迷蒙', '氤氲', '雾蒙蒙', '朦胧感', '若隐若现', '迷离', '缥缈', '云雾缭绕'] },
      '荧光': { keywords: ['荧光', '荧光感', '夜光', '磷光', '发光', '荧光色', '荧光效果', '夜光材质', '荧光涂层', '冷光'] },
      '深邃': { keywords: ['深邃', '幽深', '深沉', '深不见底', '幽暗', '深邃感', '深黑', '幽邃', '神秘深邃', '深渊'] },
      '陶瓷': { keywords: ['陶瓷', '瓷质', '釉面', '瓷器', '陶瓷质感', '白瓷', '釉光', '瓷白', '陶瓷面', '瓷感'] },
      '玻璃': { keywords: ['玻璃', '玻璃质感', '透明玻璃', '玻璃面', '玻璃光', '玻璃材质', '玻璃感', '玻璃光泽', '玻璃面', '玻璃质感'] },
      '水晶': { keywords: ['水晶', '水晶质感', '水晶光', '晶莹剔透', '水晶面', '水晶光泽', '水晶材质', '水晶感', '水晶般', '水晶光泽'] },
      '玉石': { keywords: ['玉石', '玉质', '玉润', '玉感', '玉石质感', '玉色', '温润如玉', '玉面', '玉光泽', '玉质温润'] },
      '皮革': { keywords: ['皮革', '皮质', '皮面', '皮革质感', '真皮', '皮料', '皮革纹理', '皮质感', '皮面', '皮革材质'] },
      '帆布': { keywords: ['帆布', '布面', '粗布', '布料', '帆布质感', '布纹', '棉麻', '布面质感', '帆布材质', '布质'] },
      '磨砂': { keywords: ['磨砂', '磨砂面', '磨砂质感', '磨砂处理', '磨砂效果', '磨砂表面', '磨砂感', '磨砂工艺'] },
      '镜面': { keywords: ['镜面', '镜面效果', '镜面质感', '镜面抛光', '镜面反光', '镜面表面', '镜面光', '镜面处理'] },
      '哑光': { keywords: ['哑光', '哑光面', '哑光质感', '哑光效果', '哑光表面', '哑光处理', '哑光感', '哑光工艺'] },
      '颗粒': { keywords: ['颗粒', '颗粒感', '颗粒质感', '颗粒表面', '颗粒状', '颗粒纹理', '颗粒面', '颗粒效果'] },
      '金属光泽': { keywords: ['金属光泽', '金属光', '金属反光', '金属亮面', '金属质感光泽', '金属光辉', '金属闪光', '金属光泽面'] },
      '珠光': { keywords: ['珠光', '珠光感', '珠光质感', '珠光效果', '珠光面', '珠光色', '珠光光泽', '珠光涂层'] },
      '绸缎': { keywords: ['绸缎', '绸缎面', '绸缎质感', '绸缎光泽', '绸缎光', '绸缎效果', '绸缎表面', '绸缎柔光'] },
      '拉丝': { keywords: ['拉丝', '拉丝面', '拉丝质感', '拉丝纹理', '拉丝效果', '拉丝表面', '拉丝纹', '拉丝工艺'] },
      '磨砂玻璃': { keywords: ['磨砂玻璃', '磨砂玻璃面', '磨砂玻璃质感', '磨砂玻璃效果', '磨砂玻璃表面', '磨砂玻璃光', '磨砂玻璃纹', '磨砂玻璃工艺'] },
      '镜面抛光': { keywords: ['镜面抛光', '抛光镜面', '镜面抛光面', '镜面抛光质感', '镜面抛光效果', '镜面抛光表面', '镜面抛光光', '镜面抛光工艺'] },
      '磨砂质感': { keywords: ['磨砂质感', '磨砂质', '磨砂质感面', '磨砂质感效果', '磨砂质感表面', '磨砂质感光', '磨砂质感纹', '磨砂质感工艺'] },
      '颗粒质感': { keywords: ['颗粒质感', '颗粒质', '颗粒质感面', '颗粒质感效果', '颗粒质感表面', '颗粒质感光', '颗粒质感纹', '颗粒质感工艺'] },
      '光滑': { keywords: ['光滑', '光滑面', '光滑质感', '光滑表面', '光滑效果', '光滑细腻', '光滑亮面', '光滑触感'] },
      '粗糙质感': { keywords: ['粗糙质感', '粗糙质', '粗糙质感面', '粗糙质感效果', '粗糙质感表面', '粗糙质感光', '粗糙质感纹', '粗糙质感工艺'] },
      '细腻质感': { keywords: ['细腻质感', '细腻质', '细腻质感面', '细腻质感效果', '细腻质感表面', '细腻质感光', '细腻质感纹', '细腻质感工艺'] },
      '柔软': { keywords: ['柔软', '柔软面', '柔软质感', '柔软表面', '柔软效果', '柔软触感', '柔软材质', '柔软手感'] },
      '坚硬': { keywords: ['坚硬', '坚硬面', '坚硬质感', '坚硬表面', '坚硬效果', '坚硬触感', '坚硬材质', '坚硬手感'] },
      '冰冷': { keywords: ['冰冷', '冰冷面', '冰冷质感', '冰冷表面', '冰冷效果', '冰冷触感', '冰冷材质', '冰冷手感'] },
      '温热': { keywords: ['温热', '温热面', '温热质感', '温热表面', '温热效果', '温热触感', '温热材质', '温热手感'] },
      '粘腻': { keywords: ['粘腻', '粘腻面', '粘腻质感', '粘腻表面', '粘腻效果', '粘腻触感', '粘腻材质', '粘腻手感'] },
      '干爽': { keywords: ['干爽', '干爽面', '干爽质感', '干爽表面', '干爽效果', '干爽触感', '干爽材质', '干爽手感'] },
      '湿润': { keywords: ['湿润', '湿润面', '湿润质感', '湿润表面', '湿润效果', '湿润触感', '湿润材质', '湿润手感'] },
      '蓬松': { keywords: ['蓬松', '蓬松面', '蓬松质感', '蓬松表面', '蓬松效果', '蓬松触感', '蓬松材质', '蓬松手感'] },
      '顺滑': { keywords: ['顺滑', '顺滑面', '顺滑质感', '顺滑表面', '顺滑效果', '顺滑触感', '顺滑材质', '顺滑手感'] },
      '柔滑': { keywords: ['柔滑', '柔滑面', '柔滑质感', '柔滑表面', '柔滑效果', '柔滑触感', '柔滑材质', '柔滑手感'] },
      '反光': { keywords: ['反光', '反光面', '反光质感', '反光表面', '反光效果', '反光处理', '反光材质', '反光工艺'] },
      '哑光面': { keywords: ['哑光面', '哑光面质感', '哑光面效果', '哑光面表面', '哑光面处理', '哑光面光', '哑光面工艺', '哑光面材质'] },
      '磨砂面': { keywords: ['磨砂面', '磨砂面质感', '磨砂面效果', '磨砂面表面', '磨砂面处理', '磨砂面光', '磨砂面工艺', '磨砂面材质'] },
      '镜面感': { keywords: ['镜面感', '镜面感质感', '镜面感效果', '镜面感表面', '镜面感处理', '镜面感光', '镜面感工艺', '镜面感材质'] },
      '颗粒感': { keywords: ['颗粒感', '颗粒感质感', '颗粒感效果', '颗粒感表面', '颗粒感处理', '颗粒感光', '颗粒感工艺', '颗粒感材质'] },
      '光泽感': { keywords: ['光泽感', '光泽感质感', '光泽感效果', '光泽感表面', '光泽感处理', '光泽感光', '光泽感工艺', '光泽感材质'] },
      '哑光效果': { keywords: ['哑光效果', '哑光效果质感', '哑光效果表面', '哑光效果处理', '哑光效果光', '哑光效果工艺', '哑光效果材质', '哑光效果面'] },
      '磨砂效果': { keywords: ['磨砂效果', '磨砂效果质感', '磨砂效果表面', '磨砂效果处理', '磨砂效果光', '磨砂效果工艺', '磨砂效果材质', '磨砂效果面'] },
      '镜面效果': { keywords: ['镜面效果', '镜面效果质感', '镜面效果表面', '镜面效果处理', '镜面效果光', '镜面效果工艺', '镜面效果材质', '镜面效果面'] },
      '粗糙面': { keywords: ['粗糙面', '粗糙面质感', '粗糙面效果', '粗糙面表面', '粗糙面处理', '粗糙面光', '粗糙面工艺', '粗糙面材质'] },
      '光滑面': { keywords: ['光滑面', '光滑面质感', '光滑面效果', '光滑面表面', '光滑面处理', '光滑面光', '光滑面工艺', '光滑面材质'] }
    }
  },
  display: {
    name: '展示方式',
    categories: {
      '产品特写': { keywords: ['产品', '特写', '展示', '商品', '单品', '摆拍', '商业', '产品摄影', '电商', '白底', '精拍'] },
      '手持展示': { keywords: ['手持', '拿着', '握', '捧着', '托着', '举起', '手持展示', '手中'] },
      '悬浮展示': { keywords: ['悬浮', '漂浮', '悬空', '失重', '浮在空中', '飘在空中', '飘浮', '浮空', '腾空', '无重力'] },
      '场景融合': { keywords: ['场景融合', '融入', '环境中', '置于', '放在', '摆在', '放置在', '场景中的'] },
      '拆解展示': { keywords: ['拆解', '爆炸图', '分解', '拆开', '内部结构', '剖面', '零件', '组件', '构造', '解剖'] },
      '360展示': { keywords: ['旋转', '360', '多角度', '三视图', '环绕', '全方位', '转圈', '多面'] },
      '平铺展示': { keywords: ['平铺', '铺开', '摊开', '平放', '平摆', '铺展', '平铺展示', '摊平'] },
      '悬挂展示': { keywords: ['悬挂', '挂起', '吊挂', '悬吊', '挂在', '挂起来', '悬挂展示', '吊起'] },
      '对比展示': { keywords: ['对比', '对比展示', '对照', '并排对比', '对比图', '对比效果', '前后对比', '对比摆放'] },
      '局部特写': { keywords: ['局部', '特写', '局部特写', '细节特写', '局部放大', '特写镜头', '细节展示', '近距特写'] },
      '动态展示': { keywords: ['动态', '动态展示', '动态效果', '动图', '动态演示', '运动展示', '动态呈现', '动态画面'] },
      '透视展示': { keywords: ['透视', '透视展示', '透视效果', '透视结构', '透视内部', '透视看', '透视视角', '透视呈现'] },
      '俯拍展示': { keywords: ['俯拍', '俯视', '俯视角度', '从上往下', '俯视展示', '鸟瞰', '俯视视角', '高空俯拍', '俯瞰', '俯视构图'] },
      '仰拍展示': { keywords: ['仰拍', '仰视', '仰视角度', '从下往上', '仰视展示', '低角度', '仰拍视角', '仰望', '仰视构图', '向上拍'] },
      '侧拍展示': { keywords: ['侧拍', '侧面', '侧视', '侧面展示', '侧拍视角', '侧面角度', '侧视角度', '侧面构图', '侧影', '侧面拍摄'] },
      '背面展示': { keywords: ['背面', '背后', '背面展示', '背部', '背影', '背面视角', '后面', '背对镜头', '背面角度', '背后视角'] },
      '正面展示': { keywords: ['正面', '正面展示', '正对镜头', '正面视角', '正面角度', '正脸', '正面构图', '正面拍摄', '正视', '正对'] },
      '斜拍展示': { keywords: ['斜拍', '斜视', '斜角', '斜拍视角', '斜侧', '斜角度', '斜视构图', '倾斜视角', '斜侧拍摄', '斜向'] },
      '环绕展示': { keywords: ['环绕', '环绕拍摄', '环绕视角', '环绕镜头', '围绕', '环绕展示', '环绕运动', '环绕一周', '环绕运镜', '环绕角度'] },
      '静态展示': { keywords: ['静态', '静止', '静态展示', '静止画面', '定格', '静置', '静态呈现', '静止摆放', '静态构图', '不动'] },
      '全景展示': { keywords: ['全景', '全景展示', '全景视角', '全景图', '广角全景', '全景拍摄', '全景构图', '全景呈现', '全景镜头', '全景视野'] },
      '微距展示': { keywords: ['微距', '微距拍摄', '微距镜头', '微距特写', '近摄', '微距视角', '微距细节', '微距摄影', '放大细节', '微距构图'] },
      '剖面展示': { keywords: ['剖面', '剖面图', '剖面展示', '截面', '剖视', '剖面视角', '内部结构', '剖开', '剖面呈现', '剖面构图'] },
      '组装展示': { keywords: ['组装', '组装展示', '装配', '拼装', '组装过程', '装配过程', '组合', '组装步骤', '组装呈现', '拼合'] },
      '360旋转': { keywords: ['360旋转', '360度旋转', '旋转展示', '旋转拍摄', '旋转视角', '旋转一周', '360度展示', '旋转呈现'] },
      '旋转展示': { keywords: ['旋转展示', '旋转拍摄', '旋转视角', '旋转呈现', '旋转镜头', '旋转运镜', '旋转一周', '旋转效果'] },
      '漂浮展示': { keywords: ['漂浮展示', '漂浮', '飘浮', '漂浮呈现', '漂浮拍摄', '漂浮视角', '漂浮效果', '漂浮展示'] },
      '空中展示': { keywords: ['空中展示', '空中', '半空', '悬空展示', '空中呈现', '空中拍摄', '空中视角', '空中效果'] },
      '桌面展示': { keywords: ['桌面展示', '桌面', '桌上', '桌面呈现', '桌面拍摄', '桌面视角', '桌面效果', '桌面摆放'] },
      '展柜展示': { keywords: ['展柜展示', '展柜', '展示柜', '展柜呈现', '展柜拍摄', '展柜视角', '展柜效果', '展柜摆放'] },
      '展台展示': { keywords: ['展台展示', '展台', '展示台', '展台呈现', '展台拍摄', '展台视角', '展台效果', '展台摆放'] },
      '陈列展示': { keywords: ['陈列展示', '陈列', '陈列呈现', '陈列拍摄', '陈列视角', '陈列效果', '陈列摆放', '陈列架'] },
      '橱窗展示': { keywords: ['橱窗展示', '橱窗', '橱窗呈现', '橱窗拍摄', '橱窗视角', '橱窗效果', '橱窗摆放', '橱窗陈列'] },
      '模特展示': { keywords: ['模特展示', '模特', '模特佩戴', '模特呈现', '模特拍摄', '模特视角', '模特效果', '模特穿戴'] },
      '佩戴展示': { keywords: ['佩戴展示', '佩戴', '佩戴呈现', '佩戴拍摄', '佩戴视角', '佩戴效果', '佩戴穿戴', '佩戴上身'] },
      '使用场景展示': { keywords: ['使用场景展示', '使用场景', '使用展示', '使用呈现', '使用拍摄', '使用视角', '使用效果', '使用环境'] },
      '组合展示': { keywords: ['组合展示', '组合', '组合呈现', '组合拍摄', '组合视角', '组合效果', '组合摆放', '组合套装'] },
      '分层展示': { keywords: ['分层展示', '分层', '分层呈现', '分层拍摄', '分层视角', '分层效果', '分层结构', '分层摆放'] },
      '透视爆炸图': { keywords: ['透视爆炸图', '爆炸图', '透视分解', '爆炸分解', '透视呈现', '爆炸呈现', '透视结构图', '分解图'] },
      '细节放大': { keywords: ['细节放大', '放大细节', '细节呈现', '放大呈现', '细节拍摄', '放大拍摄', '细节效果', '放大效果'] },
      '局部放大': { keywords: ['局部放大', '放大局部', '局部呈现', '局部拍摄', '局部效果', '放大效果', '局部细节', '放大细节'] },
      '特写镜头': { keywords: ['特写镜头', '特写', '特写拍摄', '特写呈现', '特写视角', '特写效果', '特写画面', '特写构图'] },
      '慢动作展示': { keywords: ['慢动作展示', '慢动作', '慢速展示', '慢动作拍摄', '慢动作呈现', '慢动作视角', '慢动作效果', '慢动作画面'] },
      '定格展示': { keywords: ['定格展示', '定格', '定格拍摄', '定格呈现', '定格视角', '定格效果', '定格画面', '定格构图'] },
      '倒置展示': { keywords: ['倒置展示', '倒置', '倒放', '倒置呈现', '倒置拍摄', '倒置视角', '倒置效果', '倒置摆放'] },
      '倾斜展示': { keywords: ['倾斜展示', '倾斜', '倾斜拍摄', '倾斜呈现', '倾斜视角', '倾斜效果', '倾斜摆放', '倾斜角度'] },
      '错位展示': { keywords: ['错位展示', '错位', '错位呈现', '错位拍摄', '错位视角', '错位效果', '错位摆放', '错位构图'] },
      '堆叠展示': { keywords: ['堆叠展示', '堆叠', '叠放', '堆叠呈现', '堆叠拍摄', '堆叠视角', '堆叠效果', '堆叠摆放'] }
    }
  },
  background: {
    name: '背景',
    categories: {
      '纯色背景': { keywords: ['纯色', '白底', '黑底', '纯黑', '纯白', '红色背景', '蓝色背景', '单色', '干净背景', '无背景'] },
      '渐变背景': { keywords: ['渐变', '渐变色', '光晕', '柔光背景', '渐变光', '色彩过渡', '辐射渐变'] },
      '纹理背景': { keywords: ['纹理', '大理石纹', '木纹', '布纹', '纸纹', '石纹', '格纹', '斑驳', '裂纹', '纹理背景'] },
      '虚化背景': { keywords: ['虚化', '模糊', '景深', 'bokeh', '散景', '浅景深', '背景虚化', '焦外'] },
      '场景背景': { keywords: ['场景', '环境', '自然', '森林', '天空', '海', '山', '城市', '室内', '户外', '野'] },
      '暗调背景': { keywords: ['暗调', '暗色', '深色', '黑色', '暗背景', '低调', '暗黑', '昏暗', '黑暗'] },
      '魔法能量场': { keywords: ['魔法能量场', '能量场', '魔力场', '魔法结界', '力场', '魔法圈', '光环', '魔法阵', '能量罩', '能量场', '结界'] },
      '异次元空间': { keywords: ['异次元', '次元', '异空间', '维度', '空间裂缝', '传送门', '时空', '异世界', '次元裂缝', '空间裂隙', '异度'] },
      '元素环境': { keywords: ['元素环境', '元素', '火元素', '水元素', '风元素', '土元素', '元素场', '元素空间', '元素领域', '元素位面', '元素界'] },
      '星空背景': { keywords: ['星空', '星空背景', '满天星', '星海', '星河', '繁星', '夜空星星', '星云', '星空夜景'] },
      '城市夜景': { keywords: ['城市夜景', '城市夜晚', '都市夜景', '夜景城市', '城市霓虹', '夜晚城市', '都市夜晚', '城市灯光'] },
      '森林背景': { keywords: ['森林', '森林背景', '树林', '丛林', '密林', '森林深处', '林间', '森林环境', '树林背景'] },
      '海洋背景': { keywords: ['海洋', '海洋背景', '大海', '海面', '深海', '海底', '海浪', '海洋环境', '大海背景'] },
      '沙漠背景': { keywords: ['沙漠', '沙漠背景', '沙丘', '荒漠', '黄沙', '沙海', '沙漠环境', '戈壁', '沙漠风光'] },
      '雪山背景': { keywords: ['雪山', '雪山背景', '雪峰', '雪山之巅', '皑皑白雪', '雪山环境', '雪岭', '雪山风光'] },
      '火焰背景': { keywords: ['火焰', '火焰背景', '火海', '烈焰', '火墙', '火焰环境', '熊熊烈火', '火焰燃烧'] },
      '冰霜背景': { keywords: ['冰霜', '冰霜背景', '冰面', '寒冰', '冰封', '冰霜环境', '冰雪背景', '冰晶背景'] },
      '科技背景': { keywords: ['科技', '科技背景', '未来科技', '数字科技', '科技感', '科技环境', '科技氛围', '高科技背景'] },
      '银河背景': { keywords: ['银河', '银河背景', '银河系', '星河', '银河光带', '银河拱桥', '银河星空', '银河夜景', '璀璨银河', '银河横跨'] },
      '极光背景': { keywords: ['极光', '极光背景', '北极光', '南极光', '极光带', '极光夜空', '绿色极光', '彩色极光', '极光舞动', '极光天空'] },
      '云海背景': { keywords: ['云海', '云海背景', '云层', '云涛', '云浪', '云海翻涌', '云海日出', '云上', '云海之巅', '云海仙境'] },
      '日出背景': { keywords: ['日出', '日出背景', '朝阳', '旭日', '晨曦', '日出金光', '日出东方', '朝霞', '日出地平线', '日出霞光'] },
      '日落背景': { keywords: ['日落', '日落背景', '夕阳', '落日', '晚霞', '日落余晖', '夕阳西下', '日落霞光', '落日余晖', '黄昏日落'] },
      '黄昏背景': { keywords: ['黄昏', '黄昏背景', '暮色', '傍晚', '黄昏时分', '暮光', '黄昏天空', '黄昏光线', '黄昏氛围', '暮色苍茫'] },
      '黎明背景': { keywords: ['黎明', '黎明背景', '拂晓', '破晓', '清晨', '黎明时分', '曙光', '黎明光线', '晨曦微露', '黎明天空'] },
      '夜晚背景': { keywords: ['夜晚', '夜晚背景', '黑夜', '深夜', '夜空', '夜晚天空', '夜晚氛围', '夜色', '月夜', '夜晚星空'] },
      '城市背景': { keywords: ['城市', '城市背景', '都市', '城市天际线', '城市风光', '高楼大厦', '城市街景', '都市风光', '城市环境', '城市全景'] },
      '乡村背景': { keywords: ['乡村', '乡村背景', '田园', '村庄', '乡村风光', '田野', '农家', '乡村环境', '田园风光', '乡村景色'] },
      '草原背景': { keywords: ['草原', '草原背景', '草地', '大草原', '绿草', '草原风光', '草原环境', '广袤草原', '草原景色', '青草'] },
      '花海背景': { keywords: ['花海', '花海背景', '花田', '花丛', '繁花', '花海风光', '鲜花盛开', '花海环境', '漫山花海', '花海景色'] },
      '麦田背景': { keywords: ['麦田', '麦田背景', '麦浪', '麦地', '金色麦田', '麦田风光', '麦穗', '麦田环境', '丰收麦田', '麦田景色'] },
      '樱花背景': { keywords: ['樱花', '樱花背景', '樱花树', '樱花瓣', '樱花盛开', '樱花林', '粉色樱花', '樱花飘落', '樱花大道', '樱花景色'] },
      '枫叶背景': { keywords: ['枫叶', '枫叶背景', '红枫', '枫林', '红叶', '枫叶飘落', '枫叶林', '秋枫', '红色枫叶', '枫叶景色'] },
      '火山背景': { keywords: ['火山', '火山背景', '火山喷发', '火山口', '火山熔岩', '火山环境', '火山岩', '火山灰', '活火山', '火山风光'] },
      '洞穴背景': { keywords: ['洞穴', '洞穴背景', '山洞', '岩洞', '溶洞', '洞穴环境', '钟乳石', '洞窟', '地下洞穴', '洞穴深处'] },
      '太空背景': { keywords: ['太空', '太空背景', '外太空', '宇宙空间', '太空环境', '太空站', '太空景色', '深空', '太空旅行', '太空场景'] },
      '星空': { keywords: ['星空', '星空背景', '满天星', '星海', '星河', '繁星', '星空夜景', '星云'] },
      '银河': { keywords: ['银河', '银河背景', '银河系', '星河', '银河光带', '银河拱桥', '银河星空', '银河夜景'] },
      '极光': { keywords: ['极光', '极光背景', '北极光', '南极光', '极光带', '极光夜空', '绿色极光', '彩色极光'] },
      '云海': { keywords: ['云海', '云海背景', '云层', '云涛', '云浪', '云海翻涌', '云海日出', '云上'] },
      '日出': { keywords: ['日出', '日出背景', '朝阳', '旭日', '晨曦', '日出金光', '日出东方', '朝霞'] },
      '日落': { keywords: ['日落', '日落背景', '夕阳', '落日', '晚霞', '日落余晖', '夕阳西下', '日落霞光'] },
      '黄昏': { keywords: ['黄昏', '黄昏背景', '暮色', '傍晚', '黄昏时分', '暮光', '黄昏天空', '黄昏光线'] },
      '黎明': { keywords: ['黎明', '黎明背景', '拂晓', '破晓', '清晨', '黎明时分', '曙光', '黎明光线'] },
      '夜晚': { keywords: ['夜晚', '夜晚背景', '黑夜', '深夜', '夜空', '夜晚天空', '夜晚氛围', '夜色'] },
      '城市': { keywords: ['城市', '城市背景', '都市', '城市天际线', '城市风光', '高楼大厦', '城市街景', '都市风光'] },
      '乡村': { keywords: ['乡村', '乡村背景', '田园', '村庄', '乡村风光', '田野', '农家', '乡村环境'] },
      '草原': { keywords: ['草原', '草原背景', '草地', '大草原', '绿草', '草原风光', '草原环境', '广袤草原'] },
      '花海': { keywords: ['花海', '花海背景', '花田', '花丛', '繁花', '花海风光', '鲜花盛开', '花海环境'] },
      '麦田': { keywords: ['麦田', '麦田背景', '麦浪', '麦地', '金色麦田', '麦田风光', '麦穗', '麦田环境'] },
      '樱花': { keywords: ['樱花', '樱花背景', '樱花树', '樱花瓣', '樱花盛开', '樱花林', '粉色樱花', '樱花飘落'] },
      '枫叶': { keywords: ['枫叶', '枫叶背景', '红枫', '枫林', '红叶', '枫叶飘落', '枫叶林', '秋枫'] },
      '火山': { keywords: ['火山', '火山背景', '火山喷发', '火山口', '火山熔岩', '火山环境', '火山岩', '火山灰'] },
      '洞穴': { keywords: ['洞穴', '洞穴背景', '山洞', '岩洞', '溶洞', '洞穴环境', '钟乳石', '洞窟'] },
      '太空': { keywords: ['太空', '太空背景', '外太空', '宇宙空间', '太空环境', '太空站', '太空景色', '深空'] },
      '海洋': { keywords: ['海洋', '海洋背景', '大海', '海面', '深海', '海底', '海浪', '海洋环境'] },
      '沙漠': { keywords: ['沙漠', '沙漠背景', '沙丘', '荒漠', '黄沙', '沙海', '沙漠环境', '戈壁'] },
      '雪山': { keywords: ['雪山', '雪山背景', '雪峰', '雪山之巅', '皑皑白雪', '雪山环境', '雪岭', '雪山风光'] },
      '森林': { keywords: ['森林', '森林背景', '树林', '丛林', '密林', '森林深处', '林间', '森林环境'] },
      '火焰': { keywords: ['火焰', '火焰背景', '火海', '烈焰', '火墙', '火焰环境', '熊熊烈火', '火焰燃烧'] },
      '冰霜': { keywords: ['冰霜', '冰霜背景', '冰面', '寒冰', '冰封', '冰霜环境', '冰雪背景', '冰晶背景'] },
      '科技': { keywords: ['科技', '科技背景', '未来科技', '数字科技', '科技感', '科技环境', '科技氛围', '高科技背景'] },
      '魔法': { keywords: ['魔法', '魔法背景', '魔法阵', '魔法光', '魔法能量', '魔法环境', '魔法氛围', '魔法结界'] },
      '山峦': { keywords: ['山峦', '山峦背景', '群山', '山峰', '山脉', '山峦风光', '远山', '山峦环境'] },
      '湖泊': { keywords: ['湖泊', '湖泊背景', '湖面', '湖水', '湖畔', '湖泊风光', '湖景', '湖泊环境'] },
      '瀑布': { keywords: ['瀑布', '瀑布背景', '飞瀑', '瀑布水帘', '瀑布风光', '瀑布环境', '瀑布景观', '瀑布水流'] },
      '竹林': { keywords: ['竹林', '竹林背景', '竹海', '竹子', '竹林风光', '竹林环境', '竹影', '竹林景观'] },
      '梯田': { keywords: ['梯田', '梯田背景', '梯田风光', '梯田环境', '梯田景观', '层层梯田', '梯田山景', '梯田水田'] },
      '荷塘': { keywords: ['荷塘', '荷塘背景', '荷花', '荷叶', '荷塘月色', '荷塘风光', '荷塘环境', '荷塘景观'] },
      '芦苇': { keywords: ['芦苇', '芦苇背景', '芦苇荡', '芦苇丛', '芦苇风光', '芦苇环境', '芦苇景观', '芦苇摇曳'] },
      '稻田': { keywords: ['稻田', '稻田背景', '稻田风光', '稻田环境', '稻田景观', '水稻田', '金色稻田', '稻田水田'] },
      '茶园': { keywords: ['茶园', '茶园背景', '茶山', '茶树', '茶园风光', '茶园环境', '茶园景观', '茶园梯田'] }
    }
  }
};

// ===== MERGE TRANSLATIONS INTO KW_DB =====
(function mergeTranslations() {
  if (!window.translations) return;
  const t = window.translations;

  // Merge character translations
  if (t.roles && KW_DB.character) {
    for (const [key, val] of Object.entries(t.roles)) {
      if (KW_DB.character.categories[key]) {
        KW_DB.character.categories[key].zh = val.zh;
      }
    }
  }

  // Merge style translations
  if (t.styles && KW_DB.style) {
    for (const [key, val] of Object.entries(t.styles)) {
      if (KW_DB.style.categories[key]) {
        KW_DB.style.categories[key].zh = val.zh;
      }
    }
  }

  // Merge scene translations
  if (t.scenes && KW_DB.scene) {
    for (const [key, val] of Object.entries(t.scenes)) {
      if (KW_DB.scene.categories[key]) {
        KW_DB.scene.categories[key].zh = val.zh;
      }
    }
  }

  // Merge lighting translations
  if (t.lights && KW_DB.lighting) {
    for (const [key, val] of Object.entries(t.lights)) {
      if (KW_DB.lighting.categories[key]) {
        KW_DB.lighting.categories[key].zh = val.zh;
      }
    }
  }

  // Merge composition translations
  if (t.compositions && KW_DB.composition) {
    for (const [key, val] of Object.entries(t.compositions)) {
      if (KW_DB.composition.categories[key]) {
        KW_DB.composition.categories[key].zh = val.zh;
      }
    }
  }

  // Merge color translations
  if (t.colors && KW_DB.color) {
    for (const [key, val] of Object.entries(t.colors)) {
      if (KW_DB.color.categories[key]) {
        KW_DB.color.categories[key].zh = val.zh;
      }
    }
  }

  // Merge atmosphere translations
  if (t.atmosphere && KW_DB.atmosphere) {
    for (const [key, val] of Object.entries(t.atmosphere)) {
      if (KW_DB.atmosphere.categories[key]) {
        KW_DB.atmosphere.categories[key].zh = val.zh;
      }
    }
  }

  // Merge quality translations
  if (t.quality && KW_DB.quality) {
    for (const [key, val] of Object.entries(t.quality)) {
      if (KW_DB.quality.categories[key]) {
        KW_DB.quality.categories[key].zh = val.zh;
      }
    }
  }

  // Merge gender translations
  if (t.gender && KW_DB.gender) {
    for (const [key, val] of Object.entries(t.gender)) {
      if (KW_DB.gender.categories[key]) {
        KW_DB.gender.categories[key].zh = val.zh;
      }
    }
  }

  // Merge material translations
  if (t.material && KW_DB.material) {
    for (const [key, val] of Object.entries(t.material)) {
      if (KW_DB.material.categories[key]) {
        KW_DB.material.categories[key].zh = val.zh;
      }
    }
  }

  // Merge texture translations
  if (t.texture && KW_DB.texture) {
    for (const [key, val] of Object.entries(t.texture)) {
      if (KW_DB.texture.categories[key]) {
        KW_DB.texture.categories[key].zh = val.zh;
      }
    }
  }

  // Merge background translations
  if (t.background && KW_DB.background) {
    for (const [key, val] of Object.entries(t.background)) {
      if (KW_DB.background.categories[key]) {
        KW_DB.background.categories[key].zh = val.zh;
      }
    }
  }
})();
