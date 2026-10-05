# Open Questions

Answer these before the first serious implementation pass. Short answers are fine.

1. **Scope:** Is this first build only the interactive hero/product selector, or should it become the full WAVE storefront/homepage from the start?

2. **Product count:** How many perfumes should be on the rail in version 1? Please give the names if they are already fixed.

3. **Bottle assets:** Do all fragrances use the exact same bottle shape with only the label/artwork changing, or are there different bottle shapes/caps?

4. **3D fidelity:** Do you want a true 3D bottle model that can rotate with realistic glass/gold reflections, or should we first prototype with high-quality cutout images and fake depth for speed?

5. **Selection behavior:** After clicking a perfume, which direction do you prefer?
   - A) bottle flies forward and the rail stays behind it;
   - B) the whole scene transitions into a dedicated product world;
   - C) bottle flies forward, notes orbit around it, then a compact product panel appears.

6. **Navigation feel:** Should moving through perfumes be:
   - free drag with inertia,
   - snap one perfume at a time,
   - or free drag that magnetically snaps to the nearest bottle when released?

7. **Brand style:** Should this experience keep the current black + gold WAVE visual language, or are we intentionally moving to a new website identity?

8. **Product information:** What must appear after selection in v1: name, inspiration, notes, price, size, quantity, add to cart, reviews, anything else?

9. **Commerce:** Is v1 visual only, or should Add to Cart / checkout be connected immediately? If connected, what backend/store system are we targeting?

10. **Tech preference:** Do you want the project built with Next.js + React Three Fiber + GSAP, or should we keep the stack as lean as possible until the interaction is approved?

11. **Reference target:** Should we try to stay visually close to the hanging-clothes demo structure, or use only its interaction idea and make the WAVE scene completely original?

12. **Performance target:** Which devices matter most for launch—modern iPhone/Android first, desktop first, or equal priority?
